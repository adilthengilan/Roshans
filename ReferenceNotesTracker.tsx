import React, { useState } from 'react';
import { usePrimeStore } from '../lib/store';
import { ReferenceNote } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  X,
  Sparkles,
  Tag,
  Bookmark,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  Upload,
  Maximize2,
  PenTool,
  Code,
  Eye,
} from 'lucide-react';

export const ReferenceNotesTracker: React.FC = () => {
  const { referenceNotes, addReferenceNote, deleteReferenceNote } = usePrimeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [headingQuery, setHeadingQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedBook, setSelectedBook] = useState<string>('All');
  const [diagramOnlyFilter, setDiagramOnlyFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedParaId, setCopiedParaId] = useState<string | null>(null);
  const [copiedDiagId, setCopiedDiagId] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [showQuickExtractor, setShowQuickExtractor] = useState(false);

  // Add Form state
  const [subject, setSubject] = useState('Anatomy');
  const [customSubject, setCustomSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [bookInput, setBookInput] = useState('');
  const [paragraphInput, setParagraphInput] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [source, setSource] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Diagram state in Add Form
  const [diagramUrl, setDiagramUrl] = useState('');
  const [diagramCaption, setDiagramCaption] = useState('');
  const [diagramCode, setDiagramCode] = useState('');
  const [activeDiagramTab, setActiveDiagramTab] = useState<'preset' | 'upload' | 'code'>('preset');

  // Lightbox modal state
  const [lightboxDiagram, setLightboxDiagram] = useState<{
    url?: string;
    code?: string;
    caption?: string;
    title: string;
  } | null>(null);

  // Pre-made scientific diagram presets
  const diagramPresets = [
    {
      id: 'skeleton',
      name: '🦴 Anatomical Skeleton Map',
      caption: 'Appendicular Skeleton Structural Subdivision (Pectoral, Pelvic & Limbs)',
      code: `[ Pectoral Girdle ] ---> ( Clavicle + Scapula )
       |
       v
 [ Upper Limb ] --------> ( Humerus -> Radius/Ulna -> Carpals -> Metacarpals -> Phalanges )
 
[ Pelvic Girdle ] ------> ( Os Coxae: Ilium + Ischium + Pubis )
       |
       v
 [ Lower Limb ] --------> ( Femur -> Patella -> Tibia/Fibula -> Tarsals -> Metatarsals )`,
    },
    {
      id: 'recruitment',
      name: '⚡ Motor Unit Recruitment Curve',
      caption: 'Henneman Size Principle Recruitment Threshold Chart',
      code: `Force Output / Velocity Demand
  ^
  |                                        [ Type IIx: Fast Glycolytic ]
  |                                           (High Threshold / Max Power)
  |                   [ Type IIa: Intermediate ]
  |                      (Hypertrophy / Tempo)
  |   [ Type I: Slow ]
  |      (Endurance / Posture)
  +------------------------------------------------------------------------> Time / Load Demand`,
    },
    {
      id: 'kinetic',
      name: '⚙️ Kinetic Chain Vector',
      caption: 'Ground Reaction Force Energy Transfer Progression',
      code: `[ Ground Impulse GRF ] ===> [ Ankle Plantarflexion ] ===> [ Knee Extension ]
                                                                     |
[ Kinetic Output / Impact ] <=== [ Shoulder / Arm ] <=== [ Core Trunk Torque ] <=== [ Hip Extension ]`,
    },
    {
      id: 'synapse',
      name: '🧠 Neuromuscular Synapse Flow',
      caption: 'Action Potential Transmission Across Neuromuscular Junction',
      code: `[ Motor Cortex Signal ] ---> [ Axon Terminal ] ---> [ Acetylcholine Release ]
                                                                    |
[ Muscle Contraction ] <--- [ Sarcolemma Depolarization ] <--- [ ACh Receptors ]`,
    },
  ];

  // Pre-defined subject categories
  const defaultSubjects = [
    'All',
    'Anatomy',
    'Exercise Physiology',
    'Biomechanics',
    'Neuroscience',
    'Sports Biochemistry',
    'Business & Leadership',
  ];

  // Extract unique subjects from actual notes in store
  const availableSubjects = Array.from(
    new Set(['All', ...defaultSubjects.slice(1), ...referenceNotes.map((n) => n.subject)])
  );

  // Extract unique topics based on currently selected subject
  const availableTopics = Array.from(
    new Set(
      referenceNotes
        .filter((n) => selectedSubject === 'All' || n.subject.toLowerCase() === selectedSubject.toLowerCase())
        .map((n) => n.topic)
    )
  );

  // Extract unique books/literature sources
  const availableBooks = Array.from(
    new Set(
      referenceNotes
        .map((n) => n.book || n.source)
        .filter((b): b is string => Boolean(b && b.trim()))
    )
  );

  // Extract all unique topic headings for the Quick Heading Extractor
  const allHeadings: string[] = Array.from(new Set(referenceNotes.map((n) => n.topic).filter(Boolean)));

  // Filter notes
  const filteredNotes = referenceNotes.filter((item) => {
    const matchesSubject = selectedSubject === 'All' || item.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesTopic = selectedTopic === 'All' || item.topic.toLowerCase() === selectedTopic.toLowerCase();
    
    const itemBook = item.book || item.source || '';
    const matchesBook = selectedBook === 'All' || itemBook.toLowerCase() === selectedBook.toLowerCase();

    const hQuery = headingQuery.toLowerCase().trim();
    const matchesHeading = !hQuery || item.topic.toLowerCase().includes(hQuery) || item.subject.toLowerCase().includes(hQuery);

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.subject.toLowerCase().includes(query) ||
      item.topic.toLowerCase().includes(query) ||
      (item.book && item.book.toLowerCase().includes(query)) ||
      (item.paragraph && item.paragraph.toLowerCase().includes(query)) ||
      item.note.toLowerCase().includes(query) ||
      (item.source && item.source.toLowerCase().includes(query)) ||
      (item.keyTakeaway && item.keyTakeaway.toLowerCase().includes(query)) ||
      (item.diagramCaption && item.diagramCaption.toLowerCase().includes(query)) ||
      (item.diagramCode && item.diagramCode.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)));

    const hasDiagram = Boolean(item.diagramUrl || item.diagramCode);
    const matchesDiagramOnly = !diagramOnlyFilter || hasDiagram;

    return matchesSubject && matchesTopic && matchesBook && matchesHeading && matchesQuery && matchesDiagramOnly;
  });

  // Helper to handle image file upload for diagrams
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setDiagramUrl(reader.result as string);
          if (!diagramCaption) {
            setDiagramCaption(`Diagram: ${file.name.replace(/\.[^/.]+$/, '')}`);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyDiagram = (id: string, code?: string, url?: string, caption?: string) => {
    const textToCopy = code || url || caption || 'Diagram';
    navigator.clipboard.writeText(textToCopy);
    setCopiedDiagId(id);
    setTimeout(() => setCopiedDiagId(null), 2000);
  };

  // Helper to render text with keyword highlights
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight || !highlight.trim()) return text;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-amber-500/30 text-amber-200 border-b border-amber-400 font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyParagraph = (id: string, heading: string, paragraph: string, book?: string) => {
    const formattedParagraphTaking = `📌 Quick Paragraph Taking: [${heading}]
Book/Source: ${book || 'Academic Reference'}
--------------------------------------------------
${paragraph}`;

    navigator.clipboard.writeText(formattedParagraphTaking);
    setCopiedParaId(id);
    setTimeout(() => setCopiedParaId(null), 2000);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = subject === 'Other' ? customSubject.trim() || 'General Science' : subject;
    if (!topic.trim() || !noteContent.trim()) return;

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    addReferenceNote({
      subject: finalSubject,
      topic: topic.trim(),
      book: bookInput.trim() || source.trim() || undefined,
      paragraph: paragraphInput.trim() || undefined,
      note: noteContent.trim(),
      source: source.trim() || bookInput.trim() || undefined,
      keyTakeaway: keyTakeaway.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : [finalSubject],
      diagramUrl: diagramUrl.trim() || undefined,
      diagramCaption: diagramCaption.trim() || undefined,
      diagramCode: diagramCode.trim() || undefined,
    });

    // Reset Form
    setTopic('');
    setBookInput('');
    setParagraphInput('');
    setNoteContent('');
    setSource('');
    setKeyTakeaway('');
    setTagsInput('');
    setDiagramUrl('');
    setDiagramCaption('');
    setDiagramCode('');
    setShowAddModal(false);
  };

  const handleQuickAddTemplate = (tpl: {
    subj: string;
    top: string;
    book: string;
    para: string;
    note: string;
    src: string;
    takeaway: string;
    tags: string[];
  }) => {
    addReferenceNote({
      subject: tpl.subj,
      topic: tpl.top,
      book: tpl.book,
      paragraph: tpl.para,
      note: tpl.note,
      source: tpl.src,
      keyTakeaway: tpl.takeaway,
      tags: tpl.tags,
    });
  };

  const templates = [
    {
      label: '🦴 Anatomy: Appendicular Skeleton System',
      subj: 'Anatomy',
      top: 'Appendicular Skeleton System',
      book: "Netter's Atlas of Human Anatomy (8th Edition)",
      para: 'The Appendicular Skeleton consists of 126 bones forming upper and lower limbs, pectoral girdle (clavicle, scapula) and pelvic girdle (coxal bones).',
      note: `Complete Reference Breakdown of the Appendicular Skeleton (126 Bones total):

1. Pectoral Girdle (4 bones):
   - Clavicle (S-shaped anterior strut) & Scapula (posterior blade with acromion, coracoid process, glenoid fossa).
2. Upper Extremity (60 bones):
   - Humerus, Radius (lateral forearm), Ulna (medial forearm), 8 Carpals, 5 Metacarpals, 14 Phalanges.
3. Pelvic Girdle (2 coxal bones):
   - Ilium, Ischium, and Pubis fused into acetabulum for femur articulation.
4. Lower Extremity (60 bones):
   - Femur, Patella, Tibia (medial weight-bearing shin), Fibula (lateral), 7 Tarsals, 5 Metatarsals, 14 Phalanges.

Functional Performance Note:
Serves as major leverage mechanisms for muscular origin/insertion during high-torque calisthenics and striking.`,
      src: "Netter's Atlas of Human Anatomy & Clinical Biomechanics",
      takeaway: '126 bones forming upper/lower limbs & girdles providing biomechanical leverage.',
      tags: ['Anatomy', 'Bones', 'UpperLimb', 'LowerLimb'],
    },
    {
      label: '⚡ Physiology: Neuromuscular Motor Unit Recruitment',
      subj: 'Exercise Physiology',
      top: 'Henneman Size Principle & Fast-Twitch Recruitment',
      book: "NSCA's Essentials of Strength Training and Conditioning",
      para: 'Motor units are recruited sequentially from low-threshold Type I slow-twitch to high-threshold Type IIx fast-twitch fibers based on force demands.',
      note: `Motor units are recruited sequentially from low-threshold Type I slow-twitch to high-threshold Type IIx fast-twitch fibers based on force demands.

• Type I: Low threshold, high fatigue resistance, aerobic oxidation.
• Type IIa: Intermediate force, fatigue-resistant glycolytic.
• Type IIx: Maximum explosive force, recruited during >85% 1RM or maximal deceleration/acceleration.`,
      src: 'NSCA Essentials of Strength Training and Conditioning',
      takeaway: 'High-threshold motor units require maximal explosive intent or heavy loads.',
      tags: ['Physiology', 'Neuromuscular', 'Recruitment'],
    },
    {
      label: '⚙️ Biomechanics: Kinetic Chain & GRF Transmission',
      subj: 'Biomechanics',
      top: 'Ground Reaction Force (GRF) & Torque Vectoring',
      book: 'Biomechanics of Sport and Exercise (4th Ed.)',
      para: 'Kinetic chain mechanics govern energy transfer from ground contact through triple extension (ankle, knee, hip) to upper extremity outputs.',
      note: `Kinetic chain mechanics govern energy transfer from ground contact through triple extension (ankle, knee, hip) to upper extremity outputs.

• GRF (Ground Reaction Force): Equal and opposite force transmitted through foot contact.
• RFD (Rate of Force Development): Explosive impulse production in early force application (<200ms).`,
      src: 'Journal of Sports Biomechanics',
      takeaway: 'Maximal kinetic chain transfer relies on uninterrupted core stiffness and high RFD.',
      tags: ['Biomechanics', 'GRF', 'KineticChain'],
    },
  ];

  return (
    <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-lg space-y-4">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26262A] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Academic Literature & Subject Reference Notes
            </h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              {referenceNotes.length} Notes Saved
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Structured subject reference system: <span className="text-blue-300 font-semibold">[ Subject → Topic → Reference Note ]</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-xl text-xs transition shadow-md shadow-[#FF5A1F]/20"
        >
          <Plus className="w-4 h-4" /> Add Reference Note
        </button>
      </div>

      {/* Search & Subject/Topic/Book/Heading Filter Bar */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* Keyword Search Input */}
          <div className="relative sm:col-span-5">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search keyword in book, paragraph, note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Heading / Topic Quick Search Input */}
          <div className="relative sm:col-span-4">
            <Bookmark className="w-3.5 h-3.5 absolute left-3 top-2.5 text-amber-400" />
            <input
              type="text"
              placeholder="Search Heading / Topic for Quick Taking..."
              value={headingQuery}
              onChange={(e) => setHeadingQuery(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-amber-500/30 focus:border-amber-400 rounded-xl pl-8 pr-8 py-1.5 text-xs text-amber-200 placeholder-amber-500/60 font-semibold focus:outline-none"
            />
            {headingQuery && (
              <button
                onClick={() => setHeadingQuery('')}
                className="absolute right-2.5 top-2.5 text-amber-500 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Book Filter Selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-1.5 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-blue-500 truncate"
            >
              <option value="All">All Books ({availableBooks.length})</option>
              {availableBooks.map((bk) => (
                <option key={bk} value={bk}>
                  Book: {bk}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Heading Shortcuts Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Search Heading:
          </span>
          <button
            onClick={() => setHeadingQuery('')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-mono shrink-0 border transition ${
              !headingQuery
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-[#0A0A0B] text-neutral-400 border-[#26262A] hover:text-white'
            }`}
          >
            All Headings
          </button>
          {allHeadings.map((h) => {
            const isSel = headingQuery.toLowerCase().trim() === h.toLowerCase().trim();
            return (
              <button
                key={h}
                onClick={() => setHeadingQuery(isSel ? '' : h)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono shrink-0 border transition flex items-center gap-1 ${
                  isSel
                    ? 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold shadow-sm'
                    : 'bg-[#0A0A0B] text-neutral-300 border-[#26262A] hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <span>{h}</span>
              </button>
            );
          })}
        </div>

        {/* Subject Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1 shrink-0 mr-1">
            <Layers className="w-3 h-3 text-neutral-400" /> Subject:
          </span>
          {availableSubjects.map((subj) => {
            const isSelected = selectedSubject.toLowerCase() === subj.toLowerCase();
            const count =
              subj === 'All'
                ? referenceNotes.length
                : referenceNotes.filter((n) => n.subject.toLowerCase() === subj.toLowerCase()).length;

            return (
              <button
                key={subj}
                onClick={() => {
                  setSelectedSubject(subj);
                  setSelectedTopic('All'); // Reset topic when subject changes
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold shrink-0 transition flex items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold'
                    : 'bg-[#0A0A0B] border-[#26262A] text-neutral-400 hover:text-white hover:border-[#36363C]'
                }`}
              >
                <span>{subj}</span>
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                    isSelected ? 'bg-blue-500/30 text-blue-200' : 'bg-[#161618] text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setDiagramOnlyFilter(!diagramOnlyFilter)}
            className={`px-2.5 py-1 rounded-lg border font-semibold shrink-0 transition flex items-center gap-1 text-xs ${
              diagramOnlyFilter
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-sm'
                : 'bg-[#0A0A0B] border-[#26262A] text-neutral-400 hover:text-emerald-300 hover:border-emerald-900'
            }`}
            title="Filter notes that include diagram illustrations"
          >
            <PenTool className="w-3 h-3 text-emerald-400" />
            <span>With Diagrams</span>
          </button>
        </div>

        {/* Active Filters / Keyword Search Summary Indicator */}
        {(searchQuery.trim() || headingQuery.trim() || diagramOnlyFilter || selectedTopic !== 'All' || selectedBook !== 'All' || selectedSubject !== 'All') && (
          <div className="flex flex-wrap items-center justify-between text-[11px] bg-[#0A0A0B] border border-[#26262A] px-3 py-1.5 rounded-xl">
            <div className="flex flex-wrap items-center gap-2 text-neutral-300">
              <span className="text-neutral-500 font-bold uppercase text-[10px]">Active Filters:</span>
              {selectedSubject !== 'All' && (
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                  Subject: {selectedSubject}
                </span>
              )}
              {selectedTopic !== 'All' && (
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                  Topic: {selectedTopic}
                </span>
              )}
              {selectedBook !== 'All' && (
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  Book: {selectedBook}
                </span>
              )}
              {headingQuery.trim() && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-amber-400" /> Heading: "{headingQuery.trim()}"
                </span>
              )}
              {diagramOnlyFilter && (
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                  <PenTool className="w-3 h-3 text-emerald-400" /> Diagrams Only
                </span>
              )}
              {searchQuery.trim() && (
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                  Keyword Search: "{searchQuery.trim()}"
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setHeadingQuery('');
                setSelectedSubject('All');
                setSelectedTopic('All');
                setSelectedBook('All');
                setDiagramOnlyFilter(false);
              }}
              className="text-neutral-400 hover:text-white text-[10px] underline font-semibold ml-2"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Add Presets */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick High-Yield Reference Templates
        </span>
        <div className="flex flex-wrap gap-1.5">
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAddTemplate(tpl)}
              className="flex items-center gap-1 bg-[#0A0A0B] hover:bg-[#202024] border border-[#26262A] hover:border-blue-500/50 px-2.5 py-1 rounded-lg text-xs text-neutral-300 hover:text-white transition group"
            >
              <span>{tpl.label}</span>
              <Plus className="w-3 h-3 text-neutral-500 group-hover:text-blue-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Reference Notes List */}
      <div className="space-y-3 pt-2">
        {filteredNotes.length === 0 ? (
          <div className="bg-[#0A0A0B] border border-dashed border-[#26262A] rounded-2xl p-6 text-center space-y-2">
            <FileText className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400">
              No reference notes matching current search or filters.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-[#FF5A1F] hover:underline font-bold"
            >
              + Create a new reference note
            </button>
          </div>
        ) : (
          filteredNotes.map((item) => {
            const isExpanded = expandedNoteId === item.id;
            const bookTitle = item.book || item.source;
            const hasKeywordMatchInNote =
              searchQuery.trim() &&
              (item.note.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                (item.paragraph && item.paragraph.toLowerCase().includes(searchQuery.toLowerCase().trim())));

            return (
              <div
                key={item.id}
                className="bg-[#0A0A0B] border border-[#26262A] hover:border-[#36363C] rounded-2xl p-4 transition space-y-3 shadow-md"
              >
                {/* Note Header: Subject, Book & Topic */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[#1E1E22] pb-2.5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Subject Tag */}
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-md font-mono">
                        Subject: {renderHighlightedText(item.subject, searchQuery)}
                      </span>

                      {/* Book Citation */}
                      {bookTitle && (
                        <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-emerald-400" />
                          <span>Book:</span>
                          <span className="italic">{renderHighlightedText(bookTitle, searchQuery)}</span>
                        </span>
                      )}
                    </div>

                    {/* Topic Title */}
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2 pt-0.5">
                      <span className="text-blue-400 font-mono text-xs">Topic:</span>
                      {renderHighlightedText(item.topic, searchQuery)}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <span className="text-[10px] text-neutral-500 font-mono">{item.dateAdded}</span>

                    <button
                      onClick={() =>
                        handleCopyNote(
                          item.id,
                          `Subject: ${item.subject}\nTopic: ${item.topic}\nBook: ${bookTitle || 'N/A'}\n\nParagraph:\n${item.paragraph || ''}\n\nFull Note:\n${item.note}`
                        )
                      }
                      className="p-1.5 text-neutral-400 hover:text-white bg-[#161618] hover:bg-[#202024] rounded-lg border border-[#26262A] transition"
                      title="Copy full reference note"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteReferenceNote(item.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 bg-[#161618] hover:bg-[#202024] rounded-lg border border-[#26262A] transition"
                      title="Delete reference note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Specific Paragraph / Passage Excerpt (if defined) */}
                {item.paragraph && (
                  <div className="bg-[#121215] border-l-2 border-emerald-500 p-3 rounded-r-xl space-y-1.5 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-mono">
                        <Bookmark className="w-3.5 h-3.5" /> Paragraph / Excerpt Taking:
                      </span>
                      <button
                        onClick={() =>
                          handleCopyParagraph(
                            item.id,
                            item.topic,
                            item.paragraph || '',
                            bookTitle
                          )
                        }
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/50 px-2 py-0.5 rounded-md transition"
                        title="Copy paragraph as quick note taking"
                      >
                        {copiedParaId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Taken!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Quick Take Paragraph
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-200 italic leading-relaxed font-serif">
                      "{renderHighlightedText(item.paragraph, searchQuery || headingQuery)}"
                    </p>
                  </div>
                )}

                {/* Structured Reference Note Content */}
                <div className="bg-[#161618] border border-[#202024] p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-400" /> Complete Reference Note
                      {hasKeywordMatchInNote && (
                        <span className="bg-amber-500/20 text-amber-300 text-[9px] px-2 py-0.5 rounded font-mono font-bold ml-2">
                          Keyword Match Inside Note
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => setExpandedNoteId(isExpanded ? null : item.id)}
                      className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                    >
                      {isExpanded || hasKeywordMatchInNote ? (
                        <>
                          Expanded <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          Full View <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  <div
                    className={`text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed font-mono ${
                      !isExpanded && !hasKeywordMatchInNote && item.note.length > 280 ? 'line-clamp-4' : ''
                    }`}
                  >
                    {renderHighlightedText(item.note, searchQuery)}
                  </div>
                </div>

                {/* Diagram / Figure Illustration Section */}
                {(item.diagramUrl || item.diagramCode) && (
                  <div className="bg-[#121215] border border-emerald-900/40 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-emerald-900/30 pb-2">
                      <div className="flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 font-mono">
                          Diagram / Schema Illustration
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            handleCopyDiagram(
                              item.id,
                              item.diagramCode,
                              item.diagramUrl,
                              item.diagramCaption
                            )
                          }
                          className="text-[10px] font-semibold text-neutral-400 hover:text-white bg-[#1C1C20] px-2 py-0.5 rounded border border-[#2A2A30] transition flex items-center gap-1"
                          title="Copy diagram code or link"
                        >
                          {copiedDiagId === item.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          Copy
                        </button>

                        <button
                          onClick={() =>
                            setLightboxDiagram({
                              url: item.diagramUrl,
                              code: item.diagramCode,
                              caption: item.diagramCaption,
                              title: item.topic,
                            })
                          }
                          className="text-[10px] font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded transition flex items-center gap-1"
                          title="Open diagram in full screen"
                        >
                          <Maximize2 className="w-3 h-3" /> Full View
                        </button>
                      </div>
                    </div>

                    {/* Diagram Image or Code Content */}
                    {item.diagramUrl && (
                      <div
                        onClick={() =>
                          setLightboxDiagram({
                            url: item.diagramUrl,
                            code: item.diagramCode,
                            caption: item.diagramCaption,
                            title: item.topic,
                          })
                        }
                        className="cursor-pointer group relative overflow-hidden rounded-lg bg-black/40 border border-[#202024] flex items-center justify-center p-2 min-h-[140px]"
                      >
                        <img
                          src={item.diagramUrl}
                          alt={item.diagramCaption || item.topic}
                          className="max-h-60 w-auto object-contain transition group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-bold">
                          <Eye className="w-4 h-4 text-emerald-400" /> Click to Enlarge Diagram
                        </div>
                      </div>
                    )}

                    {item.diagramCode && (
                      <pre className="bg-[#0D0D10] text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-emerald-950 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                        {renderHighlightedText(item.diagramCode, searchQuery || headingQuery)}
                      </pre>
                    )}

                    {item.diagramCaption && (
                      <p className="text-[10px] text-neutral-400 italic flex items-center gap-1.5 font-sans">
                        <ImageIcon className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Caption: {item.diagramCaption}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Key Takeaway / Insight Box */}
                {item.keyTakeaway && (
                  <div className="bg-blue-950/20 border border-blue-800/30 p-2.5 rounded-xl flex items-start gap-2 text-xs text-blue-200">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-blue-300 uppercase tracking-wider text-[10px] block mb-0.5">
                        High-Yield Key Takeaway
                      </span>
                      <p className="leading-snug italic">{renderHighlightedText(item.keyTakeaway, searchQuery)}</p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] bg-[#161618] text-neutral-400 border border-[#26262A] px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-neutral-500" /> #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD REFERENCE NOTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 w-full max-w-lg space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" /> Add Academic Reference Note
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3">
              {/* Subject & Custom Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Subject / Discipline
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Anatomy">Anatomy</option>
                    <option value="Exercise Physiology">Exercise Physiology</option>
                    <option value="Biomechanics">Biomechanics</option>
                    <option value="Neuroscience">Neuroscience</option>
                    <option value="Sports Biochemistry">Sports Biochemistry</option>
                    <option value="Business & Leadership">Business & Leadership</option>
                    <option value="Other">Other (Custom Subject)</option>
                  </select>
                </div>

                {subject === 'Other' && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      Custom Subject Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Molecular Biology"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                <div className={subject === 'Other' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Appendicular Skeleton System"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Book Name & Paragraph Excerpt */}
              <div className="space-y-2 border-t border-b border-[#202024] py-2">
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Book / Reference Literature Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Netter's Atlas of Human Anatomy (8th Edition)"
                    value={bookInput}
                    onChange={(e) => setBookInput(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5" /> Specific Book Paragraph / Passage Excerpt
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 'The Appendicular Skeleton consists of 126 bones forming upper and lower limbs...'"
                    value={paragraphInput}
                    onChange={(e) => setParagraphInput(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-neutral-200 font-serif leading-relaxed focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Reference Note Content */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Complete Reference Note (Structured details, bone lists, equations, concepts)
                </label>
                <textarea
                  rows={5}
                  placeholder={`Write your structured reference note here...
For example:
• Upper Extremity: Clavicle, Scapula, Humerus, Radius, Ulna, Carpals...
• Lower Extremity: Femur, Patella, Tibia, Fibula, Tarsals...
• Clinical relevance: Leverage ratios for calisthenics & power outputs.`}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Diagram / Schema Illustration (Optional) */}
              <div className="bg-[#0D0D10] border border-emerald-900/40 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                    <PenTool className="w-3.5 h-3.5 text-emerald-400" /> Diagram / Schema Illustration (Optional)
                  </label>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                    Diagram Enabled
                  </span>
                </div>

                {/* Diagram Mode Tabs */}
                <div className="flex items-center gap-1 bg-[#161618] p-1 rounded-lg text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveDiagramTab('preset')}
                    className={`flex-1 py-1 rounded font-semibold transition ${
                      activeDiagramTab === 'preset'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ⚡ Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDiagramTab('upload')}
                    className={`flex-1 py-1 rounded font-semibold transition ${
                      activeDiagramTab === 'upload'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    🖼️ Image / File
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDiagramTab('code')}
                    className={`flex-1 py-1 rounded font-semibold transition ${
                      activeDiagramTab === 'code'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    📝 ASCII / Flowchart
                  </button>
                </div>

                {/* Tab 1: Presets */}
                {activeDiagramTab === 'preset' && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-neutral-400 block font-sans">
                      Select a scientific diagram template to insert into your note:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {diagramPresets.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setDiagramCode(p.code);
                            setDiagramCaption(p.caption);
                          }}
                          className="text-left p-2 rounded-lg bg-[#161618] hover:bg-[#1E1E22] border border-[#26262A] hover:border-emerald-500/50 transition group"
                        >
                          <div className="text-[11px] font-bold text-emerald-300 group-hover:text-white flex items-center justify-between">
                            <span>{p.name}</span>
                            <Sparkles className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition" />
                          </div>
                          <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{p.caption}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Upload / URL */}
                {activeDiagramTab === 'upload' && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-medium text-neutral-400 mb-1">
                        Upload Diagram Image File (PNG, JPG, SVG)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-xs text-neutral-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-950 file:text-emerald-300 hover:file:bg-emerald-900 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-neutral-400 mb-1">
                        Or Paste Image URL directly
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/diagram.png"
                        value={diagramUrl}
                        onChange={(e) => setDiagramUrl(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 3: Code / Flowchart */}
                {activeDiagramTab === 'code' && (
                  <div>
                    <label className="block text-[10px] font-medium text-neutral-400 mb-1">
                      Custom ASCII Vector / Flowchart Diagram Code
                    </label>
                    <textarea
                      rows={4}
                      placeholder={`[ Concept A ] ---> [ Concept B ] ---> [ Output ]`}
                      value={diagramCode}
                      onChange={(e) => setDiagramCode(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-emerald-300 font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {/* Diagram Caption */}
                <div>
                  <label className="block text-[10px] font-medium text-neutral-400 mb-1">
                    Diagram Figure Title / Caption
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Figure 1: Appendicular Skeleton Lever Mechanics"
                    value={diagramCaption}
                    onChange={(e) => setDiagramCaption(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Key Takeaway & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-blue-400 mb-1">
                    High-Yield Key Takeaway
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 126 bones providing leverage for physical performance."
                    value={keyTakeaway}
                    onChange={(e) => setKeyTakeaway(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anatomy, Bones, UpperLimb, Calisthenics"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-xl text-xs transition shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Reference Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL FOR DIAGRAMS */}
      {lightboxDiagram && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-[#26262A] rounded-2xl p-5 w-full max-w-4xl space-y-4 max-h-[92vh] flex flex-col justify-between shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5" /> Reference Diagram Lightbox
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{lightboxDiagram.title}</h3>
              </div>
              <button
                onClick={() => setLightboxDiagram(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg bg-[#1C1C20]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2 min-h-[300px]">
              {lightboxDiagram.url ? (
                <img
                  src={lightboxDiagram.url}
                  alt={lightboxDiagram.caption || lightboxDiagram.title}
                  className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
                />
              ) : lightboxDiagram.code ? (
                <pre className="w-full bg-[#08080A] text-emerald-300 font-mono text-xs sm:text-sm p-5 rounded-2xl border border-emerald-900/50 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {lightboxDiagram.code}
                </pre>
              ) : null}
            </div>

            {lightboxDiagram.caption && (
              <div className="bg-[#18181C] border border-[#26262A] p-3 rounded-xl text-xs text-neutral-300 flex items-center justify-between">
                <span className="italic flex items-center gap-1.5 font-sans">
                  <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lightboxDiagram.caption}</span>
                </span>
                <button
                  onClick={() =>
                    handleCopyDiagram(
                      'lightbox',
                      lightboxDiagram.code,
                      lightboxDiagram.url,
                      lightboxDiagram.caption
                    )
                  }
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition flex items-center gap-1 shrink-0 ml-3"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Diagram
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
