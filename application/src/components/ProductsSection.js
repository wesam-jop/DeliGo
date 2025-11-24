import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { useGetProductsQuery } from '../store/slices/productsSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import ProductCard from './ProductCard';
import Container from './Container';

const ProductsSection = ({ onViewAll }) => {
  const { t, isRTL } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Fetch featured products
  const { data: productsData, isLoading } = useGetProductsQuery({
    per_page: 6,
    featured: true,
    sort_by: 'sort_order',
    sort_order: 'asc',
  });

  const products = productsData?.data?.data || [];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle}>
      <Container>
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <CustomText variant="h2" color={colors.primary} style={styles.title}>
            {t('featuredProducts')}
          </CustomText>
          <CustomButton
            variant="text"
            onPress={onViewAll}
            style={styles.viewAllButton}
          >
            <CustomText variant="body" color={colors.primary}>
              {t('viewAllProducts')}
            </CustomText>
          </CustomButton>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {products.map((product, index) => {
            const productCopy = { ...product };
            return (
              <ProductCard
                key={productCopy.id}
                product={productCopy}
                index={index}
                onPress={() => {
                  // Navigate to product details
                }}
              />
            );
          })}
        </ScrollView>
      </Container>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  viewAllButton: {
    padding: 0,
    minHeight: 'auto',
  },
  scrollView: {
    marginHorizontal: -20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
});

export default ProductsSection;
