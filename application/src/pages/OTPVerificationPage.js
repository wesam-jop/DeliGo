import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { verifyPhone, resendVerification, clearError } from '../store/slices/authSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import Container from '../components/Container';
import { Ionicons } from '@expo/vector-icons';

const OTPVerificationPage = ({ onNavigate, phone: propPhone, action: propAction = 'login' }) => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '']); // 5 digits like web
  const [phone, setPhone] = useState(propPhone || '');
  const [action, setAction] = useState(propAction);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (propPhone) {
      setPhone(propPhone);
    }
    if (propAction) {
      setAction(propAction);
    }
  }, [propPhone, propAction]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.split('').slice(0, 5);
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 5) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      // Focus last input
      if (index + pastedOtp.length < 5) {
        inputRefs.current[index + pastedOtp.length]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    
    // OTP is 5 digits (same as web)
    if (code.length !== 5) {
      Alert.alert(t('error'), t('pleaseEnterCompleteCode'));
      return;
    }

    if (!phone) {
      Alert.alert(t('error'), t('phoneNumberRequired'));
      return;
    }

    const result = await dispatch(verifyPhone({ phone, code, action }));
    
    if (verifyPhone.fulfilled.match(result)) {
      // Verification successful - App.js will handle navigation automatically
      // No need to show alert or navigate manually
    } else {
      Alert.alert(t('error'), result.payload || t('verificationFailed'));
    }
  };

  const handleResend = async () => {
    if (!phone) {
      Alert.alert(t('error'), t('phoneNumberRequired'));
      return;
    }

    setResendLoading(true);
    const result = await dispatch(resendVerification({ phone, action }));
    setResendLoading(false);

    if (resendVerification.fulfilled.match(result)) {
      setCountdown(60);
      Alert.alert(t('success'), result.payload || t('codeResent'));
    } else {
      Alert.alert(t('error'), result.payload || t('resendFailed'));
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
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark-outline" size={64} color={colors.primary} />
            </View>
            <CustomText variant="h1" color={colors.primary} style={styles.title}>
              {t('verifyPhone')}
            </CustomText>
            <CustomText variant="body" color={additionalColors.textLight} style={styles.subtitle}>
              {t('enterVerificationCode')}
            </CustomText>
            {phone && (
              <CustomText variant="body" color={colors.primary} style={styles.phoneText}>
                {phone}
              </CustomText>
            )}
          </View>

          <View style={styles.form}>
            <View style={[styles.otpContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textAlign="center"
                />
              ))}
            </View>

            {error && (
              <CustomText variant="small" color={additionalColors.error} style={styles.errorText}>
                {error}
              </CustomText>
            )}

            <CustomButton
              onPress={handleVerify}
              loading={loading}
              disabled={loading}
              style={styles.verifyButton}
              translate={true}
              translationKey="verify"
            />

            <View style={styles.resendContainer}>
              <CustomText variant="body" color={additionalColors.textLight}>
                {t('didntReceiveCode')}{' '}
              </CustomText>
              {countdown > 0 ? (
                <CustomText variant="body" color={additionalColors.textLight}>
                  {t('resendIn')} {countdown}s
                </CustomText>
              ) : (
                <CustomButton
                  variant="text"
                  onPress={handleResend}
                  loading={resendLoading}
                  disabled={resendLoading}
                  style={styles.resendButton}
                >
                  <CustomText variant="body" color={colors.primary}>
                    {t('resendCode')}
                  </CustomText>
                </CustomButton>
              )}
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
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneText: {
    marginTop: 8,
    fontFamily: 'Cairo-Bold',
  },
  form: {
    width: '100%',
  },
  otpContainer: {
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 56,
    height: 64,
    borderWidth: 1,
    borderColor: additionalColors.border,
    borderRadius: 8,
    fontSize: 28,
    fontFamily: 'Cairo-Bold',
    paddingVertical: 0,
    paddingHorizontal: 0,
    lineHeight: 64,
    ...(Platform.OS === 'android' && { 
      includeFontPadding: false, 
      textAlignVertical: 'center' 
    }),
  },
  otpInputFilled: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.background,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButton: {
    padding: 0,
    minHeight: 'auto',
  },
});

export default OTPVerificationPage;
