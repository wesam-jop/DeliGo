import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from './Layout';
import { useTranslation } from '../hooks/useTranslation';
import { 
    Users, 
    MapPin, 
    Clock, 
    DollarSign,
    Briefcase,
    GraduationCap,
    Heart,
    Zap,
    Target,
    Globe,
    Send,
    CheckCircle,
    Star,
    Award,
    Coffee,
    Laptop,
    Smartphone
} from 'lucide-react';

export default function Careers() {
    const { t } = useTranslation();
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicationForm, setApplicationForm] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        coverLetter: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setApplicationForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setApplicationForm({
                name: '',
                email: '',
                phone: '',
                position: '',
                experience: '',
                coverLetter: ''
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
        {
            icon: DollarSign,
            title: 'Competitive Salary',
            description: 'We offer competitive salaries and performance bonuses'
        },
        {
            icon: Heart,
            title: 'Health Insurance',
            description: 'Comprehensive health, dental, and vision coverage'
        },
        {
            icon: Coffee,
            title: 'Flexible Hours',
            description: 'Work-life balance with flexible scheduling options'
        },
        {
            icon: Laptop,
            title: 'Remote Work',
            description: 'Work from home or our modern office spaces'
        },
        {
            icon: GraduationCap,
            title: 'Learning & Development',
            description: 'Continuous learning opportunities and skill development'
        },
        {
            icon: Award,
            title: 'Career Growth',
            description: 'Clear career paths and advancement opportunities'
        }
    ];

    const values = [
        {
            icon: Users,
            title: 'Teamwork',
            description: 'We believe in the power of collaboration and supporting each other'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We encourage creative thinking and innovative solutions'
        },
        {
            icon: Target,
            title: 'Excellence',
            description: 'We strive for excellence in everything we do'
        },
        {
            icon: Globe,
            title: 'Diversity',
            description: 'We celebrate diversity and create an inclusive environment'
        }
    ];

    const openPositions = [
        {
            id: 1,
            title: 'Delivery Driver',
            location: 'Multiple Cities',
            type: 'Full-time',
            salary: '$15-20/hour',
            description: 'Join our delivery team and help bring groceries to customers in record time.',
            requirements: [
                'Valid driver\'s license',
                'Clean driving record',
                'Reliable vehicle',
                'Customer service skills'
            ]
        },
        {
            id: 2,
            title: 'Customer Service Representative',
            location: 'Remote',
            type: 'Full-time',
            salary: '$35,000-45,000/year',
            description: 'Provide exceptional customer support and help resolve customer inquiries.',
            requirements: [
                'Excellent communication skills',
                'Problem-solving abilities',
                'Customer service experience',
                'Bilingual preferred'
            ]
        },
        {
            id: 3,
            title: 'Software Developer',
            location: 'Remote/Hybrid',
            type: 'Full-time',
            salary: '$70,000-100,000/year',
            description: 'Build and maintain our web and mobile applications.',
            requirements: [
                'Experience with React/Node.js',
                'Database knowledge',
                'API development',
                'Version control (Git)'
            ]
        },
        {
            id: 4,
            title: 'Operations Manager',
            location: 'City Center',
            type: 'Full-time',
            salary: '$60,000-80,000/year',
            description: 'Oversee daily operations and ensure smooth delivery processes.',
            requirements: [
                'Management experience',
                'Operations background',
                'Analytical skills',
                'Leadership abilities'
            ]
        },
        {
            id: 5,
            title: 'Marketing Specialist',
            location: 'Remote',
            type: 'Full-time',
            salary: '$45,000-60,000/year',
            description: 'Develop and execute marketing campaigns to grow our customer base.',
            requirements: [
                'Marketing experience',
                'Social media expertise',
                'Analytics knowledge',
                'Creative thinking'
            ]
        },
        {
            id: 6,
            title: 'Warehouse Associate',
            location: 'Distribution Center',
            type: 'Part-time/Full-time',
            salary: '$12-16/hour',
            description: 'Help manage inventory and prepare orders for delivery.',
            requirements: [
                'Physical ability to lift 50+ lbs',
                'Attention to detail',
                'Team player',
                'Reliable attendance'
            ]
        }
    ];

    const stats = [
        { number: '200+', label: 'Team Members' },
        { number: '15+', label: 'Cities Served' },
        { number: '50+', label: 'Open Positions' },
        { number: '95%', label: 'Employee Satisfaction' }
    ];

    return (
        <Layout>
            <Head title={t('careers')} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                {t('careers')}
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
                                Join our team and help revolutionize the way people shop for groceries
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full text-purple-600">
                                    <Star className="w-5 h-5" />
                                    <span>Great Benefits</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full text-purple-600">
                                    <Heart className="w-5 h-5" />
                                    <span>Work-Life Balance</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full text-purple-600">
                                    <Zap className="w-5 h-5" />
                                    <span>Fast Growth</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-slate-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Why Work With Us Section */}
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Why Work With Us?
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                We're building the future of grocery delivery, and we want you to be part of it
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <benefit.icon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-slate-600">
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Our Values Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Our Values
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                The principles that guide our team and culture
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <value.icon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Open Positions Section */}
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Open Positions
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Find the perfect role for you and join our growing team
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {openPositions.map((position) => (
                                <div key={position.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                                {position.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {position.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Briefcase className="w-4 h-4 mr-1" />
                                                    {position.type}
                                                </div>
                                                <div className="flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    {position.salary}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 mb-4">
                                        {position.description}
                                    </p>
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-900 mb-2">Requirements:</h4>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            {position.requirements.map((req, index) => (
                                                <li key={index} className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => setSelectedJob(position)}
                                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Application Form Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Apply for {selectedJob.title}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {submitStatus === 'success' && (
                                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Application submitted successfully! We'll review your application and get back to you soon.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={applicationForm.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={applicationForm.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={applicationForm.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Years of Experience
                                            </label>
                                            <select
                                                name="experience"
                                                value={applicationForm.experience}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            >
                                                <option value="">Select experience level</option>
                                                <option value="0-1">0-1 years</option>
                                                <option value="2-3">2-3 years</option>
                                                <option value="4-5">4-5 years</option>
                                                <option value="5+">5+ years</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Cover Letter *
                                        </label>
                                        <textarea
                                            name="coverLetter"
                                            value={applicationForm.coverLetter}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedJob(null)}
                                            className="flex-1 bg-slate-300 text-slate-700 py-3 px-6 rounded-lg hover:bg-slate-400 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-2" />
                                                    Submit Application
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
