"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function Footer() {
  const { t } = useI18n();

  const footerLinks = {
    tours: [
      { href: "/tours?type=MOUNTAIN", label: t.common.tours },
      { href: "/about", label: t.common.about },
      { href: "/blog", label: t.common.blog },
      { href: "/contact", label: t.common.contact },
    ],
    company: [
      { href: "/about", label: t.about.ourStory },
      { href: "/about#values", label: t.about.ourValues },
      { href: "/contact", label: t.contact.getInTouch },
    ],
    support: [
      { href: "/faq", label: t.footer.faq },
      { href: "/terms", label: t.footer.terms },
      { href: "/privacy", label: t.footer.privacy },
      { href: "/cancellation", label: t.footer.cookies },
    ],
  };

  const socialLinks = [
    { href: "https://instagram.com", label: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    { href: "https://twitter.com", label: "Twitter", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
    { href: "https://facebook.com", label: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  ];

  return (
    <footer className="relative bg-gray-900 text-gray-300">
      <div className="absolute inset-0 opacity-[0.08] bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Visit<span className="text-emerald-400">Iran</span></span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Tours */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.tours}</h3>
            <ul className="space-y-2">
              {footerLinks.tours.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.company}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.support}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-1">{t.footer.needHelp}</p>
              <a href="mailto:info@visitiran.com" className="text-sm text-emerald-400 hover:text-emerald-300">
                info@visitiran.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 VisitIran. {t.footer.allRights}
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-300">{t.footer.terms}</Link>
            <Link href="/privacy" className="hover:text-gray-300">{t.footer.privacy}</Link>
            <Link href="/cookies" className="hover:text-gray-300">{t.footer.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
