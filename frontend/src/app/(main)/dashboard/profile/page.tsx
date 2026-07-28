"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useI18n();
  const [formData, setFormData] = useState({ name: user?.name || "", country: user?.country || "", phone: user?.phone || "", bio: user?.bio || "" });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (data.success) { updateUser(data.data); setMessage({ type: "success", text: t.dashboard.profileUpdated }); }
      else { setMessage({ type: "error", text: data.error || t.dashboard.profileFailed }); }
    } catch { setMessage({ type: "error", text: t.common.error }); }
    finally { setIsSaving(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.dashboard.profileSettings}</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message.text && (<div className={`px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{message.text}</div>)}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.dashboard.fullName}</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.common.email}</label><input type="email" value={user?.email || ""} disabled className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" /><p className="text-xs text-gray-400 mt-1">{t.dashboard.emailCannotBeChanged}</p></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.common.country}</label><input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. United States" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900 placeholder-gray-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.common.phone}</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900 placeholder-gray-400" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.dashboard.bio}</label><textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder={t.dashboard.bioPlaceholder} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900 placeholder-gray-400 resize-none" /></div>
          <div className="flex justify-end"><button type="submit" disabled={isSaving} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors font-medium">{isSaving ? t.dashboard.saving : t.dashboard.saveChanges}</button></div>
        </form>
      </div>
    </div>
  );
}
