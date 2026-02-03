
import React, { useState } from 'react';
import { SiteConfig } from '../../types';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignup: () => void;
  config: SiteConfig;
}

export const LoginPage: React.FC<LoginPageProps> = ({ config, onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Notify app state of login completion with credentials
    onLogin(email, password);

    // No direct redirection here, App.tsx handles it after successful login
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-10">
          <img src={config.logoUrl} alt={config.brandName} className="h-24 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900">{config.loginHeadline}</h1>
          <p className="text-slate-500 mt-2 lowercase">{config.loginSubheadline}</p>
        </div>

        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="rounded text-red-600" defaultChecked />
              Remember me
            </label>
            <a href="#" className="text-red-600 font-bold">Forgot Password?</a>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:bg-red-700 transition transform hover:-translate-y-1"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <button onClick={onNavigateToSignup} className="text-red-600 font-bold ml-1 hover:underline lowercase">create account</button>
        </div>
      </div>
    </div>
  );
};
