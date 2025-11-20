import React from 'react';
import { View, ScrollView } from 'react-native';
import { PortalHeader } from './sections/PortalHeader';

type ScreenLayoutProps = {
  title?: string;
  logoUri?: string;
  children: React.ReactNode;
  showHeader?: boolean;
  scrollable?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showLoginButton?: boolean;
  onLoginPress?: () => void;
  showHomeButton?: boolean;
  onHomePress?: () => void;
  isAuthenticated?: boolean;
};

/**
 * مكون تخطيط الشاشة
 * يوفر هيكل موحد لجميع الشاشات مع Header جميل
 */
export const ScreenLayout = ({ 
  title,
  logoUri,
  children, 
  showHeader = true,
  scrollable = true,
  showBackButton = false,
  onBackPress,
  showLoginButton = false,
  onLoginPress,
  showHomeButton = false,
  onHomePress,
  isAuthenticated = false,
}: ScreenLayoutProps) => {
  const content = (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      {showHeader && (
        <PortalHeader
          title={title}
          logoUri={logoUri}
          showBackButton={showBackButton}
          onBackPress={onBackPress}
          showLoginButton={showLoginButton}
          onLoginPress={onLoginPress}
          showHomeButton={showHomeButton}
          onHomePress={onHomePress}
          isAuthenticated={isAuthenticated}
        />
      )}
      
      {/* محتوى الشاشة */}
      <View className="flex-1">
        {children}
      </View>
    </View>
  );

  if (!scrollable) {
    return content;
  }

  return (
    <ScrollView 
      className="flex-1" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        flexGrow: 1, 
        direction: 'rtl',
      }}
      style={{ 
        direction: 'rtl',
      }}
    >
      <View style={{ direction: 'rtl' }}>
        {content}
      </View>
    </ScrollView>
  );
};

