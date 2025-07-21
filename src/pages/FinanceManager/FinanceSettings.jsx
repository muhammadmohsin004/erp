import React from "react";
import { Settings, Triangle, Square, Circle } from "lucide-react";

const FinanceSettings = () => {
  const handleNavigation = (path) => {
    // You can replace this with your routing logic (React Router, Next.js router, etc.)
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employees Default Treasuries */}
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[200px] hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-6">
              <Settings className="w-8 h-8 text-indigo-600 mr-2" />
              <Settings className="w-10 h-10 text-indigo-700" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 text-center">
              Employees Default Treasuries
            </h3>
          </div>

          {/* Expenses Categories */}
          <div
            className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[200px] hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              handleNavigation("/admin/finance/expenses/catagories")
            }
          >
            <div className="flex items-center mb-6">
              <Triangle className="w-8 h-8 text-indigo-600 fill-current" />
              <div className="flex flex-col ml-2">
                <Square className="w-6 h-6 text-indigo-700 fill-current mb-1" />
                <Circle className="w-6 h-6 text-indigo-700 fill-current" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 text-center">
              Expenses Categories
            </h3>
          </div>

          {/* Incomes Categories */}
          <div
            className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[200px] hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              handleNavigation("/admin/finance/incomes/categories")
            }
          >
            <div className="flex items-center mb-6">
              <Triangle className="w-8 h-8 text-indigo-600 fill-current" />
              <div className="flex flex-col ml-2">
                <Square className="w-6 h-6 text-indigo-700 fill-current mb-1" />
                <Circle className="w-6 h-6 text-indigo-700 fill-current" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 text-center">
              Incomes Categories
            </h3>
          </div>

          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[200px] hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-6">
              <Settings className="w-8 h-8 text-indigo-600 mr-2" />
              <Settings className="w-10 h-10 text-indigo-700" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 text-center">
              General Settings
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSettings;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaShapes, FaCog } from "react-icons/fa";
// import { MdSettingsApplications } from "react-icons/md";

// const FinanceSettings = () => {
//   const navigate = useNavigate();

//   const cards = [
//     {
//       title: "Expenses Categories",
//       icon: <FaShapes className="text-4xl text-indigo-800" />,
//       route: "/finance/expenses/categories",
//     },
//     {
//       title: "Incomes Categories",
//       icon: <FaShapes className="text-4xl text-indigo-800" />,
//       route: "/finance/incomes/categories",
//     },
//     {
//       title: "General Settings",
//       icon: <FaCog className="text-4xl text-indigo-800" />,
//       route: "/finance/general-settings",
//     },
//     {
//       title: "Employees Default Treasuries",
//       icon: <MdSettingsApplications className="text-4xl text-indigo-800" />,
//       route: "/finance/employees-treasuries",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(card.route)}
//             className="bg-white hover:bg-gray-50 cursor-pointer rounded-md shadow-md p-6 flex flex-col items-center justify-center transition duration-200"
//           >
//             {card.icon}
//             <h2 className="mt-4 text-center text-lg font-medium text-gray-700">
//               {card.title}
//             </h2>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FinanceSettings;
