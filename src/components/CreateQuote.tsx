import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Switch,
  Platform
} from 'react-native';
import { 
  Sparkles, 
  Paintbrush, 
  FileText, 
  CheckCircle, 
  RefreshCw, 
  Eye, 
  Volume2 
} from 'lucide-react-native';
import { SermonQuote, UserProfile } from '../types';
import { PRESET_BACKGROUNDS, TEMPLATES } from '../data';

interface CreateQuoteProps {
  onPublish: (newQuote: Omit<SermonQuote, 'id' | 'likesCount' | 'commentsCount' | 'savesCount' | 'sharesCount' | 'isLiked' | 'isSaved' | 'createdAt'>) => void;
  onSuccess: () => void;
  profile?: UserProfile;
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

export const CreateQuote: React.FC<CreateQuoteProps> = ({
  onPublish,
  onSuccess,
  profile
}) => {
  const [quote, setQuote] = useState('');
  const [scripture, setScripture] = useState('');
  const [scriptureVersion, setScriptureVersion] = useState('NIV');
  const [speaker, setSpeaker] = useState('');
  const [church, setChurch] = useState('');
  const [topic, setTopic] = useState('Faith');
  const [insight, setInsight] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('');

  const [selectedBgIdx, setSelectedBgIdx] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<'minimal' | 'elegant' | 'modern' | 'dark' | 'church' | 'conference' | 'worship' | 'youth'>('elegant');
  const [hasAudio, setHasAudio] = useState(false);
  const [audioPreset, setAudioPreset] = useState('grace-struggle-clip');

  const [activeStep, setActiveStep] = useState<'content' | 'design'>('content');
  const [errorMessage, setErrorMessage] = useState('');

  const currentBg = PRESET_BACKGROUNDS[selectedBgIdx];
  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const isDark = isBgDark(currentBg.textColor);

  const handlePrepopulate = () => {
    setQuote("Faith does not eliminate questions. But faith knows where to take them.");
    setScripture("John 20:27");
    setScriptureVersion("ESV");
    setSpeaker("Pastor Timothy Keller");
    setChurch("Redeemer Presbyterian Church");
    setTopic("Faith");
    setInsight("I love this perspective. We don't have to be perfect; we just need to bring our doubts to Jesus.");
    setHashtagsStr("Faith, Keller, Trust, Questions");
    setHasAudio(true);
  };

  const handleSubmit = () => {
    if (!quote.trim()) {
      setErrorMessage('A sermon quote is required to create a card.');
      return;
    }
    if (!scripture.trim()) {
      setErrorMessage('A Scripture reference (e.g. John 3:16) is required.');
      return;
    }
    if (!speaker.trim()) {
      setErrorMessage('The speaker or pastor is required.');
      return;
    }

    setErrorMessage('');

    // Parse hashtags
    const hashtags = hashtagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.replace(/#/g, ''));

    if (hashtags.length === 0) {
      hashtags.push(topic, speaker.replace(/\s+/g, ''));
    }

    onPublish({
      quote,
      scripture,
      scriptureVersion,
      speaker,
      church: church || 'Grace Community Church',
      topic,
      hashtags,
      insight: insight || undefined,
      audioUrl: hasAudio ? audioPreset : undefined,
      audioDuration: hasAudio ? 20 : undefined,
      audioTimeline: hasAudio ? [
        { time: 0, text: quote.split(' ').slice(0, 4).join(' ') },
        { time: 5, text: quote.split(' ').slice(0, 8).join(' ') },
        { time: 10, text: quote }
      ] : undefined,
      background: currentBg.value,
      bgType: currentBg.type as 'solid' | 'gradient' | 'image' | 'illustration',
      textColor: currentBg.textColor,
      templateId: selectedTemplateId,
      user: {
        name: profile?.name || 'Sarah Jenkins',
        username: profile?.username || 'sarah_jenkins',
        avatar: profile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        churchAffiliation: profile?.churchAffiliation || 'Grace Community Church'
      }
    });

    onSuccess();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>Create Sermon Card</Text>
            <Sparkles size={16} color="#4f46e5" style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.cardSubtitle}>Design a premium inspirational card in seconds</Text>
        </View>

        <TouchableOpacity 
          onPress={handlePrepopulate}
          style={styles.demoBtn}
        >
          <RefreshCw size={12} color="#4f46e5" style={{ marginRight: 4 }} />
          <Text style={styles.demoBtnText}>Auto Fill Demo</Text>
        </TouchableOpacity>
      </View>

      {/* Segment Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          onPress={() => setActiveStep('content')}
          style={[styles.tabBtn, activeStep === 'content' ? styles.tabBtnActive : styles.tabBtnInactive]}
        >
          <FileText size={14} color={activeStep === 'content' ? '#4f46e5' : '#64748b'} />
          <Text style={[styles.tabLabel, activeStep === 'content' ? styles.tabLabelActive : styles.tabLabelInactive]}>1. Content</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveStep('design')}
          style={[styles.tabBtn, activeStep === 'design' ? styles.tabBtnActive : styles.tabBtnInactive]}
        >
          <Paintbrush size={14} color={activeStep === 'design' ? '#4f46e5' : '#64748b'} />
          <Text style={[styles.tabLabel, activeStep === 'design' ? styles.tabLabelActive : styles.tabLabelInactive]}>2. Visual Style</Text>
        </TouchableOpacity>
      </View>

      {errorMessage.length > 0 && (
        <View style={styles.errorAlert}>
          <Text style={styles.errorText}><Text style={{ fontWeight: '700' }}>Missing Info: </Text>{errorMessage}</Text>
        </View>
      )}

      {activeStep === 'content' ? (
        /* STEP 1: CONTENT INFO FORM */
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Sermon Quote *</Text>
            <TextInput 
              id="input-quote-text"
              placeholder="Type or paste the sermon quote here..."
              placeholderTextColor="#94a3b8"
              value={quote}
              onChangeText={setQuote}
              maxLength={200}
              multiline
              numberOfLines={3}
              style={[styles.textArea, { height: 80 }]}
            />
            <Text style={styles.charCounter}>{quote.length}/200 characters</Text>
          </View>

          <View style={styles.rowGrid}>
            <View style={[styles.inputGroup, { flex: 2, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Bible Reference *</Text>
              <TextInput 
                id="input-scripture"
                placeholder="e.g. John 3:16"
                placeholderTextColor="#94a3b8"
                value={scripture}
                onChangeText={setScripture}
                style={styles.textInput}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Version</Text>
              <View style={styles.pickerBox}>
                <TextInput 
                  id="input-scripture-version"
                  value={scriptureVersion}
                  onChangeText={setScriptureVersion}
                  placeholder="ESV"
                  placeholderTextColor="#94a3b8"
                  style={styles.pickerFake}
                />
              </View>
            </View>
          </View>

          <View style={styles.rowGrid}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Speaker/Pastor *</Text>
              <TextInput 
                id="input-speaker"
                placeholder="e.g. David Platt"
                placeholderTextColor="#94a3b8"
                value={speaker}
                onChangeText={setSpeaker}
                style={styles.textInput}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Church or Event</Text>
              <TextInput 
                id="input-church"
                placeholder="e.g. McLean Church"
                placeholderTextColor="#94a3b8"
                value={church}
                onChangeText={setChurch}
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.rowGrid}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Core Topic</Text>
              <TextInput 
                id="input-topic"
                placeholder="e.g. Faith"
                placeholderTextColor="#94a3b8"
                value={topic}
                onChangeText={setTopic}
                style={styles.textInput}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Hashtags</Text>
              <TextInput 
                id="input-hashtags"
                placeholder="e.g. Grace, Hope"
                placeholderTextColor="#94a3b8"
                value={hashtagsStr}
                onChangeText={setHashtagsStr}
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Personal Insight (Optional Reflection)</Text>
            <TextInput 
              id="input-insight"
              placeholder="What did this sermon make you reflect on?"
              placeholderTextColor="#94a3b8"
              value={insight}
              onChangeText={setInsight}
              style={styles.textInput}
            />
          </View>

          {/* Toggle Sync Audio */}
          <View style={styles.audioSwitchBox}>
            <View style={styles.audioSwitchLeft}>
              <View style={styles.audioIconContainer}>
                <Volume2 size={16} color="#4f46e5" />
              </View>
              <View>
                <Text style={styles.audioTitle}>Link Sermon Audio Clip</Text>
                <Text style={styles.audioSub}>Enable users to play atmospheric sermon clips</Text>
              </View>
            </View>
            <Switch 
              id="toggle-attach-audio"
              value={hasAudio} 
              onValueChange={setHasAudio}
              trackColor={{ false: '#cbd5e1', true: '#a5b4fc' }}
              thumbColor={hasAudio ? '#4f46e5' : '#f1f5f9'}
            />
          </View>

          <TouchableOpacity 
            onPress={() => setActiveStep('design')}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Choose Layout & Visuals →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* STEP 2: STYLING & PREVIEW */
        <View style={styles.formSection}>
          {/* Background selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Select Premium Canvas Background</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bgSelectorRow}>
              {PRESET_BACKGROUNDS.map((bg, idx) => {
                const isSelected = selectedBgIdx === idx;
                return (
                  <TouchableOpacity
                    key={bg.id}
                    onPress={() => setSelectedBgIdx(idx)}
                    style={[
                      styles.bgThumbnail, 
                      { backgroundColor: bg.value },
                      isSelected && styles.bgThumbnailSelected
                    ]}
                  >
                    {isSelected && <Text style={styles.selectedTick}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Layout templates selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Typography Layout Preset</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bgSelectorRow}>
              {TEMPLATES.map((item) => {
                const isSelected = selectedTemplateId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelectedTemplateId(item.id as any)}
                    style={[
                      styles.templatePill, 
                      isSelected ? styles.templatePillActive : styles.templatePillInactive
                    ]}
                  >
                    <Text style={[
                      styles.templatePillText, 
                      isSelected ? styles.templatePillTextActive : styles.templatePillTextInactive
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Core Canvas Preview */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Live Card Canvas Preview</Text>
            <View style={[styles.canvasPreview, getBackgroundStyle(currentBg.value)]}>
              <View style={styles.canvasPreviewHeader}>
                <Text style={[styles.canvasPreviewBrand, { color: isDark ? '#0f172a' : '#ffffff' }]}>S E L A H</Text>
                {hasAudio && (
                  <View style={styles.audioIndicator}>
                    <Volume2 size={10} color="#ffffff" />
                  </View>
                )}
              </View>

              <View style={styles.canvasPreviewBody}>
                <Text style={[
                  styles.canvasPreviewQuote, 
                  { color: isDark ? '#1e293b' : '#ffffff' },
                  currentTemplate.id === 'modern' ? styles.fontSpaceGrotesk : styles.fontSerif
                ]}>
                  “{quote || 'Start typing a sermon quote above to see your beautiful card preview here...' || quote}”
                </Text>
                <Text style={[
                  styles.canvasPreviewScripture, 
                  { color: isDark ? '#475569' : 'rgba(255, 255, 255, 0.9)' }
                ]}>
                  — {scripture || 'Bible Verse Reference'} ({scriptureVersion})
                </Text>
              </View>

              <View style={styles.canvasPreviewFooter}>
                <Text style={[
                  styles.canvasPreviewFooterText, 
                  { color: isDark ? '#475569' : 'rgba(255, 255, 255, 0.8)' }
                ]}>
                  {speaker || 'Speaker Name'}
                </Text>
                <Text style={[
                  styles.canvasPreviewFooterHash, 
                  { color: isDark ? '#64748b' : 'rgba(255, 255, 255, 0.6)' }
                ]}>
                  #SELAH
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.rowGrid}>
            <TouchableOpacity 
              onPress={() => setActiveStep('content')}
              style={[styles.secondaryBtn, { flex: 1, marginRight: 8 }]}
            >
              <Text style={styles.secondaryBtnText}>← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              id="btn-publish-card"
              onPress={handleSubmit}
              style={[styles.primaryBtn, { flex: 2 }]}
            >
              <Text style={styles.primaryBtnText}>Publish Sermon Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  demoBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4f46e5',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 2,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnInactive: {},
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  tabLabelActive: {
    color: '#4f46e5',
  },
  tabLabelInactive: {
    color: '#64748b',
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 11,
    color: '#b91c1c',
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1e293b',
  },
  textArea: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 12,
    color: '#1e293b',
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 4,
  },
  rowGrid: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  pickerBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    justifyContent: 'center',
  },
  pickerFake: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '700',
  },
  audioSwitchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 12,
    marginVertical: 10,
  },
  audioSwitchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  audioTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  audioSub: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 1,
  },
  primaryBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryBtn: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  bgSelectorRow: {
    paddingVertical: 6,
  },
  bgThumbnail: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgThumbnailSelected: {
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  selectedTick: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  templatePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
  },
  templatePillActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  templatePillInactive: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  templatePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  templatePillTextActive: {
    color: '#ffffff',
  },
  templatePillTextInactive: {
    color: '#64748b',
  },
  canvasPreview: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 300,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  canvasPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  canvasPreviewBrand: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  audioIndicator: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 99,
  },
  canvasPreviewBody: {
    marginVertical: 'auto',
  },
  canvasPreviewQuote: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 4,
  },
  fontSerif: {
    fontFamily: 'Playfair Display, Georgia, serif',
  },
  fontSpaceGrotesk: {
    fontFamily: 'Space Grotesk, sans-serif',
  },
  canvasPreviewScripture: {
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
  },
  canvasPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 8,
  },
  canvasPreviewFooterText: {
    fontSize: 9,
    fontWeight: '600',
  },
  canvasPreviewFooterHash: {
    fontSize: 8,
    fontFamily: 'monospace',
  }
});
