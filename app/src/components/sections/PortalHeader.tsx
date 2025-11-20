import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type PortalHeaderProps = {
  title?: string;
  logoUri?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showLoginButton?: boolean;
  onLoginPress?: () => void;
  showHomeButton?: boolean;
  onHomePress?: () => void;
  isAuthenticated?: boolean;
};

export const PortalHeader = ({
  title = 'ميعاد',
  logoUri,
  showBackButton = false,
  onBackPress,
  showLoginButton = false,
  onLoginPress,
  showHomeButton = false,
  onHomePress,
  isAuthenticated = false,
}: PortalHeaderProps) => {
  return (
    <SafeAreaView 
      className="w-full shadow-xl" 
      edges={['top']} 
      style={{ 
        backgroundColor: '#0c6980',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        direction: 'rtl',
      }}
    >
      <View 
        className="px-5 py-4 flex-row items-center"
        style={{ direction: 'rtl' }}
      >
        {showBackButton && onBackPress && (
          <Pressable
            onPress={onBackPress}
            className="w-11 h-11 items-center justify-center mr-3 rounded-full bg-white/20 active:bg-white/30"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
        )}
        <Text 
          className="text-xl font-bold text-white flex-1 text-center" 
          style={{ 
            fontFamily: 'Cairo_700Bold', 
            textAlign: 'center', 
            letterSpacing: 0.5,
            writingDirection: 'rtl',
          }}
        >
          {title}
        </Text>
        {showHomeButton && onHomePress ? (
          <Pressable
            onPress={onHomePress}
            className="w-11 h-11 items-center justify-center ml-3 rounded-full bg-white/20 active:bg-white/30"
          >
            <Ionicons 
              name="home-outline" 
              size={24} 
              color="#fff" 
            />
          </Pressable>
        ) : showLoginButton && onLoginPress ? (
          <Pressable
            onPress={onLoginPress}
            className="w-11 h-11 items-center justify-center ml-3 rounded-full bg-white/20 active:bg-white/30"
          >
            <Ionicons 
              name={isAuthenticated ? "grid-outline" : "log-in-outline"} 
              size={24} 
              color="#fff" 
            />
          </Pressable>
        ) : showBackButton ? (
          <View className="w-11 mr-3" />
        ) : null}
      </View>
    </SafeAreaView>
  );
};


