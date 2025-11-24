import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { requestOTP, clearError } from '../store/slices/authSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Container from '../components/Container';
import CountrySelectInput from '../components/CountrySelectInput';
import { Ionicons } from '@expo/vector-icons';

const LoginPage = ({ onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [selectedCountry, setSelectedCountry] = useState({
    code: 'SY',
    name: 'Syria',
    nameAr: 'سوريا',
    dialCode: '+963',
    flag: '🇸🇾'
  });
  const [phone, setPhone] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleRequestOTP = async () => {
    if (!phone.trim()) {
      Alert.alert(t('error'), t('phoneNumberRequired'));
      return;
    }

    if (!selectedCountry) {
      Alert.alert(t('error'), t('countryRequired'));
      return;
    }

    // Clean phone number: remove all non-digits
    let cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    
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
    
    try {
      console.log('Dispatching requestOTP with phone:', fullPhone);
      const result = await dispatch(requestOTP({ phone: fullPhone }));
      
      if (requestOTP.fulfilled.match(result)) {
        console.log('OTP request successful');
        // Navigate to OTP page
        onNavigate?.('otp', { phone: fullPhone });
      } else {
        console.error('OTP request failed:', result.payload);
        const errorMessage = result.payload || t('otpRequestFailed');
        Alert.alert(t('error'), errorMessage);
      }
    } catch (error) {
      console.error('Unexpected error in handleRequestOTP:', error);
      Alert.alert(t('error'), error.message || t('otpRequestFailed'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Container style={styles.container}>
          <View style={styles.header}>
            <CustomText variant="h1" color={colors.primary} style={styles.title}>
              {t('welcome')}
            </CustomText>
            <CustomText variant="body" color={additionalColors.textLight} style={styles.subtitle}>
              {t('loginSubtitle')}
            </CustomText>
          </View>

          <View style={styles.form}>
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
                value={phone}
                onChangeText={setPhone}
                placeholder={t('phoneNumber')}
                keyboardType="phone-pad"
                leftIcon={<Ionicons name="call-outline" size={20} color={additionalColors.textLight} />}
                error={error && !error.includes('country') ? error : null}
                autoFocus
              />
            </View>

            <CustomButton
              onPress={handleRequestOTP}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              translate={true}
              translationKey="sendOTP"
            />

            <View style={styles.footer}>
              <CustomText variant="body" color={additionalColors.textLight}>
                {t('dontHaveAccount')}{' '}
              </CustomText>
              <CustomButton
                variant="text"
                onPress={() => onNavigate?.('register')}
                style={styles.linkButton}
              >
                <CustomText variant="body" color={colors.primary}>
                  {t('register')}
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
    marginBottom: 16,
  },
  phoneSection: {
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 24,
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

export default LoginPage;
