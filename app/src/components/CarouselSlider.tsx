import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, Dimensions, FlatList, Image, ImageBackground, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export interface CarouselItem {
  id: string;
  image: string;
  name?: string;
  specialty?: string;
}

type CarouselSliderProps = {
  data: CarouselItem[];
  onItemPress?: (item: CarouselItem) => void;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  height?: number;
};

/**
 * مكون السلايدر المتحرك الجميل لصور الأطباء
 * بدون هوامش مع تمرير تلقائي ويدوي
 */
export const CarouselSlider = ({
  data,
  onItemPress,
  autoplay = true,
  autoplayDelay = 4000,
  loop = true,
  height = 250,
}: CarouselSliderProps) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // التمرير التلقائي
  useEffect(() => {
    if (!autoplay || data.length <= 1 || isScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= data.length) {
          return loop ? 0 : prevIndex;
        }
        return nextIndex;
      });
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, data.length, loop, isScrolling]);

  // تمرير السلايدر عند تغيير الفهرس
  useEffect(() => {
    if (flatListRef.current && !isScrolling) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex, isScrolling]);

  // معالجة التمرير اليدوي
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    
    if (index >= 0 && index < data.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [currentIndex, data.length]);

  const handleScrollBeginDrag = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    setIsScrolling(false);
  }, []);

  const renderItem = ({ item, index }: { item: CarouselItem; index: number }) => {
    if (!item || !item.image) return null;
    
    return (
      <View
        style={{
          width: screenWidth,
          height: height,
        }}
      >
        <ImageBackground
          source={{ uri: item.image }}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
          }}
          imageStyle={{
            opacity: 0.85,
          }}
        >
          {/* Gradient Overlay من الأسفل */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              
            }}
          />

          {/* معلومات الطبيب */}
        
        </ImageBackground>
      </View>
    );
  };

  // فحص آمن للـ data
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={{ height: height }}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="start"
      />
      
      {/* مؤشرات التمرير */}
      <View className="absolute bottom-6 left-0 right-0 flex-row justify-center">
        {data.map((_, dotIndex) => (
          <View
            key={dotIndex}
            className={`rounded-full ${
              dotIndex === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            style={{
              width: dotIndex === currentIndex ? 40 : 10,
              height: 10,
              marginHorizontal: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          />
        ))}
      </View>
    </View>
  );
};
