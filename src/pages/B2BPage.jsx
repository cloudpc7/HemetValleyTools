import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../Providers/ThemeContext';
import { 
  updateB2bDraft, 
  clearB2bDraft,
  setB2bIsSubmitting,
  setB2bFormSubmitted,
  setB2bActiveStep,
  setB2bUploadedFiles,
  addB2bUploadedFiles,
  updateB2bFileProgress,
  removeB2bUploadedFile,
  setB2bIsDragging
} from '../redux/slices/formDraftsSlice';
import { submitB2BApplicationThunk } from '../redux/slices/data.slice';
import { 
  Building, 
  Wrench, 
  Briefcase, 
  DollarSign, 
  Truck, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Award, 
  Clock, 
  ChevronRight, 
  Plus, 
  AlertTriangle,
  Info,
  Package,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

import Navbar from '../ui/components/Navbar';
import Footer from '../ui/components/Footer';
import HemetValleyLogo from '../ui/components/HemetValleyLogo';
import SEO from '../ui/components/SEO';

const B2BPage = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  
  // --- FORM STATE (REDUX) ---
  const {
    b2bForm,
    b2bIsSubmitting: isSubmitting,
    b2bFormSubmitted: formSubmitted,
    b2bActiveStep: activeStep,
    b2bUploadedFiles: uploadedFiles,
    b2bIsDragging: isDragging
  } = useSelector((state) => state.formDrafts);
  
  const fileInputRef = useRef(null);

  // Scroll to section helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- INTERACTIVE FILE UPLOADER SIMULATOR ---
  const handleFilesAdded = (filesList) => {
    const newFiles = Array.from(filesList).map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2), // Size in MB
      progress: 0,
      status: 'uploading'
    }));

    dispatch(addB2bUploadedFiles(newFiles));

    // Simulate progress animation for each added file
    newFiles.forEach(file => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          dispatch(updateB2bFileProgress({ name: file.name, progress: 100, status: 'completed' }));
        } else {
          dispatch(updateB2bFileProgress({ name: file.name, progress: currentProgress }));
        }
      }, 300);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dispatch(setB2bIsDragging(true));
  };

  const handleDragLeave = () => {
    dispatch(setB2bIsDragging(false));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dispatch(setB2bIsDragging(false));
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleFileSelectChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(e.target.files);
    }
  };

  const removeUploadedFile = (fileName) => {
    dispatch(removeB2bUploadedFile(fileName));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerFileInput();
    }
  };

  // --- SUBMIT B2B CONTRACTOR APPLICATION ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!b2bForm.companyName || !b2bForm.contactName || !b2bForm.phone || !b2bForm.email) {
      alert('Please fill out all required commercial contact fields.');
      return;
    }

    dispatch(setB2bIsSubmitting(true));
    try {
      const fileNames = uploadedFiles.map(file => file.name);
      await dispatch(submitB2BApplicationThunk({
        ...b2bForm,
        uploadedFiles: fileNames
      })).unwrap();
      dispatch(setB2bFormSubmitted(true));
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      dispatch(setB2bIsSubmitting(false));
    }
  };

  // Onboarding Step Content Details
  const onboardingStepsData = [
    {
      id: 1,
      title: "Commercial Application",
      badge: "Step 01",
      icon: <FileText className="w-5 h-5" />,
      desc: "Submit your basic company information, trade classification, and anticipated equipment fleet or core tooling needs online or via our printed sheet.",
      details: [
        "No complex legal setup required to draft a quote",
        "Ability to upload blueprints or material lists directly",
        "Includes rapid assessment of standard consumable needs"
      ]
    },
    {
      id: 2,
      title: "Underwriting & Credit Approval",
      badge: "Step 02",
      icon: <Building className="w-5 h-5" />,
      desc: "Our trade financing desk reviews your commercial credit history and business details to structure custom Net-30 invoicing parameters.",
      details: [
        "Rapid underwrite turnaround under 4 hours",
        "Net-30 credit terms tailored for high-volume jobs",
        "Electronic signature setup for rapid dispatch"
      ]
    },
    {
      id: 3,
      title: "Direct Account Dispatch",
      badge: "Step 03",
      icon: <Briefcase className="w-5 h-5" />,
      desc: "Begin securing tools, reserving blades, and booking on-site deliveries using specialized B2B codes, custom reps, and prioritized service queues.",
      details: [
        "Immediate allocation of a dedicated account specialist",
        "Direct access to wholesale pricing brackets and safety segments",
        "First priority on heavy-equipment yard reservations"
      ]
    }
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <SEO 
        title="Commercial B2B Pro Portal | Contractor Net-30 Credit & Bulk Bids | Hemet Valley Tools"
        description="Join Hemet Valley Tools Pro Program. Apply for Net-30 corporate credit lines, unlock bulk commercial bids, and upload architectural blueprints for customized supply pricing."
        keywords="B2B program, contractor account, Net-30 credit line, commercial bulk discount, tool credit Hemet, blueprint pricing"
      />
      
      {/* Navbar with B2B highlighted */}
      <Navbar activePage="b2b" />

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#0F0F0F] to-[#050505] py-16 lg:py-24">
        {/* Background Grids */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>

        {/* Photoshop watermark logo in background */}
        <div className="absolute right-4 lg:right-16 bottom-4 lg:bottom-8 pointer-events-none z-0 select-none">
          <HemetValleyLogo className="w-[20rem] h-[20rem] lg:w-[35rem] lg:h-[35rem]" watermark={true} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold mb-6">
            <Building className="w-4 h-4" /> B2B Commercial &amp; Wholesale Division
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-header uppercase leading-none tracking-tight text-white mb-6">
            Priority Service<br />
            For <span className="text-amber-500">The Valley's Pros</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 font-light max-w-3xl leading-relaxed mb-8">
            Keep your crews operational, your timelines locked, and your margins secured. We support Inland Empire builders with commercial Net-30 credit terms, rapid yard-to-site machinery delivery, and specialized high-volume supply brackets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => scrollToSection('b2b-application-portal')}
              className="bg-amber-500 text-black hover:bg-white hover:text-black font-header uppercase tracking-wider font-bold py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer"
            >
              Open B2B Account <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollToSection('blueprint-upload-zone')}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-header uppercase tracking-wider font-bold py-4 px-8 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-amber-500" /> Submit Blueprint / Bid Specs
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* --- SECTION 1: THE B2B ADVANTAGE VALUE GRID --- */}
        <section className="mb-28 text-left">
          <div className="text-left mb-16 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Engineered For Contractors</span>
            <h2 className="text-3xl sm:text-4xl font-black font-header uppercase text-white mt-1">The Commercial Advantage</h2>
            <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed">
              We aren't a national retail box store. Hemet Valley Tools delivers personalized technical support, specialized segment sourcing, and concrete support agreements designed for heavy field environments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Advantage 1 */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300"></div>
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-header uppercase tracking-wider text-white mb-3">Commercial Credit</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Consolidate your tooling, repairs, and rentals into a unified Net-30 commercial credit account with flexible online invoices.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 mt-6 block">Net-30 Options</span>
            </div>

            {/* Advantage 2 */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300"></div>
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-header uppercase tracking-wider text-white mb-3">Priority Site Delivery</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Avoid downtime. We deliver heavy compaction plates, masonry saws, and materials directly to your active yard or Inland Empire site.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 mt-6 block">Direct-To-Site</span>
            </div>

            {/* Advantage 3 */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300"></div>
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-header uppercase tracking-wider text-white mb-3">Volume Bulk Rates</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Take advantage of substantial bulk-tier pricing on standard consumables like abrasive wheels, safety blades, core bits, and safety gear.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 mt-6 block">Tiered Margins</span>
            </div>

            {/* Advantage 4 */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-300 relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300"></div>
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-header uppercase tracking-wider text-white mb-3">Dedicated Accounts</h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Work directly with a designated industry professional who handles your bids, custom sourcing, and rapid workshop repairs.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 mt-6 block">Personal Representative</span>
            </div>

          </div>
        </section>

        {/* --- SECTION 2: FLEET & SUPPLY AVAILABILITY --- */}
        <section className="py-20 border-y border-zinc-850 mb-28 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 pointer-events-none opacity-5">
            <HemetValleyLogo className="w-96 h-96" watermark={true} />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
                <ShieldCheck className="w-4 h-4" /> Ready-to-Haul Stock Integrity
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-header uppercase text-white leading-none">
                Heavy-Duty Brands &amp;<br />
                <span className="text-amber-500">In-Stock Commitments</span>
              </h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                When you are bidding on government contracts or municipal projects, tool reliability and consumable supply levels can make or break your bid. We maintain dedicated high-volume counts of professional-grade tools and parts, so you don't wait on backorders.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => scrollToSection('b2b-application-portal')}
                  className="px-6 py-3 border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-black font-header uppercase tracking-wider text-xs font-bold transition-all duration-300"
                >
                  Verify Fleet Counts
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8 text-left">
              
              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Award className="w-5 h-5 shrink-0" />
                  <h4 className="text-base font-header uppercase tracking-wider font-bold">Consumable Guarantee</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  We guarantee same-day availability for critical contractors' accessories: diamond masonry blades (12" - 18"), high-capacity concrete core bits, concrete anchors, and rigging slings.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Package className="w-5 h-5 shrink-0" />
                  <h4 className="text-base font-header uppercase tracking-wider font-bold">Industrial Brands Only</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  We stock only heavy-duty tools from brands you trust, including Milwaukee M18/MX Fuel lines, Makita heavy-rotation tools, Bosch demolition line gear, Husqvarna cutting rigs, and Honda engine systems.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Clock className="w-5 h-5 shrink-0" />
                  <h4 className="text-base font-header uppercase tracking-wider font-bold">48-Hr Repair Priority</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Avoid letting tool failure cripple your workforce. B2B accounts are placed in a prioritized queue, securing a diagnostic complete and estimated cost under 24 hours.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Wrench className="w-5 h-5 shrink-0" />
                  <h4 className="text-base font-header uppercase tracking-wider font-bold">Custom Segment Sourcing</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Need a niche core bit with customized diamond bonds to boring through an unusual aggregate? Our team utilizes global networks to rapidly secure and deliver specialized tools.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* --- SECTION 3: INTERACTIVE STEP-BY-STEP ONBOARDING TRACKER --- */}
        <section className="mb-28 text-left">
          <div className="text-center md:text-left mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Frictionless Commercial Setup</span>
            <h2 className="text-3xl font-black font-header uppercase text-white mt-1">Direct Contractor Onboarding Flow</h2>
            <p className="text-zinc-400 text-sm mt-2 font-light max-w-xl">
              Setting up your commercial Net-30 account is designed to be as fast as possible. Click on the milestones below to see required checkpoints and documents.
            </p>
          </div>

          {/* Interactive Steps Progress Track */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {onboardingStepsData.map((step) => {
              const isSelected = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  aria-current={isSelected ? 'step' : undefined}
                  onClick={() => dispatch(setB2bActiveStep(step.id))}
                  className={`border p-6 text-left transition-all duration-300 rounded-none relative overflow-hidden group cursor-pointer ${
                    isSelected 
                      ? 'bg-zinc-900 border-amber-500 text-white' 
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-750 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className={`absolute top-0 left-0 h-[3px] bg-amber-500 transition-all ${
                    isSelected ? 'w-full' : 'w-0 group-hover:w-1/3'
                  }`}></div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-amber-500 font-bold">{step.badge}</span>
                    <div className={`${isSelected ? 'text-amber-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="font-header uppercase tracking-wider text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">{step.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Showcase Panel */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rotate-45 transform translate-x-16 -translate-y-16 pointer-events-none"></div>
            
            {onboardingStepsData.map((step) => {
              if (activeStep !== step.id) return null;
              return (
                <div key={step.id} className="grid md:grid-cols-12 gap-8 items-center animate-fadeIn">
                  
                  {/* Left Column: Summary */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
                      Interactive Spec Grid
                    </div>
                    <h3 className="text-2xl font-header uppercase tracking-wide font-black text-white">{step.title}</h3>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">{step.desc}</p>
                    <div className="pt-4">
                      <button 
                        onClick={() => scrollToSection('b2b-application-portal')}
                        className="bg-amber-500 text-black hover:bg-white text-xs font-header uppercase tracking-widest font-bold py-3 px-6 flex items-center gap-2 transition-all duration-300"
                      >
                        Initiate This Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Required Checkpoints Checklist */}
                  <div className="md:col-span-5 bg-zinc-950 p-6 border border-zinc-850">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-900 pb-2">Step Verification Requirements:</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          <span className="text-xs text-zinc-300 font-light leading-normal">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* --- SECTION 4: DIRECT APPLICATION & BLUEPRINT UPLOAD ZONE --- */}
        <section id="b2b-application-portal" className="border border-zinc-850 p-6 sm:p-10 bg-zinc-950/20 max-w-4xl mx-auto rounded-none text-left">
          
          <div className="text-center sm:text-left mb-8 border-b border-zinc-900 pb-6 relative">
            <h3 className="text-2xl sm:text-3xl font-bold font-header uppercase text-white">Commercial Account Application</h3>
            <p className="text-sm text-zinc-500 font-light mt-1">
              Submit your company specifications below to initiate custom Net-30 underwriting, volume margins, or attach project bid blueprints.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-zinc-900/50 border border-green-500/20 p-10 text-center">
              <CheckCircle2 className="w-16 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-2xl font-header uppercase tracking-wider text-white mb-2">Portfolio Transmitted Successfully</h4>
              <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                Thank you, {b2bForm.contactName}. Your commercial application for <strong>{b2bForm.companyName}</strong> is staged. A commercial accounts specialist will contact you in under 4 hours to confirm parameters and activate credit bounds.
              </p>
              {uploadedFiles.length > 0 && (
                <div className="mt-6 bg-zinc-950 border border-zinc-850 max-w-md mx-auto p-4 text-left">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Transmitted Attachments:</span>
                  <ul className="space-y-1.5 text-xs font-mono text-zinc-300">
                    {uploadedFiles.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span> {f.name} ({f.size} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button 
                onClick={() => { 
                  dispatch(setB2bFormSubmitted(false)); 
                  dispatch(clearB2bDraft()); 
                  dispatch(setB2bUploadedFiles([]));
                }}
                className="mt-8 px-6 py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono uppercase transition-all cursor-pointer"
              >
                Send Another Commercial Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Company Name */}
                <div>
                  <label htmlFor="b2b-company-name" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Company Legal Name *</label>
                  <input 
                    type="text" 
                    id="b2b-company-name"
                    required
                    aria-required="true"
                    value={b2bForm.companyName || ''}
                    onChange={(e) => dispatch(updateB2bDraft({ companyName: e.target.value }))}
                    placeholder="e.g., Sonora Concrete Grading Inc."
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Trade classification */}
                <div>
                  <label htmlFor="b2b-trade" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Business Industry Trade Specialty *</label>
                  <select 
                    id="b2b-trade"
                    value={b2bForm.trade || 'Concrete / Masonry'}
                    onChange={(e) => dispatch(updateB2bDraft({ trade: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500 font-sans rounded-none"
                  >
                    <option value="Concrete / Masonry">Concrete &amp; Masonry</option>
                    <option value="Landscaping / Grading">Landscaping &amp; Grading</option>
                    <option value="General Contractor">General Contracting</option>
                    <option value="Framing / Carpentry">Framing &amp; Carpentry</option>
                    <option value="Plumbing / HVAC">Plumbing &amp; HVAC Systems</option>
                    <option value="Municipal / Government">Municipal / Public Works</option>
                  </select>
                </div>

                {/* Spend Range */}
                <div>
                  <label htmlFor="b2b-spend" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Anticipated Monthly Tool/Rental Spend</label>
                  <select 
                    id="b2b-spend"
                    value={b2bForm.spendRange || '$1,000 - $5,000'}
                    onChange={(e) => dispatch(updateB2bDraft({ spendRange: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500 font-sans rounded-none"
                  >
                    <option value="Under $1,000">Under $1,000 / month</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000 / month</option>
                    <option value="$5,000 - $15,000">$5,000 - $15,000 / month</option>
                    <option value="$15,000+">$15,000+ / month (Volume Prime Account)</option>
                  </select>
                </div>

                {/* Primary Contact Name */}
                <div>
                  <label htmlFor="b2b-contact-name" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Primary Contact Name *</label>
                  <input 
                    type="text" 
                    id="b2b-contact-name"
                    required
                    aria-required="true"
                    value={b2bForm.contactName || ''}
                    onChange={(e) => dispatch(updateB2bDraft({ contactName: e.target.value }))}
                    placeholder="Enter full name of foreman or account lead"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="b2b-phone" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="b2b-phone"
                    required
                    aria-required="true"
                    value={b2bForm.phone || ''}
                    onChange={(e) => dispatch(updateB2bDraft({ phone: e.target.value }))}
                    placeholder="e.g., (951) 555-0199"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="b2b-email" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Corporate Email Address *</label>
                  <input 
                    type="email" 
                    id="b2b-email"
                    required
                    aria-required="true"
                    value={b2bForm.email || ''}
                    onChange={(e) => dispatch(updateB2bDraft({ email: e.target.value }))}
                    placeholder="e.g., purchasing@sonoraconcrete.com"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                  />
                </div>

              </div>

              {/* Project Specs / Notes */}
              <div>
                <label htmlFor="b2b-notes" className="block text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Tool Fleet Specifications &amp; Material Bids</label>
                <textarea 
                  id="b2b-notes"
                  rows="4"
                  value={b2bForm.notes || ''}
                  onChange={(e) => dispatch(updateB2bDraft({ notes: e.target.value }))}
                  placeholder="Tell us about your target jobs, standard tool counts, blade sharpening requirements, or specific aggregate constraints..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 text-sm text-white focus:outline-none focus:border-amber-500 tracking-wide font-sans rounded-none"
                ></textarea>
              </div>

              {/* INTERACTIVE FILE UPLOADER SECTION */}
              <div id="blueprint-upload-zone" className="border border-zinc-850 p-6 bg-zinc-900/40">
                <span id="blueprint-upload-label" className="block text-[11px] font-mono tracking-widest text-amber-500 uppercase mb-3 font-bold flex items-center gap-1.5">
                  <Upload className="w-4 h-4 animate-bounce" /> Blueprint / Bid Spec Sheet Portal
                </span>
                <p className="text-xs text-zinc-400 mb-4 font-light">
                  Attach target project blueprints, material bid lists, or custom design sheets (PDF, DWG, PNG, JPG, DOCX). Staged files are securely parsed by our engineering desk.
                </p>

                {/* Drag and Drop Zone Container */}
                <div 
                  tabIndex={0}
                  role="button"
                  aria-labelledby="blueprint-upload-label"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  onKeyDown={handleKeyDown}
                  className={`border-2 border-dashed p-8 text-center transition-all duration-300 rounded-none cursor-pointer flex flex-col items-center justify-center gap-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 ${
                    isDragging 
                      ? 'border-amber-500 bg-amber-500/10' 
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <input 
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileSelectChange}
                    className="hidden" 
                    accept=".pdf,.dwg,.png,.jpg,.jpeg,.docx,.xlsx"
                  />
                  <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-amber-500' : 'text-zinc-500'}`} />
                  <div className="space-y-1">
                    <p className="text-xs text-white font-bold font-header uppercase tracking-wider">
                      Drag &amp; Drop Documents Here or <span className="text-amber-500">Browse Files</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">PDF, DWG, PNG, JPG, EXCEL up to 25MB each</p>
                  </div>
                </div>

                {/* Uploading Progress and Staged Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 border-t border-zinc-850 pt-4 space-y-3">
                    <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Staged Contractor Documents:</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-850 px-4 py-3 flex items-center justify-between gap-4">
                          
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-zinc-900 border border-zinc-800 text-amber-500">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-zinc-200 font-mono truncate">{file.name}</p>
                              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{file.size} MB</p>
                            </div>
                          </div>

                          {/* Upload Progress Tracker */}
                          <div className="flex items-center gap-4">
                            {file.status === 'uploading' ? (
                              <div className="flex items-center gap-3">
                                <div className="w-24 bg-zinc-900 h-1.5 rounded-none overflow-hidden border border-zinc-800">
                                  <div 
                                    className="bg-amber-500 h-full transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-[10px] font-mono text-amber-500 font-bold">{file.progress}%</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-green-500 font-bold">
                                Staged
                              </div>
                            )}

                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeUploadedFile(file.name); }}
                              className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all rounded-none cursor-pointer"
                              title="Delete Staged File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Application Submit CTA */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-amber-500 text-black hover:bg-white font-header uppercase tracking-wider font-black py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 rounded-none cursor-pointer ${
                  isSubmitting ? 'opacity-50 cursor-wait' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.01 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Transmitting Spec Portfolio...
                  </>
                ) : (
                  <>
                    Transmit Commercial Portfolio <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>
          )}

        </section>

      </main>

      {/* Shared site footer */}
      <Footer />

    </div>
  );
};

export default B2BPage;
