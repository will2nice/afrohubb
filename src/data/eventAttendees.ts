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

// Pool of mock attendees that get assigned to events
const femaleAttendees: Attendee[] = [
  { id: 101, name: "Amara", age: 24, gender: "female", photo: profileWoman1, bio: "Music lover & foodie. Always at the front row 🎤", vibe: "🎶 Vibes", distance: "0.3 mi", mutualFriends: 4 },
  { id: 102, name: "Nneka", age: 23, gender: "female", photo: profileWoman2, bio: "New in town, looking for my people ✨", vibe: "✈️ Explorer", distance: "0.8 mi", mutualFriends: 2 },
  { id: 103, name: "Jasmine", age: 25, gender: "female", photo: profileWoman1, bio: "Fashion girlie & culture enthusiast 💃", vibe: "💃 Fashion", distance: "1.2 mi", mutualFriends: 7 },
  { id: 104, name: "Priya", age: 26, gender: "female", photo: profileWoman2, bio: "Photographer capturing diaspora magic 📸", vibe: "📸 Creative", distance: "0.5 mi", mutualFriends: 3 },
  { id: 105, name: "Zara", age: 22, gender: "female", photo: profileWoman1, bio: "Dance is my love language 💕", vibe: "💫 Dance", distance: "1.5 mi", mutualFriends: 1 },
  { id: 106, name: "Sophie", age: 27, gender: "female", photo: profileWoman2, bio: "Brunch queen & networking pro 🥂", vibe: "🥂 Social", distance: "0.9 mi", mutualFriends: 6 },
  { id: 107, name: "Adaeze", age: 24, gender: "female", photo: profileWoman1, bio: "Singer-songwriter. Let's duet 🎵", vibe: "🎵 Music", distance: "2.1 mi", mutualFriends: 5 },
  { id: 108, name: "Fatou", age: 28, gender: "female", photo: profileWoman2, bio: "Tech sis by day, party girl by night 🌙", vibe: "🔥 Energy", distance: "0.7 mi", mutualFriends: 8 },
  { id: 109, name: "Chioma", age: 23, gender: "female", photo: profileWoman1, bio: "Art & Afrobeats are my personality 🎨", vibe: "🎨 Artsy", distance: "1.8 mi", mutualFriends: 2 },
  { id: 110, name: "Imani", age: 25, gender: "female", photo: profileWoman2, bio: "Living for live music and good energy ✨", vibe: "✨ Good Vibes", distance: "0.4 mi", mutualFriends: 9 },
  { id: 111, name: "Aisha", age: 21, gender: "female", photo: profileWoman1, bio: "Just moved here! Show me around? 🌟", vibe: "🌟 New Here", distance: "1.1 mi", mutualFriends: 0 },
  { id: 112, name: "Nadia", age: 26, gender: "female", photo: profileWoman2, bio: "DJ & event organizer. Let's link! 🎧", vibe: "🎧 DJ", distance: "0.6 mi", mutualFriends: 11 },
];

const maleAttendees: Attendee[] = [
  { id: 201, name: "Kofi", age: 27, gender: "male", photo: profileMan1, bio: "Baller & music head. Catch me vibing 🏀", vibe: "🏀 Sports", distance: "0.4 mi", mutualFriends: 5 },
  { id: 202, name: "Dayo", age: 29, gender: "male", photo: profileMan2, bio: "Producer making beats between events 🎧", vibe: "🎧 Producer", distance: "1.1 mi", mutualFriends: 3 },
  { id: 203, name: "Marcus", age: 26, gender: "male", photo: profileMan1, bio: "Entrepreneur & culture lover 🔥", vibe: "🔥 Hustle", distance: "0.7 mi", mutualFriends: 8 },
  { id: 204, name: "Tunde", age: 28, gender: "male", photo: profileMan2, bio: "Gym bro who also loves Afrobeats 💪", vibe: "💪 Fitness", distance: "1.3 mi", mutualFriends: 2 },
  { id: 205, name: "Kwame", age: 30, gender: "male", photo: profileMan1, bio: "Tech founder & networking king 🤝", vibe: "🤝 Network", distance: "0.9 mi", mutualFriends: 12 },
  { id: 206, name: "Devon", age: 25, gender: "male", photo: profileMan2, bio: "Streetwear designer. Fashion is art 🪡", vibe: "👟 Fashion", distance: "0.6 mi", mutualFriends: 4 },
  { id: 207, name: "Moussa", age: 27, gender: "male", photo: profileMan1, bio: "Photographer & world traveler 📷", vibe: "📷 Creative", distance: "1.5 mi", mutualFriends: 6 },
  { id: 208, name: "Jalen", age: 24, gender: "male", photo: profileMan2, bio: "Here for the music and the connections 🎶", vibe: "🎶 Vibes", distance: "0.3 mi", mutualFriends: 7 },
  { id: 209, name: "Emeka", age: 26, gender: "male", photo: profileMan1, bio: "Always in the building. Let's link 🏢", vibe: "🌆 City Boy", distance: "0.8 mi", mutualFriends: 3 },
  { id: 210, name: "Rashid", age: 28, gender: "male", photo: profileMan2, bio: "Football & good vibes only ⚽", vibe: "⚽ Sports", distance: "2.0 mi", mutualFriends: 1 },
];

// Deterministically assign attendees to an event based on event id
export const getEventAttendees = (eventId: number, attending: number): { females: Attendee[]; males: Attendee[] } => {
  const seed = eventId * 31;
  // Pick a subset based on event size
  const femaleCount = Math.min(femaleAttendees.length, Math.max(4, Math.floor((attending / 100) + (seed % 5))));
  const maleCount = Math.min(maleAttendees.length, Math.max(3, Math.floor((attending / 120) + (seed % 4))));

  const shuffledF = [...femaleAttendees].sort((a, b) => ((a.id * seed) % 97) - ((b.id * seed) % 97));
  const shuffledM = [...maleAttendees].sort((a, b) => ((a.id * seed) % 89) - ((b.id * seed) % 89));

  return {
    females: shuffledF.slice(0, femaleCount),
    males: shuffledM.slice(0, maleCount),
  };
};
