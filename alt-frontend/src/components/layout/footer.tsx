export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AI Outreach - Insurance Personalization System
        </p>
      </div>
    </footer>
  );
}
