import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';
import CustomButton from './CustomButton';

const { height: screenHeight } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, onApplyFilters, filters, categories, governorates, areas, cities }) => {
  const { t, isRTL, language } = useLanguage();
  
  // Helper function to convert API data to filter format
  const convertToFilterOptions = React.useCallback((data) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => {
      // Handle different API response formats
      if (item.value && item.label) {
        return item; // Already in correct format
      }
      // Handle format with id and name_ar/name_en - use language-specific name
      const label = language === 'ar' 
        ? (item.name_ar || item.name_en || item.name || String(item.id))
        : (item.name_en || item.name_ar || item.name || String(item.id));
      const value = item.id || item.value;
      return { value, label };
    });
  }, [language]);

  // Convert props to filter options with memoization
  const categoryOptions = useMemo(() => convertToFilterOptions(categories), [categories, convertToFilterOptions]);
  const governorateOptions = useMemo(() => convertToFilterOptions(governorates), [governorates, convertToFilterOptions]);
  // Use areas if provided, otherwise use cities
  const areaOptions = useMemo(() => convertToFilterOptions(areas || cities), [areas, cities, convertToFilterOptions]);

  // Create fresh copy of filters
  const [localFilters, setLocalFilters] = useState(() => ({
    category: filters?.category || filters?.category_id || null,
    governorate: filters?.governorate || filters?.governorate_id || null,
    area: filters?.area || filters?.city_id || null,
  }));
  
  // Create fresh Animated.Value to avoid frozen object issues
  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      // Create fresh copy when modal opens
      setLocalFilters({
        category: filters?.category || filters?.category_id || null,
        governorate: filters?.governorate || filters?.governorate_id || null,
        area: filters?.area || filters?.city_id || null,
      });
      // Reset open select when modal opens
      setOpenSelect(null);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }).start();
    } else {
      // Close any open selects when modal closes
      setOpenSelect(null);
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, filters, slideAnim]);

  const handleFilterChange = (type, value) => {
    setLocalFilters((prev) => {
      // Create a fresh copy to avoid frozen object issues
      const prevCopy = { ...prev };
      const newFilters = {
        ...prevCopy,
        [type]: value === prevCopy[type] ? null : value,
      };
      // Reset area when governorate changes
      if (type === 'governorate' && value !== prevCopy.governorate) {
        newFilters.area = null;
      }
      return newFilters;
    });
  };

  const handleApply = () => {
    // Convert filter keys to match Redux store format
    const convertedFilters = {
      category_id: localFilters.category || null,
      governorate_id: localFilters.governorate || null,
      city_id: localFilters.area || null,
    };
    onApplyFilters(convertedFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      category: null,
      governorate: null,
      area: null,
    };
    setLocalFilters(clearedFilters);
    // Convert to Redux format
    const convertedFilters = {
      category_id: null,
      governorate_id: null,
      city_id: null,
    };
    onApplyFilters(convertedFilters);
    onClose();
  };

  const animatedStyle = {
    transform: [{ translateY: slideAnim }],
  };

  // State for select dropdowns
  const [openSelect, setOpenSelect] = useState(null);

  const renderSelectBox = (title, options, filterKey) => {
    const safeOptions = Array.isArray(options) ? options : [];
    const selectedValue = localFilters[filterKey];
    const selectedOption = safeOptions.find(opt => opt.value === selectedValue);
    const displayText = selectedOption 
      ? selectedOption.label 
      : (filterKey === 'category' ? t('allCategories') : filterKey === 'governorate' ? t('allGovernorates') : t('allAreas'));

    return (
      <View style={styles.selectSection}>
        <CustomText variant="h3" color={colors.primary} style={styles.selectLabel}>
          {title}
        </CustomText>
        <View style={styles.selectBoxContainer}>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => {
              // Close other selects when opening a new one
              setOpenSelect(openSelect === filterKey ? null : filterKey);
            }}
          >
            <CustomText 
              variant="body" 
              color={selectedValue ? additionalColors.text : additionalColors.textLight}
              style={styles.selectText}
            >
              {displayText}
            </CustomText>
            <Ionicons 
              name={openSelect === filterKey ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={additionalColors.text} 
            />
          </TouchableOpacity>
          
          {openSelect === filterKey && (
            <View style={styles.dropdown} key={`dropdown-${filterKey}`}>
              <ScrollView 
                style={styles.dropdownScroll} 
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
              >
              <TouchableOpacity
                style={[
                  styles.dropdownOption,
                  selectedValue === null && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  handleFilterChange(filterKey, null);
                  setOpenSelect(null);
                }}
              >
                <CustomText
                  variant="body"
                  color={selectedValue === null ? colors.primary : additionalColors.text}
                >
                  {filterKey === 'category' ? t('allCategories') : filterKey === 'governorate' ? t('allGovernorates') : t('allAreas')}
                </CustomText>
                {selectedValue === null && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
              {safeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownOption,
                    selectedValue === option.value && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    handleFilterChange(filterKey, option.value);
                    setOpenSelect(null);
                  }}
                >
                  <CustomText
                    variant="body"
                    color={selectedValue === option.value ? colors.primary : additionalColors.text}
                  >
                    {option.label}
                  </CustomText>
                  {selectedValue === option.value && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          {/* Header */}
          <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <CustomText variant="h2" color={colors.primary} style={styles.modalTitle}>
              {t('filter')}
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={additionalColors.text} />
            </TouchableOpacity>
          </View>

          {/* Filter Content */}
          <ScrollView
            style={styles.filterContent}
            contentContainerStyle={styles.filterContentContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {renderSelectBox(t('category'), categoryOptions, 'category')}
            {renderSelectBox(t('governorate'), governorateOptions, 'governorate')}
            {renderSelectBox(t('area'), areaOptions, 'area')}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <CustomButton
              variant="outline"
              size="large"
              onPress={handleClear}
              style={styles.clearButton}
            >
              {t('clearFilters')}
            </CustomButton>
            <CustomButton
              variant="primary"
              size="large"
              onPress={handleApply}
              style={styles.applyButton}
            >
              {t('filter')}
            </CustomButton>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.85,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
  },
  modalTitle: {
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
  },
  filterContent: {
    flex: 1,
  },
  filterContentContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding for dropdowns
  },
  selectSection: {
    marginBottom: 20,
    zIndex: 1,
    position: 'relative',
  },
  selectLabel: {
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  selectBoxContainer: {
    position: 'relative',
    zIndex: 1,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: additionalColors.divider,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: additionalColors.border,
  },
  selectText: {
    flex: 1,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: additionalColors.border,
    maxHeight: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
    position: 'relative',
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
  },
  dropdownOptionSelected: {
    backgroundColor: `${colors.primary}10`,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: additionalColors.divider,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  checkIcon: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: additionalColors.border,
  },
  clearButton: {
    flex: 1,
    marginRight: 6,
  },
  applyButton: {
    flex: 1,
    marginLeft: 6,
  },
});

export default FilterModal;

