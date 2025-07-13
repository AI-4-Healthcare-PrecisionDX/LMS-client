"use client";

import { ChevronDown, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
};

type CollapseMenuButtonProps = {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isCollapsed?: boolean;
};

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isCollapsed = false,
}: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(isSubmenuActive);

  // When sidebar is collapsed, don't show dropdown functionality
  if (isCollapsed) {
    // Find the first submenu that's active, or just use the first submenu as fallback
    const activeSubmenu = submenus.find(submenu => submenu.active) || submenus[0];
    
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant={active ? "default" : "ghost"}
              className="w-full justify-center h-10 mb-1 p-2"
              asChild
            >
              <Link href={activeSubmenu?.href || "#"}>
                <Icon size={18} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <div className="space-y-1">
              <div className="font-medium">{label}</div>
              {submenus.map((submenu, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {submenu.label}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible
      open={isCollapsibleOpen}
      onOpenChange={setIsCollapsibleOpen}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Button
          variant={active ? "default" : "ghost"}
          className="w-full justify-start h-10"
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                <Icon size={18} />
              </span>
              <p className={cn("max-w-[150px] truncate")}>{label}</p>
            </div>
            <div className={cn("whitespace-nowrap")}>
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active, icon: Icon }, index) => (
          <Button
            key={index}
            variant={active ? "default" : "ghost"}
            className="w-full justify-start h-10 mb-1"
            asChild
          >
            <Link href={href}>
              <span className="mr-4 ml-2">
                <Icon size={18} />
              </span>
              <p className={cn("max-w-[170px] truncate")}>{label}</p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}