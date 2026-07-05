import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  Disc, 
  Music, 
  Sparkles, 
  BookOpen 
} from 'lucide-react-native';
import { SermonQuote } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface AudioPlayerProps {
  currentQuote: SermonQuote | null;
  isPlaying: boolean;
  onPlayToggle: (playing: boolean) => void;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentQuote,
  isPlaying,
  onPlayToggle,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<any>(null);

  const duration = currentQuote?.audioDuration || 30;

  // Sync state transitions to synthesized audio
  useEffect(() => {
    if (isPlaying) {
      // Start the beautiful serene ambient pad progression
      audioEngine.startAmbientPad();
      
      // Progress simulation loop
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            return 0; // Loop or stop
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      audioEngine.stopAmbientPad();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentQuote, duration]);

  // Reset time if quote changes
  useEffect(() => {
    setCurrentTime(0);
  }, [currentQuote]);

  if (!currentQuote) return null;

  // Find the currently active highlight segment based on simulation time
  const currentHighlight = currentQuote.audioTimeline
    ?.slice()
    .reverse()
    .find(h => currentTime >= h.time);

  // Jump from clicking a synchronized text quote segment
  const handleJumpToTime = (time: number) => {
    setCurrentTime(time);
    if (!isPlaying) {
      onPlayToggle(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.outerContainer}>
      {!isExpanded ? (
        /* Mini Player Layout */
        <TouchableOpacity 
          onPress={() => setIsExpanded(true)}
          style={styles.miniPlayer}
        >
          <View style={styles.miniLeft}>
            <View style={[styles.miniArtwork, { backgroundColor: currentQuote.background }]}>
              <Text style={styles.miniQuoteQuote}>“</Text>
            </View>
            <View style={styles.miniDetails}>
              <View style={styles.speakerRow}>
                <Text style={styles.miniSpeaker}>{currentQuote.speaker}</Text>
                <Sparkles size={10} color="#fbbf24" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.miniSubtitle} numberOfLines={1}>
                {currentHighlight ? currentHighlight.text : currentQuote.quote}
              </Text>
            </View>
          </View>

          <View style={styles.miniActions}>
            <TouchableOpacity 
              id="mini-player-play-pause"
              onPress={() => onPlayToggle(!isPlaying)}
              style={styles.miniPlayBtn}
            >
              {isPlaying ? (
                <Pause size={12} color="#ffffff" />
              ) : (
                <Play size={12} color="#ffffff" style={{ marginLeft: 1 }} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              id="mini-player-expand"
              onPress={() => setIsExpanded(true)}
              style={styles.miniChevron}
            >
              <ChevronUp size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Progress bar line */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(currentTime / duration) * 100}%` }]} />
          </View>
        </TouchableOpacity>
      ) : (
        /* Fully Expanded Streaming Player Card */
        <View style={styles.expandedPlayer}>
          {/* Header */}
          <View style={styles.expHeader}>
            <TouchableOpacity 
              id="expanded-player-collapse"
              onPress={() => setIsExpanded(false)}
              style={styles.collapseBtn}
            >
              <ChevronDown size={20} color="#94a3b8" />
            </TouchableOpacity>
            <View style={styles.expHeaderCenter}>
              <Text style={styles.expHeaderTag}>NOW STREAMING</Text>
              <View style={styles.expHeaderTitleRow}>
                <Text style={styles.expHeaderTitle}>Sermon Clip</Text>
                <Music size={12} color="#94a3b8" style={{ marginLeft: 4 }} />
              </View>
            </View>
            <TouchableOpacity 
              id="expanded-player-close"
              onPress={() => {
                onPlayToggle(false);
                onClose();
              }}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Immersive Audio Artwork Card */}
          <View style={[styles.artworkCard, { backgroundColor: currentQuote.background }]}>
            <View style={styles.artworkHeader}>
              <Text style={styles.artworkBrand}>S E L A H</Text>
              <View style={styles.artworkTopicBadge}>
                <Text style={styles.artworkTopicText}>{currentQuote.topic}</Text>
              </View>
            </View>

            <Text style={styles.artworkQuote} numberOfLines={3}>
              “{currentQuote.quote}”
            </Text>

            <View style={styles.artworkFooter}>
              <Text style={styles.artworkSpeaker}>{currentQuote.speaker}</Text>
              <Text style={styles.artworkScripture}>{currentQuote.scripture}</Text>
            </View>
          </View>

          {/* Dynamic Lyric Highlights / Timeline */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineHeader}>
              <View style={styles.timelineHeaderLeft}>
                <BookOpen size={14} color="#fbbf24" style={{ marginRight: 6 }} />
                <Text style={styles.timelineTitle}>Interactive Script Timeline</Text>
              </View>
              <Text style={styles.timelineSub}>Tap line to skip audio</Text>
            </View>

            <ScrollView style={styles.timelineScroll} showsVerticalScrollIndicator={false}>
              {currentQuote.audioTimeline?.map((line, idx) => {
                const isActive = currentHighlight?.time === line.time;
                return (
                  <TouchableOpacity
                    key={idx}
                    id={`timeline-jump-${idx}`}
                    onPress={() => handleJumpToTime(line.time)}
                    style={[
                      styles.timelineRow,
                      isActive && styles.timelineRowActive
                    ]}
                  >
                    <Text style={[styles.timelineTime, isActive && styles.timelineTimeActive]}>{formatTime(line.time)}</Text>
                    <Text style={[styles.timelineText, isActive && styles.timelineTextActive]}>{line.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Song Info */}
          <View style={styles.speakerBox}>
            <Text style={styles.speakerName}>{currentQuote.speaker}</Text>
            <Text style={styles.churchName}>{currentQuote.church}</Text>
          </View>

          {/* Player Controls */}
          <View style={styles.controlsArea}>
            {/* Progress Slider */}
            <View style={styles.progressSliderRow}>
              <View style={styles.trackLineBg}>
                <View style={[styles.trackLineFill, { width: `${(currentTime / duration) * 100}%` }]} />
              </View>
              <View style={styles.timeLabelsRow}>
                <Text style={styles.timeLabel}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Buttons row */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity 
                id="player-mute-toggle"
                onPress={() => setIsMuted(!isMuted)}
                style={styles.utilityButton}
              >
                {isMuted ? (
                  <VolumeX size={18} color="#f43f5e" />
                ) : (
                  <Volume2 size={18} color="#94a3b8" />
                )}
              </TouchableOpacity>

              <View style={styles.centerPlayGroup}>
                <TouchableOpacity 
                  id="player-skip-back"
                  onPress={() => handleJumpToTime(Math.max(0, currentTime - 5))}
                  style={styles.skipBtn}
                >
                  <SkipBack size={18} color="#94a3b8" />
                </TouchableOpacity>

                <TouchableOpacity 
                  id="player-play-pause"
                  onPress={() => onPlayToggle(!isPlaying)}
                  style={styles.mainPlayCircle}
                >
                  {isPlaying ? (
                    <Pause size={24} color="#0f172a" />
                  ) : (
                    <Play size={24} color="#0f172a" style={{ marginLeft: 3 }} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  id="player-skip-forward"
                  onPress={() => handleJumpToTime(Math.min(duration, currentTime + 5))}
                  style={styles.skipBtn}
                >
                  <SkipForward size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={styles.sparkleDecoration}>
                <Sparkles size={16} color="#fbbf24" />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 60,
    left: 8,
    right: 8,
    zIndex: 9999,
  },
  miniPlayer: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  miniLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniArtwork: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  miniQuoteQuote: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  miniDetails: {
    flex: 1,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniSpeaker: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  miniSubtitle: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  miniActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  miniChevron: {
    padding: 4,
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1e293b',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
  },
  expandedPlayer: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  collapseBtn: {
    padding: 4,
  },
  expHeaderCenter: {
    alignItems: 'center',
  },
  expHeaderTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 1.5,
  },
  expHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  expHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  artworkCard: {
    aspectRatio: 1.6,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  artworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artworkBrand: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  artworkTopicBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  artworkTopicText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#ffffff',
  },
  artworkQuote: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  artworkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artworkSpeaker: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  artworkScripture: {
    fontSize: 8,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timelineContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 6,
    marginBottom: 8,
  },
  timelineHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  timelineSub: {
    fontSize: 8,
    color: '#64748b',
  },
  timelineScroll: {
    maxHeight: 100,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  timelineRowActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  timelineTime: {
    fontSize: 9,
    color: '#64748b',
    fontFamily: 'monospace',
    marginRight: 10,
  },
  timelineTimeActive: {
    color: '#fbbf24',
    fontWeight: '700',
  },
  timelineText: {
    fontSize: 10,
    color: '#94a3b8',
    flex: 1,
  },
  timelineTextActive: {
    color: '#fbbf24',
    fontWeight: '700',
  },
  speakerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  churchName: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  controlsArea: {},
  progressSliderRow: {
    marginBottom: 12,
  },
  trackLineBg: {
    height: 4,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  trackLineFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 2,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeLabel: {
    fontSize: 9,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  utilityButton: {
    padding: 8,
  },
  centerPlayGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipBtn: {
    padding: 8,
    marginHorizontal: 8,
  },
  mainPlayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleDecoration: {
    padding: 8,
  }
});
