import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useGetCartQuery, useUpdateCartMutation, useRemoveFromCartMutation } from '../store/slices/cartSlice';
import { openCart, closeCart } from '../store/slices/cartSlice';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';
import CustomButton from './CustomButton';

const { height: screenHeight } = Dimensions.get('window');

const Cart = ({ onCheckout }) => {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.cart);
  
  const { data: cartData, isLoading, refetch } = useGetCartQuery(undefined, {
    skip: !isOpen,
  });
  
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();

  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }).start();
      refetch();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, refetch]);

  const animatedStyle = {
    transform: [{ translateY: slideAnim }],
  };

  const cartItems = cartData?.data?.items || [];
  const total = cartData?.data?.total || 0;

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCart({ product_id: productId, quantity }).unwrap();
      refetch();
    } catch (error) {
      console.error('Update cart error:', error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId).unwrap();
      refetch();
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    onCheckout?.();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={() => dispatch(closeCart())}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => dispatch(closeCart())}
        />
        <Animated.View style={[styles.cartContainer, animatedStyle]}>
          {/* Header */}
          <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <CustomText variant="h2" color={colors.primary} style={styles.cartTitle}>
              {t('cart')}
            </CustomText>
            <TouchableOpacity
              onPress={() => dispatch(closeCart())}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color={additionalColors.text} />
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <ScrollView
              style={styles.itemsContainer}
              contentContainerStyle={styles.itemsContent}
              showsVerticalScrollIndicator={false}
            >
              {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="cart-outline" size={64} color={additionalColors.textLight} />
                  <CustomText
                    variant="h3"
                    color={additionalColors.textLight}
                    style={styles.emptyText}
                  >
                    {t('emptyCart')}
                  </CustomText>
                </View>
              ) : (
                cartItems.map((item) => {
                  const cartItem = {
                    ...item,
                    product: item.product || {},
                  };
                  const product = cartItem.product;
                  
                  return (
                    <View key={cartItem.id || product.id} style={[styles.cartItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={styles.itemImageContainer}>
                        {product.image ? (
                          <Image
                            source={{ uri: product.image }}
                            style={styles.itemImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.placeholderImage}>
                            <CustomText variant="body" color={additionalColors.textLight}>
                              {product.name ? product.name.charAt(0) : '?'}
                            </CustomText>
                          </View>
                        )}
                      </View>

                      <View style={styles.itemInfo}>
                        <View style={styles.itemInfoTop}>
                          <CustomText variant="body" color={additionalColors.text} style={styles.itemName}>
                            {product.name || t('unknownProduct')}
                          </CustomText>
                          {product.final_price && (
                            <CustomText
                              variant="caption"
                              color={colors.primary}
                              style={styles.itemPrice}
                            >
                              {product.final_price} ل.س
                            </CustomText>
                          )}
                        </View>

                        {/* Quantity Controls */}
                        <View style={[styles.quantityContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleUpdateQuantity(product.id, cartItem.quantity - 1)}
                            disabled={isUpdating || cartItem.quantity <= 1}
                          >
                            <Ionicons name="remove" size={20} color={colors.primary} />
                          </TouchableOpacity>
                          <CustomText variant="body" color={additionalColors.text} style={styles.quantityText}>
                            {cartItem.quantity}
                          </CustomText>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleUpdateQuantity(product.id, cartItem.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <Ionicons name="add" size={20} color={colors.primary} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemove(product.id)}
                        disabled={isRemoving}
                      >
                        <Ionicons name="trash-outline" size={20} color={additionalColors.error} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* Footer */}
          {cartItems.length > 0 && (
            <View style={styles.footer}>
              <View style={[styles.totalContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <CustomText variant="h3" color={additionalColors.text} style={styles.totalLabel}>
                  {t('total')}:
                </CustomText>
                <CustomText variant="h2" color={colors.primary} style={styles.totalAmount}>
                  {total.toFixed(0)} ل.س
                </CustomText>
              </View>
              <CustomButton
                variant="primary"
                size="large"
                onPress={handleCheckout}
                style={styles.checkoutButton}
                translate={true}
                translationKey="checkout"
              />
            </View>
          )}
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
  cartContainer: {
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
  cartTitle: {
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsContainer: {
    flex: 1,
  },
  itemsContent: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
  },
  cartItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: additionalColors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: 100,
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: additionalColors.divider,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: additionalColors.divider,
  },
  itemInfo: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  itemInfoTop: {
    flex: 1,
  },
  itemName: {
    marginBottom: 4,
  },
  itemPrice: {
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: additionalColors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: additionalColors.border,
    backgroundColor: colors.background,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    letterSpacing: 0.3,
  },
  totalAmount: {
    letterSpacing: 0.3,
  },
  checkoutButton: {
    width: '100%',
  },
});

export default Cart;
