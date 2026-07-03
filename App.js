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
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QuoteCard from './components/QuoteCard';
import quotes from './data/quotes';
import * as Clipboard from 'expo-clipboard';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';

export default function App() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [favorites, setFavorites] = useState({});

  const current = useMemo(() => quotes[index], [index]);

  const nextQuote = useCallback(() => {
    if (quotes.length <= 1) return;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * quotes.length);
    setIndex(next);
  }, [index]);

  const copyQuote = useCallback(async () => {
    const text = `"${current.text}" — ${current.author}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Quote copied to clipboard');
  }, [current]);

  const shareQuote = useCallback(async () => {
    try {
      await Share.share({ message: `"${current.text}" — ${current.author}\n\nShared via QuoteSpark ✨` });
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
  const favoriteCount = Object.keys(favorites).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require('./spark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.title}>QuoteSpark</Text>
            <Text style={styles.subtitle}>Daily inspiration ✨</Text>
          </View>
        </View>
        {favoriteCount > 0 && (
          <View style={styles.favBadge}>
            <AntDesign name="heart" size={12} color="#ff6b6b" />
            <Text style={styles.favBadgeText}>{favoriteCount}</Text>
          </View>
        )}
      </View>

      {/* Quote counter */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>{index + 1} / {quotes.length}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <QuoteCard quote={current} />

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={copyQuote} accessibilityLabel="Copy quote">
            <Feather name="copy" size={20} color="#fff" />
            <Text style={styles.iconLabel}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.newButton} onPress={nextQuote} accessibilityLabel="New quote">
            <LinearGradient
              colors={['#a855f7', '#6366f1']}
              style={styles.newButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="shuffle" size={20} color="#fff" />
              <Text style={styles.newButtonText}>New Quote</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={shareQuote} accessibilityLabel="Share quote">
            <Feather name="share-2" size={20} color="#fff" />
            <Text style={styles.iconLabel}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Favorite button */}
        <TouchableOpacity
          onPress={toggleFavorite}
          style={[styles.favoriteButton, isFavorited && styles.favoriteButtonActive]}
          accessibilityLabel="Favorite"
        >
          <AntDesign name={isFavorited ? 'heart' : 'hearto'} size={18} color={isFavorited ? '#ff6b6b' : 'rgba(255,255,255,0.7)'} />
          <Text style={[styles.favoriteText, isFavorited && styles.favoriteTextActive]}>
            {isFavorited ? 'Saved to Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>✨ Inspirational quotes to spark your day</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
  },
  favBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,107,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
  },
  favBadgeText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontWeight: '700',
  },
  counterRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  counterText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 24,
  },
  newButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  newButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    gap: 8,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    minWidth: 60,
  },
  iconLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 4,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderColor: 'rgba(255,107,107,0.3)',
  },
  favoriteText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteTextActive: {
    color: '#ff6b6b',
  },
  footer: {
    padding: 14,
    paddingBottom: Platform.OS === 'android' ? 40 : 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
});
