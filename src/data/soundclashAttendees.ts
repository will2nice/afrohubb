// Soundclash Vol. 7 Austin: Afrobeats vs Dancehall — 328 attendees, 150 with profiles

export interface SoundclashAttendee {
  id: number;
  name: string;
  age: number;
  gender: "female" | "male";
  photo: string;
  bio: string;
  vibe: string;
  distance: string;
  mutualFriends: number;
  hasProfile: boolean;
}

// Real attendees scraped from public Posh guestlist
const realAttendees: Pick<SoundclashAttendee, "name" | "photo" | "gender">[] = [
  { name: "Paul Bridges", photo: "https://posh-images-alts-production.s3.amazonaws.com/67212af205a2d0767c552c9e/600x600.webp", gender: "male" },
  { name: "Durbio E", photo: "https://posh-images-alts-production.s3.amazonaws.com/68664a1dad569ad8f8fe5e66/600x634.png", gender: "male" },
  { name: "People's Princess", photo: "https://posh-images-alts-production.s3.amazonaws.com/6685f4f66b11f88f98442344/1072x600.webp", gender: "female" },
  { name: "Selis Sanella", photo: "https://posh-images-alts-production.s3.amazonaws.com/68adf1e0be9099254894e5c6/600x600.png", gender: "female" },
  { name: "Felix Etugbo", photo: "https://posh-images-alts-production.s3.amazonaws.com/694c53288921f0876d3b5b62/600x600.png", gender: "male" },
  { name: "Imani Ha", photo: "https://posh-images-alts-production.s3.amazonaws.com/6661f32a045bbee49647760d/600x1067.webp", gender: "female" },
  { name: "Ariel Ibuaka", photo: "https://images.posh.vip/images/2a8ac75b-47dc-40b7-bd39-27b748905f91.jpg", gender: "female" },
  { name: "Dilynn-Paige Ewing", photo: "https://posh-images-alts-production.s3.amazonaws.com/69797f5a327800599878c266/600x600.png", gender: "female" },
  { name: "Aisosa O", photo: "https://posh-images-alts-production.s3.amazonaws.com/68242df3bc6200efcbc6ce21/600x600.png", gender: "female" },
  { name: "Wale Ajike", photo: "https://posh-images-alts-production.s3.amazonaws.com/6788350e96a1c263ee499d57/600x914.webp", gender: "male" },
];

// Simulated profile photos (diverse stock-style URLs via UI Faces / DiceBear)
const femalePhotos = [
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
];

const malePhotos = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=200&h=200&fit=crop&crop=face",
];

const femaleNames = [
  "Amara Johnson", "Nneka Davis", "Jasmine Williams", "Zara Thompson", "Adaeze Obi",
  "Chioma Nwosu", "Imani Carter", "Aisha Bello", "Nadia Hassan", "Keisha Brown",
  "Tamara Scott", "Naomi West", "Blessing Eze", "Amina Diallo", "Sade Ogundimu",
  "Folake Adu", "Yemi Alade", "Abena Mensah", "Aaliyah Green", "Kemi Owolabi",
  "Lola Falade", "Titi Bankole", "Ayo Richards", "Chiamaka Ibe", "Damilola Ojo",
  "Ebele Chukwu", "Funke Adams", "Grace Okafor", "Halima Yusuf", "Ife Okonkwo",
  "Joy Emeka", "Khadija Suleiman", "Latifah Moore", "Malaika James", "Nkechi Uche",
  "Ogechi Onyema", "Precious Okoro", "Queen Adeyemi", "Remi Balogun", "Sasha Clark",
  "Tola Komolafe", "Uma Jacobs", "Vivian Ezeani", "Wura Afolabi", "Xena Bassey",
  "Yinka Fadipe", "Zuri Mitchell", "Ada Nnamdi", "Bisi Lawal", "Cece Thompson",
  "Dami Osei", "Ese Ovie", "Fola Akintunde", "Gbemi Shola", "Hawa Conteh",
  "Ife Oduya", "Jummy Bakare", "Keke Obi", "Lami Garba", "Moyo Adewale",
  "Nene Ubaka", "Ola Fakoya", "Peju Adeleke", "Rita Onwuka", "Simi Kosoko",
  "Temi Otedola", "Uju Okechukwu", "Vanessa Ajayi", "Wumi Dosunmu", "Yetunde Bode",
  "Zainab Lawal", "Adaora Eze", "Bukola Sanni", "Chika Nnaji", "Deborah Okafor",
  "Eniola Balogun", "Funto Alade", "Ginika Obi", "Husna Ali", "Ifeoma Chidi",
  "Jumoke Oke", "Korede James", "Laide Soetan", "Mariam Adamu", "Nnenna Okoli",
  "Opeyemi Raji", "Pelumi Ige", "Ronke Bakare", "Shade Olatunji", "Titilayo Ojo",
];

const maleNames = [
  "Kofi Williams", "Dayo Ogunlesi", "Marcus Taylor", "Tunde Bakare", "Kwame Asante",
  "Devon Mitchell", "Moussa Diallo", "Jalen Carter", "Emeka Okafor", "Rashid Bello",
  "Tariq Hassan", "Jabari Thompson", "Obinna Nwosu", "Sekou Traore", "Idris Okonkwo",
  "Chidi Eze", "Hakeem Alade", "Malik Johnson", "Olu Adeyemi", "Wale Bakare",
  "Adewale Ojo", "Bola Fakoya", "Chukwuma Ibe", "Dapo Komolafe", "Emeka Chukwu",
  "Femi Afolabi", "Gbenga Osei", "Ibrahim Yusuf", "Jide Balogun", "Kola Owolabi",
  "Lanre Adu", "Muyiwa Shola", "Nonso Uche", "Ope Adewale", "Peter Onwuka",
  "Rotimi Lawal", "Soji Adeleke", "Tobi Kosoko", "Uche Nnamdi", "Victor Obi",
  "Yinka Raji", "Zach Ovie", "Ade Garba", "Bayo Soetan", "Chris Okafor",
  "Daniel Fakoya", "Efe Bassey", "Fola James", "Gideon Okoro", "Henry Eze",
];

const vibes = [
  "🎶 Afrobeats", "💃 Dance", "🔥 Energy", "✈️ Explorer", "📸 Creative",
  "🥂 Social", "🎵 Music", "✨ Vibes", "🎧 DJ", "🌟 New Here",
  "🏀 Sports", "💪 Fitness", "🤝 Networking", "👟 Fashion", "🌊 Chill",
];

const bios = [
  "Here for the Afrobeats 🔥", "Dance is my therapy 💃", "New to Austin, show me around ✨",
  "Soundclash regular 🎶", "Music lover & foodie 🎤", "Living for live music 🎵",
  "Always vibing 🌊", "Culture enthusiast 🌍", "Good energy only ⚡", "Making moves in ATX 🚀",
  "Photographer 📸", "Brunch queen 🥂", "Content creator 📱", "Tech professional 💻",
  "Entrepreneur 💼", "Fashion girlie 💅", "DJ & event lover 🎧", "Creative soul 🎨",
  "Just moved here 🏠", "Let's link up 🤝", "Afrobeats x Dancehall = 🔥", "JRIPSET fam 🙌",
  "Looking for my people 👥", "ATX nightlife explorer 🌙", "Gym & vibes 💪",
];

const hash = (n: number) => ((n * 2654435761) >>> 0);

// Build 150 profiled attendees
const buildProfiledAttendees = (): SoundclashAttendee[] => {
  const attendees: SoundclashAttendee[] = [];

  // First 10: real scraped attendees
  realAttendees.forEach((r, i) => {
    const h = hash(i + 1);
    attendees.push({
      id: 9000 + i,
      name: r.name,
      age: 21 + (h % 10),
      gender: r.gender,
      photo: r.photo,
      bio: bios[h % bios.length],
      vibe: vibes[h % vibes.length],
      distance: `${(0.2 + (h % 30) / 10).toFixed(1)} mi`,
      mutualFriends: h % 12,
      hasProfile: true,
    });
  });

  // Next 90 women with profiles
  for (let i = 0; i < 90; i++) {
    const h = hash(i + 100);
    attendees.push({
      id: 9100 + i,
      name: femaleNames[i % femaleNames.length],
      age: 21 + (h % 10),
      gender: "female",
      photo: femalePhotos[h % femalePhotos.length],
      bio: bios[h % bios.length],
      vibe: vibes[h % vibes.length],
      distance: `${(0.1 + (h % 40) / 10).toFixed(1)} mi`,
      mutualFriends: h % 15,
      hasProfile: true,
    });
  }

  // Next 50 men with profiles
  for (let i = 0; i < 50; i++) {
    const h = hash(i + 500);
    attendees.push({
      id: 9200 + i,
      name: maleNames[i % maleNames.length],
      age: 21 + (h % 10),
      gender: "male",
      photo: malePhotos[h % malePhotos.length],
      bio: bios[h % bios.length],
      vibe: vibes[h % vibes.length],
      distance: `${(0.1 + (h % 40) / 10).toFixed(1)} mi`,
      mutualFriends: h % 15,
      hasProfile: true,
    });
  }

  return attendees;
};

// Build 178 non-profiled attendees (total 328)
const buildAnonymousAttendees = (): SoundclashAttendee[] => {
  const attendees: SoundclashAttendee[] = [];
  // 120 women, 58 men anonymous
  for (let i = 0; i < 120; i++) {
    const h = hash(i + 2000);
    attendees.push({
      id: 9500 + i,
      name: femaleNames[h % femaleNames.length],
      age: 21 + (h % 10),
      gender: "female",
      photo: femalePhotos[h % femalePhotos.length],
      bio: "",
      vibe: vibes[h % vibes.length],
      distance: "",
      mutualFriends: 0,
      hasProfile: false,
    });
  }
  for (let i = 0; i < 58; i++) {
    const h = hash(i + 3000);
    attendees.push({
      id: 9700 + i,
      name: maleNames[h % maleNames.length],
      age: 21 + (h % 10),
      gender: "male",
      photo: malePhotos[h % malePhotos.length],
      bio: "",
      vibe: vibes[h % vibes.length],
      distance: "",
      mutualFriends: 0,
      hasProfile: false,
    });
  }
  return attendees;
};

export const SOUNDCLASH_TOTAL = 328;
export const SOUNDCLASH_ON_APP = 150;
export const SOUNDCLASH_WOMEN = 96; // 6 real + 90 generated
export const SOUNDCLASH_MEN = 54; // 4 real + 50 generated

const profiledAttendees = buildProfiledAttendees();
const anonymousAttendees = buildAnonymousAttendees();

export const getSoundclashAttendees = () => {
  const allAttendees = [...profiledAttendees, ...anonymousAttendees];
  return {
    profiled: profiledAttendees,
    anonymous: anonymousAttendees,
    all: allAttendees,
    females: allAttendees.filter(a => a.gender === "female"),
    males: allAttendees.filter(a => a.gender === "male"),
    profiledFemales: profiledAttendees.filter(a => a.gender === "female"),
    profiledMales: profiledAttendees.filter(a => a.gender === "male"),
  };
};
