import React from "react";
import Container from "../container/Container";

const Tabs = ({ activeTab, setActiveTab, tabs, children, className = "" }) => {
  return (
    <Container className={`flex flex-col ${className}`}>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children}</div>
    </Container>
  );
};

export default Tabs;
