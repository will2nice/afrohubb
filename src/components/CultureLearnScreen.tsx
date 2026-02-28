import { useState } from "react";
import { BookOpen, Music, Volume2, ChevronRight, Globe, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    name: "Lagobi (Lágòbì)",
    origin: "Lagos, Nigeria",
    flag: "🇳🇬",
    era: "2010s",
    description:
      "A smooth, groovy dance from Lagos that involves fluid waist movements and footwork synchronized to Afrobeats rhythms. It embodies the effortless cool of Lagos nightlife and has been featured in countless Afrobeats music videos.",
    funFact: "Lagobi literally translates to 'Lagos dance' and captures the swagger that defines the city's party scene.",
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

const difficultyColor: Record<string, string> = {
  Beginner: "text-green-400 bg-green-400/10",
  Intermediate: "text-primary bg-primary/10",
  Advanced: "text-accent bg-accent/10",
};

const CultureLearnScreen = () => {
  const [expandedLang, setExpandedLang] = useState<string | null>(null);
  const [expandedDance, setExpandedDance] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          <h1 className="font-display text-lg font-bold text-foreground">Culture Learn</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Language phrases · Dance origins · Diaspora culture</p>
      </div>

      <Tabs defaultValue="languages" className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="languages" className="flex-1 gap-1.5 data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              <Globe size={14} />
              Phrases
            </TabsTrigger>
            <TabsTrigger value="dances" className="flex-1 gap-1.5 data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              <Music size={14} />
              Dances
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
      </Tabs>
    </div>
  );
};

export default CultureLearnScreen;
