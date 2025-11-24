import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';

const SelectInput = ({
  label,
  placeholder,
  value,
  options = [],
  onSelect,
  error,
  helperText,
  loading = false,
  disabled = false,
}) => {
  const { isRTL, t } = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const displayText = selectedOption?.label || placeholder;

  const handleSelect = (optionValue) => {
    onSelect?.(optionValue);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <CustomText
          variant="h3"
          color={additionalColors.text}
          style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}
        >
          {label}
        </CustomText>
      )}

      <TouchableOpacity
        style={[
          styles.selector,
          disabled && styles.selectorDisabled,
          error && styles.selectorError,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
        disabled={disabled || loading}
      >
        <View
          style={[
            styles.selectorContent,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <CustomText
              variant="body"
              color={
                selectedOption ? additionalColors.text : additionalColors.textLight
              }
              numberOfLines={1}
            >
              {displayText}
            </CustomText>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={additionalColors.textLight}
          style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}
        />
      </TouchableOpacity>

      {helperText && (
        <CustomText
          variant="caption"
          color={additionalColors.textLight}
          style={styles.helperText}
        >
          {helperText}
        </CustomText>
      )}

      {error && (
        <CustomText
          variant="caption"
          color={additionalColors.error}
          style={styles.errorText}
        >
          {error}
        </CustomText>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View
              style={[
                styles.modalHeader,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <CustomText variant="h3" color={colors.primary} style={styles.modalTitle}>
                {label || placeholder}
              </CustomText>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={22} color={additionalColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
            >
              {options.length === 0 ? (
                <CustomText
                  variant="body"
                  color={additionalColors.textLight}
                  style={styles.emptyState}
                >
                  {t('noContentAvailable')}
                </CustomText>
              ) : (
                options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemSelected,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' },
                      ]}
                      onPress={() => handleSelect(option.value)}
                    >
                      <CustomText
                        variant="body"
                        color={isSelected ? colors.primary : additionalColors.text}
                        style={styles.optionLabel}
                      >
                        {option.label}
                      </CustomText>
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: additionalColors.divider,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: additionalColors.border,
    minHeight: 52,
  },
  selectorDisabled: {
    opacity: 0.6,
  },
  selectorError: {
    borderColor: additionalColors.error,
  },
  selectorContent: {
    flex: 1,
  },
  helperText: {
    marginTop: 4,
  },
  errorText: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 16,
  },
  modalHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    flex: 1,
  },
  optionsList: {
    maxHeight: '100%',
  },
  optionsListContent: {
    paddingBottom: 20,
  },
  optionItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionItemSelected: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    borderBottomColor: 'transparent',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  optionLabel: {
    flex: 1,
  },
  emptyState: {
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default SelectInput;


