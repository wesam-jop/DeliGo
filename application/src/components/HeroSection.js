import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';
import CustomButton from './CustomButton';

const { width } = Dimensions.get('window');

const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale up
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // Rotate animation (continuous)
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const translateX = slideAnim;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, `${colors.primary}DD`, `${colors.primary}AA`]}
        start={{ x: isRTL ? 1 : 0, y: 0 }}
        end={{ x: isRTL ? 0 : 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Animated Background Circles */}
        <Animated.View
          style={[
            styles.circle,
            styles.circle1,
            {
              transform: [{ rotate }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            styles.circle2,
            {
              transform: [{ rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-15deg'],
              }) }],
            },
          ]}
        />

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: translateX },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons name="storefront" size={80} color={colors.background} />
          </Animated.View>

          {/* Title */}
          <CustomText
            variant="h1"
            color={colors.background}
            translate={true}
            translationKey="heroTitle"
            style={styles.title}
          />

          {/* Subtitle */}
          <CustomText
            variant="body"
            color={colors.background}
            translate={true}
            translationKey="heroSubtitle"
            style={styles.subtitle}
          />

          {/* Buttons */}
          <View style={[styles.buttonContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <CustomButton
              variant="primary"
              size="large"
              style={[styles.button, { backgroundColor: colors.background }]}
              textStyle={[styles.buttonText, { color: colors.primary }]}
              onPress={() => {}}
            >
              {t('shopNow')}
            </CustomButton>
            <CustomButton
              variant="outline"
              size="large"
              style={[styles.button, styles.buttonOutline]}
              textStyle={[styles.buttonText, styles.buttonOutlineText]}
              onPress={() => {}}
            >
              {t('explore')}
            </CustomButton>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -30,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.95,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
  },
  buttonText: {
    // Font is handled by CustomText component
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.background,
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: colors.background,
  },
});

export default HeroSection;

