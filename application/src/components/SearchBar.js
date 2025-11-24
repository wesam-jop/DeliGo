import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';

const SearchBar = ({ value, onChangeText, onSearch, placeholder, style }) => {
  const { t, isRTL } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  
  // Use controlled component if value/onChangeText provided, otherwise use internal state
  const isControlled = value !== undefined && onChangeText !== undefined;
  const [internalSearchText, setInternalSearchText] = useState('');
  const searchText = isControlled ? value : internalSearchText;
  
  // Create fresh Animated.Value to avoid frozen object issues
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      damping: 15,
      stiffness: 200,
      useNativeDriver: false,
    }).start();
  }, [focusAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.spring(focusAnim, {
      toValue: 0,
      damping: 15,
      stiffness: 200,
      useNativeDriver: false,
    }).start();
  }, [focusAnim]);

  const handleSearch = useCallback((text) => {
    if (isControlled) {
      onChangeText(text);
    } else {
      setInternalSearchText(text);
    }
    if (onSearch) {
      onSearch(text);
    }
  }, [isControlled, onChangeText, onSearch]);

  const handleClear = useCallback(() => {
    if (isControlled) {
      onChangeText('');
    } else {
      setInternalSearchText('');
    }
    if (onSearch) {
      onSearch('');
    }
  }, [isControlled, onChangeText, onSearch]);

  // Memoize interpolated values
  const borderColor = useMemo(() => {
    return focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [additionalColors.border, colors.primary],
    });
  }, [focusAnim]);

  const scale = useMemo(() => {
    return focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.02],
    });
  }, [focusAnim]);

  return (
    <Animated.View style={[styles.container, style, { transform: [{ scale }] }]}>
      <Animated.View style={[styles.searchContainer, { borderColor }]}>
        <Ionicons
          name="search"
          size={22}
          color={isFocused ? colors.primary : additionalColors.textLight}
          style={[styles.searchIcon, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]}
        />
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={placeholder || t('searchStores')}
          placeholderTextColor={additionalColors.textLight}
          value={searchText}
          onChangeText={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={additionalColors.textLight} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: additionalColors.text,
    fontFamily: 'Cairo-Regular',
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;
