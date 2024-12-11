"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getAdminMenuList,
  getStudentMenuList,
  getTeacherMenuList,
} from "@/config";
import { cn } from "@/lib/utils";
import { CollapseMenuButton } from "./collapse-menu-button";

const getMenuListByRole = (role: string, pathname: string) => {
  switch (role) {
    case "admin":
      return getAdminMenuList(pathname);
    case "student":
      return getStudentMenuList(pathname);
    case "teacher":
      return getTeacherMenuList(pathname);
    default:
      return [];
  }
};

export function Menu() {
  const pathname = usePathname();
  const tempRole = pathname.split("/")[1];
  const menuList = getMenuListByRole(tempRole, pathname);

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                {groupLabel}
              </p>

              {menus.map(
                (
                  { href, label, icon: Icon, active, submenus, openInNewTab },
                  index,
                ) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        className="w-full justify-start h-10 mb-1"
                        asChild
                      >
                        <Link
                          href={href}
                          target={openInNewTab ? "_blank" : undefined}
                        >
                          <span>
                            <Icon size={18} />
                          </span>
                          <p className="max-w-[200px] truncate ml-2 text-md">
                            {label}
                          </p>
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
