import { useEffect, useState } from "react";
import { RefreshCw, Download, Filter } from 'lucide-react';
import { 
  LineChart, 
  BarChart,
  PieChart,
  Line, 
  Bar,
  Pie,
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { useDashboard } from "../../Contexts/DashboardContext/DashboardContext";


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ChartSection = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Current Week');
  const tabs = ['Overview', 'Widget', 'Attendance', 'Drill Down'];
  
  // Get data from dashboard context
  const {
    companyStats,
    attendanceAnalytics,
    leaveAnalytics,
    widgets,
    overview,
    formatters,
    transformers,
    getOverview,
    getCompanyStats,
    // getAttendanceAnalytics,
    getLeaveAnalytics,
    getWidget,
    isDataStale,
    refreshOverview,
    isLoading,
    isOverviewLoading,
    isAnalyticsLoading,
    isWidgetLoading,
    isStatsLoading
  } = useDashboard();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if data is stale or missing before fetching
        if (!overview || isDataStale('overview')) {
          await getOverview(30);
        }
        if (!companyStats || isDataStale('stats')) {
          await getCompanyStats();
        }
        if (!attendanceAnalytics || isDataStale('analytics')) {
          // await getAttendanceAnalytics();
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, [getOverview, getCompanyStats, overview, companyStats, attendanceAnalytics, isDataStale]);

  // Format chart data from context
  const formatChartData = () => {
    if (!attendanceAnalytics?.dailyTrend) return [];
    
    return transformers.getAttendanceTrendData(attendanceAnalytics.dailyTrend).map(item => ({
      date: item.date,
      present: item.present,
      late: item.late,
      total: item.total,
      attendanceRate: item.attendanceRate,
    }));
  };

  const formatLeaveData = () => {
    if (!leaveAnalytics?.leaveTypes) return [];
    
    return transformers.getLeaveTypeChartData(leaveAnalytics.leaveTypes).map(item => ({
      name: item.name,
      value: item.value,
      approved: item.approved,
      days: item.days,
    }));
  };

  const formatWidgetData = () => {
    if (!widgets.attendance) return [];
    
    // Example transformation for widget data
    return [
      { name: 'Present', value: widgets.attendance?.present || 0 },
      { name: 'Absent', value: widgets.attendance?.absent || 0 },
      { name: 'Late', value: widgets.attendance?.late || 0 },
    ];
  };

  const formatOverviewData = () => {
    if (!overview) return [];
    
    // Example transformation for overview data
    return [
      { name: 'Employees', value: overview?.Employees?.total || 0 },
      { name: 'Present Today', value: overview?.AttendanceToday?.present || 0 },
      { name: 'On Leave', value: overview?.AttendanceToday?.onLeave || 0 },
    ];
  };

  const handleRefresh = async () => {
    try {
      await refreshOverview(30);
      // await getAttendanceAnalytics();
      await getLeaveAnalytics();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const renderChart = () => {
    const chartData = formatChartData();
    const leaveData = formatLeaveData();
    const widgetData = formatWidgetData();
    const overviewData = formatOverviewData();

    switch (activeTab) {
      case 'Overview':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'attendanceRate') return [`${value}%`, 'Attendance Rate'];
                  return [value, name];
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="present" 
                stroke="#8884d8" 
                name="Present"
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="late" 
                stroke="#ffc658" 
                name="Late Arrivals"
              />
              <Line 
                type="monotone" 
                dataKey="attendanceRate" 
                stroke="#82ca9d" 
                name="Attendance Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Widget':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={widgetData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'Attendance':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leaveData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {leaveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  value, 
                  `${name} (${props.payload.days} days)`
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'Drill Down':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Dashboard Analytics</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={isLoading || isOverviewLoading || isAnalyticsLoading}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-8 mb-6">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${timeRange === 'Current Week' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
          <button 
            onClick={() => setTimeRange('Current Week')}
            className={`text-sm ${timeRange === 'Current Week' ? 'font-medium' : 'text-gray-600'}`}
          >
            Current Week
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${timeRange === 'Previous Week' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
          <button 
            onClick={() => setTimeRange('Previous Week')}
            className={`text-sm ${timeRange === 'Previous Week' ? 'font-medium' : 'text-gray-600'}`}
          >
            Previous Week
          </button>
        </div>
      </div>

      <div className="h-80">
        {(isLoading || isOverviewLoading || isAnalyticsLoading) ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          renderChart()
        )}
      </div>

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
    </div>
  );
};