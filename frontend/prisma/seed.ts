import { PrismaClient, Role, TourStatus, BookingStatus } from "./../src/generated/prisma/client.js";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSQL({
  url: "file:./prisma/dev.db",
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
      role: Role.SUPER_ADMIN,
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
      role: Role.GUIDE,
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
      role: Role.GUIDE,
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
      role: Role.USER,
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
      role: Role.USER,
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
      role: Role.USER,
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
    prisma.province.create({ data: { name: "آذربایجان شرقی", nameEn: "East Azerbaijan", nameAr: "أذربيجان الشرقية", nameRu: "Восточный Азербайджан", nameZh: "东阿塞拜疆", nameEs: "Azerbaiyán Oriental", description: "Historic Tabriz with UNESCO World Heritage sites", latitude: 38.08, longitude: 46.2919 } }),
    prisma.province.create({ data: { name: "آذربایجان غربی", nameEn: "West Azerbaijan", nameAr: "أذربيجان الغربية", nameRu: "Западный Азербайджан", nameZh: "西阿塞拜疆", nameEs: "Azerbaiyán Occidental", description: "Lake Urmia and Kurdish cultural heritage", latitude: 37.48, longitude: 45.0 } }),
    prisma.province.create({ data: { name: "اردبیل", nameEn: "Ardabil", nameAr: "أردبيل", nameRu: "Ардебиль", nameZh: "阿尔达比勒", nameEs: "Ardabil", description: "Sareyn hot springs and Sabalan mountain", latitude: 38.25, longitude: 48.29 } }),
    prisma.province.create({ data: { name: "اصفهان", nameEn: "Isfahan", nameAr: "أصفهان", nameRu: "Исфахан", nameZh: "伊斯法罕", nameEs: "Isfahán", description: "Half of the world - historic city with stunning Islamic architecture", latitude: 32.6546, longitude: 51.668 } }),
    prisma.province.create({ data: { name: "البرز", nameEn: "Alborz", nameAr: "ألبرز", nameRu: "Альборз", nameZh: "阿尔博兹", nameEs: "Alborz", description: "Tochal and Darbandsar ski resorts near Tehran", latitude: 35.99, longitude: 50.93 } }),
    prisma.province.create({ data: { name: "ایلام", nameEn: "Ilam", nameAr: "إيلام", nameRu: "Илам", nameZh: "伊拉姆", nameEs: "Ilam", description: "Beautiful mountains and Kurdish culture", latitude: 33.63, longitude: 46.42 } }),
    prisma.province.create({ data: { name: "بوشهر", nameEn: "Bushehr", nameAr: "بوشهر", nameRu: "Бушир", nameZh: "布什尔", nameEs: "Bushehr", description: "Persian Gulf coast and ancient ports", latitude: 28.92, longitude: 50.84 } }),
    prisma.province.create({ data: { name: "چهارمحال و بختیاری", nameEn: "Chaharmahal and Bakhtiari", nameAr: "چهارمحال و بختیاری", nameRu: "Чехармахаль и Бахтиярия", nameZh: "恰哈马哈勒和巴赫蒂亚里", nameEs: "Chaharmahal y Bajtiarí", description: "Zagros mountains and pastoral nomadic culture", latitude: 32.0, longitude: 50.85 } }),
    prisma.province.create({ data: { name: "خراسان جنوبی", nameEn: "South Khorasan", nameAr: "خراسان الجنوبية", nameRu: "Южный Хорасан", nameZh: "南呼罗珊", nameEs: "Jorasan Meridional", description: "Birjand fortress and desert landscapes", latitude: 32.32, longitude: 59.22 } }),
    prisma.province.create({ data: { name: "خراسان رضوی", nameEn: "Khorasan Razavi", nameAr: "خراسان رضوی", nameRu: "Хорасан-Резави", nameZh: "拉扎维呼罗珊", nameEs: "Jorasán Razaví", description: "Home to Mashhad - Iran's holiest city", latitude: 36.2973, longitude: 59.6067 } }),
    prisma.province.create({ data: { name: "خراسان شمالی", nameEn: "North Khorasan", nameAr: "خراسان الشمالية", nameRu: "Северный Хорасан", nameZh: "北呼罗珊", nameEs: "Jorasan Septentrional", description: "Bojnurd and Golestan National Park", latitude: 37.47, longitude: 57.33 } }),
    prisma.province.create({ data: { name: "خوزستان", nameEn: "Khuzestan", nameAr: "خوزستان", nameRu: "Хузестан", nameZh: "胡齐斯坦", nameEs: "Juzestán", description: "Ancient Susa and Persian Gulf oil region", latitude: 31.43, longitude: 48.69 } }),
    prisma.province.create({ data: { name: "زنجان", nameEn: "Zanjan", nameAr: "زنجان", nameRu: "Зенджан", nameZh: "赞詹", nameEs: "Zanyán", description: "Sultaniyya dome and lead mine", latitude: 36.68, longitude: 48.49 } }),
    prisma.province.create({ data: { name: "سمنان", nameEn: "Semnan", nameAr: "سمنان", nameRu: "Семнан", nameZh: "塞姆南", nameEs: "Semnán", description: "Mountains and desert landscapes", latitude: 35.5769, longitude: 53.3862 } }),
    prisma.province.create({ data: { name: "سیستان و بلوچستان", nameEn: "Sistan and Baluchestan", nameAr: "سیستان و بلوچستان", nameRu: "Систан и Белуджистан", nameEs: "Sistán y Baluchistán", description: "Ancient Sistan civilization and Makran coast", latitude: 27.52, longitude: 60.58 } }),
    prisma.province.create({ data: { name: "فارس", nameEn: "Fars", nameAr: "فارس", nameRu: "Фарс", nameZh: "法尔斯", nameEs: "Fars", description: "Land of poets, wine, and Persepolis", latitude: 29.5918, longitude: 52.5836 } }),
    prisma.province.create({ data: { name: "قزوین", nameEn: "Qazvin", nameAr: "قزوین", nameRu: "Казвин", nameZh: "加兹温", nameEs: "Qazvín", description: "Historic capital of Safavid dynasty", latitude: 36.27, longitude: 50.0 } }),
    prisma.province.create({ data: { name: "قم", nameEn: "Qom", nameAr: "قم", nameRu: "Кум", nameZh: "库姆", nameEs: "Qom", description: "Holy shrine of Fatima Masumeh", latitude: 34.64, longitude: 50.88 } }),
    prisma.province.create({ data: { name: "کردستان", nameEn: "Kurdistan", nameAr: "كردستان", nameRu: "Курдистан", nameZh: "库尔德斯坦", nameEs: "Kurdistán", description: "Kurdish culture and Hawraman valley", latitude: 35.32, longitude: 47.0 } }),
    prisma.province.create({ data: { name: "کرمان", nameEn: "Kerman", nameAr: "كرمان", nameRu: "Керман", nameZh: "克尔曼", nameEs: "Kermán", description: "Gateway to Lut Desert and ancient caravanserais", latitude: 30.2839, longitude: 57.0834 } }),
    prisma.province.create({ data: { name: "کرمانشاه", nameEn: "Kermanshah", nameAr: "كرمانشاه", nameRu: "Керманшах", nameZh: "克尔曼沙赫", nameEs: "Kermanshah", description: "Bisotun inscription and Taq-e Bostan carvings", latitude: 34.31, longitude: 47.07 } }),
    prisma.province.create({ data: { name: "کهگیلویه و بویراحمد", nameEn: "Kohgiluyeh and Boyer-Ahmad", nameAr: "کهگیلویه و بویراحمد", nameRu: "Кохгильуйе и Бойерахмед", nameEs: "Kohgiluyeh y Boyer-Ahmad", description: "Dena mountain range and pristine nature", latitude: 30.72, longitude: 51.6 } }),
    prisma.province.create({ data: { name: "گلستان", nameEn: "Golestan", nameAr: "گلستان", nameRu: "Голестан", nameZh: "戈莱斯坦", nameEs: "Golestán", description: "Golestan National Park and Turkmen heritage", latitude: 37.28, longitude: 55.14 } }),
    prisma.province.create({ data: { name: "گیلان", nameEn: "Gilan", nameAr: "گیلان", nameRu: "Гилан", nameZh: "吉兰", nameEs: "Guilán", description: "Beautiful Hyrcanian forests and traditional villages", latitude: 37.2802, longitude: 49.5833 } }),
    prisma.province.create({ data: { name: "لرستان", nameEn: "Lorestan", nameAr: "لرستان", nameRu: "Лурестан", nameZh: "洛雷斯坦", nameEs: "Lorestan", description: "Waterfalls and ancient Lurish civilization", latitude: 33.48, longitude: 48.35 } }),
    prisma.province.create({ data: { name: "مازندران", nameEn: "Mazandaran", nameAr: "مازندران", nameRu: "Мазендеран", nameZh: "马赞德兰", nameEs: "Mazandarán", description: "Lush green forests and Caspian Sea coastline", latitude: 36.5662, longitude: 53.0989 } }),
    prisma.province.create({ data: { name: "مرکزی", nameEn: "Markazi", nameAr: "مرکزی", nameRu: "Меркези", nameZh: "中央省", nameEs: "Markazí", description: "Arak industrial city and ancient sites", latitude: 34.09, longitude: 49.69 } }),
    prisma.province.create({ data: { name: "هرمزگان", nameEn: "Hormozgan", nameAr: "هرمزگان", nameRu: "Хормозган", nameZh: "霍尔木兹甘", nameEs: "Hormozgán", description: "Qeshm Island and Strait of Hormuz", latitude: 27.19, longitude: 56.27 } }),
    prisma.province.create({ data: { name: "همدان", nameEn: "Hamedan", nameAr: "همدان", nameRu: "Хамадан", nameZh: "哈马丹", nameEs: "Hamadán", description: "Ancient Ecbatana and Avicenna's tomb", latitude: 34.8, longitude: 48.52 } }),
    prisma.province.create({ data: { name: "یزد", nameEn: "Yazd", nameAr: "يزد", nameRu: "Йезд", nameZh: "亚兹德", nameEs: "Yazd", description: "Ancient desert city with unique windcatcher architecture", latitude: 31.8974, longitude: 54.3569 } }),
    prisma.province.create({ data: { name: "تهران", nameEn: "Tehran", nameAr: "طهران", nameRu: "Тегерان", nameZh: "德黑兰", nameEs: "Teherán", description: "Capital city of Iran with rich history and modern attractions", latitude: 35.6892, longitude: 51.389 } }),
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
        imageUrl: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&h=500&fit=crop",
        description: "تجربه صعود به بلندترین قله خاورمیانه با راهنمایان مجرب. دماوند با ارتفاع ۵۶۷۱ متر بلندترین قله ایران و خاورمیانه است.",
        descriptionEn: "Experience summiting the highest peak in the Middle East with experienced guides. Damavand at 5,671m is Iran's and the Middle East's tallest peak.",
        type: "MOUNTAIN",
        difficulty: "VERY_HARD",
        durationDays: 5,
        price: 850,
        capacity: 12,
        maxGroupSize: 8,
        location: "Mount Damavand, Mazandaran",
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
        status: TourStatus.PUBLISHED,
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
        imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=500&fit=crop",
        description: "سفر به دل جنگل‌های باستانی هیرکانی که از دوران ژوراسیک باقی مانده‌اند. این جنگل‌ها در فهرست میراث جهانی یونسکو ثبت شده‌اند.",
        descriptionEn: "Journey into the ancient Hyrcanian forests dating back to the Jurassic era. These forests are UNESCO World Heritage listed.",
        type: "FOREST",
        difficulty: "MODERATE",
        durationDays: 4,
        price: 450,
        capacity: 15,
        maxGroupSize: 12,
        location: "Hyrcanian Forest, Mazandaran",
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
        status: TourStatus.PUBLISHED,
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
        imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=500&fit=crop",
        description: "بازدید از شاهکارهای معماری اسلامی در نصف جهان. از میدان نقش جهان تا کاخ عالی قاپو.",
        descriptionEn: "Visit Islamic architectural masterpieces in Isfahan, half of the world. From Naqsh-e Jahan Square to Ali Qapu Palace.",
        type: "CITY",
        difficulty: "EASY",
        durationDays: 3,
        price: 320,
        capacity: 20,
        maxGroupSize: 15,
        location: "Isfahan, Iran",
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
        status: TourStatus.PUBLISHED,
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
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
        description: "بازدید از دو روستای شگفت‌انگیز ایران: ماسوله پلکانی و کندوان غاری.",
        descriptionEn: "Discover two of Iran's most spectacular villages: stepped Masuleh and cave-dwelling Kandovan.",
        type: "VILLAGE",
        difficulty: "MODERATE",
        durationDays: 5,
        price: 520,
        capacity: 12,
        maxGroupSize: 10,
        location: "Gilan & East Azerbaijan",
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
        status: TourStatus.PUBLISHED,
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
        imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=500&fit=crop",
        description: "سفر به یکی از گرم‌ترین نقاط زمین. کویر لوت با مناظر خیره‌کننده و آسمان پرستاره.",
        descriptionEn: "Journey to one of the hottest places on Earth. Lut Desert with stunning landscapes and starlit skies.",
        type: "NATURE",
        difficulty: "HARD",
        durationDays: 4,
        price: 680,
        capacity: 10,
        maxGroupSize: 8,
        location: "Lut Desert, Kerman",
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
        status: TourStatus.PUBLISHED,
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
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=500&fit=crop",
        description: "بازدید از شهر بادگیرها و معماری صحرایی یزد با تاریخ ۵۰۰۰ ساله.",
        descriptionEn: "Explore the city of windcatchers with 5000 years of history and unique desert architecture.",
        type: "CITY",
        difficulty: "EASY",
        durationDays: 2,
        price: 180,
        capacity: 20,
        maxGroupSize: 15,
        location: "Yazd, Iran",
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
        status: TourStatus.PUBLISHED,
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
        imageUrl: "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=500&fit=crop",
        description: "سفر به شیراز شهر شاعران و بازدید از تخت جمشید، پایتخت باشکوه هخامنشیان.",
        descriptionEn: "Visit Shiraz, city of poets, and explore Persepolis, the magnificent Achaemenid capital.",
        type: "CITY",
        difficulty: "EASY",
        durationDays: 4,
        price: 420,
        capacity: 18,
        maxGroupSize: 15,
        location: "Shiraz, Iran",
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
        status: TourStatus.PUBLISHED,
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
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
        description: "سفر به سواحل زیبای دریای خزر و گشت و گذار در طبیعت بکر شمال ایران.",
        descriptionEn: "Journey to the beautiful Caspian Sea coast and explore pristine nature of northern Iran.",
        type: "NATURE",
        difficulty: "EASY",
        durationDays: 3,
        price: 290,
        capacity: 16,
        maxGroupSize: 12,
        location: "Caspian Coast, Gilan",
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
        status: TourStatus.PUBLISHED,
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
  // PAST TOURS (ARCHIVE)
  // ==========================================
  await Promise.all([
    prisma.pastTour.create({
      data: {
        tourId: tours[0].id,
        title: "Damavand Summit - Summer 2025",
        titleFa: "قله دماوند - تابستان ۱۴۰۴",
        description: "Successful summit expedition with 8 climbers reaching the peak at dawn.",
        descriptionFa: "اکسپدیشن موفقیت‌آمیز صعود به قله با ۸ کوهنورد در سپیده دم",
        date: new Date("2025-07-15"),
        guideName: "Ahmad Rezaei",
        guideNameFa: "احمد رضایی",
        location: "Mount Damavand, 5671m",
        locationFa: "قله دماوند، ۵۶۷۱ متر",
        photos: 124,
        imageUrl: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&h=500&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
        ]),
        highlights: JSON.stringify(["Summit at 5671m", "Sunrise above clouds", "Salt lake camp"]),
        highlightsFa: JSON.stringify(["قله ۵۶۷۱ متری", "طلوع خورشید بالای ابرها", "اردوگاه دریاچه نمک"]),
        participants: 8,
        rating: 4.8,
        weather: "Clear, -5°C at summit",
        weatherFa: "صاف، منفی ۵ درجه در قله",
      },
    }),
    prisma.pastTour.create({
      data: {
        tourId: tours[2].id,
        title: "Isfahan Cultural Heritage - Nowruz 2025",
        titleFa: "تور فرهنگی اصفهان - نوروز ۱۴۰۴",
        description: "Special Nowruz tour visiting Naqsh-e Jahan during celebrations.",
        descriptionFa: "تور ویژه نوروز با بازدید از نقش جهان در جشن‌ها",
        date: new Date("2025-04-01"),
        guideName: "Sara Hosseini",
        guideNameFa: "سارا حسینی",
        location: "Isfahan, Iran",
        locationFa: "اصفهان، ایران",
        photos: 89,
        imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=500&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400",
          "https://images.unsplash.com/photo-1577948000111-9c9808574f43?w=400",
        ]),
        highlights: JSON.stringify(["Naqsh-e Jahan Square", "Si-o-se-pol Bridge", "Traditional bazaar"]),
        highlightsFa: JSON.stringify(["میدان نقش جهان", "سی و سه پل", "بازار سنتی"]),
        participants: 12,
        rating: 4.9,
        weather: "Pleasant, 22°C",
        weatherFa: "مطبوع، ۲۲ درجه",
      },
    }),
    prisma.pastTour.create({
      data: {
        tourId: tours[4].id,
        title: "Lut Desert Stargazing - Autumn 2025",
        titleFa: "ستاره‌شناسی کویر لوت - پاییز ۱۴۰۴",
        description: "Unforgettable desert adventure with Milky Way photography workshop.",
        descriptionFa: "ماجراجویی فراموش‌نشدنی کویر با کارگاه عکاسی از کهکشان راه شیری",
        date: new Date("2025-10-20"),
        guideName: "Ahmad Rezaei",
        guideNameFa: "احمد رضایی",
        location: "Lut Desert, Kerman",
        locationFa: "کویر لوت، کرمان",
        photos: 203,
        imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=500&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400",
          "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
        ]),
        highlights: JSON.stringify(["Kaluts formation", "Milky Way photography", "Sand dunes sunset"]),
        highlightsFa: JSON.stringify(["گودال‌های ریگ‌بلند", "عکاسی از کهکشان راه شیری", "غروب در تپه‌های شنی"]),
        participants: 6,
        rating: 5.0,
        weather: "Clear skies, 18°C",
        weatherFa: "آسمان صاف، ۱۸ درجه",
      },
    }),
    prisma.pastTour.create({
      data: {
        tourId: tours[6].id,
        title: "Shiraz & Persepolis - Spring 2025",
        titleFa: "شیراز و تخت جمشید - بهار ۱۴۰۴",
        description: "Exploring the ancient Achaemenid capital and beautiful Shiraz gardens.",
        descriptionFa: "بازدید از پایتخت باشکوه هخامنشی و باغ‌های زیبای شیراز",
        date: new Date("2025-04-10"),
        guideName: "Sara Hosseini",
        guideNameFa: "سارا حسینی",
        location: "Shiraz, Iran",
        locationFa: "شیراز، ایران",
        photos: 156,
        imageUrl: "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=500&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=400",
          "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=400",
        ]),
        highlights: JSON.stringify(["Persepolis", "Nasir al-Mulk Mosque", "Eram Garden"]),
        highlightsFa: JSON.stringify(["تخت جمشید", "مسجد نصیرالملک", "باغ ارم"]),
        participants: 14,
        rating: 4.9,
        weather: "Warm, 25°C",
        weatherFa: "گرم، ۲۵ درجه",
      },
    }),
  ]);

  console.log("Past tours created");

  // ==========================================
  // BOOKINGS (Sample data)
  // ==========================================
  await Promise.all([
    prisma.booking.create({
      data: {
        userId: user1.id,
        tourId: tours[0].id,
        tourDateId: tourDates[0].id,
        numberOfGuests: 2,
        totalPrice: 1700,
        finalPrice: 1700,
        status: BookingStatus.COMPLETED,
        paymentMethod: "stripe",
        guestName: "John Smith",
        guestEmail: "john@example.com",
        guestCountry: "United States",
        paidAt: new Date("2025-06-01"),
        confirmedAt: new Date("2025-06-02"),
        completedAt: new Date("2025-07-19"),
      },
    }),
    prisma.booking.create({
      data: {
        userId: user1.id,
        tourId: tours[2].id,
        tourDateId: tourDates[5].id,
        numberOfGuests: 1,
        totalPrice: 320,
        finalPrice: 320,
        status: BookingStatus.COMPLETED,
        paymentMethod: "stripe",
        guestName: "John Smith",
        guestEmail: "john@example.com",
        guestCountry: "United States",
        paidAt: new Date("2025-02-15"),
        confirmedAt: new Date("2025-02-16"),
        completedAt: new Date("2025-03-17"),
      },
    }),
    prisma.booking.create({
      data: {
        userId: user2.id,
        tourId: tours[4].id,
        tourDateId: tourDates[9].id,
        numberOfGuests: 2,
        totalPrice: 1360,
        discountAmount: 50,
        finalPrice: 1310,
        status: BookingStatus.COMPLETED,
        paymentMethod: "stripe",
        couponCode: "SPRING2026",
        guestName: "Maria Garcia",
        guestEmail: "maria@example.com",
        guestCountry: "Spain",
        paidAt: new Date("2025-10-01"),
        confirmedAt: new Date("2025-10-02"),
        completedAt: new Date("2025-10-23"),
      },
    }),
    prisma.booking.create({
      data: {
        userId: user3.id,
        tourId: tours[2].id,
        tourDateId: tourDates[6].id,
        numberOfGuests: 3,
        totalPrice: 960,
        finalPrice: 960,
        status: BookingStatus.COMPLETED,
        paymentMethod: "stripe",
        guestName: "Ali Ahmadi",
        guestEmail: "ali@example.com",
        guestCountry: "Iran",
        paidAt: new Date("2025-03-20"),
        confirmedAt: new Date("2025-03-21"),
        completedAt: new Date("2025-04-07"),
      },
    }),
    prisma.booking.create({
      data: {
        userId: user1.id,
        tourId: tours[6].id,
        tourDateId: tourDates[14].id,
        numberOfGuests: 2,
        totalPrice: 840,
        finalPrice: 840,
        status: BookingStatus.CONFIRMED,
        paymentMethod: "stripe",
        guestName: "John Smith",
        guestEmail: "john@example.com",
        guestCountry: "United States",
        paidAt: new Date("2026-03-01"),
        confirmedAt: new Date("2026-03-02"),
      },
    }),
    prisma.booking.create({
      data: {
        userId: user2.id,
        tourId: tours[0].id,
        tourDateId: tourDates[1].id,
        numberOfGuests: 1,
        totalPrice: 850,
        finalPrice: 850,
        status: BookingStatus.CONFIRMED,
        paymentMethod: "stripe",
        guestName: "Maria Garcia",
        guestEmail: "maria@example.com",
        guestCountry: "Spain",
        paidAt: new Date("2026-06-15"),
        confirmedAt: new Date("2026-06-16"),
      },
    }),
    prisma.booking.create({
      data: {
        userId: user3.id,
        tourId: tours[3].id,
        tourDateId: tourDates[8].id,
        numberOfGuests: 2,
        totalPrice: 1040,
        finalPrice: 1040,
        status: BookingStatus.PENDING,
        guestName: "Ali Ahmadi",
        guestEmail: "ali@example.com",
        guestCountry: "Iran",
      },
    }),
    prisma.booking.create({
      data: {
        userId: user1.id,
        tourId: tours[1].id,
        tourDateId: tourDates[3].id,
        numberOfGuests: 1,
        totalPrice: 450,
        finalPrice: 450,
        status: BookingStatus.CANCELLED,
        cancelReason: "Schedule conflict",
        guestName: "John Smith",
        guestEmail: "john@example.com",
        guestCountry: "United States",
        createdAt: new Date("2025-03-01"),
        cancelledAt: new Date("2025-03-15"),
      },
    }),
  ]);

  console.log("Bookings created");

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
        image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1200&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=600&fit=crop",
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
