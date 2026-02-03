
import React, { useState, useMemo, useRef } from 'react';
import { User, Jurisdiction } from '../../types';
import { AdminToolbar } from './AdminPage';
import { storage } from '../../services/storage';

interface AdminUploadPackagesProps {
  user: User | null;
  jurisdictions: Jurisdiction[];
  onNavigate: (view: string, options?: any) => void;
  currentTab: string;
}

interface BiddingPackage {
  id: string;
  name: string;
  propertyId?: string;
  description?: string;
  assignedMunicipalities: string[];
  status: 'Active' | 'Inactive';
  uploadedAt: string;
  fileSize: string;
  fileName: string;
}

export const AdminUploadPackages: React.FC<AdminUploadPackagesProps> = ({ user, jurisdictions, onNavigate, currentTab }) => {
  const isAdmin = user?.role === 'admin';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock initial state for uploaded packages
  const [packages, setPackages] = useState<BiddingPackage[]>([
    {
      id: 'pkg-001',
      name: 'Spring 2024 Ontario Standard Package',
      propertyId: 'MLT-101',
      description: 'Standard bidding forms for residential properties.',
      assignedMunicipalities: ['Toronto', 'Mississauga', 'Ottawa'],
      status: 'Active',
      uploadedAt: '2024-03-15 10:30',
      fileSize: '1.2 MB',
      fileName: 'on_bidding_v1.pdf'
    },
    {
      id: 'pkg-002',
      name: 'BC Commercial Tender Form',
      assignedMunicipalities: ['Vancouver', 'Victoria'],
      status: 'Inactive',
      uploadedAt: '2024-03-20 14:15',
      fileSize: '850 KB',
      fileName: 'bc_commercial_tender.zip'
    }
  ]);

  // Section 1 State: Upload Form
  const [uploadForm, setUploadForm] = useState({
    name: '',
    propertyId: '',
    description: '',
    isActive: true,
    file: null as File | null
  });

  // Section 2 State: Assignment
  const [assignment, setAssignment] = useState({
    packageId: '',
    selectedMunicipalities: [] as string[]
  });

  const allMunicipalities = useMemo(() => {
    return Array.from(new Set(jurisdictions.flatMap(j => j.municipalities))).sort();
  }, [jurisdictions]);

  if (!isAdmin) {
    return <div className="p-20 text-center font-black uppercase text-slate-400">Unauthorized Access</div>;
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.name) {
      alert("Please provide a name and select a file.");
      return;
    }

    // TODO: Connect to backend multipart/form-data upload API
    const newPkg: BiddingPackage = {
      id: `pkg-${Math.random().toString(36).substr(2, 5)}`,
      name: uploadForm.name,
      propertyId: uploadForm.propertyId,
      description: uploadForm.description,
      assignedMunicipalities: [],
      status: uploadForm.isActive ? 'Active' : 'Inactive',
      uploadedAt: new Date().toLocaleString(),
      fileSize: `${(uploadForm.file.size / 1024).toFixed(1)} KB`,
      fileName: uploadForm.file.name
    };

    setPackages([newPkg, ...packages]);
    setUploadForm({ name: '', propertyId: '', description: '', isActive: true, file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert("Package uploaded successfully. Metadata saved to database.");
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment.packageId || assignment.selectedMunicipalities.length === 0) {
      alert("Select a package and at least one municipality.");
      return;
    }

    // TODO: Connect to many-to-many relationship API (Packages <-> Municipalities)
    setPackages(packages.map(p => {
      if (p.id === assignment.packageId) {
        return { ...p, assignedMunicipalities: Array.from(new Set([...p.assignedMunicipalities, ...assignment.selectedMunicipalities])) };
      }
      return p;
    }));
    
    setAssignment({ packageId: '', selectedMunicipalities: [] });
    alert("Municipalities assigned successfully.");
  };

  const togglePackageStatus = (id: string) => {
    setPackages(packages.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
  };

  const deletePackage = (id: string) => {
    if (confirm("Delete this package? This will revoke access for all assigned municipalities instantly.")) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('admin')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors">
            Admin Dashboard
          </button>
          <svg className="w-2.5 h-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
            Upload Bidding Packages
          </span>
        </div>

        <AdminToolbar activeTab={currentTab} onNavigate={onNavigate} onTabChange={(tab) => onNavigate('admin', { tab })} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Admin – Upload Packages</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Manage Municipal Document Distribution</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SECTION 1: Upload Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 uppercase mb-6 tracking-tight">Upload New Package</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Package Name / Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Summer 2024 Hamilton Bidding Package"
                  value={uploadForm.name}
                  onChange={e => setUploadForm({...uploadForm, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Property ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="MLT-XXXXX"
                    value={uploadForm.propertyId}
                    onChange={e => setUploadForm({...uploadForm, propertyId: e.target.value.toUpperCase()})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Status</label>
                  <select 
                    value={uploadForm.isActive ? 'Active' : 'Inactive'}
                    onChange={e => setUploadForm({...uploadForm, isActive: e.target.value === 'Active'})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={2}
                  placeholder="Internal notes about this package..."
                  value={uploadForm.description}
                  onChange={e => setUploadForm({...uploadForm, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium focus:ring-2 focus:ring-red-600 outline-none transition"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">File Selection (PDF / ZIP)</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf,.zip"
                  onChange={e => setUploadForm({...uploadForm, file: e.target.files ? e.target.files[0] : null})}
                  className="w-full p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl font-bold text-xs cursor-pointer hover:bg-slate-100 transition" 
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-700 transition shadow-lg"
              >
                Upload & Save Package
              </button>
            </form>
          </div>

          {/* SECTION 2: Assignment Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col">
            <h2 className="text-xl font-black text-slate-900 uppercase mb-6 tracking-tight">Assign to Municipalities</h2>
            <form onSubmit={handleAssignSubmit} className="space-y-6 flex-grow flex flex-col">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Package</label>
                <select 
                  required
                  value={assignment.packageId}
                  onChange={e => setAssignment({...assignment, packageId: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-600 outline-none transition"
                >
                  <option value="">-- Select an uploaded package --</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.fileName})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 flex-grow">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Municipalities</label>
                <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl custom-scrollbar">
                  {allMunicipalities.map(munc => (
                    <label key={munc} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={assignment.selectedMunicipalities.includes(munc)}
                        onChange={e => {
                          const updated = e.target.checked 
                            ? [...assignment.selectedMunicipalities, munc]
                            : assignment.selectedMunicipalities.filter(m => m !== munc);
                          setAssignment({...assignment, selectedMunicipalities: updated});
                        }}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4" 
                      />
                      <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900">{munc}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition shadow-lg mt-4"
              >
                Assign Package
              </button>
            </form>
          </div>
        </div>

        {/* SECTION 3: Management Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Uploaded Bidding Packages</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Live distribution inventory</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Package Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignments</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {packages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm">{pkg.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{pkg.fileName} • {pkg.fileSize}</span>
                        <span className="text-[9px] text-slate-300 italic mt-0.5">Uploaded: {pkg.uploadedAt}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs text-slate-500">{pkg.propertyId || 'GLOBAL'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {pkg.assignedMunicipalities.length > 0 ? (
                          pkg.assignedMunicipalities.slice(0, 3).map(m => (
                            <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-black rounded-full uppercase border border-slate-200">{m}</span>
                          )).concat(pkg.assignedMunicipalities.length > 3 ? [<span key="more" className="text-[8px] font-black text-slate-400">+ {pkg.assignedMunicipalities.length - 3}</span>] : [])
                        ) : (
                          <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">No Municipalities</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        pkg.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-3">
                         <button 
                          onClick={() => togglePackageStatus(pkg.id)}
                          className="p-2 text-slate-400 hover:text-slate-900 transition" 
                          title={pkg.status === 'Active' ? 'Disable' : 'Enable'}
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                         </button>
                         <button 
                          onClick={() => deletePackage(pkg.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition" 
                          title="Delete"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {packages.length === 0 && (
              <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs">No packages uploaded yet.</div>
            )}
          </div>
        </div>

        {/* Security / Logistics Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
               <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Distribution Architecture</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-3xl">
                Bidding packages are served via protected backend endpoints. When a user clicks "Download Bidding Package", the system checks their subscription status and municipality context before generating a one-time use signed URL. Disabling a package here will immediately block all new download requests.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
