
'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/course/card';
import { FaUser, FaFilePdf, FaFileImage, FaFileAlt, FaDownload } from 'react-icons/fa';
import { MdInsertDriveFile } from 'react-icons/md';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MaterialCardProps {
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  studentAvatarUrl: string;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  title,
  description,
  fileUrl,
  fileName,
  studentAvatarUrl,
}) => {
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<string>('');

  const getFileTypeIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-blue-600" />;
      case 'txt':
        return <FaFileAlt className="text-green-600" />;
      default:
        return <MdInsertDriveFile className="text-gray-600" />;
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
    }
  };

  return (
    <Card className="w-full border p-1 mt-1 shadow-md">
      <CardContent className="mt-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </CardContent>

      <CardContent className="mt-2 flex items-center gap-2">
        <div className="text-2xl">
          {getFileTypeIcon(fileUrl)}
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline text-primary"
        >
          View {fileName}
        </a>
        <a
          href={fileUrl}
          download={fileName}
          className="text-sm text-primary flex items-center"
        >
          <FaDownload className="ml-1 w-4 h-4" />
        </a>
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

export default MaterialCard;
