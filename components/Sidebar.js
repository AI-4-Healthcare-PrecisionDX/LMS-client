// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";

// // const Sidebar = () => {
// //     const [open, setOpen] = useState(true);
// //     const router = useRouter();
// //     useEffect(() => {
// //         // Update the CSS variable for sidebar width based on the open state
// //         document.documentElement.style.setProperty(
// //             '--sidebar-width',
// //             open ? '18rem' : '5rem'
// //         );
// //     }, [open]);

// //     // Close the sidebar on smaller screens
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth <= 768) {
// //                 setOpen(false);
// //                 // document.documentElement.style.setProperty('--sidebar-width', '5rem');
// //             } else {
// //                 // document.documentElement.style.setProperty('--sidebar-width', open ? '18rem' : '5rem');
// //             }
// //         };

// //         window.addEventListener("resize", handleResize);
// //         handleResize(); // Check the window size on initial load

// //         return () => window.removeEventListener("resize", handleResize);
// //     }, []);

// //     const Menus = [
// //         { title: "Dashboard", src: "Overview", url: "/" },
// //         { title: "Practice Test", src: "ai", url: "/practice-test" },
// //         { title: "Chat", src: "ai", url: "/chat" },
// //     ];

// //     return (
// //         <>
// //             <div
// //                 className={`fixed top-0 left-0 ${open ? "w-72" : "w-20"} bg-black h-screen p-5 pt-8 duration-300 z-30`}>
// //                 <img
// //                     src="/assets/control.png"
// //                     className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
// //  border-2 rounded-full ${!open && "rotate-180"}`}
// //                     onClick={() => setOpen(!open)}
// //                 />
// //                 <div className="flex gap-x-4 items-center">
// //                     <img
// //                         src="/assets/logo_final.png"
// //                         className={`cursor-pointer duration-500 w-20 ${open && "rotate-[360deg]"
// //                             }`}
// //                     />
// //                     <h1
// //                         className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"
// //                             }`}
// //                     >
// //                         DiagnoTech-Ai
// //                     </h1>
// //                 </div >
// //                 <ul className="flex flex-col gap-2 pt-6">
// //                     {
// //                         Menus.map((Menu, index) => (
// //                             <button
// //                                 key={index}
// //                                 onClick={() => router.push(`${Menu.url}`)}
// //                                 className="w-full hover:bg-gray-700 transition-colors"
// //                             >
// //                                 <li
// //                                     className={`flex rounded-md p-2 cursor-pointer text-gray-300 text-sm items-center gap-x-4 ${index === 0 && "bg-light-white"
// //                                         } `}
// //                                 >
// //                                     <img src={`/assets/${Menu.src}.svg`} />
// //                                     <span className={`${!open && "hidden"} origin-left duration-200`}>
// //                                         {Menu.title}
// //                                     </span>
// //                                 </li>
// //                             </button>
// //                         ))}
// //                 </ul>
// //             </div>
// //         </>
// //     )
// // }
// // export default Sidebar;

// /**
//  * v0 by Vercel.
//  * @see https://v0.dev/t/obus3LxsAfo
//  * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
//  */
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Toggle } from "@/components/ui/toggle"
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
// import ModeToggle from "./ModeToggle"

// export default function Sidebar() {
//     return (
//         <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
//             <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
//                 <Link href="/" className="flex items-center gap-2" prefetch={false}>
//                     <img
//                         src="/assets/logo_final.png"
//                         className="cursor-pointer duration-500 w-10"
//                     />
//                     <span className="sr-only">DiagnoTech-Ai</span>
//                 </Link>
//                 <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
//                     <Link
//                         href="/"
//                         className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
//                         prefetch={false}
//                     >
//                         Home
//                     </Link>
//                     <Link
//                         href="/exam"
//                         className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
//                         prefetch={false}
//                     >
//                         Exam
//                     </Link>
//                     <Link
//                         href="/chat"
//                         className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
//                         prefetch={false}
//                     >
//                         Chat
//                     </Link>
//                 </nav>
//                 <div className="flex items-center gap-4">
//                     <ModeToggle />
//                     <Sheet>
//                         <SheetTrigger asChild>
//                             <Button variant="ghost" size="icon" className="rounded-full md:hidden">
//                                 <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                                 <span className="sr-only">Toggle navigation menu</span>
//                             </Button>
//                         </SheetTrigger>
//                         <SheetContent side="left" className="md:hidden">
//                             <div className="grid gap-4 p-4">
//                                 <Link
//                                     href="/"
//                                     className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
//                                     prefetch={false}
//                                 >
//                                     Home
//                                 </Link>
//                                 <Link
//                                     href="/exam"
//                                     className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
//                                     prefetch={false}
//                                 >
//                                     Exam
//                                 </Link>
//                                 <Link
//                                     href="/chat"
//                                     className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
//                                     prefetch={false}
//                                 >
//                                     Chat
//                                 </Link>
//                             </div>
//                         </SheetContent>
//                     </Sheet>
//                 </div>
//             </div>
//         </header>
//     )
// }

// function MenuIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <line x1="4" x2="20" y1="12" y2="12" />
//             <line x1="4" x2="20" y1="6" y2="6" />
//             <line x1="4" x2="20" y1="18" y2="18" />
//         </svg>
//     )
// }

// function MoonIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
//         </svg>
//     )
// }

// function MountainIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
//         </svg>
//     )
// }

// function PhoneIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//         </svg>
//     )
// }

// function SearchIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.3-4.3" />
//         </svg>
//     )
// }

import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

export function Dashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Products{" "}
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Customers
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no products
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a product.
              </p>
              <Button className="mt-4">Add Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
