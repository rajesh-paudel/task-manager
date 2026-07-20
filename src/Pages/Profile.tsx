import React, { useEffect, useRef, useState } from "react";
import { ref, update, remove } from "firebase/database";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { uploadImageToCloudinary } from "../utils/cloudinary.";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setProfile } from "../store/authSlice";
import {
  Camera,
  Pencil,
  Loader2,
  Check,
  X,
  Mail,
  CalendarDays,
} from "lucide-react";
import profilePlaceholder from "../assets/profilePlaceholder.png";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

function useEditableField(
  initialValue: string,
  onSave: (value: string) => Promise<void>,
) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) setValue(initialValue);
  }, [initialValue, editing]);

  const start = () => {
    setValue(initialValue);
    setError("");
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError("");
  };

  const commit = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(value.trim());
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return { editing, value, setValue, saving, error, start, cancel, commit };
}

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}

function EditableField({
  label,
  value,
  onSave,
  placeholder,
  multiline,
  required,
}: EditableFieldProps) {
  const field = useEditableField(value, async (v) => {
    if (required && !v) throw new Error(`${label} can't be empty.`);
    await onSave(v);
  });

  return (
    <div className="py-5 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </p>

        {field.editing ? (
          multiline ? (
            <textarea
              autoFocus
              rows={3}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => e.key === "Escape" && field.cancel()}
              className="mt-1.5 w-full px-0 py-1 border-0 border-b border-slate-900 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent resize-none"
            />
          ) : (
            <input
              autoFocus
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") field.commit();
                if (e.key === "Escape") field.cancel();
              }}
              className="mt-1.5 w-full px-0 py-1 border-0 border-b border-slate-900 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          )
        ) : (
          <p className="mt-1 text-sm text-slate-900 leading-relaxed">
            {value || <span className="text-slate-400">Not set</span>}
          </p>
        )}

        {field.error && (
          <p className="mt-1.5 text-xs text-red-600">{field.error}</p>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-1 mt-5">
        {field.editing ? (
          <>
            <button
              onClick={field.commit}
              disabled={field.saving}
              className="h-7 w-7 flex items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
              aria-label={`Save ${label}`}
            >
              {field.saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={field.cancel}
              disabled={field.saving}
              className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              aria-label={`Cancel editing ${label}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={field.start}
            className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userProfile = useAppSelector((state) => state.auth.userProfile);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [needsReauth, setNeedsReauth] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const performDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await remove(ref(db, `tasks/${user.uid}`));
    await remove(ref(db, `users/${user.uid}`));
    await deleteUser(user);

    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await performDelete();
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        setNeedsReauth(true);
      } else {
        setDeleteError(err.message || "Couldn't delete account. Try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleReauthAndDelete = async () => {
    const user = auth.currentUser;
    if (!user?.email) return;

    setDeleting(true);
    setDeleteError("");
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        reauthPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await performDelete();
    } catch (err: any) {
      setDeleteError(err.message || "Incorrect password.");
    } finally {
      setDeleting(false);
    }
  };

  const saveField = async (field: "name" | "title" | "bio", value: string) => {
    await update(ref(db, `users/${userProfile.uid}`), { [field]: value });
    dispatch(setProfile({ ...userProfile, [field]: value }));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be under 5MB.");
      return;
    }

    setUploadingPhoto(true);
    setPhotoError("");
    try {
      const url = await uploadImageToCloudinary(file);
      await update(ref(db, `users/${userProfile.uid}`), { profileUrl: url });
      dispatch(setProfile({ ...userProfile, profileUrl: url }));
    } catch (err: any) {
      setPhotoError(err.message || "Upload failed. Try again.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const memberSince = new Date(userProfile.createdAt).toLocaleDateString(
    undefined,
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>Profile | TaskPulse </title>
        <meta
          name="description"
          content="TaskPulse is a modern task management platform to organize projects, track progress, and boost productivity."
        />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information.
        </p>

        {/* Identity header */}
        <div className="mt-8 flex items-start gap-5 pb-8 border-b border-slate-100">
          <div className="relative shrink-0">
            <div className="h-24 w-24 rounded-full bg-slate-100 overflow-hidden">
              <img
                src={userProfile.profileUrl || profilePlaceholder}
                alt={userProfile.name}
                className="h-full w-full object-cover"
              />
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center border-2 border-white disabled:opacity-50"
              aria-label="Change profile photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>

          <div className="pt-1 min-w-0">
            <p className="text-lg flex items-center justify-start gap-2 font-semibold text-slate-900 truncate">
              {userProfile.name}
              {userProfile.role == "admin" && (
                <span
                  className={`shrink-0   text-[11px] pb-1 font-medium px-2 py-0.5 rounded-full  bg-orange-50 text-orange-600`}
                >
                  {userProfile.role}
                </span>
              )}
            </p>
            <p className="text-sm text-slate-500">
              {userProfile.title || "No title set"}
            </p>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                Member since {memberSince}
              </div>
            </div>

            {photoError && (
              <p className="mt-2 text-xs text-red-600">{photoError}</p>
            )}
          </div>
        </div>

        {/* Individually editable fields */}
        <div className="divide-y divide-slate-100">
          <EditableField
            label="Name"
            value={userProfile.name}
            required
            onSave={(v) => saveField("name", v)}
          />
          <EditableField
            label="Title"
            value={userProfile.title}
            placeholder="e.g. Product Designer"
            onSave={(v) => saveField("title", v)}
          />
          <EditableField
            label="Bio"
            value={userProfile.bio}
            placeholder="A short line about yourself"
            multiline
            onSave={(v) => saveField("bio", v)}
          />
        </div>
        <div className="mt-10 pt-8 border-t border-red-100">
          <h2 className="text-sm font-semibold text-red-600">Danger zone</h2>
          <p className="mt-1 text-sm text-slate-500">
            Deleting your account permanently removes your profile and all
            tasks. This can't be undone.
          </p>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50"
          >
            Delete account
          </button>
        </div>
      </div>
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 border-t-4 border-red-500">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete your account?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              This permanently deletes your account and all tasks. Type your
              email (<span className="font-medium">{userProfile.email}</span>)
              to confirm.
            </p>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={userProfile.email}
              className="mt-4 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
            />

            {needsReauth && (
              <input
                type="password"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                placeholder="Confirm your password"
                className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
              />
            )}

            {deleteError && (
              <p className="mt-3 text-sm text-red-600">{deleteError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setConfirmText("");
                  setNeedsReauth(false);
                  setDeleteError("");
                }}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={
                  needsReauth ? handleReauthAndDelete : handleDeleteAccount
                }
                disabled={confirmText !== userProfile.email || deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
