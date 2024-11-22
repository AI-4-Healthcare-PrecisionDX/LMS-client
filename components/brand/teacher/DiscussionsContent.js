import React, { useState, useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

const discussions = [
  {
    id: 1,
    student: { name: "Emily Chen", emoji: "👩‍⚕️" },
    date: "2023-09-20",
    content:
      "Has anyone started preparing for the upcoming anatomy practical exam? I'm looking to form a study group!",
    replies: [
      {
        student: { name: "Michael Patel", emoji: "🧑‍⚕️" },
        date: "2023-09-20",
        content:
          "I'm interested! Let's meet at the library tomorrow and go over the cardiovascular system together.",
      },
      {
        student: { name: "Sarah Johnson", emoji: "👩‍⚕️" },
        date: "2023-09-21",
        content:
          "Count me in! I've got some great mnemonics for remembering the cranial nerves.",
      },
    ],
  },
  {
    id: 2,
    student: { name: "Alex Rodriguez", emoji: "🧑‍⚕️" },
    date: "2023-09-18",
    content:
      "I'm having trouble understanding the mechanism of action for ACE inhibitors. Can someone explain it in simpler terms?",
    replies: [
      {
        student: { name: "Priya Sharma", emoji: "👩‍⚕️" },
        date: "2023-09-19",
        content:
          "Think of ACE inhibitors as 'bouncers' at a club. They block the enzyme (ACE) that would normally create a hormone (angiotensin II) that raises blood pressure. By blocking this, they help lower blood pressure and reduce strain on the heart.",
      },
    ],
  },
  {
    id: 3,
    student: { name: "David Kim", emoji: "🧑‍⚕️" },
    date: "2023-09-17",
    content:
      "Just finished reading the assigned chapter on neurodegenerative diseases. The part about potential stem cell therapies for Parkinson's disease was fascinating!",
    replies: [],
  },
  {
    id: 4,
    student: { name: "Olivia Taylor", emoji: "👩‍⚕️" },
    date: "2023-09-16",
    content:
      "Does anyone have tips for memorizing the stages of mitosis? I keep mixing up prophase and prometaphase.",
    replies: [
      {
        student: { name: "Ethan Brown", emoji: "🧑‍⚕️" },
        date: "2023-09-16",
        content:
          "I use the acronym PMAT: Prophase, Metaphase, Anaphase, Telophase. For prometaphase, I remember it as 'Pro-Metaphase' - the step right before metaphase where the nuclear envelope breaks down.",
      },
      {
        student: { name: "Sophia Lee", emoji: "👩‍⚕️" },
        date: "2023-09-17",
        content:
          "I find drawing out each stage helps a lot. Maybe we could create some visual aids together?",
      },
    ],
  },
  {
    id: 5,
    student: { name: "Lucas Martinez", emoji: "🧑‍⚕️" },
    date: "2023-09-15",
    content:
      "I'm struggling with interpreting ECG readings. Any resources or study techniques you'd recommend?",
    replies: [
      {
        student: { name: "Ava Wilson", emoji: "👩‍⚕️" },
        date: "2023-09-15",
        content:
          "There's a great app called 'ECG Mastery' that has interactive quizzes and explanations. It really helped me understand the different waveforms and intervals.",
      },
      {
        student: { name: "Noah Thompson", emoji: "🧑‍⚕️" },
        date: "2023-09-16",
        content:
          "I found practicing with real ECG strips from clinical cases really helpful. Our professor posted some anonymized ones on the course website - have you checked those out?",
      },
    ],
  },
];

export default function DiscussionsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);

  const sortedAndFilteredDiscussions = useMemo(() => {
    return discussions
      .filter((discussion) =>
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [searchTerm, sortOrder]);

  const toggleReplies = (id) => {
    setExpandedDiscussion(expandedDiscussion === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Search discussions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sortedAndFilteredDiscussions.map((discussion) => (
        <Card key={discussion.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{discussion.student.emoji}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold">{discussion.student.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {discussion.date}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{discussion.content}</p>
            {discussion.replies.length > 0 && (
              <div>
                <Button
                  variant="outline"
                  onClick={() => toggleReplies(discussion.id)}
                  className="flex items-center"
                >
                  {expandedDiscussion === discussion.id ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Hide Replies
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show Replies ({discussion.replies.length})
                    </>
                  )}
                </Button>
                {expandedDiscussion === discussion.id && (
                  <div className="mt-4 ml-6 space-y-4">
                    {discussion.replies.map((reply, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-200 pl-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar>
                            <AvatarFallback>
                              {reply.student.emoji}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-semibold">
                              {reply.student.name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {reply.date}
                            </span>
                          </div>
                        </div>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
