'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Prospect } from '../../services/api';
import Button from '../../components/ui/button';

interface ProspectListProps {
  prospects: Prospect[];
  onDelete: (id: number) => void;
  onSelectForEmail: (id: number) => void;
  onSelectForCall: (id: number) => void;
}

const ProspectList: React.FC<ProspectListProps> = ({ 
  prospects, 
  onDelete,
  onSelectForEmail,
  onSelectForCall
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    setSelectedIds(prev => 
      prev.length === prospects.length ? [] : prospects.map(p => p.id)
    );
  };
  
  const handleBulkEmail = () => {
    if (confirm(`Send emails to ${selectedIds.length} prospects?`)) {
      // Implementation would call a batch email endpoint
      alert(`Emails queued for ${selectedIds.length} prospects`);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <div className="mb-2 sm:mb-0">
          <span className="text-sm text-gray-600">
            {prospects.length} prospects found
          </span>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleBulkEmail}
            >
              Email Selected ({selectedIds.length})
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSelectAll}
          >
            {selectedIds.length === prospects.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedIds.length === prospects.length && prospects.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prospects.map((prospect) => (
              <tr key={prospect.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(prospect.id)}
                    onChange={() => toggleSelect(prospect.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/prospects/${prospect.id}`} className="hover:underline">
                          {prospect.company_name}
                        </Link>
                      </div>
                      {prospect.website && (
                        <div className="text-sm text-gray-500">
                          <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {prospect.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {prospect.industry}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prospect.contact_person || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{prospect.email || 'No email'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onSelectForEmail(prospect.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => onSelectForCall(prospect.id)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Call
                  </button>
                  <Link
                    href={`/prospects/${prospect.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${prospect.company_name}?`)) {
                        onDelete(prospect.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProspectList;
