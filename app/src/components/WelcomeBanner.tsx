import React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

type WelcomeBannerProps = {
  title?: string;
  subtitle?: string;
};

/**
 * مكون البانر الترحيبي
 * تصميم أنيق يتناسب مع الهوية البصرية للتطبيق
 */
export const WelcomeBanner = ({
  title = 'مرحباً بك في ميعاد',
  subtitle = 'احجز موعدك بسهولة مع أفضل الأطباء',
}: WelcomeBannerProps) => {
  return (
    <View
      style={{
        width: screenWidth,
        height: 200,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          backgroundColor: '#0c6980',
        }}
      >
        {/* نمط زخرفي في الخلفية */}
        <View
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }}
        />
        
        {/* المحتوى */}
        <View style={{ alignItems: 'center', zIndex: 1 }}>
          {/* اللوجو */}
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              borderWidth: 3,
              borderColor: 'rgba(255, 255, 255, 0.25)',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Image
              source={require('../../assets/icon.png')}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 45,
              }}
              resizeMode="contain"
            />
          </View>
          
          {/* العنوان */}
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Cairo_700Bold',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 8,
              textShadowColor: 'rgba(0, 0, 0, 0.2)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            {title}
          </Text>
          
          {/* العنوان الفرعي */}
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Cairo_400Regular',
              color: 'rgba(255, 255, 255, 0.95)',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            {subtitle}
          </Text>
          
          {/* خط زخرفي */}
          <View
            style={{
              width: 60,
              height: 4,
              backgroundColor: '#ffffff',
              borderRadius: 2,
              marginTop: 16,
              opacity: 0.8,
            }}
          />
        </View>
      </View>
    </View>
  );
};

