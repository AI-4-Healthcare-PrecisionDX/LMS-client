import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { Announcement } from "./types";

export default function AnnouncementSection({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return announcements.map((announcement) => (
    <Card
      key={announcement.announcement_id}
      className="hover:shadow-lg transition-shadow dark:border-gray-800"
    >
      <CardHeader className="border-b dark:border-gray-800 pb-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium dark:text-gray-100">
                {announcement.announcement_title}
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(announcement.created_at), "MMM d")}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Posted by Teacher •{" "}
              {format(new Date(announcement.created_at), "h:mm a")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: announcement.announcement_description,
          }}
        />
      </CardContent>
    </Card>
  ));
}
