"use client"; // This directive makes the component a Client Component

import React, { useState } from "react";

// SidebarLink component
const SidebarLink = ({ text, hasDropdown, onClick }) => {
  return (
    <div
      className="py-3 px-4 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-center text-gray-800">
        <span>{text}</span>
        {hasDropdown && <span className="ml-2 text-gray-600">▼</span>}
      </div>
    </div>
  );
};

// Sidebar component
const Sidebar = () => {
  const [isCurrentCoursesOpen, setIsCurrentCoursesOpen] = useState(false);
  const [isPreviousCoursesOpen, setIsPreviousCoursesOpen] = useState(false);

  const handleLinkClick = (text) => {
    console.log(`${text} clicked`); // Handle navigation or any other logic here
  };

  const toggleCurrentCoursesDropdown = () => {
    setIsCurrentCoursesOpen(!isCurrentCoursesOpen);
  };

  const togglePreviousCoursesDropdown = () => {
    setIsPreviousCoursesOpen(!isPreviousCoursesOpen);
  };

  return (
    <div className="w-64 bg-white text-gray-800 h-screen flex flex-col p-4 border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="font-bold text-lg">DiagnoTech Logo</div>
      </div>

      {/* Sidebar Links */}
      <SidebarLink text="Home" onClick={() => handleLinkClick("Home")} />
      <SidebarLink
        text="Current Courses"
        hasDropdown
        onClick={toggleCurrentCoursesDropdown}
      />
      {isCurrentCoursesOpen && (
        <div className="ml-4 mt-2">
          <SidebarLink
            text="Course 1"
            onClick={() => handleLinkClick("Course 1")}
          />
          <SidebarLink
            text="Course 2"
            onClick={() => handleLinkClick("Course 2")}
          />
          <SidebarLink
            text="Course 3"
            onClick={() => handleLinkClick("Course 3")}
          />
          <SidebarLink
            text="Course 4"
            onClick={() => handleLinkClick("Course 4")}
          />
        </div>
      )}
      <SidebarLink
        text="Previous Courses"
        hasDropdown
        onClick={togglePreviousCoursesDropdown}
      />
      {isPreviousCoursesOpen && (
        <div className="ml-4 mt-2">
          <SidebarLink
            text="Course 5"
            onClick={() => handleLinkClick("Course 5")}
          />
          <SidebarLink
            text="Course 6"
            onClick={() => handleLinkClick("Course 6")}
          />
          <SidebarLink
            text="Course 7"
            onClick={() => handleLinkClick("Course 7")}
          />
          <SidebarLink
            text="Course 8"
            onClick={() => handleLinkClick("Course 8")}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
