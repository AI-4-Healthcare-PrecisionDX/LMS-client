import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CalendarIcon, CheckCircle, Clock, Edit, Trash2 } from "lucide-react";
import Link from "lucide-react";

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onComplete,
  showCompleteButton,
}) {
  return (
    <div>
      <Card
        key={event.id}
        className={`mb-4 border-l-4 ${
          event.status === "successful"
            ? "border-green-600"
            : event.status === "failed"
              ? "border-red-600"
              : "border-blue-600"
        }`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-blue-800">
            {event.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
            {format(event.deadline, "MMMM d, yyyy")}
          </div>
          {event.deadline.getHours() !== 0 &&
            event.deadline.getMinutes() !== 0 && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                {format(event.deadline, "h:mm a")}
              </div>
            )}
          {event.link && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Link className="mr-2 h-4 w-4 text-blue-500" />
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {event.link}
              </a>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {event.topics.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          {showCompleteButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComplete(event.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Complete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(event.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
