import networkingCollege from "@/assets/networking-college.jpg";
import networkingConference from "@/assets/networking-conference.jpg";
import networkingHeadshot from "@/assets/networking-headshot.jpg";
import networkingPanel from "@/assets/networking-panel.jpg";
import networkingTeam from "@/assets/networking-team.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";
import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import matchMan1 from "@/assets/match-man-1.jpg";
import matchMan2 from "@/assets/match-man-2.jpg";
import matchWoman1 from "@/assets/match-woman-1.jpg";
import matchWoman2 from "@/assets/match-woman-2.jpg";
import matchWoman3 from "@/assets/match-woman-3.jpg";
import matchMan3 from "@/assets/match-man-3.jpg";

export type SchoolType = "hbcu" | "asa";

export interface CampusSchool {
  id: number;
  name: string;
  shortName: string;
  type: SchoolType;
  city: string;
  state: string;
  mascot: string;
  colors: string; // e.g. "Maroon & White"
  memberCount: number;
  upcomingEvents: number;
}

export interface CampusEvent {
  id: number;
  schoolId: number;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
}

export interface CampusPeer {
  id: number;
  name: string;
  age: number;
  schoolId: number;
  major: string;
  year: string;
  avatar: string;
  bio: string;
  origin: string;
  flag: string;
}

// HBCUs
export const campusSchools: CampusSchool[] = [
  { id: 1, name: "Howard University", shortName: "Howard", type: "hbcu", city: "Washington", state: "DC", mascot: "Bison", colors: "Blue & White", memberCount: 1240, upcomingEvents: 8 },
  { id: 2, name: "Spelman College", shortName: "Spelman", type: "hbcu", city: "Atlanta", state: "GA", mascot: "Jaguars", colors: "Blue & White", memberCount: 890, upcomingEvents: 6 },
  { id: 3, name: "Morehouse College", shortName: "Morehouse", type: "hbcu", city: "Atlanta", state: "GA", mascot: "Maroon Tigers", colors: "Maroon & White", memberCount: 760, upcomingEvents: 5 },
  { id: 4, name: "Hampton University", shortName: "Hampton", type: "hbcu", city: "Hampton", state: "VA", mascot: "Pirates", colors: "Blue & White", memberCount: 620, upcomingEvents: 4 },
  { id: 5, name: "Florida A&M University", shortName: "FAMU", type: "hbcu", city: "Tallahassee", state: "FL", mascot: "Rattlers", colors: "Orange & Green", memberCount: 980, upcomingEvents: 7 },
  { id: 6, name: "North Carolina A&T", shortName: "NC A&T", type: "hbcu", city: "Greensboro", state: "NC", mascot: "Aggies", colors: "Blue & Gold", memberCount: 1100, upcomingEvents: 6 },
  { id: 7, name: "Tuskegee University", shortName: "Tuskegee", type: "hbcu", city: "Tuskegee", state: "AL", mascot: "Golden Tigers", colors: "Crimson & Gold", memberCount: 420, upcomingEvents: 3 },
  { id: 8, name: "Clark Atlanta University", shortName: "Clark Atlanta", type: "hbcu", city: "Atlanta", state: "GA", mascot: "Panthers", colors: "Red & Black", memberCount: 530, upcomingEvents: 5 },
  { id: 9, name: "Xavier University of Louisiana", shortName: "Xavier", type: "hbcu", city: "New Orleans", state: "LA", mascot: "Gold Rush", colors: "Gold & White", memberCount: 470, upcomingEvents: 4 },
  { id: 10, name: "Prairie View A&M", shortName: "Prairie View", type: "hbcu", city: "Prairie View", state: "TX", mascot: "Panthers", colors: "Purple & Gold", memberCount: 680, upcomingEvents: 5 },
  { id: 11, name: "Tennessee State University", shortName: "TSU", type: "hbcu", city: "Nashville", state: "TN", mascot: "Tigers", colors: "Blue & White", memberCount: 590, upcomingEvents: 4 },
  { id: 12, name: "Jackson State University", shortName: "Jackson State", type: "hbcu", city: "Jackson", state: "MS", mascot: "Tigers", colors: "Blue & White", memberCount: 710, upcomingEvents: 5 },

  // Universities with African Student Associations
  { id: 101, name: "Harvard University", shortName: "Harvard ASA", type: "asa", city: "Cambridge", state: "MA", mascot: "Crimson", colors: "Crimson & White", memberCount: 320, upcomingEvents: 4 },
  { id: 102, name: "UCLA", shortName: "UCLA ASA", type: "asa", city: "Los Angeles", state: "CA", mascot: "Bruins", colors: "Blue & Gold", memberCount: 450, upcomingEvents: 6 },
  { id: 103, name: "University of Texas at Austin", shortName: "UT Austin ASA", type: "asa", city: "Austin", state: "TX", mascot: "Longhorns", colors: "Burnt Orange & White", memberCount: 380, upcomingEvents: 5 },
  { id: 104, name: "Columbia University", shortName: "Columbia ASA", type: "asa", city: "New York", state: "NY", mascot: "Lions", colors: "Blue & White", memberCount: 290, upcomingEvents: 3 },
  { id: 105, name: "University of Michigan", shortName: "UMich ASA", type: "asa", city: "Ann Arbor", state: "MI", mascot: "Wolverines", colors: "Maize & Blue", memberCount: 410, upcomingEvents: 5 },
  { id: 106, name: "NYU", shortName: "NYU ASA", type: "asa", city: "New York", state: "NY", mascot: "Violets", colors: "Violet & White", memberCount: 520, upcomingEvents: 7 },
  { id: 107, name: "Georgia Tech", shortName: "GT ASA", type: "asa", city: "Atlanta", state: "GA", mascot: "Yellow Jackets", colors: "Gold & White", memberCount: 340, upcomingEvents: 4 },
  { id: 108, name: "University of Maryland", shortName: "UMD ASA", type: "asa", city: "College Park", state: "MD", mascot: "Terrapins", colors: "Red & White", memberCount: 460, upcomingEvents: 5 },
  { id: 109, name: "Ohio State University", shortName: "OSU ASA", type: "asa", city: "Columbus", state: "OH", mascot: "Buckeyes", colors: "Scarlet & Gray", memberCount: 370, upcomingEvents: 4 },
  { id: 110, name: "University of Houston", shortName: "UH ASA", type: "asa", city: "Houston", state: "TX", mascot: "Cougars", colors: "Red & White", memberCount: 430, upcomingEvents: 5 },
  { id: 111, name: "Boston University", shortName: "BU ASA", type: "asa", city: "Boston", state: "MA", mascot: "Terriers", colors: "Scarlet & White", memberCount: 280, upcomingEvents: 3 },
  { id: 112, name: "University of Minnesota", shortName: "UMN ASA", type: "asa", city: "Minneapolis", state: "MN", mascot: "Gophers", colors: "Maroon & Gold", memberCount: 350, upcomingEvents: 4 },
  { id: 113, name: "Temple University", shortName: "Temple ASA", type: "asa", city: "Philadelphia", state: "PA", mascot: "Owls", colors: "Cherry & White", memberCount: 310, upcomingEvents: 3 },
  { id: 114, name: "George Mason University", shortName: "GMU ASA", type: "asa", city: "Fairfax", state: "VA", mascot: "Patriots", colors: "Green & Gold", memberCount: 260, upcomingEvents: 3 },
  { id: 115, name: "University of North Dakota", shortName: "UND ASA", type: "asa", city: "Grand Forks", state: "ND", mascot: "Fighting Hawks", colors: "Green & White", memberCount: 90, upcomingEvents: 2 },
  { id: 116, name: "South Dakota State University", shortName: "SDSU ASA", type: "asa", city: "Brookings", state: "SD", mascot: "Jackrabbits", colors: "Blue & Yellow", memberCount: 75, upcomingEvents: 1 },
];

export const campusEvents: CampusEvent[] = [
  { id: 1, schoolId: 1, title: "Howard Homecoming Block Party", date: "Sat, Oct 18", location: "Main Yard", image: networkingCollege, attendees: 2400, category: "Homecoming" },
  { id: 2, schoolId: 1, title: "Bison Career Fair", date: "Wed, Nov 5", location: "Blackburn Center", image: networkingConference, attendees: 450, category: "Career" },
  { id: 3, schoolId: 2, title: "Spelman Glee Club Concert", date: "Fri, Nov 7", location: "Sisters Chapel", image: networkingPanel, attendees: 600, category: "Arts" },
  { id: 4, schoolId: 3, title: "Morehouse Crown Forum", date: "Tue, Oct 21", location: "King Chapel", image: networkingPanel, attendees: 350, category: "Speaker" },
  { id: 5, schoolId: 5, title: "FAMU Homecoming: The Greatest Show", date: "Sat, Oct 25", location: "Bragg Memorial Stadium", image: networkingCollege, attendees: 5200, category: "Homecoming" },
  { id: 6, schoolId: 6, title: "Aggie Fest Cultural Night", date: "Fri, Nov 14", location: "Corbett Sports Center", image: networkingTeam, attendees: 1800, category: "Culture" },
  { id: 7, schoolId: 101, title: "Harvard ASA African Jollof Night", date: "Sat, Nov 1", location: "Adams House", image: networkingHeadshot, attendees: 180, category: "Social" },
  { id: 8, schoolId: 102, title: "UCLA ASA Afrobeats Party", date: "Fri, Oct 31", location: "Ackerman Grand Ballroom", image: networkingCollege, attendees: 650, category: "Party" },
  { id: 9, schoolId: 106, title: "NYU ASA Pan-African Week Kickoff", date: "Mon, Nov 3", location: "Kimmel Center", image: networkingPanel, attendees: 320, category: "Culture" },
  { id: 10, schoolId: 103, title: "UT Austin ASA Game Watch", date: "Sat, Nov 8", location: "Student Activity Center", image: networkingTeam, attendees: 210, category: "Sports" },
  { id: 11, schoolId: 108, title: "UMD ASA Cultural Fashion Show", date: "Fri, Nov 21", location: "Stamp Student Union", image: networkingConference, attendees: 480, category: "Fashion" },
  { id: 12, schoolId: 105, title: "UMich ASA Welcome Back Mixer", date: "Sat, Sep 13", location: "Michigan Union", image: networkingHeadshot, attendees: 290, category: "Social" },
];

export const campusPeers: CampusPeer[] = [
  { id: 1, name: "Amara K.", age: 20, schoolId: 1, major: "Political Science", year: "Junior", avatar: matchWoman1, bio: "Future policy maker. Let's link on campus! ✊🏾", origin: "Nigeria", flag: "🇳🇬" },
  { id: 2, name: "Kwame D.", age: 21, schoolId: 1, major: "Computer Science", year: "Senior", avatar: matchMan1, bio: "Building the next big thing. Code & culture.", origin: "Ghana", flag: "🇬🇭" },
  { id: 3, name: "Nia J.", age: 19, schoolId: 2, major: "Biology (Pre-Med)", year: "Sophomore", avatar: matchWoman2, bio: "Future surgeon. Spelman made. 💙", origin: "USA", flag: "🇺🇸" },
  { id: 4, name: "Tariq M.", age: 22, schoolId: 3, major: "Business Administration", year: "Senior", avatar: matchMan2, bio: "Morehouse Man. Entrepreneur at heart.", origin: "Somalia", flag: "🇸🇴" },
  { id: 5, name: "Fatou S.", age: 20, schoolId: 101, major: "Economics", year: "Junior", avatar: matchWoman3, bio: "Senegalese & proud. Harvard hustle 📚", origin: "Senegal", flag: "🇸🇳" },
  { id: 6, name: "Emeka O.", age: 21, schoolId: 102, major: "Film & Television", year: "Senior", avatar: matchMan3, bio: "Telling African stories through cinema 🎬", origin: "Nigeria", flag: "🇳🇬" },
  { id: 7, name: "Zara A.", age: 19, schoolId: 106, major: "Public Health", year: "Sophomore", avatar: profileWoman1, bio: "NYU vibes. Ethiopian roots. 🇪🇹", origin: "Ethiopia", flag: "🇪🇹" },
  { id: 8, name: "David N.", age: 22, schoolId: 5, major: "Engineering", year: "Senior", avatar: profileMan1, bio: "FAMU Rattler for life 🐍", origin: "Cameroon", flag: "🇨🇲" },
  { id: 9, name: "Aisha B.", age: 20, schoolId: 103, major: "Journalism", year: "Junior", avatar: profileWoman2, bio: "Words are power. Longhorn & proud 🤘", origin: "USA", flag: "🇺🇸" },
  { id: 10, name: "Marcus L.", age: 21, schoolId: 108, major: "Kinesiology", year: "Junior", avatar: profileMan2, bio: "Athlete & scholar at UMD 🏃🏾‍♂️", origin: "Jamaica", flag: "🇯🇲" },
];
