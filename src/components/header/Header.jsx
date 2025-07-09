import { 
  ChevronDown,
  Menu,
  Bell,
  Globe,

} from 'lucide-react';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <header className={`fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg mr-4"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
            <Globe className="w-4 h-4" />
            <span className="text-sm">EN</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">FA</span>
            </div>
            <span className="text-sm font-medium">Fayyaz Ali</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header