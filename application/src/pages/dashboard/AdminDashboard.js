import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useGetAdminStatsQuery } from '../../store/slices/dashboardSlice';
import { logout } from '../../store/slices/authSlice';
import { useLanguage } from '../../context/LanguageContext';
import { colors, additionalColors } from '../../constants/colors';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import Container from '../../components/Container';

const AdminDashboard = ({ onBack }) => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetAdminStatsQuery();

  const stats = statsData?.data?.stats || {};

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <CustomText variant="h1" color={colors.primary}>
              {t('dashboard')}
            </CustomText>
            <CustomText variant="body" color={additionalColors.textLight}>
              {user?.name || t('admin')}
            </CustomText>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={additionalColors.error} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={32} color={colors.primary} />
            <CustomText variant="h2" color={colors.primary} style={styles.statValue}>
              {stats.total_users || 0}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('totalUsers')}
            </CustomText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="storefront-outline" size={32} color={colors.accent} />
            <CustomText variant="h2" color={colors.accent} style={styles.statValue}>
              {stats.total_stores || 0}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('totalStores')}
            </CustomText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={32} color={additionalColors.success} />
            <CustomText variant="h2" color={additionalColors.success} style={styles.statValue}>
              {stats.total_products || 0}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('totalProducts')}
            </CustomText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={32} color={colors.secondary} />
            <CustomText variant="h2" color={colors.secondary} style={styles.statValue}>
              {stats.total_orders || 0}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('totalOrders')}
            </CustomText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={32} color={additionalColors.info} />
            <CustomText variant="h2" color={additionalColors.info} style={styles.statValue}>
              {(stats.total_revenue || 0).toFixed(0)}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('totalRevenue')}
            </CustomText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color={additionalColors.success} />
            <CustomText variant="h2" color={additionalColors.success} style={styles.statValue}>
              {stats.delivered_orders || 0}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('delivered')}
            </CustomText>
          </View>
        </View>

        {/* Back Button */}
        <CustomButton
          variant="outline"
          onPress={onBack}
          style={styles.backButton}
          translate={true}
          translationKey="back"
        />
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: additionalColors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    marginTop: 8,
    marginBottom: 4,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});

export default AdminDashboard;

