import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { 
  Sparkles, 
  Flame, 
  Bookmark, 
  Music, 
  RefreshCw, 
  Grid, 
  AlertCircle, 
  ArrowDown,
  X,
  Send,
  Heart
} from 'lucide-react-native';
import { SermonQuote, UserProfile } from '../types';
import { SermonCard } from './SermonCard';

interface HomeFeedProps {
  quotes: SermonQuote[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onPlayAudio: (quote: SermonQuote) => void;
  currentPlayingId?: string;
  isAudioPlaying?: boolean;
  profile?: UserProfile;
}

type FilterType = 'all' | 'trending' | 'recent' | 'saved' | 'listened';

interface StoryItem {
  id: string;
  name: string;
  avatar: string;
  hasUnread: boolean;
  quote: string;
  scripture: string;
  background: string;
  textColor: string;
}

const STORY_PRESETS: StoryItem[] = [
  {
    id: 'your-story',
    name: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    hasUnread: false,
    quote: "Selahgram is live! Keep reflecting, designing, and sharing the beautiful Word.",
    scripture: "Psalm 46:10",
    background: 'linear-gradient(135deg, #4f46e5, #ec4899)',
    textColor: '#ffffff'
  },
  {
    id: 'story-1',
    name: 'David Platt',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    hasUnread: true,
    quote: "We don’t just want to escape hell. We want to enjoy Christ in the fullness of His glory.",
    scripture: "Philippians 1:21",
    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    textColor: '#ffffff'
  },
  {
    id: 'story-2',
    name: 'Tim Keller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    hasUnread: true,
    quote: "The Gospel says you are more sinful than you ever dared believe, and more loved than you ever dared hope.",
    scripture: "Romans 5:8",
    background: 'linear-gradient(135deg, #111827, #374151)',
    textColor: '#ffffff'
  },
  {
    id: 'story-3',
    name: 'Christine Caine',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    hasUnread: true,
    quote: "God doesn’t call the qualified. He qualifies the called. Keep trusting His faithful timing.",
    scripture: "Hebrews 11:1",
    background: 'linear-gradient(135deg, #7c2d12, #ea580c)',
    textColor: '#ffffff'
  },
  {
    id: 'story-4',
    name: 'Elevation',
    avatar: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=150',
    hasUnread: true,
    quote: "Stop asking God to bless what you’re doing and start doing what God is already blessing.",
    scripture: "Matthew 6:33",
    background: 'linear-gradient(135deg, #064e3b, #10b981)',
    textColor: '#ffffff'
  }
];

export const HomeFeed: React.FC<HomeFeedProps> = ({
  quotes,
  onLike,
  onSave,
  onPlayAudio,
  currentPlayingId,
  isAudioPlaying,
  profile
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stories States
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyRepliedText, setStoryRepliedText] = useState('');
  const [unreadStories, setUnreadStories] = useState<string[]>(['story-1', 'story-2', 'story-3', 'story-4']);
  const progressTimer = useRef<any>(null);

  // Dynamic user avatar for story
  const dynamicStories = STORY_PRESETS.map((story) => {
    if (story.id === 'your-story' && profile) {
      return {
        ...story,
        avatar: profile.avatar || story.avatar
      };
    }
    return story;
  });

  // Handle Pull-to-Refresh Simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage('Feed refreshed with new spiritual insights!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Simulate Load More
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 2, filteredQuotes.length));
      setIsLoadingMore(false);
    }, 1000);
  };

  // Filter and Search quote items
  const filteredQuotes = quotes.filter(q => {
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      q.quote.toLowerCase().includes(query) ||
      q.scripture.toLowerCase().includes(query) ||
      q.speaker.toLowerCase().includes(query) ||
      q.church.toLowerCase().includes(query) ||
      q.topic.toLowerCase().includes(query) ||
      q.hashtags.some(tag => tag.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'trending') return q.likesCount > 250;
    if (activeFilter === 'recent') return q.createdAt.includes('2026-07-03') || q.createdAt.includes('2026-07-04') || q.id.startsWith('quote-');
    if (activeFilter === 'saved') return q.isSaved;
    if (activeFilter === 'listened') return !!q.audioUrl;
    
    return true;
  });

  const quotesToRender = filteredQuotes.slice(0, visibleCount);

  // Stories Logic
  const openStory = (idx: number) => {
    setActiveStoryIdx(idx);
    setStoryProgress(0);
    setStoryRepliedText('');
    const storyId = dynamicStories[idx].id;
    if (unreadStories.includes(storyId)) {
      setUnreadStories(prev => prev.filter(id => id !== storyId));
    }
  };

  const closeStory = () => {
    setActiveStoryIdx(null);
    setStoryProgress(0);
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
    }
  };

  // Story Progress Effect
  useEffect(() => {
    if (activeStoryIdx !== null) {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
      
      const intervalMs = 50; // Update every 50ms
      const durationMs = 5000; // 5 seconds total duration
      const steps = durationMs / intervalMs;
      
      progressTimer.current = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressTimer.current!);
            // Go to next story if available, else close
            if (activeStoryIdx < dynamicStories.length - 1) {
              setTimeout(() => {
                openStory(activeStoryIdx + 1);
              }, 100);
            } else {
              closeStory();
            }
            return 100;
          }
          return prev + (100 / steps);
        });
      }, intervalMs);
    }

    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, [activeStoryIdx]);

  const handleSendStoryReply = (customMsg?: string) => {
    const textToSend = customMsg || storyRepliedText;
    if (!textToSend.trim()) return;

    const speakerName = dynamicStories[activeStoryIdx!].name;
    setToastMessage(`Direct message sent to ${speakerName}!`);
    setTimeout(() => setToastMessage(null), 3000);
    setStoryRepliedText('');
    closeStory();
  };

  return (
    <View style={styles.container}>
      {/* Toast Banner */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ {toastMessage}</Text>
        </View>
      )}

      {/* Instagram Stories Bar */}
      <View style={styles.storiesBarContainer}>
        <Text style={styles.sectionTitle}>Sermon Highlights</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesScroll}
        >
          {dynamicStories.map((story, idx) => {
            const isUnread = unreadStories.includes(story.id);
            return (
              <TouchableOpacity 
                key={story.id} 
                onPress={() => openStory(idx)}
                style={styles.storyItemWrapper}
              >
                <View style={[
                  styles.storyAvatarBorder, 
                  isUnread && styles.storyAvatarBorderUnread,
                  story.id === 'your-story' && styles.yourStoryBorder
                ]}>
                  <Image 
                    source={{ uri: story.avatar }} 
                    style={styles.storyAvatar} 
                    referrerPolicy="no-referrer"
                  />
                  {story.id === 'your-story' && (
                    <View style={styles.yourStoryPlus}>
                      <Text style={styles.yourStoryPlusText}>+</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.storyName} numberOfLines={1}>
                  {story.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter and Search Panel */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View style={styles.headerIndicator}>
            <View style={styles.greenPulse} />
            <Text style={styles.panelTitle}>Active Faith Feed</Text>
          </View>

          <TouchableOpacity 
            onPress={handleRefresh}
            disabled={isRefreshing}
            style={styles.refreshBtn}
          >
            <RefreshCw size={13} color="#4f46e5" />
            <Text style={styles.refreshText}>{isRefreshing ? 'Refreshing...' : 'Pull to Refresh'}</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput 
            id="feed-search-input"
            placeholder="Search Scripture, Pastor, Topic or Church..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setVisibleCount(3);
            }}
            style={styles.searchInput}
          />
          <Text style={styles.searchIcon}>🔎</Text>
        </View>

        {/* Filter Scroll Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { id: 'all', label: 'All Quotes', icon: Grid },
            { id: 'trending', label: 'Trending', icon: Flame },
            { id: 'recent', label: 'Recently Shared', icon: Sparkles },
            { id: 'saved', label: 'Most Saved', icon: Bookmark },
            { id: 'listened', label: 'Most Listened', icon: Music },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  setActiveFilter(tab.id as FilterType);
                  setVisibleCount(3);
                }}
                style={[styles.filterTab, isActive ? styles.filterTabActive : styles.filterTabInactive]}
              >
                <Icon size={12} color={isActive ? '#ffffff' : '#64748b'} />
                <Text style={[styles.filterLabel, isActive ? styles.filterLabelActive : styles.filterLabelInactive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Quote Stream */}
      <View style={styles.feedList}>
        {isRefreshing && (
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator color="#4f46e5" size="small" />
            <Text style={styles.loadingSpinnerText}>Loading latest messages...</Text>
          </View>
        )}

        {quotesToRender.length > 0 ? (
          quotesToRender.map((quote) => (
            <SermonCard 
              key={quote.id}
              quote={quote}
              onLike={onLike}
              onSave={onSave}
              onPlayAudio={onPlayAudio}
              currentPlayingId={currentPlayingId}
              isAudioPlaying={isAudioPlaying}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <AlertCircle size={24} color="#f59e0b" />
            </View>
            <Text style={styles.emptyTitle}>No quotes match your search</Text>
            <Text style={styles.emptySubtitle}>Try checking your spelling, looking for another pastor, or exploring a general topic like 'Faith'.</Text>
            <TouchableOpacity 
              onPress={() => { setSearchQuery(''); setActiveFilter('all'); }}
              style={styles.clearBtn}
            >
              <Text style={styles.clearBtnText}>Clear Search & Filter</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Load More Button */}
        {filteredQuotes.length > visibleCount && (
          <View style={styles.loadMoreContainer}>
            {isLoadingMore ? (
              <ActivityIndicator color="#4f46e5" size="small" style={{ marginVertical: 16 }} />
            ) : (
              <TouchableOpacity 
                onPress={handleLoadMore}
                style={styles.loadMoreBtn}
              >
                <Text style={styles.loadMoreBtnText}>Discover More Quotes</Text>
                <ArrowDown size={14} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Full Screen Instagram Story Player Overlay */}
      {activeStoryIdx !== null && (
        <View style={styles.storyOverlayContainer}>
          {/* Progress segments bar */}
          <View style={styles.storyProgressHeader}>
            {dynamicStories.map((s, i) => {
              let fill = 0;
              if (i < activeStoryIdx) fill = 100;
              else if (i === activeStoryIdx) fill = storyProgress;
              return (
                <View key={s.id} style={styles.storyProgressTrack}>
                  <View style={[styles.storyProgressFill, { width: `${fill}%` }]} />
                </View>
              );
            })}
          </View>

          {/* Speaker header row */}
          <View style={styles.storySpeakerHeader}>
            <View style={styles.storySpeakerLeft}>
              <Image 
                source={{ uri: dynamicStories[activeStoryIdx].avatar }} 
                style={styles.storySpeakerAvatar}
              />
              <View>
                <Text style={styles.storySpeakerName}>{dynamicStories[activeStoryIdx].name}</Text>
                <Text style={styles.storySpeakerTime}>Selahgram Highlight</Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeStory} style={styles.storyCloseBtn}>
              <X size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Visual card content */}
          <View style={styles.storyMainStage}>
            <View style={[
              styles.storyQuoteCard, 
              { background: dynamicStories[activeStoryIdx].background } as any
            ]}>
              <Text style={styles.storyQuoteDecoration}>“</Text>
              <Text style={[styles.storyQuoteText, { color: dynamicStories[activeStoryIdx].textColor }]}>
                {dynamicStories[activeStoryIdx].quote}
              </Text>
              <View style={styles.storyDividerLine} />
              <Text style={styles.storyScriptureReference}>
                {dynamicStories[activeStoryIdx].scripture}
              </Text>
            </View>
          </View>

          {/* Quick Reaction Box */}
          <View style={styles.quickReactionsRow}>
            {['🔥', '🙌', '💯', '❤️', '🙏', '✨'].map((emoji) => (
              <TouchableOpacity 
                key={emoji} 
                onPress={() => handleSendStoryReply(`Sent reaction: ${emoji}`)}
                style={styles.reactionBtn}
              >
                <Text style={{ fontSize: 18 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Interactive Message Bar */}
          <View style={styles.storyFooterBar}>
            <TextInput 
              placeholder="Send quick reply..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={storyRepliedText}
              onChangeText={setStoryRepliedText}
              style={styles.storyReplyInput}
            />
            <TouchableOpacity 
              onPress={() => handleSendStoryReply()}
              disabled={!storyRepliedText.trim()}
              style={[styles.storySendBtn, !storyRepliedText.trim() && { opacity: 0.5 }]}
            >
              <Send size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toast: {
    backgroundColor: '#0f172a',
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'center',
    position: 'absolute',
    top: 10,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  storiesBarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  storiesScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyItemWrapper: {
    alignItems: 'center',
    marginRight: 14,
    width: 60,
  },
  storyAvatarBorder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cbd5e1', // default state
  },
  storyAvatarBorderUnread: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1306c', // Instagram classic brand pink/orange ring!
  },
  yourStoryBorder: {
    borderWidth: 0,
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  yourStoryPlus: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yourStoryPlusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: -2,
  },
  storyName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4f46e5',
    marginLeft: 6,
  },
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 12,
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1e293b',
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    fontSize: 14,
  },
  filterScroll: {
    paddingVertical: 4,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#4f46e5',
  },
  filterTabInactive: {
    backgroundColor: '#f1f5f9',
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  filterLabelActive: {
    color: '#ffffff',
  },
  filterLabelInactive: {
    color: '#475569',
  },
  feedList: {
    paddingBottom: 40,
  },
  loadingSpinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingSpinnerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4f46e5',
    marginLeft: 8,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
    textDecorationLine: 'underline',
  },
  loadMoreContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loadMoreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginRight: 6,
  },
  
  // Immersive Stories Player Styles
  storyOverlayContainer: {
    position: 'absolute',
    top: -64, // cover main appHeader perfectly
    left: -12, // match scrollAreaContent bounds
    right: -12,
    bottom: -150,
    backgroundColor: '#090d16',
    zIndex: 99999,
    padding: 16,
    paddingTop: 48,
    justifyContent: 'space-between',
  },
  storyProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  storyProgressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  storyProgressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  storySpeakerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  storySpeakerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storySpeakerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  storySpeakerName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  storySpeakerTime: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 1,
  },
  storyCloseBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyMainStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  storyQuoteCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  storyQuoteDecoration: {
    fontSize: 54,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.15)',
    position: 'absolute',
    top: 20,
    left: 24,
    fontFamily: 'serif',
  },
  storyQuoteText: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'serif',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  storyDividerLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 99,
    marginBottom: 14,
  },
  storyScriptureReference: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    letterSpacing: 0.5,
  },
  quickReactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  reactionBtn: {
    padding: 6,
  },
  storyFooterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 24,
  },
  storyReplyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 10,
  },
  storySendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
