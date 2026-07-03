import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QuoteCard from './components/QuoteCard';
import quotes from './data/quotes';
import * as Clipboard from 'expo-clipboard';
import { AntDesign, Feather } from '@expo/vector-icons';

// Main App: displays a random quote, with new/copy/share/favorite actions
export default function App() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [favorites, setFavorites] = useState({});

  const current = useMemo(() => quotes[index], [index]);

  const nextQuote = useCallback(() => {
    // choose a different random index
    if (quotes.length <= 1) return;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * quotes.length);
    setIndex(next);
  }, [index]);

  const copyQuote = useCallback(async () => {
    const text = `${current.text} — ${current.author}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Quote copied to clipboard');
  }, [current]);

  const shareQuote = useCallback(async () => {
    try {
      await Share.share({ message: `${current.text} — ${current.author}` });
    } catch (e) {
      Alert.alert('Share failed', String(e));
    }
  }, [current]);

  const toggleFavorite = useCallback(() => {
    setFavorites(prev => {
      const key = index.toString();
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }, [index]);

  const isFavorited = !!favorites[index];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.title}>QuoteSpark</Text>
      </View>

      <View style={styles.content}>
        <QuoteCard quote={current} />

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={copyQuote} accessibilityLabel="Copy quote">
            <Feather name="copy" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.newButton} onPress={nextQuote} accessibilityLabel="New quote">
            <Text style={styles.newButtonText}>New Quote</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={shareQuote} accessibilityLabel="Share quote">
            <Feather name="share-2" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.favoriteRow}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteTouchable} accessibilityLabel="Favorite">
            <AntDesign name={isFavorited ? 'heart' : 'hearto'} size={22} color={isFavorited ? '#ff6b6b' : '#fff'} />
            <Text style={styles.favoriteText}>{isFavorited ? 'Favorited' : 'Favorite'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Inspirational quotes to spark your day</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'left',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginHorizontal: 32,
  },
  newButton: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 10,
    borderRadius: 12,
  },
  favoriteRow: {
    marginTop: 18,
    alignItems: 'center',
  },
  favoriteTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteText: {
    color: '#fff',
    marginLeft: 8,
  },
  footer: {
    padding: 14,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.85)',
  },
});
