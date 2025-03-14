import { useState } from 'react';
import Link from 'next/link';
import { useProspects } from '../../hooks/use-prospects';
import { Prospect } from '../../types';
import Button from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function ProspectList() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const { 
    prospects, 
    loading, 
    error, 
    fetchProspects, 
    deleteProspect,
    setIndustry 
  } = useProspects(0, 50, selectedIndustry);

  const handleIndustryFilter = (industry: string) => {
    setSelectedIndustry(industry);
    setIndustry(industry);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this prospect?')) {
      await deleteProspect(id);
    }
  };

  // Get unique industries for the filter
  const uniqueIndustries = Array.from(
    new Set(prospects.map(p => p.industry))
  ).sort();

  if (loading) {
    return <div className="text-center py-10">Loading prospects...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        Error loading prospects: {error.message}
        <Button 
          className="mt-4" 
          variant="secondary" 
          onClick={() => fetchProspects()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle>Prospects</CardTitle>
          <Link href="/prospects/new">
            <Button>Add New Prospect</Button>
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant={selectedIndustry === '' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => handleIndustryFilter('')}
          >
            All
          </Button>
          {uniqueIndustries.map(industry => (
            <Button
              key={industry}
              variant={selectedIndustry === industry ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleIndustryFilter(industry)}
            >
              {industry}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Email
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prospects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No prospects found. Add some prospects to get started!
                  </td>
                </tr>
              ) : (
                prospects.map((prospect) => (
                  <tr key={prospect.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/prospects/${prospect.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        {prospect.company_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/prospects/${prospect.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleDelete(prospect.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
