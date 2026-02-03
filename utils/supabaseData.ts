import { supabase } from '../services/supabase';
import {
  Property,
  Jurisdiction,
  EducationArticle,
  FAQItem,
  SiteConfig,
  LegalContent,
  AboutContent,
  User,
  Subscription,
  PaymentHistoryItem,
} from '../types';

// Helper function to fetch data from a Supabase table
async function fetchData<T>(tableName: string): Promise<T[]> {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return [];
  }
  return data as T[];
}

// Fetching functions for each data type
export const fetchProperties = async (): Promise<Property[]> => {
  return fetchData<Property>('properties');
};

export const fetchJurisdictions = async (): Promise<Jurisdiction[]> => {
  return fetchData<Jurisdiction>('jurisdictions');
};

export const fetchArticles = async (): Promise<EducationArticle[]> => {
  return fetchData<EducationArticle>('education_articles');
};

export const fetchFAQs = async (): Promise<FAQItem[]> => {
  return fetchData<FAQItem>('faqs');
};

export const fetchSiteConfig = async (): Promise<SiteConfig | null> => {
  const { data, error } = await supabase.from('site_config').select('*').single();
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching site config:', error);
    return null;
  }
  return data as SiteConfig;
};

export const fetchLegalContent = async (): Promise<LegalContent | null> => {
  const { data, error } = await supabase.from('legal_content').select('*').single();
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching legal content:', error);
    return null;
  }
  return data as LegalContent;
};

export const fetchAboutContent = async (): Promise<AboutContent | null> => {
  const { data, error } = await supabase.from('about_content').select('*').single();
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching about content:', error);
    return null;
  }
  return data as AboutContent;
};

// Function to get user profile from Supabase (used in App.tsx)
export async function getSupabaseUserWithRole(supabaseUser: any): Promise<User | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, favorites, saved_searches, subscription_status, subscription_plan, subscription_start_date, subscription_next_billing_date, subscription_trial_end_date, subscription_auto_renew, subscription_cancel_at_period_end, payment_history, billing_address')
    .eq('id', supabaseUser.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (new user)
    console.error('Error fetching user profile:', error);
    return null;
  }

  // Handle new user case: Create a default profile
  if (!profile) {
    const defaultSubscription: Subscription = {
      status: 'trial',
      plan: 'monthly',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date().toISOString(),
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 day trial
      autoRenew: false,
      cancelAtPeriodEnd: false,
    };

    const defaultUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: 'user', // Default role for new users
      favorites: [],
      savedSearches: [],
      subscription: defaultSubscription,
      paymentHistory: [],
    };

    const { data: newProfile, error: newProfileError } = await supabase
      .from('profiles')
      .insert({
        id: defaultUser.id,
        email: defaultUser.email,
        role: defaultUser.role,
        favorites: defaultUser.favorites,
        saved_searches: defaultUser.savedSearches,
        subscription_status: defaultUser.subscription.status,
        subscription_plan: defaultUser.subscription.plan,
        subscription_start_date: defaultUser.subscription.startDate,
        subscription_next_billing_date: defaultUser.subscription.nextBillingDate,
        subscription_trial_end_date: defaultUser.subscription.trialEndDate,
        subscription_auto_renew: defaultUser.subscription.autoRenew,
        subscription_cancel_at_period_end: defaultUser.subscription.cancelAtPeriodEnd,
        payment_history: defaultUser.paymentHistory,
      })
      .select()
      .single();

    if (newProfileError) {
      console.error('Error creating default profile for new user:', newProfileError);
      return null;
    }

    return defaultUser;
  }

  // Map Supabase profile data to User interface
  const userSubscription: Subscription = {
    status: profile.subscription_status || 'trial',
    plan: profile.subscription_plan || 'monthly',
    startDate: profile.subscription_start_date || new Date().toISOString(),
    nextBillingDate: profile.subscription_next_billing_date || new Date().toISOString(),
    trialEndDate: profile.subscription_trial_end_date || new Date().toISOString(),
    autoRenew: profile.subscription_auto_renew || false,
    cancelAtPeriodEnd: profile.subscription_cancel_at_period_end || false,
  };

  const userPaymentHistory: PaymentHistoryItem[] = profile.payment_history || [];

  const appUser: User = {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    role: profile.role || 'user',
    favorites: profile.favorites || [],
    savedSearches: profile.saved_searches || [],
    subscription: userSubscription,
    paymentHistory: userPaymentHistory,
    billingAddress: profile.billing_address || undefined,
  };

  return appUser;
}

// Fetching all user profiles (for admin view)
export const fetchAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, favorites, saved_searches, subscription_status, subscription_plan, subscription_start_date, subscription_next_billing_date, subscription_trial_end_date, subscription_auto_renew, subscription_cancel_at_period_end, payment_history, billing_address');

  if (error) {
    console.error('Error fetching all users:', error);
    return [];
  }

  return (data as any[]).map(profile => {
    const userSubscription: Subscription = {
      status: profile.subscription_status || 'trial',
      plan: profile.subscription_plan || 'monthly',
      startDate: profile.subscription_start_date || new Date().toISOString(),
      nextBillingDate: profile.subscription_next_billing_date || new Date().toISOString(),
      trialEndDate: profile.subscription_trial_end_date || new Date().toISOString(),
      autoRenew: profile.subscription_auto_renew || false,
      cancelAtPeriodEnd: profile.subscription_cancel_at_period_end || false,
    };

    const userPaymentHistory: PaymentHistoryItem[] = profile.payment_history || [];

    return {
      id: profile.id,
      email: profile.email || '',
      role: profile.role || 'user',
      favorites: profile.favorites || [],
      savedSearches: profile.saved_searches || [],
      subscription: userSubscription,
      paymentHistory: userPaymentHistory,
      billingAddress: profile.billing_address || undefined,
    };
  });
};

// Function to update a user's profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  const supabaseUpdates: any = {
    email: updates.email,
    role: updates.role,
    favorites: updates.favorites,
    saved_searches: updates.savedSearches,
    billing_address: updates.billingAddress,
  };

  if (updates.subscription) {
    supabaseUpdates.subscription_status = updates.subscription.status;
    supabaseUpdates.subscription_plan = updates.subscription.plan;
    supabaseUpdates.subscription_start_date = updates.subscription.startDate;
    supabaseUpdates.subscription_next_billing_date = updates.subscription.nextBillingDate;
    supabaseUpdates.subscription_trial_end_date = updates.subscription.trialEndDate;
    supabaseUpdates.subscription_auto_renew = updates.subscription.autoRenew;
    supabaseUpdates.subscription_cancel_at_period_end = updates.subscription.cancelAtPeriodEnd;
  }
  if (updates.paymentHistory) {
    supabaseUpdates.payment_history = updates.paymentHistory;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(supabaseUpdates)
    .eq('id', userId)
    .select('id, email, role, favorites, saved_searches, subscription_status, subscription_plan, subscription_start_date, subscription_next_billing_date, subscription_trial_end_date, subscription_auto_renew, subscription_cancel_at_period_end, payment_history, billing_address')
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  if (data) {
    const userSubscription: Subscription = {
      status: data.subscription_status || 'trial',
      plan: data.subscription_plan || 'monthly',
      startDate: data.subscription_start_date || new Date().toISOString(),
      nextBillingDate: data.subscription_next_billing_date || new Date().toISOString(),
      trialEndDate: data.subscription_trial_end_date || new Date().toISOString(),
      autoRenew: data.subscription_auto_renew || false,
      cancelAtPeriodEnd: data.subscription_cancel_at_period_end || false,
    };

    const userPaymentHistory: PaymentHistoryItem[] = data.payment_history || [];

    return {
      id: data.id,
      email: data.email || '',
      role: data.role || 'user',
      favorites: data.favorites || [],
      savedSearches: data.saved_searches || [],
      subscription: userSubscription,
      paymentHistory: userPaymentHistory,
      billingAddress: data.billing_address || undefined,
    };
  }
  return null;
};