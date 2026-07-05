import { SermonQuote, UserProfile, Collection } from './types';

export const PRESET_BACKGROUNDS = [
  // Gradients
  { id: 'grad-serene', type: 'gradient', value: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)', label: 'Serene Blue', textColor: 'text-white' },
  { id: 'grad-sunset', type: 'gradient', value: 'linear-gradient(135deg, #7c2d12 0%, #db2777 60%, #f43f5e 100%)', label: 'Spiritual Sunset', textColor: 'text-white' },
  { id: 'grad-forest', type: 'gradient', value: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)', label: 'Eden Green', textColor: 'text-white' },
  { id: 'grad-royal', type: 'gradient', value: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c084fc 100%)', label: 'Royal Purple', textColor: 'text-white' },
  { id: 'grad-dawn', type: 'gradient', value: 'linear-gradient(135deg, #111827 0%, #1f2937 40%, #4b5563 100%)', label: 'Midnight Dawn', textColor: 'text-white' },
  { id: 'grad-amber', type: 'gradient', value: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #fbbf24 100%)', label: 'Sacred Gold', textColor: 'text-white' },
  
  // Solid Colors
  { id: 'solid-dark', type: 'solid', value: '#0f172a', label: 'Cosmic Slate', textColor: 'text-white' },
  { id: 'solid-light', type: 'solid', value: '#f8fafc', label: 'Pure Alabaster', textColor: 'text-slate-900' },
  { id: 'solid-clay', type: 'solid', value: '#fef2f2', label: 'Soft Terracotta', textColor: 'text-red-900' },
  { id: 'solid-linen', type: 'solid', value: '#fafaf9', label: 'Warm Linen', textColor: 'text-stone-900' },

  // Illustrations/Gradients with soft patterns
  { id: 'ill-nebula', type: 'illustration', value: 'radial-gradient(circle at top left, #311042, #100720, #050112)', label: 'Heavenly Nebula', textColor: 'text-purple-100' },
  { id: 'ill-mist', type: 'illustration', value: 'radial-gradient(circle at bottom right, #e0e7ff, #f1f5f9, #ffffff)', label: 'Morning Mist', textColor: 'text-indigo-950' },
];

export const TEMPLATES = [
  { id: 'minimal', name: 'Minimalist', fontClass: 'font-sans font-light', borderStyle: 'border-0', alignment: 'text-center' },
  { id: 'elegant', name: 'Serif Elegance', fontClass: 'font-serif italic font-normal', borderStyle: 'border-b-2 border-amber-400/30 pb-4', alignment: 'text-center' },
  { id: 'modern', name: 'Bold Modern', fontClass: 'font-display font-extrabold tracking-tight uppercase', borderStyle: 'border-l-4 border-blue-500 pl-4', alignment: 'text-left' },
  { id: 'dark', name: 'Deep Reflections', fontClass: 'font-sans font-medium text-slate-100 bg-black/30 backdrop-blur-sm p-6 rounded-xl', borderStyle: 'border border-white/10', alignment: 'text-center' },
  { id: 'church', name: 'Sacred Banner', fontClass: 'font-serif font-semibold', borderStyle: 'border border-amber-500/20 p-6 bg-stone-900/40 rounded-lg shadow-inner', alignment: 'text-center' },
  { id: 'conference', name: 'Impact Drive', fontClass: 'font-display font-bold', borderStyle: 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6 rounded-2xl border border-white/10', alignment: 'text-center' },
  { id: 'worship', name: 'Worship Flow', fontClass: 'font-sans font-light tracking-widest', borderStyle: 'border-y border-white/20 py-4', alignment: 'text-center' },
  { id: 'youth', name: 'Electric Youth', fontClass: 'font-display font-black italic tracking-wide text-yellow-300', borderStyle: 'skew-y-1 bg-violet-950/50 p-6 rounded-xl', alignment: 'text-left' }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Sarah Jenkins',
  username: 'sarah_jenkins',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  bio: 'Savoring God\'s grace daily. Collecting golden nuggets from sermons that shape my walk. 📖✝️ Worship leader @ Grace Community.',
  churchAffiliation: 'Grace Community Church',
  followersCount: 1240,
  followingCount: 382,
  quotesCount: 4,
  savedCollections: [
    {
      id: 'col-faith',
      name: 'Faith & Trust',
      description: 'Quotes about stepping out in faith, trusting God in deep waters, and seeing the unseen.',
      icon: 'Shield',
      quoteIds: ['quote-1', 'quote-4'],
      coverGradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
    },
    {
      id: 'col-prayer',
      name: 'Prayer Power',
      description: 'Strengthening the quiet times and finding connection in deep prayer.',
      icon: 'Heart',
      quoteIds: ['quote-3'],
      coverGradient: 'linear-gradient(135deg, #4c1d95, #c084fc)'
    },
    {
      id: 'col-worship',
      name: 'Worship Life',
      description: 'Sermon snippets on expressing authentic adoration for Christ.',
      icon: 'Music',
      quoteIds: ['quote-5'],
      coverGradient: 'linear-gradient(135deg, #7c2d12, #db2777)'
    }
  ]
};

export const INITIAL_QUOTES: SermonQuote[] = [
  {
    id: 'quote-1',
    quote: "Grace is not the absence of struggle. Grace is the presence of God in the midst of the struggle.",
    scripture: "2 Corinthians 12:9",
    scriptureVersion: "ESV",
    speaker: "Pastor David Platt",
    church: "McLean Bible Church",
    topic: "Grace",
    hashtags: ['Grace', 'Struggle', 'StrengthInWeakness', 'DavidPlatt'],
    likesCount: 245,
    commentsCount: 18,
    savesCount: 142,
    sharesCount: 56,
    isLiked: false,
    isSaved: true,
    insight: "This truly opened my eyes. We often pray for the storm to stop, when the real blessing is Jesus walking on the waves with us.",
    audioUrl: "grace-struggle-clip", // matches preset key
    audioDuration: 22,
    audioTimeline: [
      { time: 0, text: "Grace is" },
      { time: 2, text: "Grace is not the absence" },
      { time: 5, text: "Grace is not the absence of struggle." },
      { time: 9, text: "Grace is" },
      { time: 11, text: "Grace is the presence" },
      { time: 14, text: "Grace is the presence of God" },
      { time: 17, text: "in the midst of the struggle." }
    ],
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)',
    bgType: 'gradient',
    textColor: 'text-white',
    templateId: 'elegant',
    createdAt: '2026-07-02T14:30:00Z',
    user: {
      name: "Pastor David Platt",
      username: "david_platt",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      churchAffiliation: "McLean Bible Church"
    }
  },
  {
    id: 'quote-2',
    quote: "Your current situation is not your final destination. God is still writing your story, and He never runs out of ink.",
    scripture: "Philippians 1:6",
    scriptureVersion: "NIV",
    speaker: "Pastor Steven Furtick",
    church: "Elevation Church",
    topic: "Hope",
    hashtags: ['Hope', 'ElevationChurch', 'Future', 'GodsPlan', 'StevenFurtick'],
    likesCount: 512,
    commentsCount: 42,
    savesCount: 388,
    sharesCount: 189,
    isLiked: false,
    isSaved: false,
    insight: "Whenever I feel stuck, I remember He who began a good work in me will bring it to completion!",
    audioUrl: "furtick-ink-clip",
    audioDuration: 18,
    audioTimeline: [
      { time: 0, text: "Your current situation" },
      { time: 3, text: "is not your final destination." },
      { time: 7, text: "God is still writing your story," },
      { time: 12, text: "and He never runs out of ink." }
    ],
    background: 'radial-gradient(circle at top left, #311042, #100720, #050112)',
    bgType: 'illustration',
    textColor: 'text-purple-100',
    templateId: 'dark',
    createdAt: '2026-07-03T09:15:00Z',
    user: {
      name: "Elevation Church",
      username: "elevationchurch",
      avatar: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=150",
      churchAffiliation: "Elevation Church"
    }
  },
  {
    id: 'quote-3',
    quote: "We don't pray to change God's mind. We pray to let God change our hearts.",
    scripture: "Luke 11:1",
    scriptureVersion: "NKJV",
    speaker: "Pastor Tim Keller",
    church: "Redeemer Presbyterian Church",
    topic: "Prayer",
    hashtags: ['Prayer', 'TimKeller', 'HeartChange', 'SpiritualGrowth'],
    likesCount: 189,
    commentsCount: 9,
    savesCount: 95,
    sharesCount: 34,
    isLiked: false,
    isSaved: true,
    insight: "Prayer isn't a vending machine. It's a relationship. Tim Keller's legacy continues to bless my mornings.",
    background: '#fafaf9',
    bgType: 'solid',
    textColor: 'text-stone-900',
    templateId: 'minimal',
    createdAt: '2026-07-03T12:00:00Z',
    user: {
      name: "Tim Keller Legacy",
      username: "timkeller_legacy",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      churchAffiliation: "Redeemer NYC"
    }
  },
  {
    id: 'quote-4',
    quote: "If God is leading you into deep waters, trust Him completely. He is not trying to drown you; He is teaching you how to swim.",
    scripture: "Isaiah 43:2",
    scriptureVersion: "NIV",
    speaker: "Pastor Christine Caine",
    church: "A21 / Zoe Church",
    topic: "Faith",
    hashtags: ['Faith', 'Trust', 'ChristineCaine', 'Overcoming', 'ZoeChurch'],
    likesCount: 340,
    commentsCount: 22,
    savesCount: 198,
    sharesCount: 88,
    isLiked: false,
    isSaved: true,
    insight: "Deep waters require deep trust. Such an empowering sermon on active faith and resilience!",
    audioUrl: "christine-swim-clip",
    audioDuration: 25,
    audioTimeline: [
      { time: 0, text: "If God is leading you into deep waters," },
      { time: 4, text: "trust Him completely." },
      { time: 9, text: "He is not trying to drown you;" },
      { time: 14, text: "He is teaching you" },
      { time: 18, text: "how to swim." }
    ],
    background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)',
    bgType: 'gradient',
    textColor: 'text-white',
    templateId: 'modern',
    createdAt: '2026-07-03T15:45:00Z',
    user: {
      name: "Christine Caine",
      username: "christinecaine",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      churchAffiliation: "Zoe Church LA"
    }
  },
  {
    id: 'quote-5',
    quote: "True worship is when our love for God outweighs our love for what He can do for us.",
    scripture: "John 4:24",
    scriptureVersion: "ESV",
    speaker: "Matt Redman",
    church: "Worship Leader",
    topic: "Worship",
    hashtags: ['Worship', 'MattRedman', 'PureAdoration', 'HeartOfWorship'],
    likesCount: 421,
    commentsCount: 31,
    savesCount: 260,
    sharesCount: 110,
    isLiked: false,
    isSaved: true,
    insight: "A powerful reminder to seek His face, not just His hands. Authentic worship is selfless.",
    audioUrl: "redman-worship-clip",
    audioDuration: 30,
    audioTimeline: [
      { time: 0, text: "True worship is when" },
      { time: 3, text: "our love for God outweighs" },
      { time: 7, text: "our love for what He can do for us." },
      { time: 13, text: "It's about seeking His face," },
      { time: 19, text: "not just His hand." }
    ],
    background: 'linear-gradient(135deg, #7c2d12 0%, #db2777 60%, #f43f5e 100%)',
    bgType: 'gradient',
    textColor: 'text-white',
    templateId: 'worship',
    createdAt: '2026-07-01T18:20:00Z',
    user: {
      name: "Matt Redman",
      username: "matt_redman",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      churchAffiliation: "Worship Central"
    }
  },
  {
    id: 'quote-6',
    quote: "God is most glorified in us when we are most satisfied in Him.",
    scripture: "Psalm 16:11",
    scriptureVersion: "ESV",
    speaker: "Pastor John Piper",
    church: "Desiring God",
    topic: "Purpose",
    hashtags: ['Glorified', 'JohnPiper', 'DesiringGod', 'Satisfaction', 'Joy'],
    likesCount: 388,
    commentsCount: 24,
    savesCount: 215,
    sharesCount: 92,
    isLiked: false,
    isSaved: false,
    insight: "Christian Hedonism defined. When we find our ultimate treasure and pleasure in God, we honor Him most.",
    background: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #fbbf24 100%)',
    bgType: 'gradient',
    textColor: 'text-white',
    templateId: 'church',
    createdAt: '2026-07-03T17:10:00Z',
    user: {
      name: "John Piper",
      username: "john_piper",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      churchAffiliation: "Desiring God Ministries"
    }
  },
  {
    id: 'quote-7',
    quote: "You are the only Bible some people will ever read. Make sure your life represents the Savior well.",
    scripture: "2 Corinthians 3:2",
    scriptureVersion: "NIV",
    speaker: "Billy Graham",
    church: "BGEA",
    topic: "Revival",
    hashtags: ['BillyGraham', 'Witness', 'Savior', 'LivingEpistle', 'Inspiration'],
    likesCount: 610,
    commentsCount: 56,
    savesCount: 412,
    sharesCount: 295,
    isLiked: false,
    isSaved: false,
    insight: "A challenging word on daily integrity. Our actions speak louder than our theological declarations.",
    background: 'radial-gradient(circle at bottom right, #e0e7ff, #f1f5f9, #ffffff)',
    bgType: 'illustration',
    textColor: 'text-indigo-950',
    templateId: 'minimal',
    createdAt: '2026-07-03T10:30:00Z',
    user: {
      name: "Billy Graham Legacy",
      username: "billy_graham",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      churchAffiliation: "Billy Graham Association"
    }
  },
  {
    id: 'quote-8',
    quote: "He is no fool who gives what he cannot keep to gain what he cannot lose.",
    scripture: "Mark 8:36",
    scriptureVersion: "ESV",
    speaker: "Jim Elliot",
    church: "Ecuador Mission",
    topic: "Purpose",
    hashtags: ['JimElliot', 'Sacrifice', 'EternalPerspective', 'Mission', 'Legacy'],
    likesCount: 289,
    commentsCount: 15,
    savesCount: 173,
    sharesCount: 64,
    isLiked: false,
    isSaved: false,
    insight: "Such dynamic resolve. Trading temporary earthly comforts for eternal kingdom treasures is the highest wisdom.",
    background: '#0f172a',
    bgType: 'solid',
    textColor: 'text-white',
    templateId: 'modern',
    createdAt: '2026-07-02T08:00:00Z',
    user: {
      name: "Missionary Archives",
      username: "mission_archives",
      avatar: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=150",
      churchAffiliation: "Gates of Splendor"
    }
  },
  {
    id: 'quote-9',
    quote: "If you can't see His hand, trust His heart. He is working behind the scenes on your behalf.",
    scripture: "Isaiah 50:10",
    scriptureVersion: "NKJV",
    speaker: "Charles Spurgeon",
    church: "Metropolitan Tabernacle",
    topic: "Faith",
    hashtags: ['Spurgeon', 'TrustGod', 'FaithInDarkness', 'Sovereignty'],
    likesCount: 520,
    commentsCount: 37,
    savesCount: 310,
    sharesCount: 145,
    isLiked: false,
    isSaved: false,
    insight: "Spurgeon's words are timeless. When circumstances make no sense, we rest secure in God's perfect, loving character.",
    background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c084fc 100%)',
    bgType: 'gradient',
    textColor: 'text-white',
    templateId: 'elegant',
    createdAt: '2026-07-03T18:45:00Z',
    user: {
      name: "Spurgeon Gems",
      username: "spurgeon_gems",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      churchAffiliation: "Spurgeon's Tabernacle"
    }
  },
  {
    id: 'quote-10',
    quote: "God doesn't call the qualified, He qualifies the called. Take the first step, and He will supply the grace.",
    scripture: "1 Corinthians 1:27",
    scriptureVersion: "NIV",
    speaker: "Pastor Priscilla Shirer",
    church: "Going Beyond Ministries",
    topic: "Grace",
    hashtags: ['Qualified', 'Grace', 'Called', 'PriscillaShirer', 'GoingBeyond'],
    likesCount: 450,
    commentsCount: 29,
    savesCount: 275,
    sharesCount: 124,
    isLiked: false,
    isSaved: false,
    insight: "I needed this! I often feel inadequate to lead worship, but God equips us in our obedience.",
    background: 'linear-gradient(135deg, #7c2d12 0%, #db2777 60%, #f43f5e 100%)',
    bgType: 'gradient',
    textColor: 'text-white',
    templateId: 'conference',
    createdAt: '2026-07-03T11:20:00Z',
    user: {
      name: "Priscilla Shirer",
      username: "priscilla_shirer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      churchAffiliation: "Going Beyond"
    }
  }
];

export const INITIAL_TOPICS = [
  { name: 'Faith', count: 142, icon: 'Shield' },
  { name: 'Grace', count: 118, icon: 'Heart' },
  { name: 'Prayer', count: 96, icon: 'Sparkles' },
  { name: 'Hope', count: 85, icon: 'Compass' },
  { name: 'Worship', count: 77, icon: 'Music' },
  { name: 'Revival', count: 64, icon: 'Flame' },
  { name: 'Purpose', count: 53, icon: 'Flag' },
  { name: 'Love', count: 120, icon: 'Smile' },
  { name: 'Healing', count: 42, icon: 'Activity' }
];

export const SAMPLE_COMMENTS = [
  { id: 'c1', username: 'john_doe', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', text: 'Amen! Exactly what I needed to hear today.', createdAt: '2h ago' },
  { id: 'c2', username: 'grace_bell', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', text: 'Pastor David Platt hits home with this core message.', createdAt: '4h ago' },
  { id: 'c3', username: 'luke_sky', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', text: 'Saving this directly to my collections. Incredible.', createdAt: '1d ago' }
];
