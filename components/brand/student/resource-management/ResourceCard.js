import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "@heroicons/react/solid";

export default function ResourceCard({ title, links, description, onDelete }) {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete(); // Call the parent function to handle deletion
    setOpen(false); // Close the dialog
  };

  return (
    <Card className="w-[250px] h-[280px] flex flex-col relative">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="break-words overflow-hidden max-w-[200px]">
          {title}
        </CardTitle>
        <CardDescription className="break-words overflow-hidden max-w-[200px]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            {links &&
              links.map((link, index) => (
                <div key={index} className="block">
                  <Label className="block mb-1">Link {index + 1}:</Label>
                  <a
                    href={link.startsWith("http") ? link : `http://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline block"
                  >
                    {link}
                  </a>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-shrink-0 flex justify-end items-center">
        <div className="relative">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="p-0"
              >
                <TrashIcon className="w-10 h-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>Are you sure you want to delete this card?</p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white"
                >
                  Yes, Delete
                </Button>
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
