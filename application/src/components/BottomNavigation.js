import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useGetCartCountQuery } from '../store/slices/cartSlice';
import { openCart } from '../store/slices/cartSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const { isRTL, language } = useLanguage();
  const dispatch = useAppDispatch();
  const { data: cartCountData } = useGetCartCountQuery();
  const cartCount = cartCountData?.data?.count || 0;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Tabs definition
  const allTabs = [
    { id: 'home', iconName: 'home' },
    { id: 'stores', iconName: 'storefront' },
    { id: 'products', iconName: 'cube' },
    { id: 'cart', iconName: 'cart', isCart: true },
    { id: 'profile', iconName: 'person' },
  ];

  // Reverse order for RTL
  const tabs = isRTL ? [...allTabs].reverse() : allTabs;

  // Animation for cart badge
  React.useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  const renderIcon = (iconName, isActive) => {
    const icon = isActive ? iconName : `${iconName}-outline`;
    return (
      <Ionicons 
        name={icon} 
        size={26} 
        color={isActive ? colors.primary : additionalColors.textLight} 
      />
    );
  };

  const handleTabPress = (tab) => {
    if (tab.isCart) {
      dispatch(openCart());
    } else {
      onTabChange(tab.id);
    }
  };

  // Separate cart tab from other tabs
  const regularTabs = tabs.filter(tab => !tab.isCart);
  const cartTab = tabs.find(tab => tab.isCart);

  // Split tabs for left and right sides
  const leftTabs = isRTL ? regularTabs.slice(2) : regularTabs.slice(0, 2);
  const rightTabs = isRTL ? regularTabs.slice(0, 2) : regularTabs.slice(2);

  return (
    <View style={styles.container}>
      {/* Left side tabs */}
      <View style={styles.tabsWrapper}>
        {leftTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={`${tab.id}-${language}`}
              style={styles.tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                {renderIcon(tab.iconName, isActive)}
              </View>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Center Cart Button - Part of the navigation bar */}
      {cartTab && (
        <View style={styles.cartButtonWrapper}>
          <TouchableOpacity
            style={styles.cartButtonContainer}
            onPress={() => handleTabPress(cartTab)}
            activeOpacity={0.8}
          >
            <View style={styles.cartButton}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons name="cart" size={28} color={colors.background} />
              </Animated.View>
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <CustomText variant="small" color={colors.background} style={styles.badgeText}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </CustomText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Right side tabs */}
      <View style={styles.tabsWrapper}>
        {rightTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={`${tab.id}-${language}`}
              style={styles.tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                {renderIcon(tab.iconName, isActive)}
              </View>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: additionalColors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    ...Platform.select({
      ios: {
        paddingBottom: 20,
      },
    }),
  },
  tabsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  activeIconContainer: {
    backgroundColor: `${colors.primary}10`,
  },
  activeIndicator: {
    position: 'absolute',
    top: 4,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    alignSelf: 'center',
  },
  cartButtonWrapper: {
    width: 80,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  cartButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.background,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
    marginTop: -24,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 3,
    borderColor: colors.background,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
