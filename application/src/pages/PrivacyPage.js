import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useGetPrivacyQuery } from '../store/slices/contentSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from '../components/CustomText';
import Container from '../components/Container';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPage = ({ onBack }) => {
  const { t, isRTL } = useLanguage();
  const { data, isLoading, isFetching, refetch } = useGetPrivacyQuery();

  const privacyData = data?.data;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {onBack ? (
        <View style={[styles.headerContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={colors.primary} />
          </TouchableOpacity>
          <CustomText variant="h2" color={colors.primary} style={styles.headerTitle}>
            {t('privacyPolicy')}
          </CustomText>
        </View>
      ) : (
        <Header />
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <View style={styles.content}>
            {/* Title */}
            <CustomText variant="h1" color={colors.primary} style={styles.title}>
              {t('privacyPolicy')}
            </CustomText>

            {/* Intro */}
            {privacyData?.intro && (
              <CustomText variant="body" color={additionalColors.text} style={styles.intro}>
                {privacyData.intro}
              </CustomText>
            )}

            {/* Last Updated */}
            {privacyData?.lastUpdated && (
              <View style={styles.lastUpdatedContainer}>
                <CustomText variant="caption" color={additionalColors.textLight}>
                  {t('lastUpdated')}: {privacyData.lastUpdated}
                </CustomText>
              </View>
            )}

            {/* Sections */}
            {privacyData?.sections && privacyData.sections.length > 0 && (
              <View style={styles.sectionsContainer}>
                {privacyData.sections.map((section, index) => (
                  <View key={index} style={styles.section}>
                    <CustomText variant="h3" color={colors.primary} style={styles.sectionTitle}>
                      {section.title}
                    </CustomText>
                    <CustomText variant="body" color={additionalColors.text} style={styles.sectionContent}>
                      {section.content}
                    </CustomText>
                  </View>
                ))}
              </View>
            )}

            {/* Empty State */}
            {(!privacyData?.sections || privacyData.sections.length === 0) && (
              <View style={styles.emptyContainer}>
                <CustomText variant="body" color={additionalColors.textLight}>
                  {t('noContentAvailable')}
                </CustomText>
              </View>
            )}
          </View>
        </Container>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingVertical: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  intro: {
    marginBottom: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  lastUpdatedContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
  },
  sectionsContainer: {
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: additionalColors.divider,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionContent: {
    lineHeight: 22,
    textAlign: 'justify',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});

export default PrivacyPage;

