import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ProspectCreate } from '../../types';
import Button from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import Input from '../ui/input';
import Select from '../ui/select';

interface ProspectFormProps {
  initialData?: Partial<ProspectCreate>;
  onSubmit: (data: ProspectCreate) => Promise<void>;
  isUpdate?: boolean;
}

// Common industries for dropdown
const COMMON_INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Construction',
  'Hospitality',
  'Transportation',
  'Real Estate',
  'Energy',
  'Agriculture',
  'Entertainment',
  'Legal',
  'Nonprofit',
  'Other'
];

export default function ProspectForm({ initialData = {}, onSubmit, isUpdate = false }: ProspectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProspectCreate>({
    company_name: initialData.company_name || '',
    industry: initialData.industry || '',
    website: initialData.website || '',
    contact_person: initialData.contact_person || '',
    email: initialData.email || '',
    phone: initialData.phone || ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProspectCreate, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof ProspectCreate]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProspectCreate, string>> = {};
    
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit(formData);
      router.push('/prospects');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save prospect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isUpdate ? 'Update Prospect' : 'Add New Prospect'}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              className={errors.company_name ? 'border-red-500' : ''}
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry *
            </label>
            <Select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={errors.industry ? 'border-red-500' : ''}
            >
              <option value="">Select industry</option>
              {COMMON_INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </Select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <Input
              id="contact_person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/prospects')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={loading}
          >
            {isUpdate ? 'Update Prospect' : 'Add Prospect'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
