import React from 'react';
import { View, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  safeArea?: boolean;
};

/**
 * مكون الحاوية الرئيسي
 * يوفر حاوية آمنة مع دعم NativeWind للأنماط و RTL
 */
export const Container = ({ 
  children, 
  className = '', 
  safeArea = true 
}: ContainerProps) => {
  const defaultClasses = 'flex-1 bg-white';
  const combinedClasses = `${defaultClasses} ${className}`;

  // التأكد من RTL
  const isRTL = I18nManager.isRTL || I18nManager.forceRTL || true;

  if (!safeArea) {
    return (
      <View 
        className={combinedClasses}
        style={{ 
          direction: 'rtl',
        }}
      >
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView 
      className={combinedClasses} 
      edges={['top', 'bottom']}
      style={{ 
        direction: 'rtl',
      }}
    >
      {children}
    </SafeAreaView>
  );
};

