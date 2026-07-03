import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuoteCard({ quote, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);
    scale.setValue(0.96);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 480, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 480, useNativeDriver: true }),
    ]).start();
  }, [quote]);

  return (
    <Animated.View style={[styles.card, style, { opacity, transform: [{ translateY }, { scale }] }]}>
      {/* Decorative top accent */}
      <View style={styles.accent} />

      {/* Quote icon */}
      <Ionicons name="chatbubble-ellipses" size={28} color="rgba(168,85,247,0.4)" style={styles.quoteIcon} />

      <Text style={styles.quote} numberOfLines={7}>
        "{quote.text}"
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      <Text style={styles.author}>— {quote.author}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#a855f7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  quoteIcon: {
    marginBottom: 14,
  },
  quote: {
    fontSize: 20,
    lineHeight: 32,
    color: '#f1f5f9',
    textAlign: 'left',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 18,
  },
  author: {
    fontSize: 14,
    color: 'rgba(168,85,247,0.9)',
    textAlign: 'right',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
