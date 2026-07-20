import React, { useEffect, useRef, useState } from "react";
import { ref, update, remove } from "firebase/database";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { z } from "zod";
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
  EyeOff,
  Eye,
} from "lucide-react";
import profilePlaceholder from "../assets/profilePlaceholder.png";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//zod schema for changePassword form fields
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

//zod schema for deleteAccount password field
const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;

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

  //initialize hook form for changing password
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });

  //initialize hoook form for deleting account
  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    reset: resetDelete,
    formState: { errors: deleteErrors, isSubmitting: deleting },
  } = useForm<DeleteAccountForm>({
    resolver: zodResolver(deleteAccountSchema),
  });
  const userProfile = useAppSelector((state) => state.auth.userProfile);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const [changePasswordError, setChangePasswordError] = useState("");

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteError, setDeleteError] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (key: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
      </div>
    );
  }

  //handling account deletion
  const handleDeleteAccount = async (data: DeleteAccountForm) => {
    setDeleteError("");

    try {
      const user = auth.currentUser;

      if (!user?.email) {
        throw new Error("User is not signed in.");
      }

      // Reauthenticate
      const credential = EmailAuthProvider.credential(
        user.email,
        data.password,
      );

      await reauthenticateWithCredential(user, credential);

      // Delete user's data
      await remove(ref(db, `tasks/${user.uid}`));
      await remove(ref(db, `users/${user.uid}`));
      // Delete Firebase Auth account
      await deleteUser(user);
      resetDelete();
      navigate("/login");
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    }
  };

  //handling profile field update
  const saveField = async (field: "name" | "title" | "bio", value: string) => {
    await update(ref(db, `users/${userProfile.uid}`), { [field]: value });
    dispatch(setProfile({ ...userProfile, [field]: value }));
  };

  //handling profile photo update
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

  //handle firebase errros and translate to user friendly messages
  function getErrorMessage(err: unknown): string {
    if (!(err instanceof FirebaseError)) {
      return "Something went wrong. Please try again.";
    }

    switch (err.code) {
      case "auth/invalid-credential":
        return "Current password is incorrect.";

      case "auth/wrong-password":
        return "Current password is incorrect.";

      case "auth/weak-password":
        return "Your new password is too weak.";

      case "auth/requires-recent-login":
        return "Please sign in again and try changing your password.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/network-request-failed":
        return "Network error. Check your internet connection.";

      default:
        return err.message || "Something went wrong.";
    }
  }

  //handling password change
  const handleNewPassword = async (data: ChangePasswordForm) => {
    setChangePasswordError("");

    try {
      const user = auth.currentUser;

      if (!user?.email) {
        throw new Error("User is not signed in.");
      }
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword,
      );

      // Verify current password
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPassword);

      reset();
      setChangePasswordError("");
      setPasswordDialogOpen(false);
    } catch (err) {
      setChangePasswordError(getErrorMessage(err));
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
        <div className="mt-10 pt-8 border-t border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Security</h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep your account secure by updating your password regularly.
          </p>

          <button
            onClick={() => {
              resetDelete();
              setChangePasswordError("");
              setPasswordDialogOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50"
          >
            Change password
          </button>
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

      {/* dialog for deleting account */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This permanently deletes your account and all associated data,
                including your profile and tasks. This action cannot be undone.
              </p>
            </div>

            {/* Body */}
            <form
              onSubmit={handleDeleteSubmit(handleDeleteAccount)}
              className="space-y-5 p-6"
            >
              <div>
                <label
                  htmlFor="deletePassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="deletePassword"
                    type={showDeletePassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...registerDelete("password")}
                    className={`w-full rounded-lg border px-3 py-2.5 pr-11 outline-none transition
              ${
                deleteErrors.password
                  ? "border-red-500"
                  : "border-slate-300 focus:border-red-500"
              }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowDeletePassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showDeletePassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {deleteErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {deleteErrors.password.message}
                  </p>
                )}
              </div>

              {deleteError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setDeleteError("");
                    setDeleteDialogOpen(false);
                  }}
                  disabled={deleting}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* dialog for changing password change */}
      {passwordDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Change password
                </h2>

                <button
                  onClick={() => {
                    reset();
                    setChangePasswordError("");
                    setPasswordDialogOpen(false);
                  }}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Enter your current password and choose a new one.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleNewPassword)}
              className="space-y-5 p-6"
            >
              {/* Current Password */}

              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Current password
                </label>

                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    placeholder="Current password"
                    {...register("currentPassword")}
                    className={`w-full rounded-lg border px-3 py-2.5 pr-11 outline-none transition
        ${
          errors.currentPassword
            ? "border-red-500"
            : "border-slate-300 focus:border-orange-500"
        }`}
                  />

                  <button
                    type="button"
                    onClick={() => togglePassword("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    placeholder="New password"
                    {...register("newPassword")}
                    className={`w-full rounded-lg border px-3 py-2.5 pr-11 outline-none transition
        ${
          errors.newPassword
            ? "border-red-500"
            : "border-slate-300 focus:border-orange-500"
        }`}
                  />

                  <button
                    type="button"
                    onClick={() => togglePassword("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword")}
                    className={`w-full rounded-lg border px-3 py-2.5 pr-11 outline-none transition
        ${
          errors.confirmPassword
            ? "border-red-500"
            : "border-slate-300 focus:border-orange-500"
        }`}
                  />

                  <button
                    type="button"
                    onClick={() => togglePassword("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {changePasswordError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {changePasswordError}
                </div>
              )}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setChangePasswordError("");
                    setPasswordDialogOpen(false);
                  }}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
