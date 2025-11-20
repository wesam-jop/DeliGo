import React from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HeaderProps = {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
};

/**
 * مكون Header جميل ومتجاوب
 * يمكن استخدامه في جميع الشاشات
 */
export const Header = ({
  title = "ميعاد",
}: HeaderProps) => {
  return (
    <SafeAreaView 
      className="w-full bg-blue-500"
      style={{ direction: 'rtl' }}
    >
      <Text 
        className='text-xl font-bold text-center p-4 text-white'
        style={{ 
          fontFamily: 'Cairo_700Bold',
          textAlign: 'center',
          writingDirection: 'rtl',
        }}
      >
        {title}
      </Text>
    </SafeAreaView>
  );
};

