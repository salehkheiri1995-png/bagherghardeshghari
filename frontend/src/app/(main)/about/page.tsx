"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/context/I18nContext";

export default function AboutPage() {
  const { t, locale } = useI18n();
  const isFa = locale === "fa";

  const team = [
    { name: "Reza Mohammadi", role: isFa ? "مدیر عامل و بنیان‌گذار" : "Founder & CEO", initials: "RM", color: "from-emerald-500 to-teal-600" },
    { name: "Sara Hosseini", role: isFa ? "مدیر عملیات" : "Head of Operations", initials: "SH", color: "from-blue-500 to-indigo-600" },
    { name: "Ahmad Rezaei", role: isFa ? "مدیر ماجراجویی" : "Adventure Director", initials: "AR", color: "from-amber-500 to-orange-600" },
    { name: "Maryam Karimi", role: isFa ? "مدیر بازاریابی" : "Marketing Director", initials: "MK", color: "from-purple-500 to-pink-600" },
  ];

  const values = [
    { title: t.about.authenticExperiences, desc: t.about.authenticDesc, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "emerald" },
    { title: t.about.safetyFirst, desc: t.about.safetyDesc, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "blue" },
    { title: t.about.sustainableTourism, desc: t.about.sustainableDesc, icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "teal" },
    { title: t.about.expertGuides, desc: t.about.expertDesc, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: "purple" },
  ];

  const stats = [
    { value: "8+", label: t.about.yearsExperience },
    { value: "500+", label: t.about.happyTravelers },
    { value: "50+", label: t.about.toursCompleted },
    { value: "31", label: t.about.destinationsServed },
  ];

  const offers = [
    { title: t.about.offer1Title, desc: t.about.offer1Desc, icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=85&auto=format&fit=crop" },
    { title: t.about.offer2Title, desc: t.about.offer2Desc, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&q=85&auto=format&fit=crop" },
    { title: t.about.offer3Title, desc: t.about.offer3Desc, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=85&auto=format&fit=crop" },
    { title: t.about.offer4Title, desc: t.about.offer4Desc, icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=85&auto=format&fit=crop" },
  ];

  const destinations = [
    { name: t.about.destIsfahan, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=85&auto=format&fit=crop" },
    { name: t.about.destYazd, image: "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=600&q=85&auto=format&fit=crop" },
    { name: t.about.destShiraz, image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=85&auto=format&fit=crop" },
    { name: t.about.destKerman, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero with Image */}
        <section className="relative h-[500px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop" alt="Iran Mountains" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{t.about.title}</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">{t.about.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">{t.about.ourMission}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">{t.about.subtitle}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{t.about.missionDesc}</p>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=85&auto=format&fit=crop" alt="Iran Nature" className="w-full h-[400px] object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-emerald-100 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-emerald-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
                  <p className="text-emerald-100 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85&auto=format&fit=crop" alt="Islamic Architecture" className="w-full h-[400px] object-cover" />
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-2xl -z-10" />
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">{t.about.ourStory}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">{t.about.ourStory}</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">{t.about.storyP1}</p>
                <p className="text-gray-600 mb-4 leading-relaxed">{t.about.storyP2}</p>
                <p className="text-gray-600 leading-relaxed">{t.about.storyP3}</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">{t.about.whatWeOffer}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{t.about.whatWeOffer}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offers.map((offer) => (
                <div key={offer.title} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={offer.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600">{offer.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">{t.about.ourValues}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{t.about.ourValues}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 bg-${value.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <svg className={`w-8 h-8 text-${value.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">{t.about.ourDestinations}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{t.about.ourDestinations}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest) => (
                <Link key={dest.name} href="/tours" className="group relative h-72 rounded-2xl overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-lg font-bold text-white">{dest.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">{t.about.meetTeam}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{t.about.meetTeam}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.name} className="text-center group">
                  <div className={`w-28 h-28 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-emerald-600 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=85&auto=format&fit=crop" alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-emerald-900/80" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.about.readyToExplore}</h2>
            <p className="text-emerald-100 text-lg mb-8">{t.about.readyDesc}</p>
            <Link href="/tours" className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-gray-100 transition-colors inline-block text-lg">
              {t.about.browseOurTours}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
