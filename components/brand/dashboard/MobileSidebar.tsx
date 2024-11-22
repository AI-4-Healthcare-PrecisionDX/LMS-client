import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Menu } from "./Menu";

export function SidebarMobile() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/assets/logo_final.png"
                alt="DiagnoTech-AI"
                width={500}
                height={500}
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold">DiagnoTech-AI</span>
            </Link>
          </Button>
        </SheetHeader>
        <Menu />
      </SheetContent>
    </Sheet>
  );
}
