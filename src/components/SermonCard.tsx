import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Platform,
  Alert
} from 'react-native';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Copy, 
  Play, 
  Pause, 
  Check, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Link as LinkIcon 
} from 'lucide-react-native';
import { SermonQuote } from '../types';
import { TEMPLATES } from '../data';
import { exportQuoteCardToImage } from '../utils/exportCard';

interface SermonCardProps {
  quote: SermonQuote;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onPlayAudio: (quote: SermonQuote) => void;
  currentPlayingId?: string;
  isAudioPlaying?: boolean;
}

const getBackgroundStyle = (bgVal: string) => {
  if (!bgVal) return { backgroundColor: '#4f46e5' };
  if (bgVal.includes('gradient')) {
    return { background: bgVal };
  }
  return { backgroundColor: bgVal };
};

const isBgDark = (textColorClass: string) => {
  if (!textColorClass) return false;
  return textColorClass.includes('900') || textColorClass.includes('950');
};

export const SermonCard: React.FC<SermonCardProps> = ({
  quote,
  onLike,
  onSave,
  onPlayAudio,
  currentPlayingId,
  isAudioPlaying
}) => {
  const [lastTap, setLastTap] = useState<number>(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);
  const [localComments, setLocalComments] = useState<Array<{ id: string; username: string; text: string; createdAt: string }>>([
    { id: '1', username: 'sister_grace', text: 'Amen! Truly touched my heart.', createdAt: '5m ago' },
    { id: '2', username: 'brother_peter', text: 'What an anointed word from Pastor!', createdAt: '2h ago' }
  ]);
  const [showInsight, setShowInsight] = useState(false);

  const template = TEMPLATES.find(t => t.id === quote.templateId) || TEMPLATES[0];

  // Double tap to like
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (!quote.isLiked) {
        onLike(quote.id);
      }
    }
    setLastTap(now);
  };

  const handleCopyQuote = () => {
    const text = `“${quote.quote}” — ${quote.speaker}, ${quote.church} (${quote.scripture})`;
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: 'story' | 'square' | 'pinterest') => {
    try {
      await exportQuoteCardToImage(quote, { format, platform: 'image' });
      setShowShareModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLocalComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      username: 'you',
      text: newComment,
      createdAt: 'Just now'
    };

    setLocalComments([comment, ...localComments]);
    setNewComment('');
  };

  const isCurrentPlaying = currentPlayingId === quote.id;
  const isBgLight = 
    (quote.background && (
      quote.background.toLowerCase().includes('#ffffff') || 
      quote.background.toLowerCase().includes('#f8fafc') || 
      quote.background.toLowerCase().includes('#fef2f2') || 
      quote.background.toLowerCase().includes('#fafaf9') || 
      quote.background.toLowerCase().includes('mist') || 
      quote.background.toLowerCase().includes('white')
    )) || 
    (quote.textColor ? (quote.textColor.includes('900') || quote.textColor.includes('950')) : false);

  const textStyleColor = isBgLight ? '#0f172a' : '#ffffff';
  const subtextStyleColor = isBgLight ? '#475569' : 'rgba(255, 255, 255, 0.85)';

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: quote.user.avatar }} 
            style={styles.avatar}
          />
          <View>
            <Text style={styles.speakerText}>{quote.speaker}</Text>
            <Text style={styles.churchText}>{quote.church}</Text>
          </View>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{quote.topic.toUpperCase()}</Text>
        </View>
      </View>

      {/* Quote Canvas */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={handleDoubleTap}
        style={[styles.canvas, getBackgroundStyle(quote.background)]}
      >
        <View style={styles.canvasHeader}>
          <Text style={[styles.canvasBrand, { color: textStyleColor }]}>S E L A H</Text>
          {quote.audioUrl && (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => onPlayAudio(quote)}
              style={[
                styles.audioPlayBtn,
                isCurrentPlaying && isAudioPlaying ? styles.audioPlayBtnActive : styles.audioPlayBtnInactive
              ]}
            >
              {isCurrentPlaying && isAudioPlaying ? (
                <Pause size={14} color="#0f172a" />
              ) : (
                <Play size={14} color="#ffffff" style={{ marginLeft: 2 }} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.quoteBodyContainer}>
          <Text style={[
            styles.quoteText, 
            { color: textStyleColor },
            quote.templateId === 'modern' ? styles.fontSpaceGrotesk : styles.fontSerif
          ]}>
            “{quote.quote}”
          </Text>
          <Text style={[
            styles.scriptureText,
            { color: subtextStyleColor }
          ]}>
            — {quote.scripture} ({quote.scriptureVersion})
          </Text>
        </View>

        <View style={styles.canvasFooter}>
          <Text style={[styles.canvasFooterText, { color: isBgLight ? '#475569' : 'rgba(255, 255, 255, 0.75)' }]}>
            {quote.speaker}
          </Text>
          <Text style={[styles.canvasFooterHash, { color: isBgLight ? '#64748b' : 'rgba(255, 255, 255, 0.6)' }]}>
            #SELAHGRAM
          </Text>
        </View>
      </TouchableOpacity>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity 
            onPress={() => onLike(quote.id)}
            style={styles.toolbarBtn}
          >
            <Heart size={20} color={quote.isLiked ? '#f43f5e' : '#64748b'} fill={quote.isLiked ? '#f43f5e' : 'none'} />
            <Text style={styles.toolbarCount}>{quote.likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowComments(!showComments)}
            style={styles.toolbarBtn}
          >
            <MessageCircle size={20} color="#64748b" />
            <Text style={styles.toolbarCount}>{localComments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowShareModal(true)}
            style={styles.toolbarBtn}
          >
            <Share2 size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolbarRight}>
          <TouchableOpacity 
            onPress={handleCopyQuote}
            style={styles.toolbarIconBtn}
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} color="#64748b" />}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onSave(quote.id)}
            style={styles.toolbarIconBtn}
          >
            <Bookmark size={20} color={quote.isSaved ? '#4f46e5' : '#64748b'} fill={quote.isSaved ? '#4f46e5' : 'none'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Caption & Personal Reflection */}
      <View style={styles.captionArea}>
        <View style={styles.hashtagRow}>
          {quote.hashtags.map(tag => (
            <Text key={tag} style={styles.hashtagText}>#{tag}</Text>
          ))}
        </View>

        {quote.insight && (
          <View style={styles.insightBox}>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowInsight(!showInsight)}
              style={styles.insightToggle}
            >
              <Text style={styles.insightToggleText}>
                {showInsight ? 'Hide reflection' : 'View personal reflection'}
              </Text>
              {showInsight ? <ChevronUp size={14} color="#64748b" /> : <ChevronDown size={14} color="#64748b" />}
            </TouchableOpacity>

            {showInsight && (
              <View style={styles.insightContent}>
                <Text style={styles.insightQuote}>"{quote.insight}"</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Comments Dropdown */}
      {showComments && (
        <View style={styles.commentsDropdown}>
          <View style={styles.commentsList}>
            {localComments.map(comment => (
              <View key={comment.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{comment.username}:</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <Text style={styles.commentTime}>{comment.createdAt}</Text>
              </View>
            ))}
          </View>

          <View style={styles.commentInputContainer}>
            <TextInput 
              placeholder="Add a comment..."
              placeholderTextColor="#94a3b8"
              value={newComment}
              onChangeText={setNewComment}
              style={styles.commentInput}
            />
            <TouchableOpacity 
              onPress={handleAddLocalComment}
              disabled={!newComment.trim()}
              style={[styles.commentPostBtn, !newComment.trim() && { opacity: 0.5 }]}
            >
              <Text style={styles.commentPostText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Premium Share Modal */}
      {showShareModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Export Sermon Card</Text>
                <Text style={styles.modalSubtitle}>Optimized layout presets for social media</Text>
              </View>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Text style={styles.modalCloseBtn}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.presetGrid}>
              <TouchableOpacity 
                onPress={() => handleDownload('story')}
                style={styles.presetCard}
              >
                <View style={[styles.presetIconContainer, { backgroundColor: '#c084fc' }]}>
                  <Share2 size={20} color="#ffffff" />
                </View>
                <Text style={styles.presetCardTitle}>Story Preset</Text>
                <Text style={styles.presetCardSub}>Instagram / WA</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleDownload('square')}
                style={styles.presetCard}
              >
                <View style={[styles.presetIconContainer, { backgroundColor: '#4f46e5' }]}>
                  <Copy size={20} color="#ffffff" />
                </View>
                <Text style={styles.presetCardTitle}>Square Card</Text>
                <Text style={styles.presetCardSub}>1080 x 1080px</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleDownload('pinterest')}
                style={styles.presetCard}
              >
                <View style={[styles.presetIconContainer, { backgroundColor: '#e11d48' }]}>
                  <BookOpen size={20} color="#ffffff" />
                </View>
                <Text style={styles.presetCardTitle}>Pinterest Tall</Text>
                <Text style={styles.presetCardSub}>2:3 aspect ratio</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickLinksArea}>
              <Text style={styles.sectionHeader}>Quick Share Links</Text>
              
              {[
                { name: 'Share to Instagram Stories', platform: 'Instagram' },
                { name: 'Post to X (Twitter)', platform: 'X' },
                { name: 'Send on WhatsApp Status', platform: 'WhatsApp' }
              ].map((item) => (
                <TouchableOpacity 
                  key={item.name}
                  onPress={() => {
                    handleCopyQuote();
                    if (Platform.OS === 'web') {
                      alert(`Quote details copied! Direct sharing to ${item.platform} simulated.`);
                    } else {
                      Alert.alert('Copied!', `Quote details copied for ${item.platform}`);
                    }
                    setShowShareModal(false);
                  }}
                  style={styles.quickLinkRow}
                >
                  <View style={styles.quickLinkLeft}>
                    <View style={styles.quickLinkIconBox}>
                      <LinkIcon size={14} color="#4f46e5" />
                    </View>
                    <Text style={styles.quickLinkLabel}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#e2e8f0',
  },
  speakerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  churchText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  tagBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.5,
  },
  canvas: {
    width: '100%',
    aspectRatio: 1,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  canvasBrand: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    opacity: 0.8,
  },
  audioPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  audioPlayBtnActive: {
    backgroundColor: '#fbbf24',
  },
  audioPlayBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  quoteBodyContainer: {
    marginVertical: 'auto',
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 8,
  },
  fontSerif: {
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  fontSpaceGrotesk: {
    fontFamily: 'Space Grotesk, sans-serif',
  },
  scriptureText: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  canvasFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 12,
    opacity: 0.85,
  },
  canvasFooterText: {
    fontSize: 10,
    fontWeight: '600',
  },
  canvasFooterHash: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  toolbarCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 5,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarIconBtn: {
    padding: 4,
    marginLeft: 12,
  },
  captionArea: {
    padding: 16,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4f46e5',
    marginRight: 8,
  },
  insightBox: {
    marginTop: 4,
  },
  insightToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  insightContent: {
    backgroundColor: '#f8fafc',
    borderLeftWidth: 2,
    borderLeftColor: '#818cf8',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  insightQuote: {
    fontSize: 11,
    lineHeight: 16,
    color: '#475569',
    fontStyle: 'italic',
  },
  commentsDropdown: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  commentsList: {
    padding: 16,
    maxHeight: 180,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginRight: 6,
  },
  commentText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    color: '#475569',
  },
  commentTime: {
    fontSize: 9,
    color: '#94a3b8',
    marginLeft: 6,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 12,
    color: '#1e293b',
  },
  commentPostBtn: {
    marginLeft: 10,
    backgroundColor: '#4f46e5',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  commentPostText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
  },
  presetGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  presetIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  presetCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  presetCardSub: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  quickLinksArea: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quickLinkRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  quickLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickLinkIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quickLinkLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  }
});
