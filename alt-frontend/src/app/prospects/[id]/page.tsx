import React, { useState } from 'react';
import Button from '../ui/button';
import { Prospect } from '../../services/api';

interface ProspectFormProps {
  prospect?: Omit<Prospect, 'id' | 'created_at' | 'updated_at'> & { id?: number };
  onSubmit: (data: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const ProspectForm: React.FC<ProspectFormProps> = ({
  prospect = {
    company_name: '',
    industry: '',
    website: '',
    contact_person: '',
    email: '',
    phone: ''
  },
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState(prospect);// filepath: /home/pinerealm22/AI_outreach/next-frontend/src/components/prospects/prospect-form.tsx
import React, { useState } from 'react';
import Button from '../ui/button';
import { Prospect } from '../../services/api';

interface ProspectFormProps {
  prospect?: Omit<Prospect, 'id' | 'created_at' | 'updated_at'> & { id?: number };
  onSubmit: (data: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const ProspectForm: React.FC<ProspectFormProps> = ({
  prospect = {
    company_name: '',
    industry: '',
    website: '',
    contact_person: '',
    email: '',
    phone: ''
  },
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState(prospect);