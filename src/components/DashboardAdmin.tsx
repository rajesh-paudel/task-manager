import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "../utils/firebaseConfig";
import { useAppSelector } from "../store/store";
import {
  Users,
  Mail,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { UserProfile } from "../types/user";
import profilePlaceholder from "../assets/profilePlaceholder.png";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardAdmin() {
  const currentUserId = useAppSelector((state) => state.auth.userProfile?.uid);

  const [activeTab, setActiveTab] = useState<"users" | "messages">("users");

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState("");
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(
    null,
  );

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const snapshot = await get(ref(db, "users"));
      const data = snapshot.val() || {};
      const list: UserProfile[] = Object.values(data);
      list.sort((a, b) => b.createdAt - a.createdAt);
      setUsers(list);
    } catch (err: any) {
      setUsersError(err.message || "Couldn't load users.");
      console.log(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    setMessagesError("");
    try {
      const snapshot = await get(ref(db, "forms"));
      const data = snapshot.val() || {};
      const list: ContactMessage[] = Object.entries(data).map(
        ([id, value]) => ({
          id,
          ...(value as Omit<ContactMessage, "id">),
        }),
      );
      list.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(list);
    } catch (err: any) {
      setMessagesError(err.message || "Couldn't load messages.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteMessage = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    try {
      await remove(ref(db, `forms/${id}`));

      setMessages((prev) => {
        return prev.filter((msg) => msg.id !== id);
      });
    } catch (error: any) {
      setMessagesError(error.message || "Failed to delete message.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-orange-600" />
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Admin
        </h1>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Manage registered users and view contact form submissions.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
              activeTab === "users"
                ? "bg-orange-50 text-orange-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users className="h-4 w-4" />
            Users
            <span className="text-xs text-slate-400">{users.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
              activeTab === "messages"
                ? "bg-orange-50 text-orange-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Mail className="h-4 w-4" />
            Messages
            <span className="text-xs text-slate-400">{messages.length}</span>
          </button>
        </div>

        <button
          onClick={() =>
            activeTab === "users" ? fetchUsers() : fetchMessages()
          }
          disabled={activeTab === "users" ? usersLoading : messagesLoading}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              (activeTab === "users" ? usersLoading : messagesLoading)
                ? "animate-spin"
                : ""
            }`}
          />
        </button>
      </div>

      {activeTab === "users" && (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {usersLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
            </div>
          ) : usersError ? (
            <p className="py-12 text-center text-sm text-red-600 px-6">
              {usersError}
            </p>
          ) : users.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              No users found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <img
                    src={user.profileUrl || profilePlaceholder}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.name}
                      {user.uid === currentUserId && (
                        <span className="ml-2 text-xs text-slate-400">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      user.role === "admin"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {user.role}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400 w-20 text-right">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {messagesLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
            </div>
          ) : messagesError ? (
            <p className="py-12 text-center text-sm text-red-600 px-6">
              {messagesError}
            </p>
          ) : messages.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              No messages yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((msg) => {
                const isExpanded = expandedMessageId === msg.id;
                return (
                  <div key={msg.id} className="px-4 py-3">
                    <button
                      onClick={() =>
                        setExpandedMessageId(isExpanded ? null : msg.id)
                      }
                      className="w-full flex items-center gap-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {msg.subject}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {msg.name} · {msg.email}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatDate(msg.createdAt)}
                      </span>
                      <Trash2
                        onClick={(e) => handleDeleteMessage(e, msg.id)}
                        className="text-red-500 hover:bg-red-100 p-1 cursor-pointer"
                        size={20}
                      ></Trash2>
                    </button>
                    {isExpanded && (
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {msg.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
