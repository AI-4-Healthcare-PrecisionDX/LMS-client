"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarIcon,
  MessageCircleIcon,
  PlusCircleIcon,
  SendIcon,
  ArrowLeftIcon,
  SearchIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CounselingSession() {
  const [counselors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Psychiatrist",
      avatar: "/placeholder.svg?height=40&width=40",
      availability: [
        { time: "9:00 AM - 9:30 AM", available: true },
        { time: "9:30 AM - 10:00 AM", available: false },
        { time: "10:00 AM - 10:30 AM", available: true },
        { time: "10:30 AM - 11:00 AM", available: false },
      ],
    },
    {
      id: 2,
      name: "Dr. Michael Lee",
      specialization: "Psychologist",
      avatar: "/placeholder.svg?height=40&width=40",
      availability: [
        { time: "11:00 AM - 11:30 AM", available: false },
        { time: "11:30 AM - 12:00 PM", available: true },
        { time: "12:00 PM - 12:30 PM", available: true },
        { time: "12:30 PM - 1:00 PM", available: true },
      ],
    },
    {
      id: 3,
      name: "Dr. Emma Watson",
      specialization: "Career Counseling",
      avatar: "/placeholder.svg?height=40&width=40",
      availability: [
        { time: "2:00 PM - 2:30 PM", available: true },
        { time: "2:30 PM - 3:00 PM", available: true },
        { time: "3:00 PM - 3:30 PM", available: false },
        { time: "3:30 PM - 4:00 PM", available: true },
      ],
    },
    {
      id: 4,
      name: "Dr. David Chen",
      specialization: "Family Therapy",
      avatar: "/placeholder.svg?height=40&width=40",
      availability: [
        { time: "4:00 PM - 4:30 PM", available: false },
        { time: "4:30 PM - 5:00 PM", available: false },
        { time: "5:00 PM - 5:30 PM", available: true },
        { time: "5:30 PM - 6:00 PM", available: true },
      ],
    },
    {
      id: 5,
      name: "Dr. Olivia Brown",
      specialization: "Addiction Counseling",
      avatar: "/placeholder.svg?height=40&width=40",
      availability: [
        { time: "1:00 PM - 1:30 PM", available: true },
        { time: "1:30 PM - 2:00 PM", available: true },
        { time: "2:00 PM - 2:30 PM", available: true },
        { time: "2:30 PM - 3:00 PM", available: false },
      ],
    },
  ]);

  const [pastSessions] = useState([
    {
      id: 1,
      counselor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Psychiatrist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-10-01 10:00 AM - 10:30 AM",
      messages: [
        { sender: "Student", text: "Hello, I need help with anxiety." },
        {
          sender: "Dr. Sarah Johnson",
          text: "Sure, let's talk about it. Can you tell me more about what you're experiencing?",
        },
        {
          sender: "Student",
          text: "I've been feeling overwhelmed lately, especially with my coursework.",
        },
        {
          sender: "Dr. Sarah Johnson",
          text: "I understand. Let's explore some strategies to manage your anxiety and workload.",
        },
        {
          sender: "Student",
          text: "That would be great. I'm having trouble sleeping and concentrating.",
        },
        {
          sender: "Dr. Sarah Johnson",
          text: "Sleep issues and concentration problems are common with anxiety. Let's start with some relaxation techniques.",
        },
      ],
    },
    {
      id: 2,
      counselor: {
        id: 2,
        name: "Dr. Michael Lee",
        specialization: "Psychologist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-10-02 11:00 AM - 11:30 AM",
      messages: [
        { sender: "Student", text: "I am feeling stressed about exams." },
        {
          sender: "Dr. Michael Lee",
          text: "It's common to feel stressed during exam periods. Let's discuss some effective study techniques and stress management strategies.",
        },
        {
          sender: "Student",
          text: "That would be really helpful. I'm struggling with time management.",
        },
        {
          sender: "Dr. Michael Lee",
          text: "Great, we can start by creating a study schedule that works for you.",
        },
        {
          sender: "Student",
          text: "How do I balance studying with self-care?",
        },
        {
          sender: "Dr. Michael Lee",
          text: "That's an excellent question. Self-care is crucial. Let's incorporate breaks and relaxation into your schedule.",
        },
      ],
    },
    {
      id: 3,
      counselor: {
        id: 3,
        name: "Dr. Emma Watson",
        specialization: "Career Counseling",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-10-05 2:00 PM - 2:30 PM",
      messages: [
        {
          sender: "Student",
          text: "I'm unsure about my career path after graduation.",
        },
        {
          sender: "Dr. Emma Watson",
          text: "That's a common concern. Let's start by discussing your interests and strengths.",
        },
        {
          sender: "Student",
          text: "I enjoy problem-solving and working with technology.",
        },
        {
          sender: "Dr. Emma Watson",
          text: "That's a great start. Have you considered fields like software engineering or data analysis?",
        },
        {
          sender: "Student",
          text: "I have, but I'm not sure if I'm qualified.",
        },
        {
          sender: "Dr. Emma Watson",
          text: "Let's explore the skills required for these roles and see how they align with your current abilities and interests.",
        },
      ],
    },
    {
      id: 4,
      counselor: {
        id: 4,
        name: "Dr. James Thompson",
        specialization: "Clinical Psychologist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-10-06 3:30 PM - 4:00 PM",
      messages: [
        {
          sender: "Student",
          text: "I feel unmotivated and don't know how to deal with it.",
        },
        {
          sender: "Dr. James Thompson",
          text: "Lack of motivation can be difficult. Have you experienced this before?",
        },
        {
          sender: "Student",
          text: "Yes, it happens especially when I'm under pressure.",
        },
        {
          sender: "Dr. James Thompson",
          text: "That makes sense. Let's look into setting small goals to manage the pressure and build motivation step by step.",
        },
        { sender: "Student", text: "That sounds like something I can try." },
        {
          sender: "Dr. James Thompson",
          text: "Great! Let's explore some specific goals you can set for the week.",
        },
      ],
    },
    {
      id: 5,
      counselor: {
        id: 5,
        name: "Dr. Alice Green",
        specialization: "Therapist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-10-07 9:00 AM - 9:30 AM",
      messages: [
        {
          sender: "Student",
          text: "I feel like I'm constantly failing, no matter what I do.",
        },
        {
          sender: "Dr. Alice Green",
          text: "It sounds like you're being hard on yourself. Do you want to talk about what's been happening?",
        },
        {
          sender: "Student",
          text: "I just can't seem to get good grades, and it makes me feel like I'm not good enough.",
        },
        {
          sender: "Dr. Alice Green",
          text: "It's important to recognize your efforts, not just the outcome. Let's talk about ways to reframe your thinking about success.",
        },
        {
          sender: "Student",
          text: "I'm not sure how to do that, but I'm open to learning.",
        },
        {
          sender: "Dr. Alice Green",
          text: "I'll guide you through some techniques. Let's start with focusing on the process rather than the results.",
        },
      ],
    },
    {
      id: 6,
      counselor: {
        id: 6,
        name: "Dr. John Miller",
        specialization: "Career Coach",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-10-08 11:00 AM - 11:30 AM",
      messages: [
        {
          sender: "Student",
          text: "I'm confused about whether to pursue a master's degree or start working after graduation.",
        },
        {
          sender: "Dr. John Miller",
          text: "It's a significant decision. Have you considered the pros and cons of each option?",
        },
        {
          sender: "Student",
          text: "I have, but I'm still unsure which is the right path for me.",
        },
        {
          sender: "Dr. John Miller",
          text: "Let's break it down and discuss what aligns with your long-term goals and current situation.",
        },
        {
          sender: "Student",
          text: "That sounds helpful. I'm more inclined toward starting my career, but I'm worried about missing out on further education.",
        },
        {
          sender: "Dr. John Miller",
          text: "That's understandable. We can explore ways you can continue learning while building your career.",
        },
      ],
    },
  ]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("past");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPastSessions = pastSessions.filter(
    (session) =>
      session.counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.date.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCounselors = counselors.filter(
    (counselor) =>
      counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counselor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    setSelectedSession((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { sender: "Student", text: newMessage.trim() },
      ],
    }));
    setNewMessage("");
  };

  const startNewSession = (counselor) => {
    setSelectedCounselor(counselor);
    setIsDialogOpen(true);
  };

  const handleBackButton = () => {
    setSelectedSession(null);
    setActiveTab("past");
  };

  const handleCreateSession = (selectedSlot) => {
    const newSession = {
      id: Date.now(),
      counselor: selectedCounselor,
      date: new Date().toLocaleDateString() + " " + selectedSlot,
      messages: [],
    };
    setSelectedSession(newSession);
    setActiveTab("chat");
    setIsDialogOpen(false);
  };

  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
          <TabsTrigger value="new">New Session</TabsTrigger>
        </TabsList>
        <TabsContent value="past">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Past Counseling Sessions</CardTitle>
              <CardDescription>
                Review your previous counseling sessions
              </CardDescription>
              <div className="relative">
                <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[80vh] pr-4">
                <div className="grid gap-4">
                  {filteredPastSessions.map((session) => (
                    <Card key={session.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage
                              src={session.counselor.avatar}
                              alt={session.counselor.name}
                            />
                            <AvatarFallback>
                              {session.counselor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {session.counselor.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {session.date}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedSession(session);
                            setActiveTab("chat");
                          }}
                        >
                          View Session
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="new">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Start a New Counseling Session</CardTitle>
              <CardDescription>
                Choose a counselor to begin your session
              </CardDescription>
              <div className="relative">
                <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search counselors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredCounselors.map((counselor) => (
                  <Card key={counselor.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage
                            src={counselor.avatar}
                            alt={counselor.name}
                          />
                          <AvatarFallback>
                            {counselor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{counselor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {counselor.specialization}
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => startNewSession(counselor)}>
                        Create Anonymous Session
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          {selectedSession && (
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleBackButton}
                    className="mb-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className="text-right">
                    <CardTitle className="flex items-center justify-end">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={selectedSession.counselor.avatar}
                          alt={selectedSession.counselor.name}
                        />
                        <AvatarFallback>
                          {selectedSession.counselor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedSession.counselor.name}
                    </CardTitle>
                    <CardDescription>{selectedSession.date}</CardDescription>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Session Link:{" "}
                  <a
                    href={`/counseling-session/${selectedSession.id}-${Math.random().toString(36).substring(7)}`}
                    className="text-primary hover:underline"
                  >
                    /counseling-session/{selectedSession.id}-
                    {Math.random().toString(36).substring(7)}
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {selectedSession.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.sender === "Student"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.sender === "Student"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Anonymous Session</DialogTitle>
            <DialogDescription>
              Choose an available time slot for your session with{" "}
              {selectedCounselor?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {selectedCounselor?.availability.map((slot) => (
                <Button
                  key={slot.time}
                  onClick={() => handleCreateSession(slot.time)}
                  disabled={!slot.available}
                  variant={slot.available ? "default" : "outline"}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Session Link:{" "}
                <span className="font-medium text-primary">
                  /counseling-session/{Math.random().toString(36).substring(7)}
                </span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
