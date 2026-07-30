import { PrismaClient } from "./../src/generated/prisma/client.js";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSQL({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.translation.deleteMany();
  await prisma.slider.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.article.deleteMany();
  await prisma.review.deleteMany();
  await prisma.media.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tourAttraction.deleteMany();
  await prisma.tourDate.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.province.deleteMany();
  await prisma.user.deleteMany();

  // ==========================================
  // USERS
  // ==========================================
  const password = await hashPassword("Password123!");
  const adminPassword = await hashPassword("Admin123!");

  const superAdmin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@visitiran.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
      country: "Iran",
      phone: "+989123456789",
      bio: "Super administrator of VisitIran platform",
    },
  });

  const guide1 = await prisma.user.create({
    data: {
      name: "Ahmad Rezaei",
      email: "ahmad@visitiran.com",
      password: adminPassword,
      role: "GUIDE",
      country: "Iran",
      phone: "+989123456790",
      bio: "Professional mountain guide with 10 years of experience",
    },
  });

  const guide2 = await prisma.user.create({
    data: {
      name: "Sara Hosseini",
      email: "sara@visitiran.com",
      password: adminPassword,
      role: "GUIDE",
      country: "Iran",
      phone: "+989123456791",
      bio: "Cultural tour specialist and licensed guide",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "John Smith",
      email: "john@example.com",
      password,
      role: "USER",
      country: "United States",
      phone: "+1234567890",
      bio: "Travel enthusiast",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Maria Garcia",
      email: "maria@example.com",
      password,
      role: "USER",
      country: "Spain",
      phone: "+34612345678",
      bio: "Adventure seeker",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Ali Ahmadi",
      email: "ali@example.com",
      password,
      role: "USER",
      country: "Iran",
      phone: "+989198765432",
      bio: "Domestic traveler",
    },
  });

  console.log("Users created");

  // ==========================================
  // PROVINCES
  // ==========================================
  const provinces = await Promise.all([
    prisma.province.create({
      data: {
        name: "تهران",
        nameEn: "Tehran",
        nameAr: "طهران",
        nameRu: "Тегеран",
        nameZh: "德黑兰",
        nameEs: "Teherán",
        description: "Capital city of Iran with rich history and modern attractions",
        latitude: 35.6892,
        longitude: 51.389,
      },
    }),
    prisma.province.create({
      data: {
        name: "اصفهان",
        nameEn: "Isfahan",
        nameAr: "أصفهان",
        nameRu: "Исфахан",
        nameZh: "伊斯法罕",
        nameEs: "Isfahán",
        description: "Half of the world - historic city with stunning Islamic architecture",
        latitude: 32.6546,
        longitude: 51.668,
      },
    }),
    prisma.province.create({
      data: {
        name: "فارس",
        nameEn: "Fars (Shiraz)",
        nameAr: "فارس",
        nameRu: "Фарс",
        nameZh: "法尔斯",
        nameEs: "Fars",
        description: "Land of poets, wine, and Persepolis",
        latitude: 29.5918,
        longitude: 52.5836,
      },
    }),
    prisma.province.create({
      data: {
        name: "مازندران",
        nameEn: "Mazandaran",
        nameAr: "مازندران",
        nameRu: "Мазендеран",
        nameZh: "马赞德兰",
        nameEs: "Mazandarán",
        description: "Lush green forests and Caspian Sea coastline",
        latitude: 36.5662,
        longitude: 53.0989,
      },
    }),
    prisma.province.create({
      data: {
        name: "گیلان",
        nameEn: "Gilan",
        nameAr: "گیلان",
        nameRu: "Гилан",
        nameZh: "吉兰",
        nameEs: "Guilán",
        description: "Beautiful Hyrcanian forests and traditional villages",
        latitude: 37.2802,
        longitude: 49.5833,
      },
    }),
    prisma.province.create({
      data: {
        name: "خراسان رضوی",
        nameEn: "Khorasan Razavi",
        nameAr: "خراسان رضوی",
        nameRu: "Хорасан-Резави",
        nameZh: "拉扎维呼罗珊",
        nameEs: "Jorasán Razaví",
        description: "Home to Mashhad - Iran's holiest city",
        latitude: 36.2973,
        longitude: 59.6067,
      },
    }),
    prisma.province.create({
      data: {
        name: "یزد",
        nameEn: "Yazd",
        nameAr: "يزد",
        nameRu: "Йезд",
        nameZh: "亚兹德",
        nameEs: "Yazd",
        description: "Ancient desert city with unique windcatcher architecture",
        latitude: 31.8974,
        longitude: 54.3569,
      },
    }),
    prisma.province.create({
      data: {
        name: "آذربایجان شرقی",
        nameEn: "East Azerbaijan",
        nameAr: "أذربيجان الشرقية",
        nameRu: "Восточный Азербайджан",
        nameZh: "东阿塞拜疆",
        nameEs: "Azerbaiyán Oriental",
        description: "Historic Tabriz with UNESCO World Heritage sites",
        latitude: 38.08,
        longitude: 46.2919,
      },
    }),
    prisma.province.create({
      data: {
        name: "کرمان",
        nameEn: "Kerman",
        nameAr: "كرمان",
        nameRu: "Керман",
        nameZh: "克尔曼",
        nameEs: "Kermán",
        description: "Gateway to Lut Desert and ancient caravanserais",
        latitude: 30.2839,
        longitude: 57.0834,
      },
    }),
    prisma.province.create({
      data: {
        name: "سمنان",
        nameEn: "Semnan",
        nameAr: "سمنان",
        nameRu: "Семнан",
        nameZh: "塞姆南",
        nameEs: "Semnán",
        description: "Mountains and desert landscapes",
        latitude: 35.5769,
        longitude: 53.3862,
      },
    }),
  ]);

  console.log("Provinces created");

  // ==========================================
  // ATTRACTIONS
  // ==========================================
  const attractions = await Promise.all([
    // Tehran
    prisma.attraction.create({
      data: {
        name: "قلعه نیاوران",
        nameEn: "Niavaran Palace",
        type: "HISTORICAL",
        description: "Beautiful palace complex from the Qajar and Pahlavi eras",
        provinceId: provinces[0].id,
        latitude: 35.8047,
        longitude: 51.4813,
        isPopular: true,
      },
    }),
    // Isfahan
    prisma.attraction.create({
      data: {
        name: "نقش جهان",
        nameEn: "Naqsh-e Jahan Square",
        type: "HISTORICAL",
        description: "One of the largest squares in the world, UNESCO World Heritage",
        provinceId: provinces[1].id,
        latitude: 32.6583,
        longitude: 51.6778,
        isPopular: true,
      },
    }),
    prisma.attraction.create({
      data: {
        name: "سی و سه پل",
        nameEn: "Si-o-se-pol Bridge",
        type: "HISTORICAL",
        description: "Iconic 33-arch bridge over Zayandeh River",
        provinceId: provinces[1].id,
        latitude: 32.6436,
        longitude: 51.6684,
        isPopular: true,
      },
    }),
    // Shiraz
    prisma.attraction.create({
      data: {
        name: "تخت جمشید",
        nameEn: "Persepolis",
        type: "HISTORICAL",
        description: "Ceremonial capital of the Achaemenid Empire, UNESCO site",
        provinceId: provinces[2].id,
        latitude: 29.9353,
        longitude: 52.8914,
        isPopular: true,
      },
    }),
    prisma.attraction.create({
      data: {
        name: "باغ نارنجستان قوام",
        nameEn: "Naranjestan Garden",
        type: "RECREATIONAL",
        description: "Beautiful Qajar-era garden with stunning architecture",
        provinceId: provinces[2].id,
        latitude: 29.6071,
        longitude: 52.5493,
        isPopular: true,
      },
    }),
    // Mazandaran
    prisma.attraction.create({
      data: {
        name: "پارک جنگلی چالوس",
        nameEn: "Chaloos Forest Park",
        type: "NATURAL",
        description: "Beautiful Caspian forest with hiking trails",
        provinceId: provinces[3].id,
        latitude: 36.6497,
        longitude: 51.4222,
        isPopular: true,
      },
    }),
    // Gilan
    prisma.attraction.create({
      data: {
        name: "ماسوله",
        nameEn: "Masuleh Village",
        type: "NATURAL",
        description: "UNESCO-recognized stepped village in the mountains",
        provinceId: provinces[4].id,
        latitude: 37.1589,
        longitude: 49.0328,
        isPopular: true,
      },
    }),
    // Yazd
    prisma.attraction.create({
      data: {
        name: "بادگیرهای یزد",
        nameEn: "Yazd Windcatchers",
        type: "HISTORICAL",
        description: "Ancient windcatcher towers - symbol of desert architecture",
        provinceId: provinces[6].id,
        latitude: 31.8974,
        longitude: 54.3569,
        isPopular: true,
      },
    }),
    prisma.attraction.create({
      data: {
        name: "روستای کندوان",
        nameEn: "Kandovan Village",
        type: "HISTORICAL",
        description: "Unique cave village carved into volcanic rocks",
        provinceId: provinces[7].id,
        latitude: 37.7319,
        longitude: 46.2383,
        isPopular: true,
      },
    }),
    // Desert attractions
    prisma.attraction.create({
      data: {
        name: "کویر مرنجاب",
        nameEn: "Maranjab Desert",
        type: "NATURAL",
        description: "Stunning desert landscape with salt lake and sand dunes",
        provinceId: provinces[9].id,
        latitude: 34.5894,
        longitude: 51.9894,
        isPopular: true,
      },
    }),
  ]);

  console.log("Attractions created");

  // ==========================================
  // TOURS
  // ==========================================
  const tours = await Promise.all([
    // Tour 1: Mountaineering
    prisma.tour.create({
      data: {
        title: "صعود به قله دماوند",
        titleEn: "Mount Damavand Summit Expedition",
        slug: "mount-damavand-expedition",
        description: "تجربه صعود به بلندترین قله خاورمیانه با راهنمایان مجرب. دماوند با ارتفاع ۵۶۷۱ متر بلندترین قله ایران و خاورمیانه است.",
        descriptionEn: "Experience summiting the highest peak in the Middle East with experienced guides. Damavand at 5,671m is Iran's and the Middle East's tallest peak.",
        type: "MOUNTAIN",
        difficulty: "VERY_HARD",
        durationDays: 5,
        price: 850,
        capacity: 12,
        maxGroupSize: 8,
        location: "Mount Damavand, Mazandaran",
        province: "Mazandaran",
        city: "Rineh",
        latitude: 35.9514,
        longitude: 52.1096,
        includes: JSON.stringify([
          "Professional mountain guide",
          "All camping equipment",
          "Meals during trek",
          "Transportation from Tehran",
          "Emergency oxygen supply",
          "Certificate of summit"
        ]),
        excludes: JSON.stringify([
          "International flights",
          "Travel insurance",
          "Personal gear",
          "Tips for guide"
        ]),
        requirements: JSON.stringify([
          "Excellent physical fitness",
          "Previous high-altitude trekking experience",
          "Age 18-55 years",
          "Medical certificate required"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Transfer to Camp 1", description: "Drive from Tehran to Polour village and hike to Camp 1 (3,200m)", activities: ["Drive 3 hours", "Acclimatization hike"], accommodation: "Mountain hut" },
          { day: 2, title: "Camp 1 to Camp 2", description: "Trek to Camp 2 (4,200m)", activities: ["5 hour trek", "Acclimatization"], accommodation: "Camp 2 tent" },
          { day: 3, title: "Acclimatization Day", description: "Rest day with short hike", activities: ["Short hike to 4,800m", "Rest"], accommodation: "Camp 2 tent" },
          { day: 4, title: "Summit Day", description: "Early morning summit attempt (5,671m)", activities: ["Summit attempt", "Summit celebration"], accommodation: "Camp 2 tent" },
          { day: 5, title: "Descent and Return", description: "Descend to base and return to Tehran", activities: ["Descend to base", "Drive to Tehran"], accommodation: "Hotel in Tehran" }
        ]),
        status: "PUBLISHED",
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 45,
        totalBookings: 120,
        views: 3500,
        guideLang: "EN",
        createdBy: guide1.id,
        provinceId: provinces[3].id,
      },
    }),
    // Tour 2: Forest
    prisma.tour.create({
      data: {
        title: "طبیعت‌گردی جنگل‌های هیرکانی",
        titleEn: "Hyrcanian Forest Adventure",
        slug: "hyrcanian-forest-adventure",
        description: "سفر به دل جنگل‌های باستانی هیرکانی که از دوران ژوراسیک باقی مانده‌اند. این جنگل‌ها در فهرست میراث جهانی یونسکو ثبت شده‌اند.",
        descriptionEn: "Journey into the ancient Hyrcanian forests dating back to the Jurassic era. These forests are UNESCO World Heritage listed.",
        type: "FOREST",
        difficulty: "MODERATE",
        durationDays: 4,
        price: 450,
        capacity: 15,
        maxGroupSize: 12,
        location: "Hyrcanian Forest, Mazandaran",
        province: "Mazandaran",
        city: "Nour",
        latitude: 36.5662,
        longitude: 53.0989,
        includes: JSON.stringify([
          "Forest guide",
          "Accommodation in eco-lodge",
          "Meals",
          "Transportation",
          "Nature walk activities"
        ]),
        excludes: JSON.stringify([
          "Flights",
          "Travel insurance",
          "Personal expenses"
        ]),
        requirements: JSON.stringify([
          "Moderate fitness",
          "Comfortable hiking shoes",
          "Age 12+"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Arrival in Mazandaran", description: "Travel to eco-lodge near the forest", activities: ["Transfer", "Welcome dinner"], accommodation: "Eco-lodge" },
          { day: 2, title: "Deep Forest Trek", description: "Full day trek through ancient forest", activities: ["Forest trek", "Bird watching", "Waterfall visit"], accommodation: "Eco-lodge" },
          { day: 3, title: "Village Visit & Nature", description: "Visit local village and explore nature", activities: ["Village tour", "Local lunch", "Swimming"], accommodation: "Eco-lodge" },
          { day: 4, title: "Return", description: "Morning nature walk and return", activities: ["Sunrise hike", "Departure"], accommodation: "-" }
        ]),
        status: "PUBLISHED",
        isFeatured: true,
        averageRating: 4.6,
        totalReviews: 38,
        totalBookings: 95,
        views: 2800,
        guideLang: "EN",
        createdBy: guide1.id,
        provinceId: provinces[3].id,
      },
    }),
    // Tour 3: City Tour
    prisma.tour.create({
      data: {
        title: "تور فرهنگی اصفهان",
        titleEn: "Isfahan Cultural Heritage Tour",
        slug: "isfahan-cultural-heritage",
        description: "بازدید از شاهکارهای معماری اسلامی در نصف جهان. از میدان نقش جهان تا کاخ عالی قاپو.",
        descriptionEn: "Visit Islamic architectural masterpieces in Isfahan, half of the world. From Naqsh-e Jahan Square to Ali Qapu Palace.",
        type: "CITY",
        difficulty: "EASY",
        durationDays: 3,
        price: 320,
        capacity: 20,
        maxGroupSize: 15,
        location: "Isfahan, Iran",
        province: "Isfahan",
        city: "Isfahan",
        latitude: 32.6546,
        longitude: 51.668,
        includes: JSON.stringify([
          "Licensed cultural guide",
          "Hotel accommodation",
          "Breakfast and lunch",
          "All entrance fees",
          "Transportation within city"
        ]),
        excludes: JSON.stringify([
          "Flights",
          "Dinner",
          "Personal shopping"
        ]),
        requirements: JSON.stringify([
          "No special fitness required",
          "Comfortable walking shoes",
          "Modest dress code for mosques"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Naqsh-e Jahan Square", description: "Explore the magnificent square and its buildings", activities: ["Imam Mosque", "Sheikh Lotfollah Mosque", "Ali Qapu Palace", "Bazaar"], accommodation: "Traditional hotel" },
          { day: 2, title: "Historic Bridges & Gardens", description: "Walk along Zayandeh River and visit gardens", activities: ["Si-o-se-pol Bridge", "Khaju Bridge", "Chehel Sotoun Palace", "Jolfa Quarter"], accommodation: "Traditional hotel" },
          { day: 3, title: "Half Day & Departure", description: "Morning visit to Atiq Square", activities: ["Atiq Square", "Jameh Mosque", "Departure"], accommodation: "-" }
        ]),
        status: "PUBLISHED",
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 67,
        totalBookings: 210,
        views: 5200,
        guideLang: "EN",
        createdBy: guide2.id,
        provinceId: provinces[1].id,
      },
    }),
    // Tour 4: Village Tour
    prisma.tour.create({
      data: {
        title: "روستاگردی ماسوله و کندوان",
        titleEn: "Masuleh & Kandovan Village Discovery",
        slug: "masuleh-kandovan-villages",
        description: "بازدید از دو روستای شگفت‌انگیز ایران: ماسوله پلکانی و کندوان غاری.",
        descriptionEn: "Discover two of Iran's most spectacular villages: stepped Masuleh and cave-dwelling Kandovan.",
        type: "VILLAGE",
        difficulty: "MODERATE",
        durationDays: 5,
        price: 520,
        capacity: 12,
        maxGroupSize: 10,
        location: "Gilan & East Azerbaijan",
        province: "Gilan",
        city: "Masuleh",
        latitude: 37.1589,
        longitude: 49.0328,
        includes: JSON.stringify([
          "Village guide",
          "Traditional guesthouse stays",
          "All meals",
          "Transportation between villages",
          "Cultural activities"
        ]),
        excludes: JSON.stringify([
          "Flights",
          "Travel insurance",
          "Souvenirs"
        ]),
        requirements: JSON.stringify([
          "Moderate fitness for walking",
          "Comfortable shoes",
          "Open mind for cultural immersion"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Travel to Masuleh", description: "Drive through scenic roads to Masuleh", activities: ["Scenic drive", "Village exploration"], accommodation: "Traditional guesthouse" },
          { day: 2, title: "Masuleh Exploration", description: "Full day in Masuleh village", activities: ["Forest walk", "Local crafts", "Tea ceremony"], accommodation: "Traditional guesthouse" },
          { day: 3, title: "Transfer to Kandovan", description: "Travel to Kandovan via Tabriz", activities: ["Tabriz lunch", "Transfer to Kandovan"], accommodation: "Cave hotel" },
          { day: 4, title: "Kandovan Village", description: "Explore cave village", activities: ["Cave exploration", "Local lunch", "Hot springs"], accommodation: "Cave hotel" },
          { day: 5, title: "Return", description: "Morning in Kandovan and departure", activities: ["Morning walk", "Departure"], accommodation: "-" }
        ]),
        status: "PUBLISHED",
        isFeatured: true,
        averageRating: 4.7,
        totalReviews: 29,
        totalBookings: 78,
        views: 2100,
        guideLang: "EN",
        createdBy: guide2.id,
        provinceId: provinces[4].id,
      },
    }),
    // Tour 5: Desert Tour
    prisma.tour.create({
      data: {
        title: "ماجراجویی کویر لوت",
        titleEn: "Lut Desert Adventure",
        slug: "lut-desert-adventure",
        description: "سفر به یکی از گرم‌ترین نقاط زمین. کویر لوت با مناظر خیره‌کننده و آسمان پرستاره.",
        descriptionEn: "Journey to one of the hottest places on Earth. Lut Desert with stunning landscapes and starlit skies.",
        type: "NATURE",
        difficulty: "HARD",
        durationDays: 4,
        price: 680,
        capacity: 10,
        maxGroupSize: 8,
        location: "Lut Desert, Kerman",
        province: "Kerman",
        city: "Shahdad",
        latitude: 30.4,
        longitude: 58.0,
        includes: JSON.stringify([
          "Desert expert guide",
          "4x4 transportation",
          "All camping equipment",
          "All meals",
          "Stargazing equipment",
          "Photography sessions"
        ]),
        excludes: JSON.stringify([
          "Flights",
          "Travel insurance",
          "Personal gear"
        ]),
        requirements: JSON.stringify([
          "Good physical fitness",
          "Heat tolerance",
          "Age 18-50",
          "No claustrophobia"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Kerman to Shahdad", description: "Travel to desert edge", activities: ["Drive to Shahdad", "Kaluts tour"], accommodation: "Desert camp" },
          { day: 2, title: "Deep Desert", description: "Full day in the desert", activities: ["Sunrise photography", "Dune climbing", "Stargazing"], accommodation: "Desert camp" },
          { day: 3, title: "Exploration", description: "Visit historical sites", activities: ["Ancient village", "Salt lake", "Sand boarding"], accommodation: "Desert camp" },
          { day: 4, title: "Return", description: "Sunrise and return to Kerman", activities: ["Sunrise", "Return to Kerman"], accommodation: "-" }
        ]),
        status: "PUBLISHED",
        isFeatured: true,
        averageRating: 4.5,
        totalReviews: 22,
        totalBookings: 56,
        views: 1800,
        guideLang: "EN",
        createdBy: guide1.id,
        provinceId: provinces[8].id,
      },
    }),
    // Tour 6: Yazd Heritage
    prisma.tour.create({
      data: {
        title: "شهرگردی یزد تاریخی",
        titleEn: "Historic Yazd City Tour",
        slug: "historic-yazd-city-tour",
        description: "بازدید از شهر بادگیرها و معماری صحرایی یزد با تاریخ ۵۰۰۰ ساله.",
        descriptionEn: "Explore the city of windcatchers with 5000 years of history and unique desert architecture.",
        type: "CITY",
        difficulty: "EASY",
        durationDays: 2,
        price: 180,
        capacity: 20,
        maxGroupSize: 15,
        location: "Yazd, Iran",
        province: "Yazd",
        city: "Yazd",
        latitude: 31.8974,
        longitude: 54.3569,
        includes: JSON.stringify([
          "Licensed guide",
          "Hotel accommodation",
          "Breakfast",
          "Entrance fees",
          "Walking tour"
        ]),
        excludes: JSON.stringify([
          "Flights",
          "Lunch and dinner",
          "Shopping"
        ]),
        requirements: JSON.stringify([
          "No fitness requirements",
          "Comfortable shoes"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Historic Yazd", description: "Walk through the old city", activities: ["Amir Chakhmaq Complex", "Jameh Mosque", "Bazaar", "Traditional houses"], accommodation: "Traditional hotel" },
          { day: 2, title: "Fire Temple & Towers", description: "Visit Zoroastrian sites and windcatchers", activities: ["Fire Temple", "Towers of Silence", "Dowlat Abad Garden", "Water Museum"], accommodation: "-" }
        ]),
        status: "PUBLISHED",
        isFeatured: false,
        averageRating: 4.8,
        totalReviews: 52,
        totalBookings: 180,
        views: 3100,
        guideLang: "EN",
        createdBy: guide2.id,
        provinceId: provinces[6].id,
      },
    }),
    // Tour 7: Shiraz & Persepolis
    prisma.tour.create({
      data: {
        title: "شیراز و تخت جمشید",
        titleEn: "Shiraz & Persepolis Discovery",
        slug: "shiraz-persepolis-discovery",
        description: "سفر به شیراز شهر شاعران و بازدید از تخت جمشید، پایتخت باشکوه هخامنشیان.",
        descriptionEn: "Visit Shiraz, city of poets, and explore Persepolis, the magnificent Achaemenid capital.",
        type: "CITY",
        difficulty: "EASY",
        durationDays: 4,
        price: 420,
        capacity: 18,
        maxGroupSize: 15,
        location: "Shiraz, Iran",
        province: "Fars",
        city: "Shiraz",
        latitude: 29.5918,
        longitude: 52.5836,
        includes: JSON.stringify([
          "Cultural guide",
          "Hotel accommodation",
          "Daily breakfast and lunch",
          "Persepolis entrance fee",
          "Transportation"
        ]),
        excludes: JSON.stringify([
          "Flights",
          "Dinner",
          "Personal expenses"
        ]),
        requirements: JSON.stringify([
          "Basic walking ability",
          "Sun protection recommended"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Arrival in Shiraz", description: "Welcome to Shiraz", activities: ["Airport pickup", "Vakil Bazaar", "Nasir al-Mulk Mosque"], accommodation: "Boutique hotel" },
          { day: 2, title: "Persepolis & Necropolis", description: "Day trip to Persepolis", activities: ["Persepolis", "Naqsh-e Rostam", "Pasargadae"], accommodation: "Boutique hotel" },
          { day: 3, title: "Shiraz Gardens", description: "Explore Shiraz gardens", activities: ["Eram Garden", "Naranjestan", "Tomb of Hafez", "Tomb of Saadi"], accommodation: "Boutique hotel" },
          { day: 4, title: "Departure", description: "Last morning in Shiraz", activities: ["Free morning", "Departure"], accommodation: "-" }
        ]),
        status: "PUBLISHED",
        isFeatured: true,
        averageRating: 4.9,
        totalReviews: 83,
        totalBookings: 245,
        views: 4800,
        guideLang: "EN",
        createdBy: guide2.id,
        provinceId: provinces[2].id,
      },
    }),
    // Tour 8: Nature - Caspian
    prisma.tour.create({
      data: {
        title: "طبیعت‌گردی دریای خزر",
        titleEn: "Caspian Sea Nature Tour",
        slug: "caspian-sea-nature",
        description: "سفر به سواحل زیبای دریای خزر و گشت و گذار در طبیعت بکر شمال ایران.",
        descriptionEn: "Journey to the beautiful Caspian Sea coast and explore pristine nature of northern Iran.",
        type: "NATURE",
        difficulty: "EASY",
        durationDays: 3,
        price: 290,
        capacity: 16,
        maxGroupSize: 12,
        location: "Caspian Coast, Gilan",
        province: "Gilan",
        city: "Rasht",
        latitude: 37.2802,
        longitude: 49.5833,
        includes: JSON.stringify([
          "Guide",
          "Hotel accommodation",
          "Meals",
          "Activities",
          "Transportation"
        ]),
        excludes: JSON.stringify([
          "Flights",
          "Personal expenses"
        ]),
        requirements: JSON.stringify([
          "No special fitness required",
          "Swimwear for beach"
        ]),
        itinerary: JSON.stringify([
          { day: 1, title: "Arrival at Caspian", description: "Travel to Rasht", activities: ["Transfer", "Rasht bazaar", "Local food tour"], accommodation: "Beach hotel" },
          { day: 2, title: "Nature & Beach", description: "Forest and beach day", activities: ["Forest hike", "Beach time", "Seafood dinner"], accommodation: "Beach hotel" },
          { day: 3, title: "Return", description: "Morning beach walk", activities: ["Sunrise", "Return"], accommodation: "-" }
        ]),
        status: "PUBLISHED",
        isFeatured: false,
        averageRating: 4.4,
        totalReviews: 34,
        totalBookings: 88,
        views: 1900,
        guideLang: "EN",
        createdBy: guide1.id,
        provinceId: provinces[4].id,
      },
    }),
  ]);

  console.log("Tours created");

  // ==========================================
  // TOUR DATES
  // ==========================================
  const tourDates = await Promise.all([
    // Damavand dates
    prisma.tourDate.create({
      data: {
        tourId: tours[0].id,
        startDate: new Date("2026-06-15"),
        endDate: new Date("2026-06-19"),
        availableSpots: 8,
        maxCapacity: 8,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[0].id,
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-07-05"),
        availableSpots: 5,
        maxCapacity: 8,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[0].id,
        startDate: new Date("2026-07-15"),
        endDate: new Date("2026-07-19"),
        availableSpots: 8,
        maxCapacity: 8,
        isActive: true,
      },
    }),
    // Forest tour dates
    prisma.tourDate.create({
      data: {
        tourId: tours[1].id,
        startDate: new Date("2026-04-20"),
        endDate: new Date("2026-04-23"),
        availableSpots: 12,
        maxCapacity: 12,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[1].id,
        startDate: new Date("2026-05-10"),
        endDate: new Date("2026-05-13"),
        availableSpots: 10,
        maxCapacity: 12,
        isActive: true,
      },
    }),
    // Isfahan dates
    prisma.tourDate.create({
      data: {
        tourId: tours[2].id,
        startDate: new Date("2026-03-15"),
        endDate: new Date("2026-03-17"),
        availableSpots: 15,
        maxCapacity: 15,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[2].id,
        startDate: new Date("2026-04-05"),
        endDate: new Date("2026-04-07"),
        availableSpots: 12,
        maxCapacity: 15,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[2].id,
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-05-03"),
        availableSpots: 15,
        maxCapacity: 15,
        isActive: true,
      },
    }),
    // Village tour dates
    prisma.tourDate.create({
      data: {
        tourId: tours[3].id,
        startDate: new Date("2026-04-10"),
        endDate: new Date("2026-04-14"),
        availableSpots: 10,
        maxCapacity: 10,
        isActive: true,
      },
    }),
    // Desert tour dates
    prisma.tourDate.create({
      data: {
        tourId: tours[4].id,
        startDate: new Date("2026-03-20"),
        endDate: new Date("2026-03-23"),
        availableSpots: 8,
        maxCapacity: 8,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[4].id,
        startDate: new Date("2026-10-15"),
        endDate: new Date("2026-10-18"),
        availableSpots: 8,
        maxCapacity: 8,
        isActive: true,
      },
    }),
    // Yazd dates
    prisma.tourDate.create({
      data: {
        tourId: tours[5].id,
        startDate: new Date("2026-03-10"),
        endDate: new Date("2026-03-11"),
        availableSpots: 15,
        maxCapacity: 15,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[5].id,
        startDate: new Date("2026-04-15"),
        endDate: new Date("2026-04-16"),
        availableSpots: 15,
        maxCapacity: 15,
        isActive: true,
      },
    }),
    // Shiraz dates
    prisma.tourDate.create({
      data: {
        tourId: tours[6].id,
        startDate: new Date("2026-03-21"),
        endDate: new Date("2026-03-24"),
        availableSpots: 12,
        maxCapacity: 12,
        isActive: true,
      },
    }),
    prisma.tourDate.create({
      data: {
        tourId: tours[6].id,
        startDate: new Date("2026-04-20"),
        endDate: new Date("2026-04-23"),
        availableSpots: 15,
        maxCapacity: 15,
        isActive: true,
      },
    }),
    // Caspian dates
    prisma.tourDate.create({
      data: {
        tourId: tours[7].id,
        startDate: new Date("2026-05-15"),
        endDate: new Date("2026-05-17"),
        availableSpots: 12,
        maxCapacity: 12,
        isActive: true,
      },
    }),
  ]);

  console.log("Tour dates created");

  // ==========================================
  // TOUR ATTRACTIONS (Relations)
  // ==========================================
  await Promise.all([
    // Damavand attractions
    prisma.tourAttraction.create({
      data: { tourId: tours[0].id, attractionId: attractions[5].id, dayNumber: 1 },
    }),
    // Forest tour - attractions in Mazandaran
    prisma.tourAttraction.create({
      data: { tourId: tours[1].id, attractionId: attractions[5].id, dayNumber: 2 },
    }),
    // Isfahan tour
    prisma.tourAttraction.create({
      data: { tourId: tours[2].id, attractionId: attractions[1].id, dayNumber: 1 },
    }),
    prisma.tourAttraction.create({
      data: { tourId: tours[2].id, attractionId: attractions[2].id, dayNumber: 2 },
    }),
    // Village tour
    prisma.tourAttraction.create({
      data: { tourId: tours[3].id, attractionId: attractions[6].id, dayNumber: 1 },
    }),
    prisma.tourAttraction.create({
      data: { tourId: tours[3].id, attractionId: attractions[8].id, dayNumber: 3 },
    }),
    // Desert tour
    prisma.tourAttraction.create({
      data: { tourId: tours[4].id, attractionId: attractions[9].id, dayNumber: 1 },
    }),
    // Yazd tour
    prisma.tourAttraction.create({
      data: { tourId: tours[5].id, attractionId: attractions[7].id, dayNumber: 1 },
    }),
    // Shiraz tour
    prisma.tourAttraction.create({
      data: { tourId: tours[6].id, attractionId: attractions[3].id, dayNumber: 2 },
    }),
    prisma.tourAttraction.create({
      data: { tourId: tours[6].id, attractionId: attractions[4].id, dayNumber: 3 },
    }),
  ]);

  console.log("Tour-Attraction relations created");

  // ==========================================
  // REVIEWS
  // ==========================================
  await Promise.all([
    prisma.review.create({
      data: {
        userId: user1.id,
        tourId: tours[0].id,
        rating: 5,
        title: "Life-changing experience!",
        comment: "Summiting Damavand was the highlight of my life. The guides were incredible and the organization was perfect.",
        pros: "Professional guides, great equipment, stunning views",
        cons: "Very challenging physically",
        travelDate: new Date("2025-07-10"),
        isVerified: true,
        isApproved: true,
        helpfulCount: 12,
      },
    }),
    prisma.review.create({
      data: {
        userId: user2.id,
        tourId: tours[0].id,
        rating: 5,
        title: "Amazing adventure",
        comment: "The whole expedition was well organized. Every detail was taken care of.",
        pros: "Beautiful scenery, excellent food, friendly guides",
        cons: "Could use more rest days",
        travelDate: new Date("2025-06-20"),
        isVerified: true,
        isApproved: true,
        helpfulCount: 8,
      },
    }),
    prisma.review.create({
      data: {
        userId: user1.id,
        tourId: tours[2].id,
        rating: 5,
        title: "Isfahan is truly half the world",
        comment: "Every corner of Isfahan is a masterpiece. The guide was incredibly knowledgeable about Islamic architecture.",
        pros: "Rich history, beautiful architecture, amazing food",
        cons: "Wished we had more time",
        travelDate: new Date("2025-10-15"),
        isVerified: true,
        isApproved: true,
        helpfulCount: 15,
      },
    }),
    prisma.review.create({
      data: {
        userId: user3.id,
        tourId: tours[2].id,
        rating: 4,
        title: "Great cultural tour",
        comment: "A wonderful experience exploring Isfahan's heritage. The hotel was comfortable and the guide was professional.",
        pros: "Great itinerary, knowledgeable guide",
        cons: "Some restaurants were crowded",
        travelDate: new Date("2025-11-05"),
        isVerified: true,
        isApproved: true,
        helpfulCount: 6,
      },
    }),
    prisma.review.create({
      data: {
        userId: user2.id,
        tourId: tours[4].id,
        rating: 5,
        title: "Desert magic",
        comment: "The Lut Desert is otherworldly. Sleeping under the stars and watching the sunrise over the kaluts was magical.",
        pros: "Unique landscape, stargazing, adventure",
        cons: "Very hot during the day",
        travelDate: new Date("2025-10-20"),
        isVerified: true,
        isApproved: true,
        helpfulCount: 10,
      },
    }),
    prisma.review.create({
      data: {
        userId: user3.id,
        tourId: tours[6].id,
        rating: 5,
        title: "Persepolis exceeded expectations",
        comment: "Standing in Persepolis and feeling the history was overwhelming. Shiraz is a beautiful city with amazing gardens.",
        pros: "Historical significance, beautiful gardens, great food",
        cons: "Summer can be very hot",
        travelDate: new Date("2025-04-10"),
        isVerified: true,
        isApproved: true,
        helpfulCount: 18,
      },
    }),
  ]);

  console.log("Reviews created");

  // ==========================================
  // ARTICLES
  // ==========================================
  await Promise.all([
    prisma.article.create({
      data: {
        title: "راهنمای کامل سفر به ایران",
        titleEn: "Complete Guide to Traveling in Iran",
        slug: "complete-guide-traveling-iran",
        content: "Iran is a land of contrasts where ancient history meets modern life. From the bustling bazaars of Tehran to the serene gardens of Shiraz, every city tells a different story...",
        contentEn: "Iran is a land of contrasts where ancient history meets modern life. From the bustling bazaars of Tehran to the serene gardens of Shiraz, everything is different...",
        excerpt: "Everything you need to know before your first trip to Iran",
        excerptEn: "Everything you need to know before your first trip to Iran",
        category: "TRAVEL_GUIDE",
        tags: JSON.stringify(["travel", "guide", "iran", "tips"]),
        authorId: superAdmin.id,
        isPublished: true,
        isFeatured: true,
        views: 2450,
        publishedAt: new Date("2025-12-01"),
      },
    }),
    prisma.article.create({
      data: {
        title: "۱۰ غذایی که در ایران باید بخورید",
        titleEn: "10 Foods You Must Try in Iran",
        slug: "10-must-try-foods-iran",
        content: "Iranian cuisine is one of the world's most sophisticated culinary traditions...",
        contentEn: "Iranian cuisine is one of the world's most sophisticated culinary traditions...",
        excerpt: "From kebab to tahdig, discover the flavors of Iran",
        excerptEn: "From kebab to tahdig, discover the flavors of Iran",
        category: "FOOD",
        tags: JSON.stringify(["food", "cuisine", "iran", "kebab"]),
        authorId: superAdmin.id,
        isPublished: true,
        isFeatured: true,
        views: 1890,
        publishedAt: new Date("2025-11-15"),
      },
    }),
    prisma.article.create({
      data: {
        title: "بهترین زمان سفر به ایران",
        titleEn: "Best Time to Visit Iran",
        slug: "best-time-visit-iran",
        content: "Iran has a diverse climate and can be visited year-round depending on your interests...",
        contentEn: "Iran has a diverse climate and can be visited year-round depending on your interests...",
        excerpt: "A seasonal guide to planning your perfect Iran trip",
        excerptEn: "A seasonal guide to planning your perfect Iran trip",
        category: "TRAVEL_GUIDE",
        tags: JSON.stringify(["weather", "seasons", "planning"]),
        authorId: superAdmin.id,
        isPublished: true,
        views: 1560,
        publishedAt: new Date("2025-10-20"),
      },
    }),
    prisma.article.create({
      data: {
        title: "آداب و رسوم ایرانی",
        titleEn: "Iranian Customs and Etiquette",
        slug: "iranian-customs-etiquette",
        content: "Understanding local customs will make your trip more enjoyable and respectful...",
        contentEn: "Understanding local customs will make your trip more enjoyable and respectful...",
        excerpt: "Essential cultural tips for visitors to Iran",
        excerptEn: "Essential cultural tips for visitors to Iran",
        category: "CULTURE",
        tags: JSON.stringify(["culture", "etiquette", "customs"]),
        authorId: superAdmin.id,
        isPublished: true,
        views: 980,
        publishedAt: new Date("2025-09-10"),
      },
    }),
  ]);

  console.log("Articles created");

  // ==========================================
  // SLIDERS
  // ==========================================
  await Promise.all([
    prisma.slider.create({
      data: {
        title: "ایران، سرزمین بهشت",
        titleEn: "Iran, Land of Paradise",
        subtitle: "کشف زیبایی‌های شگفت‌انگیز ایران",
        subtitleEn: "Discover the wonders of Iran",
        image: "/images/slider/damavand.jpg",
        link: "/tours?type=MOUNTAIN",
        buttonText: "تورهای کوهنوردی",
        buttonTextEn: "Mountain Tours",
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.slider.create({
      data: {
        title: "نصف جهان، اصفهان",
        titleEn: "Half the World, Isfahan",
        subtitle: "معماری اسلامی بی‌نظیر",
        subtitleEn: "Unparalleled Islamic Architecture",
        image: "/images/slider/isfahan.jpg",
        link: "/tours?type=CITY",
        buttonText: "تورهای شهرگردی",
        buttonTextEn: "City Tours",
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.slider.create({
      data: {
        title: "ماجراجویی در کویر",
        titleEn: "Desert Adventure",
        subtitle: "تجربه‌ای بی‌نظیر در دل طبیعت",
        subtitleEn: "An unforgettable experience in nature",
        image: "/images/slider/desert.jpg",
        link: "/tours?type=NATURE",
        buttonText: "تورهای طبیعت‌گردی",
        buttonTextEn: "Nature Tours",
        sortOrder: 3,
        isActive: true,
      },
    }),
  ]);

  console.log("Sliders created");

  // ==========================================
  // COUPONS
  // ==========================================
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: "WELCOME10",
        description: "10% off for first-time visitors",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minPurchase: 200,
        usageLimit: 100,
        isActive: true,
        validFrom: new Date("2026-01-01"),
        validUntil: new Date("2026-12-31"),
      },
    }),
    prisma.coupon.create({
      data: {
        code: "SPRING2026",
        description: "$50 off on spring tours",
        discountType: "FIXED",
        discountValue: 50,
        minPurchase: 300,
        usageLimit: 50,
        isActive: true,
        validFrom: new Date("2026-03-01"),
        validUntil: new Date("2026-05-31"),
      },
    }),
  ]);

  console.log("Coupons created");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
