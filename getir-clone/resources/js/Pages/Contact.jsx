import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from './Layout';
import { useTranslation } from '../hooks/useTranslation';
import HeroSection from '../Components/HeroSection';
import FeaturesSection from '../Components/FeaturesSection';
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    MessageSquare,
    Send,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Phone,
            title: 'Phone',
            details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
            description: 'Call us for immediate assistance'
        },
        {
            icon: Mail,
            title: 'Email',
            details: ['support@getirclone.com', 'info@getirclone.com'],
            description: 'Send us an email anytime'
        },
        {
            icon: MapPin,
            title: 'Address',
            details: ['123 Delivery Street', 'City, State 12345'],
            description: 'Visit our main office'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['Mon - Fri: 8:00 AM - 10:00 PM', 'Sat - Sun: 9:00 AM - 9:00 PM'],
            description: 'We\'re here to help you'
        }
    ];

    const faqs = [
        {
            question: 'How fast is your delivery?',
            answer: 'We deliver most orders within 10 minutes of placement. Some areas may take up to 30 minutes depending on distance and traffic.'
        },
        {
            question: 'What areas do you serve?',
            answer: 'We currently serve major cities and are expanding to new areas regularly. Check our app to see if we deliver to your location.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, debit cards, PayPal, and cash on delivery for your convenience.'
        },
        {
            question: 'Can I track my order?',
            answer: 'Yes! You can track your order in real-time through our app or website. You\'ll receive updates at every step of the delivery process.'
        },
        {
            question: 'What if I\'m not satisfied with my order?',
            answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with your order, contact us within 24 hours for a full refund or replacement.'
        }
    ];

    return (
        <Layout>
            <Head title={t('contact_us')} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                {t('contact_us')}
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
                                We're here to help! Get in touch with us for any questions or concerns.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="text-center p-6 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <info.icon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                                        {info.title}
                                    </h3>
                                    {info.details.map((detail, idx) => (
                                        <p key={idx} className="text-slate-600 mb-1">
                                            {detail}
                                        </p>
                                    ))}
                                    <p className="text-sm text-slate-500 mt-2">
                                        {info.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center mb-6">
                                    <MessageSquare className="w-8 h-8 text-purple-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Send us a Message
                                    </h2>
                                </div>
                                
                                {submitStatus === 'success' && (
                                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Message sent successfully! We'll get back to you soon.
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                                        <AlertCircle className="w-5 h-5 mr-2" />
                                        There was an error sending your message. Please try again.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="delivery">Delivery Issue</option>
                                                <option value="order">Order Problem</option>
                                                <option value="refund">Refund Request</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* FAQ Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-6">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-3">
                                                {faq.question}
                                            </h3>
                                            <p className="text-slate-600">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Find Us
                            </h2>
                            <p className="text-lg text-slate-600">
                                Visit our main office or find us on the map
                            </p>
                        </div>
                        <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">
                                    Interactive Map Coming Soon
                                </p>
                                <p className="text-slate-500">
                                    123 Delivery Street, City, State 12345
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
