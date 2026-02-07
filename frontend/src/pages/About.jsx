import React from 'react';
import { 
  Info, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  BarChart3, 
  HelpCircle,
  Lightbulb,
  Code2,
  Cpu,
  ExternalLink 
} from 'lucide-react';
import Card from '../components/Card';

const About = () => {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
      
      {/* 1. Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mb-4">
          <Info size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          About LawWise
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
          An AI-powered legal intelligence tool designed to scrape, analyze, and summarize 
          Income Tax Appellate Tribunal (ITAT) orders with precision and speed.
        </p>
      </div>

      {/* 2. Workflow / How it Works */}
      <Card className="p-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-2">
          <BookOpen size={24} className="text-emerald-500"/> 
          How to Use the Platform
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center group-hover:border-blue-500 transition-colors shadow-sm">
              <Search size={28} className="text-zinc-400 group-hover:text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">1. Search Orders</h3>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                Go to the <strong>Live Portal</strong>. Enter search criteria (Bench, Date, or Case Type) to fetch raw orders directly from the official ITAT source.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center group-hover:border-purple-500 transition-colors shadow-sm">
              <Cpu size={28} className="text-zinc-400 group-hover:text-purple-500" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">2. AI Analysis</h3>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                The system automatically scrapes the PDFs. Our AI reads the document to extract <strong>Coram, Parties, Outcome</strong>, and generates a summary.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center group-hover:border-emerald-500 transition-colors shadow-sm">
              <BarChart3 size={28} className="text-zinc-400 group-hover:text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">3. Review & Export</h3>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                View results in the <strong>Analysis Tab</strong>. Check the "Outcome" (Assessee/Revenue), edit details if needed, and export to Excel.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Features & Terminology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-500"/> Data Security & Privacy
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Your data privacy is paramount. This tool operates on a secure environment:
          </p>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
              <span><strong>No External Sharing:</strong> Extracted case data is stored in your private database.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
              <span><strong>Role-Based Access:</strong> Only Admins can edit or delete case records.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
              <span><strong>Encryption:</strong> All API requests are encrypted using industry-standard TLS protocols.</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-orange-500"/> Terminology Guide
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Coram</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-200">The panel of judges (Members) who heard the case. Usually consists of a Judicial Member (JM) and an Accountant Member (AM).</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Outcome</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                <span className="text-emerald-600 font-bold">Assessee:</span> The taxpayer won.<br/>
                <span className="text-red-600 font-bold">Revenue:</span> The tax department won.<br/>
                <span className="text-blue-600 font-bold">Remanded:</span> Sent back for re-adjudication.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* --- DIVIDER --- */}
      <div className="relative py-10 mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-100 dark:bg-black px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Credits & Acknowledgements
          </span>
        </div>
      </div>

      {/* 4. Credits & Architecture (Zoom + Shimmer Effect) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Initiative Link */}
          <a 
            href="https://www.casanketmjoshi.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="
                relative overflow-hidden group 
                p-6 bg-white dark:bg-zinc-900 
                rounded-2xl border border-zinc-200 dark:border-zinc-800 
                flex flex-col justify-between 
                transition-all duration-300 ease-out 
                hover:scale-[1.02] hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-900
            "
          >
              {/* SHIMMER EFFECT LAYER */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-12 z-0 pointer-events-none" />

              <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
                            <Lightbulb size={20} />
                        </div>
                        <h3 className="font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-widest">
                            Conceptualized By
                        </h3>
                      </div>
                      <ExternalLink size={16} className="text-zinc-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Sanket Milind Joshi & Co.
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                      An AI-enabled initiative bridging the gap between traditional tax practice and modern technology. Pioneering steps in streamlining complex order research and enhancing analytical accuracy.
                  </p>
              </div>
          </a>

          {/* Development Link */}
          <a 
            href="https://www.thebrchub.tech/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="
                relative overflow-hidden group 
                p-6 bg-white dark:bg-zinc-900 
                rounded-2xl border border-zinc-200 dark:border-zinc-800 
                flex flex-col justify-between 
                transition-all duration-300 ease-out 
                hover:scale-[1.02] hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-900
            "
          >
              {/* SHIMMER EFFECT LAYER */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-12 z-0 pointer-events-none" />

              <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500">
                            <Code2 size={20} />
                        </div>
                        <h3 className="font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-widest">
                            Designed & Developed By
                        </h3>
                      </div>
                      <ExternalLink size={16} className="text-zinc-300 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      BRC HUB LLP
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                      Powered by the proprietary <strong>Benk-Y Architecture</strong> (Binary Extraction & Normalization Kernel - Yield) for scalable scraping and zero-latency data retrieval.
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono text-zinc-500">
                      <Cpu size={10} />v1.0
                  </div>
              </div>
          </a>
      </div>

      {/* 5. Footer Note */}
      <div className="text-center pt-8 border-t border-zinc-200 dark:border-zinc-800 mt-4">
        <p className="text-sm text-zinc-400">
          Need technical support? Contact the BRC HUB development team.
        </p>
        <p className="text-xs text-zinc-500 mt-2">Version 1.0.0 • Build 2026.01</p>
      </div>

    </div>
  );
};

export default About;