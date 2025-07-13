/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Book,
  Building,
  Calendar,
  Home,
  HomeIcon,
  Library,
  MessageSquare,
  Package,
  PencilLine,
  Text,
  User,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  openInNewTab?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getAdminMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          active: pathname === "/admin",
          icon: HomeIcon,
          submenus: [],
        },

        {
          href: "/admin/manage",
          label: "Manage",
          active: pathname === "/admin/manage",
          icon: User,
          submenus: [
            {
              href: "/admin/manage-teacher",
              label: "Teachers",
              active: pathname === "/admin/manage-teacher",
              icon: User,
            },
            {
              href: "/admin/manage-admin",
              label: "Admin",
              active: pathname === "/admin/manage-admin",
              icon: User,
            },
            {
              href: "/admin/manage-student",
              label: "Students",
              active: pathname === "/admin/manage-student",
              icon: User,
            },
            {
              href: "/admin/departments",
              label: "Departments",
              active: pathname === "/admin/departments",
              icon: Building,
            },
          ],
        },
        {
          href: "/admin/case",
          label: "Case",
          active: pathname === "/admin/case",
          icon: Book,
          submenus: [],
        },
        {
          href: "/admin/public-library",
          label: "Public Library",
          active: pathname.includes("/admin/public-library"),
          icon: Book,
          submenus: [],
        },
        // {
        //   href: "/admin/quality-assurance",
        //   label: "Quality Assurance",
        //   active: pathname === "/admin/quality-assurance",
        //   icon: MessageCircleCode,
        //   submenus: [],
        // },
        // {
        //   href: "/admin/students",
        //   label: "Students Statistics",
        //   active: pathname === "/admin/students",
        //   icon: UsersRound,
        //   submenus: [],
        // },
      ],
    },
    {
      groupLabel: "Course Mangement",
      menus: [
        {
          href: "/admin/courses",
          label: "Courses",
          active: pathname === "/admin/courses",
          icon: Book,
          submenus: [],
        },
        {
          href: "/admin/courses/section",
          label: "Section",
          active: pathname === "/admin/courses/section",
          icon: Book,
          submenus: [],
        },
      ],
    },
  ];
}

export function getStudentMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/student",
          label: "Dashboard",
          active: pathname === "/student",
          icon: Home,
          submenus: [],
        },
        {
          href: "/student/exam-v2",
          label: "My Library",
          active: [
            "/student/exam-v2",
            "/student/exam-v2/chapter",
            "/student/exam-v2/chapter/question",
            "/student/exam-v2/chapter/flashcard",
            "/student/exam-v2/chapter/question/result",
          ].includes(pathname),
          icon: Library,
          submenus: [],
        },
        {
          href: "/student/courses",
          label: "My Courses",
          active: pathname.startsWith("/student/courses"),
          icon: Book,
          submenus: [],
        },
        // {
        //   href: "/student/announcements",
        //   label: "Announcements",
        //   active: pathname.startsWith("/student/announcements"),
        //   icon: MessageSquare,
        //   submenus: [],
        // },
        {
          href: "/student/resource-management",
          label: "Note Management",
          active: pathname.startsWith("/student/resource-management"),
          icon: Package,
          submenus: [],
        },
        {
          href: "/student/practice",
          label: "Clinical Practice",
          active: pathname.startsWith("/student/practice"),
          icon: Text,
          submenus: [],
        },
        {
          href: "https://radiology-annotation-client.pages.dev/dashboard",
          label: "Radiology Practice",
          active: false,
          icon: PencilLine,
          submenus: [],
        },
        {
          href: "/student/events",
          label: "Events",
          active: pathname.startsWith("/student/events"),
          icon: Calendar,
          submenus: [],
        },
        {
          href: "/student/counselling",
          label: "Counselling",
          active: ["/student/counselling"].includes(pathname),
          icon: MessageSquare,
          submenus: [],
        },
        {
          href: "/student/public-library",
          label: "Public Library",
          active: pathname.includes("/student/public-library"),
          icon: Book,
          submenus: [],
        },
      ],
    },
  ];
}

export function getTeacherMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/teacher",
          label: "Home",
          active: ["/teacher"].includes(pathname),
          icon: HomeIcon,
          submenus: [],
        },
        {
          href: "/teacher/announcement",
          label: "Announcements",
          active: ["/teacher/announcement"].includes(pathname),
          icon: MessageSquare,
          submenus: [],
        },
        {
          href: "/teacher/public-library",
          label: "Public Library",
          active: pathname.includes("/teacher/public-library"),
          icon: Book,
          submenus: [],
        },
      ],
    },
  ];
}
