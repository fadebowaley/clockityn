import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';
import { 
  Home, 
  Search, 
  PlusCircle, 
  Bookmark, 
  User, 
  Sparkles, 
  Bell, 
  Send,
  Lock,
  Mail,
  LogOut,
  Apple,
  Camera,
  Heart
} from 'lucide-react-native';
import { SermonQuote, UserProfile, Collection, ActiveTab } from './types';
import { INITIAL_QUOTES, INITIAL_USER_PROFILE } from './data';
import { HomeFeed } from './components/HomeFeed';
import { SearchDiscovery } from './components/SearchDiscovery';
import { CreateQuote } from './components/CreateQuote';
import { ProfileView } from './components/ProfileView';
import { AudioPlayer } from './components/AudioPlayer';

export default function App() {
  // Primary Application States
  const [quotes, setQuotes] = useState<SermonQuote[]>(INITIAL_QUOTES);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  
  // Streaming Audio States
  const [playingQuote, setPlayingQuote] = useState<SermonQuote | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // App Settings / Notification States
  const [showBellNotification, setShowBellNotification] = useState(false);
  const [bellMessage, setBellMessage] = useState('Notification: Pastor Matt Redman liked your saved Scripture collections!');

  // Auth and Splash State Flow
  const [appState, setAppState] = useState<'splash' | 'auth' | 'app'>('splash');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Auto transition from splash to auth
  React.useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState('auth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Like interaction handler
  const handleLike = (quoteId: string) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(q => {
        if (q.id === quoteId) {
          const updatedLiked = !q.isLiked;
          return {
            ...q,
            isLiked: updatedLiked,
            likesCount: updatedLiked ? q.likesCount + 1 : q.likesCount - 1
          };
        }
        return q;
      })
    );
  };

  // Save interaction handler with Collection sync!
  const handleSave = (quoteId: string) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(q => {
        if (q.id === quoteId) {
          const updatedSaved = !q.isSaved;
          
          // Cohesively add/remove quoteId from user collection lists
          setUserProfile(prevProfile => {
            let updatedCollections = [...prevProfile.savedCollections];
            
            if (updatedSaved) {
              // Add to the general "Faith & Trust" collection as a fallback save destination
              updatedCollections = updatedCollections.map(col => {
                if (col.id === 'col-faith' && !col.quoteIds.includes(quoteId)) {
                  return { ...col, quoteIds: [...col.quoteIds, quoteId] };
                }
                return col;
              });
            } else {
              // Remove from all collections
              updatedCollections = updatedCollections.map(col => ({
                ...col,
                quoteIds: col.quoteIds.filter(id => id !== quoteId)
              }));
            }

            return {
              ...prevProfile,
              savedCollections: updatedCollections
            };
          });

          return {
            ...q,
            isSaved: updatedSaved,
            savesCount: updatedSaved ? q.savesCount + 1 : q.savesCount - 1
          };
        }
        return q;
      })
    );
  };

  // Play audio snippet or background stream
  const handlePlayAudio = (quote: SermonQuote) => {
    if (playingQuote?.id === quote.id) {
      // Toggle play pause if same quote
      setIsAudioPlaying(!isAudioPlaying);
    } else {
      setPlayingQuote(quote);
      setIsAudioPlaying(true);
    }
  };

  // Add a newly created collection folder
  const handleAddCollection = (newCollection: Collection) => {
    setUserProfile(prev => ({
      ...prev,
      savedCollections: [newCollection, ...prev.savedCollections]
    }));
  };

  // Post a brand new designed sermon quote card to the feed!
  const handlePublishQuote = (newQuote: Omit<SermonQuote, 'id' | 'likesCount' | 'commentsCount' | 'savesCount' | 'sharesCount' | 'isLiked' | 'isSaved' | 'createdAt'>) => {
    const freshQuote: SermonQuote = {
      ...newQuote,
      id: `quote-${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString()
    };

    setQuotes(prev => [freshQuote, ...prev]);
    
    // Increment quote count on user stats
    setUserProfile(prev => ({
      ...prev,
      quotesCount: prev.quotesCount + 1
    }));

    // Instantly navigate back to home feed to see their card published!
    setActiveTab('home');
  };

  const triggerCustomNotification = (message: string) => {
    setBellMessage(message);
    setShowBellNotification(true);
    setTimeout(() => setShowBellNotification(false), 4000);
  };

  // Helper to prefill search in feed
  const handleSearchWord = (word: string) => {
    setActiveTab('home');
  };

  const handleAuthSubmit = () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    if (!authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthError('');

    // Check for Instagram Clone dummy credentials
    if (authEmail.trim().toLowerCase() === 'admin@instagram.com' && authPassword.trim() === 'admin123') {
      setUserProfile({
        name: 'Instagram Admin',
        username: 'admin_insta',
        bio: 'Exploring and curating the finest sermon gems in Selah / Veritas Instagram Clone. 📸✨',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        followersCount: 8840,
        followingCount: 219,
        quotesCount: 4,
        savedCollections: INITIAL_USER_PROFILE.savedCollections,
      });
      setAppState('app');
      triggerCustomNotification("Signed in successfully with Admin Profile!");
      return;
    }

    // Create / Log In user profile dynamically
    const nameToUse = isSignUp ? (authName.trim() || 'Brother/Sister') : userProfile.name;
    const usernameToUse = authEmail.split('@')[0];
    
    setUserProfile({
      ...userProfile,
      name: nameToUse,
      username: usernameToUse,
      bio: isSignUp ? 'Newly joined the Veritas community. Growing in grace daily!' : userProfile.bio,
      avatar: isSignUp ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : userProfile.avatar,
    });
    
    setAppState('app');
    triggerCustomNotification(`Welcome to Veritas, ${nameToUse}!`);
  };

  const handleDummyFill = () => {
    setAuthEmail('admin@instagram.com');
    setAuthPassword('admin123');
    setAuthName('Instagram Admin');
    setAuthError('');
    triggerCustomNotification("Credentials populated! Press Sign In below.");
  };

  const handleQuickLogin = () => {
    setAuthEmail('sarah.j@gracecommunity.org');
    setAuthPassword('pass123');
    setAuthName('Sarah Jenkins');
    setAuthError('');
    setUserProfile({
      ...INITIAL_USER_PROFILE,
      name: 'Sarah Jenkins',
      username: 'sarah_j',
    });
    setAppState('app');
    triggerCustomNotification("Signed in as Guest! Meditating on God's word.");
  };

  const handleGoogleLogin = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthError('');
    setUserProfile({
      ...INITIAL_USER_PROFILE,
      name: 'Michael Gabriel',
      username: 'michael_g',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Worshipper, designer, and servant. Curation of gospel truths in visual formats.'
    });
    setAppState('app');
    triggerCustomNotification("Signed in successfully with Google!");
  };

  const handleAppleLogin = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthError('');
    setUserProfile({
      ...INITIAL_USER_PROFILE,
      name: 'Evelyn Grace',
      username: 'evelyn_grace',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'Saved by Grace. Saving sermon gems that feed my daily walk.'
    });
    setAppState('app');
    triggerCustomNotification("Signed in successfully with Apple!");
  };

  if (appState === 'splash') {
    return (
      <SafeAreaView style={styles.splashSafeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.splashContainer}>
          <View style={styles.splashContent}>
            <View style={styles.splashLogoBox}>
              <Text style={styles.splashLogoText}>S</Text>
            </View>
            <Text style={styles.splashTitle}>Veritas</Text>
            <Text style={styles.splashSubtitle}>BY SELAH</Text>
            
            <View style={styles.splashTaglineContainer}>
              <Text style={styles.splashTagline}>"Design, save, and meditate on golden sermon nuggets."</Text>
            </View>

            <View style={styles.splashBadge}>
              <Sparkles size={14} color="#fbbf24" style={{ marginRight: 6 }} />
              <Text style={styles.splashBadgeText}>Sermon Card Design Studio v1.4</Text>
            </View>

            <TouchableOpacity 
              id="splash-skip-button"
              onPress={() => setAppState('auth')}
              style={styles.splashBtn}
            >
              <Text style={styles.splashBtnText}>Enter Veritas →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.splashFooter}>
            <Text style={styles.splashFooterText}>✝️ Empowering Worship and Reflection</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (appState === 'auth') {
    return (
      <SafeAreaView style={styles.authSafeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.authContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.authScrollContainer}
          >
            <View style={styles.authCard}>
              {/* Instagram Style Logo */}
              <Text style={styles.authLogoBrand}>Selahgram</Text>
              
              {/* Minimal tagline description */}
              {isSignUp && (
                <Text style={styles.authTagline}>
                  Sign up to design and share beautiful sermon quotes.
                </Text>
              )}

              {/* Error Message */}
              {authError.length > 0 && (
                <View style={styles.authErrorBox}>
                  <Text style={styles.authErrorText}>⚠️ {authError}</Text>
                </View>
              )}

              {/* Form Fields */}
              <View style={styles.authForm}>
                {isSignUp && (
                  <TextInput 
                    id="signup-name-input"
                    placeholder="Full Name"
                    placeholderTextColor="#8e8e8e"
                    value={authName}
                    onChangeText={setAuthName}
                    style={styles.instaInput}
                  />
                )}

                <TextInput 
                  id="auth-email-input"
                  placeholder="Email"
                  placeholderTextColor="#8e8e8e"
                  value={authEmail}
                  onChangeText={setAuthEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.instaInput}
                />

                <TextInput 
                  id="auth-password-input"
                  placeholder="Password"
                  placeholderTextColor="#8e8e8e"
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  style={styles.instaInput}
                />

                <TouchableOpacity 
                  id="auth-submit-btn"
                  onPress={handleAuthSubmit}
                  style={styles.instaSubmitBtn}
                >
                  <Text style={styles.instaSubmitText}>
                    {isSignUp ? 'Sign Up' : 'Log In'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.authDivider}>
                  <View style={styles.authDividerLine} />
                  <Text style={styles.authDividerText}>OR</Text>
                  <View style={styles.authDividerLine} />
                </View>

                {/* Instant Demo Autologin (Styled as "Log in with Demo Admin" in Facebook Blue) */}
                <TouchableOpacity
                  id="autofill-demo-btn"
                  onPress={handleDummyFill}
                  style={styles.instaFbBtn}
                >
                  <Sparkles size={14} color="#385185" style={{ marginRight: 6 }} />
                  <Text style={styles.instaFbText}>Log in with Demo Admin</Text>
                </TouchableOpacity>

                {/* Micro clean links for social & guest */}
                <View style={styles.quickAccessRow}>
                  <TouchableOpacity
                    id="guest-login-btn"
                    onPress={handleQuickLogin}
                    style={styles.quickAccessLink}
                  >
                    <Text style={styles.quickAccessText}>Guest</Text>
                  </TouchableOpacity>
                  <Text style={styles.quickAccessDot}>•</Text>
                  <TouchableOpacity
                    id="google-login-btn"
                    onPress={handleGoogleLogin}
                    style={styles.quickAccessLink}
                  >
                    <Text style={styles.quickAccessText}>Google</Text>
                  </TouchableOpacity>
                  <Text style={styles.quickAccessDot}>•</Text>
                  <TouchableOpacity
                    id="apple-login-btn"
                    onPress={handleAppleLogin}
                    style={styles.quickAccessLink}
                  >
                    <Text style={styles.quickAccessText}>Apple</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>

            {/* Toggle Sign Up / Log In box (Separate box below card) */}
            <View style={styles.toggleBox}>
              <Text style={styles.toggleText}>
                {isSignUp ? "Have an account? " : "Don't have an account? "}
              </Text>
              <TouchableOpacity 
                id="auth-toggle-btn"
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError('');
                }}
              >
                <Text style={styles.toggleLink}>
                  {isSignUp ? 'Log In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Micro aesthetic Instagram footer links */}
            <View style={styles.instaFooter}>
              <Text style={styles.instaFooterLinks}>
                About  •  Help  •  API  •  Privacy  •  Terms  •  Locations
              </Text>
              <Text style={styles.instaFooterCopyright}>
                © {new Date().getFullYear()} SELAHGRAM FROM VERITAS
              </Text>
            </View>

          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        
        {/* Navigation Sidebar (For Desktop Web viewport) */}
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.brandRow}>
            <View style={styles.brandLogoBox}>
              <Text style={styles.brandLogoLetter}>S</Text>
            </View>
            <View style={styles.brandTexts}>
              <Text style={styles.brandMainTitle}>Veritas</Text>
              <Text style={styles.brandSubLabel}>BY SELAH</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.navBlock}>
            <Text style={styles.navHeader}>DISCOVERY</Text>
            
            <TouchableOpacity 
              onPress={() => setActiveTab('home')}
              style={[styles.sidebarTab, activeTab === 'home' && styles.sidebarTabActive]}
            >
              <Home size={16} color={activeTab === 'home' ? '#4f46e5' : '#64748b'} />
              <Text style={[styles.sidebarTabLabel, activeTab === 'home' && styles.sidebarTabLabelActive]}>Home Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setActiveTab('search')}
              style={[styles.sidebarTab, activeTab === 'search' && styles.sidebarTabActive]}
            >
              <Search size={16} color={activeTab === 'search' ? '#4f46e5' : '#64748b'} />
              <Text style={[styles.sidebarTabLabel, activeTab === 'search' && styles.sidebarTabLabelActive]}>Explore & Trending</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setActiveTab('create')}
              style={[styles.sidebarTab, activeTab === 'create' && styles.sidebarTabActive]}
            >
              <PlusCircle size={16} color={activeTab === 'create' ? '#4f46e5' : '#64748b'} />
              <Text style={[styles.sidebarTabLabel, activeTab === 'create' && styles.sidebarTabLabelActive]}>Design Studio</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setActiveTab('collections')}
              style={[styles.sidebarTab, (activeTab === 'collections' || activeTab === 'profile') && styles.sidebarTabActive]}
            >
              <Bookmark size={16} color={(activeTab === 'collections' || activeTab === 'profile') ? '#4f46e5' : '#64748b'} />
              <Text style={[styles.sidebarTabLabel, (activeTab === 'collections' || activeTab === 'profile') && styles.sidebarTabLabelActive]}>Saves & Folders</Text>
            </TouchableOpacity>
          </View>

          {/* User profile footer info */}
          <View style={styles.sidebarUserBox}>
            <Image 
              source={{ uri: userProfile.avatar }} 
              style={styles.sidebarAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.sidebarUserName} numberOfLines={1}>{userProfile.name}</Text>
              <Text style={styles.sidebarUserHandle} numberOfLines={1}>@{userProfile.username}</Text>
            </View>
          </View>
        </View>

        {/* Central Mobile Frame Simulation */}
        <View style={styles.phoneContainer}>
          <View style={styles.phoneWrapper}>
            
            {/* Devices Top Bar */}
            <View style={styles.statusBarMock}>
              <Text style={styles.statusTime}>9:41</Text>
              <View style={styles.statusIcons}>
                <Text style={styles.statusWifi}>📶</Text>
                <Text style={styles.statusBattery}>🔋</Text>
              </View>
            </View>

            {/* App Header */}
            <View style={styles.appHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity 
                  id="header-camera-btn"
                  onPress={() => triggerCustomNotification("Camera access initialized! Ready to scan quote handouts or book pages.")}
                  style={{ marginRight: 10 }}
                >
                  <Camera size={20} color="#1e293b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('home')}>
                  <Text style={styles.headerTitle}>Selahgram</Text>
                  <Text style={styles.headerSubtitle}>VERITAS SERMONS</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.headerIcons}>
                <TouchableOpacity 
                  id="header-notification-likes"
                  onPress={() => triggerCustomNotification("Worship Pastor Matt Redman and 4 others liked your posted sermon quotes!")}
                  style={styles.headerIconBtn}
                >
                  <Heart size={18} color="#1e293b" />
                  <View style={styles.redDot} />
                </TouchableOpacity>

                <TouchableOpacity 
                  id="header-chat-button"
                  onPress={() => triggerCustomNotification("Selahgram Direct Messages connected! Chat with your church community.")}
                  style={styles.headerIconBtn}
                >
                  <Send size={18} color="#1e293b" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Banner Notification Alert */}
            {showBellNotification && (
              <View style={styles.bellBanner}>
                <Sparkles size={14} color="#f59e0b" style={{ marginRight: 6 }} />
                <Text style={styles.bellBannerText}>{bellMessage}</Text>
              </View>
            )}

            {/* Master Scroll Area */}
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollAreaContent} showsVerticalScrollIndicator={false}>
              {activeTab === 'home' && (
                <HomeFeed 
                  quotes={quotes}
                  onLike={handleLike}
                  onSave={handleSave}
                  onPlayAudio={handlePlayAudio}
                  currentPlayingId={playingQuote?.id}
                  isAudioPlaying={isAudioPlaying}
                  profile={userProfile}
                />
              )}

              {activeTab === 'search' && (
                <SearchDiscovery 
                  quotes={quotes}
                  onSelectQuote={(q) => {
                    setPlayingQuote(q);
                    setIsAudioPlaying(true);
                    setActiveTab('home');
                  }}
                  onSelectTopic={(topicName) => {
                    handleSearchWord(topicName);
                  }}
                />
              )}

              {activeTab === 'create' && (
                <CreateQuote 
                  onPublish={handlePublishQuote}
                  onSuccess={() => {
                    triggerCustomNotification("Glory! Your beautifully designed sermon quote is now live on the feed.");
                  }}
                  profile={userProfile}
                />
              )}

              {activeTab === 'collections' && (
                <ProfileView 
                  profile={userProfile}
                  quotes={quotes}
                  onLike={handleLike}
                  onSave={handleSave}
                  onPlayAudio={handlePlayAudio}
                  currentPlayingId={playingQuote?.id}
                  isAudioPlaying={isAudioPlaying}
                  onAddCollection={handleAddCollection}
                  onLogout={() => {
                    setAppState('auth');
                    setAuthEmail('');
                    setAuthPassword('');
                    setAuthName('');
                    setAuthError('');
                    triggerCustomNotification("Signed out safely. Grace be with you!");
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView 
                  profile={userProfile}
                  quotes={quotes}
                  onLike={handleLike}
                  onSave={handleSave}
                  onPlayAudio={handlePlayAudio}
                  currentPlayingId={playingQuote?.id}
                  isAudioPlaying={isAudioPlaying}
                  onAddCollection={handleAddCollection}
                  onLogout={() => {
                    setAppState('auth');
                    setAuthEmail('');
                    setAuthPassword('');
                    setAuthName('');
                    setAuthError('');
                    triggerCustomNotification("Signed out safely. Grace be with you!");
                  }}
                />
              )}
            </ScrollView>

            {/* Audio Player Sync Bar */}
            <AudioPlayer 
              currentQuote={playingQuote}
              isPlaying={isAudioPlaying}
              onPlayToggle={setIsAudioPlaying}
              onClose={() => {
                setPlayingQuote(null);
                setIsAudioPlaying(false);
              }}
            />

            {/* Navigation footer tabs */}
            <View style={styles.tabBar}>
              {[
                { id: 'home', label: 'Feed', icon: Home },
                { id: 'search', label: 'Explore', icon: Search },
                { id: 'create', label: 'Create', icon: PlusCircle, isMain: true },
                { id: 'collections', label: 'Folders', icon: Bookmark },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                if (tab.isMain) {
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      id={`nav-btn-${tab.id}`}
                      onPress={() => setActiveTab(tab.id as ActiveTab)}
                      style={styles.mainTabBtn}
                    >
                      <View style={styles.mainTabGradient}>
                        <PlusCircle size={20} color="#ffffff" />
                      </View>
                      <Text style={styles.mainTabLabel}>{tab.label}</Text>
                    </TouchableOpacity>
                  );
                }

                return (
                  <TouchableOpacity
                    key={tab.id}
                    id={`nav-btn-${tab.id}`}
                    onPress={() => setActiveTab(tab.id as ActiveTab)}
                    style={styles.tabBtnItem}
                  >
                    <Icon size={18} color={isActive ? '#4f46e5' : '#94a3b8'} />
                    <Text style={[styles.tabBtnLabel, isActive && styles.tabBtnLabelActive]}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    display: 'none', // Simple hiding since Central Mobile Phone Frame handles everything for web & phone
    width: 250,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    padding: 24,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  brandLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoLetter: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  brandTexts: {
    marginLeft: 10,
  },
  brandMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  brandSubLabel: {
    fontSize: 8,
    color: '#4f46e5',
    fontWeight: '800',
    letterSpacing: 1,
  },
  navBlock: {
    flex: 1,
  },
  navHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  sidebarTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  sidebarTabActive: {
    backgroundColor: '#f5f3ff',
  },
  sidebarTabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginLeft: 12,
  },
  sidebarTabLabelActive: {
    color: '#4f46e5',
  },
  sidebarUserBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sidebarAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  sidebarUserName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  sidebarUserHandle: {
    fontSize: 9,
    color: '#94a3b8',
  },
  phoneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  phoneWrapper: {
    width: '100%',
    maxWidth: 390,
    height: '100%',
    maxHeight: 760,
    backgroundColor: '#ffffff',
    borderWidth: 8,
    borderColor: '#0f172a',
    borderRadius: 36,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  statusBarMock: {
    height: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statusTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusIcons: {
    flexDirection: 'row',
  },
  statusWifi: {
    fontSize: 10,
    marginRight: 4,
  },
  statusBattery: {
    fontSize: 10,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLogoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoLetter: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 7,
    fontWeight: '800',
    color: '#c13584',
    letterSpacing: 2,
    marginTop: -2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  bellBanner: {
    backgroundColor: '#4f46e5',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBannerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollAreaContent: {
    padding: 12,
    paddingBottom: 80,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tabBtnItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 4,
  },
  tabBtnLabelActive: {
    color: '#4f46e5',
    fontWeight: '800',
  },
  mainTabBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -12 }],
  },
  mainTabGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mainTabLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4f46e5',
    marginTop: 4,
  },
  // Splash Screen Styles
  splashSafeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  splashLogoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  splashLogoText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#818cf8',
    letterSpacing: 4,
    marginTop: 4,
    marginBottom: 24,
  },
  splashTaglineContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 24,
  },
  splashTagline: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  splashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    marginBottom: 32,
  },
  splashBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fbbf24',
  },
  splashBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  splashBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  splashFooter: {
    paddingBottom: 16,
  },
  splashFooterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  // Auth Page Styles
  authSafeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  authScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  authCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    alignItems: 'center',
  },
  authLogoBrand: {
    fontFamily: 'serif',
    fontSize: 42,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#262626',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
  },
  authTagline: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8e8e8e',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  authErrorBox: {
    width: '100%',
    backgroundColor: '#fff2f2',
    borderWidth: 1,
    borderColor: '#ffd2d2',
    borderRadius: 4,
    padding: 10,
    marginBottom: 14,
  },
  authErrorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ed4956',
    textAlign: 'center',
  },
  authForm: {
    width: '100%',
  },
  instaInput: {
    width: '100%',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 12,
    color: '#262626',
    marginBottom: 8,
  },
  instaSubmitBtn: {
    width: '100%',
    backgroundColor: '#0095f6',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  instaSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  authDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    width: '100%',
  },
  authDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dbdbdb',
  },
  authDividerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8e8e8e',
    marginHorizontal: 16,
  },
  instaFbBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%',
    marginBottom: 16,
  },
  instaFbText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#385185',
  },
  quickAccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  quickAccessLink: {
    paddingVertical: 4,
  },
  quickAccessText: {
    fontSize: 11,
    color: '#8e8e8e',
    fontWeight: '600',
  },
  quickAccessDot: {
    fontSize: 11,
    color: '#dbdbdb',
    marginHorizontal: 8,
  },
  toggleBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleText: {
    fontSize: 13,
    color: '#262626',
  },
  toggleLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0095f6',
  },
  instaFooter: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  instaFooterLinks: {
    fontSize: 10,
    color: '#8e8e8e',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  instaFooterCopyright: {
    fontSize: 10,
    color: '#8e8e8e',
    textAlign: 'center',
    fontWeight: '600',
  }
});
