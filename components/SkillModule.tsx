
import React, { useState, useMemo } from 'react';
import { CURATED_SKILLS } from '../constants';
import { CuratedSkill, SkillLevel } from '../types';

interface SkillModuleProps {
  onSelectSkill: (skill: CuratedSkill) => void;
}

export const SkillModule: React.FC<SkillModuleProps> = ({ onSelectSkill }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['All', 'Cooking', 'DIY', 'Coding', 'Finance'];
  const levels = ['All', SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED];

  const filteredSkills = useMemo(() => {
    return CURATED_SKILLS.filter(skill => {
      const catMatch = filterCategory === 'All' || skill.category === filterCategory;
      const levelMatch = filterLevel === 'All' || skill.level === filterLevel;
      const searchMatch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      return catMatch && levelMatch && searchMatch;
    });
  }, [filterCategory, filterLevel, searchTerm]);

  const featuredSkill = useMemo(() => CURATED_SKILLS.find(s => s.featured), []);

  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.BEGINNER: return 'text-green-400 bg-green-400/10 border-green-400/20';
      case SkillLevel.INTERMEDIATE: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case SkillLevel.ADVANCED: return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400';
    }
  };

  const DifficultyMeter = ({ level }: { level: SkillLevel }) => {
    const dots = level === SkillLevel.BEGINNER ? 1 : level === SkillLevel.INTERMEDIATE ? 2 : 3;
    return (
      <div className="flex gap-1">
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= dots ? 'bg-blue-500' : 'bg-slate-700'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Featured Section */}
      {featuredSkill && !searchTerm && filterCategory === 'All' && filterLevel === 'All' && (
        <div className="mb-12">
          <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">Featured Tutorial</h3>
          <button 
            onClick={() => onSelectSkill(featuredSkill)}
            className="w-full relative overflow-hidden glass rounded-3xl p-8 text-left group border-blue-500/20 hover:border-blue-500/40 transition-all"
          >
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-800 rounded-3xl flex items-center justify-center text-5xl md:text-6xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
                {featuredSkill.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getLevelColor(featuredSkill.level)} uppercase`}>
                    {featuredSkill.level}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {featuredSkill.duration}
                  </span>
                </div>
                <h4 className="text-3xl font-extrabold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {featuredSkill.title}
                </h4>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                  {featuredSkill.description}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="bg-blue-600 px-6 py-2 rounded-xl text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
                    Start Tutorial
                  </span>
                  <DifficultyMeter level={featuredSkill.level} />
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-t border-white/5 pt-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Skills Library</h3>
          <p className="text-slate-400 text-sm">Organized guides for practical everyday growth.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="h-8 w-[1px] bg-white/5 hidden md:block mx-2"></div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => onSelectSkill(skill)}
              className="glass p-6 rounded-2xl text-left transition-all hover:border-blue-500/50 hover:bg-white/5 group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <div className="text-right">
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getLevelColor(skill.level)} uppercase inline-block`}>
                    {skill.level}
                  </div>
                  <div className="mt-1">
                    <DifficultyMeter level={skill.level} />
                  </div>
                </div>
              </div>
              
              <h4 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors mb-2">
                {skill.title}
              </h4>
              
              <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
                {skill.description}
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-slate-500 text-xs flex items-center gap-1 font-medium uppercase tracking-tight">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {skill.duration}
                </span>
                <span className="text-blue-500 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  START
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-white/5">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h5 className="text-white font-bold mb-1">No matching skills</h5>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
