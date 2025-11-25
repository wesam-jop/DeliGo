import React from 'react';

export default function PageHeader({ 
    title, 
    subtitle, 
    breadcrumbs = [], 
    actions = [],
    className = ""
}) {
    return (
        <div className={`bg-white shadow-sm border-b ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumbs */}
                {breadcrumbs.length > 0 && (
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            {breadcrumbs.map((crumb, index) => (
                                <li key={index} className="flex items-center">
                                    {index > 0 && (
                                        <span className="text-gray-400 mx-2">/</span>
                                    )}
                                    {crumb.href ? (
                                        <a
                                            href={crumb.href}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            {crumb.name}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-900 font-medium">
                                            {crumb.name}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {/* Header Content */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-gray-600 mt-2">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    
                    {/* Actions */}
                    {actions.length > 0 && (
                        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                            {actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                                        action.variant === 'primary'
                                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                                            : action.variant === 'secondary'
                                            ? 'bg-white text-primary-800 border-secondary-300 hover:bg-secondary-50'
                                            : 'bg-secondary-100 text-primary-800 hover:bg-secondary-200'
                                    }`}
                                >
                                    {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                    {action.text}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
