import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Clock, Save, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import DriverLayout from './DriverLayout';

const daysOfWeek = [
    { key: 'sunday', ar: 'الأحد', en: 'Sunday' },
    { key: 'monday', ar: 'الإثنين', en: 'Monday' },
    { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday' },
    { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
    { key: 'thursday', ar: 'الخميس', en: 'Thursday' },
    { key: 'friday', ar: 'الجمعة', en: 'Friday' },
    { key: 'saturday', ar: 'السبت', en: 'Saturday' },
];

export default function DriverWorkingHours({ driver, workingHours: initialWorkingHours }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const locale = usePage().props.locale || 'ar';

    // Initialize form data from working hours
    const initialData = daysOfWeek.reduce((acc, day) => {
        const workingHour = initialWorkingHours.find(wh => wh.day_of_week === day.key) || {};
        acc[day.key] = {
            day_of_week: day.key,
            is_closed: workingHour.is_closed ?? false,
            opening_time: workingHour.opening_time ? workingHour.opening_time.substring(0, 5) : '09:00',
            closing_time: workingHour.closing_time ? workingHour.closing_time.substring(0, 5) : '17:00',
        };
        return acc;
    }, {});

    const form = useForm({
        working_hours: Object.values(initialData),
    });

    const handleDayToggle = (dayKey, value) => {
        const updatedHours = form.data.working_hours.map(hour => {
            if (hour.day_of_week === dayKey) {
                return { ...hour, is_closed: value };
            }
            return hour;
        });
        form.setData('working_hours', updatedHours);
    };

    const handleTimeChange = (dayKey, field, value) => {
        const updatedHours = form.data.working_hours.map(hour => {
            if (hour.day_of_week === dayKey) {
                return { ...hour, [field]: value };
            }
            return hour;
        });
        form.setData('working_hours', updatedHours);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put('/dashboard/driver/working-hours', {
            preserveScroll: true,
        });
    };

    const getDayName = (dayKey) => {
        const day = daysOfWeek.find(d => d.key === dayKey);
        return locale === 'ar' ? day?.ar : day?.en;
    };

    return (
        <DriverLayout title={t('working_hours') || 'أوقات الدوام'} subtitle={t('manage_working_hours') || 'إدارة أوقات الدوام'}>
            <Head title={t('working_hours') || 'أوقات الدوام'} />

            <div className="space-y-6">
                {flash?.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        {flash.error}
                    </div>
                )}

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-blue-600" />
                            {t('working_hours') || 'أوقات الدوام'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            {t('set_driver_working_hours_description') || t('set_store_working_hours_description') || 'حدد أوقات العمل لكل يوم من أيام الأسبوع. يمكنك تعطيل أي يوم بإغلاقه.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {daysOfWeek.map((day) => {
                            const hourData = form.data.working_hours.find(h => h.day_of_week === day.key);
                            const isClosed = hourData?.is_closed ?? false;

                            return (
                                <div
                                    key={day.key}
                                    className={`rounded-2xl border p-4 transition-all ${
                                        isClosed
                                            ? 'border-slate-200 bg-slate-50'
                                            : 'border-blue-200 bg-blue-50/30'
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!isClosed}
                                                    onChange={(e) => handleDayToggle(day.key, !e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <span className={`text-base font-semibold ${isClosed ? 'text-slate-500' : 'text-slate-900'}`}>
                                                    {locale === 'ar' ? day.ar : day.en}
                                                </span>
                                            </label>
                                        </div>

                                        {!isClosed && (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 lg:ml-4">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                                    <label className="text-sm font-medium text-slate-700 whitespace-nowrap sm:mb-0">
                                                        {t('opening_time') || 'وقت البداية'}:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={hourData?.opening_time || '09:00'}
                                                        onChange={(e) => handleTimeChange(day.key, 'opening_time', e.target.value)}
                                                        className="w-full sm:w-auto min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <span className="hidden sm:inline text-slate-400 text-lg font-semibold">-</span>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                                    <label className="text-sm font-medium text-slate-700 whitespace-nowrap sm:mb-0">
                                                        {t('closing_time') || 'وقت النهاية'}:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={hourData?.closing_time || '17:00'}
                                                        onChange={(e) => handleTimeChange(day.key, 'closing_time', e.target.value)}
                                                        min={hourData?.opening_time || '09:00'}
                                                        className="w-full sm:w-auto min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {isClosed && (
                                            <span className="text-sm text-slate-500 font-medium">
                                                {t('closed') || 'مغلق'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-4 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {form.processing ? (t('saving') || 'جاري الحفظ...') : (t('save_changes') || 'حفظ التغييرات')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DriverLayout>
    );
}

