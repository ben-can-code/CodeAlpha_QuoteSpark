import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

// QuoteCard: presents a quote with a smooth cross-fade and slide animation.
// Props:
// - `quote`: { text, author }
// - `style`: optional container style override
export default function QuoteCard({ quote, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    // On quote change, run a small animation: fade + slide up
    opacity.setValue(0);
    translateY.setValue(8);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [quote, opacity, translateY]);

  return (
    <Animated.View
      style={[styles.card, style, { opacity, transform: [{ translateY }] }]}
    >
      <Text style={styles.quote} numberOfLines={6}>
        “{quote.text}”
      </Text>
      <Text style={styles.author}>— {quote.author}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 22,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  quote: {
    fontSize: 20,
    lineHeight: 28,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '600',
  },
  author: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
});
