import { useState, useRef, ChangeEvent } from 'react';
import { useProspects } from '../../hooks/use-prospects';
import { ProspectCreate } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import Button from '../ui/button';

export default function ImportProspects() {
  const { importProspects, importCsv } = useProspects();
  const [isLoading, setIsLoading] = useState(false);
  const [importMethod, setImportMethod] = useState<'csv' | 'manual'>('csv');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState('');
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleManualDataChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setManualData(e.target.value);
  };

  const handleImportCSV = async () => {
    if (!csvFile) {
      alert('Please select a CSV file first');
      return;
    }

    setIsLoading(true);
    try {
      const importedProspects = await importCsv(csvFile);
      setResult({
        success: importedProspects.length,
        failed: 0 // We would calculate this in a real app
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setCsvFile(null);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import prospects. Please check your CSV format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportManual = async () => {
    if (!manualData.trim()) {
      alert('Please enter prospect data');
      return;
    }

    setIsLoading(true);
    try {
      const lines = manualData.trim().split('\n');
      const prospects: ProspectCreate[] = [];
      let failed = 0;

      for (const line of lines) {
        try {
          const [company_name, industry, ...rest] = line.split(',').map(item => item.trim());
          if (company_name && industry) {
            const prospect: ProspectCreate = { company_name, industry };
            
            if (rest.length > 0 && rest[0]) prospect.website = rest[0];
            if (rest.length > 1 && rest[1]) prospect.contact_person = rest[1];
            if (rest.length > 2 && rest[2]) prospect.email = rest[2];
            if (rest.length > 3 && rest[3]) prospect.phone = rest[3];
            
            prospects.push(prospect);
          } else {
            failed++;
          }
        } catch (e) {
          failed++;
        }
      }

      if (prospects.length > 0) {
        const importedProspects = await importProspects(prospects);
        setResult({
          success: importedProspects.length,
          failed
        });
        setManualData('');
      } else {
        alert('No valid prospect data found. Please check your format and try again.');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import prospects. Please check your data format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Prospects</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setImportMethod('csv')}
              className={`px-4 py-2 rounded-md ${
                importMethod === 'csv' 
                ? 'bg-blue-100 text-blue-800 border-blue-300 border' 
                : 'bg-gray-100 text-gray-800'
              }`}
            >
              Import from CSV
            </button>
            <button
              type="button"
              onClick={() => setImportMethod('manual')}
              className={`px-4 py-2 rounded-md ${
                importMethod === 'manual' 
                ? 'bg-blue-100 text-blue-800 border-blue-300 border' 
                : 'bg-gray-100 text-gray-800'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {importMethod === 'csv' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0l-3-3m3 3l3-3"
                    />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {csvFile ? csvFile.name : 'Click to select a CSV file'}
                  </span>
                </label>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>CSV format should be:</p>
                <code className="block bg-gray-100 p-2 mt-1 rounded">
                  company_name,industry,website,contact_person,email,phone
                </code>
              </div>
              
              <Button 
                onClick={handleImportCSV} 
                isLoading={isLoading}
                disabled={!csvFile || isLoading}
                className="w-full"
              >
                Import from CSV
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="manual-data" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter prospect data (one per line)
                </label>
                <textarea
                  id="manual-data"
                  rows={10}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Company A, Technology, https://example.com, John Doe, john@example.com, +1234567890"
                  value={manualData}
                  onChange={handleManualDataChange}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Format should be:</p>
                <code className="block bg-gray-100 p-2 mt-1 rounded">
                  company_name, industry, website, contact_person, email, phone
                </code>
                <p className="mt-1">Only company name and industry are required.</p>
              </div>
              
              <Button 
                onClick={handleImportManual} 
                isLoading={isLoading}
                disabled={!manualData.trim() || isLoading}
                className="w-full"
              >
                Import Data
              </Button>
            </div>
          )}
        </div>
        
        {result && (
          <div className={`mt-4 p-4 rounded-md ${
            result.success > 0 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
          }`}>
            <h4 className="text-lg font-medium">Import Results</h4>
            <p>
              Successfully imported: <strong>{result.success}</strong> prospects
              {result.failed > 0 && (
                <span className="ml-2">
                  (Failed: <strong>{result.failed}</strong>)
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
