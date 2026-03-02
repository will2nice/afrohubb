import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

export interface Attendee {
  id: number;
  name: string;
  age: number;
  gender: "female" | "male";
  photo: string;
  bio: string;
  vibe: string;
  distance: string;
  mutualFriends: number;
}

// Large pool of female attendees (800 on app)
const femaleNames = [
  "Amara", "Nneka", "Jasmine", "Priya", "Zara", "Sophie", "Adaeze", "Fatou", "Chioma", "Imani",
  "Aisha", "Nadia", "Keisha", "Tamara", "Naomi", "Blessing", "Amina", "Sade", "Folake", "Yemi",
  "Abena", "Aaliyah", "Kemi", "Lola", "Titi", "Ayo", "Chiamaka", "Damilola", "Ebele", "Funke",
  "Grace", "Halima", "Ife", "Joy", "Khadija", "Latifah", "Malaika", "Nkechi", "Ogechi", "Precious",
];

const femaleBios = [
  "Music lover & foodie 🎤", "New in town ✨", "Fashion girlie 💃", "Photographer 📸",
  "Dance is my love language 💕", "Brunch queen 🥂", "Singer-songwriter 🎵", "Tech sis 🌙",
  "Art & Afrobeats 🎨", "Living for live music ✨", "Show me around? 🌟", "DJ & event organizer 🎧",
  "Always vibing 🔥", "Culture enthusiast 🌍", "Creative soul 🎭", "Good energy only ⚡",
  "Living my best life 💫", "Content creator 📱", "Entrepreneur 💼", "Making moves 🚀",
];

const femaleVibes = [
  "🎶 Vibes", "✈️ Explorer", "💃 Fashion", "📸 Creative", "💫 Dance", "🥂 Social",
  "🎵 Music", "🔥 Energy", "🎨 Artsy", "✨ Good Vibes", "🌟 New Here", "🎧 DJ",
];

const maleNames = [
  "Kofi", "Dayo", "Marcus", "Tunde", "Kwame", "Devon", "Moussa", "Jalen", "Emeka", "Rashid",
  "Tariq", "Jabari", "Obinna", "Sekou", "Idris", "Chidi", "Hakeem", "Malik", "Olu", "Wale",
];

const maleBios = [
  "Baller & music head 🏀", "Producer making beats 🎧", "Entrepreneur 🔥", "Gym bro & Afrobeats 💪",
  "Tech founder 🤝", "Streetwear designer 🪡", "Photographer 📷", "Here for the music 🎶",
  "Always in the building 🏢", "Football & good vibes ⚽", "Living life 🌊", "Making connections 🤝",
];

const maleVibes = [
  "🏀 Sports", "🎧 Producer", "🔥 Hustle", "💪 Fitness", "🤝 Network", "👟 Fashion",
  "📷 Creative", "🎶 Vibes", "🌆 City Boy", "⚽ Sports",
];

// Generate attendees deterministically from seed
const generateAttendees = (
  names: string[], bios: string[], vibes: string[], photos: string[],
  gender: "female" | "male", count: number, seed: number, startId: number
): Attendee[] => {
  const result: Attendee[] = [];
  for (let i = 0; i < count; i++) {
    const hash = ((seed + i) * 2654435761) >>> 0;
    result.push({
      id: startId + i,
      name: names[i % names.length],
      age: 21 + (hash % 10),
      gender,
      photo: photos[(hash >> 4) % photos.length],
      bio: bios[(hash >> 8) % bios.length],
      vibe: vibes[(hash >> 12) % vibes.length],
      distance: `${(0.1 + (hash % 50) / 10).toFixed(1)} mi`,
      mutualFriends: hash % 15,
    });
  }
  return result;
};

// Constants for on-app counts
export const ON_APP_WOMEN = 800;
export const ON_APP_MEN = 200;
export const ON_APP_TOTAL = ON_APP_WOMEN + ON_APP_MEN;
export const TOTAL_ATTENDING = 5000;

// Free user limit
export const FREE_ATTENDEE_LIMIT = 5;

// Deterministically assign attendees to an event based on event id
export const getEventAttendees = (eventId: number): { females: Attendee[]; males: Attendee[] } => {
  const seed = eventId * 31;
  const females = generateAttendees(
    femaleNames, femaleBios, femaleVibes,
    [profileWoman1, profileWoman2], "female", ON_APP_WOMEN, seed, 1000
  );
  const males = generateAttendees(
    maleNames, maleBios, maleVibes,
    [profileMan1, profileMan2], "male", ON_APP_MEN, seed + 9999, 5000
  );
  return { females, males };
};
