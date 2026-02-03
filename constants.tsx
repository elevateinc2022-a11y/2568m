
import { Property, EducationArticle, PropertyIdentifier, AssessmentIdentifier, TaxSale } from './types';

export const PROVINCE_MAP: Record<string, string> = {
  'AB': 'Alberta',
  'BC': 'British Columbia',
  'MB': 'Manitoba',
  'NB': 'New Brunswick',
  'NL': 'Newfoundland and Labrador',
  'NS': 'Nova Scotia',
  'ON': 'Ontario',
  'PE': 'Prince Edward Island',
  'QC': 'Quebec',
  'SK': 'Saskatchewan',
  'NT': 'Northwest Territories',
  'NU': 'Nunavut',
  'YT': 'Yukon'
};

const STATE_TO_JURIS_ID: Record<string, string> = {
  'AB': '1', 'BC': '2', 'MB': '3', 'NB': '4', 'NL': '5', 'NS': '6',
  'ON': '7', 'PE': '8', 'QC': '9', 'SK': '10', 'NT': '11', 'NU': '12', 'YT': '13'
};

const CITIES_DATA = [
  { city: 'Toronto', munc: 'Etobicoke', state: 'ON', zip: 'M5H', lat: 43.65, lng: -79.38 },
  { city: 'Vancouver', munc: 'Downtown', state: 'BC', zip: 'V6B', lat: 49.28, lng: -123.12 },
  { city: 'Montreal', munc: 'Plateau', state: 'QC', zip: 'H3A', lat: 45.50, lng: -73.56 },
  { city: 'Mississauga', munc: 'Industrial', state: 'ON', zip: 'L5B', lat: 43.58, lng: -79.64 },
  { city: 'Canmore', munc: 'Mountain View', state: 'AB', zip: 'T1W', lat: 51.08, lng: -115.34 },
  { city: 'Halifax', munc: 'Waterfront', state: 'NS', zip: 'B3J', lat: 44.64, lng: -63.57 },
  { city: 'Winnipeg', munc: 'St. Boniface', state: 'MB', zip: 'R3C', lat: 49.89, lng: -97.13 },
  { city: 'London', munc: 'Fanshawe', state: 'ON', zip: 'N5V', lat: 42.98, lng: -81.24 },
  { city: 'Calgary', munc: 'Beltline', state: 'AB', zip: 'T2P', lat: 51.04, lng: -114.07 },
  { city: 'Ottawa', munc: 'Kanata', state: 'ON', zip: 'K2K', lat: 45.42, lng: -75.69 },
  { city: 'Whitehorse', munc: 'Riverdale', state: 'YT', zip: 'Y1A', lat: 60.72, lng: -135.05 },
  { city: 'Yellowknife', munc: 'Old Town', state: 'NT', zip: 'X1A', lat: 62.45, lng: -114.37 },
  { city: 'Iqaluit', munc: 'Lower base', state: 'NU', zip: 'X0A', lat: 63.74, lng: -68.51 }
];

const STREETS = ['Maple Ave', 'Oak St', 'Pine Rd', 'Elm Blvd', 'Cedar Dr', 'Birch Ln', 'Main St', 'King St', 'Queen St', 'Bay St'];
const TYPES: Property['propertyType'][] = ['Residential', 'Commercial', 'Industrial', 'Land'];
const STATUSES: Property['status'][] = ['Active', 'Active', 'Active', 'Sold', 'Cancelled'];
const SALES: Property['saleType'][] = ['Tender', 'Auction'];
const FEATURES: Property['features'][] = [['Road Access'], ['Road Access', 'Near Water'], ['Waterfront', 'Road Access'], ['Mountain', 'Road Access'], ['Road Access']];

const generate99Properties = (): Property[] => {
  const props: Property[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 1; i <= 99; i++) {
    const cityObj = CITIES_DATA[i % CITIES_DATA.length];
    const street = STREETS[Math.floor(Math.random() * STREETS.length)];
    const price = 15000 + (Math.random() * 85000);
    const mValue = price * (3 + Math.random() * 10);
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const sizeVal = (0.1 + Math.random() * 5).toFixed(2);
    const sizeStr = i % 2 === 0 ? `${sizeVal} Acres` : `${Math.floor(1000 + Math.random() * 5000)} sqft`;
    
    // Use city-specific base coordinates with a tiny random offset for spread within the city
    const lat = cityObj.lat + (Math.random() * 0.1 - 0.05);
    const lng = cityObj.lng + (Math.random() * 0.1 - 0.05);
    
    const pId = i.toString();
    const identifiers: PropertyIdentifier[] = [];
    const assessments: AssessmentIdentifier[] = [];
    const taxSales: TaxSale[] = [];

    const year = currentYear - (i % 4);
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    const saleDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    if (cityObj.state === 'ON') {
      identifiers.push({ id: `ident-${pId}-1`, propertyId: pId, type: 'PIN', value: `12345-${(1000 + i).toString().padStart(4, '0')}`, issuingAuthority: 'Land Registry Office Ontario' });
      assessments.push({ id: `assess-${pId}-1`, propertyId: pId, type: 'RollNumber', value: `1904000000${(10000 + i).toString()}`, authority: 'MPAC' });
    } else if (cityObj.state === 'NS') {
      identifiers.push({ id: `ident-${pId}-1`, propertyId: pId, type: 'PID', value: `${(40000000 + i).toString()}`, issuingAuthority: 'Land Registration Nova Scotia' });
      assessments.push({ id: `assess-${pId}-1`, propertyId: pId, type: 'AAN', value: `${(0 + i).toString().padStart(8, '0')}`, authority: 'PVSC' });
    } else if (cityObj.state === 'BC') {
      identifiers.push({ id: `ident-${pId}-1`, propertyId: pId, type: 'PID', value: `${(0 + i).toString().padStart(3, '0')}-${(0 + i).toString().padStart(3, '0')}-${(0 + i).toString().padStart(3, '0')}`, issuingAuthority: 'LTSA British Columbia' });
      assessments.push({ id: `assess-${pId}-1`, propertyId: pId, type: 'Folio', value: `${(1000 + i).toString()}.${(100 + i).toString()}`, authority: 'BC Assessment' });
    } else if (cityObj.state === 'AB') {
      identifiers.push({ id: `ident-${pId}-1`, propertyId: pId, type: 'LINC', value: `00${(12345678 + i).toString()}`, issuingAuthority: 'Alberta Land Titles' });
      assessments.push({ id: `assess-${pId}-1`, propertyId: pId, type: 'RollNumber', value: `${(900000 + i).toString()}`, authority: 'City of Calgary / Edmonton' });
    } else if (cityObj.state === 'MB') {
      identifiers.push({ id: `ident-${pId}-1`, propertyId: pId, type: 'ParcelNumber', value: `MB-${(55000 + i).toString()}`, issuingAuthority: 'Manitoba Land Titles' });
      assessments.push({ id: `assess-${pId}-1`, propertyId: pId, type: 'Folio', value: `${(77000 + i).toString()}`, authority: 'City of Winnipeg Assessment' });
    }

    taxSales.push({
      id: `ts-${pId}`,
      propertyId: pId,
      saleStatus: status === 'Sold' ? 'final' : status === 'Cancelled' ? 'cancelled' : 'redeemable',
      saleDate: saleDate,
      taxesOwing: Math.floor(price),
      municipality: cityObj.munc
    });

    const p: Property = {
      id: pId,
      jurisdictionId: STATE_TO_JURIS_ID[cityObj.state] || '7',
      address: `${100 + i} ${street}`,
      municipality: cityObj.munc,
      city: cityObj.city,
      state: cityObj.state,
      zipCode: `${cityObj.zip} ${Math.floor(Math.random() * 9)}X${Math.floor(Math.random() * 9)}`,
      price: Math.floor(price),
      marketValue: Math.floor(mValue).toString(),
      auctionDate: saleDate,
      datePosted: '2024-01-05',
      status: status,
      soldPrice: status === 'Sold' ? Math.floor(price * 1.5).toString() : undefined,
      saleType: SALES[i % 2],
      propertyType: TYPES[i % 4],
      features: FEATURES[i % 5],
      images: [`https://images.unsplash.com/photo-${1570129477492 + i}-45c003edd2be?auto=format&fit=crop&q=80&w=800`],
      description: `Official municipal notice for ${cityObj.city}. Full legal details regarding the tax recovery process are included in this listing. This property is being sold to recover unpaid municipal taxes.`,
      landDescription: `Legal description for ${100 + i} ${street}: Parcel ${i * 123}, Plan ${i * 456}, Municipality of ${cityObj.city}. Total size approximately ${sizeStr}. All bidders are responsible for conducting their own title search.`,
      taxAmount: Math.floor(price * 0.1),
      liens: i % 10 === 0 ? ['CRA Tax Lien'] : [],
      owner: `Owner ${i}`,
      propertySize: sizeStr,
      coordinates: { lat, lng },
      latitude: lat,
      longitude: lng,
      identifiers: identifiers,
      assessments: assessments,
      taxSales: taxSales,
      createdAt: new Date().toISOString()
    };

    props.push(p);
  }
  return props;
};

export const INITIAL_PROPERTIES: Property[] = generate99Properties();

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'e1',
    title: 'What is a Canadian Tax Sale?',
    category: 'Basics',
    excerpt: 'Understanding the provincial differences in tax sale legislation across Canada.',
    content: 'In Canada, property tax sales are governed by provincial laws. Each province has its own unique process for dealing with delinquent property taxes. For example, in Ontario, the Municipal Tax Sales Act governs the process, while in BC, it falls under the Local Government Act. Investors must understand the specific rules of the province they are investing in, including redemption periods and lien priority.\n\nHistorically, these sales were the primary method for municipalities to settle accounts. Today, they represent one of the last ways to find high-equity real estate in an increasingly competitive market.',
    date: 'Jan 10, 2024',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'e2',
    title: 'Redemption Periods Explained',
    category: 'Risk',
    excerpt: 'How long does a homeowner have to get their property back after a sale?',
    content: 'A redemption period is a window of time after a tax sale during which the original owner can reclaim the property by paying the outstanding taxes plus interest and penalties. In some provinces, this period can be up to a year.\n\nInvesting in a property with a long redemption period means your capital is tied up, and you might not gain possession for a significant time. For instance, in Prince Edward Island and some other jurisdictions, the owner may have up to 12 months to pay the debt and cancel the sale.',
    date: 'Feb 15, 2024',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'e3',
    title: 'Conducting Title Searches',
    category: 'Strategy',
    excerpt: 'The most critical step in your due diligence process.',
    content: 'A title search reveals any registered interests in the property, such as mortgages, liens, or easements. While most liens are wiped out by a tax sale in many jurisdictions, certain government liens (like CRA liens) may survive.\n\nAlways perform a professional title search before placing a bid or submitting a tender. Neglecting this step is the single most common mistake new investors make. Understanding the hierarchy of liens ensures you do not inherit someone else\'s federal tax debt.',
    date: 'Mar 05, 2024',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=800'
  }
];
