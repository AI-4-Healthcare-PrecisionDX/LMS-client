/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XOOXcduVOwR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default function TaskDemo() {
  const tags = [
    {
      label: "Check this video to excel in Neurology Practice Tests.",
      link: "https://www.youtube.com/watch?v=x9JEQ_zUdKM/",
    },
    {
      label:
        "You made mistakes in previous diagnostics. Here are tests for nervous system disorders.",
      link: "https://www.urmc.rochester.edu/encyclopedia/content.aspx?contenttypeid=85&contentid=P00811/",
    },
    {
      label: "Consider revisiting the Cardiology Clinical Practice module.",
      link: "/student/practice",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendation</CardTitle>
        <CardDescription>
          Manage your tasks and track their progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full border rounded-md h-72">
          <div className="p-4">
            {tags.map((tag) => (
              <>
                <div className="flex flex-row justify-between text-sm" key={tag.label}>
                  <div className="font-medium">{tag.label}</div>
                  <Link
                    href={tag.link}
                    className="flex items-center gap-2 cursor-pointer"
                    prefetch={false}
                    target="__blank"
                  >
                    <SquareArrowOutUpRight className="w-5 h-5" />
                  </Link>
                </div>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
