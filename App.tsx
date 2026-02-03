
import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { Hero } from './components/Home/Hero';
import { ProvinceStrip } from './components/Home/ProvinceStrip';
import { FeaturedListings } from './components/Home/FeaturedListings';
import { ProvinceGrid } from './components/Home/ProvinceGrid';
import { ListingsPage } from './components/Pages/ListingsPage';
import { PropertyDetailPage } from './components/Pages/PropertyDetailPage';
import { EducationPage } from './components/Pages/EducationPage';
import { FAQPage } from './components/Pages/FAQPage';
import { AdminPage } from './components/Pages/AdminPage';
import { AdminBiddingPackages } from './components/Pages/AdminBiddingPackages';
import { AdminSubscriptions } from './components/Pages/AdminSubscriptions';
import { AdminUploadPackages } from './components/Pages/AdminUploadPackages';
import { LoginPage } from './components/Pages/LoginPage';
import { CreateAccountPage } from './components/Pages/CreateAccountPage';
import { ContactPage } from './components/Pages/ContactPage';
import { CareersPage } from './components/Pages/CareersPage';
import { MapPage } from './components/Pages/MapPage';
import { CalendarPage } from './components/Pages/CalendarPage';
import { AboutPage } from './components/Pages/AboutPage';
import { PrivacyPolicyPage } from './components/Pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './components/Pages/TermsConditionsPage';
import { CookiePolicyPage } from './components/Pages/CookiePolicyPage';
import { DisclaimerPage } from './components/Pages/DisclaimerPage';
import { ProvincesPage } from './components/Pages/ProvincesPage';
import { PaymentPage } from './components/Pages/PaymentPage';
import { AccountDashboard } from './components/Pages/Account/AccountDashboard';
import { BillingPage } from './components/Pages/Account/BillingPage';
import { PaymentHistoryPage } from './components/Pages/Account/PaymentHistoryPage';
import { SubscriptionPaymentPage } from './components/Pages/SubscriptionPaymentPage';
import { Breadcrumbs, BreadcrumbItem } from './components/UI/Breadcrumbs';
import { User, Property, Jurisdiction, SiteConfig, PropertyStatus, SubscriptionPlan, EducationArticle, FAQItem, LegalContent, AboutContent } from './types';
import { storage } from './services/storage';

export type AdminTab = 'inventory' | 'jurisdictions' | 'faqs' | 'education' | 'about' | 'settings' | 'legal';

export default function App() {
  const [view, setView] = useState<'home' | 'listings' | 'sold-listings' | 'details' | 'education' | 'faq' | 'admin' | 'admin-packages' | 'admin-subscriptions' | 'admin-upload-packages' | 'login' | 'signup' | 'contact' | 'careers' | 'map' | 'calendar' | 'about' | 'privacy' | 'terms' | 'cookie' | 'disclaimer' | 'provinces' | 'payment' | 'account-dashboard' | 'account-billing' | 'account-history' | 'subscription-payment'>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('inventory');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [signupPlan, setSignupPlan] = useState<SubscriptionPlan>('monthly');
  const [signupEmail, setSignupEmail] = useState('');
  
  const [user, setUser] = useState<User | null>(null);

  // Global Application State (Master Data)
  const [properties, setProperties] = useState<Property[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(storage.getSiteConfig());
  const [legalContent, setLegalContent] = useState<LegalContent>(storage.getLegalContent());
  const [aboutContent, setAboutContent] = useState<AboutContent>(storage.getAboutContent());

  const [initialProvinceFilter, setInitialProvinceFilter] = useState<string[]>([]);
  const [initialMunicipalityFilter, setInitialMunicipalityFilter] = useState<string[]>([]);
  const [initialStatusFilter, setInitialStatusFilter] = useState<PropertyStatus[]>([]);

  // Subscription Status Helper
  const isSubscribed = useMemo(() => {
    return user && (user.subscription.status === 'active' || user.role === 'admin');
  }, [user]);

  // Initial Load
  useEffect(() => {
    setProperties(storage.getProperties());
    setJurisdictions(storage.getJurisdictions());
    setArticles(storage.getArticles());
    setFaqs(storage.getFAQs());
    setSiteConfig(storage.getSiteConfig());
    setLegalContent(storage.getLegalContent());
    setAboutContent(storage.getAboutContent());
    
    const savedUser = storage.getUser();
    if (savedUser) {
       setUser(savedUser);
    }
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('taxsales_')) {
        setProperties(storage.getProperties());
        setJurisdictions(storage.getJurisdictions());
        setArticles(storage.getArticles());
        setFaqs(storage.getFAQs());
        setSiteConfig(storage.getSiteConfig());
        setLegalContent(storage.getLegalContent());
        setAboutContent(storage.getAboutContent());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectView = params.get('redirect');
    const propertyId = params.get('propertyId');
    
    if (redirectView === 'details' && propertyId) {
      handleNavigate('details', { propId: propertyId });
    }
  }, []);

  // Route Guarding Effect
  useEffect(() => {
    const paidViews = ['listings', 'calendar'];
    const accountViews = ['account-dashboard', 'account-billing', 'account-history'];
    const adminViews = ['admin', 'admin-packages', 'admin-subscriptions', 'admin-upload-packages'];

    if ((paidViews.includes(view) || accountViews.includes(view) || adminViews.includes(view)) && !user) {
      handleNavigate('login');
      return;
    }

    if (paidViews.includes(view) && user && !isSubscribed) {
      handleNavigate('subscription-payment');
      return;
    }

    if (adminViews.includes(view) && user?.role !== 'admin') {
      handleNavigate('home');
      return;
    }
  }, [view, user, isSubscribed]);

  const handleNavigate = (newView: any, options?: string | { propId?: string; province?: string; municipality?: string; status?: PropertyStatus[]; redirect?: string; propertyId?: string; tab?: AdminTab; plan?: SubscriptionPlan; email?: string }) => {
    let propId: string | undefined;
    let province: string | undefined;
    let municipality: string | undefined;
    let status: PropertyStatus[] | undefined;

    if (typeof options === 'string') {
      propId = options;
    } else if (options) {
      propId = options.propId || options.propertyId;
      province = options.province;
      municipality = options.municipality;
      status = options.status;
      if (options.tab) setAdminTab(options.tab);
      if (options.plan) setSignupPlan(options.plan);
      if (options.email) setSignupEmail(options.email);
    }

    // Permission check for details: If it's an active property, it's locked
    if (newView === 'details' && propId) {
      const target = properties.find(p => p.id === propId);
      if (target && target.status === 'Active' && !isSubscribed) {
        if (!user) {
          handleNavigate('login', { redirect: 'details', propertyId: propId });
          return;
        } else {
          handleNavigate('subscription-payment');
          return;
        }
      }
    }

    // Direct redirection for top-level guarded routes
    if ((newView === 'listings' || newView === 'calendar') && !isSubscribed) {
      if (!user) {
        handleNavigate('login');
        return;
      } else {
        handleNavigate('subscription-payment');
        return;
      }
    }

    if (propId) setSelectedPropertyId(propId);

    if (newView === 'listings' || newView === 'sold-listings') {
      setInitialProvinceFilter(province ? [province] : []);
      setInitialMunicipalityFilter(municipality ? [municipality] : []);
      setInitialStatusFilter(status || []);
    } else if (newView !== 'details') {
      setInitialProvinceFilter([]);
      setInitialMunicipalityFilter([]);
      setInitialStatusFilter([]);
    }

    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleSelectProvince = (provinceCode: string) => {
    handleNavigate('listings', { province: provinceCode });
  };

  const handleLogin = () => {
    // Standard mock user with NO subscription to test guards
    const newUser: User = {
      id: 'user-001',
      email: 'investor@example.com',
      role: 'user',
      favorites: [],
      savedSearches: [],
      subscription: {
        status: 'expired',
        plan: 'monthly',
        startDate: new Date('2023-01-01').toISOString(),
        nextBillingDate: new Date('2023-02-01').toISOString(),
        trialEndDate: new Date('2023-01-01').toISOString(),
        autoRenew: false,
        cancelAtPeriodEnd: true
      },
      paymentHistory: []
    };
    
    // For "Admin Login" simulation if they type admin
    const isAdminUser = newUser.email.includes('admin');
    if (isAdminUser) {
      newUser.role = 'admin';
      newUser.subscription.status = 'active';
    }

    setUser(newUser);
    storage.updateUser(newUser);
    
    const params = new URLSearchParams(window.location.search);
    const redirectView = params.get('redirect');
    const propertyId = params.get('propertyId');

    if (redirectView === 'details' && propertyId) {
       handleNavigate('details', { propId: propertyId });
    } else if (isAdminUser) {
       handleNavigate('admin');
    } else {
       handleNavigate('account-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    storage.updateUser(null);
    handleNavigate('home');
  };

  const handleUpdateSubscription = (updates: Partial<User['subscription']>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      subscription: { ...user.subscription, ...updates }
    };
    setUser(updatedUser);
    storage.updateUser(updatedUser);
  };

  const handlePaymentSuccess = (plan: SubscriptionPlan) => {
    const planPrice = plan === 'monthly' ? 20.00 : 100.00;
    const now = new Date();
    const nextBilling = new Date();
    if (plan === 'monthly') {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    } else {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    }

    const baseUser = user || {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      email: signupEmail || 'new_subscriber@example.com',
      role: 'user',
      favorites: [],
      savedSearches: [],
      paymentHistory: []
    } as User;

    const updatedUser: User = {
      ...baseUser,
      subscription: {
        status: 'active',
        plan: plan,
        startDate: now.toISOString(),
        nextBillingDate: nextBilling.toISOString(),
        trialEndDate: now.toISOString(),
        autoRenew: true,
        cancelAtPeriodEnd: false
      },
      paymentHistory: [
        ...(baseUser.paymentHistory || []),
        { 
          id: `PH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, 
          date: now.toISOString(), 
          amount: planPrice, 
          plan: plan, 
          status: 'paid' 
        }
      ]
    };

    setUser(updatedUser);
    storage.updateUser(updatedUser);
    handleNavigate('account-dashboard');
  };

  const toggleFavorite = (id: string) => {
    if (!user) return;
    const isFavorite = user.favorites.includes(id);
    const newFavorites = isFavorite 
      ? user.favorites.filter(fid => fid !== id)
      : [...user.favorites, id];
    
    const updatedUser = { ...user, favorites: newFavorites };
    setUser(updatedUser);
    storage.updateUser(updatedUser);
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: siteConfig.brandName, view: 'home' }
    ];

    if (view === 'home') return [];

    const labels: Record<string, string> = {
      'about': 'About Us',
      'education': 'Education Hub',
      'faq': 'FAQs',
      'contact': 'Contact',
      'careers': 'Careers',
      'admin': 'Admin Dashboard',
      'admin-packages': 'Bidding Packages',
      'admin-subscriptions': 'Subscriber Database',
      'admin-upload-packages': 'Upload Packages',
      'login': 'Login',
      'signup': 'Create Account',
      'privacy': 'Privacy Policy',
      'terms': 'Terms & Conditions',
      'cookie': 'Cookie Policy',
      'disclaimer': 'Disclaimer',
      'map': 'Properties Map',
      'calendar': 'Sales Calendar',
      'account-dashboard': 'My Account',
      'account-billing': 'Billing Management',
      'account-history': 'Payment History',
      'subscription-payment': 'Subscription',
      'sold-listings': 'Sold Tax Sale Properties'
    };

    if (view === 'listings' || view === 'sold-listings') {
      items.push({ label: view === 'listings' ? 'tax sale properties' : 'sold tax sale properties', view: view });
    } else if (view === 'details') {
      items.push({ label: 'tax sale properties', view: 'listings' });
      items.push({ label: selectedPropertyId || 'Listing', isActive: true });
    } else {
      items.push({ label: labels[view] || view, isActive: true });
    }

    return items;
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <>
            <Hero 
              config={siteConfig} 
              properties={properties.slice(0, 3)} 
              onViewDetails={(id) => handleNavigate('details', id)}
              onViewAll={() => handleNavigate('listings')}
            />
            <ProvinceStrip 
              properties={properties} 
              jurisdictions={jurisdictions} 
              onSelectProvince={handleSelectProvince} 
            />

            {/* Mission Statement Section */}
            <section className="py-16 bg-white">
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">
                  <span className="text-red-600">{siteConfig.brandName} {siteConfig.brandAccent}</span> is your trusted gateway to the Canadian tax sale market.
                </h2>
                <div className="space-y-6 text-slate-600 text-lg font-medium leading-relaxed">
                  <p>
                    {aboutContent.introduction.split('\n')[0]}
                  </p>
                  <p>
                    From sealed-bid tenders to live public auctions, our tools simplify your search by location, 
                    property class, and unique features like waterfront access or industrial zoning. We provide the 
                    clarity you need to invest with absolute confidence.
                  </p>
                </div>
                <div className="mt-10 pt-10 border-t border-slate-100">
                  <button 
                    onClick={() => handleNavigate('about')}
                    className="text-slate-900 font-black italic hover:text-red-600 transition-colors flex items-center gap-2 group"
                  >
                    Read More About Our Mission
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mt-2">The Gold Standard In Tax Sale Data</p>
                </div>
              </div>
            </section>

            {/* How Tax Sales Work Section */}
            <section className="py-24 bg-white">
              <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">How Tax Sales Work</h2>
                  <div className="w-16 h-1 bg-red-600 mx-auto"></div>
                </div>

                <div className="space-y-12">
                  <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">1</div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase mb-3">Delinquent Municipal Taxes</h3>
                      <p className="text-slate-500 text-base leading-relaxed font-medium">
                        When property owners fail to meet their municipal tax obligations over several years, the city issues 
                        formal notices. If the debt remains unpaid, the municipality initiates the legal recovery process.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">2</div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase mb-3">Public Sale Proceedings</h3>
                      <p className="text-slate-500 text-base leading-relaxed font-medium">
                        The municipality offers the property to the public via a <span className="text-slate-900 font-bold">Live Auction</span> or <span className="text-slate-900 font-bold">Sealed-Bid Tender</span>. The 
                        minimum bid usually represents only the unpaid taxes, interest, and administrative costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">3</div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase mb-3">High-Equity Acquisition</h3>
                      <p className="text-slate-500 text-base leading-relaxed font-medium">
                        Successful bidders can acquire real estate at a fraction of its market value. This recovery process 
                        ensures municipalities receive vital tax revenue while creating massive wealth-building 
                        opportunities for investors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-20 text-center">
                  <button 
                    onClick={() => handleNavigate('listings')}
                    className="px-12 py-5 bg-[#1a202c] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-black transition-all shadow-xl active:scale-95"
                  >
                    Explore Current Listings
                  </button>
                </div>
              </div>
            </section>
          </>
        );
      case 'listings':
        return (
          <ListingsPage 
            properties={properties} 
            jurisdictions={jurisdictions}
            user={user}
            onViewDetails={(id) => handleNavigate('details', id)}
            onToggleFavorite={toggleFavorite}
            initialProvinceFilter={initialProvinceFilter}
            initialMunicipalityFilter={initialMunicipalityFilter}
            initialStatusFilter={initialStatusFilter}
            isSubscribed={isSubscribed}
          />
        );
      case 'sold-listings':
        return (
          <ListingsPage 
            properties={properties} 
            jurisdictions={jurisdictions}
            user={user}
            onViewDetails={(id) => handleNavigate('details', id)}
            onToggleFavorite={toggleFavorite}
            initialProvinceFilter={initialProvinceFilter}
            initialMunicipalityFilter={initialMunicipalityFilter}
            initialStatusFilter={['Sold']}
            isSubscribed={true} 
            pageTitle="Sold Tax Sale Properties"
          />
        );
      case 'details':
        const selectedProp = properties.find(p => p.id === selectedPropertyId);
        return selectedProp ? (
          <PropertyDetailPage 
            property={selectedProp} 
            jurisdictions={jurisdictions} 
            user={user}
            onNavigate={handleNavigate}
            isSubscribed={isSubscribed}
          />
        ) : <div className="p-20 text-center font-bold text-xl">Listing not found</div>;
      case 'account-dashboard':
        return user ? <AccountDashboard user={user} onNavigate={handleNavigate} /> : null;
      case 'account-billing':
        return user ? <BillingPage user={user} onUpdateSubscription={handleUpdateSubscription} /> : null;
      case 'account-history':
        return user ? <PaymentHistoryPage user={user} /> : null;
      case 'subscription-payment':
        return <SubscriptionPaymentPage user={user} config={siteConfig} onPaymentSuccess={handlePaymentSuccess} onNavigate={handleNavigate} initialPlan={signupPlan} initialEmail={signupEmail} />;
      case 'login':
        return <LoginPage config={siteConfig} onLogin={handleLogin} onNavigateToSignup={() => handleNavigate('signup')} />;
      case 'signup':
        return <CreateAccountPage config={siteConfig} onSignup={(plan, email) => handleNavigate('subscription-payment', { plan, email })} onNavigateToLogin={() => handleNavigate('login')} onNavigateToContact={() => handleNavigate('contact')} />;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminPage 
            properties={properties} 
            setProperties={setProperties} 
            jurisdictions={jurisdictions}
            setJurisdictions={setJurisdictions}
            siteConfig={siteConfig}
            setSiteConfig={setSiteConfig}
            onNavigate={handleNavigate}
            activeTab={adminTab}
            setActiveTab={setAdminTab}
          />
        ) : <div className="p-20 text-center">Access Restricted</div>;
      case 'admin-packages':
        return user?.role === 'admin' ? (
          <AdminBiddingPackages 
            user={user} 
            onNavigate={handleNavigate} 
            currentTab="admin-packages"
          />
        ) : <div className="p-20 text-center">Unauthorized</div>;
      case 'admin-subscriptions':
        return user?.role === 'admin' ? (
          <AdminSubscriptions 
            onNavigate={handleNavigate} 
            currentTab="admin-subscriptions"
          />
        ) : <div className="p-20 text-center">Unauthorized</div>;
      case 'admin-upload-packages':
        return user?.role === 'admin' ? (
          <AdminUploadPackages 
            user={user}
            jurisdictions={jurisdictions}
            onNavigate={handleNavigate}
            currentTab="admin-upload-packages"
          />
        ) : <div className="p-20 text-center">Unauthorized</div>;
      case 'faq':
        return <FAQPage faqs={faqs} onNavigateContact={() => handleNavigate('contact')} onNavigateEducation={() => handleNavigate('education')} />;
      case 'contact':
        return <ContactPage />;
      case 'careers':
        return <CareersPage />;
      case 'calendar':
        return <CalendarPage properties={properties} onViewDetails={(id) => handleNavigate('details', id)} isSubscribed={isSubscribed} />;
      case 'map':
        return <MapPage properties={properties} onViewDetails={(id) => handleNavigate('details', id)} isSubscribed={isSubscribed} />;
      case 'education':
        return <EducationPage articles={articles} />;
      case 'about':
        return <AboutPage content={aboutContent} />;
      case 'privacy':
        return <PrivacyPolicyPage content={legalContent.privacyPolicy} />;
      case 'terms':
        return <TermsConditionsPage content={legalContent.termsConditions} />;
      case 'cookie':
        return <CookiePolicyPage content={legalContent.cookiePolicy} />;
      case 'disclaimer':
        return <DisclaimerPage content={legalContent.disclaimer} />;
      case 'provinces':
        return <ProvincesPage jurisdictions={jurisdictions} properties={properties} onNavigateLocation={(province, munc) => handleNavigate('listings', { province, municipality: munc })} />;
      case 'payment':
        return selectedPropertyId ? (
          <PaymentPage 
            propertyId={selectedPropertyId} 
            onDownloadStart={() => alert('Download triggered')} 
            onNavigateHome={() => handleNavigate('listings')} 
          />
        ) : null;
      default:
        return <Hero config={siteConfig} properties={properties} onViewDetails={(id) => handleNavigate('details', id)} onViewAll={() => handleNavigate('listings')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Navbar 
        currentView={view} 
        onNavigate={handleNavigate} 
        user={user}
        config={siteConfig}
        onLogout={handleLogout}
        isSubscribed={isSubscribed}
      />
      <main className="flex-grow">
        {view !== 'home' && (
          <Breadcrumbs items={getBreadcrumbs()} onNavigate={handleNavigate} />
        )}
        {renderView()}
      </main>
      <Footer 
        config={siteConfig}
        jurisdictions={jurisdictions}
        properties={properties}
        onNavigateAbout={() => handleNavigate('about')} 
        onNavigatePrivacy={() => handleNavigate('privacy')}
        onNavigateTerms={() => handleNavigate('terms')}
        onNavigateCookie={() => handleNavigate('cookie')}
        onNavigateDisclaimer={() => handleNavigate('disclaimer')}
        onNavigateContact={() => handleNavigate('contact')} 
        onNavigateCareers={() => handleNavigate('careers')} 
        onNavigateFAQ={() => handleNavigate('faq')}
        onNavigateEducation={() => handleNavigate('education')}
        onNavigateProvinces={() => handleNavigate('provinces')}
        onNavigateActiveListings={() => handleNavigate('listings', { status: ['Active'] })}
        onNavigateLocation={(province, municipality) => handleNavigate('listings', { province, municipality })}
      />
    </div>
  );
}
