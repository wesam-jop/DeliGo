import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useGetCustomerStatsQuery } from '../../store/slices/dashboardSlice';
import { useGetUserOrdersQuery } from '../../store/slices/ordersSlice';
import { logout } from '../../store/slices/authSlice';
import { useLanguage } from '../../context/LanguageContext';
import { colors, additionalColors } from '../../constants/colors';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import Container from '../../components/Container';

const CustomerDashboard = ({ onBack }) => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetCustomerStatsQuery();

  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetUserOrdersQuery({ per_page: 10 });

  const stats = statsData?.data?.stats || {};
  const recentOrders = ordersData?.data?.data || [];

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const handleRefresh = () => {
    refetchStats();
    refetchOrders();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={statsLoading || ordersLoading}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
        />
      }
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
              {user?.name || t('customer')}
            </CustomText>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={additionalColors.error} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={32} color={colors.primary} />
            <CustomText variant="h2" color={colors.primary} style={styles.statValue}>
              {stats.total_orders || 0}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('totalOrders')}
            </CustomText>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={32} color={colors.accent} />
            <CustomText variant="h2" color={colors.accent} style={styles.statValue}>
              {stats.pending_orders || 0}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('pending')}
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

          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={32} color={colors.secondary} />
            <CustomText variant="h2" color={colors.secondary} style={styles.statValue}>
              {(stats.total_spent || 0).toFixed(0)}
            </CustomText>
            <CustomText variant="caption" color={additionalColors.textLight}>
              {t('totalSpent')}
            </CustomText>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <CustomText variant="h3" color={additionalColors.text} style={styles.sectionTitle}>
            {t('recentOrders')}
          </CustomText>

          {ordersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : recentOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={additionalColors.textLight} />
              <CustomText variant="body" color={additionalColors.textLight} style={styles.emptyText}>
                {t('noOrders')}
              </CustomText>
            </View>
          ) : (
            recentOrders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <CustomText variant="body" color={colors.primary} style={styles.orderNumber}>
                    {order.order_number || `#${order.id}`}
                  </CustomText>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          order.status === 'delivered'
                            ? `${additionalColors.success}20`
                            : order.status === 'pending'
                            ? `${colors.accent}20`
                            : `${colors.primary}20`,
                      },
                    ]}
                  >
                    <CustomText
                      variant="small"
                      color={
                        order.status === 'delivered'
                          ? additionalColors.success
                          : order.status === 'pending'
                          ? colors.accent
                          : colors.primary
                      }
                    >
                      {t(order.status)}
                    </CustomText>
                  </View>
                </View>
                <CustomText variant="caption" color={additionalColors.textLight}>
                  {new Date(order.created_at).toLocaleDateString()}
                </CustomText>
                <CustomText variant="h3" color={additionalColors.text} style={styles.orderTotal}>
                  {(order.total_amount || 0).toFixed(0)} ل.س
                </CustomText>
              </TouchableOpacity>
            ))
          )}
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
  statsContainer: {
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: additionalColors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontFamily: 'Cairo-Bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderTotal: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});

export default CustomerDashboard;

