// app/components/CardInfo.js

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CardInfo({ title, value }) {
  return (
    //   <div className="bg-white shadow-card border-solid border-2 border-gray-100 shadow-xl rounded-lg p-4 sm:p-6 xl:p-8">
    //     <div className="flex items-center">
    //       <div className={`flex-shrink-0 ${color} rounded-full p-4`}>{icon}</div>
    //       <div className="flex-grow ml-4">
    //         <h3 className="text-base font-normal text-gray-500">{title}</h3>
    //         <p className="text-2xl font-bold text-gray-900">{value}</p>
    //         <span
    //           className={`text-sm ${change > 0 ? "text-green-500" : "text-red-500"} ml-2`}
    //         >
    //           {change > 0 ? "▲" : "▼"} {Math.abs(change)} Last 30 days
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label>{value}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
