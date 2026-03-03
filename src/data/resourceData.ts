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

  // Dallas – Nigerian
  { id: 53, name: "Ndi Igbo Kwenu Dallas (NIKD)", type: "nonprofit", category: "Nigerian Community", description: "Igbo cultural organization celebrating heritage, unity, and youth empowerment in DFW.", city: "dallas", website: "https://www.nikdallas.com" },
  { id: 54, name: "Edo Association of Dallas/Fort Worth", type: "nonprofit", category: "Nigerian Community", description: "Edo cultural nonprofit fostering unity and community support across the DFW metroplex.", city: "dallas", website: "https://edoassociationdfw.com" },
  { id: 55, name: "AKISAN Dallas Metro Chapter", type: "nonprofit", category: "Nigerian Community", description: "Akwa Ibom State Association of Nigeria – community building, cultural events, and mutual aid in Dallas.", city: "dallas", website: "https://www.akisandallas.org" },
  { id: 56, name: "Ndokwa Association in America – DFW", type: "nonprofit", category: "Nigerian Community", description: "Civic organization for Ndokwa (Delta State) Nigerians fostering unity and charitable initiatives.", city: "dallas", website: "https://ndokwadfw.org" },

  // Dallas – Sudanese & South Sudanese
  { id: 57, name: "DFW Sudanese Community Organization", type: "nonprofit", category: "Sudanese Community", description: "Employment support, women & youth empowerment, job training, and leadership development for Sudanese families in DFW.", city: "dallas", website: "https://www.dfwsco.org" },
  { id: 58, name: "Sudanese American Association of North Texas", type: "nonprofit", category: "Sudanese Community", description: "Community building, cultural preservation, and mutual aid for Sudanese Americans in the DFW area.", city: "dallas", website: "https://www.saantx.org" },

  // Dallas – Habesha (Ethiopian & Eritrean)
  { id: 59, name: "Ethiopian Community DFW (MAAEC)", type: "nonprofit", category: "Habesha Community", description: "Providing seamless services, cultural events, and community support for Ethiopians in Dallas-Fort Worth.", city: "dallas", website: "https://ethiopiancommunitydfw.org" },

  // Houston – Nigerian
  { id: 60, name: "Nigerian American Multicultural Council (NAMC)", type: "nonprofit", category: "Nigerian Community", description: "Strengthening Nigerian-American communities through education, mentorship, entrepreneurship, and cultural exchange.", city: "houston", website: "https://www.namchouston.org" },
  { id: 61, name: "Eko Akete Houston", type: "nonprofit", category: "Nigerian Community", description: "Lagos-heritage nonprofit empowering children and families through community support and cultural programs.", city: "houston", website: "https://www.ekoaketehouston.com" },
  { id: 62, name: "The Nigerian Foundation", type: "nonprofit", category: "Nigerian Community", description: "Houston-based nonprofit supporting Nigerian community development and cultural preservation.", city: "houston", website: "https://thenigerian.foundation" },

  // Houston – Habesha (Ethiopian & Eritrean)
  { id: 63, name: "Ethiopian Community Organization in Houston (ECOH)", type: "nonprofit", category: "Habesha Community", description: "Educate, engage, empower, and enrich – serving Houston's Ethiopian community with programs and events.", city: "houston", website: "https://ecohouston.org" },
  { id: 64, name: "Eritrean American Community of Houston", type: "nonprofit", category: "Habesha Community", description: "Bridging Eritrean heritage with modern opportunities through unity, education, and community uplift.", city: "houston", website: "https://www.eritreanamericancommunityofhouston.org" },

  // ===== EXPANDED AFRICAN & HAITIAN DIASPORA NONPROFITS =====

  // --- NYC ---
  { id: 65, name: "Nigerian Americans in New York", type: "nonprofit", category: "Nigerian Community", description: "Cultural events, networking, and advocacy for Nigerians across the five boroughs.", city: "nyc" },
  { id: 66, name: "Ghanaian Association of New York", type: "nonprofit", category: "Ghanaian Community", description: "Promoting Ghanaian culture, education, and mutual aid in the NYC metro area.", city: "nyc" },
  { id: 67, name: "Ethiopian Community Development Council", type: "nonprofit", category: "Ethiopian Community", description: "Resettlement services, job training, and cultural integration for Ethiopian immigrants.", city: "nyc" },
  { id: 68, name: "Somali Bantu Community Association of NY", type: "nonprofit", category: "Somali Community", description: "Resettlement support, ESL classes, and community programs for Somali Bantu families.", city: "nyc" },
  { id: 69, name: "Sudanese American Public Affairs Association", type: "nonprofit", category: "Sudanese Community", description: "Advocacy and civic engagement for Sudanese Americans in the greater NYC region.", city: "nyc" },
  { id: 70, name: "Congolese Community of New York", type: "nonprofit", category: "Congolese Community", description: "Cultural preservation, mutual aid, and community building for Congolese immigrants.", city: "nyc" },
  { id: 71, name: "Kenyan Community Abroad (NYC Chapter)", type: "nonprofit", category: "Kenyan Community", description: "Professional networking, cultural events, and community support for Kenyans in NYC.", city: "nyc" },
  { id: 72, name: "Haitian Americans United for Progress", type: "nonprofit", category: "Haitian Community", description: "Social services, legal aid, and cultural programming for the Haitian diaspora in NYC.", city: "nyc" },
  { id: 73, name: "Eritrean Community Center of New York", type: "nonprofit", category: "Eritrean Community", description: "Cultural events, youth programs, and community services for Eritreans in the tri-state area.", city: "nyc" },

  // --- Atlanta ---
  { id: 74, name: "Ethiopian American Council of Atlanta", type: "nonprofit", category: "Ethiopian Community", description: "Community building, cultural celebration, and civic engagement for Ethiopians in metro Atlanta.", city: "atlanta" },
  { id: 75, name: "Nigerian Women Association Atlanta", type: "nonprofit", category: "Nigerian Community", description: "Empowering Nigerian women through mentorship, scholarships, and cultural events.", city: "atlanta" },
  { id: 76, name: "Somali American Community Center of Georgia", type: "nonprofit", category: "Somali Community", description: "Education, job placement, and family support for Somali refugees and immigrants in Atlanta.", city: "atlanta" },
  { id: 77, name: "Kenyan Community in Atlanta", type: "nonprofit", category: "Kenyan Community", description: "Professional networking, community events, and support for Kenyan families in Georgia.", city: "atlanta" },
  { id: 78, name: "Ghana Association of Georgia", type: "nonprofit", category: "Ghanaian Community", description: "Cultural preservation, community support, and educational programs for Ghanaians in Atlanta.", city: "atlanta" },
  { id: 79, name: "Eritrean Community of Atlanta", type: "nonprofit", category: "Eritrean Community", description: "Youth development, cultural events, and mutual aid for the Eritrean community in metro Atlanta.", city: "atlanta" },
  { id: 80, name: "Congolese Community of Georgia", type: "nonprofit", category: "Congolese Community", description: "Refugee resettlement support, cultural events, and community integration programs.", city: "atlanta" },

  // --- Chicago ---
  { id: 81, name: "Nigerian Community Association of Chicago", type: "nonprofit", category: "Nigerian Community", description: "Cultural events, professional development, and civic engagement for Nigerians in Chicagoland.", city: "chicago" },
  { id: 82, name: "Ethiopian Community Association of Chicago (ECAC)", type: "nonprofit", category: "Ethiopian Community", description: "Resettlement, social services, and cultural programming for Ethiopian refugees and immigrants.", city: "chicago", website: "https://www.ecachicago.org" },
  { id: 83, name: "Somali American Community Center Chicago", type: "nonprofit", category: "Somali Community", description: "Youth programs, job training, and family support for Chicago's Somali community.", city: "chicago" },
  { id: 84, name: "South Sudanese Community Association of Illinois", type: "nonprofit", category: "South Sudanese Community", description: "Community building, education advocacy, and cultural preservation for South Sudanese families.", city: "chicago" },
  { id: 85, name: "Ghanaian Association of Chicago", type: "nonprofit", category: "Ghanaian Community", description: "Cultural celebrations, community outreach, and educational support for Ghanaians in Illinois.", city: "chicago" },
  { id: 86, name: "Congolese Community of Chicago", type: "nonprofit", category: "Congolese Community", description: "Integration support, cultural preservation, and advocacy for Congolese refugees.", city: "chicago" },
  { id: 87, name: "Kenyan American Diaspora Organization – Chicago", type: "nonprofit", category: "Kenyan Community", description: "Professional networking, investment education, and cultural events for Kenyans in Chicago.", city: "chicago" },

  // --- DC ---
  { id: 88, name: "Ethiopian Community Center DC", type: "nonprofit", category: "Ethiopian Community", description: "One of the largest Ethiopian communities in the US – cultural hub, social services, and advocacy.", city: "dc", website: "https://www.ethiopiancommunitydc.org" },
  { id: 89, name: "Eritrean Community Center of Washington DC", type: "nonprofit", category: "Eritrean Community", description: "Cultural events, youth development, and community support for the Eritrean diaspora in DC.", city: "dc" },
  { id: 90, name: "Nigerian American Foundation DC", type: "nonprofit", category: "Nigerian Community", description: "Policy advocacy, professional development, and community engagement for Nigerians in the DMV.", city: "dc" },
  { id: 91, name: "Somali Community Center of DC", type: "nonprofit", category: "Somali Community", description: "Civic engagement, education, and family services for Somali immigrants in the DC metro.", city: "dc" },
  { id: 92, name: "Sudanese American Association of DC", type: "nonprofit", category: "Sudanese Community", description: "Cultural events, mutual aid, and advocacy for the Sudanese community in Washington DC.", city: "dc" },
  { id: 93, name: "Ghana National Council of DC Metro", type: "nonprofit", category: "Ghanaian Community", description: "Umbrella organization for Ghanaian community groups providing education and cultural programs.", city: "dc" },
  { id: 94, name: "Congolese Community of Washington DC", type: "nonprofit", category: "Congolese Community", description: "Refugee support, cultural integration, and advocacy for Congolese in the DMV.", city: "dc" },
  { id: 95, name: "Kenyan Diaspora Alliance – DC Chapter", type: "nonprofit", category: "Kenyan Community", description: "Professional networking, investment forums, and community events for Kenyans in Washington DC.", city: "dc" },

  // --- Minneapolis ---
  { id: 96, name: "Somali American Relations Council (SARC)", type: "nonprofit", category: "Somali Community", description: "Civic engagement, education, and youth leadership for the largest Somali community in the US.", city: "minneapolis" },
  { id: 97, name: "South Sudanese Community Association of Minnesota", type: "nonprofit", category: "South Sudanese Community", description: "Resettlement support, cultural programs, and education advocacy for South Sudanese refugees.", city: "minneapolis" },
  { id: 98, name: "Ethiopian American Council of Minnesota", type: "nonprofit", category: "Ethiopian Community", description: "Cultural events, social services, and community integration for Ethiopians in the Twin Cities.", city: "minneapolis" },
  { id: 99, name: "Eritrean Community of Minnesota", type: "nonprofit", category: "Eritrean Community", description: "Youth mentorship, cultural celebrations, and mutual aid for Eritreans in Minneapolis-St. Paul.", city: "minneapolis" },
  { id: 100, name: "Nigerian Community of Minnesota", type: "nonprofit", category: "Nigerian Community", description: "Cultural festivals, professional networking, and educational programs for Nigerians in Minnesota.", city: "minneapolis" },
  { id: 101, name: "Kenyan Association of Minnesota", type: "nonprofit", category: "Kenyan Community", description: "Community support, cultural preservation, and networking for Kenyans in the Twin Cities.", city: "minneapolis" },

  // --- Miami ---
  { id: 102, name: "Haitian American Foundation of Miami", type: "nonprofit", category: "Haitian Community", description: "Social services, legal assistance, and cultural programming for Miami's large Haitian community.", city: "miami" },
  { id: 103, name: "Sant La Haitian Neighborhood Center", type: "nonprofit", category: "Haitian Community", description: "Community development, immigration services, and youth programs in Little Haiti and beyond.", city: "miami", website: "https://www.santla.org" },
  { id: 104, name: "Nigerian American Chamber of Commerce – South Florida", type: "nonprofit", category: "Nigerian Community", description: "Business development, networking, and trade facilitation for Nigerian professionals in South Florida.", city: "miami" },

  // --- Boston ---
  { id: 105, name: "Haitian Multi-Service Center Boston", type: "nonprofit", category: "Haitian Community", description: "Legal aid, ESL, job training, and family support for Boston's vibrant Haitian community.", city: "boston" },
  { id: 106, name: "Ethiopian Community Mutual Assistance Association", type: "nonprofit", category: "Ethiopian Community", description: "Resettlement services, cultural programs, and social support for Ethiopians in Greater Boston.", city: "boston" },
  { id: 107, name: "Somali Development Center – Boston", type: "nonprofit", category: "Somali Community", description: "Youth programs, workforce development, and community integration for Somali immigrants.", city: "boston", website: "https://www.somalicdc.org" },
  { id: 108, name: "Nigerian Community of New England", type: "nonprofit", category: "Nigerian Community", description: "Cultural celebrations, scholarships, and professional networking for Nigerians in the Boston area.", city: "boston" },

  // --- Los Angeles ---
  { id: 109, name: "Ethiopian Community of Los Angeles", type: "nonprofit", category: "Ethiopian Community", description: "Cultural events, community support, and social services for LA's Ethiopian community in Little Ethiopia.", city: "losangeles" },
  { id: 110, name: "Eritrean American Community of Southern California", type: "nonprofit", category: "Eritrean Community", description: "Cultural preservation, youth programs, and community support for Eritreans in the LA metro.", city: "losangeles" },
  { id: 111, name: "Nigerian American Society of Southern California", type: "nonprofit", category: "Nigerian Community", description: "Professional networking, cultural festivals, and community development for Nigerians in LA.", city: "losangeles" },
  { id: 112, name: "Ghanaian Association of Southern California", type: "nonprofit", category: "Ghanaian Community", description: "Cultural celebrations, community outreach, and education support for Ghanaians in LA.", city: "losangeles" },
  { id: 113, name: "Kenyan Community in Los Angeles", type: "nonprofit", category: "Kenyan Community", description: "Social events, professional networking, and mutual aid for Kenyans in Southern California.", city: "losangeles" },
  { id: 114, name: "Congolese Community of Southern California", type: "nonprofit", category: "Congolese Community", description: "Refugee integration, cultural programs, and community advocacy for Congolese in LA.", city: "losangeles" },

  // --- San Francisco ---
  { id: 115, name: "Ethiopian Community Services SF", type: "nonprofit", category: "Ethiopian Community", description: "Social services, cultural programming, and community support for Ethiopians in the Bay Area.", city: "sanfrancisco" },
  { id: 116, name: "Eritrean Community of the Bay Area", type: "nonprofit", category: "Eritrean Community", description: "Cultural events, youth mentorship, and mutual aid for Eritreans in San Francisco.", city: "sanfrancisco" },
  { id: 117, name: "Nigerian Professional Network – Bay Area", type: "nonprofit", category: "Nigerian Community", description: "Professional development, mentorship, and networking for Nigerian professionals in tech.", city: "sanfrancisco" },

  // --- Seattle ---
  { id: 118, name: "Ethiopian Community in Seattle", type: "nonprofit", category: "Ethiopian Community", description: "Cultural celebrations, community integration, and social services for Ethiopians in Seattle.", city: "seattle" },
  { id: 119, name: "Eritrean Association of Greater Seattle", type: "nonprofit", category: "Eritrean Community", description: "Youth programs, cultural preservation, and community support for Eritreans in Washington state.", city: "seattle" },
  { id: 120, name: "Somali Community Services of Seattle", type: "nonprofit", category: "Somali Community", description: "Resettlement, education, and family services for one of Seattle's largest refugee communities.", city: "seattle" },
  { id: 121, name: "Congolese Integration Network – Seattle", type: "nonprofit", category: "Congolese Community", description: "Integration support, cultural events, and advocacy for Congolese refugees in the Pacific Northwest.", city: "seattle" },

  // --- Philadelphia ---
  { id: 122, name: "Nigerian Association of Greater Philadelphia", type: "nonprofit", category: "Nigerian Community", description: "Cultural festivals, community outreach, and educational scholarships for Nigerians in Philly.", city: "philadelphia" },
  { id: 123, name: "Ethiopian and Eritrean Community of Philadelphia", type: "nonprofit", category: "Habesha Community", description: "Cultural events, mutual aid, and social services for the Habesha community in Philadelphia.", city: "philadelphia" },
  { id: 124, name: "Sudanese Community Association of Philadelphia", type: "nonprofit", category: "Sudanese Community", description: "Refugee support, cultural preservation, and civic engagement for Sudanese families.", city: "philadelphia" },

  // --- Denver ---
  { id: 125, name: "Ethiopian Community of Colorado", type: "nonprofit", category: "Ethiopian Community", description: "Cultural programming, social services, and advocacy for Ethiopians in the Denver metro.", city: "denver" },
  { id: 126, name: "Somali Community Center of Colorado", type: "nonprofit", category: "Somali Community", description: "Resettlement, youth development, and family support for Somali refugees in Denver.", city: "denver" },
  { id: 127, name: "South Sudanese Community of Colorado", type: "nonprofit", category: "South Sudanese Community", description: "Community building, education, and cultural preservation for South Sudanese families in Denver.", city: "denver" },

  // --- Detroit ---
  { id: 128, name: "Congolese Community of Detroit", type: "nonprofit", category: "Congolese Community", description: "Refugee resettlement, cultural integration, and community advocacy for Congolese in Michigan.", city: "detroit" },
  { id: 129, name: "Nigerian Association of Michigan", type: "nonprofit", category: "Nigerian Community", description: "Cultural celebrations, professional networking, and community support for Nigerians in Detroit.", city: "detroit" },
  { id: 130, name: "Sudanese Community of Michigan", type: "nonprofit", category: "Sudanese Community", description: "Mutual aid, cultural events, and education programs for Sudanese families in Metro Detroit.", city: "detroit" },

  // --- Nashville ---
  { id: 131, name: "Nashville Kurdish & Somali Community Alliance", type: "nonprofit", category: "Somali Community", description: "Refugee resettlement, ESL classes, and community integration for Somali families in Nashville.", city: "nashville" },
  { id: 132, name: "South Sudanese Community of Nashville", type: "nonprofit", category: "South Sudanese Community", description: "Youth programs, cultural preservation, and mutual aid for South Sudanese refugees.", city: "nashville" },

  // --- Houston (additional) ---
  { id: 133, name: "Ghanaian Association of Houston", type: "nonprofit", category: "Ghanaian Community", description: "Cultural celebrations, community outreach, and educational programs for Ghanaians in Houston.", city: "houston" },
  { id: 134, name: "Somali Bantu Community of Houston", type: "nonprofit", category: "Somali Community", description: "Refugee resettlement, job training, and family support for Somali Bantu in Houston.", city: "houston" },
  { id: 135, name: "Sudanese Community Association of Houston", type: "nonprofit", category: "Sudanese Community", description: "Cultural events, youth programs, and mutual aid for Sudanese families in Greater Houston.", city: "houston" },
  { id: 136, name: "South Sudanese Community of Houston", type: "nonprofit", category: "South Sudanese Community", description: "Community building, education advocacy, and cultural preservation for South Sudanese in Houston.", city: "houston" },
  { id: 137, name: "Congolese Community of Houston", type: "nonprofit", category: "Congolese Community", description: "Refugee support, cultural events, and integration services for Congolese families.", city: "houston" },
  { id: 138, name: "Kenyan Community in Houston", type: "nonprofit", category: "Kenyan Community", description: "Professional networking, cultural festivals, and community support for Kenyans in Houston.", city: "houston" },

  // --- Dallas (additional) ---
  { id: 139, name: "Somali Community of Dallas-Fort Worth", type: "nonprofit", category: "Somali Community", description: "Refugee support, youth programs, and cultural integration for Somali families in DFW.", city: "dallas" },
  { id: 140, name: "Ghanaian Association of North Texas", type: "nonprofit", category: "Ghanaian Community", description: "Cultural celebrations, community outreach, and mutual aid for Ghanaians in the DFW metroplex.", city: "dallas" },
  { id: 141, name: "Kenyan Community of DFW", type: "nonprofit", category: "Kenyan Community", description: "Professional networking, cultural events, and community support for Kenyans in Dallas-Fort Worth.", city: "dallas" },
  { id: 142, name: "Congolese Community of North Texas", type: "nonprofit", category: "Congolese Community", description: "Refugee resettlement, cultural preservation, and community advocacy for Congolese families in DFW.", city: "dallas" },
  { id: 143, name: "South Sudanese Community of DFW", type: "nonprofit", category: "South Sudanese Community", description: "Community building, youth empowerment, and cultural events for South Sudanese in Dallas.", city: "dallas" },

  // --- London ---
  { id: 144, name: "Nigerian Community UK", type: "nonprofit", category: "Nigerian Community", description: "Cultural celebrations, professional networking, and advocacy for Nigerians across London.", city: "london" },
  { id: 145, name: "Ghanaian Community Centre London", type: "nonprofit", category: "Ghanaian Community", description: "Cultural events, community support, and integration services for Ghanaians in London.", city: "london" },
  { id: 146, name: "Ethiopian Community in Britain (ECB)", type: "nonprofit", category: "Ethiopian Community", description: "Cultural programming, social services, and community advocacy for Ethiopians in London.", city: "london" },
  { id: 147, name: "Eritrean Community in the UK", type: "nonprofit", category: "Eritrean Community", description: "Youth mentorship, cultural celebrations, and mutual aid for Eritreans across London.", city: "london" },
  { id: 148, name: "Somali Community Association UK", type: "nonprofit", category: "Somali Community", description: "Education, employment support, and community integration for London's large Somali population.", city: "london" },
  { id: 149, name: "Congolese Community UK", type: "nonprofit", category: "Congolese Community", description: "Cultural preservation, refugee support, and advocacy for Congolese in London.", city: "london" },
  { id: 150, name: "Kenyan Community Living in the UK", type: "nonprofit", category: "Kenyan Community", description: "Professional networking, cultural events, and community support for Kenyans in London.", city: "london" },
  { id: 151, name: "South Sudanese Community UK", type: "nonprofit", category: "South Sudanese Community", description: "Refugee resettlement support, youth programs, and cultural preservation in London.", city: "london" },

  // --- Toronto ---
  { id: 152, name: "Nigerian Canadian Association", type: "nonprofit", category: "Nigerian Community", description: "Cultural events, professional development, and community support for Nigerians in Toronto.", city: "toronto" },
  { id: 153, name: "Ethiopian Association in Toronto", type: "nonprofit", category: "Ethiopian Community", description: "Settlement support, cultural programs, and mutual aid for Ethiopians in the GTA.", city: "toronto" },
  { id: 154, name: "Somali Canadian Association of Toronto", type: "nonprofit", category: "Somali Community", description: "Youth programs, education support, and community building for Toronto's Somali community.", city: "toronto" },
  { id: 155, name: "Ghanaian Canadian Association of Ontario", type: "nonprofit", category: "Ghanaian Community", description: "Cultural celebrations, community outreach, and mutual aid for Ghanaians in Toronto.", city: "toronto" },
  { id: 156, name: "Haitian Community Centre of Toronto", type: "nonprofit", category: "Haitian Community", description: "Cultural programs, francophone services, and community integration for Haitians in Ontario.", city: "toronto" },
  { id: 157, name: "Congolese Community of Toronto", type: "nonprofit", category: "Congolese Community", description: "Refugee support, cultural events, and integration services for Congolese in the GTA.", city: "toronto" },

  // --- Montreal ---
  { id: 158, name: "Communauté Haïtienne de Montréal", type: "nonprofit", category: "Haitian Community", description: "Cultural celebration, social services, and community support for Montreal's large Haitian population.", city: "montreal" },
  { id: 159, name: "Maison d'Haïti", type: "nonprofit", category: "Haitian Community", description: "Education, social services, and cultural programming — a cornerstone of Montreal's Haitian community.", city: "montreal", website: "https://www.mhaiti.org" },
  { id: 160, name: "Congolese Community of Montreal", type: "nonprofit", category: "Congolese Community", description: "Cultural preservation, refugee support, and francophone community building in Montreal.", city: "montreal" },

  // --- Paris ---
  { id: 161, name: "Association des Congolais de France", type: "nonprofit", category: "Congolese Community", description: "Cultural events, community support, and advocacy for the Congolese diaspora in Paris.", city: "paris" },
  { id: 162, name: "Communauté Haïtienne de Paris", type: "nonprofit", category: "Haitian Community", description: "Cultural celebrations, social services, and networking for Haitians living in the Île-de-France.", city: "paris" },
  { id: 163, name: "Association des Sénégalais et Africains de l'Ouest", type: "nonprofit", category: "West African Community", description: "Community support and cultural programming for West African communities in Paris.", city: "paris" },
];
