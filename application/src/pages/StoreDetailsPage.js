import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useGetStoreQuery, useGetStoreProductsQuery } from '../store/slices/storesSlice';
import { useGetCategoriesQuery } from '../store/slices/productsSlice';
import { setProductFilters, clearProductFilters } from '../store/slices/productsSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';

const StoreDetailsPage = ({ storeId, onBack }) => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { filters: productFilters } = useAppSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch store details
  const {
    data: storeData,
    isLoading: storeLoading,
    refetch: refetchStore,
  } = useGetStoreQuery(storeId, {
    skip: !storeId,
  });

  const store = storeData?.data || {};

  // Build query params for products
  const queryParams = {
    store_id: storeId,
    page,
    per_page: 20,
    ...(searchQuery && { search: searchQuery }),
    ...(productFilters.category_id && { category_id: productFilters.category_id }),
  };

  // Fetch store products
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching,
    refetch: refetchProducts,
  } = useGetStoreProductsQuery(
    { storeId, ...queryParams },
    {
      skip: !storeId,
    }
  );

  // Fetch categories for filter
  const { data: categoriesData } = useGetCategoriesQuery();

  const products = productsData?.data?.data || [];
  const categories = categoriesData?.data || [];

  // Convert categories to filter options
  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: isRTL ? cat.name_ar || cat.name : cat.name_en || cat.name,
  }));

  const handleFilterApply = (filters) => {
    dispatch(
      setProductFilters({
        category_id: filters.category_id || null,
      })
    );
    setIsFilterModalVisible(false);
    setPage(1);
  };

  const handleFilterClear = () => {
    dispatch(clearProductFilters());
    setIsFilterModalVisible(false);
    setPage(1);
  };

  const handleRefresh = () => {
    refetchStore();
    refetchProducts();
  };

  const isLoading = storeLoading || productsLoading;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={colors.primary} />
        </TouchableOpacity>
        <CustomText variant="h2" color={colors.primary} style={styles.headerTitle}>
          {store.name || t('storeDetails')}
        </CustomText>
        <View style={styles.headerSpacer} />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}
        >
          {/* Store Header */}
          <View style={styles.storeHeader}>
            {store.logo_path || store.image ? (
              <Image
                source={{ uri: store.logo_path || store.image }}
                style={styles.storeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <CustomText variant="h1" color={additionalColors.textLight}>
                  {store.name ? store.name.charAt(0) : '?'}
                </CustomText>
              </View>
            )}
            <View style={styles.storeInfo}>
              <CustomText variant="h1" color={colors.primary} style={styles.storeName}>
                {store.name}
              </CustomText>
              {store.store_type_label && (
                <CustomText variant="body" color={additionalColors.textLight} style={styles.storeCategory}>
                  {store.store_type_label}
                </CustomText>
              )}
              {(store.city?.name || store.governorate?.name) && (
                <View style={[styles.locationContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Ionicons
                    name="location"
                    size={16}
                    color={additionalColors.textLight}
                    style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}
                  />
                  <CustomText variant="body" color={additionalColors.textLight}>
                    {store.city?.name && store.governorate?.name
                      ? `${store.city.name}, ${store.governorate.name}`
                      : store.city?.name || store.governorate?.name}
                  </CustomText>
                </View>
              )}
              {store.is_active !== undefined && (
                <View style={[styles.statusBadge, store.is_active && styles.statusOpen]}>
                  <CustomText
                    variant="small"
                    color={store.is_active ? additionalColors.success : additionalColors.error}
                  >
                    {store.is_active ? t('open') : t('closed')}
                  </CustomText>
                </View>
              )}
            </View>
          </View>

          {/* Search and Filter */}
          <Container style={styles.searchContainer}>
            <View style={[styles.searchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.searchBarContainer}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={t('searchProducts')}
                />
              </View>
              <TouchableOpacity
                style={[styles.filterButton, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]}
                onPress={() => setIsFilterModalVisible(true)}
              >
                <Ionicons
                  name="filter"
                  size={24}
                  color={productFilters.category_id ? colors.primary : additionalColors.text}
                />
                {productFilters.category_id && (
                  <View style={styles.filterBadge}>
                    <CustomText variant="small" color={colors.background}>
                      1
                    </CustomText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </Container>

          {/* Products Section */}
          <Container style={styles.productsContainer}>
            <CustomText variant="h2" color={colors.primary} style={styles.sectionTitle}>
              {t('products')} ({productsData?.data?.total || 0})
            </CustomText>

            {products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={64} color={additionalColors.textLight} />
                <CustomText variant="body" color={additionalColors.textLight} style={styles.emptyText}>
                  {t('noProductsFound')}
                </CustomText>
              </View>
            ) : (
              <FlatList
                data={products}
                renderItem={({ item }) => {
                  const productCopy = { ...item };
                  return <ProductCard product={productCopy} />;
                }}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
                contentContainerStyle={styles.productsList}
              />
            )}
          </Container>
        </ScrollView>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        filters={[
          {
            key: 'category_id',
            title: t('category'),
            options: categoryOptions,
            value: productFilters.category_id,
          },
        ]}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  storeHeader: {
    backgroundColor: colors.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
  },
  storeImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 16,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: additionalColors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  storeInfo: {
    alignItems: 'center',
  },
  storeName: {
    marginBottom: 8,
    textAlign: 'center',
  },
  storeCategory: {
    marginBottom: 8,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: additionalColors.divider,
  },
  statusOpen: {
    backgroundColor: `${additionalColors.success}20`,
  },
  searchContainer: {
    marginTop: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: additionalColors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsContainer: {
    marginTop: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  productsList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default StoreDetailsPage;

