import { CarouselItem } from '../components/CarouselSlider';

/**
 * بيانات صور الأطباء للسلايدر
 * يمكن استبدالها بصور حقيقية من API
 */
export const carouselData: CarouselItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    name: 'د. أحمد محمد',
    specialty: 'طبيب قلب وأوعية دموية',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
    name: 'د. فاطمة علي',
    specialty: 'طبيبة أطفال',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80',
    name: 'د. خالد حسن',
    specialty: 'طبيب أسنان',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    name: 'د. سارة أحمد',
    specialty: 'طبيبة نساء وتوليد',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80',
    name: 'د. محمد يوسف',
    specialty: 'طبيب أعصاب',
  },
];
