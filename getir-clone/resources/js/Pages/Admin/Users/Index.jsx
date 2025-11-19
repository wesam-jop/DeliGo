import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { 
    Users, 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Eye, 
    Shield,
    User,
    Smartphone,
    Mail,
    Calendar,
    CheckCircle,
    XCircle,
    MoreVertical
} from 'lucide-react';

export default function UsersIndex({ users, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [userTypeFilter, setUserTypeFilter] = useState(filters.user_type || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const { delete: destroy } = useForm();

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(`/admin/users/${userId}`);
        }
    };

    const getUserTypeIcon = (userType) => {
        switch (userType) {
            case 'admin':
                return <Shield className="w-4 h-4" />;
            case 'store_owner':
                return <User className="w-4 h-4" />;
            case 'driver':
                return <Smartphone className="w-4 h-4" />;
            default:
                return <User className="w-4 h-4" />;
        }
    };

    const getUserTypeColor = (userType) => {
        switch (userType) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'store_owner':
                return 'bg-green-100 text-green-800';
            case 'driver':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredUsers = users?.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phone.includes(searchTerm);
        const matchesType = !userTypeFilter || user.user_type === userTypeFilter;
        const matchesStatus = !statusFilter || 
                            (statusFilter === 'verified' && user.is_verified) ||
                            (statusFilter === 'unverified' && !user.is_verified);
        
        return matchesSearch && matchesType && matchesStatus;
    }) || [];

    return (
        <AdminLayout title="Users Management">
            <Head title="Users Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                        <p className="text-gray-600">Manage all users in the system</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Verified</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users?.filter(u => u.is_verified).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Unverified</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users?.filter(u => !u.is_verified).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Admins</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users?.filter(u => u.user_type === 'admin').length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or phone..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User Type
                            </label>
                            <select
                                value={userTypeFilter}
                                onChange={(e) => setUserTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="customer">Customer</option>
                                <option value="store_owner">Store Owner</option>
                                <option value="driver">Driver</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="verified">Verified</option>
                                <option value="unverified">Unverified</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Users ({filteredUsers.length})
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                        {getUserTypeIcon(user.user_type)}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(user.user_type)}`}>
                                                {getUserTypeIcon(user.user_type)}
                                                <span className="ml-1 capitalize">{user.user_type.replace('_', ' ')}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <Smartphone className="w-4 h-4 mr-1 text-gray-400" />
                                                {user.phone}
                                            </div>
                                            {user.email && (
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.is_verified 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {user.is_verified ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Unverified
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No users found
                            </h3>
                            <p className="text-gray-500">
                                Try adjusting your search or filter criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
