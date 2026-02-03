
export type PropertyStatus = 'Active' | 'Sold' | 'Cancelled' | 'Not Available' | 'Redeemable: Yes' | 'Redeemable: No';
export type SaleType = 'Tender' | 'Auction';
export type PropertyCategory = 'Residential' | 'Commercial' | 'Industrial' | 'Land';
export type PropertyFeature = 'Road Access' | 'Mountain' | 'Waterfront' | 'Near Water';

export type IdentifierType = 'PID' | 'PIN' | 'LINC' | 'Cadastre' | 'ParcelNumber' | 'LegalDescription';
export type AssessmentType = 'RollNumber' | 'AAN' | 'AssessmentNumber' | 'Folio';
export type TaxSaleStatus = 'redeemable' | 'final' | 'cancelled';

export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'expired';
export type SubscriptionPlan = 'monthly' | 'yearly';

export interface BillingAddress {
  addressLine1: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Subscription {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  startDate: string;
  nextBillingDate: string;
  trialEndDate: string;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  plan: SubscriptionPlan;
  status: 'paid' | 'failed' | 'refunded';
}

export interface PropertyIdentifier {
  id: string;
  propertyId: string;
  type: IdentifierType;
  value: string;
  issuingAuthority?: string;
}

export interface AssessmentIdentifier {
  id: string;
  propertyId: string;
  type: AssessmentType;
  value: string;
  authority?: string;
}

export interface TaxSale {
  id: string;
  propertyId: string;
  saleStatus: TaxSaleStatus;
  saleDate: string;
  taxesOwing: number;
  municipality: string;
}

export interface Jurisdiction {
  id: string;
  name: string;
  type: 'province' | 'territory' | 'na';
  abbreviation: string;
  flagUrl?: string;
  municipalities: string[];
}

export interface Property {
  id: string;
  jurisdictionId: string;
  address: string;
  municipality: string;
  city: string;
  state: string; 
  zipCode: string;
  price: number;
  marketValue: string;
  auctionDate: string;
  datePosted: string;
  soldPrice?: string;
  redeemableInfo?: string;
  status: PropertyStatus;
  saleType: SaleType;
  propertyType: PropertyCategory;
  features: PropertyFeature[];
  images: string[];
  description: string;
  landDescription: string;
  taxAmount: number;
  liens: string[];
  owner: string;
  propertySize?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  latitude?: number;
  longitude?: number;
  identifiers: PropertyIdentifier[];
  assessments: AssessmentIdentifier[];
  taxSales: TaxSale[];
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  favorites: string[];
  savedSearches: string[];
  subscription: Subscription;
  paymentHistory: PaymentHistoryItem[];
  billingAddress?: BillingAddress;
}

export interface EducationArticle {
  id: string;
  title: string;
  category: 'Basics' | 'Risk' | 'Strategy' | 'Glossary';
  excerpt: string;
  content: string;
  date: string;
  image: string;
  pdfUrl?: string;
  videoUrl?: string;
  isQA?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Process' | 'Legal' | 'Investing';
}

export interface AboutContent {
  introduction: string;
  whatWeDo: string;
  whyWeExist: string;
  ourApproach: string;
  vision: string;
}

export interface LegalContent {
  privacyPolicy: string;
  termsConditions: string;
  cookiePolicy: string;
  disclaimer: string;
}

export interface NewsItem {
  id: string;
  text: string;
  link?: string;
  type: 'update' | 'news' | 'alert';
}

export interface SignupBenefit {
  id: string;
  title: string;
  description: string;
}

export interface SiteConfig {
  logoUrl: string;
  brandName: string;
  brandAccent: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  statsBadge1Title: string;
  statsBadge1Subtitle: string;
  statsBadge2Title: string;
  statsBadge2Subtitle: string;
  supportEmail: string;
  officeHours: string;
  footerDescription: string;
  newsletterHeadline: string;
  footerCopyright: string;
  newsItems: NewsItem[];
  loginHeadline: string;
  loginSubheadline: string;
  signupHeadline: string;
  signupSubheadline: string;
  signupBenefits: SignupBenefit[];
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  twitterUrl: string;
}

export interface FilterOptions {
  states: string[];
  municipalities: string[];
  minPrice: number;
  maxPrice: number;
  statuses: PropertyStatus[];
  saleTypes: SaleType[];
  propertyTypes: PropertyCategory[];
  features: PropertyFeature[];
  postalCode: string;
  radius: number | 'All';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'closing-soon';
  waterFilter: ('Waterfront' | 'Near Water')[];
}