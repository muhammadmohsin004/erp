import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import { KpiCard } from "../../components/cards/KpiCard";
import { ChartSection } from "../../components/cards/ChartSection";
import { TabNavigation } from "../../components/tabNav/TabNavigation";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <main className={`transition-all duration-300 pt-20 `}>
        <div className="p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Total Employees count"
              value="721K"
              change="+11.01%"
              changeType="positive"
              percentage="72%"
              color="bg-blue-500"
            />
            <KpiCard
              title="Attendance Rate"
              value="367K"
              change="-0.03%"
              changeType="negative"
              percentage="25%"
              color="bg-purple-500"
            />
            <KpiCard
              title="Productivity"
              value="1,156"
              change="+15.03%"
              changeType="positive"
              percentage="76%"
              color="bg-green-500"
            />
            <KpiCard
              title="Active Projects"
              value="239K"
              change="+4.08%"
              changeType="positive"
              percentage="76%"
              color="bg-orange-500"
            />
          </div>

          {/* Chart Section */}
          <div className="mb-8">
            <ChartSection />
          </div>

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Employee Table */}
          {/* <EmployeeTable /> */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;