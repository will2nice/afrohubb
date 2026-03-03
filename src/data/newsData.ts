export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source: string;
  category: string;
  region: string;
  city?: string;
  date: string;
  imageUrl?: string;
  externalUrl?: string;
  tags: string[];
}

export const newsCategories = [
  "All",
  "Conflict & Crisis",
  "Youth & Education",
  "Diaspora",
  "Culture & Arts",
  "Business & Tech",
  "Politics",
  "Health",
  "Climate",
];

export const newsArticles: NewsArticle[] = [
  // === SUDAN CONFLICT ===
  {
    id: 1,
    title: "Sudan Civil War Displaces Over 10 Million — The World's Largest Displacement Crisis",
    summary: "The ongoing conflict between the Sudanese Armed Forces and the Rapid Support Forces has created the world's largest internal displacement crisis, with millions fleeing to Chad, South Sudan, Egypt, and beyond. Humanitarian agencies warn of famine conditions across Darfur and Khartoum.",
    source: "UN OCHA",
    category: "Conflict & Crisis",
    region: "East Africa",
    city: "khartoum",
    date: "2026-03-01",
    tags: ["Sudan", "displacement", "humanitarian", "Darfur", "RSF"],
  },
  {
    id: 2,
    title: "Sudanese Diaspora Rallies Worldwide Demanding International Intervention",
    summary: "From London to Washington to Toronto, Sudanese diaspora communities have organized mass protests calling for an arms embargo and accountability for atrocities committed in Sudan. Youth-led organizations are using social media to amplify voices from inside the country.",
    source: "African Arguments",
    category: "Diaspora",
    region: "Global",
    date: "2026-02-27",
    tags: ["Sudan", "diaspora", "protest", "youth", "activism"],
  },
  {
    id: 3,
    title: "Famine Declared in Parts of Darfur as Aid Access Remains Blocked",
    summary: "The UN has officially declared famine in North Darfur, with conflict blocking humanitarian corridors. Over 25 million people need assistance. Sudanese doctors and volunteers continue to operate under extreme danger.",
    source: "Reuters",
    category: "Conflict & Crisis",
    region: "East Africa",
    city: "khartoum",
    date: "2026-02-25",
    tags: ["Sudan", "famine", "Darfur", "humanitarian"],
  },

  // === EASTERN CONGO / DRC ===
  {
    id: 4,
    title: "M23 Advances in Eastern Congo Spark New Wave of Displacement",
    summary: "Renewed fighting in North Kivu province has displaced hundreds of thousands as M23 rebels expand their territorial control. The diaspora is mobilizing fundraising and awareness campaigns across Europe and North America.",
    source: "Al Jazeera",
    category: "Conflict & Crisis",
    region: "Central Africa",
    date: "2026-02-28",
    tags: ["Congo", "DRC", "M23", "displacement", "conflict"],
  },
  {
    id: 5,
    title: "Congolese Youth in the Diaspora Launch Digital Platform to Document Atrocities",
    summary: "A group of young Congolese activists in Brussels and Paris have launched a citizen journalism platform to verify and document human rights abuses in eastern Congo, bypassing media blackouts.",
    source: "The Guardian Africa",
    category: "Youth & Education",
    region: "Central Africa",
    date: "2026-02-22",
    tags: ["Congo", "youth", "activism", "diaspora", "digital"],
  },

  // === ETHIOPIA / ERITREA ===
  {
    id: 6,
    title: "Tigray Recovery Stalls as Communities Face Food Insecurity Two Years After Ceasefire",
    summary: "Despite the 2022 peace agreement, recovery in Tigray remains slow. Schools and hospitals are still destroyed, and many displaced families have not returned home. Diaspora organizations continue to send aid.",
    source: "BBC Africa",
    category: "Conflict & Crisis",
    region: "East Africa",
    date: "2026-02-20",
    tags: ["Ethiopia", "Tigray", "recovery", "humanitarian"],
  },
  {
    id: 7,
    title: "Eritrean Youth Abroad Push for Democratic Reform and Accountability",
    summary: "Young Eritreans in Sweden, Germany, and the US are organizing a new movement calling for political reform, press freedom, and an end to indefinite national service. Social media campaigns have gained millions of views.",
    source: "Eritrea Focus",
    category: "Youth & Education",
    region: "East Africa",
    date: "2026-02-18",
    tags: ["Eritrea", "youth", "reform", "diaspora", "activism"],
  },

  // === SOMALIA ===
  {
    id: 8,
    title: "Somalia's Youth Unemployment Crisis Fuels Migration Wave",
    summary: "With over 75% youth unemployment in some regions, young Somalis continue to seek opportunities abroad. Diaspora remittances remain the country's economic lifeline, exceeding $2 billion annually.",
    source: "Africa Confidential",
    category: "Youth & Education",
    region: "East Africa",
    date: "2026-02-24",
    tags: ["Somalia", "youth", "unemployment", "migration", "remittances"],
  },
  {
    id: 9,
    title: "Somali Diaspora in Minneapolis Builds $50M Community Center",
    summary: "The Somali community in Minneapolis has broken ground on a major community center that will house cultural programs, job training, language classes, and youth mentorship, funded largely by diaspora contributions.",
    source: "Star Tribune",
    category: "Diaspora",
    region: "North America",
    city: "minneapolis",
    date: "2026-02-15",
    tags: ["Somalia", "diaspora", "Minneapolis", "community", "investment"],
  },

  // === NIGERIA ===
  {
    id: 10,
    title: "Nigerian Tech Startups Raise Record $1.2 Billion Despite Economic Challenges",
    summary: "Nigeria's tech ecosystem continues to thrive with record funding rounds. Young entrepreneurs in Lagos, Abuja, and the diaspora are building solutions in fintech, healthtech, and agritech that serve the continent.",
    source: "TechCrunch Africa",
    category: "Business & Tech",
    region: "West Africa",
    city: "lagos",
    date: "2026-03-02",
    tags: ["Nigeria", "tech", "startups", "youth", "innovation"],
  },
  {
    id: 11,
    title: "Insecurity in Northern Nigeria Forces Thousands of Students Out of School",
    summary: "Ongoing banditry and kidnappings in northwest Nigeria have closed hundreds of schools, affecting over 10 million children. Education advocates are calling for emergency federal intervention.",
    source: "Premium Times",
    category: "Youth & Education",
    region: "West Africa",
    date: "2026-02-26",
    tags: ["Nigeria", "education", "security", "youth", "crisis"],
  },
  {
    id: 12,
    title: "Nigerians in Diaspora Send $20 Billion in Remittances Amid Naira Crisis",
    summary: "Despite currency devaluation and economic uncertainty, the Nigerian diaspora continues to be a crucial economic force, with remittances making up a significant portion of GDP.",
    source: "Financial Times",
    category: "Diaspora",
    region: "West Africa",
    date: "2026-02-19",
    tags: ["Nigeria", "diaspora", "remittances", "economy"],
  },

  // === KENYA ===
  {
    id: 13,
    title: "Gen Z Protests in Kenya Reshape Political Landscape",
    summary: "Young Kenyans continue to drive political accountability through organized protests and digital campaigns, challenging government policy on taxation, corruption, and police brutality.",
    source: "Nation Africa",
    category: "Politics",
    region: "East Africa",
    city: "nairobi",
    date: "2026-02-28",
    tags: ["Kenya", "GenZ", "protests", "youth", "politics"],
  },
  {
    id: 14,
    title: "Kenyan Diaspora Professionals Launch Mentorship Network for Youth Back Home",
    summary: "A network of Kenyan professionals in the US and UK has launched a virtual mentorship platform connecting diaspora expertise with young Kenyans in tech, medicine, law, and entrepreneurship.",
    source: "The East African",
    category: "Youth & Education",
    region: "East Africa",
    date: "2026-02-12",
    tags: ["Kenya", "diaspora", "mentorship", "youth", "professional"],
  },

  // === GHANA ===
  {
    id: 15,
    title: "Ghana's Year of Return Legacy Continues: Diaspora Investment Hits New High",
    summary: "Building on the success of the Year of Return, Ghana continues to attract diaspora investment in real estate, tourism, and agriculture, with new dual citizenship provisions making relocation easier.",
    source: "Ghana Web",
    category: "Diaspora",
    region: "West Africa",
    city: "accra",
    date: "2026-02-21",
    tags: ["Ghana", "diaspora", "investment", "Year of Return"],
  },
  {
    id: 16,
    title: "Ghanaian Youth Lead Africa's Creative Economy Boom",
    summary: "From Accra's fashion scene to Kumasi's tech hubs, young Ghanaians are at the forefront of Africa's creative economy, blending tradition with innovation in music, film, and design.",
    source: "OkayAfrica",
    category: "Culture & Arts",
    region: "West Africa",
    city: "accra",
    date: "2026-02-17",
    tags: ["Ghana", "youth", "creative economy", "fashion", "tech"],
  },

  // === SOUTH SUDAN ===
  {
    id: 17,
    title: "South Sudan Faces Renewed Violence as Peace Agreement Deadline Passes",
    summary: "The transitional government has failed to meet key benchmarks of the peace agreement, raising fears of renewed conflict. Over 2 million South Sudanese remain refugees in neighboring countries.",
    source: "UNHCR",
    category: "Conflict & Crisis",
    region: "East Africa",
    date: "2026-02-23",
    tags: ["South Sudan", "conflict", "peace", "refugees"],
  },
  {
    id: 18,
    title: "South Sudanese Youth in Australia Organize Cultural Festival to Preserve Heritage",
    summary: "The South Sudanese community in Melbourne has organized its largest cultural festival, featuring traditional music, food, and storytelling to keep connections alive for the younger generation born in the diaspora.",
    source: "SBS News",
    category: "Diaspora",
    region: "Oceania",
    city: "melbourne",
    date: "2026-02-10",
    tags: ["South Sudan", "diaspora", "Australia", "culture", "youth"],
  },

  // === PAN-AFRICAN / CONTINENTAL ===
  {
    id: 19,
    title: "African Union Launches Continental Youth Employment Initiative",
    summary: "The AU has announced a $5 billion initiative targeting youth employment across the continent, with focus on digital skills, green energy, and agricultural modernization. Over 60% of Africa's population is under 25.",
    source: "African Union",
    category: "Youth & Education",
    region: "Pan-African",
    date: "2026-03-01",
    tags: ["AU", "youth", "employment", "Pan-African", "initiative"],
  },
  {
    id: 20,
    title: "Climate Change Threatens Food Security Across the Sahel",
    summary: "Droughts, floods, and desertification are devastating agricultural communities across the Sahel region, from Senegal to Chad. Young farmers are adopting innovative techniques but need more support and investment.",
    source: "Climate Home News",
    category: "Climate",
    region: "West Africa",
    date: "2026-02-14",
    tags: ["climate", "Sahel", "food security", "agriculture", "youth"],
  },
  {
    id: 21,
    title: "Afrobeats Goes Global: African Artists Dominate International Charts",
    summary: "African musicians continue to break records globally, with Afrobeats, Amapiano, and other genres becoming mainstream. Young artists are using their platforms to raise awareness about social issues on the continent.",
    source: "Rolling Stone",
    category: "Culture & Arts",
    region: "Global",
    date: "2026-02-16",
    tags: ["Afrobeats", "music", "culture", "youth", "global"],
  },
  {
    id: 22,
    title: "African Diaspora Mental Health Crisis: Breaking the Stigma",
    summary: "A growing number of diaspora organizations are addressing mental health challenges faced by African immigrants and refugees, including trauma, identity struggles, and the pressures of assimilation.",
    source: "The Lancet",
    category: "Health",
    region: "Global",
    date: "2026-02-08",
    tags: ["diaspora", "mental health", "health", "refugees", "community"],
  },

  // === HAITI ===
  {
    id: 23,
    title: "Haiti's Gang Crisis Deepens as UN Calls for Urgent International Support",
    summary: "Port-au-Prince remains largely under gang control, with over 5 million Haitians facing food insecurity. The Haitian diaspora in Miami, Boston, and Montreal are organizing humanitarian aid drives.",
    source: "Miami Herald",
    category: "Conflict & Crisis",
    region: "Caribbean",
    date: "2026-02-25",
    tags: ["Haiti", "crisis", "gang violence", "diaspora", "humanitarian"],
  },
  {
    id: 24,
    title: "Haitian Youth in Boston Launch Education Fund for Children Back Home",
    summary: "Young Haitian Americans in Boston have raised over $500,000 for an education fund providing scholarships and school supplies to children in Haiti affected by the ongoing instability.",
    source: "Boston Globe",
    category: "Diaspora",
    region: "Caribbean",
    city: "boston",
    date: "2026-02-13",
    tags: ["Haiti", "diaspora", "Boston", "education", "youth"],
  },

  // === CAMEROON ===
  {
    id: 25,
    title: "Anglophone Crisis in Cameroon Enters 9th Year with No Resolution in Sight",
    summary: "The conflict in Cameroon's English-speaking regions continues to displace hundreds of thousands. Schools remain closed and young people are caught between armed groups and military operations.",
    source: "International Crisis Group",
    category: "Conflict & Crisis",
    region: "Central Africa",
    date: "2026-02-20",
    tags: ["Cameroon", "Anglophone crisis", "conflict", "youth", "displacement"],
  },

  // === MOZAMBIQUE ===
  {
    id: 26,
    title: "Mozambique's Post-Election Crisis Sparks Youth-Led Democracy Movement",
    summary: "Young Mozambicans are demanding electoral reform and transparency after disputed election results. The movement, largely organized on social media, has drawn parallels to Kenya's Gen Z protests.",
    source: "Mail & Guardian",
    category: "Politics",
    region: "Southern Africa",
    date: "2026-02-18",
    tags: ["Mozambique", "youth", "democracy", "protests", "election"],
  },

  // === DIASPORA IMPACT ===
  {
    id: 27,
    title: "African Diaspora Remittances Surpass Foreign Aid for First Time",
    summary: "Remittances from the African diaspora have officially exceeded foreign aid to the continent, highlighting the economic power and responsibility of African communities abroad. The African Union calls for better financial infrastructure.",
    source: "World Bank",
    category: "Business & Tech",
    region: "Global",
    date: "2026-03-02",
    tags: ["diaspora", "remittances", "economy", "Pan-African", "finance"],
  },
  {
    id: 28,
    title: "Young Africans in Europe Challenge Anti-Immigration Narratives Through Art",
    summary: "A collective of young African artists across London, Paris, Berlin, and Amsterdam are using exhibitions, film, and spoken word to challenge negative narratives about African migration and celebrate diaspora contributions.",
    source: "Frieze Magazine",
    category: "Culture & Arts",
    region: "Europe",
    date: "2026-02-11",
    tags: ["diaspora", "art", "immigration", "youth", "Europe"],
  },
];
