export interface DiasporaHub {
  city: string;
  state: string;
  flag: string;
  cityId: string; // maps to cityCoords key in MapScreen
  communities: {
    country: string;
    countryFlag: string;
    population: string;
    neighborhoods: string[];
    notes: string;
  }[];
}

export const diasporaHubs: DiasporaHub[] = [
  {
    city: "New York City", state: "NY", flag: "🗽", cityId: "nyc",
    communities: [
      { country: "Senegal", countryFlag: "🇸🇳", population: "~30,000+", neighborhoods: ["Harlem", "Little Senegal (116th St)", "The Bronx"], notes: "Largest Senegalese community in the US. 116th Street in Harlem is known as 'Little Senegal' with Wolof spoken on every corner." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~25,000+", neighborhoods: ["The Bronx", "Morrisania", "Parkchester"], notes: "Strong Ghanaian presence in the Bronx with community associations, churches, and restaurants." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~40,000+", neighborhoods: ["Brooklyn", "The Bronx", "Queens"], notes: "One of the largest Nigerian populations in the US. Igbo, Yoruba, and Edo communities thrive here." },
      { country: "Guinea", countryFlag: "🇬🇳", population: "~15,000+", neighborhoods: ["Harlem", "The Bronx"], notes: "Significant Guinean community with strong ties to the Mandinka and Fulani diasporas." },
      { country: "Haiti", countryFlag: "🇭🇹", population: "~100,000+", neighborhoods: ["Flatbush (Brooklyn)", "Crown Heights", "East New York"], notes: "Flatbush is the cultural capital of Haitian America. Kreyòl is the second language of Brooklyn." },
      { country: "Jamaica", countryFlag: "🇯🇲", population: "~300,000+", neighborhoods: ["Flatbush", "Crown Heights", "Southeast Queens"], notes: "NYC has the largest Jamaican population outside of Jamaica. Patois echoes through Brooklyn streets." },
      { country: "Trinidad & Tobago", countryFlag: "🇹🇹", population: "~50,000+", neighborhoods: ["Crown Heights", "Flatbush", "Richmond Hill (Queens)"], notes: "Trini community keeps soca and carnival culture alive. West Indian Day Parade is their crown jewel." },
      { country: "Guyana", countryFlag: "🇬🇾", population: "~140,000+", neighborhoods: ["Richmond Hill (Queens)", "Flatbush", "South Ozone Park"], notes: "One of the largest Guyanese communities in the world. Richmond Hill is known as 'Little Guyana.'" },
      { country: "Barbados", countryFlag: "🇧🇧", population: "~20,000+", neighborhoods: ["Brooklyn", "The Bronx"], notes: "Bajan community with deep roots in Brooklyn since the early 20th century." },
    ],
  },
  {
    city: "Washington, DC", state: "DC/MD/VA", flag: "🏛️", cityId: "dc",
    communities: [
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~50,000+", neighborhoods: ["U Street", "Adams Morgan", "Silver Spring (MD)"], notes: "The largest Ethiopian community outside of Africa. U Street is known as 'Little Ethiopia' with dozens of restaurants and cultural spaces." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~30,000+", neighborhoods: ["Adams Morgan", "Columbia Heights", "Alexandria (VA)"], notes: "Eritrean community deeply intertwined with Ethiopian spaces. Shared restaurants, churches, and cultural events." },
      { country: "Sudan", countryFlag: "🇸🇩", population: "~10,000+", neighborhoods: ["Arlington (VA)", "Falls Church", "Silver Spring (MD)"], notes: "Growing Sudanese community with cultural organizations and advocacy groups." },
      { country: "Cameroon", countryFlag: "🇨🇲", population: "~15,000+", neighborhoods: ["Silver Spring (MD)", "Takoma Park", "Laurel"], notes: "Vibrant Cameroonian community with regular cultural festivals and community gatherings." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~25,000+", neighborhoods: ["Bowie (MD)", "Woodbridge (VA)", "Upper Marlboro"], notes: "Large Nigerian professional community in the DMV suburbs. Strong Igbo and Yoruba associations." },
    ],
  },
  {
    city: "Houston", state: "TX", flag: "🤠", cityId: "houston",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~100,000+", neighborhoods: ["Alief", "Missouri City", "Sugar Land", "Richmond"], notes: "Houston has one of the largest Nigerian communities in the US. Alief is sometimes called 'Little Lagos.' Strong Igbo, Yoruba, and Edo presence." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~15,000+", neighborhoods: ["Southwest Houston", "Stafford"], notes: "Active Ghanaian churches, cultural associations, and food spots." },
      { country: "Cameroon", countryFlag: "🇨🇲", population: "~10,000+", neighborhoods: ["Southwest Houston", "Fort Bend County"], notes: "Growing Cameroonian community with annual cultural festivals." },
    ],
  },
  {
    city: "Dallas–Fort Worth", state: "TX", flag: "⛪", cityId: "dallas",
    communities: [
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~30,000+", neighborhoods: ["Vickery Meadow", "East Dallas", "Garland", "Plano"], notes: "One of the largest Habesha communities in Texas. Vickery Meadow has Ethiopian markets, restaurants, and churches." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~15,000+", neighborhoods: ["Vickery Meadow", "Richardson", "Arlington"], notes: "Eritrean community shares cultural spaces with the Ethiopian diaspora across DFW." },
      { country: "Sudan", countryFlag: "🇸🇩", population: "~8,000+", neighborhoods: ["Arlington", "Grand Prairie", "Garland"], notes: "Sudanese community with mosques, cultural centers, and community organizations." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~30,000+", neighborhoods: ["DeSoto", "Cedar Hill", "Duncanville", "Irving"], notes: "Large Nigerian community in southern Dallas suburbs. Active Igbo and Yoruba cultural groups." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~5,000+", neighborhoods: ["Vickery Meadow", "East Dallas"], notes: "Growing Somali refugee community in East Dallas neighborhoods." },
    ],
  },
  {
    city: "Atlanta", state: "GA", flag: "🍑", cityId: "atlanta",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~30,000+", neighborhoods: ["Decatur", "Stone Mountain", "Lithonia"], notes: "Rapidly growing Nigerian community. Atlanta is a top destination for Nigerian professionals." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~15,000+", neighborhoods: ["Clarkston", "Decatur"], notes: "Clarkston is known as the most diverse square mile in America, with a significant Habesha presence." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~10,000+", neighborhoods: ["Decatur", "Stone Mountain", "Lawrenceville"], notes: "Active Ghanaian community with cultural events and associations." },
      { country: "Jamaica", countryFlag: "🇯🇲", population: "~20,000+", neighborhoods: ["East Atlanta", "Decatur", "College Park"], notes: "Strong Caribbean presence with reggae events, restaurants, and cultural festivals." },
    ],
  },
  {
    city: "Minneapolis–St. Paul", state: "MN", flag: "❄️", cityId: "minneapolis",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~80,000+", neighborhoods: ["Cedar-Riverside", "South Minneapolis", "St. Paul"], notes: "The largest Somali community in the US. Cedar-Riverside is known as 'Little Mogadishu.' Represented by Ilhan Omar in Congress." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~20,000+", neighborhoods: ["South Minneapolis", "St. Paul"], notes: "Significant Oromo and Amhara communities in the Twin Cities." },
      { country: "Liberia", countryFlag: "🇱🇷", population: "~15,000+", neighborhoods: ["Brooklyn Park", "Brooklyn Center"], notes: "Large Liberian refugee community. Brooklyn Park has one of the highest Liberian populations in the country." },
      { country: "Kenya", countryFlag: "🇰🇪", population: "~8,000+", neighborhoods: ["South Minneapolis", "Bloomington"], notes: "Growing Kenyan community with professional and cultural associations in the Twin Cities." },
    ],
  },
  {
    city: "Columbus", state: "OH", flag: "🌰", cityId: "cleveland",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~45,000+", neighborhoods: ["North Columbus", "Northland", "Westerville"], notes: "Second-largest Somali community in the US after Minneapolis. Strong Somali Bantu community as well." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~5,000+", neighborhoods: ["North Columbus", "Westerville"], notes: "Oromo and Amhara communities growing alongside the Somali diaspora." },
    ],
  },
  {
    city: "Omaha & Lincoln", state: "NE", flag: "🌾", cityId: "omaha",
    communities: [
      { country: "South Sudan", countryFlag: "🇸🇸", population: "~15,000+", neighborhoods: ["South Omaha", "North Omaha", "Lincoln"], notes: "One of the largest South Sudanese (Nuer and Dinka) communities in the US. Strong meatpacking industry employment." },
      { country: "Sudan", countryFlag: "🇸🇩", population: "~5,000+", neighborhoods: ["Omaha", "Lincoln"], notes: "Sudanese community with mosques and cultural organizations alongside the South Sudanese diaspora." },
    ],
  },
  {
    city: "Portland", state: "OR", flag: "🌲", cityId: "portland",
    communities: [
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~10,000+", neighborhoods: ["SE Portland", "Beaverton"], notes: "Significant Habesha community. Ethiopian restaurants are a staple of Portland's food scene." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~5,000+", neighborhoods: ["SE Portland"], notes: "Eritrean community shares cultural spaces with Ethiopian diaspora." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~8,000+", neighborhoods: ["East Portland", "Gresham"], notes: "Growing Somali community in East Portland and surrounding areas." },
    ],
  },
  {
    city: "San Diego", state: "CA", flag: "🌴", cityId: "sandiego",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~20,000+", neighborhoods: ["City Heights", "El Cajon"], notes: "Large Somali and Somali Bantu refugee community. City Heights is a major hub." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~8,000+", neighborhoods: ["City Heights", "North Park"], notes: "Ethiopian community with restaurants and churches in City Heights corridor." },
    ],
  },
  {
    city: "Boston", state: "MA", flag: "🎓", cityId: "boston",
    communities: [
      { country: "Cape Verde", countryFlag: "🇨🇻", population: "~35,000+", neighborhoods: ["Dorchester", "Brockton", "New Bedford"], notes: "The largest Cape Verdean community in the US. Kriolu is widely spoken. Deep roots going back to whaling industry immigration." },
      { country: "Haiti", countryFlag: "🇭🇹", population: "~50,000+", neighborhoods: ["Mattapan", "Dorchester", "Brockton"], notes: "Mattapan is Boston's Haitian cultural center. Strong Kreyòl-speaking community." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~10,000+", neighborhoods: ["Randolph", "Milton", "South Shore"], notes: "Growing Nigerian professional community in Boston's South Shore suburbs." },
    ],
  },
  {
    city: "Miami", state: "FL", flag: "🌊", cityId: "miami",
    communities: [
      { country: "Haiti", countryFlag: "🇭🇹", population: "~250,000+", neighborhoods: ["Little Haiti", "North Miami", "Miami Gardens"], notes: "Little Haiti is the cultural heart of the Haitian diaspora. Kompa music fills the streets. One of the largest Haitian communities anywhere." },
      { country: "Jamaica", countryFlag: "🇯🇲", population: "~100,000+", neighborhoods: ["Miramar", "Lauderhill", "Pembroke Pines"], notes: "South Florida has one of the densest Jamaican communities in the US. Lauderhill is sometimes called 'Little Jamaica.'" },
      { country: "Trinidad & Tobago", countryFlag: "🇹🇹", population: "~30,000+", neighborhoods: ["Lauderhill", "Miramar", "Hollywood"], notes: "Trini community brings soca, carnival culture, and doubles to South Florida." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~15,000+", neighborhoods: ["Miramar", "Pembroke Pines"], notes: "Growing Nigerian community in Broward County suburbs." },
      { country: "Bahamas", countryFlag: "🇧🇸", population: "~40,000+", neighborhoods: ["Miami Gardens", "North Miami Beach", "Opa-Locka"], notes: "Large Bahamian community with deep historical ties to South Florida dating back generations." },
      { country: "Cuba", countryFlag: "🇨🇺", population: "~800,000+", neighborhoods: ["Little Havana", "Hialeah", "Westchester"], notes: "Massive Afro-Cuban diaspora. Santería traditions preserve Yoruba spiritual practices brought from West Africa." },
      { country: "Dominican Republic", countryFlag: "🇩🇴", population: "~100,000+", neighborhoods: ["Doral", "Hialeah", "Allapattah"], notes: "Afro-Dominican community with deep roots in bachata, merengue, and African-descended culture." },
      { country: "Guyana", countryFlag: "🇬🇾", population: "~15,000+", neighborhoods: ["Lauderhill", "Sunrise"], notes: "Guyanese community adding to South Florida's rich Caribbean tapestry." },
    ],
  },
  {
    city: "Chicago", state: "IL", flag: "🏙️", cityId: "chicago",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~20,000+", neighborhoods: ["South Side", "Lawndale", "Evanston"], notes: "Nigerian community with strong Igbo and Yoruba organizations and events." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~10,000+", neighborhoods: ["South Side", "Harvey"], notes: "Active Ghanaian community with cultural festivals and churches." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~8,000+", neighborhoods: ["Uptown", "Edgewater", "Rogers Park"], notes: "Habesha restaurants and cafes dot the North Side neighborhoods." },
    ],
  },
  {
    city: "Los Angeles", state: "CA", flag: "🎬", cityId: "losangeles",
    communities: [
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~60,000+", neighborhoods: ["Little Ethiopia (Fairfax)", "Koreatown", "Mid-City"], notes: "Little Ethiopia on Fairfax Ave is the official cultural district. LA has the second-largest Ethiopian community in the US after DC." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~15,000+", neighborhoods: ["Inglewood", "Carson", "Gardena"], notes: "Growing Nollywood-connected community in LA's entertainment industry." },
      { country: "Belize", countryFlag: "🇧🇿", population: "~50,000+", neighborhoods: ["South LA", "Inglewood", "Compton"], notes: "LA has the largest Belizean (Garifuna and Kriol) community in the US. Strong cultural ties to Black LA." },
    ],
  },
  {
    city: "San Francisco Bay Area", state: "CA", flag: "🌉", cityId: "sanfrancisco",
    communities: [
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~15,000+", neighborhoods: ["Oakland", "San Jose", "Tenderloin (SF)"], notes: "Habesha community spread across the Bay Area with restaurants and cultural events." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~10,000+", neighborhoods: ["Oakland", "Richmond"], notes: "Eritrean community with strong presence in Oakland's East African corridor." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~10,000+", neighborhoods: ["Oakland", "Fremont", "San Jose"], notes: "Nigerian tech professionals and community in the South Bay and East Bay." },
    ],
  },
  {
    city: "Philadelphia", state: "PA", flag: "🔔", cityId: "philadelphia",
    communities: [
      { country: "Liberia", countryFlag: "🇱🇷", population: "~10,000+", neighborhoods: ["Southwest Philadelphia", "Upper Darby"], notes: "Significant Liberian community with churches, restaurants, and cultural associations." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~10,000+", neighborhoods: ["Upper Darby", "Cheltenham", "Northeast Philly"], notes: "Nigerian community with active Igbo and Yoruba organizations." },
    ],
  },
  {
    city: "Seattle", state: "WA", flag: "☕", cityId: "seattle",
    communities: [
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~30,000+", neighborhoods: ["Central District", "Rainier Beach", "Columbia City"], notes: "One of the largest Ethiopian communities on the West Coast. The Central District has deep Habesha roots." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~15,000+", neighborhoods: ["Central District", "Rainier Valley"], notes: "Eritrean community alongside Ethiopian neighbors in south Seattle." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~20,000+", neighborhoods: ["Rainier Beach", "Tukwila", "SeaTac"], notes: "Growing Somali community in south King County with mosques and businesses." },
    ],
  },
  {
    city: "Sioux Falls & Fargo", state: "SD/ND", flag: "🌾", cityId: "siouxfalls",
    communities: [
      { country: "South Sudan", countryFlag: "🇸🇸", population: "~5,000+", neighborhoods: ["North Sioux Falls", "Downtown Fargo"], notes: "Nuer and Dinka communities working in meatpacking. One of the fastest-growing African communities in the region." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~3,000+", neighborhoods: ["Sioux Falls", "Fargo"], notes: "Somali community growing alongside South Sudanese diaspora in the Dakotas." },
    ],
  },
  {
    city: "Charlotte", state: "NC", flag: "👑", cityId: "raleigh",
    communities: [
      { country: "Liberia", countryFlag: "🇱🇷", population: "~8,000+", neighborhoods: ["West Charlotte", "Beatties Ford Rd", "Steele Creek"], notes: "One of the fastest-growing Liberian communities on the East Coast. Strong church networks and cultural organizations." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~10,000+", neighborhoods: ["University City", "Ballantyne", "Mint Hill"], notes: "Growing Nigerian professional community drawn by Charlotte's banking and finance sector." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~5,000+", neighborhoods: ["North Charlotte", "Concord"], notes: "Active Ghanaian community with cultural events and Akan-language churches." },
    ],
  },
  {
    city: "Kansas City", state: "MO/KS", flag: "🎺", cityId: "kansascity",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~10,000+", neighborhoods: ["Northeast KC", "Wyandotte County (KS)"], notes: "Significant Somali community with mosques, halal markets, and community centers. One of the largest in the Midwest." },
      { country: "Sudan", countryFlag: "🇸🇩", population: "~3,000+", neighborhoods: ["Northeast KC", "Independence"], notes: "Sudanese community with cultural organizations and shared spaces with the Somali diaspora." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~3,000+", neighborhoods: ["Midtown", "Westport area"], notes: "Small but vibrant Habesha community with restaurants and coffee shops." },
    ],
  },
  {
    city: "Providence", state: "RI", flag: "⚓", cityId: "providence",
    communities: [
      { country: "Cape Verde", countryFlag: "🇨🇻", population: "~20,000+", neighborhoods: ["Fox Point", "East Side", "Pawtucket"], notes: "One of the oldest Cape Verdean communities in the US, dating back to the 1800s whaling era. Kriolu is widely spoken." },
      { country: "Liberia", countryFlag: "🇱🇷", population: "~10,000+", neighborhoods: ["South Providence", "Olneyville", "Central Falls"], notes: "Large Liberian refugee community. Rhode Island has one of the highest per-capita Liberian populations in the country." },
      { country: "Guatemala (Garifuna)", countryFlag: "🇬🇹", population: "~5,000+", neighborhoods: ["South Providence", "Central Falls"], notes: "Garifuna community — Afro-Indigenous people from Central America with deep African roots in language and culture." },
    ],
  },
  {
    city: "Raleigh–Durham", state: "NC", flag: "🔬", cityId: "raleigh",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~15,000+", neighborhoods: ["Cary", "Durham", "Morrisville"], notes: "Research Triangle attracts Nigerian professionals. Strong Igbo community with cultural associations." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~5,000+", neighborhoods: ["Durham", "Chapel Hill"], notes: "Growing Habesha community near Duke and UNC with restaurants and cultural events." },
    ],
  },
  {
    city: "Nashville", state: "TN", flag: "🎸", cityId: "nashville",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~12,000+", neighborhoods: ["Antioch", "South Nashville", "Murfreesboro"], notes: "One of the fastest-growing Somali communities in the South. Antioch has become a Somali cultural hub." },
      { country: "Sudan", countryFlag: "🇸🇩", population: "~5,000+", neighborhoods: ["Antioch", "LaVergne"], notes: "Sudanese community growing alongside the Somali diaspora in South Nashville." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~5,000+", neighborhoods: ["Brentwood", "Franklin", "Antioch"], notes: "Nigerian professionals and families settling in Nashville's growing suburbs." },
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~3,000+", neighborhoods: ["Antioch", "Smyrna"], notes: "Congolese refugee community contributing to Nashville's growing African diaspora." },
    ],
  },
  {
    city: "Denver", state: "CO", flag: "🏔️", cityId: "denver",
    communities: [
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~25,000+", neighborhoods: ["East Colfax", "Aurora", "Park Hill"], notes: "Denver-Aurora has one of the largest Ethiopian communities in the US. East Colfax is lined with Habesha restaurants." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~10,000+", neighborhoods: ["Aurora", "East Denver"], notes: "Eritrean community shares spaces with Ethiopian neighbors along the Colfax corridor." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~8,000+", neighborhoods: ["Aurora", "East Denver"], notes: "Somali community in Aurora with mosques, halal markets, and cultural centers." },
    ],
  },
  {
    city: "Detroit", state: "MI", flag: "🚗", cityId: "detroit",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~8,000+", neighborhoods: ["Southfield", "Farmington Hills", "Canton"], notes: "Nigerian community in Detroit's western suburbs with strong professional networks." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~5,000+", neighborhoods: ["Dearborn Heights", "Westland"], notes: "Ghanaian community with churches and cultural festivals." },
    ],
  },
  {
    city: "Salt Lake City", state: "UT", flag: "⛰️", cityId: "saltlakecity",
    communities: [
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~5,000+", neighborhoods: ["South Salt Lake", "West Valley City"], notes: "Congolese refugee community resettled through humanitarian programs. Active cultural associations." },
      { country: "Burundi", countryFlag: "🇧🇮", population: "~3,000+", neighborhoods: ["South Salt Lake", "Murray"], notes: "Burundian refugee community alongside Congolese neighbors in South Salt Lake." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~3,000+", neighborhoods: ["West Valley City", "Taylorsville"], notes: "Growing Somali community with mosques and community organizations." },
    ],
  },
  {
    city: "Richmond", state: "VA", flag: "🏛️", cityId: "richmond",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~5,000+", neighborhoods: ["Henrico County", "Chesterfield"], notes: "Nigerian families in Richmond suburbs with cultural organizations and churches." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~3,000+", neighborhoods: ["Broad Street corridor", "Short Pump"], notes: "Small but growing Habesha community with restaurants and coffee shops." },
    ],
  },
  {
    city: "San Antonio", state: "TX", flag: "🌮", cityId: "sanantonio",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~8,000+", neighborhoods: ["Northeast SA", "Stone Oak"], notes: "Nigerian military families and professionals stationed at Joint Base San Antonio." },
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~3,000+", neighborhoods: ["West Side", "Medical Center area"], notes: "Congolese refugee community resettled through local nonprofits." },
    ],
  },
  {
    city: "Orlando", state: "FL", flag: "🎢", cityId: "orlando",
    communities: [
      { country: "Haiti", countryFlag: "🇭🇹", population: "~60,000+", neighborhoods: ["Pine Hills", "Orlando West", "Kissimmee"], notes: "Large Haitian community in Central Florida. Pine Hills is a major hub with Kreyòl churches and businesses." },
      { country: "Jamaica", countryFlag: "🇯🇲", population: "~30,000+", neighborhoods: ["Pine Hills", "Altamonte Springs"], notes: "Strong Jamaican presence in Central Florida with cultural events and community groups." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~8,000+", neighborhoods: ["Lake Nona", "Hunters Creek"], notes: "Growing Nigerian professional community in Orlando's newer suburbs." },
    ],
  },
  {
    city: "Milwaukee", state: "WI", flag: "🍺", cityId: "milwaukee",
    communities: [
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~5,000+", neighborhoods: ["North Side", "Silver Spring"], notes: "Congolese refugee community with cultural centers and churches." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~3,000+", neighborhoods: ["North Side"], notes: "Somali community with halal markets and community organizations." },
    ],
  },
  {
    city: "Des Moines", state: "IA", flag: "🌽", cityId: "desmoines",
    communities: [
      { country: "South Sudan", countryFlag: "🇸🇸", population: "~8,000+", neighborhoods: ["South Side", "East Side"], notes: "Significant South Sudanese (Nuer) community in central Iowa. Strong community organizations and churches." },
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~4,000+", neighborhoods: ["South Side", "Des Moines metro"], notes: "Growing Congolese community resettled through refugee programs." },
    ],
  },
  {
    city: "Phoenix–Scottsdale", state: "AZ", flag: "🌵", cityId: "phoenix",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~10,000+", neighborhoods: ["North Phoenix", "Tempe", "Mesa"], notes: "Growing Somali community in the Valley with mosques and businesses." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~8,000+", neighborhoods: ["Tempe", "Central Phoenix"], notes: "Habesha community with restaurants and cultural events near ASU." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~5,000+", neighborhoods: ["Chandler", "Gilbert"], notes: "Nigerian professionals in Phoenix's East Valley suburbs." },
    ],
  },

  // ── EUROPE ──
  {
    city: "London", state: "UK", flag: "🇬🇧", cityId: "london",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~200,000+", neighborhoods: ["Peckham", "Lewisham", "Woolwich", "Tottenham"], notes: "Peckham is London's Nigerian heartland. Yoruba, Igbo, and Edo communities run deep. Jollof rice debates are loud." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~120,000+", neighborhoods: ["Tottenham", "Brixton", "Lewisham"], notes: "One of the largest Ghanaian communities in Europe. Tottenham's African markets are legendary." },
      { country: "Jamaica", countryFlag: "🇯🇲", population: "~180,000+", neighborhoods: ["Brixton", "Hackney", "Tottenham", "Harlesden"], notes: "Brixton is the spiritual home of Jamaican London. Windrush generation built the foundation. Notting Hill Carnival celebrates this legacy." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~100,000+", neighborhoods: ["Tower Hamlets", "Ealing", "Camden"], notes: "Largest Somali community in Europe. Somali-owned businesses thrive across East and West London." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~30,000+", neighborhoods: ["Lambeth", "Southwark", "Islington"], notes: "Eritrean community with cultural centres and restaurants across South London." },
      { country: "Trinidad & Tobago", countryFlag: "🇹🇹", population: "~50,000+", neighborhoods: ["Notting Hill", "Ladbroke Grove", "Harlesden"], notes: "Trini culture birthed Notting Hill Carnival — the second-largest street festival in the world." },
      { country: "Sierra Leone", countryFlag: "🇸🇱", population: "~30,000+", neighborhoods: ["Southwark", "Bermondsey", "Woolwich"], notes: "Strong Sierra Leonean community with Krio-language churches and cultural associations." },
      { country: "Barbados", countryFlag: "🇧🇧", population: "~25,000+", neighborhoods: ["Brixton", "Lewisham"], notes: "Bajan community part of the Windrush generation that shaped modern multicultural Britain." },
    ],
  },
  {
    city: "Paris", state: "France", flag: "🇫🇷", cityId: "paris",
    communities: [
      { country: "Mali", countryFlag: "🇲🇱", population: "~80,000+", neighborhoods: ["Montreuil", "Saint-Denis", "Belleville"], notes: "Montreuil is called 'Little Bamako.' The largest Malian community outside Africa. Bambara is spoken everywhere." },
      { country: "Senegal", countryFlag: "🇸🇳", population: "~60,000+", neighborhoods: ["Château Rouge", "Saint-Denis", "Barbès"], notes: "Château Rouge is Paris's Little Africa. Wolof echoes through the markets. Thiéboudienne is a staple." },
      { country: "Côte d'Ivoire", countryFlag: "🇨🇮", population: "~50,000+", neighborhoods: ["Château Rouge", "Saint-Denis", "Aulnay-sous-Bois"], notes: "Massive Ivorian community. Coupé-Décalé music and alloco are everywhere in the banlieues." },
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~60,000+", neighborhoods: ["Château Rouge", "Matonge (nearby Brussels)", "Saint-Denis"], notes: "Congolese community with deep musical influence — rumba, ndombolo, and now Afro-trap born in the banlieues." },
      { country: "Cameroon", countryFlag: "🇨🇲", population: "~40,000+", neighborhoods: ["Val-de-Marne", "Seine-Saint-Denis"], notes: "Large Cameroonian community with strong cultural associations and annual festivals." },
      { country: "Guinea", countryFlag: "🇬🇳", population: "~35,000+", neighborhoods: ["Montreuil", "Saint-Denis", "Aubervilliers"], notes: "Guinean community with Mandinka and Fulani cultural organizations." },
      { country: "Haiti", countryFlag: "🇭🇹", population: "~30,000+", neighborhoods: ["Seine-Saint-Denis", "Val-de-Marne"], notes: "Haitian community connecting the francophone Caribbean to francophone Africa in Paris." },
      { country: "Martinique & Guadeloupe", countryFlag: "🇲🇶", population: "~200,000+", neighborhoods: ["Throughout Paris", "Seine-Saint-Denis"], notes: "Antillean community is massive — Zouk, Carnival, and Creole culture are integral to Parisian Black identity." },
    ],
  },
  {
    city: "Brussels", state: "Belgium", flag: "🇧🇪", cityId: "brussels",
    communities: [
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~100,000+", neighborhoods: ["Matonge (Ixelles)", "Saint-Gilles", "Molenbeek"], notes: "Matonge is the heart of Congolese Europe. Named after a neighborhood in Kinshasa. Lingala, rumba, and Congolese fashion define the area." },
      { country: "Rwanda", countryFlag: "🇷🇼", population: "~20,000+", neighborhoods: ["Saint-Gilles", "Forest", "Uccle"], notes: "Rwandan community with cultural centres and strong diaspora organizations." },
      { country: "Burundi", countryFlag: "🇧🇮", population: "~10,000+", neighborhoods: ["Saint-Josse", "Schaerbeek"], notes: "Burundian community alongside Congolese and Rwandan neighbors in the Great Lakes diaspora." },
      { country: "Cameroon", countryFlag: "🇨🇲", population: "~15,000+", neighborhoods: ["Schaerbeek", "Molenbeek"], notes: "Cameroonian community with cultural festivals and community associations." },
    ],
  },
  {
    city: "Amsterdam", state: "Netherlands", flag: "🇳🇱", cityId: "amsterdam",
    communities: [
      { country: "Suriname", countryFlag: "🇸🇷", population: "~180,000+", neighborhoods: ["Bijlmer (Zuidoost)", "Noord", "Nieuw-West"], notes: "Bijlmer is the Surinamese capital of Europe. The largest Afro-Surinamese community outside Suriname. Kwaku Festival is the biggest Black festival in Europe." },
      { country: "Curaçao", countryFlag: "🇨🇼", population: "~50,000+", neighborhoods: ["Bijlmer", "Nieuw-West"], notes: "Antillean community from Curaçao, Aruba, and Bonaire. Papiamento is spoken. Tumba and carnival culture thrive." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~25,000+", neighborhoods: ["Bijlmer", "Almere"], notes: "Growing Ghanaian community in Zuidoost with churches, restaurants, and cultural events." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~40,000+", neighborhoods: ["West Amsterdam", "Nieuw-West", "Tilburg"], notes: "One of the largest Somali communities in Western Europe with mosques and community centres." },
    ],
  },
  {
    city: "Rotterdam", state: "Netherlands", flag: "🇳🇱", cityId: "rotterdam",
    communities: [
      { country: "Cape Verde", countryFlag: "🇨🇻", population: "~30,000+", neighborhoods: ["Delfshaven", "Feijenoord"], notes: "Largest Cape Verdean community in the Netherlands. Kriolu culture and music festivals are major events." },
      { country: "Suriname", countryFlag: "🇸🇷", population: "~50,000+", neighborhoods: ["Feijenoord", "Charlois", "Delfshaven"], notes: "Large Surinamese community with deep roots in Rotterdam's south." },
      { country: "Curaçao", countryFlag: "🇨🇼", population: "~20,000+", neighborhoods: ["Zuid", "Charlois"], notes: "Antillean community bringing carnival and Papiamento language to Rotterdam." },
    ],
  },
  {
    city: "Antwerp", state: "Belgium", flag: "🇧🇪", cityId: "antwerp",
    communities: [
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~15,000+", neighborhoods: ["Borgerhout", "Deurne"], notes: "Congolese community with cultural centres and Lingala-speaking churches." },
      { country: "Ghana", countryFlag: "🇬🇭", population: "~10,000+", neighborhoods: ["Borgerhout", "Merksem"], notes: "Ghanaian community with Pentecostal churches and cultural associations." },
    ],
  },
  {
    city: "Barcelona", state: "Spain", flag: "🇪🇸", cityId: "barcelona",
    communities: [
      { country: "Senegal", countryFlag: "🇸🇳", population: "~15,000+", neighborhoods: ["Raval", "Ciutat Vella", "Badalona"], notes: "Senegalese community with strong Mouride brotherhood networks. Wolof is spoken in Raval markets." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~10,000+", neighborhoods: ["Raval", "Sant Martí"], notes: "Nigerian community with cultural associations and churches." },
      { country: "Equatorial Guinea", countryFlag: "🇬🇶", population: "~8,000+", neighborhoods: ["Throughout Barcelona", "L'Hospitalet"], notes: "Spain's only former sub-Saharan colony. Equatoguinean community speaks Spanish natively and has deep cultural integration." },
      { country: "Dominican Republic", countryFlag: "🇩🇴", population: "~30,000+", neighborhoods: ["Ciutat Vella", "Nou Barris"], notes: "Afro-Dominican community bringing bachata, merengue, and Caribbean flavor to Barcelona." },
    ],
  },
  {
    city: "Madrid", state: "Spain", flag: "🇪🇸", cityId: "madrid",
    communities: [
      { country: "Equatorial Guinea", countryFlag: "🇬🇶", population: "~15,000+", neighborhoods: ["Lavapiés", "Usera", "Carabanchel"], notes: "Largest Equatoguinean community in Europe. Lavapiés is Madrid's African quarter." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~12,000+", neighborhoods: ["Lavapiés", "Usera"], notes: "Nigerian community with churches, markets, and cultural events in central Madrid." },
      { country: "Senegal", countryFlag: "🇸🇳", population: "~10,000+", neighborhoods: ["Lavapiés", "Vallecas"], notes: "Senegalese community with Mouride networks and cultural associations." },
      { country: "Dominican Republic", countryFlag: "🇩🇴", population: "~50,000+", neighborhoods: ["Usera", "Tetuán", "Ciudad Lineal"], notes: "Large Afro-Dominican community. Bachata and merengue nights are a Madrid staple." },
      { country: "Colombia", countryFlag: "🇨🇴", population: "~40,000+", neighborhoods: ["Usera", "Villaverde"], notes: "Afro-Colombian community from Chocó, Cali, and the Pacific coast bringing cumbia and champeta." },
    ],
  },
  {
    city: "Berlin", state: "Germany", flag: "🇩🇪", cityId: "berlin",
    communities: [
      { country: "Ghana", countryFlag: "🇬🇭", population: "~20,000+", neighborhoods: ["Wedding", "Neukölln", "Kreuzberg"], notes: "One of the largest African communities in Germany. Wedding has Ghanaian restaurants and cultural spaces." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~15,000+", neighborhoods: ["Neukölln", "Tempelhof"], notes: "Nigerian community with professional networks and cultural events." },
      { country: "Cameroon", countryFlag: "🇨🇲", population: "~12,000+", neighborhoods: ["Wedding", "Mitte"], notes: "Cameroonian community with the annual Kamerun Festival and cultural associations." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~30,000+", neighborhoods: ["Neukölln", "Kreuzberg", "Mitte"], notes: "One of the largest Eritrean communities in Europe. Strong Tigrinya-speaking networks." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~20,000+", neighborhoods: ["Neukölln", "Spandau"], notes: "Somali community with mosques, cultural centres, and community organizations." },
    ],
  },
  {
    city: "Rome", state: "Italy", flag: "🇮🇹", cityId: "rome",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~30,000+", neighborhoods: ["Esquilino", "Tor Bella Monaca", "Castel Volturno"], notes: "Largest African community in Italy. Esquilino is Rome's multicultural heart. Strong Edo and Igbo presence." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~15,000+", neighborhoods: ["Esquilino", "Pigneto"], notes: "Deep historical ties from Italian colonization. Eritrean restaurants are beloved across Rome." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~10,000+", neighborhoods: ["Esquilino", "Piazza Vittorio area"], notes: "Ethiopian community alongside Eritrean neighbors, sharing cultural spaces and cuisine." },
      { country: "Senegal", countryFlag: "🇸🇳", population: "~20,000+", neighborhoods: ["Esquilino", "San Lorenzo"], notes: "Senegalese community with strong Mouride brotherhood networks across Italy." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~10,000+", neighborhoods: ["Esquilino", "Centocelle"], notes: "Somali community with historical ties from Italian Somaliland era." },
    ],
  },
  {
    city: "Stockholm", state: "Sweden", flag: "🇸🇪", cityId: "stockholm",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~70,000+", neighborhoods: ["Rinkeby", "Tensta", "Husby", "Kista"], notes: "Sweden has the largest Somali community in Scandinavia. Rinkeby is sometimes called 'Little Mogadishu of Europe.'" },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~30,000+", neighborhoods: ["Sundbyberg", "Kista", "Södertälje"], notes: "Large Eritrean community with cultural centres, Tigrinya media, and restaurants." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~20,000+", neighborhoods: ["Rinkeby", "Tensta", "Spånga"], notes: "Ethiopian Oromo and Amhara communities alongside Somali and Eritrean neighbors." },
      { country: "Gambia", countryFlag: "🇬🇲", population: "~5,000+", neighborhoods: ["Rinkeby", "Botkyrka"], notes: "Gambian community with Mandinka cultural associations." },
    ],
  },
  {
    city: "Oslo", state: "Norway", flag: "🇳🇴", cityId: "oslo",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~40,000+", neighborhoods: ["Grønland", "Tøyen", "Stovner"], notes: "Largest non-European immigrant group in Norway. Grønland is the cultural center." },
      { country: "Eritrea", countryFlag: "🇪🇷", population: "~15,000+", neighborhoods: ["Grønland", "Gamle Oslo"], notes: "Eritrean community with churches and cultural organizations." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~8,000+", neighborhoods: ["Grønland", "Tøyen"], notes: "Ethiopian community sharing spaces with Eritrean neighbors." },
    ],
  },
  {
    city: "Copenhagen", state: "Denmark", flag: "🇩🇰", cityId: "copenhagen",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~20,000+", neighborhoods: ["Nørrebro", "Ishøj", "Brøndby"], notes: "Largest African community in Denmark. Nørrebro has Somali restaurants and businesses." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~5,000+", neighborhoods: ["Nørrebro", "Vesterbro"], notes: "Growing Habesha community with restaurants and cultural events." },
    ],
  },
  {
    city: "Helsinki", state: "Finland", flag: "🇫🇮", cityId: "helsinki",
    communities: [
      { country: "Somalia", countryFlag: "🇸🇴", population: "~22,000+", neighborhoods: ["Itäkeskus", "Kontula", "Vuosaari"], notes: "Largest African-origin community in Finland. East Helsinki is the cultural center." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~3,000+", neighborhoods: ["Itäkeskus", "Central Helsinki"], notes: "Growing Nigerian community with cultural associations." },
    ],
  },
  {
    city: "Dublin", state: "Ireland", flag: "🇮🇪", cityId: "dublin",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~40,000+", neighborhoods: ["Blanchardstown", "Tallaght", "Balbriggan"], notes: "Largest African community in Ireland. Nigerian-Irish identity is a growing cultural force. Balbriggan has been called 'Little Lagos.'" },
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~5,000+", neighborhoods: ["Clondalkin", "Tallaght"], notes: "Congolese community with cultural associations and churches." },
      { country: "South Africa", countryFlag: "🇿🇦", population: "~5,000+", neighborhoods: ["Throughout Dublin"], notes: "South African community growing since the 2000s with braai culture and cultural events." },
      { country: "Zimbabwe", countryFlag: "🇿🇼", population: "~4,000+", neighborhoods: ["Blanchardstown", "Lucan"], notes: "Zimbabwean community with churches and cultural gatherings." },
    ],
  },
  {
    city: "Istanbul", state: "Turkey", flag: "🇹🇷", cityId: "istanbul",
    communities: [
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~10,000+", neighborhoods: ["Fatih", "Kumkapı", "Laleli"], notes: "Nigerian traders and students form the largest African community. Kumkapı is the African hub." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~8,000+", neighborhoods: ["Fatih", "Zeytinburnu"], notes: "Somali community drawn by Turkey's open-door policy and cultural affinity." },
      { country: "Sudan", countryFlag: "🇸🇩", population: "~5,000+", neighborhoods: ["Fatih", "Aksaray"], notes: "Sudanese community of students and refugees with cultural organizations." },
      { country: "Senegal", countryFlag: "🇸🇳", population: "~5,000+", neighborhoods: ["Fatih", "Taksim area"], notes: "Senegalese traders and Mouride community in Istanbul's historic districts." },
    ],
  },
  {
    city: "Toronto", state: "Canada", flag: "🇨🇦", cityId: "toronto",
    communities: [
      { country: "Jamaica", countryFlag: "🇯🇲", population: "~250,000+", neighborhoods: ["Scarborough", "Jane & Finch", "Etobicoke", "Brampton"], notes: "Toronto has the largest Jamaican community outside of Jamaica and NYC. Patois and dancehall culture are everywhere." },
      { country: "Trinidad & Tobago", countryFlag: "🇹🇹", population: "~60,000+", neighborhoods: ["Scarborough", "Markham", "Brampton"], notes: "Trini community runs Toronto's massive Caribana parade — one of North America's largest festivals." },
      { country: "Nigeria", countryFlag: "🇳🇬", population: "~40,000+", neighborhoods: ["Brampton", "Mississauga", "North York"], notes: "Rapidly growing Nigerian community. Brampton has become a major hub." },
      { country: "Somalia", countryFlag: "🇸🇴", population: "~60,000+", neighborhoods: ["Etobicoke", "Scarborough", "North York"], notes: "One of the largest Somali communities in North America. Dixon Road area is a cultural hub." },
      { country: "Ethiopia", countryFlag: "🇪🇹", population: "~30,000+", neighborhoods: ["North York", "Scarborough"], notes: "Growing Habesha community with restaurants and cultural events across the GTA." },
      { country: "Guyana", countryFlag: "🇬🇾", population: "~80,000+", neighborhoods: ["Scarborough", "Richmond Hill", "Brampton"], notes: "Huge Indo- and Afro-Guyanese community. Guyanese roti shops and cultural events thrive." },
      { country: "Haiti", countryFlag: "🇭🇹", population: "~30,000+", neighborhoods: ["Scarborough", "North York"], notes: "Haitian community connecting francophone Caribbean culture to Toronto's diversity." },
      { country: "Barbados", countryFlag: "🇧🇧", population: "~20,000+", neighborhoods: ["Scarborough", "North York"], notes: "Bajan community part of the broader Caribbean-Canadian identity." },
    ],
  },
  {
    city: "Montreal", state: "Canada", flag: "🇨🇦", cityId: "montreal",
    communities: [
      { country: "Haiti", countryFlag: "🇭🇹", population: "~130,000+", neighborhoods: ["Saint-Michel", "Montréal-Nord", "Rivière-des-Prairies"], notes: "Largest Haitian community outside of Haiti and the US. French-speaking Haiti connects naturally to francophone Quebec. Saint-Michel is Little Haiti." },
      { country: "DR Congo", countryFlag: "🇨🇩", population: "~20,000+", neighborhoods: ["Côte-des-Neiges", "Parc-Extension"], notes: "Congolese community connecting francophone Africa to francophone Canada." },
      { country: "Cameroon", countryFlag: "🇨🇲", population: "~15,000+", neighborhoods: ["Côte-des-Neiges", "Villeray"], notes: "Cameroonian community thriving in Montreal's francophone environment." },
      { country: "Senegal", countryFlag: "🇸🇳", population: "~10,000+", neighborhoods: ["Côte-des-Neiges", "Saint-Laurent"], notes: "Senegalese community linking West African francophone culture to Quebec." },
      { country: "Jamaica", countryFlag: "🇯🇲", population: "~15,000+", neighborhoods: ["NDG", "Côte-des-Neiges"], notes: "Jamaican community contributing to Montreal's English-speaking Caribbean community." },
    ],
  },
];

