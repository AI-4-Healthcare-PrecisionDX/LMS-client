"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/course/card";
import {
  FaUser,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ClassworkProps {
  title: string;
  description: string;
  dueDate: string;
  studentAvatarUrl: string;
  instructionFileUrl?: string;
  instructionFileName?: string;
  instructionFileType?: string; // e.g., 'pdf', 'docx', etc.
}

const Classwork: React.FC<ClassworkProps> = ({
  title,
  description,
  dueDate,
  studentAvatarUrl,
  instructionFileUrl,
  instructionFileName,
  instructionFileType,
}) => {
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileSubmit = () => {
    if (file) {
      console.log("File submitted:", file.name);
      // Add your file submission logic here (e.g., API call).
      setFile(null); // Clear file after submission
    } else {
      alert("Please select a file before submitting.");
    }
  };

  const renderFileIcon = (fileType?: string) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FaFilePdf className="text-red-600 w-6 h-6" />;
      case "docx":
        return <FaFileWord className="text-blue-600 w-6 h-6" />;
      default:
        return <FaFileAlt className="text-gray-600 w-6 h-6" />;
    }
  };

  return (
    <Card className="w-full border p-1 mt-1 shadow-md">
      <CardContent className="mt-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{title}</h3>
          <Badge className="text-lg text-red-600" variant="outline">
            Due: {dueDate}
          </Badge>
        </div>
        <p className="text-sm mt-2">{description}</p>

        {/* Instructions File Section */}
        {instructionFileUrl && instructionFileName && (
          <div className="flex items-center mt-4 space-x-2">
            {renderFileIcon(instructionFileType)}
            <a
              href={instructionFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline text-primary"
            >
              View {instructionFileName}
            </a>
            <a
              href={instructionFileUrl}
              download={instructionFileName}
              className="text-sm font-medium underline text-primary flex items-center"
            >
              <FaDownload className="ml-1 w-4 h-4" />
            </a>
          </div>
        )}
      </CardContent>

      <CardContent className="mt-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="border px-4 py-1 rounded-md text-sm"
        />
        <button
          onClick={handleFileSubmit}
          className="px-3 py-2 ml-2 text-sm bg-primary text-white rounded-md"
        >
          Submit
        </button>
        {file && (
          <p className="mt-2 text-sm text-muted-foreground">
            File: {file.name}
          </p>
        )}
      </CardContent>

      <hr className="border-t my-2" />

      <CardFooter className="flex items-left gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={studentAvatarUrl} />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
        <input
          className="flex-1 border rounded-md px-2 py-1 text-sm"
          type="text"
          value={commentText}
          onChange={handleCommentChange}
          placeholder="Add comment..."
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

export default Classwork;
