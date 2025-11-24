import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';

const { width: screenWidth } = Dimensions.get('window');

const AdSlider = () => {
  const { isRTL } = useLanguage();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const autoPlayTimer = useRef(null);

  // Sample ads data - replace with real data later
  const ads = [
    {
      id: 1,
      title: 'عروض خاصة',
      subtitle: 'خصم يصل إلى 50%',
      description: 'على جميع المنتجات المختارة',
      gradient: ['#667eea', '#764ba2'],
      icon: 'flash',
      badge: 'عرض محدود',
    },
    {
      id: 2,
      title: 'توصيل مجاني',
      subtitle: 'لجميع الطلبات',
      description: 'للطلبات التي تزيد عن 100 ليرة',
      gradient: ['#f093fb', '#f5576c'],
      icon: 'car',
      badge: 'مميز',
    },
    {
      id: 3,
      title: 'منتجات جديدة',
      subtitle: 'اكتشف أحدث العروض',
      description: 'مجموعة واسعة من المنتجات المميزة',
      gradient: ['#4facfe', '#00f2fe'],
      icon: 'star',
      badge: 'جديد',
    },
  ];

  useEffect(() => {
    // Animation on mount - only once
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto play
    startAutoPlay();

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, []);

  const startAutoPlay = () => {
    autoPlayTimer.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ads.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 5000);
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.95}
        style={styles.slideContainer}
        onPress={() => {
          // Handle ad click
          console.log('Ad clicked:', item.id);
        }}
      >
        <LinearGradient
          colors={item.gradient}
          start={{ x: isRTL ? 1 : 0, y: 0 }}
          end={{ x: isRTL ? 0 : 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Badge */}
            {item.badge && (
              <View style={[styles.badgeContainer, { [isRTL ? 'left' : 'right']: 20 }]}>
                <View style={styles.badge}>
                  <CustomText
                    variant="small"
                    color={colors.background}
                    style={styles.badgeText}
                  >
                    {item.badge}
                  </CustomText>
                </View>
              </View>
            )}

            {/* Main Content */}
            <View style={[styles.mainContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {/* Left Section - Icon and Text */}
              <View style={styles.leftSection}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={item.icon} size={40} color={colors.background} />
                </View>
                <View style={styles.textWrapper}>
                  <CustomText
                    variant="h2"
                    color={colors.background}
                    style={styles.adTitle}
                  >
                    {item.title}
                  </CustomText>
                  <CustomText
                    variant="h3"
                    color={colors.background}
                    style={styles.adSubtitle}
                  >
                    {item.subtitle}
                  </CustomText>
                  <CustomText
                    variant="caption"
                    color={colors.background}
                    style={styles.adDescription}
                  >
                    {item.description}
                  </CustomText>
                </View>
              </View>

              {/* Right Section - Arrow */}
              <View style={styles.rightSection}>
                <View style={styles.arrowWrapper}>
                  <Ionicons
                    name={isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={28}
                    color={colors.background}
                  />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="start"
      >
        {ads.map((item, index) => renderItem(item, index))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.indicatorsContainer}>
        {ads.map((_, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => {
              scrollToIndex(index);
              setCurrentIndex(index);
            }}
            style={styles.indicatorWrapper}
          >
            <Animated.View
              style={[
                styles.indicator,
                currentIndex === index && styles.indicatorActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginHorizontal: 0,
  },
  scrollView: {
    width: screenWidth,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  slideContainer: {
    width: screenWidth,
    paddingHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  gradient: {
    padding: 28,
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    position: 'absolute',
    top: 20,
    zIndex: 2,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  badgeText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textWrapper: {
    flex: 1,
  },
  adTitle: {
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  adSubtitle: {
    marginBottom: 12,
    opacity: 0.95,
    letterSpacing: 0.2,
  },
  adDescription: {
    opacity: 0.85,
    lineHeight: 20,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
  },
  arrowWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  indicatorWrapper: {
    padding: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: additionalColors.border,
  },
  indicatorActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
});

export default AdSlider;
