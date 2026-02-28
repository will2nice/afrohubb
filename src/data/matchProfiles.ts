import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

export interface MatchProfile {
  id: number;
  name: string;
  age: number;
  gender: "female" | "male";
  bio: string;
  photo: string;
  interests: string[];
  verified: boolean;
  country: string;
  flag: string;
}

const femalePhotos = [profileWoman1, profileWoman2];
const malePhotos = [profileMan1, profileMan2];

export const matchProfiles: MatchProfile[] = [
  // === WOMEN (39) ===
  { id: 1, name: "Amara", age: 26, gender: "female", bio: "Lagos → Austin. Software engineer by day, Afrobeats dancer by night.", photo: femalePhotos[0], interests: ["Afrobeats", "Tech", "Cooking", "Travel"], verified: true, country: "Nigeria", flag: "🇳🇬" },
  { id: 2, name: "Nneka", age: 23, gender: "female", bio: "New in town, looking for my people ✨", photo: femalePhotos[1], interests: ["Music", "Dance", "Food", "Culture"], verified: true, country: "Ghana", flag: "🇬🇭" },
  { id: 3, name: "Jasmine", age: 25, gender: "female", bio: "Fashion girlie & culture enthusiast 💃", photo: femalePhotos[0], interests: ["Fashion", "Nightlife", "Art", "Travel"], verified: true, country: "Kenya", flag: "🇰🇪" },
  { id: 4, name: "Priya", age: 25, gender: "female", bio: "Photographer capturing diaspora magic 📸", photo: femalePhotos[1], interests: ["Photography", "Food", "Travel", "Music"], verified: true, country: "South Africa", flag: "🇿🇦" },
  { id: 5, name: "Fatou", age: 28, gender: "female", bio: "Tech sis by day, party girl by night 🌙", photo: femalePhotos[0], interests: ["DJing", "Tech", "Nightlife", "Fashion"], verified: true, country: "Senegal", flag: "🇸🇳" },
  { id: 6, name: "Chioma", age: 23, gender: "female", bio: "Art & Afrobeats are my personality 🎨", photo: femalePhotos[1], interests: ["Art", "Afrobeats", "Dance", "Culture"], verified: false, country: "Cameroon", flag: "🇨🇲" },
  { id: 7, name: "Zara", age: 21, gender: "female", bio: "Art student who loves live music 🌟", photo: femalePhotos[0], interests: ["Art", "Music", "Dance", "Nightlife"], verified: false, country: "Ethiopia", flag: "🇪🇹" },
  { id: 8, name: "Imani", age: 25, gender: "female", bio: "Living for live music and good energy ✨", photo: femalePhotos[1], interests: ["Music", "Fitness", "Travel", "Food"], verified: true, country: "Tanzania", flag: "🇹🇿" },
  { id: 9, name: "Aisha", age: 22, gender: "female", bio: "Just moved here! Show me around? 🌟", photo: femalePhotos[0], interests: ["Exploring", "Food", "Music", "Culture"], verified: false, country: "Sudan", flag: "🇸🇩" },
  { id: 10, name: "Nadia", age: 26, gender: "female", bio: "DJ & event organizer. Let's link! 🎧", photo: femalePhotos[1], interests: ["DJing", "Events", "Nightlife", "Fashion"], verified: true, country: "Morocco", flag: "🇲🇦" },
  { id: 11, name: "Adaeze", age: 24, gender: "female", bio: "Singer-songwriter. Let's duet 🎵", photo: femalePhotos[0], interests: ["Music", "Singing", "Culture", "Dance"], verified: true, country: "Ivory Coast", flag: "🇨🇮" },
  { id: 12, name: "Sophie", age: 27, gender: "female", bio: "Brunch queen & networking pro 🥂", photo: femalePhotos[1], interests: ["Networking", "Food", "Fashion", "Travel"], verified: true, country: "Egypt", flag: "🇪🇬" },
  { id: 13, name: "Amina", age: 24, gender: "female", bio: "Medical student who loves to dance 💃", photo: femalePhotos[0], interests: ["Dance", "Science", "Music", "Food"], verified: true, country: "Algeria", flag: "🇩🇿" },
  { id: 14, name: "Blessing", age: 26, gender: "female", bio: "Nurse by day, Afrobeats queen by night 👑", photo: femalePhotos[1], interests: ["Afrobeats", "Health", "Dance", "Cooking"], verified: false, country: "Uganda", flag: "🇺🇬" },
  { id: 15, name: "Thandiwe", age: 25, gender: "female", bio: "Actress & model. Let's create together 🎬", photo: femalePhotos[0], interests: ["Acting", "Modeling", "Art", "Fashion"], verified: true, country: "Zimbabwe", flag: "🇿🇼" },
  { id: 16, name: "Mariama", age: 23, gender: "female", bio: "Foodie exploring every cuisine 🍲", photo: femalePhotos[1], interests: ["Food", "Travel", "Culture", "Music"], verified: false, country: "Guinea", flag: "🇬🇳" },
  { id: 17, name: "Leila", age: 27, gender: "female", bio: "Architect designing the future 🏛️", photo: femalePhotos[0], interests: ["Architecture", "Art", "Travel", "Tech"], verified: true, country: "Tunisia", flag: "🇹🇳" },
  { id: 18, name: "Nyah", age: 22, gender: "female", bio: "Track athlete & music lover 🏃‍♀️", photo: femalePhotos[1], interests: ["Sports", "Music", "Fitness", "Dance"], verified: true, country: "Rwanda", flag: "🇷🇼" },
  { id: 19, name: "Wanjiku", age: 28, gender: "female", bio: "Entrepreneur building African brands 💼", photo: femalePhotos[0], interests: ["Business", "Fashion", "Tech", "Networking"], verified: true, country: "Mozambique", flag: "🇲🇿" },
  { id: 20, name: "Ama", age: 24, gender: "female", bio: "Dancer & choreographer. Catch the vibes 💫", photo: femalePhotos[1], interests: ["Dance", "Choreography", "Music", "Fitness"], verified: false, country: "Mali", flag: "🇲🇱" },
  { id: 21, name: "Kadiatou", age: 25, gender: "female", bio: "Journalist telling African stories 📝", photo: femalePhotos[0], interests: ["Writing", "Culture", "Travel", "Photography"], verified: true, country: "Burkina Faso", flag: "🇧🇫" },
  { id: 22, name: "Lina", age: 26, gender: "female", bio: "Graphic designer & festival lover 🎨", photo: femalePhotos[1], interests: ["Design", "Festivals", "Art", "Music"], verified: false, country: "Libya", flag: "🇱🇾" },
  { id: 23, name: "Esther", age: 23, gender: "female", bio: "Law student who can outrun you 🏃‍♀️", photo: femalePhotos[0], interests: ["Law", "Sports", "Music", "Culture"], verified: true, country: "Zambia", flag: "🇿🇲" },
  { id: 24, name: "Fanta", age: 27, gender: "female", bio: "Chef making African fusion magic 👩‍🍳", photo: femalePhotos[1], interests: ["Cooking", "Food", "Culture", "Travel"], verified: true, country: "Niger", flag: "🇳🇪" },
  { id: 25, name: "Hawa", age: 22, gender: "female", bio: "Singer with a voice from heaven 🎤", photo: femalePhotos[0], interests: ["Singing", "Music", "Dance", "Art"], verified: false, country: "Sierra Leone", flag: "🇸🇱" },
  { id: 26, name: "Nana", age: 25, gender: "female", bio: "Marketing queen building brands ✨", photo: femalePhotos[1], interests: ["Marketing", "Fashion", "Nightlife", "Tech"], verified: true, country: "Togo", flag: "🇹🇬" },
  { id: 27, name: "Safi", age: 24, gender: "female", bio: "Yoga instructor & spiritual soul 🧘‍♀️", photo: femalePhotos[0], interests: ["Yoga", "Wellness", "Music", "Nature"], verified: false, country: "Madagascar", flag: "🇲🇬" },
  { id: 28, name: "Djeneba", age: 26, gender: "female", bio: "Civil engineer & festival goer 🎪", photo: femalePhotos[1], interests: ["Engineering", "Festivals", "Dance", "Travel"], verified: true, country: "Chad", flag: "🇹🇩" },
  { id: 29, name: "Makeda", age: 28, gender: "female", bio: "History buff & coffee enthusiast ☕", photo: femalePhotos[0], interests: ["History", "Coffee", "Culture", "Travel"], verified: true, country: "Eritrea", flag: "🇪🇷" },
  { id: 30, name: "Adjoa", age: 23, gender: "female", bio: "Filmmaker telling our stories 🎥", photo: femalePhotos[1], interests: ["Film", "Photography", "Art", "Culture"], verified: false, country: "Benin", flag: "🇧🇯" },
  { id: 31, name: "Aissatou", age: 25, gender: "female", bio: "Pharmacist & salsa dancer 💊💃", photo: femalePhotos[0], interests: ["Health", "Dance", "Music", "Food"], verified: true, country: "Mauritania", flag: "🇲🇷" },
  { id: 32, name: "Ngozi", age: 27, gender: "female", bio: "Data scientist & Afrobeats head 📊", photo: femalePhotos[1], interests: ["Tech", "Afrobeats", "Dance", "Food"], verified: true, country: "Malawi", flag: "🇲🇼" },
  { id: 33, name: "Halima", age: 24, gender: "female", bio: "Fashion model & activist 🌍", photo: femalePhotos[0], interests: ["Modeling", "Activism", "Fashion", "Travel"], verified: true, country: "Somalia", flag: "🇸🇴" },
  { id: 34, name: "Lindiwe", age: 26, gender: "female", bio: "Teacher & community builder 📚", photo: femalePhotos[1], interests: ["Education", "Community", "Music", "Culture"], verified: false, country: "Eswatini", flag: "🇸🇿" },
  { id: 35, name: "Aya", age: 22, gender: "female", bio: "Computer science student & gamer 🎮", photo: femalePhotos[0], interests: ["Gaming", "Tech", "Anime", "Music"], verified: false, country: "Gabon", flag: "🇬🇦" },
  { id: 36, name: "Binta", age: 25, gender: "female", bio: "Dentist who loves karaoke nights 🦷🎤", photo: femalePhotos[1], interests: ["Health", "Karaoke", "Food", "Travel"], verified: true, country: "Gambia", flag: "🇬🇲" },
  { id: 37, name: "Amahle", age: 23, gender: "female", bio: "Interior designer & wine lover 🍷", photo: femalePhotos[0], interests: ["Design", "Wine", "Art", "Fashion"], verified: false, country: "Lesotho", flag: "🇱🇸" },
  { id: 38, name: "Abeni", age: 26, gender: "female", bio: "Biomedical engineer & dancer 🧬", photo: femalePhotos[1], interests: ["Science", "Dance", "Music", "Tech"], verified: true, country: "Liberia", flag: "🇱🇷" },
  { id: 39, name: "Malaika", age: 24, gender: "female", bio: "Pilot in training & adventure seeker ✈️", photo: femalePhotos[0], interests: ["Aviation", "Travel", "Sports", "Music"], verified: true, country: "Congo", flag: "🇨🇬" },

  // === MEN (15) ===
  { id: 40, name: "Kofi", age: 29, gender: "male", bio: "Ghanaian-American. Building startups and community.", photo: malePhotos[0], interests: ["Soccer", "Entrepreneurship", "Music", "Fashion"], verified: true, country: "Ghana", flag: "🇬🇭" },
  { id: 41, name: "Darius", age: 27, gender: "male", bio: "Creative director. Film nerd. Always looking for adventure.", photo: malePhotos[1], interests: ["Film", "Photography", "Art", "Vinyl"], verified: false, country: "Nigeria", flag: "🇳🇬" },
  { id: 42, name: "Marcus", age: 26, gender: "male", bio: "Entrepreneur & culture lover. Always at the best events 🔥", photo: malePhotos[0], interests: ["Business", "Afrobeats", "Sports", "Tech"], verified: false, country: "Kenya", flag: "🇰🇪" },
  { id: 43, name: "Tunde", age: 28, gender: "male", bio: "Gym bro who also loves Afrobeats 💪", photo: malePhotos[1], interests: ["Fitness", "Afrobeats", "Soccer", "Cooking"], verified: true, country: "Senegal", flag: "🇸🇳" },
  { id: 44, name: "Kwame", age: 30, gender: "male", bio: "Networking king. Let's build something together 🤝", photo: malePhotos[0], interests: ["Business", "Networking", "Sports", "Travel"], verified: true, country: "South Africa", flag: "🇿🇦" },
  { id: 45, name: "Emeka", age: 26, gender: "male", bio: "Always in the building. Let's link 🏢", photo: malePhotos[1], interests: ["Tech", "Music", "Nightlife", "Sports"], verified: false, country: "Cameroon", flag: "🇨🇲" },
  { id: 46, name: "Moussa", age: 27, gender: "male", bio: "Photographer & world traveler 📷", photo: malePhotos[0], interests: ["Photography", "Travel", "Culture", "Music"], verified: true, country: "Ethiopia", flag: "🇪🇹" },
  { id: 47, name: "Jalen", age: 24, gender: "male", bio: "Here for the music and the connections 🎶", photo: malePhotos[1], interests: ["Music", "Dance", "Nightlife", "Food"], verified: true, country: "Tanzania", flag: "🇹🇿" },
  { id: 48, name: "Rashid", age: 28, gender: "male", bio: "Football & good vibes only ⚽", photo: malePhotos[0], interests: ["Soccer", "Sports", "Music", "Travel"], verified: false, country: "Morocco", flag: "🇲🇦" },
  { id: 49, name: "Devon", age: 25, gender: "male", bio: "Streetwear designer. Fashion is art 🪡", photo: malePhotos[1], interests: ["Fashion", "Design", "Art", "Nightlife"], verified: true, country: "Egypt", flag: "🇪🇬" },
  { id: 50, name: "Amadou", age: 29, gender: "male", bio: "Soccer coach & mentor. Building the next gen ⚽", photo: malePhotos[0], interests: ["Soccer", "Coaching", "Music", "Community"], verified: true, country: "Mali", flag: "🇲🇱" },
  { id: 51, name: "Tendai", age: 26, gender: "male", bio: "Software dev & DJ on weekends 🎧", photo: malePhotos[1], interests: ["Tech", "DJing", "Nightlife", "Gaming"], verified: false, country: "Zimbabwe", flag: "🇿🇼" },
  { id: 52, name: "Omar", age: 27, gender: "male", bio: "Chef bringing African flavors worldwide 🍽️", photo: malePhotos[0], interests: ["Cooking", "Food", "Travel", "Culture"], verified: true, country: "Somalia", flag: "🇸🇴" },
  { id: 53, name: "Sekou", age: 25, gender: "male", bio: "Rapper & poet. Words are my weapon 🎤", photo: malePhotos[1], interests: ["Music", "Poetry", "Culture", "Nightlife"], verified: false, country: "Guinea", flag: "🇬🇳" },
  { id: 54, name: "Youssef", age: 28, gender: "male", bio: "Architect designing African futures 🏗️", photo: malePhotos[0], interests: ["Architecture", "Art", "Travel", "Tech"], verified: true, country: "Algeria", flag: "🇩🇿" },
];

export const prompts = [
  { q: "A perfect weekend is…", a: "Farmer's market, jollof rice, and a rooftop sunset" },
  { q: "My culture taught me…", a: "That community is everything. Ubuntu — I am because we are." },
  { q: "Green flag I look for…", a: "Someone who can hold a conversation AND hold a rhythm 💃" },
  { q: "I'm at my best when…", a: "I'm surrounded by good music, good food, and good people" },
  { q: "My love language is…", a: "Quality time and acts of service — cook for me and I'm yours 🍲" },
  { q: "You should NOT go on a date with me if…", a: "You can't dance. Just kidding… unless? 😂" },
];

export const getPrompts = (profileId: number) => {
  const start = (profileId * 7) % prompts.length;
  return [
    prompts[start % prompts.length],
    prompts[(start + 1) % prompts.length],
    prompts[(start + 2) % prompts.length],
  ];
};

export const getEventProfiles = (eventId: number) => {
  const shuffled = [...matchProfiles].sort((a, b) => ((a.id * eventId * 31) % 97) - ((b.id * eventId * 31) % 97));
  return shuffled.slice(0, Math.min(12, shuffled.length));
};
