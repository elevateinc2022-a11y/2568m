
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  view?: string;
  provinceCode?: string;
  municipality?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (view: any, options?: { province?: string; municipality?: string }) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg 
              className="w-3 h-3 text-slate-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.isActive ? (
            <span className="font-medium text-slate-400 select-none">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => {
                onNavigate(item.view, { 
                  province: item.provinceCode, 
                  municipality: item.municipality 
                });
              }}
              className="hover:text-red-600 transition-colors duration-200"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
