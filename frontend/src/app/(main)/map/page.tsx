"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteractiveMap, { type MapLocation } from "@/components/map/InteractiveMap";
import SEOHead from "@/components/SEOHead";
import { useI18n } from "@/context/I18nContext";

const locations: MapLocation[] = [
  { id: "1", name: "نقش جهان", nameEn: "Naqsh-e Jahan Square", type: "HISTORICAL", latitude: 32.6583, longitude: 51.6684, description: "One of the largest squares in the world, UNESCO World Heritage Site in Isfahan", province: "Isfahan", tourCount: 12 },
  { id: "2", name: "تخت جمشید", nameEn: "Persepolis", type: "HISTORICAL", latitude: 29.9353, longitude: 52.8914, description: "Ceremonial capital of the Achaemenid Empire, UNESCO World Heritage", province: "Fars", tourCount: 8 },
  { id: "3", name: "قلعه نیاوران", nameEn: "Niavaran Palace", type: "HISTORICAL", latitude: 35.8047, longitude: 51.4813, description: "Beautiful palace complex from the Qajar and Pahlavi eras", province: "Tehran", tourCount: 5 },
  { id: "4", name: "سی و سه پل", nameEn: "Si-o-se-pol Bridge", type: "HISTORICAL", latitude: 32.6436, longitude: 51.6684, description: "Iconic 33-arch bridge over Zayandeh River in Isfahan", province: "Isfahan", tourCount: 10 },
  { id: "5", name: "باغ نارنجستان", nameEn: "Naranjestan Garden", type: "RECREATIONAL", latitude: 29.6071, longitude: 52.5493, description: "Beautiful Qajar-era garden with stunning architecture in Shiraz", province: "Fars", tourCount: 7 },
  { id: "6", name: "پارک جنگلی چالوس", nameEn: "Chaloos Forest Park", type: "NATURAL", latitude: 36.6497, longitude: 51.4222, description: "Beautiful Caspian forest with hiking trails", province: "Mazandaran", tourCount: 6 },
  { id: "7", name: "ماسوله", nameEn: "Masuleh Village", type: "NATURAL", latitude: 37.1589, longitude: 49.0328, description: "UNESCO-recognized stepped village in the mountains of Gilan", province: "Gilan", tourCount: 4 },
  { id: "8", name: "بادگیرهای یزد", nameEn: "Yazd Windcatchers", type: "HISTORICAL", latitude: 31.8974, longitude: 54.3569, description: "Ancient windcatcher towers - symbol of desert architecture", province: "Yazd", tourCount: 9 },
  { id: "9", name: "روستای کندوان", nameEn: "Kandovan Village", type: "HISTORICAL", latitude: 37.7319, longitude: 46.2383, description: "Unique cave village carved into volcanic rocks", province: "East Azerbaijan", tourCount: 3 },
  { id: "10", name: "کویر مرنجاب", nameEn: "Maranjab Desert", type: "NATURAL", latitude: 34.5894, longitude: 51.9894, description: "Stunning desert landscape with salt lake and sand dunes", province: "Isfahan", tourCount: 5 },
  { id: "11", name: "حرم امام رضا", nameEn: "Imam Reza Shrine", type: "RELIGIOUS", latitude: 36.2883, longitude: 59.6187, description: "The largest mosque in the world by area, in Mashhad", province: "Khorasan", tourCount: 4 },
  { id: "12", name: "مسجد شیخ لطف الله", nameEn: "Sheikh Lotfollah Mosque", type: "RELIGIOUS", latitude: 32.6585, longitude: 51.6783, description: "Masterpiece of Islamic architecture on Naqsh-e Jahan Square", province: "Isfahan", tourCount: 11 },
  { id: "13", name: "کوه دماوند", nameEn: "Mount Damavand", type: "NATURAL", latitude: 35.9514, longitude: 52.1096, description: "Highest peak in the Middle East at 5,671m", province: "Mazandaran", tourCount: 3 },
  { id: "14", name: "باغ ارم", nameEn: "Eram Garden", type: "RECREATIONAL", latitude: 29.5944, longitude: 52.5294, description: "Historic Persian garden in Shiraz, UNESCO site", province: "Fars", tourCount: 6 },
  { id: "15", name: "کویر لوت", nameEn: "Lut Desert", type: "NATURAL", latitude: 30.4, longitude: 58.0, description: "One of the hottest places on Earth, UNESCO World Heritage", province: "Kerman", tourCount: 2 },
];

export default function MapPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={t.common.map} description={t.tours.pageDesc} />
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.tours.pageTitle}</h1>
            <p className="text-emerald-100">{locations.length} {t.tours.toursFound}</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InteractiveMap locations={locations} height="600px" />
        </section>

        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t.tours.pageTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t.tours.city, count: locations.filter(l => l.type === "HISTORICAL").length, color: "bg-purple-100 text-purple-700" },
                { label: t.tours.nature, count: locations.filter(l => l.type === "NATURAL").length, color: "bg-green-100 text-green-700" },
                { label: t.tours.mountain, count: locations.filter(l => l.type === "RELIGIOUS").length, color: "bg-amber-100 text-amber-700" },
                { label: t.tours.village, count: locations.filter(l => l.type === "RECREATIONAL").length, color: "bg-blue-100 text-blue-700" },
              ].map((cat) => (
                <div key={cat.label} className={`${cat.color} rounded-xl p-4 text-center`}>
                  <p className="text-2xl font-bold mt-2">{cat.count}</p>
                  <p className="text-sm">{cat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
