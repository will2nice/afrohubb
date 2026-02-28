import { useState } from "react";
import { BookOpen, Music, Volume2, ChevronRight, Globe, Sparkles, Link2, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { diasporaHubs } from "@/data/diasporaHubs";

/* ── Language Phrases ── */
interface Phrase {
  phrase: string;
  pronunciation: string;
  meaning: string;
}

interface Language {
  name: string;
  flag: string;
  region: string;
  phrases: Phrase[];
}

const languages: Language[] = [
  {
    name: "Yoruba",
    flag: "🇳🇬",
    region: "West Africa",
    phrases: [
      { phrase: "Bawo ni", pronunciation: "bah-woh nee", meaning: "How are you?" },
      { phrase: "E kaaro", pronunciation: "eh kah-roh", meaning: "Good morning" },
      { phrase: "Mo dúpẹ́", pronunciation: "moh doo-peh", meaning: "Thank you" },
      { phrase: "Ẹ kú ilé", pronunciation: "eh koo ee-leh", meaning: "Welcome home" },
      { phrase: "Ọrẹ mi", pronunciation: "oh-reh mee", meaning: "My friend" },
    ],
  },
  {
    name: "Amharic",
    flag: "🇪🇹",
    region: "East Africa",
    phrases: [
      { phrase: "ሰላም (Selam)", pronunciation: "seh-lahm", meaning: "Hello / Peace" },
      { phrase: "ደህና ነህ (Dehna neh)", pronunciation: "deh-nah neh", meaning: "How are you?" },
      { phrase: "አመሰግናለሁ (Ameseginalehu)", pronunciation: "ah-meh-seh-gee-nah-leh-hoo", meaning: "Thank you" },
      { phrase: "ቤት (Bet)", pronunciation: "beht", meaning: "Home" },
      { phrase: "ውበት (Wibet)", pronunciation: "wuh-beht", meaning: "Beauty" },
    ],
  },
  {
    name: "Swahili",
    flag: "🇰🇪",
    region: "East Africa",
    phrases: [
      { phrase: "Habari yako", pronunciation: "hah-bah-ree yah-koh", meaning: "How are you?" },
      { phrase: "Asante sana", pronunciation: "ah-sahn-teh sah-nah", meaning: "Thank you very much" },
      { phrase: "Hakuna matata", pronunciation: "hah-koo-nah mah-tah-tah", meaning: "No worries" },
      { phrase: "Karibu", pronunciation: "kah-ree-boo", meaning: "Welcome" },
      { phrase: "Ndugu", pronunciation: "n-doo-goo", meaning: "Brother / Sister" },
    ],
  },
  {
    name: "Wolof",
    flag: "🇸🇳",
    region: "West Africa",
    phrases: [
      { phrase: "Nanga def", pronunciation: "nahn-gah def", meaning: "How are you?" },
      { phrase: "Jërëjëf", pronunciation: "jeh-reh-jef", meaning: "Thank you" },
      { phrase: "Mangi fi", pronunciation: "mahn-gee fee", meaning: "I am here" },
      { phrase: "Nit ku baax", pronunciation: "neet koo bahkh", meaning: "A good person" },
    ],
  },
  {
    name: "Twi",
    flag: "🇬🇭",
    region: "West Africa",
    phrases: [
      { phrase: "Ɛte sɛn", pronunciation: "eh-teh sehn", meaning: "How are you?" },
      { phrase: "Medaase", pronunciation: "meh-dah-seh", meaning: "Thank you" },
      { phrase: "Akwaaba", pronunciation: "ah-kwah-bah", meaning: "Welcome" },
      { phrase: "Me dɔ wo", pronunciation: "meh daw woh", meaning: "I love you" },
    ],
  },
  {
    name: "Zulu",
    flag: "🇿🇦",
    region: "Southern Africa",
    phrases: [
      { phrase: "Sawubona", pronunciation: "sah-woo-boh-nah", meaning: "Hello (I see you)" },
      { phrase: "Ngiyabonga", pronunciation: "n-gee-yah-bohn-gah", meaning: "Thank you" },
      { phrase: "Ubuntu", pronunciation: "oo-boon-too", meaning: "Humanity / I am because we are" },
      { phrase: "Amandla", pronunciation: "ah-mahn-dlah", meaning: "Power" },
    ],
  },
  {
    name: "Haitian Creole",
    flag: "🇭🇹",
    region: "Caribbean",
    phrases: [
      { phrase: "Sak pase", pronunciation: "sahk pah-seh", meaning: "What's up?" },
      { phrase: "N'ap boule", pronunciation: "nahp boo-leh", meaning: "We're hanging in there" },
      { phrase: "Mèsi anpil", pronunciation: "meh-see ahn-peel", meaning: "Thank you very much" },
      { phrase: "Fanmi", pronunciation: "fahn-mee", meaning: "Family" },
    ],
  },
  {
    name: "Pidgin English",
    flag: "🇳🇬",
    region: "West Africa",
    phrases: [
      { phrase: "How you dey?", pronunciation: "how yoo day", meaning: "How are you?" },
      { phrase: "I dey kampe", pronunciation: "eye day kahm-peh", meaning: "I'm doing great" },
      { phrase: "No wahala", pronunciation: "no wah-hah-lah", meaning: "No problem" },
      { phrase: "Chop life", pronunciation: "chop life", meaning: "Enjoy life" },
    ],
  },
];

/* ── Dances ── */
interface Dance {
  name: string;
  origin: string;
  flag: string;
  era: string;
  description: string;
  funFact: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const dances: Dance[] = [
  {
    name: "Harlem Shake",
    origin: "Harlem, New York",
    flag: "🇺🇸",
    era: "1981",
    description:
      "Born in the streets of Harlem, this dance involves a rhythmic shoulder shimmy and upper body jerk. Originally called the 'Al B,' it was popularized by dancer Al B and became a staple in hip-hop culture long before the 2013 internet meme.",
    funFact: "The original Harlem Shake has almost nothing to do with the viral 2013 Baauer version — real Harlem residents were famously unimpressed.",
    difficulty: "Beginner",
  },
  {
    name: "Logobi",
    origin: "Côte d'Ivoire / Congo",
    flag: "🇨🇮",
    era: "2000s",
    description:
      "A high-energy street dance originating from the Ivorian and Congolese diaspora in France. Logobi features sharp, jerky arm movements, quick footwork, and exaggerated poses, often performed to Coupé-Décalé and Logobi GT-style beats. It became a viral sensation in French-speaking Africa and Europe.",
    funFact: "Logobi GT's self-titled track helped the dance explode across YouTube in the late 2000s, making it one of the first African dances to go viral online.",
    difficulty: "Intermediate",
  },
  {
    name: "Legwork",
    origin: "Lagos, Nigeria",
    flag: "🇳🇬",
    era: "2017",
    description:
      "An energetic Afrobeats dance characterized by fast, intricate leg movements — kicks, shuffles, and hops — while keeping the upper body relatively still. Popularized by Poco Lee and Zlatan Ibile, it became the go-to dance for street-pop hits.",
    funFact: "Zlatan Ibile's hit 'Zanku (Leg Work)' turned this street dance into a global phenomenon almost overnight.",
    difficulty: "Intermediate",
  },
  {
    name: "Esketa (እስክስታ)",
    origin: "Ethiopia",
    flag: "🇪🇹",
    era: "Traditional",
    description:
      "A traditional Ethiopian dance defined by rapid, rhythmic shoulder movements — shaking, bouncing, and rolling — while the rest of the body stays grounded. Performed at celebrations, it's a hallmark of Ethiopian cultural pride and takes serious shoulder control to master.",
    funFact: "Esketa is so physically demanding that it's sometimes compared to a workout — some fitness classes now incorporate it.",
    difficulty: "Advanced",
  },
  {
    name: "Azonto",
    origin: "Ghana",
    flag: "🇬🇭",
    era: "2011",
    description:
      "A Ghanaian dance that mimics everyday activities — ironing clothes, washing, driving — set to highlife and Afrobeats music. It's playful, expressive, and highly improvisational, allowing dancers to tell stories through movement.",
    funFact: "Fuse ODG's 'Azonto' music video helped introduce the dance to millions worldwide.",
    difficulty: "Beginner",
  },
  {
    name: "Coupé-Décalé",
    origin: "Côte d'Ivoire",
    flag: "🇨🇮",
    era: "2003",
    description:
      "Born in the Ivorian diaspora in Paris, this flashy dance style emphasizes sharp, exaggerated arm and body movements performed with maximum confidence and style. It's inseparable from the Coupé-Décalé music genre.",
    funFact: "The name roughly translates to 'cut and run' — a nod to the extravagant, carefree lifestyle celebrated in the dance.",
    difficulty: "Intermediate",
  },
  {
    name: "Gwara Gwara",
    origin: "South Africa",
    flag: "🇿🇦",
    era: "2016",
    description:
      "A South African dance involving a dipping motion with bent knees and swaying arms, like you're riding an invisible horse. It exploded globally after Rihanna did it at the Grammys.",
    funFact: "Rihanna's Grammy performance put Gwara Gwara on the world map, though South Africans had been doing it for years.",
    difficulty: "Beginner",
  },
  {
    name: "Kuduro",
    origin: "Angola",
    flag: "🇦🇴",
    era: "1980s",
    description:
      "An explosive, high-energy dance from Luanda's musseques (slums) combining fast footwork, acrobatic moves, and sharp body isolations. It emerged alongside Kuduro music, a fusion of soca, hip-hop, and Angolan semba.",
    funFact: "Kuduro means 'hard ass' in Portuguese — a reference to the stiff, exaggerated hip movements in the dance.",
    difficulty: "Advanced",
  },
  {
    name: "Ndombolo",
    origin: "DR Congo",
    flag: "🇨🇩",
    era: "1990s",
    description:
      "A Congolese dance characterized by rapid waist rotations and hip thrusts, performed to soukous and ndombolo music. It's joyful, sensual, and has influenced dance styles across the entire African continent.",
    funFact: "Ndombolo was so popular that at one point the Congolese government considered banning it for being 'too suggestive.'",
    difficulty: "Intermediate",
  },
  {
    name: "Amapiano Moves",
    origin: "South Africa",
    flag: "🇿🇦",
    era: "2019",
    description:
      "A collection of laid-back, groove-heavy dance moves tied to the Amapiano music genre — think smooth footwork, subtle body rolls, and an infectious head-nod vibe. It's all about catching the groove, not showing off.",
    funFact: "Uncle Waffles' viral DJ set helped make Amapiano dance culture a global export from South Africa.",
    difficulty: "Beginner",
  },
];

/* ── Cultural Connections ── */
interface CulturalConnection {
  title: string;
  flags: string[];
  places: string[];
  category: "language" | "dance" | "tradition" | "music";
  summary: string;
  details: string;
  examples: string[];
}

const connections: CulturalConnection[] = [
  {
    title: "Yoruba Survives the Atlantic",
    flags: ["🇳🇬", "🇧🇷", "🇨🇺", "🇺🇸"],
    places: ["Nigeria", "Brazil", "Cuba", "USA (South Carolina)"],
    category: "language",
    summary: "The Yoruba language and spiritual traditions survived slavery and thrive in the Americas today.",
    details:
      "When enslaved Yoruba people were brought to the Americas, they preserved their language through religion and oral tradition. In Brazil, Candomblé ceremonies are still conducted in Yoruba. In Cuba, Lucumí (a Yoruba dialect) is spoken in Santería rituals. The Gullah Geechee people of coastal South Carolina and Georgia retained West African linguistic structures, words, and cultural practices for over 300 years — their creole language contains Yoruba, Mende, and Twi elements.",
    examples: [
      "Brazilian Portuguese borrowed 'axé' (spiritual power) directly from Yoruba 'àṣẹ'",
      "Cuban Lucumí prayers use nearly identical Yoruba vocabulary to this day",
      "Gullah Geechee 'buckra' (white person) comes from Efik/Ibibio languages of Nigeria",
      "The naming tradition 'Day names' in Gullah communities mirrors Akan naming practices from Ghana",
    ],
  },
  {
    title: "Zouk, Kompa & Caribbean Unity",
    flags: ["🇭🇹", "🇬🇵", "🇲🇶", "🇨🇻", "🇧🇷"],
    places: ["Haiti", "Guadeloupe", "Martinique", "Cape Verde", "Brazil"],
    category: "dance",
    summary: "Kompa from Haiti and Zouk from the French Antilles share deep roots and have spread across the lusophone and francophone world.",
    details:
      "Haitian Kompa (Compas) was created by Nemours Jean-Baptiste in 1955, blending méringue with jazz and African rhythms. Zouk emerged in the 1980s from Guadeloupe and Martinique, heavily influenced by Kompa. Cape Verdean artists adopted Zouk and created 'Cabo Zouk,' now a staple genre. In Brazil, Zouk became a major partner dance style (Brazilian Zouk), taught in dance schools worldwide. These genres show how Caribbean and African diaspora music traditions flow freely across language barriers.",
    examples: [
      "Kassav' (Guadeloupe) brought Zouk worldwide — their sound was built on Kompa foundations",
      "Cape Verdean Zouk artists like Nelson Freitas blend Creole lyrics with Antillean rhythms",
      "Brazilian Zouk dance evolved its own style, now taught in 60+ countries",
      "Kompa and Zouk nights are staples in African & Caribbean diaspora communities in Paris, Montreal, and NYC",
    ],
  },
  {
    title: "Nigeria & Black America: Cultural Mirrors",
    flags: ["🇳🇬", "🇺🇸"],
    places: ["Nigeria", "Black America"],
    category: "tradition",
    summary: "From naming ceremonies to call-and-response in music, Nigerian and Black American cultures share deep parallels.",
    details:
      "The cultural exchange between Nigeria and Black America runs centuries deep. Call-and-response patterns in Black church traditions mirror Yoruba and Igbo communal practices. Hip-hop's braggadocio has roots in West African griot storytelling. Nollywood and Black Hollywood increasingly collaborate. Afrobeats and R&B/hip-hop have merged into a dominant global sound. Nigerian jollof debates mirror Black American food pride. Both communities share values of communal celebration, resilience through art, and the centrality of rhythm in daily life.",
    examples: [
      "Call-and-response in Black churches traces directly to West African communal singing",
      "The griot tradition of praise-singing influenced the braggadocio style in hip-hop",
      "Afrobeats x R&B collabs (Burna Boy & Beyoncé, Wizkid & Drake) dominate global charts",
      "Both cultures center food as community — cookouts mirror owambe party culture",
    ],
  },
  {
    title: "South Sudan & Senegal: Cattle, Dance & Pride",
    flags: ["🇸🇸", "🇸🇳"],
    places: ["South Sudan", "Senegal"],
    category: "tradition",
    summary: "Despite being thousands of miles apart, cattle-herding traditions and expressive dance cultures connect these nations.",
    details:
      "The Dinka of South Sudan and the Fulani pastoralists who traverse Senegal both center their cultures around cattle — wealth, status, marriage dowries, and identity are all tied to their herds. Both cultures feature tall, elegant dance forms where height and grace are celebrated. The Dinka's 'jumping dance' and Senegalese Sabar drumming ceremonies both serve as community gatherings where young people showcase skill and attract partners. Scarification and body adornment practices also show striking parallels across these distant communities.",
    examples: [
      "Dinka cattle camps and Fulani transhumance both organize entire societies around herds",
      "Both cultures use dance as courtship — Dinka jumping dances and Senegalese Sabar ceremonies",
      "Body adornment and scarification carry cultural significance in both traditions",
      "Oral poetry praising cattle exists in both Dinka and Fulani traditions",
    ],
  },
  {
    title: "Angola, Cuba & Brazil: The Bantu Thread",
    flags: ["🇦🇴", "🇨🇺", "🇧🇷"],
    places: ["Angola", "Cuba", "Brazil"],
    category: "language",
    summary: "Bantu languages from Angola left permanent marks on Cuban and Brazilian Spanish and Portuguese.",
    details:
      "The massive slave trade from the Kongo and Mbundu kingdoms to Cuba and Brazil created lasting linguistic bridges. Brazilian Portuguese contains hundreds of Bantu-origin words: 'samba,' 'moleque' (kid), 'caçula' (youngest child), 'dendê' (palm oil). Cuban Spanish absorbed Bantu words through the Palo Monte religious tradition. Capoeira, the Brazilian martial art-dance, comes directly from Angolan 'engolo' (a ceremonial fighting dance). Semba music from Angola is the direct ancestor of Brazilian Samba — even the name is the same root word.",
    examples: [
      "'Samba' comes from the Kimbundu word 'semba' meaning 'invitation to dance'",
      "Brazilian 'quilombo' (maroon community) is from Kimbundu 'kilombo' (war camp)",
      "Capoeira evolved from Angolan 'engolo,' a traditional kicking game",
      "Cuban Palo Monte rituals preserve Kikongo language phrases to this day",
    ],
  },
  {
    title: "Gullah Geechee: Africa in America",
    flags: ["🇺🇸", "🇸🇱", "🇬🇭", "🇳🇬"],
    places: ["South Carolina", "Georgia", "Sierra Leone", "Ghana"],
    category: "language",
    summary: "The Gullah Geechee people of the US Sea Islands preserved African languages, rice-farming, and traditions for over 300 years.",
    details:
      "Along the coasts of South Carolina, Georgia, and northern Florida, the Gullah Geechee community maintained one of the strongest direct links to West Africa in the entire diaspora. Their creole language contains words from Mende, Vai, Yoruba, Twi, and other West African languages. Their sweetgrass basket-weaving techniques are identical to those in Sierra Leone. Their rice cultivation methods were brought directly from the 'Rice Coast' of West Africa. Communities like those on Hilton Head Island, St. Helena, and Sapelo Island still practice traditions nearly unchanged from their African origins.",
    examples: [
      "Gullah word 'yam' and food traditions trace to Wolof and Mandinka origins",
      "Sweetgrass baskets sold in Charleston, SC are made with techniques from Sierra Leone",
      "The Gullah 'ring shout' ceremony mirrors circular dances found across West Africa",
      "Gullah naming practices follow West African day-naming and ancestral naming customs",
    ],
  },
  {
    title: "Amapiano & Afrobeats: Pan-African Sound",
    flags: ["🇿🇦", "🇳🇬", "🇬🇭", "🇹🇿"],
    places: ["South Africa", "Nigeria", "Ghana", "Tanzania"],
    category: "music",
    summary: "Amapiano from South Africa and Afrobeats from West Africa are merging into a unified continental sound.",
    details:
      "What started as regional genres are now blending into a Pan-African musical identity. Nigerian Afrobeats artists sample Amapiano log drums; South African producers feature Afrobeats vocalists. Ghanaian Drill borrows from both. Tanzanian Bongo Flava artists collaborate across all these scenes. The result is a new generation of African music that transcends borders, languages, and colonial-era divisions — young Africans in Lagos, Joburg, Accra, and Dar es Salaam are consuming each other's music like never before.",
    examples: [
      "Burna Boy's 'City Boys' blends Afrobeats with Amapiano production",
      "South African DJ Maphorisa collaborates regularly with Nigerian artists",
      "Ghana's 'Asakaa' drill scene borrows ad-libs and flows from both Afrobeats and Amapiano",
      "Spotify's 'African Heat' playlist merges all these scenes for a global audience",
    ],
  },
  {
    title: "Ethiopian & Eritrean Shared Heritage",
    flags: ["🇪🇹", "🇪🇷"],
    places: ["Ethiopia", "Eritrea"],
    category: "tradition",
    summary: "Despite political division, Ethiopian and Eritrean cultures share coffee ceremonies, Ge'ez script, Esketa dance, and deep culinary traditions.",
    details:
      "Ethiopia and Eritrea share the ancient Ge'ez script, the coffee ceremony (jebena buna), injera as a staple food, and Orthodox Christian traditions dating back to the 4th century. The Esketa shoulder dance is performed in both countries. Tigrinya is spoken natively in Eritrea and Ethiopia's Tigray region. Despite a painful border war, diaspora communities in DC, Minneapolis, and London often share restaurants, churches, and cultural spaces — the cultural bonds run deeper than political borders.",
    examples: [
      "The coffee ceremony (jebena buna) is virtually identical in both countries",
      "Ge'ez script is used in both Amharic (Ethiopia) and Tigrinya (Eritrea)",
      "Esketa dance is claimed and performed proudly by both nations",
      "DC's 'Little Ethiopia' on U Street serves both Ethiopian and Eritrean communities",
    ],
  },
];



const categoryIcon: Record<string, string> = {
  language: "🗣️",
  dance: "💃",
  tradition: "🤝",
  music: "🎵",
};

const categoryLabel: Record<string, string> = {
  language: "Language Link",
  dance: "Dance Connection",
  tradition: "Shared Traditions",
  music: "Musical Bridge",
};

const difficultyColor: Record<string, string> = {
  Beginner: "text-green-400 bg-green-400/10",
  Intermediate: "text-primary bg-primary/10",
  Advanced: "text-accent bg-accent/10",
};

const CultureLearnScreen = () => {
  const [expandedLang, setExpandedLang] = useState<string | null>(null);
  const [expandedDance, setExpandedDance] = useState<string | null>(null);
  const [expandedConn, setExpandedConn] = useState<string | null>(null);
  const [expandedHub, setExpandedHub] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          <h1 className="font-display text-lg font-bold text-foreground">Culture Learn</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Phrases · Dances · Connections · Diaspora Hubs</p>
      </div>

      <Tabs defaultValue="languages" className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="languages" className="flex-1 gap-1 text-[11px] data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              <Globe size={12} />
              Phrases
            </TabsTrigger>
            <TabsTrigger value="dances" className="flex-1 gap-1 text-[11px] data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              <Music size={12} />
              Dances
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex-1 gap-1 text-[11px] data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              <Link2 size={12} />
              Links
            </TabsTrigger>
            <TabsTrigger value="hubs" className="flex-1 gap-1 text-[11px] data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              <MapPin size={12} />
              Hubs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Languages Tab ── */}
        <TabsContent value="languages" className="px-4 mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">Tap a language to explore common phrases across the diaspora.</p>
          {languages.map((lang) => {
            const isOpen = expandedLang === lang.name;
            return (
              <div key={lang.name} className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                <button
                  onClick={() => setExpandedLang(isOpen ? null : lang.name)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="font-display font-semibold text-foreground">{lang.name}</p>
                      <p className="text-xs text-muted-foreground">{lang.region}</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border px-4 pb-4 space-y-3">
                    {lang.phrases.map((p, i) => (
                      <div key={i} className="pt-3 flex items-start gap-3">
                        <div className="mt-0.5 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Volume2 size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-foreground text-sm">{p.phrase}</p>
                          <p className="text-xs text-primary italic">/{p.pronunciation}/</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        {/* ── Dances Tab ── */}
        <TabsContent value="dances" className="px-4 mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">From the block to the continent — learn the stories behind iconic dances.</p>
          {dances.map((d) => {
            const isOpen = expandedDance === d.name;
            return (
              <div key={d.name} className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                <button
                  onClick={() => setExpandedDance(isOpen ? null : d.name)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{d.flag}</span>
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-foreground truncate">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.origin} · {d.era}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColor[d.difficulty]}`}>
                      {d.difficulty}
                    </span>
                    <ChevronRight
                      size={18}
                      className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border px-4 py-4 space-y-3">
                    <p className="text-sm text-foreground/90 leading-relaxed">{d.description}</p>
                    <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                      <p className="text-xs font-semibold text-primary mb-1">💡 Fun Fact</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{d.funFact}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        {/* ── Connections Tab ── */}
        <TabsContent value="connections" className="px-4 mt-3 space-y-3 pb-4">
          <p className="text-xs text-muted-foreground">Discover the cultural threads that connect Black and African communities across the globe.</p>
          {connections.map((c) => {
            const isOpen = expandedConn === c.title;
            return (
              <div key={c.title} className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                <button
                  onClick={() => setExpandedConn(isOpen ? null : c.title)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{categoryIcon[c.category]}</span>
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">{categoryLabel[c.category]}</span>
                    </div>
                    <p className="font-display font-semibold text-foreground text-sm leading-tight">{c.title}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {c.flags.map((f, i) => (
                        <span key={i} className="text-base">{f}</span>
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">{c.places.length} regions</span>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border px-4 py-4 space-y-3">
                    <p className="text-xs text-muted-foreground">{c.places.join(" · ")}</p>
                    <p className="text-sm text-foreground/90 leading-relaxed">{c.details}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-primary">🔗 Key Examples</p>
                      {c.examples.map((ex, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5 text-xs">▸</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        {/* ── Diaspora Hubs Tab ── */}
        <TabsContent value="hubs" className="px-4 mt-3 space-y-3 pb-4">
          <p className="text-xs text-muted-foreground">Discover which African & Caribbean communities call each US city home.</p>
          {diasporaHubs.map((hub) => {
            const isOpen = expandedHub === hub.city;
            return (
              <div key={hub.city} className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                <button
                  onClick={() => setExpandedHub(isOpen ? null : hub.city)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{hub.flag}</span>
                    <div>
                      <p className="font-display font-semibold text-foreground">{hub.city}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{hub.state}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <div className="flex gap-0.5">
                          {hub.communities.slice(0, 4).map((c, i) => (
                            <span key={i} className="text-xs">{c.countryFlag}</span>
                          ))}
                          {hub.communities.length > 4 && <span className="text-[10px] text-muted-foreground">+{hub.communities.length - 4}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border px-4 pb-4 space-y-3">
                    {hub.communities.map((c, i) => (
                      <div key={i} className="pt-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{c.countryFlag}</span>
                            <p className="font-display font-semibold text-foreground text-sm">{c.country}</p>
                          </div>
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{c.population}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {c.neighborhoods.map((n, ni) => (
                            <span key={ni} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-foreground">{n}</span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{c.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CultureLearnScreen;
