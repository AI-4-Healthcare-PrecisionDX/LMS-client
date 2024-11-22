import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "@heroicons/react/solid";

const isValidLink = (link) => {
  return (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("www.")
  );
};

export default function ResourceInput({ onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    links: [""], // Start with one empty link
    description: "",
  });

  const [open, setOpen] = useState(false); // Manage dialog state
  const [errors, setErrors] = useState({}); // Manage form validation errors

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("link")) {
      const index = parseInt(id.split("-")[1]);
      setFormData((prev) => {
        const newLinks = [...prev.links];
        newLinks[index] = value;
        return { ...prev, links: newLinks };
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleAddMore = () => {
    if (formData.links.length < 3) {
      setFormData((prev) => ({
        ...prev,
        links: [...prev.links, ""],
      }));
    }
  };

  const handleSubmit = () => {
    const { title, description, links } = formData;
    const newErrors = {};

    if (!title.trim()) newErrors.title = "add title";
    if (!description.trim()) newErrors.description = "add description";
    if (!links[0].trim()) newErrors.link1 = "add link";

    // Validate links
    links.forEach((link, index) => {
      if (link.trim() && !isValidLink(link)) {
        newErrors[`link${index + 1}`] = "Invalid link format";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent form submission if there are validation errors
    }

    // Filter out empty links
    const filteredLinks = links.filter((link) => link.trim() !== "");

    // Update formData with filtered links
    onSave({
      title,
      description,
      links: filteredLinks,
    });
    setFormData({ title: "", links: [""], description: "" }); // Reset the form
    setErrors({}); // Clear errors
    setOpen(false); // Close the dialog
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleSubmit(); // Call the submit handler
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-16 h-16 p-0"
          onClick={() => setOpen(true)} // Open the dialog when clicking the button
        >
          <PlusIcon className="w-8 h-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
          <DialogDescription>
            Add your Resource here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="title" className="w-1/4 text-right">
              Title
            </Label>
            <div className="w-3/4 relative">
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Handle Enter key press
                placeholder="Enter title"
                className={errors.title ? "border-red-600" : ""}
              />
              {errors.title && (
                <p className="absolute inset-y-0 right-2 flex items-center text-red-600 text-sm">
                  {errors.title}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="description" className="w-1/4 text-right">
              Description
            </Label>
            <div className="w-3/4 relative">
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Handle Enter key press
                placeholder="Enter description"
                className={errors.description ? "border-red-600" : ""}
              />
              {errors.description && (
                <p className="absolute inset-y-0 right-2 flex items-center text-red-600 text-sm">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {formData.links.map((link, index) => (
            <div key={index} className="flex items-center gap-4">
              <Label htmlFor={`link-${index}`} className="w-1/4 text-right">
                Link {index + 1}
              </Label>
              <div className="w-3/4 relative">
                <Input
                  id={`link-${index}`}
                  value={link}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown} // Handle Enter key press
                  placeholder={`Enter Link ${index + 1}`}
                  className={
                    index === 0 && errors.link1 ? "border-red-600" : ""
                  }
                />
                {errors[`link${index + 1}`] && (
                  <p className="absolute inset-y-0 right-2 flex items-center text-red-600 text-sm">
                    {errors[`link${index + 1}`]}
                  </p>
                )}
              </div>
            </div>
          ))}

          {formData.links.length < 3 && (
            <div className="relative">
              <Button onClick={handleAddMore} className="mt-2 ml-[106px] w-3/9">
                Add more
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
