export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="ml-2 text-lg font-medium text-gray-900">Repository</span>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Repository. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
