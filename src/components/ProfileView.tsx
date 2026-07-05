import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  TextInput,
  Modal
} from 'react-native';
import { 
  Grid, 
  Bookmark, 
  Plus, 
  Shield, 
  Heart, 
  Music, 
  FolderHeart, 
  Church, 
  ArrowLeft, 
  CheckCircle,
  LogOut,
  List,
  X
} from 'lucide-react-native';
import { UserProfile, SermonQuote, Collection } from '../types';
import { SermonCard } from './SermonCard';

const getBackgroundStyle = (bgVal: string) => {
  if (!bgVal) return { backgroundColor: '#4f46e5' };
  if (bgVal.includes('gradient')) {
    return { background: bgVal };
  }
  return { backgroundColor: bgVal };
};

interface ProfileViewProps {
  profile: UserProfile;
  quotes: SermonQuote[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onPlayAudio: (quote: SermonQuote) => void;
  currentPlayingId?: string;
  isAudioPlaying?: boolean;
  onAddCollection: (collection: Collection) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  quotes,
  onLike,
  onSave,
  onPlayAudio,
  currentPlayingId,
  isAudioPlaying,
  onAddCollection,
  onLogout
}) => {
  const [activeProfileSubTab, setActiveProfileSubTab] = useState<'quotes' | 'collections' | 'saved'>('quotes');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  
  // Instagram Mode Selection ('grid' or 'list')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPreviewQuote, setSelectedPreviewQuote] = useState<SermonQuote | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [colName, setColName] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colIcon, setColIcon] = useState('Shield');
  const [colGradIdx, setColGradIdx] = useState(0);

  const gradPresets = [
    '#1e3a8a', // Deep Blue
    '#4c1d95', // Indigo Purple
    '#7c2d12', // Teracotta Orange
    '#064e3b', // Emerald Green
    '#111827', // Obsidian Black
  ];

  const renderCollectionIcon = (iconName: string, color = '#ffffff') => {
    switch (iconName) {
      case 'Shield': return <Shield size={16} color={color} />;
      case 'Heart': return <Heart size={16} color={color} />;
      case 'Music': return <Music size={16} color={color} />;
      default: return <FolderHeart size={16} color={color} />;
    }
  };

  const handleCreateCollection = () => {
    if (!colName.trim()) return;

    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: colName,
      description: colDesc,
      icon: colIcon,
      quoteIds: [],
      coverGradient: gradPresets[colGradIdx],
    };

    onAddCollection(newCol);
    setShowCreateModal(false);
    setColName('');
    setColDesc('');
  };

  // Filter quotes added by user
  const userQuotes = quotes.filter(q => q.user.username === profile.username);

  // Filter saved quotes
  const savedQuotes = quotes.filter(q => q.isSaved);

  // Filter quotes within selected collection
  const collectionQuotes = selectedCollection 
    ? quotes.filter(q => selectedCollection.quoteIds.includes(q.id))
    : [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {!selectedCollection ? (
        /* Main Profile View */
        <View>
          {/* Upper Profile Info Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileMeta}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: profile.avatar }} 
                  style={styles.avatar}
                  referrerPolicy="no-referrer"
                />
              </View>
              <View style={styles.profileDetails}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  {onLogout && (
                    <TouchableOpacity 
                      id="profile-logout-button"
                      onPress={onLogout}
                      style={styles.logoutBtn}
                    >
                      <LogOut size={11} color="#ef4444" />
                      <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.username}>@{profile.username}</Text>
                
                {profile.churchAffiliation && (
                  <View style={styles.churchBadge}>
                    <Church size={12} color="#c13584" style={{ marginRight: 4 }} />
                    <Text style={styles.churchText}>{profile.churchAffiliation}</Text>
                  </View>
                )}

                <Text style={styles.bio}>{profile.bio}</Text>
              </View>
            </View>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userQuotes.length}</Text>
                <Text style={styles.statLabel}>Cards</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Sub Tabs Selection */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              onPress={() => setActiveProfileSubTab('quotes')}
              style={[styles.tabBtn, activeProfileSubTab === 'quotes' ? styles.tabBtnActive : styles.tabBtnInactive]}
            >
              <Grid size={13} color={activeProfileSubTab === 'quotes' ? '#c13584' : '#64748b'} />
              <Text style={[styles.tabLabel, activeProfileSubTab === 'quotes' ? styles.tabLabelActive : styles.tabLabelInactive]}>My Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveProfileSubTab('collections')}
              style={[styles.tabBtn, activeProfileSubTab === 'collections' ? styles.tabBtnActive : styles.tabBtnInactive]}
            >
              <FolderHeart size={13} color={activeProfileSubTab === 'collections' ? '#c13584' : '#64748b'} />
              <Text style={[styles.tabLabel, activeProfileSubTab === 'collections' ? styles.tabLabelActive : styles.tabLabelInactive]}>Folders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveProfileSubTab('saved')}
              style={[styles.tabBtn, activeProfileSubTab === 'saved' ? styles.tabBtnActive : styles.tabBtnInactive]}
            >
              <Bookmark size={13} color={activeProfileSubTab === 'saved' ? '#c13584' : '#64748b'} />
              <Text style={[styles.tabLabel, activeProfileSubTab === 'saved' ? styles.tabLabelActive : styles.tabLabelInactive]}>Bookmarked</Text>
            </TouchableOpacity>
          </View>

          {/* View Mode Switcher (only for Cards/Saved tab streams) */}
          {(activeProfileSubTab === 'quotes' || activeProfileSubTab === 'saved') && (
            <View style={styles.modeSwitcherContainer}>
              <Text style={styles.modeTitle}>
                {activeProfileSubTab === 'quotes' ? 'Shared Sermons' : 'Saved Collection'}
              </Text>
              <View style={styles.modeIconsRow}>
                <TouchableOpacity 
                  onPress={() => setViewMode('grid')}
                  style={[styles.modeIconBtn, viewMode === 'grid' && styles.modeIconBtnActive]}
                >
                  <Grid size={15} color={viewMode === 'grid' ? '#1e293b' : '#94a3b8'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setViewMode('list')}
                  style={[styles.modeIconBtn, viewMode === 'list' && styles.modeIconBtnActive]}
                >
                  <List size={15} color={viewMode === 'list' ? '#1e293b' : '#94a3b8'} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Sub Tab View Content */}
          <View style={styles.subContent}>
            {activeProfileSubTab === 'quotes' && (
              <View>
                {userQuotes.length > 0 ? (
                  viewMode === 'grid' ? (
                    /* Instagram Bento-style Grid View */
                    <View style={styles.instaGrid}>
                      {userQuotes.map(quote => (
                        <TouchableOpacity 
                          key={quote.id}
                          onPress={() => setSelectedPreviewQuote(quote)}
                          style={[styles.instaGridCell, getBackgroundStyle(quote.background)]}
                        >
                          <Text 
                            style={[
                              styles.instaGridText, 
                              { color: (quote.textColor ? (quote.textColor.includes('900') || quote.textColor.includes('950')) : false) ? '#0f172a' : '#ffffff' }
                            ]}
                            numberOfLines={4}
                          >
                            {quote.quote}
                          </Text>
                          <Text 
                            style={[
                              styles.instaGridScripture, 
                              { color: (quote.textColor ? (quote.textColor.includes('900') || quote.textColor.includes('950')) : false) ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.7)' }
                            ]}
                            numberOfLines={1}
                          >
                            {quote.scripture}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    /* Detailed Full List Stream */
                    userQuotes.map(quote => (
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
                  )
                ) : (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText}>You haven't designed or published any sermon cards yet.</Text>
                  </View>
                )}
              </View>
            )}

            {activeProfileSubTab === 'collections' && (
              <View>
                {/* Create New Collection Row */}
                <View style={styles.colHeaderRow}>
                  <Text style={styles.colHeaderTitle}>Saved Folders</Text>
                  <TouchableOpacity 
                    onPress={() => setShowCreateModal(true)}
                    style={styles.addFolderBtn}
                  >
                    <Plus size={12} color="#c13584" style={{ marginRight: 4 }} />
                    <Text style={styles.addFolderText}>Create Folder</Text>
                  </TouchableOpacity>
                </View>

                {/* Collections List Grid */}
                <View style={styles.collectionsGrid}>
                  {profile.savedCollections.map((col) => (
                    <TouchableOpacity 
                      key={col.id}
                      onPress={() => setSelectedCollection(col)}
                      style={styles.colCard}
                    >
                      {/* Cover design */}
                      <View style={[styles.colCover, getBackgroundStyle(col.coverGradient)]}>
                        <View style={styles.colCoverIconBox}>
                          {renderCollectionIcon(col.icon)}
                        </View>
                        <Text style={styles.colCoverBrand}>SELAH</Text>
                      </View>
                      {/* Card body */}
                      <View style={styles.colBody}>
                        <Text style={styles.colName} numberOfLines={1}>{col.name}</Text>
                        <Text style={styles.colSubText}>{col.quoteIds.length} cards saved</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {activeProfileSubTab === 'saved' && (
              <View>
                {savedQuotes.length > 0 ? (
                  viewMode === 'grid' ? (
                    /* Instagram Bento-style Grid View for Bookmarks */
                    <View style={styles.instaGrid}>
                      {savedQuotes.map(quote => (
                        <TouchableOpacity 
                          key={quote.id}
                          onPress={() => setSelectedPreviewQuote(quote)}
                          style={[styles.instaGridCell, getBackgroundStyle(quote.background)]}
                        >
                          <Text 
                            style={[
                              styles.instaGridText, 
                              { color: (quote.textColor ? (quote.textColor.includes('900') || quote.textColor.includes('950')) : false) ? '#0f172a' : '#ffffff' }
                            ]}
                            numberOfLines={4}
                          >
                            {quote.quote}
                          </Text>
                          <Text 
                            style={[
                              styles.instaGridScripture, 
                              { color: (quote.textColor ? (quote.textColor.includes('900') || quote.textColor.includes('950')) : false) ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.7)' }
                            ]}
                            numberOfLines={1}
                          >
                            {quote.scripture}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    /* Detailed Full List Stream for Bookmarks */
                    savedQuotes.map(quote => (
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
                  )
                ) : (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText}>Save quotes while scrolling the feed to see them here.</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      ) : (
        /* Collection Detail View */
        <View style={{ marginBottom: 40 }}>
          {/* Header / Back */}
          <View style={styles.detailHeader}>
            <TouchableOpacity 
              onPress={() => setSelectedCollection(null)}
              style={styles.backBtn}
            >
              <ArrowLeft size={14} color="#475569" style={{ marginRight: 6 }} />
              <Text style={styles.backBtnText}>All Collections</Text>
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle}>Folder View</Text>
          </View>

          {/* Collection Details Intro */}
          <View style={[styles.collectionIntroBox, getBackgroundStyle(selectedCollection.coverGradient)]}>
            <View style={styles.introIconBox}>
              {renderCollectionIcon(selectedCollection.icon, '#c13584')}
            </View>
            <Text style={styles.introName}>{selectedCollection.name}</Text>
            {selectedCollection.description.length > 0 && (
              <Text style={styles.introDesc}>{selectedCollection.description}</Text>
            )}
            <View style={styles.introBadge}>
              <Text style={styles.introBadgeText}>{selectedCollection.quoteIds.length} Saved Sermon Cards</Text>
            </View>
          </View>

          {/* Nested Cards List */}
          <View style={{ marginTop: 16 }}>
            {collectionQuotes.length > 0 ? (
              collectionQuotes.map(quote => (
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
              <View style={styles.emptyView}>
                <Text style={styles.emptyText}>There are currently no saved quote cards in this folder.</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Collection Creation Modal */}
      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Private Folder</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Folder Name *</Text>
                <TextInput 
                  id="input-col-name"
                  placeholder="e.g. Daily Strength, Prayer"
                  placeholderTextColor="#94a3b8"
                  value={colName}
                  onChangeText={setColName}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Description (optional)</Text>
                <TextInput 
                  id="input-col-desc"
                  placeholder="What category of quotes fit here?"
                  placeholderTextColor="#94a3b8"
                  value={colDesc}
                  onChangeText={setColDesc}
                  style={styles.textInput}
                />
              </View>

              {/* Icon selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Folder Icon</Text>
                <View style={styles.iconSelectionRow}>
                  {[
                    { id: 'Shield', label: 'Shield' },
                    { id: 'Heart', label: 'Heart' },
                    { id: 'Music', label: 'Music' },
                  ].map((ic) => (
                    <TouchableOpacity
                      key={ic.id}
                      onPress={() => setColIcon(ic.id)}
                      style={[
                        styles.iconChoiceBtn, 
                        colIcon === ic.id ? styles.iconChoiceActive : styles.iconChoiceInactive
                      ]}
                    >
                      {renderCollectionIcon(ic.id, colIcon === ic.id ? '#ffffff' : '#475569')}
                      <Text style={[styles.iconChoiceLabel, colIcon === ic.id ? styles.iconChoiceLabelActive : styles.iconChoiceLabelInactive]}>{ic.id}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cover styling color */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Cover Accent Color</Text>
                <View style={styles.colorAccentRow}>
                  {gradPresets.map((gp, idx) => {
                    const isSel = colGradIdx === idx;
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setColGradIdx(idx)}
                        style={[
                          styles.colorOption, 
                          { backgroundColor: gp },
                          isSel && styles.colorOptionSelected
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleCreateCollection}
                style={styles.modalSubmitBtn}
              >
                <CheckCircle size={14} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.modalSubmitText}>Save Folder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Interactive Bento Card Preview Overlay Modal */}
      {selectedPreviewQuote && (
        <View style={styles.previewBackdrop}>
          <View style={styles.previewInner}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewHeaderTitle}>Post Preview</Text>
              <TouchableOpacity 
                onPress={() => setSelectedPreviewQuote(null)}
                style={styles.previewCloseBtn}
              >
                <X size={16} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SermonCard 
                quote={selectedPreviewQuote}
                onLike={onLike}
                onSave={onSave}
                onPlayAudio={onPlayAudio}
                currentPlayingId={currentPlayingId}
                isAudioPlaying={isAudioPlaying}
              />
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 16,
    marginBottom: 16,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#e1306c',
    padding: 2,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  username: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c13584',
    marginTop: 2,
  },
  churchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  churchText: {
    fontSize: 11,
    color: '#c13584',
    fontWeight: '700',
  },
  bio: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    marginTop: 6,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  tabsRow: {
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
    color: '#c13584',
  },
  tabLabelInactive: {
    color: '#64748b',
  },
  subContent: {
    marginBottom: 40,
  },
  emptyView: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  colHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  colHeaderTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  addFolderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFolderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c13584',
  },
  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    marginBottom: 12,
  },
  colCover: {
    aspectRatio: 1.5,
    padding: 12,
    justifyContent: 'space-between',
  },
  colCoverIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colCoverBrand: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    opacity: 0.8,
  },
  colBody: {
    padding: 10,
  },
  colName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  colSubText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ef4444',
    marginLeft: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  detailHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  collectionIntroBox: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  introName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  introDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
    paddingHorizontal: 12,
  },
  introBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    marginTop: 12,
  },
  introBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    position: 'absolute',
    top: -100,
    bottom: -100,
    left: -20,
    right: -20,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalCloseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  modalForm: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0f172a',
  },
  iconSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  iconChoiceActive: {
    backgroundColor: '#c13584',
    borderColor: '#c13584',
  },
  iconChoiceInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  iconChoiceLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
  },
  iconChoiceLabelActive: {
    color: '#ffffff',
  },
  iconChoiceLabelInactive: {
    color: '#475569',
  },
  colorAccentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#0f172a',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c13584',
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 10,
  },
  modalSubmitText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },

  // Switcher styling
  modeSwitcherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  modeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIconBtn: {
    padding: 6,
    marginLeft: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeIconBtnActive: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },

  // Bento-style Instagram Grid
  instaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  instaGridCell: {
    width: '31.3%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  instaGridText: {
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 12,
    fontFamily: 'serif',
  },
  instaGridScripture: {
    fontSize: 7,
    fontWeight: '900',
  },

  // Interactive Bento Card Preview styles
  previewBackdrop: {
    position: 'absolute',
    top: -100,
    bottom: -100,
    left: -20,
    right: -20,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  previewInner: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  previewHeaderTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewCloseBtn: {
    padding: 4,
  }
});
