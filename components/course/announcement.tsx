"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/course/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUserAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface AnnouncementCardProps {
  teacherAvatarUrl: string;
  teacherName: string;
  date: string;
  content: string;
  studentAvatarUrl: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  teacherAvatarUrl,
  teacherName,
  date,
  content,
  studentAvatarUrl,
}) => {
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<string>("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText("");
    }
  };

  return (
    <Card className="w-full border p-1 mt-1 shadow-md">
      <CardHeader className="flex items-left justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={teacherAvatarUrl} />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <CardTitle className="text-sm font-bold">{teacherName}</CardTitle>
          </div>

          <CardDescription className="text-xs text-muted-foreground text-right">
            {date}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm">{content}</p>
      </CardContent>

      <hr className="border-t my-2" />

      <CardFooter className="flex items-left gap-4">
        <Avatar className="w-6 h-6">
          <AvatarImage src={studentAvatarUrl} />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>

        <input
          className="flex-1 border rounded-md px-2 py-1 text-sm"
          type="text"
          value={commentText}
          onChange={handleCommentChange}
          placeholder="Add class comment..."
        />
        <button
          className="px-2 py-1 text-sm bg-primary text-white rounded-md"
          onClick={handleCommentSubmit}
        >
          Comment
        </button>
      </CardFooter>

      <div className="mt-1 ml-6 mb-1 mr-2 space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <FaUser className="w-6 h-6 text-muted-foreground" />
              <p className="text-sm">{comment}</p>
            </div>
            {index < comments.length - 1 && (
              <hr className="border-t my-2 w-full" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AnnouncementCard;
