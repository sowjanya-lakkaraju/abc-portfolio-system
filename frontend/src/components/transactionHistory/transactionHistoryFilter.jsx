import React, { useState } from 'react';

/**
 * Transaction History Filter Component
 * Provides search filters for transaction history
 */
const TransactionHistoryFilter = ({ onFilter, loading }) => {
  const [filter, setFilter] = useState({
    orderRefNo: '',
    securityName: '',
    transactionType: '',
    orderStatus: '',
    fromDate: '',
    toDate: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFilter(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if at least one filter is provided
    const hasFilter = Object.values(filter).some(value => value !== '');
    if (!hasFilter) {
      newErrors.general = 'At least one search filter must be provided';
    }

    // Validate date range
    if (filter.fromDate && filter.toDate) {
      const fromDate = new Date(filter.fromDate);
      const toDate = new Date(filter.toDate);
      
      if (fromDate >= toDate) {
        newErrors.fromDate = 'From date must be before to date';
        newErrors.toDate = 'To date must be after from date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onFilter(filter);
    }
  };

  const handleReset = () => {
    setFilter({
      orderRefNo: '',
      securityName: '',
      transactionType: '',
      orderStatus: '',
      fromDate: '',
      toDate: ''
    });
    setErrors({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Reference No.
            </label>
            <input
              type="text"
              value={filter.orderRefNo}
              onChange={(e) => handleChange('orderRefNo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter order reference number"
            />
            {errors.orderRefNo && (
              <p className="text-red-500 text-sm mt-1">{errors.orderRefNo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Name
            </label>
            <input
              type="text"
              value={filter.securityName}
              onChange={(e) => handleChange('securityName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter security name"
            />
            {errors.securityName && (
              <p className="text-red-500 text-sm mt-1">{errors.securityName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              value={filter.transactionType}
              onChange={(e) => handleChange('transactionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select transaction type</option>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
            {errors.transactionType && (
              <p className="text-red-500 text-sm mt-1">{errors.transactionType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Status
            </label>
            <select
              value={filter.orderStatus}
              onChange={(e) => handleChange('orderStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select order status</option>
              <option value="Submitted">Submitted</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Executed">Executed</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
            {errors.orderStatus && (
              <p className="text-red-500 text-sm mt-1">{errors.orderStatus}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filter.fromDate}
              onChange={(e) => handleChange('fromDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fromDate && (
              <p className="text-red-500 text-sm mt-1">{errors.fromDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filter.toDate}
              onChange={(e) => handleChange('toDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.toDate && (
              <p className="text-red-500 text-sm mt-1">{errors.toDate}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionHistoryFilter;