import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/slices/authSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Container from '../components/Container';
import CountrySelectInput from '../components/CountrySelectInput';
import SelectInput from '../components/SelectInput';
import { useGetGovernoratesQuery, useGetCitiesQuery } from '../store/slices/locationSlice';
import { Ionicons } from '@expo/vector-icons';

const RegisterPage = ({ onNavigate }) => {
  const { t, isRTL, language } = useLanguage();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [selectedCountry, setSelectedCountry] = useState({
    code: 'SY',
    name: 'Syria',
    nameAr: 'سوريا',
    dialCode: '+963',
    flag: '🇸🇾'
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    agree_terms: false,
    governorate_id: null,
    city_id: null,
  });

  const { data: governoratesData, isLoading: isGovernoratesLoading } = useGetGovernoratesQuery();
  const {
    data: citiesData,
    isLoading: isCitiesLoading,
  } = useGetCitiesQuery(formData.governorate_id || null, {
    skip: !formData.governorate_id,
  });

  const governorates = governoratesData?.data || [];
  const cities = citiesData?.data || [];

  const governorateOptions = useMemo(() => {
    return governorates.map((item) => ({
      value: item.id,
      label:
        language === 'ar'
          ? item.name_ar || item.name_en || item.name || String(item.id)
          : item.name_en || item.name_ar || item.name || String(item.id),
    }));
  }, [governorates, language]);

  const cityOptions = useMemo(() => {
    return cities.map((item) => ({
      value: item.id,
      label:
        language === 'ar'
          ? item.name_ar || item.name_en || item.name || String(item.id)
          : item.name_en || item.name_ar || item.name || String(item.id),
    }));
  }, [cities, language]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      Alert.alert(t('error'), t('nameAndPhoneRequired'));
      return;
    }

    if (!selectedCountry) {
      Alert.alert(t('error'), t('countryRequired'));
      return;
    }

    if (!formData.agree_terms) {
      Alert.alert(t('error'), t('mustAgreeToTerms'));
      return;
    }

    if (!formData.governorate_id) {
      Alert.alert(t('error'), t('governorateRequired'));
      return;
    }

    if (!formData.city_id) {
      Alert.alert(t('error'), t('cityRequired'));
      return;
    }

    // Clean phone number: remove all non-digits
    let cleanPhone = formData.phone.trim().replace(/[^0-9]/g, '');
    
    // Remove leading zero if exists
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    // Validate phone format
    if (cleanPhone.length < 6 || cleanPhone.length > 15) {
      Alert.alert(t('error'), t('invalidPhoneNumber'));
      return;
    }

    // Get dial code without +
    const dialCode = selectedCountry.dialCode.replace('+', '');
    
    // Combine: dial code + phone number (without + and without leading zero)
    const fullPhone = dialCode + cleanPhone;

    const registerData = {
      name: formData.name.trim(),
      phone: fullPhone,
      governorate_id: formData.governorate_id,
      city_id: formData.city_id,
    };

    const result = await dispatch(register(registerData));
    
    if (register.fulfilled.match(result)) {
      if (result.payload.verificationRequired) {
        // Navigate to OTP page with phone number
        onNavigate?.('otp', { phone: fullPhone });
      }
      // If no verification required, App.js will handle navigation
    } else {
      Alert.alert(t('error'), result.payload || t('registerFailed'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Container style={styles.container}>
          <View style={styles.header}>
            <CustomText variant="h1" color={colors.primary} style={styles.title}>
              {t('register')}
            </CustomText>
            <CustomText variant="body" color={additionalColors.textLight} style={styles.subtitle}>
              {t('registerSubtitle')}
            </CustomText>
          </View>

          <View style={styles.form}>
            <CustomInput
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder={t('name')}
              leftIcon={<Ionicons name="person-outline" size={20} color={additionalColors.textLight} />}
              error={error && error.includes('name') ? error : null}
            />

            <View style={styles.countrySection}>
              <CountrySelectInput
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
                placeholder={t('selectCountry')}
                error={error && error.includes('country') ? error : null}
              />
            </View>

            <View style={styles.phoneSection}>
              <CustomInput
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                placeholder={t('phoneNumber')}
                keyboardType="phone-pad"
                leftIcon={<Ionicons name="call-outline" size={20} color={additionalColors.textLight} />}
                error={error && error.includes('phone') && !error.includes('country') ? error : null}
              />
            </View>

            <View style={styles.locationSection}>
              <CustomText variant="h2" color={colors.primary} style={styles.locationTitle}>
                {t('registerLocationTitle')}
              </CustomText>
              <CustomText variant="body" color={additionalColors.textLight} style={styles.locationSubtitle}>
                {t('registerLocationSubtitle')}
              </CustomText>

              <SelectInput
                label={t('governorate')}
                placeholder={t('selectGovernorate')}
                value={formData.governorate_id}
                options={governorateOptions}
                onSelect={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    governorate_id: value,
                    city_id: null,
                  }))
                }
                loading={isGovernoratesLoading}
                error={error && error.includes('governorate') ? error : null}
              />

              <SelectInput
                label={t('area')}
                placeholder={t('selectCity')}
                value={formData.city_id}
                options={cityOptions}
                onSelect={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    city_id: value,
                  }))
                }
                loading={isCitiesLoading}
                disabled={!formData.governorate_id}
                error={error && error.includes('city') ? error : null}
              />
            </View>

            {/* Terms Agreement */}
            <View style={[styles.termsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Switch
                value={formData.agree_terms}
                onValueChange={(value) => handleChange('agree_terms', value)}
                trackColor={{ false: additionalColors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
              <View style={styles.termsTextContainer}>
                <CustomText variant="body" color={additionalColors.text} style={styles.termsText}>
                  {t('agreeToTerms')}{' '}
                  <CustomText variant="body" color={colors.primary} onPress={() => onNavigate?.('terms')}>
                    {t('termsOfService')}
                  </CustomText>
                  {' '}{t('and')}{' '}
                  <CustomText variant="body" color={colors.primary} onPress={() => onNavigate?.('privacy')}>
                    {t('privacyPolicy')}
                  </CustomText>
                </CustomText>
              </View>
            </View>

            <CustomButton
              onPress={handleRegister}
              loading={loading}
              disabled={loading || !formData.agree_terms}
              style={styles.registerButton}
              translate={true}
              translationKey="sendOTP"
            />

            <View style={styles.footer}>
              <CustomText variant="body" color={additionalColors.textLight}>
                {t('alreadyHaveAccount')}{' '}
              </CustomText>
              <CustomButton
                variant="text"
                onPress={() => onNavigate?.('login')}
                style={styles.linkButton}
              >
                <CustomText variant="body" color={colors.primary}>
                  {t('login')}
                </CustomText>
              </CustomButton>
            </View>
          </View>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
  },
  countrySection: {
    marginTop: 16,
    marginBottom: 16,
  },
  phoneSection: {
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: additionalColors.border,
  },
  locationTitle: {
    marginBottom: 4,
    textAlign: 'center',
  },
  locationSubtitle: {
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: additionalColors.divider,
    borderRadius: 8,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  termsText: {
    lineHeight: 20,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  linkButton: {
    padding: 0,
    minHeight: 'auto',
  },
});

export default RegisterPage;
