"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

interface UserItem {
  id: string;
  name: string;
  email: string;
  country: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { bookings: number; reviews: number };
}

const roleColors: Record<string, string> = {
  USER: "bg-blue-100 text-blue-800",
  GUIDE: "bg-purple-100 text-purple-800",
  ADMIN: "bg-amber-100 text-amber-800",
  SUPER_ADMIN: "bg-red-100 text-red-800",
};

export default function AdminUsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async (searchQuery = "", role = "") => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ limit: "50" });
      if (searchQuery) params.set("search", searchQuery);
      if (role) params.set("role", role);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchUsers(value, roleFilter);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    fetchUsers(search, role);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) fetchUsers(search, roleFilter);
    } catch (err) {
      console.error("Update user error:", err);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, isActive: !isActive }),
      });
      const data = await res.json();
      if (data.success) fetchUsers(search, roleFilter);
    } catch (err) {
      console.error("Toggle user error:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.usersManagement}</h1>
          <p className="text-gray-500 mt-1">{users.length} {t.admin.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder={t.common.searchUsers}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <div className="flex gap-2">
            {["", "USER", "GUIDE", "ADMIN", "SUPER_ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleFilter(role)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${roleFilter === role ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {role || t.common.all}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">{t.common.loading}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">{t.common.user}</th>
                  <th className="px-6 py-3">{t.common.country}</th>
                  <th className="px-6 py-3">{t.common.type}</th>
                  <th className="px-6 py-3">{t.common.bookings}</th>
                  <th className="px-6 py-3">{t.common.joined}</th>
                  <th className="px-6 py-3">{t.common.status}</th>
                  <th className="px-6 py-3">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm">{user.name?.charAt(0) || "?"}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.country || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 ${roleColors[user.role] || "bg-gray-100 text-gray-800"} cursor-pointer`}
                      >
                        <option value="USER">USER</option>
                        <option value="GUIDE">GUIDE</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user._count?.bookings || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {user.isActive ? t.common.active : t.common.inactive}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingUser(user); setShowModal(true); }}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">{t.admin.noUsers || "No users found"}</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t.common.user}: {editingUser.name}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">{t.common.email}</span><span className="font-medium">{editingUser.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t.common.country}</span><span className="font-medium">{editingUser.country || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t.common.phone}</span><span className="font-medium">{editingUser.phone || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t.common.type}</span><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[editingUser.role]}`}>{editingUser.role}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t.common.bookings}</span><span className="font-medium">{editingUser._count?.bookings || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t.common.joined}</span><span className="font-medium">{new Date(editingUser.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
