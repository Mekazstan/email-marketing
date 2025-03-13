import Link from 'next/link';
import { Card, CardContent } from '../components/ui/card';
import Button from '../components/ui/button';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Outreach - Personalized Insurance Sales
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leverage AI to create highly personalized sales outreach for your insurance prospects.
          Generate custom emails and call scripts based on industry and engagement history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Manage Prospects</h2>
            <p className="text-gray-600 mb-4">
              Keep track of all your potential clients and their information in one place.
            </p>
            <Link href="/prospects" className="mt-auto">
              <Button>View Prospects</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Generate Personalized Emails</h2>
            <p className="text-gray-600 mb-4">
              Create highly personalized emails based on industry, company, and previous interactions.
            </p>
            <Link href="/emails" className="mt-auto">
              <Button>Create Emails</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Generate Call Scripts</h2>
            <p className="text-gray-600 mb-4">
              Create intelligent cold call scripts tailored to each prospect's industry and needs.
            </p>
            <Link href="/calls" className="mt-auto">
              <Button>Create Call Scripts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Add your prospects with information about their company and industry</li>
          <li>Our AI analyzes the prospect's industry and any previous engagement history</li>
          <li>Generate personalized emails or call scripts tailored to each prospect</li>
          <li>Track engagement and use that data to improve future communications</li>
        </ol>
      </div>
    </div>
  );
}
