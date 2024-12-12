import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThreadMessage } from "./types";

const ConversationsTab = ({ messages }: { messages: ThreadMessage[] }) => (
  <Card className="border rounded-lg shadow-lg bg-white dark:bg-gray-800">
    <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/50">
      <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
        Conversation History
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <ScrollArea className="h-[75vh]">
        <div className="flex flex-col gap-3 p-4">
          {messages.map((message) => (
            <div
              key={message.scenario_thread_message_id}
              className={`flex items-end gap-3 ${
                message.role === "doctor" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                className={`h-10 w-10 border-2 ${
                  message.role === "doctor"
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-emerald-500 dark:border-emerald-400"
                }`}
              >
                <AvatarImage
                  src={
                    message.role === "doctor"
                      ? "/doctor-avatar.png"
                      : "/patient-avatar.png"
                  }
                  alt={message.role}
                />
                <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {message.role === "doctor" ? "DR" : "PT"}
                </AvatarFallback>
              </Avatar>

              <div
                className={`relative max-w-[80%] rounded-2xl px-6 py-3 ${
                  message.role === "doctor"
                    ? "bg-blue-500 dark:bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
              >
                <p className="mb-1.5 text-sm font-medium opacity-90 capitalize">
                  {message.role}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <div
                  className={`absolute top-4 ${
                    message.role === "doctor"
                      ? "right-full mr-1 border-r-blue-500 dark:border-r-blue-600"
                      : "left-full ml-1 border-l-gray-100 dark:border-l-gray-700"
                  } border-solid border-8 border-transparent`}
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);

export default ConversationsTab;
