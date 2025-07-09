import { Filter } from "lucide-react";

export const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = ['Overview', 'Widget', 'Attendance', 'Drill Down'];
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2">
        <Filter className="w-4 h-4" />
        <span>Filter</span>
      </button>
    </div>
  );
};