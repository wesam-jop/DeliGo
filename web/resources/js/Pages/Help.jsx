import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from './Layout';
import { useTranslation } from '../hooks/useTranslation';
import { 
    Search, 
    ChevronDown, 
    ChevronUp,
    Phone, 
    Mail, 
    MessageSquare,
    Clock,
    Truck,
    CreditCard,
    Package,
    User,
    Shield,
    HelpCircle,
    BookOpen,
    Video,
    FileText,
    ExternalLink
} from 'lucide-react';

export default function Help() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Topics', icon: HelpCircle },
        { id: 'delivery', name: 'Delivery', icon: Truck },
        { id: 'orders', name: 'Orders', icon: Package },
        { id: 'payment', name: 'Payment', icon: CreditCard },
        { id: 'account', name: 'Account', icon: User },
        { id: 'safety', name: 'Safety & Security', icon: Shield }
    ];

    const faqs = [
        {
            id: 1,
            category: 'delivery',
            question: 'How fast is your delivery?',
            answer: 'We deliver most orders within 10 minutes of placement. Some areas may take up to 30 minutes depending on distance and traffic conditions. You can track your order in real-time through our app.'
        },
        {
            id: 2,
            category: 'delivery',
            question: 'What areas do you deliver to?',
            answer: 'We currently serve major cities and are expanding to new areas regularly. Check our app or website to see if we deliver to your specific location. We\'re constantly adding new delivery zones.'
        },
        {
            id: 3,
            category: 'delivery',
            question: 'Can I track my delivery?',
            answer: 'Yes! You can track your order in real-time through our app or website. You\'ll receive updates at every step of the delivery process, from preparation to arrival at your door.'
        },
        {
            id: 4,
            category: 'orders',
            question: 'How do I place an order?',
            answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You can place orders through our website or mobile app. Make sure to provide accurate delivery information.'
        },
        {
            id: 5,
            category: 'orders',
            question: 'Can I modify or cancel my order?',
            answer: 'You can modify or cancel your order within 5 minutes of placing it. After that, the order goes into preparation and cannot be changed. Contact customer service immediately if you need assistance.'
        },
        {
            id: 6,
            category: 'orders',
            question: 'What if items are out of stock?',
            answer: 'If an item becomes unavailable after you\'ve placed your order, we\'ll contact you to suggest alternatives or remove it from your order. You\'ll only be charged for items that are delivered.'
        },
        {
            id: 7,
            category: 'payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery in select areas.'
        },
        {
            id: 8,
            category: 'payment',
            question: 'Is my payment information secure?',
            answer: 'Yes, we use industry-standard encryption to protect your payment information. We never store your full card details on our servers and use secure payment processors.'
        },
        {
            id: 9,
            category: 'payment',
            question: 'Can I get a refund?',
            answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with your order, contact us within 24 hours for a full refund or replacement. Refunds are processed within 3-5 business days.'
        },
        {
            id: 10,
            category: 'account',
            question: 'How do I create an account?',
            answer: 'You can create an account by downloading our app or visiting our website. Simply provide your phone number, verify it with the code we send, and complete your profile information.'
        },
        {
            id: 11,
            category: 'account',
            question: 'I forgot my password. How do I reset it?',
            answer: 'Since we use phone number verification, you don\'t need a traditional password. Simply enter your phone number and we\'ll send you a verification code to log in.'
        },
        {
            id: 12,
            category: 'account',
            question: 'How do I update my delivery address?',
            answer: 'You can update your delivery address in your account settings or during checkout. Make sure to keep your address current to ensure accurate deliveries.'
        },
        {
            id: 13,
            category: 'safety',
            question: 'How do you ensure food safety?',
            answer: 'We work with certified suppliers and follow strict food safety protocols. All products are stored at proper temperatures and delivered in insulated bags to maintain freshness.'
        },
        {
            id: 14,
            category: 'safety',
            question: 'What safety measures do you have in place?',
            answer: 'All our delivery partners undergo background checks and safety training. We also provide contactless delivery options and follow all health and safety guidelines.'
        },
        {
            id: 15,
            category: 'safety',
            question: 'How do I report a safety concern?',
            answer: 'If you have any safety concerns, please contact us immediately through our customer service channels. We take all safety reports seriously and investigate them promptly.'
        }
    ];

    const helpTopics = [
        {
            icon: BookOpen,
            title: 'Getting Started Guide',
            description: 'Learn how to use our service effectively',
            link: '#'
        },
        {
            icon: Video,
            title: 'Video Tutorials',
            description: 'Watch step-by-step video guides',
            link: '#'
        },
        {
            icon: FileText,
            title: 'User Manual',
            description: 'Download our comprehensive user manual',
            link: '#'
        },
        {
            icon: ExternalLink,
            title: 'Community Forum',
            description: 'Connect with other users and get help',
            link: '#'
        }
    ];

    const contactOptions = [
        {
            icon: Phone,
            title: 'Call Us',
            description: 'Speak with a customer service representative',
            contact: '+1 (555) 123-4567',
            availability: '24/7 Support'
        },
        {
            icon: Mail,
            title: 'Email Us',
            description: 'Send us an email and we\'ll respond within 24 hours',
            contact: 'support@getirclone.com',
            availability: '24/7 Support'
        },
        {
            icon: MessageSquare,
            title: 'Live Chat',
            description: 'Chat with us in real-time',
            contact: 'Available in app',
            availability: 'Mon-Fri 8AM-10PM'
        }
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (id) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    return (
        <Layout>
            <Head title={t('help')} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                {t('help')}
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
                                Find answers to your questions or get in touch with our support team
                            </p>
                            
                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto">
                                <div className="relative bg-white rounded-lg">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search for help..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-lg text-slate-900 text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Help Topics */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Quick Help Topics
                            </h2>
                            <p className="text-lg text-slate-600">
                                Get started with these helpful resources
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {helpTopics.map((topic, index) => (
                                <div key={index} className="bg-slate-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <topic.icon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        {topic.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {topic.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-slate-600">
                                Find answers to the most common questions
                            </p>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                        selectedCategory === category.id
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <category.icon className="w-4 h-4" />
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* FAQ List */}
                        <div className="max-w-4xl mx-auto">
                            {filteredFAQs.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredFAQs.map((faq) => (
                                        <div key={faq.id} className="bg-white rounded-lg shadow-md">
                                            <button
                                                onClick={() => toggleFAQ(faq.id)}
                                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="font-semibold text-slate-900">
                                                    {faq.question}
                                                </span>
                                                {expandedFAQ === faq.id ? (
                                                    <ChevronUp className="w-5 h-5 text-slate-500" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-slate-500" />
                                                )}
                                            </button>
                                            {expandedFAQ === faq.id && (
                                                <div className="px-6 pb-4">
                                                    <p className="text-slate-600">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <HelpCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        No results found
                                    </h3>
                                    <p className="text-slate-600">
                                        Try adjusting your search terms or browse different categories
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Support Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Still Need Help?
                            </h2>
                            <p className="text-lg text-slate-600">
                                Our support team is here to help you 24/7
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {contactOptions.map((option, index) => (
                                <div key={index} className="bg-slate-50 rounded-lg p-6 text-center">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <option.icon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        {option.title}
                                    </h3>
                                    <p className="text-slate-600 mb-4">
                                        {option.description}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-slate-900">
                                            {option.contact}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {option.availability}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="py-16 bg-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Emergency Support
                        </h2>
                        <p className="text-xl text-purple-100 mb-8">
                            For urgent delivery issues or safety concerns
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-6 h-6" />
                                <span className="text-2xl font-bold">+1 (555) 911-HELP</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-6 h-6" />
                                <span>Available 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
