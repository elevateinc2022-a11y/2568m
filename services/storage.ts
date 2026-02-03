
import { Property, User, EducationArticle, FAQItem, Jurisdiction, AboutContent, SiteConfig, LegalContent, Subscription, PaymentHistoryItem } from '../types';
import { INITIAL_PROPERTIES, EDUCATION_ARTICLES } from '../constants';

const KEYS = {
  PROPERTIES: 'taxsales_properties',
  USER: 'taxsales_user',
  USERS: 'taxsales_all_users',
  ARTICLES: 'taxsales_articles',
  FAQS: 'taxsales_faqs',
  JURISDICTIONS: 'taxsales_jurisdictions',
  ABOUT: 'taxsales_about',
  CONFIG: 'taxsales_site_config',
  LEGAL: 'taxsales_legal_content'
};

const INITIAL_ABOUT_CONTENT: AboutContent = {
  introduction: "Maple Leaf Tax Sales Canada is a Canadian-focused platform dedicated to making tax sale property information clearer, more accessible, and easier to navigate.\n\nTax sales can offer unique opportunities—but the process is often misunderstood, fragmented across municipalities, and difficult for the average buyer to follow. Our goal is to simplify that experience by bringing reliable tax sale information together in one centralized hub.",
  whatWeDo: "Maple Leaf Tax Sales Canada aggregates and organizes tax sale listings from municipalities across Canada. Properties are clearly categorized by status—active, sold, cancelled, and Not Available—so users can quickly understand what opportunities available and what has changed.\n\nWe provide tools and educational resources designed to help:\n- First-time buyers understand how tax sales work\n- Investors track and evaluate opportunities\n- Researchers and professionals analyze public property data\n- Canadians seeking transparent access to tax sale information",
  whyWeExist: "Tax sale listings are often scattered across municipal websites, posted in inconsistent formats, and updated without notice. We created Maple Leaf Tax Sales Canada to solve this problem by offering a structured, easy-to-use platform built specifically for the Canadian tax sale landscape.\n\nOur mission is to reduce confusion, improve transparency, and support informed decision-making.",
  ourApproach: "Accuracy – Carefully sourced and regularly reviewed listings\nClarity – Straightforward explanations without unnecessary jargon\nTransparency – Clear property status and process guidance\nAccessibility – A platform designed for both beginners and experienced users\n\nMaple Leaf Tax Sales Canada does not sell properties, provide legal or financial advice, or act on behalf of municipalities. We operate as an independent information resource, encouraging all users to perform their own due diligence before participating in a tax sale.",
  vision: "As we grow, we aim to expand coverage across all provinces and territories, enhance mapping and filtering tools, and develop in-depth guides that explain provincial rules, redemption periods, and potential risks.\n\nOur vision is to become Canada’s most trusted and comprehensive tax sale information platform."
};

const INITIAL_LEGAL_CONTENT: LegalContent = {
  privacyPolicy: `PRIVACY POLICY\n\nMaple Leaf Tax Sales Canada\n\nThis Privacy Policy describes how we collect, use, and protect your personal information.\n\n1. Information We Collect\nPersonal Information\nName\nEmail address\nAccount credentials\nSubscription status\nPayment Information\nProcessed through secure third-party payment systems\nWe do not store full credit card details\nUsage Data\nIP address\nDevice and browser information\nPages visited and feature usage\n\n2. How We Use Information\nWe use your information to:\nCreate and manage accounts\nProvide paid and free services\nProcess billing and subscriptions\nImprove performance and security\nCommunicate service-related updates\n\n3. Data Storage & Security\nPersonal data is stored using secure systems and safeguards\nReasonable administrative, technical, and physical protections are applied\nNo method of transmission is completely secure\n\n4. Sharing of Information\nWe do not sell your personal information.\nInformation may be shared with:\nService providers required to operate the platform\nLegal authorities when required by law\nSuccessor entities in the event of a merger or sale\n\n5. Cookies & Analytics\nWe may use cookies or similar technologies to:\nImprove user experience\nAnalyze traffic and usage trends\nMaintain session integrity\nYou can disable cookies in your browser settings.\n\n6. Your Rights\nYou have the right to:\nAccess your personal information\nRequest corrections\nRequest deletion, subject to legal obligations\nWithdraw consent\nRequests can be sent to:\n📧 contact@mapleleaftaxsales.ca\n\n7. Data Retention\nWe retain personal information only as long as necessary to:\nProvide services\nMeet legal, regulatory, or accounting obligations\n\n8. Policy Updates\nThis Privacy Policy may be updated periodically. Continued use of the Service constitutes acceptance of any changes.`,
  termsConditions: `TERMS & CONDITIONS\n\nMaple Leaf Tax Sales Canada\n\nLast Updated: [Insert Date]\n\nWelcome to Maple Leaf Tax Sales Canada (“Maple Leaf”, “we”, “us”, “our”).\nThese Terms & Conditions govern your access to and use of mapleleaftaxsales.ca, including all content, subscriptions, and services (the “Service”).\n\nBy accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.\n\n1. Eligibility & Account Registration\nYou must be at least the age of majority in your province or territory.\nWhen creating an account, you agree to provide accurate and complete information.\nYou are responsible for maintaining the confidentiality of your login credentials.\nAccounts are personal and non-transferable.\n\n2. Nature of the Service (Important)\nMaple Leaf Tax Sales Canada provides informational tools and data related to Canadian tax sale properties.\nWe do not:\nProvide legal, financial, or investment advice\nGuarantee accuracy, availability, or outcomes\nAct on behalf of municipalities or governments\nTax sale rules vary by province and municipality. You are solely responsible for performing independent due diligence.\n\n3. Subscriptions, Billing & Payments\nCertain features require payment through our secure checkout system.\nSubscriptions may be offered on a monthly or yearly basis\nFees are displayed prior to purchase\nPrices are shown in Canadian Dollars (CAD) unless stated otherwise\nApplicable taxes may be added based on your location\nBy completing a purchase, you authorize us to charge your selected payment method automatically for recurring subscriptions until cancelled.\n\n4. Free Trials\nFree trials may be offered at our discretion\nTrial access may be limited in duration or features\nWe reserve the right to modify or delete trials at any time\nContinued access after a trial may require a paid subscription\n\n5. Cancellation & Account Termination\nUser Cancellation\nYou may cancel your subscription at any time through your account settings\nYour subscription remains active until the end of the current billing period\nNo partial refunds or credits are issued for unused time\nAccount Termination\nWe may suspend or terminate access if:\nThese Terms are violated\nActivity is abusive, fraudulent, or unlawful\nPayment obligations are not met\n\n6. Refund Policy\nAll purchases are final and non-refundable, except where required by applicable law.\n\n7. Intellectual Property\nAll content on this Website, including text, data, maps, listings, and branding, is owned by or licensed to Maple Leaf Tax Sales Canada.\nYou may not:\nCopy, scrape, or redistribute content\nUse data for commercial purposes without permission\nReverse engineer or misuse platform features\n\n8. User-Generated Content\nIf you submit content:\nYou retain ownership\nYou grant us a non-exclusive, royalty-free license to use it\nYou confirm the content does not violate laws or third-party rights\nWe reserve the right to remove content at our discretion.\n\n9. Third-Party Services\nThe Service may rely on third-party infrastructure and tools to operate efficiently.\nWe are not responsible for interruptions, errors, or losses caused by third-party systems beyond our reasonable control.\n\n10. Disclaimer & Limitation of Liability\nThe Service is provided “as is” and “as available.”\nTo the maximum extent permitted by law, Maple Leaf Tax Sales Canada is not liable for:\nErrors or omissions in content\nFinancial or investment losses\nService interruptions\nReliance on provided information\nUse of the Service is at your own risk.\n\n11. Governing Law\nThese Terms are governed by the laws of Canada and the laws of the Province of [Insert Province], without regard to conflict-of-law principles.\n\n12. Contact\n📧 contact@mapleleaftaxsales.ca`,
  cookiePolicy: `Maple Leaf Tax Sales Canada\n\nThis Cookie Policy explains how Maple Leaf Tax Sales Canada (“we”, \"us\", \"our\") uses cookies and similar technologies on mapleleaftaxsales.ca (the “Website”).\n\nThis policy should be read together with our Privacy Policy and Terms & Conditions.\n\n1. What Are Cookies?\nCookies are small text files stored on your device (computer, tablet, or mobile device) when you visit a website. They help websites function properly, remember preferences, and improve user experience.\n\n2. Types of Cookies We Use\na) Essential Cookies (Required)\nThese cookies are necessary for the Website to function and cannot be disabled. They enable:\nAccount login and authentication\nSecurity and fraud prevention\nSession management\nSubscription access\nWithout these cookies, core features of the Website will not work.\nb) Functional Cookies\nThese cookies help remember your preferences and settings, such as:\nLanguage preferences\nSaved filters or search settings\nUser interface customization\nc) Analytics & Performance Cookies\nThese cookies help us understand how visitors use the Website so we can improve performance and usability. They may collect information such as:\nPages visited\nTime spent on pages\nDevice and browser types\nError tracking\nAll data collected is aggregated and does not directly identify you.\nd) Marketing & Communication Cookies (If Applicable)\nThese cookies may be used to:\nMeasure the effectiveness of campaigns\nDeliver relevant updates or announcements\nPrevent repetitive messaging\nWe do not use cookies to sell your personal information.\n3. Third-Party Cookies\nSome cookies may be placed by third-party tools that help operate or analyze the Website. These third parties are required to handle data in accordance with applicable privacy laws.\nWe do not control third-party cookie policies and recommend reviewing their privacy practices separately.\n4. Consent & Control\nWhen required by law, we request your consent before placing non-essential cookies.\nYou can manage or disable cookies at any time through:\nYour browser settings\nCookie consent tools available on the Website (if enabled)\nPlease note that disabling cookies may affect functionality.\n5. How Long Cookies Remain on Your Device\nCookies may be:\nSession cookies, which expire when you close your browser\nPersistent cookies, which remain until deleted or expire automatically\n6. Updates to This Cookie Policy\nWe may update this Cookie Policy from time to time to reflect changes in law or Website functionality. Any updates will be posted on this page.\nContinued use of the Website constitutes acceptance of the updated policy.\n7. Contact Us\nIf you have questions about this Cookie Policy or our use of cookies, contact us at:\n\n📧 contact@mapleleaftaxsales.ca`,
  disclaimer: `DISCLAIMER\n\nThe information provided on Maple Leaf Tax Sales Canada is for general informational purposes only and does not constitute legal, financial, or investment advice.\n\nTax sale rules, property conditions, and redemption rights vary by province and municipality and are subject to change. While we strive to keep information up to date, we make no representations or warranties regarding accuracy, completeness, or reliability.\n\nUsers are solely responsible for conducting their own independent due diligence before participating in any tax sale or property transaction. Use of this website and reliance on any information provided is at your own risk.\n\nWe are not responsible for any losses, damages, or outcomes arising from the use of this website or linked third-party content.`
};

const INITIAL_SITE_CONFIG: SiteConfig = {
  logoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgPHBhdGggZmlsbD0iIzhCMDYwNiIgZD0iTTEyLjQzIDIuMWMtLjI0LS4xMy0uNTItLjEzLS43NiAwbC0xLjA3LjZjLS4xLjA2LS4yLjEzLS4yOC4yMkw3LjY1IDYuMDVjLS4xLjExLS4yNC4xNi0uMzkuMTRMNC4wMyA1Ljg2Yy0uMjgtLjAyLS41NC4xMi0uNjguMzYtLjEzLjI0LS4xLjU0LjA4Ljc1bDIuNDUgMi44Yy4xLjExLjE0LjI2LjExLjQxTDUuMzQgMTMuNWMtLjA2LjI3LjA1LjU2LjI4LjcxLjIzLjE1LjUzLjE0Ljc1LS4wNGwyLjU4LTIuMWMuMTItLjEuMjgtLjEzLjQzLS4wOWwzLjEyIDEuMDRjLjE1LjA1LjMwLjA1LjQ1IDBsMy4xMi0xLjA0Yy4xNS0uMDUuMzEtLjAyLjQzLjA5bDIuNTggMi4xYy4yMi4xOC41Mi4xOS43NS4wNC4yMy0uMTUuMzQtLjQ0LjI4LS43MWwtLjY1LTMuMzJjLS4wMy0uMTUuMDEtLjMwLjExLS40MWwyLjQ1LTIuOGMuMTgtLjIxLjIxLS41MS4wOC0uNzUtLjE0LS4yNC0uNC0uMzgtLjY4LS4zNmwtMy4yMy4zM2MtLjE1LjAyLS4yOS0uMDMtLjM5LS4xNGwtMi42Ny0zLjEzYy0uMDgtLjA5LS4xOC0uMTYtLjI4LS4yMmwtMS4wNy0uNnoiLz4KICA8dGV4dCB4PSIxMiIgeT0iMTAuODUiIGZvbnQtZmFtaWx5PSJJbnRlciwgU2Fucy1TZXJpZiIgZm9udC1zaXplPSI1LjUiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NPC90ZXh0Pgo8L3N2Zz4=",
  brandName: "Maple Leaf Tax Sales",
  brandAccent: "Canada",
  heroTitle: "Find Your Next High-Yield Tax Sale Property.",
  heroSubtitle: "Discover Canada-wide tax sale properties with smart alerts, trusted insights, and up-to-date listings.",
  heroImageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1920",
  statsBadge1Title: "4,500+ Listings Tracked",
  statsBadge1Subtitle: "Real-time Canadian database",
  statsBadge2Title: "Municipal Source Sync",
  statsBadge2Subtitle: "Verified public records",
  supportEmail: "support@mapleleaftax.ca",
  officeHours: "Mon - Fri: 9am - 5pm EST",
  footerDescription: "Canada's leading marketplace for municipal tax lien and deed properties. Data-driven insights for the professional Canadian real estate investor.",
  newsletterHeadline: "Get daily Canadian auction alerts delivered to your inbox.",
  footerCopyright: "© 2026 Maple Leaf Tax Sales Canada. All rights reserved.",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  tiktokUrl: "https://tiktok.com",
  twitterUrl: "https://twitter.com",
  newsItems: [
    { id: '1', type: 'update', text: 'New Listings added for Toronto, Ontario', link: '#' },
    { id: '2', type: 'news', text: 'Upcoming Webinar: Tax Sale Investing 101', link: '#' },
    { id: '3', type: 'alert', text: 'Important: Changes to Alberta Tax Sale Legislation', link: '#' },
    { id: '4', type: 'update', text: 'Vancouver Auction Results now available', link: '#' },
    { id: '5', type: 'news', text: 'Market Report: Q1 2024 Trends', link: '#' },
    { id: '6', type: 'update', text: 'Mobile App updated with push notifications', link: '#' }
  ],
  loginHeadline: "Welcome Back",
  loginSubheadline: "sign in to your account",
  signupHeadline: "Create your account today!",
  signupSubheadline: "Your Edge in Tax Sales. Personalize your journey with Canada's premier tax sale platform - packed with insights and tools that put you ahead.",
  signupBenefits: [
    { id: 'b1', title: "Never Miss a Sale", description: "Weekly alerts for upcoming tax sales in Canada, filtered by province." },
    { id: 'b2', title: "Powerful Property Search", description: "Find tax sale properties fast with smart filters and an interactive map." },
    { id: 'b3', title: "Verified Listings", description: "Up-to-date tax sale properties sourced directly from municipalities." },
    { id: 'b4', title: "Investor-Friendly Tools", description: "Built for investors and homebuyers looking for clarity, speed, and confidence." },
    { id: 'b5', title: "Canada-Wide Coverage", description: "From local municipalities to nationwide listings - all in one place." }
  ]
};

const INITIAL_USER: User = {
  id: 'admin-001',
  email: 'admin@mapleleaftax.ca',
  role: 'admin',
  favorites: [],
  savedSearches: [],
  subscription: {
    status: 'active',
    plan: 'yearly',
    startDate: new Date().toISOString(),
    nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndDate: new Date().toISOString(),
    autoRenew: true,
    cancelAtPeriodEnd: false
  },
  paymentHistory: [
    { id: 'PH-101', date: new Date().toISOString(), amount: 100.00, plan: 'yearly', status: 'paid' }
  ]
};

const INITIAL_JURISDICTIONS: Jurisdiction[] = [
  { id: '1', abbreviation: 'AB', name: 'Alberta', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Flag_of_Alberta.svg/200px-Flag_of_Alberta.svg.png', municipalities: ['Calgary', 'Edmonton', 'Canmore', 'Mountain View', 'Beltline'] },
  { id: '2', abbreviation: 'BC', name: 'British Columbia', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_British_Columbia.svg/200px-Flag_of_British_Columbia.svg.png', municipalities: ['Vancouver', 'Victoria', 'Downtown'] },
  { id: '3', abbreviation: 'MB', name: 'Manitoba', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Flag_of_Manitoba.svg/200px-Flag_of_Manitoba.svg.png', municipalities: ['Winnipeg', 'St. Boniface'] },
  { id: '4', abbreviation: 'NB', name: 'New Brunswick', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Flag_of_New_Brunswick.svg/200px-Flag_of_New_Brunswick.svg.png', municipalities: ['Fredericton', 'Moncton', 'Saint John'] },
  { id: '5', abbreviation: 'NL', name: 'Newfoundland and Labrador', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Newfoundland_and_Labrador.svg/200px-Flag_of_Newfoundland_and_Labrador.svg.png', municipalities: ['St. John\'s', 'Corner Brook'] },
  { id: '6', abbreviation: 'NS', name: 'Nova Scotia', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Nova_Scotia.svg/200px-Flag_of_Nova_Scotia.svg.png', municipalities: ['Halifax', 'Dartmouth', 'Waterfront'] },
  { id: '7', abbreviation: 'ON', name: 'Ontario', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Flag_of_Ontario.svg/200px-Flag_of_Ontario.svg.png', municipalities: ['Toronto', 'Ottawa', 'Mississauga', 'London', 'Etobicoke', 'Industrial', 'Fanshawe', 'Kanata'] },
  { id: '8', abbreviation: 'PE', name: 'Prince Edward Island', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Flag_of_Prince_Edward_Island.svg/200px-Flag_of_Prince_Edward_Island.svg.png', municipalities: ['Charlottetown', 'Summerside'] },
  { id: '9', abbreviation: 'QC', name: 'Quebec', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Flag_of_Quebec.svg/200px-Flag_of_Quebec.svg.png', municipalities: ['Montreal', 'Quebec City', 'Plateau'] },
  { id: '10', abbreviation: 'SK', name: 'Saskatchewan', type: 'province', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Flag_of_Saskatchewan.svg/200px-Flag_of_Saskatchewan.svg.png', municipalities: ['Saskatoon', 'Regina'] },
  { id: '11', abbreviation: 'NT', name: 'Northwest Territories', type: 'territory', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_the_Northwest_Territories.svg/200px-Flag_of_the_Northwest_Territories.svg.png', municipalities: ['Yellowknife', 'Old Town'] },
  { id: '12', abbreviation: 'NU', name: 'Nunavut', type: 'territory', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Flag_of_Nunavut.svg/200px-Flag_of_Nunavut.svg.png', municipalities: ['Iqaluit', 'Lower base'] },
  { id: '13', abbreviation: 'YT', name: 'Yukon', type: 'territory', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_Yukon.svg/200px-Flag_of_Yukon.svg.png', municipalities: ['Whitehorse', 'Riverdale'] }
];

const INITIAL_FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'General',
    question: "What is a Canadian municipal tax sale?",
    answer: "A municipal tax sale is a public process used by cities and municipalities to recover unpaid property taxes. When a property owner fails to pay taxes for a specific period (usually 2-3 years depending on the province), the municipality has the legal right to sell the property to recover the debt, interest, and administrative costs."
  },
  {
    id: '2',
    category: 'General',
    question: "How is the 'Minimum Bid' or 'Cancellation Price' determined?",
    answer: "The starting price for a tax sale property is typically calculated as the total of all outstanding property taxes, accumulated interest, penalties, and the costs associated with the sale process (advertising, legal fees, etc.). It does not represent the actual market value of the property."
  },
  {
    id: '3',
    category: 'Process',
    question: "What is the difference between a Public Tender and a Public Auction?",
    answer: "In a Public Tender (common in Ontario), bidders submit a sealed bid in a specific format with a deposit. The highest valid bid is usually accepted. In a Public Auction, the property is sold live to the highest bidder in a traditional bidding format."
  }
];

export const storage = {
  getProperties: (): Property[] => {
    const data = localStorage.getItem(KEYS.PROPERTIES);
    if (!data) {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    return JSON.parse(data);
  },
  saveProperty: (property: Property) => {
    const props = storage.getProperties();
    const index = props.findIndex(p => p.id === property.id);
    if (index > -1) {
      props[index] = property;
    } else {
      props.push(property);
    }
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(props));
  },
  deleteProperty: (id: string) => {
    const props = storage.getProperties();
    const filtered = props.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(filtered));
  },
  getJurisdictions: (): Jurisdiction[] => {
    const data = localStorage.getItem(KEYS.JURISDICTIONS);
    if (!data) {
      localStorage.setItem(KEYS.JURISDICTIONS, JSON.stringify(INITIAL_JURISDICTIONS));
      return INITIAL_JURISDICTIONS;
    }
    const parsedData: Jurisdiction[] = JSON.parse(data);
    const migrated = parsedData.map(j => ({
      ...j,
      municipalities: j.municipalities || []
    }));
    return migrated;
  },
  saveJurisdiction: (jurisdiction: Jurisdiction) => {
    const list = storage.getJurisdictions();
    const index = list.findIndex(j => j.id === jurisdiction.id);
    if (index > -1) {
      list[index] = jurisdiction;
    } else {
      list.push(jurisdiction);
    }
    localStorage.setItem(KEYS.JURISDICTIONS, JSON.stringify(list));
  },
  deleteJurisdiction: (id: string) => {
    const list = storage.getJurisdictions();
    const filtered = list.filter(j => j.id !== id);
    localStorage.setItem(KEYS.JURISDICTIONS, JSON.stringify(filtered));
  },
  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  },
  /**
   * Returns all users in the system.
   * If not found, initializes with a default admin user.
   */
  getAllUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) {
      const initial = [INITIAL_USER];
      localStorage.setItem(KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  /**
   * Updates user session and synchronized global user list.
   */
  updateUser: (user: User | null) => {
    if (user) {
      // Update session user
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
      
      // Update global user list for admin visibility
      const users = storage.getAllUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index > -1) {
        users[index] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  },
  getArticles: (): EducationArticle[] => {
    const data = localStorage.getItem(KEYS.ARTICLES);
    if (!data) {
      localStorage.setItem(KEYS.ARTICLES, JSON.stringify(EDUCATION_ARTICLES));
      return EDUCATION_ARTICLES;
    }
    return JSON.parse(data);
  },
  saveArticle: (article: EducationArticle) => {
    const articles = storage.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index > -1) {
      articles[index] = article;
    } else {
      articles.push(article);
    }
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
  },
  deleteArticle: (id: string) => {
    const articles = storage.getArticles();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(filtered));
  },
  getFAQs: (): FAQItem[] => {
    const data = localStorage.getItem(KEYS.FAQS);
    if (!data) {
      localStorage.setItem(KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
      return INITIAL_FAQS;
    }
    return JSON.parse(data);
  },
  saveFAQ: (faq: FAQItem) => {
    const faqs = storage.getFAQs();
    const index = faqs.findIndex(f => f.id === faq.id);
    if (index > -1) {
      faqs[index] = faq;
    } else {
      faqs.push(faq);
    }
    localStorage.setItem(KEYS.FAQS, JSON.stringify(faqs));
  },
  deleteFAQ: (id: string) => {
    const faqs = storage.getFAQs();
    const filtered = faqs.filter(f => f.id !== id);
    localStorage.setItem(KEYS.FAQS, JSON.stringify(filtered));
  },
  getAboutContent: (): AboutContent => {
    const data = localStorage.getItem(KEYS.ABOUT);
    if (!data) {
      localStorage.setItem(KEYS.ABOUT, JSON.stringify(INITIAL_ABOUT_CONTENT));
      return INITIAL_ABOUT_CONTENT;
    }
    return JSON.parse(data);
  },
  saveAboutContent: (content: AboutContent) => {
    localStorage.setItem(KEYS.ABOUT, JSON.stringify(content));
  },
  getLegalContent: (): LegalContent => {
    const data = localStorage.getItem(KEYS.LEGAL);
    if (!data) {
      localStorage.setItem(KEYS.LEGAL, JSON.stringify(INITIAL_LEGAL_CONTENT));
      return INITIAL_LEGAL_CONTENT;
    }
    return JSON.parse(data);
  },
  saveLegalContent: (content: LegalContent) => {
    localStorage.setItem(KEYS.LEGAL, JSON.stringify(content));
  },
  getSiteConfig: (): SiteConfig => {
    const data = localStorage.getItem(KEYS.CONFIG);
    if (!data) {
      localStorage.setItem(KEYS.CONFIG, JSON.stringify(INITIAL_SITE_CONFIG));
      return INITIAL_SITE_CONFIG;
    }
    const config = JSON.parse(data);
    if (!config.newsItems) {
      config.newsItems = INITIAL_SITE_CONFIG.newsItems;
    }
    if (!config.statsBadge1Title) config.statsBadge1Title = INITIAL_SITE_CONFIG.statsBadge1Title;
    if (!config.statsBadge1Subtitle) config.statsBadge1Subtitle = INITIAL_SITE_CONFIG.statsBadge1Subtitle;
    if (!config.statsBadge2Title) config.statsBadge2Title = INITIAL_SITE_CONFIG.statsBadge2Title;
    if (!config.statsBadge2Subtitle) config.statsBadge2Subtitle = INITIAL_SITE_CONFIG.statsBadge2Subtitle;

    if (!config.loginHeadline) config.loginHeadline = INITIAL_SITE_CONFIG.loginHeadline;
    if (!config.loginSubheadline) config.loginSubheadline = INITIAL_SITE_CONFIG.loginSubheadline;
    if (!config.signupHeadline) config.signupHeadline = INITIAL_SITE_CONFIG.signupHeadline;
    if (!config.signupSubheadline) config.signupSubheadline = INITIAL_SITE_CONFIG.signupSubheadline;
    if (!config.signupBenefits) config.signupBenefits = INITIAL_SITE_CONFIG.signupBenefits;

    // Force strict enforcement of the requested 2026 footer text
    if (!config.footerCopyright || config.footerCopyright.includes("2024")) {
      config.footerCopyright = INITIAL_SITE_CONFIG.footerCopyright;
    }

    return config;
  },
  saveSiteConfig: (config: SiteConfig) => {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  }
};
