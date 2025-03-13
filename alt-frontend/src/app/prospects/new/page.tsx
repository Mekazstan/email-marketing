'use client';

import { useRouter } from 'next/navigation';
import { prospectsApi } from '../../../services/api';
import { ProspectCreate } from '../../../types';
import ProspectForm from '../../../components/prospects/prospect-form';

export default function NewProspectPage() {
  const router = useRouter();

  const handleCreate = async (data: ProspectCreate) => {
    await prospectsApi.create(data);
    router.push('/prospects');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Prospect</h1>
      <ProspectForm onSubmit={handleCreate} />
    </div>
  );
}
