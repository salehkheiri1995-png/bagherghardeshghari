"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { TourSchema } from "@/components/json-ld";
import { useI18n } from "@/context/I18nContext";

interface ItineraryDay {
  day: number; title: string; titleFa: string; description: string; descriptionFa: string;
  activities: string[]; activitiesFa: string[]; accommodation?: string; accommodationFa?: string;
}

const toursData: Record<string, {
  id: string; title: string; titleFa: string; type: string; difficulty: string;
  durationDays: number; price: number; capacity: number; location: string;
  province: string; city: string; averageRating: number; totalReviews: number;
  guideLang: string; descriptionEn: string; descriptionFa: string;
  includes: string[]; includesFa: string[]; excludes: string[]; excludesFa: string[];
  requirements: string[]; requirementsFa: string[]; itinerary: ItineraryDay[];
}> = {
  "mount-damavand-expedition": {
    id: "1", title: "Mount Damavand Summit Expedition", titleFa: "صعود به قله دماوند",
    type: "MOUNTAIN", difficulty: "VERY_HARD", durationDays: 5, price: 850, capacity: 8,
    location: "Mount Damavand, Mazandaran", province: "Mazandaran", city: "Rineh",
    averageRating: 4.8, totalReviews: 45, guideLang: "EN",
    descriptionEn: "Experience summiting the highest peak in the Middle East with experienced guides. Damavand at 5,671m is Iran's and the Middle East's tallest peak. This expedition takes you through breathtaking landscapes from lush forests to barren volcanic terrain.",
    descriptionFa: "صعود به بلندترین قله خاورمیانه را با راهنمایان مجرب تجربه کنید. دماوند با ۵۶۷۱ متر بلندترین قله ایران و خاورمیانه است. این سفر شما را از جنگل‌های سرسبز تا اراضی آتشفشانی خشک می‌برد.",
    includes: ["Professional mountain guide", "All camping equipment", "Meals during trek", "Transportation from Tehran", "Emergency oxygen supply", "Certificate of summit"],
    includesFa: ["راهنمای حرفه‌ای کوهستان", "تمام تجهیزات کمپینگ", "وعده‌های غذایی در طول پیاده‌روی", "حمل و نقل از تهران", "اکسیژن اضطراری", "گواهی صعود"],
    excludes: ["International flights", "Travel insurance", "Personal gear", "Tips for guide"],
    excludesFa: ["پروازهای بین‌المللی", "بیمه مسافرتی", "تجهیزات شخصی", "انعام راهنما"],
    requirements: ["Excellent physical fitness", "Previous high-altitude trekking experience", "Age 18-55 years", "Medical certificate required"],
    requirementsFa: ["آمادگی جسمانی عالی", "تجربه پیاده‌روی در ارتفاع", "سن ۱۸ تا ۵۵ سال", "گواهی پزشکی الزامی"],
    itinerary: [
      { day: 1, title: "Transfer to Camp 1", titleFa: "انتقال به کمپ ۱", description: "Drive from Tehran to Polour village and hike to Camp 1 (3,200m)", descriptionFa: "رانندگی از تهران به روستای پلور و پیاده‌روی تا کمپ ۱ (۳۲۰۰ متر)", activities: ["Drive 3 hours", "Acclimatization hike", "Camp setup"], activitiesFa: ["۳ ساعت رانندگی", "پیاده‌روی سازگاری", "برپایی کمپ"], accommodation: "Mountain hut", accommodationFa: "پناهگاه کوهستانی" },
      { day: 2, title: "Camp 1 to Camp 2", titleFa: "کمپ ۱ تا کمپ ۲", description: "Trek through alpine meadows to Camp 2 (4,200m)", descriptionFa: "پیاده‌روی در چمنزارهای آلپاین تا کمپ ۲ (۴۲۰۰ متر)", activities: ["5 hour trek", "Acclimatization", "Photo stops"], activitiesFa: ["پیاده‌روی ۵ ساعته", "سازگاری", "توقف عکاسی"], accommodation: "Camp 2 tent", accommodationFa: "چادر کمپ ۲" },
      { day: 3, title: "Acclimatization Day", titleFa: "روز سازگاری", description: "Rest day with short hike to higher altitude", descriptionFa: "روز استراحت با پیاده‌روی کوتاه به ارتفاع بالاتر", activities: ["Short hike to 4,800m", "Rest and recovery", "Equipment check"], activitiesFa: ["پیاده‌روی کوتاه تا ۴۸۰۰ متر", "استراحت و ریکاوری", "بررسی تجهیزات"], accommodation: "Camp 2 tent", accommodationFa: "چادر کمپ ۲" },
      { day: 4, title: "Summit Day", titleFa: "روز صعود", description: "Early morning summit attempt starting at 4 AM", descriptionFa: "تلاش صعود در صبح زود از ساعت ۴ صبح", activities: ["Summit attempt (5,671m)", "Summit celebration", "Descend to Camp 2"], activitiesFa: ["تلاش صعود (۵۶۷۱ متر)", "جشن صعود", "فرود به کمپ ۲"], accommodation: "Camp 2 tent", accommodationFa: "چادر کمپ ۲" },
      { day: 5, title: "Descent and Return", titleFa: "فرود و بازگشت", description: "Descend to base camp and drive back to Tehran", descriptionFa: "فرود به کمپ پایه و رانندگی به تهران", activities: ["Descend to base", "Drive to Tehran", "Farewell dinner"], activitiesFa: ["فرود به پایه", "رانندگی به تهران", "شام خداحافظی"], accommodation: "Hotel in Tehran", accommodationFa: "هتل در تهران" },
    ],
  },
  "isfahan-cultural-heritage": {
    id: "3", title: "Isfahan Cultural Heritage Tour", titleFa: "تور میراث فرهنگی اصفهان",
    type: "CITY", difficulty: "EASY", durationDays: 3, price: 320, capacity: 15,
    location: "Isfahan, Iran", province: "Isfahan", city: "Isfahan",
    averageRating: 4.9, totalReviews: 67, guideLang: "EN",
    descriptionEn: "Visit Islamic architectural masterpieces in Isfahan, half of the world. From Naqsh-e Jahan Square to Ali Qapu Palace. Experience the breathtaking beauty of one of the world's greatest concentrations of historical monuments.",
    descriptionFa: "شاهکارهای معماری اسلامی اصفهان، نصف جهان را ببینید. از میدان نقش جهان تا کاخ عالی قاپو. زیبایی خیره‌کننده یکی از بزرگترین تمرکزهای آثار تاریخی جهان را تجربه کنید.",
    includes: ["Licensed cultural guide", "Hotel accommodation", "Breakfast and lunch", "All entrance fees", "Transportation within city"],
    includesFa: ["راهنمای فرهنگی مجرب", "اقامت در هتل", "صبحانه و ناهار", "تمام ورودیها", "حمل و نقل داخل شهر"],
    excludes: ["Flights", "Dinner", "Personal shopping"],
    excludesFa: ["پروازها", "شام", "خرید شخصی"],
    requirements: ["No special fitness required", "Comfortable walking shoes", "Modest dress code for mosques"],
    requirementsFa: ["آمادگی جسمانی خاصی لازم نیست", "کفش پیاده‌روی راحت", "پوشش مناسب برای مساجد"],
    itinerary: [
      { day: 1, title: "Naqsh-e Jahan Square", titleFa: "میدان نقش جهان", description: "Explore the magnificent square and its buildings", descriptionFa: "کاوش در میدان باشکوه و ساختمان‌های آن", activities: ["Imam Mosque", "Sheikh Lotfollah Mosque", "Ali Qapu Palace", "Grand Bazaar"], activitiesFa: ["مسجد امام", "مسجد شیخ لطف‌الله", "کاخ عالی قاپو", "بازار بزرگ"], accommodation: "Traditional hotel", accommodationFa: "هتل سنتی" },
      { day: 2, title: "Historic Bridges & Gardens", titleFa: "پل‌های تاریخی و باغ‌ها", description: "Walk along Zayandeh River and visit gardens", descriptionFa: "پیاده‌روی در کنار رودخانه زاینده و بازدید از باغ‌ها", activities: ["Si-o-se-pol Bridge", "Khaju Bridge", "Chehel Sotoun Palace", "Jolfa Quarter"], activitiesFa: ["پل سی و سه پل", "پل خواجو", "کاخ چهلستون", "محله جلفا"], accommodation: "Traditional hotel", accommodationFa: "هتل سنتی" },
      { day: 3, title: "Half Day & Departure", titleFa: "نیم‌روز و حرکت", description: "Morning visit to Atiq Square and departure", descriptionFa: "بازدید صبحگاهی از میدان عتیق و حرکت", activities: ["Atiq Square", "Jameh Mosque", "Departure"], activitiesFa: ["میدان عتیق", "مسجد جامع", "حرکت"], accommodation: "-", accommodationFa: "-" },
    ],
  },
  "shiraz-persepolis-discovery": {
    id: "7", title: "Shiraz & Persepolis Discovery", titleFa: "کشف شیراز و تخت جمشید",
    type: "CITY", difficulty: "EASY", durationDays: 4, price: 420, capacity: 15,
    location: "Shiraz, Iran", province: "Fars", city: "Shiraz",
    averageRating: 4.9, totalReviews: 83, guideLang: "EN",
    descriptionEn: "Visit Shiraz, city of poets, and explore Persepolis, the magnificent Achaemenid capital. Walk in the footsteps of ancient kings and experience the poetic soul of Iran.",
    descriptionFa: "شیراز، شهر شاعران را ببینید و تخت جمشید، پایتخت باشکوه هخامنشی را کاوش کنید. در جای پای پادشاهان باستانی قدم بزنید و روح شاعرانه ایران را تجربه کنید.",
    includes: ["Cultural guide", "Hotel accommodation", "Daily breakfast and lunch", "Persepolis entrance fee", "Transportation"],
    includesFa: ["راهنمای فرهنگی", "اقامت در هتل", "صبحانه و ناهار روزانه", "ورودی تخت جمشید", "حمل و نقل"],
    excludes: ["Flights", "Dinner", "Personal expenses"],
    excludesFa: ["پروازها", "شام", "هزینه‌های شخصی"],
    requirements: ["Basic walking ability", "Sun protection recommended"],
    requirementsFa: ["توانایی پیاده‌روی پایه", "محافظت در برابر آفتاب توصیه می‌شود"],
    itinerary: [
      { day: 1, title: "Arrival in Shiraz", titleFa: "ورود به شیراز", description: "Welcome to Shiraz, city of poets and gardens", descriptionFa: "خوش آمدید به شیراز، شهر شاعران و باغ‌ها", activities: ["Airport pickup", "Vakil Bazaar", "Nasir al-Mulk Mosque"], activitiesFa: ["تransfer فرودگاه", "بازار وکیل", "مسجد نصیرالملک"], accommodation: "Boutique hotel", accommodationFa: "هتل بوتیک" },
      { day: 2, title: "Persepolis & Necropolis", titleFa: "تخت جمشید و نقش رستم", description: "Day trip to the ancient Achaemenid capital", descriptionFa: "سفر یکروزه به پایتخت باستانی هخامنشی", activities: ["Persepolis", "Naqsh-e Rostam", "Pasargadae"], activitiesFa: ["تخت جمشید", "نقش رستم", "پاسارگاد"], accommodation: "Boutique hotel", accommodationFa: "هتل بوتیک" },
      { day: 3, title: "Shiraz Gardens", titleFa: "باغ‌های شیراز", description: "Explore Shiraz's beautiful gardens and tombs", descriptionFa: "کاوش در باغ‌ها و آرامگاه‌های زیبای شیراز", activities: ["Eram Garden", "Naranjestan", "Tomb of Hafez", "Tomb of Saadi"], activitiesFa: ["باغ ارم", "نارنجستان", "آرامگاه حافظ", "آرامگاه سعدی"], accommodation: "Boutique hotel", accommodationFa: "هتل بوتیک" },
      { day: 4, title: "Departure", titleFa: "حرکت", description: "Last morning in Shiraz", descriptionFa: "آخرین صبح در شیراز", activities: ["Free morning for shopping", "Departure"], activitiesFa: ["صبح آزاد برای خرید", "حرکت"], accommodation: "-", accommodationFa: "-" },
    ],
  },
  "hyrcanian-forest-adventure": {
    id: "2", title: "Hyrcanian Forest Adventure", titleFa: "ماجراجویی جنگل‌های هیرکانی",
    type: "FOREST", difficulty: "MODERATE", durationDays: 4, price: 450, capacity: 12,
    location: "Hyrcanian Forest, Mazandaran", province: "Mazandaran", city: "Nour",
    averageRating: 4.6, totalReviews: 38, guideLang: "EN",
    descriptionEn: "Journey into the ancient Hyrcanian forests dating back to the Jurassic era. These UNESCO World Heritage listed forests are home to diverse flora and fauna, offering an unparalleled eco-tourism experience.",
    descriptionFa: "سفر به دل جنگل‌های باستانی هیرکانی که از دوران ژوراسیک باقی مانده‌اند. این جنگل‌ها که در فهرست میراث جهانی یونسکو ثبت شده‌اند، زیستگاه گیاهان و جانوران متنوعی هستند و تجربه‌ای بی‌نظیر از اکوتوریسم را ارائه می‌دهند.",
    includes: ["Forest guide", "Accommodation in eco-lodge", "Meals", "Transportation", "Nature walk activities"],
    includesFa: ["راهنمای جنگل", "اقامت در اقامتگاه بوم‌گردی", "وعده‌های غذایی", "حمل و نقل", "فعالیت‌های پیاده‌روی طبیعت"],
    excludes: ["Flights", "Travel insurance", "Personal expenses"],
    excludesFa: ["پروازها", "بیمه مسافرتی", "هزینه‌های شخصی"],
    requirements: ["Moderate fitness", "Comfortable hiking shoes", "Age 12+"],
    requirementsFa: ["آمادگی جسمانی متوسط", "کفش پیاده‌روی راحت", "سن ۱۲ سال به بالا"],
    itinerary: [
      { day: 1, title: "Arrival in Mazandaran", titleFa: "ورود به مازندران", description: "Travel to eco-lodge near the forest", descriptionFa: "سفر به اقامتگاه بوم‌گردی نزدیک جنگل", activities: ["Transfer", "Welcome dinner"], activitiesFa: ["انتقال", "شام خوش‌آمدگویی"], accommodation: "Eco-lodge", accommodationFa: "اقامتگاه بوم‌گردی" },
      { day: 2, title: "Deep Forest Trek", titleFa: "پیاده‌روی در عمق جنگل", description: "Full day trek through ancient forest", descriptionFa: "پیاده‌روی یکروزه در جنگل باستانی", activities: ["Forest trek", "Bird watching", "Waterfall visit"], activitiesFa: ["پیاده‌روی جنگلی", "مشاهده پرندگان", "بازدید از آبشار"], accommodation: "Eco-lodge", accommodationFa: "اقامتگاه بوم‌گردی" },
      { day: 3, title: "Village Visit & Nature", titleFa: "بازدید از روستا و طبیعت", description: "Visit local village and explore nature", descriptionFa: "بازدید از روستای محلی و کاوش در طبیعت", activities: ["Village tour", "Local lunch", "Swimming"], activitiesFa: ["گشت روستا", "ناهار محلی", "شنا"], accommodation: "Eco-lodge", accommodationFa: "اقامتگاه بوم‌گردی" },
      { day: 4, title: "Return", titleFa: "بازگشت", description: "Morning nature walk and return", descriptionFa: "پیاده‌روی صبحگاهی طبیعت و بازگشت", activities: ["Sunrise hike", "Departure"], activitiesFa: ["پیاده‌روی طلوع آفتاب", "حرکت"], accommodation: "-", accommodationFa: "-" },
    ],
  },
  "masuleh-kandovan-villages": {
    id: "4", title: "Masuleh & Kandovan Village Discovery", titleFa: "کشف روستاهای ماسوله و کندوان",
    type: "VILLAGE", difficulty: "MODERATE", durationDays: 5, price: 520, capacity: 10,
    location: "Gilan & East Azerbaijan", province: "Gilan", city: "Masuleh",
    averageRating: 4.7, totalReviews: 29, guideLang: "EN",
    descriptionEn: "Discover two of Iran's most spectacular villages: stepped Masuleh with its misty mountain backdrop and Kandovan, a remarkable cave village carved into volcanic rocks. Experience authentic rural life and centuries-old traditions.",
    descriptionFa: "دو تا از شگفت‌انگیزترین روستاهای ایران را کشف کنید: ماسوله پلکانی با پس‌زمینه کوه‌های مه‌آلود و کندوان، روستای غاری خیره‌کننده‌ای که در صخره‌های آتشفشانی تراشیده شده است. زندگی روستایی اصیل و سنت‌های چندصدساله را تجربه کنید.",
    includes: ["Village guide", "Traditional guesthouse stays", "All meals", "Transportation between villages", "Cultural activities"],
    includesFa: ["راهنمای روستا", "اقامت در مهمان‌خانه‌های سنتی", "تمام وعده‌های غذایی", "حمل و نقل بین روستاها", "فعالیت‌های فرهنگی"],
    excludes: ["Flights", "Travel insurance", "Souvenirs"],
    excludesFa: ["پروازها", "بیمه مسافرتی", "سوvenirها"],
    requirements: ["Moderate fitness for walking", "Comfortable shoes", "Open mind for cultural immersion"],
    requirementsFa: ["آمادگی جسمانی متوسط برای پیاده‌روی", "کفش راحت", "ذهن باز برای غوطه‌وری فرهنگی"],
    itinerary: [
      { day: 1, title: "Travel to Masuleh", titleFa: "سفر به ماسوله", description: "Drive through scenic roads to Masuleh", descriptionFa: "رانندگی از جاده‌های خوش‌منظره به ماسوله", activities: ["Scenic drive", "Village exploration"], activitiesFa: ["رانندگی خوش‌منظره", "گشت روستا"], accommodation: "Traditional guesthouse", accommodationFa: "مهمان‌خانه سنتی" },
      { day: 2, title: "Masuleh Exploration", titleFa: "کاوش ماسوله", description: "Full day in Masuleh village", descriptionFa: "یک روز کامل در روستای ماسوله", activities: ["Forest walk", "Local crafts", "Tea ceremony"], activitiesFa: ["پیاده‌روی جنگلی", "صنایع دستی محلی", "مراسم چای"], accommodation: "Traditional guesthouse", accommodationFa: "مهمان‌خانه سنتی" },
      { day: 3, title: "Transfer to Kandovan", titleFa: "انتقال به کندوان", description: "Travel to Kandovan via Tabriz", descriptionFa: "سفر به کندوان از طریق تبریز", activities: ["Tabriz lunch", "Transfer to Kandovan"], activitiesFa: ["ناهار تبریزی", "انتقال به کندوان"], accommodation: "Cave hotel", accommodationFa: "هتل غاری" },
      { day: 4, title: "Kandovan Village", titleFa: "روستای کندوان", description: "Explore cave village", descriptionFa: "کاوش در روستای غاری", activities: ["Cave exploration", "Local lunch", "Hot springs"], activitiesFa: ["کاوش غار", "ناهار محلی", "چشمه‌های آب گرم"], accommodation: "Cave hotel", accommodationFa: "هتل غاری" },
      { day: 5, title: "Return", titleFa: "بازگشت", description: "Morning in Kandovan and departure", descriptionFa: "صبح در کندوان و حرکت", activities: ["Morning walk", "Departure"], activitiesFa: ["پیاده‌روی صبحگاهی", "حرکت"], accommodation: "-", accommodationFa: "-" },
    ],
  },
  "lut-desert-adventure": {
    id: "5", title: "Lut Desert Adventure", titleFa: "ماجراجویی کویر لوت",
    type: "NATURE", difficulty: "HARD", durationDays: 4, price: 680, capacity: 8,
    location: "Lut Desert, Kerman", province: "Kerman", city: "Shahdad",
    averageRating: 4.5, totalReviews: 22, guideLang: "EN",
    descriptionEn: "Journey to one of the hottest places on Earth. The Lut Desert, a UNESCO World Heritage site, offers stunning landscapes from massive sand dunes to the eerie Kaluts rock formations, with starlit skies that will take your breath away.",
    descriptionFa: "سفر به یکی از گرم‌ترین نقاط زمین. کویر لوت، میراث جهانی یونسکو، مناظر خیره‌کننده‌ای از تپه‌های ماسه‌ای عظیم تا تشکیلات صخره‌ای عجیب کلوت‌ها ارائه می‌دهد، با آسمان پرستاره‌ای که نفس شما را بند می‌آورد.",
    includes: ["Desert expert guide", "4x4 transportation", "All camping equipment", "All meals", "Stargazing equipment", "Photography sessions"],
    includesFa: ["راهنمای متخصص کویر", "حمل و نقل ۴×۴", "تمام تجهیزات کمپینگ", "تمام وعده‌های غذایی", "تجهیزات رصد ستارگان", "جلسات عکاسی"],
    excludes: ["Flights", "Travel insurance", "Personal gear"],
    excludesFa: ["پروازها", "بیمه مسافرتی", "تجهیزات شخصی"],
    requirements: ["Good physical fitness", "Heat tolerance", "Age 18-50", "No claustrophobia"],
    requirementsFa: ["آمادگی جسمانی خوب", "تحمل گرما", "سن ۱۸ تا ۵۰ سال", "بدون ترس از فضای بسته"],
    itinerary: [
      { day: 1, title: "Kerman to Shahdad", titleFa: "کرمان به شهداد", description: "Travel to desert edge", descriptionFa: "سفر به لبه کویر", activities: ["Drive to Shahdad", "Kaluts tour"], activitiesFa: ["رانندگی به شهداد", "گشت کلوت‌ها"], accommodation: "Desert camp", accommodationFa: "کمپ کویری" },
      { day: 2, title: "Deep Desert", titleFa: "عمق کویر", description: "Full day in the desert", descriptionFa: "یک روز کامل در کویر", activities: ["Sunrise photography", "Dune climbing", "Stargazing"], activitiesFa: ["عکاسی طلوع آفتاب", "صعود تپه ماسه‌ای", "رصد ستارگان"], accommodation: "Desert camp", accommodationFa: "کمپ کویری" },
      { day: 3, title: "Exploration", titleFa: "اکتشاف", description: "Visit historical sites", descriptionFa: "بازدید از مکان‌های تاریخی", activities: ["Ancient village", "Salt lake", "Sand boarding"], activitiesFa: ["روستای باستانی", "دریاچه نمک", "اسکی روی ماسه"], accommodation: "Desert camp", accommodationFa: "کمپ کویری" },
      { day: 4, title: "Return", titleFa: "بازگشت", description: "Sunrise and return to Kerman", descriptionFa: "طلوع آفتاب و بازگشت به کرمان", activities: ["Sunrise", "Return to Kerman"], activitiesFa: ["طلوع آفتاب", "بازگشت به کرمان"], accommodation: "-", accommodationFa: "-" },
    ],
  },
  "historic-yazd-city-tour": {
    id: "6", title: "Historic Yazd City Tour", titleFa: "تور شهری یزد تاریخی",
    type: "CITY", difficulty: "EASY", durationDays: 2, price: 180, capacity: 15,
    location: "Yazd, Iran", province: "Yazd", city: "Yazd",
    averageRating: 4.8, totalReviews: 52, guideLang: "EN",
    descriptionEn: "Explore the city of windcatchers with 5000 years of history and unique desert architecture. Yazd, a UNESCO World Heritage city, is one of the oldest continuously inhabited cities in the world.",
    descriptionFa: "شهر بادگیرها را با ۵۰۰۰ سال تاریخ و معماری منحصر به فرد صحرایی کاوش کنید. یزد، شهر میراث جهانی یونسکو، یکی از قدیمی‌ترین شهرهای مسکونی متوالی جهان است.",
    includes: ["Licensed guide", "Hotel accommodation", "Breakfast", "Entrance fees", "Walking tour"],
    includesFa: ["راهنمای مجرب", "اقامت در هتل", "صبحانه", "ورودیها", "تور پیاده‌روی"],
    excludes: ["Flights", "Lunch and dinner", "Shopping"],
    excludesFa: ["پروازها", "ناهار و شام", "خرید"],
    requirements: ["No fitness requirements", "Comfortable shoes"],
    requirementsFa: ["نیاز به آمادگی جسمانی خاصی نیست", "کفش راحت"],
    itinerary: [
      { day: 1, title: "Historic Yazd", titleFa: "یزد تاریخی", description: "Walk through the old city", descriptionFa: "پیاده‌روی در شهر قدیمی", activities: ["Amir Chakhmaq Complex", "Jameh Mosque", "Bazaar", "Traditional houses"], activitiesFa: ["مجموعه امیر چخماق", "مسجد جامع", "بازار", "خانه‌های سنتی"], accommodation: "Traditional hotel", accommodationFa: "هتل سنتی" },
      { day: 2, title: "Fire Temple & Towers", titleFa: "آتشکده و برج‌ها", description: "Visit Zoroastrian sites and windcatchers", descriptionFa: "بازدید از مکان‌های زرتشتی و بادگیرها", activities: ["Fire Temple", "Towers of Silence", "Dowlat Abad Garden", "Water Museum"], activitiesFa: ["آتشکده", "برج‌های خاموش", "باغ دولت‌آباد", "موزه آب"], accommodation: "-", accommodationFa: "-" },
    ],
  },
  "caspian-sea-nature": {
    id: "8", title: "Caspian Sea Nature Tour", titleFa: "تور طبیعت دریای خزر",
    type: "NATURE", difficulty: "EASY", durationDays: 3, price: 290, capacity: 12,
    location: "Caspian Coast, Gilan", province: "Gilan", city: "Rasht",
    averageRating: 4.4, totalReviews: 34, guideLang: "EN",
    descriptionEn: "Journey to the beautiful Caspian Sea coast and explore pristine nature of northern Iran. From lush Hyrcanian forests to sandy beaches, experience the diverse ecosystems of the Caspian region.",
    descriptionFa: "سفر به سواحل زیبای دریای خزر و کاوش در طبیعت بکر شمال ایران. از جنگل‌های سرسبز هیرکانی تا سواحل شنی، اکوسیستم‌های متنوع منطقه خزر را تجربه کنید.",
    includes: ["Guide", "Hotel accommodation", "Meals", "Activities", "Transportation"],
    includesFa: ["راهنما", "اقامت در هتل", "وعده‌های غذایی", "فعالیت‌ها", "حمل و نقل"],
    excludes: ["Flights", "Personal expenses"],
    excludesFa: ["پروازها", "هزینه‌های شخصی"],
    requirements: ["No special fitness required", "Swimwear for beach"],
    requirementsFa: ["نیاز به آمادگی جسمانی خاصی نیست", "لباس شنا برای ساحل"],
    itinerary: [
      { day: 1, title: "Arrival at Caspian", titleFa: "ورود به خزر", description: "Travel to Rasht", descriptionFa: "سفر به رشت", activities: ["Transfer", "Rasht bazaar", "Local food tour"], activitiesFa: ["انتقال", "بازار رشت", "تور غذای محلی"], accommodation: "Beach hotel", accommodationFa: "هتل ساحلی" },
      { day: 2, title: "Nature & Beach", titleFa: "طبیعت و ساحل", description: "Forest and beach day", descriptionFa: "روز جنگل و ساحل", activities: ["Forest hike", "Beach time", "Seafood dinner"], activitiesFa: ["پیاده‌روی جنگلی", "وقت ساحل", "شام غذاهای دریایی"], accommodation: "Beach hotel", accommodationFa: "هتل ساحلی" },
      { day: 3, title: "Return", titleFa: "بازگشت", description: "Morning beach walk", descriptionFa: "پیاده‌روی صبحگاهی ساحل", activities: ["Sunrise", "Return"], activitiesFa: ["طلوع آفتاب", "بازگشت"], accommodation: "-", accommodationFa: "-" },
    ],
  },
};

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-100 text-green-700",
  MODERATE: "bg-yellow-100 text-yellow-700",
  HARD: "bg-orange-100 text-orange-700",
  VERY_HARD: "bg-red-100 text-red-700",
};

const archiveData = [
  { id: "1", date: "2025-07-10", guideName: "Ahmad Rezaei", location: "Damavand", photos: 24, description: "Successful summit with clear weather" },
  { id: "2", date: "2025-06-20", guideName: "Sara Hosseini", location: "Damavand", photos: 18, description: "Great group, beautiful sunrise from summit" },
  { id: "3", date: "2025-05-15", guideName: "Ahmad Rezaei", location: "Damavand", photos: 31, description: "Challenging weather but successful summit" },
];

const reviewsData = [
  { id: "1", userName: "John S.", country: "USA", rating: 5, date: "2025-07-15", title: "Life-changing experience!", comment: "Summiting Damavand was the highlight of my life.", pros: "Professional guides, great equipment", cons: "Very challenging physically", helpful: 12, verified: true },
  { id: "2", userName: "Maria G.", country: "Spain", rating: 5, date: "2025-06-25", title: "Amazing adventure", comment: "The whole expedition was well organized.", pros: "Beautiful scenery, excellent food", cons: "Could use more rest days", helpful: 8, verified: true },
  { id: "3", userName: "Ahmed A.", country: "UAE", rating: 4, date: "2025-05-20", title: "Great experience", comment: "A well-organized trip with professional guides.", pros: "Professional team, great itinerary", cons: "Weather can be unpredictable", helpful: 5, verified: true },
];

const availableDates = [
  { id: "1", startDate: "2026-06-15", endDate: "2026-06-19", availableSpots: 5, maxCapacity: 8, price: 850 },
  { id: "2", startDate: "2026-07-01", endDate: "2026-07-05", availableSpots: 3, maxCapacity: 8, price: 850 },
  { id: "3", startDate: "2026-07-15", endDate: "2026-07-19", availableSpots: 8, maxCapacity: 8, price: 850 },
];

export default function TourDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tour = toursData[slug] || toursData["isfahan-cultural-heritage"];
  const { t, locale } = useI18n();
  const isFa = locale === "fa";

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.id || "");
  const [guests, setGuests] = useState(1);
  const [activeTab, setActiveTab] = useState<"itinerary" | "includes" | "reviews" | "archive">("itinerary");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const selectedDateInfo = availableDates.find((d) => d.id === selectedDate);
  const totalPrice = (selectedDateInfo?.price || tour.price) * guests;

  const difficultyLabel = tour.difficulty === "VERY_HARD" ? t.tours.veryHardLabel : tour.difficulty === "MODERATE" ? t.tours.moderateLabel : tour.difficulty === "HARD" ? t.tours.hardLabel : t.tours.easyLabel;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={isFa ? tour.titleFa : tour.title} description={isFa ? tour.descriptionFa : tour.descriptionEn} />
      <TourSchema name={tour.title} description={tour.descriptionEn} price={tour.price} rating={tour.averageRating} reviewCount={tour.totalReviews} duration={`${tour.durationDays} days`} url={`https://visitiran.com/tours/${slug}`} />
      <Header />
      <main className="flex-1">
        <section className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-emerald-400 to-teal-600">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[tour.difficulty]}`}>{difficultyLabel}</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">{t.tours[`type${tour.type}` as keyof typeof t.tours] || tour.type}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{isFa ? tour.titleFa : tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {tour.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {tour.durationDays} {t.common.days}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {tour.averageRating} ({tour.totalReviews} {t.common.reviews})
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                  {tour.guideLang === "EN" ? t.tours.langEN : tour.guideLang === "FA" ? t.tours.langFA : tour.guideLang}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description - Bilingual */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.tourDetail.aboutTour}</h2>
                <p className="text-gray-600 leading-relaxed mb-3">{isFa ? tour.descriptionFa : tour.descriptionEn}</p>
                <p className="text-gray-500 leading-relaxed text-sm border-t border-gray-100 pt-3" dir="rtl">{isFa ? tour.descriptionEn : tour.descriptionFa}</p>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-100">
                  <div className="flex overflow-x-auto">
                    {(["itinerary", "includes", "reviews", "archive"] as const).map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        {tab === "itinerary" ? t.tourDetail.itinerary : tab === "includes" ? t.tourDetail.whatsIncluded : tab === "reviews" ? `${t.tourDetail.reviews} (${reviewsData.length})` : t.tourDetail.pastTours}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* Itinerary Tab - Bilingual */}
                  {activeTab === "itinerary" && (
                    <div className="space-y-6">
                      {tour.itinerary.map((day) => (
                        <div key={day.day} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">{day.day}</div>
                            <div className="w-0.5 flex-1 bg-emerald-200 mt-2" />
                          </div>
                          <div className="pb-6 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {t.tourDetail.dayPrefix} {day.day}: {isFa ? day.titleFa : day.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-1" dir="rtl">{isFa ? day.title : day.titleFa}</p>
                            <p className="text-gray-600 mb-2">{isFa ? day.descriptionFa : day.description}</p>
                            <p className="text-gray-500 text-sm mb-3" dir="rtl">{isFa ? day.description : day.descriptionFa}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(isFa ? day.activitiesFa : day.activities).map((activity, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{activity}</span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(isFa ? day.activities : day.activitiesFa).map((activity, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full" dir="rtl">{activity}</span>
                              ))}
                            </div>
                            {day.accommodation && day.accommodation !== "-" && (
                              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                {t.tourDetail.stayLabel}: {isFa ? day.accommodationFa : day.accommodation}
                                <span className="text-gray-400 mx-1">|</span>
                                <span dir="rtl">{isFa ? day.accommodation : day.accommodationFa}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Includes Tab - Bilingual */}
                  {activeTab === "includes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          {t.tourDetail.whatsIncluded}
                        </h3>
                        <ul className="space-y-3">
                          {tour.includes.map((item, i) => (
                            <li key={i} className="text-gray-600">
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <div>
                                  <span>{isFa ? item : item}</span>
                                  <span className="block text-sm text-gray-400" dir="rtl">{isFa ? item : tour.includesFa[i]}</span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          {t.tourDetail.whatsNotIncluded}
                        </h3>
                        <ul className="space-y-3">
                          {tour.excludes.map((item, i) => (
                            <li key={i} className="text-gray-600">
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                <div>
                                  <span>{item}</span>
                                  <span className="block text-sm text-gray-400" dir="rtl">{tour.excludesFa[i]}</span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      {reviewsData.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{review.userName}</span>
                                {review.verified && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{t.common.verified}</span>}
                              </div>
                              <p className="text-sm text-gray-500">{review.country} &bull; {review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, j) => (
                                <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              ))}
                            </div>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                          <p className="text-gray-600 mb-3">{review.comment}</p>
                          {review.pros && <p className="text-sm text-green-700"><span className="font-medium">Pros:</span> {review.pros}</p>}
                          {review.cons && <p className="text-sm text-red-600"><span className="font-medium">Cons:</span> {review.cons}</p>}
                          <div className="mt-2 flex items-center gap-4">
                            <button className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                              {t.common.helpful} ({review.helpful})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Archive Tab */}
                  {activeTab === "archive" && (
                    <div className="space-y-4">
                      <p className="text-gray-600 mb-4">Browse photos and memories from past expeditions.</p>
                      {archiveData.map((item) => (
                        <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.description}</p>
                              <p className="text-sm text-gray-500 mt-1">{item.date} &bull; Guide: {item.guideName} &bull; {item.photos} photos</p>
                            </div>
                            <button className="px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                              {t.tourDetail.viewGallery}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements - Bilingual */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.tourDetail.requirements}</h2>
                <ul className="space-y-2">
                  {tour.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <div>
                        <span>{isFa ? tour.requirementsFa[i] : req}</span>
                        <span className="text-gray-400 mx-2">|</span>
                        <span className="text-sm text-gray-400" dir="rtl">{isFa ? req : tour.requirementsFa[i]}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.tourDetail.tourLocation}</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    <p className="text-sm">{t.tourDetail.interactiveMap}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-emerald-600">${totalPrice}</span>
                    <span className="text-gray-500">{t.tourDetail.total}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">${selectedDateInfo?.price || tour.price} {t.common.perPerson} &bull; {guests} {t.common.guests}</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.tourDetail.selectDate}</label>
                      <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm">
                        {availableDates.map((date) => (
                          <option key={date.id} value={date.id}>{date.startDate} - {date.endDate} ({date.availableSpots} {t.common.spotsLeft})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.tourDetail.guests}</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">-</button>
                        <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                        <button onClick={() => setGuests(Math.min(tour.capacity, guests + 1))} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">+</button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setShowBookingModal(true)} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                    {t.tourDetail.bookNow}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3">{t.tourDetail.freeCancellation}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">{t.tourDetail.tourInfo}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.duration}</span><span className="font-medium text-gray-900">{tour.durationDays} {t.common.days}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.maxGroup}</span><span className="font-medium text-gray-900">{tour.capacity}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.difficulty}</span><span className="font-medium text-gray-900">{difficultyLabel}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.language}</span><span className="font-medium text-gray-900">{t.tours.langEN}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.tourDetail.province}</span><span className="font-medium text-gray-900">{tour.province}</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{t.tourDetail.shareThisTour}</h3>
                  <div className="flex gap-2">
                    {["Facebook", "Twitter", "WhatsApp", "Email"].map((platform) => (
                      <button key={platform} className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">{platform}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowBookingModal(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t.booking.title}</h2>
                <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-emerald-800 font-medium">{isFa ? tour.titleFa : tour.title}</p>
                  <p className="text-sm text-emerald-600 mt-1">{selectedDateInfo?.startDate} - {selectedDateInfo?.endDate} &bull; {guests} {t.common.guests}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.firstName}</label><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.lastName}</label><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.email}</label><input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.phone}</label><input type="tel" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.country}</label><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">{t.booking.tourPrice} ({guests}x)</span><span className="font-medium">${(selectedDateInfo?.price || tour.price) * guests}</span></div>
                  <div className="flex justify-between font-semibold text-lg"><span>{t.common.total}</span><span className="text-emerald-600">${totalPrice}</span></div>
                </div>
                <button className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">{t.booking.proceedToPayment}</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
