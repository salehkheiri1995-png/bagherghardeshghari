"use client";

import { useI18n } from "@/context/I18nContext";

const users = [
  { id: "1", name: "John Smith", email: "john@example.com", country: "USA", role: "USER", bookings: 3, status: "active", joined: "2024-03-15" },
  { id: "2", name: "Maria Garcia", email: "maria@example.com", country: "Spain", role: "USER", bookings: 2, status: "active", joined: "2024-05-20" },
  { id: "3", name: "Ahmad Rezaei", email: "ahmad@visitiran.com", country: "Iran", role: "GUIDE", bookings: 0, status: "active", joined: "2023-01-10" },
  { id: "4", name: "Sara Hosseini", email: "sara@visitiran.com", country: "Iran", role: "GUIDE", bookings: 0, status: "active", joined: "2023-02-15" },
  { id: "5", name: "Ali Ahmadi", email: "ali@example.com", country: "Iran", role: "USER", bookings: 5, status: "active", joined: "2024-01-05" },
  { id: "6", name: "Ahmed Al-Rashid", email: "ahmed@example.com", country: "UAE", role: "USER", bookings: 1, status: "active", joined: "2025-01-10" },
  { id: "7", name: "Admin User", email: "admin@visitiran.com", country: "Iran", role: "SUPER_ADMIN", bookings: 0, status: "active", joined: "2023-01-01" },
];

const roleColors: Record<string, string> = { USER: "bg-blue-100 text-blue-800", GUIDE: "bg-purple-100 text-purple-800", ADMIN: "bg-amber-100 text-amber-800", SUPER_ADMIN: "bg-red-100 text-red-800" };

export default function AdminUsersPage() {
  const { t } = useI18n();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">{t.admin.usersManagement}</h1><p className="text-gray-500 mt-1">{users.length} {t.admin.totalUsers}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100"><input type="text" placeholder={t.common.searchUsers} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">{t.common.user}</th><th className="px-6 py-3">{t.common.country}</th><th className="px-6 py-3">{t.common.type}</th><th className="px-6 py-3">{t.common.bookings}</th><th className="px-6 py-3">{t.common.joined}</th><th className="px-6 py-3">{t.common.actions}</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm">{user.name.charAt(0)}</div><div><p className="text-sm font-medium text-gray-900">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.country}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>{user.role}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.bookings}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
