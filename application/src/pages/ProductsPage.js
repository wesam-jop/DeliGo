import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useGetProductsQuery } from '../store/slices/productsSlice';
import { useGetGovernoratesQuery } from '../store/slices/locationSlice';
import { useGetCategoriesQuery } from '../store/slices/productsSlice';
import { setProductFilters, clearProductFilters } from '../store/slices/productsSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from '../components/CustomText';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';

const ProductsPage = () => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { filters, sortBy, sortOrder } = useAppSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  // Build query params
  const queryParams = {
    page,
    per_page: 20,
    sort_by: sortBy,
    sort_order: sortOrder,
    ...(searchQuery && { search: searchQuery }),
    ...(filters.category_id && { category_id: filters.category_id }),
    ...(filters.governorate_id && { governorate_id: filters.governorate_id }),
    ...(filters.city_id && { city_id: filters.city_id }),
    ...(filters.store_id && { store_id: filters.store_id }),
    ...(filters.featured && { featured: true }),
  };

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(queryParams, {
    skip: false,
  });

  // Fetch filter options
  const { data: governoratesData } = useGetGovernoratesQuery();
  const { data: categoriesData } = useGetCategoriesQuery();

  const products = productsData?.data?.data || [];
  const governorates = governoratesData?.data || [];
  const categories = categoriesData?.data || [];

  const handleFilterChange = (newFilters) => {
    dispatch(setProductFilters(newFilters));
    setPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearProductFilters());
    setPage(1);
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const handleLoadMore = () => {
    if (productsData?.data?.next_page_url && !isFetching) {
      setPage(page + 1);
    }
  };

  const renderProduct = ({ item }) => {
    const product = { ...item };
    return <ProductCard product={product} />;
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cube-outline" size={64} color={additionalColors.textLight} />
        <CustomText variant="h3" color={additionalColors.textLight} style={styles.emptyText}>
          {t('noProductsFound')}
        </CustomText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Container>
        <View style={styles.header}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchProducts')}
            style={styles.searchBar}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && page > 1 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </Container>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        categories={categories}
        governorates={governorates}
        cities={[]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: additionalColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
  },
});

export default ProductsPage;
