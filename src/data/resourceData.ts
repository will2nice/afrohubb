export interface CityResource {
  id: number;
  name: string;
  type: "nonprofit" | "hiring";
  category: string;
  description: string;
  city: string;
  website?: string;
}

export const cityResources: CityResource[] = [
  // Austin
  { id: 1, name: "Austin Area Urban League", type: "nonprofit", category: "Youth Development", description: "Empowering Black youth through mentorship, education, and career readiness programs.", city: "austin" },
  { id: 2, name: "Capital City Black Chamber", type: "nonprofit", category: "Business Support", description: "Supporting Black-owned businesses with resources, grants, and networking.", city: "austin" },
  { id: 3, name: "Indeed Austin", type: "hiring", category: "Tech", description: "Hiring software engineers, data analysts, and product managers. Diversity-focused recruiting.", city: "austin" },

  // Dallas
  { id: 4, name: "South Dallas Employment Project", type: "nonprofit", category: "Workforce", description: "Job training and placement for underserved communities in South Dallas.", city: "dallas" },
  { id: 5, name: "AT&T Dallas HQ", type: "hiring", category: "Tech & Telecom", description: "Actively recruiting engineers, cybersecurity analysts, and UX designers.", city: "dallas" },
  { id: 6, name: "Big Brothers Big Sisters – North Texas", type: "nonprofit", category: "Youth Mentorship", description: "Mentorship programs for at-risk youth across DFW.", city: "dallas" },

  // Houston
  { id: 7, name: "Houston Area Urban League", type: "nonprofit", category: "Workforce", description: "Career development, housing assistance, and youth programs.", city: "houston" },
  { id: 8, name: "Hewlett Packard Enterprise", type: "hiring", category: "Tech", description: "Hiring cloud engineers, AI specialists, and product managers in Houston.", city: "houston" },

  // NYC
  { id: 9, name: "Black Male Initiative NYC", type: "nonprofit", category: "Youth Development", description: "Academic and professional development for Black men in NYC.", city: "nyc" },
  { id: 10, name: "Per Scholas NYC", type: "nonprofit", category: "Tech Training", description: "Free tech training for underrepresented communities. Cybersecurity, cloud, and dev ops.", city: "nyc" },
  { id: 11, name: "Google NYC", type: "hiring", category: "Tech", description: "Engineering, product, and design roles. Strong diversity and inclusion hiring initiatives.", city: "nyc" },
  { id: 12, name: "JP Morgan Chase", type: "hiring", category: "Fintech", description: "Technology and software engineering positions with robust DEI programs.", city: "nyc" },

  // Atlanta
  { id: 13, name: "100 Black Men of Atlanta", type: "nonprofit", category: "Youth Mentorship", description: "Mentoring, education, and health initiatives for Black youth.", city: "atlanta" },
  { id: 14, name: "Year Up Atlanta", type: "nonprofit", category: "Tech Training", description: "Closing the opportunity divide for young adults through skills training.", city: "atlanta" },
  { id: 15, name: "Microsoft Atlanta", type: "hiring", category: "Tech", description: "Cloud engineering, AI, and program management roles.", city: "atlanta" },
  { id: 16, name: "Mailchimp (Intuit)", type: "hiring", category: "Tech", description: "Software engineering and data science positions in Atlanta HQ.", city: "atlanta" },

  // Miami
  { id: 17, name: "Miami Urban League", type: "nonprofit", category: "Workforce", description: "Employment programs, housing counseling, and youth development.", city: "miami" },
  { id: 18, name: "Black Tech Week Miami", type: "nonprofit", category: "Tech Community", description: "Connecting Black professionals in tech through events and networking.", city: "miami" },

  // Chicago
  { id: 19, name: "My Block My Hood My City", type: "nonprofit", category: "Youth Development", description: "Exposing Chicago youth to new experiences, opportunities, and resources.", city: "chicago" },
  { id: 20, name: "i.c.stars Chicago", type: "nonprofit", category: "Tech Training", description: "Technology workforce development for underserved adults.", city: "chicago" },
  { id: 21, name: "Grubhub Chicago", type: "hiring", category: "Tech", description: "Engineering, data, and product roles at Chicago headquarters.", city: "chicago" },

  // Los Angeles
  { id: 22, name: "Brotherhood Crusade", type: "nonprofit", category: "Youth Development", description: "Youth development and community enrichment in South LA.", city: "losangeles" },
  { id: 23, name: "Snap Inc.", type: "hiring", category: "Tech", description: "Hiring engineers, designers, and content strategists in Santa Monica.", city: "losangeles" },

  // DC
  { id: 24, name: "National Urban League", type: "nonprofit", category: "Civil Rights & Advocacy", description: "Historic civil rights org: economic empowerment, education, and social justice.", city: "dc" },
  { id: 25, name: "Year Up DC", type: "nonprofit", category: "Tech Training", description: "Professional training and internships for young adults.", city: "dc" },
  { id: 26, name: "Amazon HQ2", type: "hiring", category: "Tech", description: "Software engineering, cloud, and operations roles at Arlington HQ2.", city: "dc" },

  // London
  { id: 27, name: "Black Founders Network UK", type: "nonprofit", category: "Entrepreneurship", description: "Supporting Black entrepreneurs with funding, mentorship, and community.", city: "london" },
  { id: 28, name: "10,000 Black Interns", type: "nonprofit", category: "Career Opportunities", description: "Paid internship placements across major UK industries.", city: "london" },
  { id: 29, name: "Deliveroo London", type: "hiring", category: "Tech", description: "Engineering and product roles with DEI hiring programs.", city: "london" },

  // Paris
  { id: 30, name: "Club XXIe Siècle", type: "nonprofit", category: "Diversity & Inclusion", description: "Promoting diversity in French leadership and corporate sectors.", city: "paris" },
  { id: 31, name: "BlaBlaCar Paris", type: "hiring", category: "Tech", description: "Backend, mobile, and data engineering positions.", city: "paris" },

  // Toronto
  { id: 32, name: "Black Professionals in Tech Network", type: "nonprofit", category: "Tech Community", description: "Canada's largest Black tech community—events, mentorship, and jobs.", city: "toronto" },
  { id: 33, name: "Shopify Toronto", type: "hiring", category: "Tech", description: "Full-stack, mobile, and data engineering roles.", city: "toronto" },

  // San Francisco
  { id: 34, name: "Code2040", type: "nonprofit", category: "Tech Training", description: "Creating pathways to tech careers for Black and Latinx innovators.", city: "sanfrancisco" },
  { id: 35, name: "Salesforce SF", type: "hiring", category: "Tech", description: "Engineering, product, and design roles with strong Equality initiatives.", city: "sanfrancisco" },

  // Denver
  { id: 36, name: "Denver Urban League", type: "nonprofit", category: "Workforce", description: "Job training, housing, and youth programs for the Black community.", city: "denver" },

  // Philadelphia
  { id: 37, name: "Black Doctors Consortium", type: "nonprofit", category: "Health & Wellness", description: "Health equity and access for Black communities in Philly.", city: "philadelphia" },
  { id: 38, name: "Comcast Philadelphia", type: "hiring", category: "Tech & Media", description: "Software engineering, cybersecurity, and product roles at HQ.", city: "philadelphia" },

  // Detroit
  { id: 39, name: "Detroit Future City", type: "nonprofit", category: "Community Development", description: "Working to create an equitable and sustainable Detroit.", city: "detroit" },

  // Seattle
  { id: 40, name: "Blacks in Technology Seattle", type: "nonprofit", category: "Tech Community", description: "Community for Black tech professionals in the Pacific Northwest.", city: "seattle" },
  { id: 41, name: "Amazon Seattle", type: "hiring", category: "Tech", description: "Engineering, ML, and cloud roles. Largest employer in Seattle.", city: "seattle" },

  // Rio
  { id: 42, name: "CUFA – Central Única das Favelas", type: "nonprofit", category: "Community Development", description: "Education, sports, and culture programs in Rio's favelas.", city: "rio" },

  // São Paulo
  { id: 43, name: "Afro-Hub SP", type: "nonprofit", category: "Tech & Entrepreneurship", description: "Accelerator and community for Afro-Brazilian tech entrepreneurs.", city: "saopaulo" },
  { id: 44, name: "Nubank São Paulo", type: "hiring", category: "Fintech", description: "Engineering and data roles at Latin America's largest digital bank.", city: "saopaulo" },

  // Salvador
  { id: 45, name: "Ilê Aiyê", type: "nonprofit", category: "Culture & Education", description: "Oldest Afro-Brazilian bloco—education, culture, and community empowerment.", city: "salvador" },

  // Brussels
  { id: 46, name: "Afro-Belgian Women Network", type: "nonprofit", category: "Women Empowerment", description: "Professional development and networking for Afro-Belgian women.", city: "brussels" },

  // Amsterdam
  { id: 47, name: "Afro Tech Fest Amsterdam", type: "nonprofit", category: "Tech Community", description: "Showcasing Black innovators in European tech.", city: "amsterdam" },

  // Berlin
  { id: 48, name: "EOTO – Each One Teach One", type: "nonprofit", category: "Community & Education", description: "Empowerment center for the Black community in Berlin.", city: "berlin" },

  // Nashville
  { id: 49, name: "Nashville Urban League", type: "nonprofit", category: "Workforce", description: "Employment, education, and community programs.", city: "nashville" },

  // Minneapolis
  { id: 50, name: "Appetite for Change", type: "nonprofit", category: "Community Development", description: "Using food as a tool for health, economic, and social change in North Minneapolis.", city: "minneapolis" },

  // Montreal
  { id: 51, name: "Black Entrepreneurship Program Canada", type: "nonprofit", category: "Entrepreneurship", description: "Loans and mentorship for Black business owners in Quebec.", city: "montreal" },

  // Barcelona
  { id: 52, name: "SOS Racisme Catalunya", type: "nonprofit", category: "Civil Rights", description: "Anti-discrimination advocacy and support for Afro-Spanish communities.", city: "barcelona" },
];
