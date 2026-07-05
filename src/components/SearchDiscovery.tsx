import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { 
  Search, 
  Shield, 
  Heart, 
  Sparkles, 
  Compass, 
  Music, 
  Flame, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react-native';
import { SermonQuote } from '../types';
import { INITIAL_TOPICS } from '../data';

interface SearchDiscoveryProps {
  quotes: SermonQuote[];
  onSelectQuote: (quote: SermonQuote) => void;
  onSelectTopic: (topicName: string) => void;
}

export const SearchDiscovery: React.FC<SearchDiscoveryProps> = ({
  quotes,
  onSelectQuote,
  onSelectTopic
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping helper
  const renderTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield size={18} color="#4338ca" />;
      case 'Heart': return <Heart size={18} color="#e11d48" />;
      case 'Sparkles': return <Sparkles size={18} color="#d97706" />;
      case 'Compass': return <Compass size={18} color="#2563eb" />;
      case 'Music': return <Music size={18} color="#db2777" />;
      case 'Flame': return <Flame size={18} color="#ea580c" />;
      default: return <BookOpen size={18} color="#64748b" />;
    }
  };

  // Filter quotes based on search query
  const searchedQuotes = searchQuery 
    ? quotes.filter(q => 
        q.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.church.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.scripture.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Interactive Search Header */}
      <View style={styles.panel}>
        <View style={styles.panelTitleContainer}>
          <Compass size={18} color="#4f46e5" style={{ marginRight: 8 }} />
          <Text style={styles.panelTitle}>Explore Selah Network</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput 
            id="search-tab-input"
            placeholder="Explore Scriptures, Pastors, Churches..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <Text style={styles.searchIcon}>🔎</Text>
        </View>

        {/* Live Search Results List */}
        {searchQuery.length > 0 && (
          <View style={styles.resultsArea}>
            <Text style={styles.sectionHeader}>Search Results</Text>
            {searchedQuotes.length > 0 ? (
              searchedQuotes.map(quote => (
                <TouchableOpacity
                  key={quote.id}
                  onPress={() => onSelectQuote(quote)}
                  style={styles.resultItem}
                >
                  <View style={[styles.resultBadge, { backgroundColor: quote.background }]}>
                    <Text style={styles.resultBadgeQuote}>“</Text>
                  </View>
                  <View style={styles.resultDetails}>
                    <Text style={styles.resultQuote} numberOfLines={1}>“{quote.quote}”</Text>
                    <Text style={styles.resultSub}>{quote.speaker} • {quote.scripture}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyResults}>No direct matches. Try searching "Grace", "Platt", or "John".</Text>
            )}
          </View>
        )}
      </View>

      {/* Topics / Core Themes Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Flame size={16} color="#f59e0b" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Browse by Core Spiritual Themes</Text>
        </View>
        
        <View style={styles.grid}>
          {INITIAL_TOPICS.map((topic) => (
            <TouchableOpacity
              key={topic.name}
              onPress={() => onSelectTopic(topic.name)}
              style={styles.topicCard}
            >
              <View style={styles.topicLeft}>
                <View style={styles.topicIconBox}>
                  {renderTopicIcon(topic.icon)}
                </View>
                <View>
                  <Text style={styles.topicName}>{topic.name}</Text>
                  <Text style={styles.topicCount}>{topic.count}+ quotes shared</Text>
                </View>
              </View>
              <ArrowRight size={14} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Books of the Bible Grid */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <BookOpen size={16} color="#4f46e5" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Explore Scriptures</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.booksRow}
        >
          {[
            { book: 'Psalms', count: '142', range: 'OT Poetry', bg: '#eff6ff' },
            { book: 'Romans', count: '98', range: 'NT Epistles', bg: '#fef3c7' },
            { book: 'John', count: '124', range: 'Gospel', bg: '#ecfdf5' },
            { book: 'Proverbs', count: '76', range: 'OT Wisdom', bg: '#fdf2f8' },
            { book: 'Ephesians', count: '63', range: 'NT Epistles', bg: '#f5f3ff' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => onSelectTopic(item.book)}
              style={[styles.bookCard, { backgroundColor: item.bg }]}
            >
              <Text style={styles.bookRange}>{item.range}</Text>
              <Text style={styles.bookName}>{item.book}</Text>
              <Text style={styles.bookCount}>{item.count} Cards</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Quote Gallery */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <Text style={styles.sectionTitle}>Trending Quotes This Week</Text>
        
        <View style={styles.grid}>
          {quotes.slice(0, 4).map((quote) => (
            <TouchableOpacity 
              key={quote.id}
              onPress={() => onSelectQuote(quote)}
              style={[styles.trendingCard, { backgroundColor: quote.background }]}
            >
              <Text style={styles.trendingCardHash}>#SELAH</Text>
              <Text style={styles.trendingCardQuote} numberOfLines={3}>
                “{quote.quote}”
              </Text>
              <View style={styles.trendingCardFooter}>
                <Text style={styles.trendingCardSpeaker} numberOfLines={1}>{quote.speaker.split(' ').pop()}</Text>
                <Text style={styles.trendingCardLikes}>❤ {quote.likesCount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  panelTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
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
  resultsArea: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  resultBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultBadgeQuote: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultDetails: {
    flex: 1,
  },
  resultQuote: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  resultSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  emptyResults: {
    fontSize: 11,
    color: '#94a3b8',
    paddingVertical: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topicIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topicName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  topicCount: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  booksRow: {
    paddingVertical: 4,
  },
  bookCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minWidth: 110,
    marginRight: 10,
  },
  bookRange: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bookName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 6,
  },
  bookCount: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  trendingCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendingCardHash: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.5,
  },
  trendingCardQuote: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 4,
  },
  trendingCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 6,
  },
  trendingCardSpeaker: {
    fontSize: 8,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    flex: 1,
  },
  trendingCardLikes: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    marginLeft: 4,
  }
});
