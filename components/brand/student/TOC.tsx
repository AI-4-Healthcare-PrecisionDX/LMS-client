/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useReducer, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  FileUp,
  Save,
  EyeOff,
  Eye,
  Info,
} from "lucide-react";
import { extractPDFTableOfContents } from "@/lib/getTOC";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

const tocEntrySchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    pageRanges: z.object({
      start: z.number().min(1, "Start page must be at least 1"),
      end: z.number().min(1, "End page must be at least 1"),
    }),
    sections: z.array(tocEntrySchema).optional(),
  }),
);

const tocSchema = z.object({
  bookName: z.string().min(1, "Book name is required"),
  authors: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  departmentName: z.string().min(1, "Department is required"),
  courseName: z.string().min(1, "Course name is required"),
  pdfFile: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "The file must be a PDF",
    }),
  toc: z.array(tocEntrySchema),
  isPrivate: z.boolean().default(false),
});

type TOCSchema = z.infer<typeof tocSchema>;
type TOCEntry = z.infer<typeof tocEntrySchema>;

type State = {
  toc: TOCEntry[];
  fileName: string;
  error: string;
  expandedItems: Record<string, boolean>;
  isLoading: boolean;
  selectedItems: string[];
  jsonData: string;
  apiResponse: string;
  isPrivate: boolean;
};

type Action =
  | { type: "SET_TOC"; payload: TOCEntry[] }
  | { type: "SET_FILE_NAME"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "TOGGLE_EXPAND"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SELECTED_ITEMS"; payload: string[] }
  | { type: "SET_JSON_DATA"; payload: string }
  | { type: "SET_API_RESPONSE"; payload: string }
  | { type: "SET_IS_PRIVATE"; payload: boolean }
  | {
      type: "ADD_ENTRY";
      payload: { parentId: string | null; newEntry: TOCEntry };
    }
  | {
      type: "UPDATE_ENTRY";
      payload: { id: string; field: string; value: string | number };
    }
  | { type: "DELETE_ENTRIES"; payload: string[] };

const initialState: State = {
  toc: [],
  fileName: "",
  error: "",
  expandedItems: {},
  isLoading: false,
  selectedItems: [],
  jsonData: '{"filename": "", "json_filename": "toc.json"}',
  apiResponse: "",
  isPrivate: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TOC":
      return { ...state, toc: action.payload };
    case "SET_FILE_NAME":
      return { ...state, fileName: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "TOGGLE_EXPAND":
      return {
        ...state,
        expandedItems: {
          ...state.expandedItems,
          [action.payload]: !state.expandedItems[action.payload],
        },
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload };
    case "SET_JSON_DATA":
      return { ...state, jsonData: action.payload };
    case "SET_API_RESPONSE":
      return { ...state, apiResponse: action.payload };
    case "ADD_ENTRY":
      return {
        ...state,
        toc: addEntryToToc(
          state.toc,
          action.payload.parentId,
          action.payload.newEntry,
        ),
      };
    case "UPDATE_ENTRY":
      return {
        ...state,
        toc: updateEntryInToc(
          state.toc,
          action.payload.id,
          action.payload.field,
          action.payload.value,
        ),
      };
    case "DELETE_ENTRIES":
      return {
        ...state,
        toc: deleteEntriesFromToc(state.toc, action.payload),
        selectedItems: [],
      };
    case "SET_IS_PRIVATE":
      return { ...state, isPrivate: action.payload };
    default:
      return state;
  }
}

function addEntryToToc(
  toc: TOCEntry[],
  parentId: string | null,
  newEntry: TOCEntry,
): TOCEntry[] {
  if (parentId === null) {
    return [...toc, newEntry];
  }
  return toc.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        sections: [...(item.sections || []), newEntry],
      };
    }
    if (item.sections && item.sections.length > 0) {
      return {
        ...item,
        sections: addEntryToToc(item.sections, parentId, newEntry),
      };
    }
    return item;
  });
}

function updateEntryInToc(
  toc: TOCEntry[],
  id: string,
  field: string,
  value: string | number,
): TOCEntry[] {
  return toc.map((item) => {
    if (item.id === id) {
      if (field === "start" || field === "end") {
        return {
          ...item,
          pageRanges: {
            ...item.pageRanges,
            [field]: parseInt(value.toString()) || 1,
          },
        };
      }
      return { ...item, [field]: value };
    }
    if (item.sections && item.sections.length > 0) {
      return {
        ...item,
        sections: updateEntryInToc(item.sections, id, field, value),
      };
    }
    return item;
  });
}

function deleteEntriesFromToc(
  toc: TOCEntry[],
  idsToDelete: string[],
): TOCEntry[] {
  return toc.filter((item) => {
    if (idsToDelete.includes(item.id)) {
      return false;
    }
    if (item.sections && item.sections.length > 0) {
      item.sections = deleteEntriesFromToc(item.sections, idsToDelete);
    }
    return true;
  });
}

const departments = [
  "Anatomy",
  "Biochemistry",
  "Physiology",
  "Pathology",
  "Microbiology",
  "Pharmacology",
  "Community Medicine",
  "Internal Medicine",
  "Surgery",
  "Pediatrics",
  "Obstetrics and Gynecology",
  "Psychiatry",
  "Radiology",
  "Anesthesiology",
  "Dermatology",
  "Ophthalmology",
  "Otorhinolaryngology",
  "Orthopedics",
];

const category = ["Book", "Journal", "Thesis", "Notes", "Slides", "Others"];

export default function TOC() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TOCSchema>({
    resolver: zodResolver(tocSchema),
    defaultValues: {
      bookName: "",
      authors: "",
      category: "",
      departmentName: "",
      courseName: "",
      toc: [],
      isPrivate: false,
    },
    mode: "onSubmit",
  });
  const handlePrivacyToggle = useCallback(
    (checked: boolean) => {
      setValue("isPrivate", checked);
    },
    [setValue],
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      dispatch({ type: "SET_FILE_NAME", payload: file.name });
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: "" });
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const extractedTOC = await extractPDFTableOfContents(uint8Array);
        dispatch({ type: "SET_TOC", payload: extractedTOC });
        setValue("toc", extractedTOC);
        setValue("pdfFile", file);
        dispatch({
          type: "SET_JSON_DATA",
          payload: JSON.stringify(
            { filename: file.name, json_filename: "toc.json" },
            null,
            2,
          ),
        });
        if (extractedTOC.length === 0) {
          dispatch({
            type: "SET_ERROR",
            payload:
              "No outline found in the PDF. You can add entries manually.",
          });
        }
      } catch (err) {
        console.error("Error processing PDF:", err);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to process the PDF. You can add entries manually.",
        });
        dispatch({ type: "SET_TOC", payload: [] });
        setValue("toc", []);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: "Please upload a valid PDF file.",
      });
    }
  };

  const toggleExpand = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_EXPAND", payload: id });
  }, []);

  const addEntry = useCallback(
    (parentId: string | null = null) => {
      const newEntry: TOCEntry = {
        id: Date.now().toString(),
        title: "New Entry",
        pageRanges: { start: 1, end: 1 },
        sections: [],
      };

      dispatch({ type: "ADD_ENTRY", payload: { parentId, newEntry } });
      setValue("toc", state.toc);
    },
    [setValue, state.toc],
  );

  const updateEntry = useCallback(
    (id: string, field: string, value: string | number) => {
      dispatch({ type: "UPDATE_ENTRY", payload: { id, field, value } });
      setValue("toc", state.toc);
    },
    [setValue, state.toc],
  );

  const deleteEntries = useCallback(() => {
    dispatch({ type: "DELETE_ENTRIES", payload: state.selectedItems });
    setValue("toc", state.toc);
  }, [state.selectedItems, state.toc, setValue]);

  const handleCheckboxChange = useCallback(
    (id: string, checked: boolean | "indeterminate") => {
      if (checked === "indeterminate") return;

      const toggleSelectionRecursive = (
        items: TOCEntry[],
        idsToToggle: string[] = [],
      ): string[] => {
        return items.reduce((acc, item) => {
          if (item.id === id || idsToToggle.includes(item.id)) {
            if (checked) {
              acc.push(item.id);
              if (item.sections && item.sections.length > 0) {
                acc.push(...toggleSelectionRecursive(item.sections, [item.id]));
              }
            }
          } else if (item.sections && item.sections.length > 0) {
            acc.push(...toggleSelectionRecursive(item.sections));
          } else if (acc.includes(item.id)) {
            acc.push(item.id);
          }
          return acc;
        }, [] as string[]);
      };

      const newSelected = toggleSelectionRecursive(state.toc);
      dispatch({
        type: "SET_SELECTED_ITEMS",
        payload: checked
          ? Array.from(new Set([...state.selectedItems, ...newSelected]))
          : state.selectedItems.filter(
              (itemId) => !newSelected.includes(itemId),
            ),
      });
    },
    [state.toc, state.selectedItems],
  );

  const renderTOCItem = useCallback(
    (item: TOCEntry, isSubSection: boolean = false) => {
      const isExpanded = state.expandedItems[item.id];
      return (
        <div key={item.id} className="mb-2">
          <div className="flex items-center space-x-2">
            {!isSubSection && item.sections && item.sections.length > 0 && (
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-1 hover:bg-transparent"
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            )}
            <Checkbox
              checked={state.selectedItems.includes(item.id)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(item.id, checked as boolean)
              }
            />
            <Input
              value={item.title}
              onChange={(e) => updateEntry(item.id, "title", e.target.value)}
              className="flex-grow"
            />
            <Input
              type="number"
              value={item.pageRanges.start}
              onChange={(e) => updateEntry(item.id, "start", e.target.value)}
              className="w-16"
            />
            <Input
              type="number"
              value={item.pageRanges.end}
              onChange={(e) => updateEntry(item.id, "end", e.target.value)}
              className="w-16"
            />
            {!isSubSection && (
              <div onClick={() => addEntry(item.id)}>
                <PlusCircle size={16} />
              </div>
            )}
          </div>
          {isExpanded && item.sections && item.sections.length > 0 && (
            <div className="ml-6 mt-2">
              {item.sections.map((section: any) =>
                renderTOCItem(section, true),
              )}
            </div>
          )}
        </div>
      );
    },
    [
      state.expandedItems,
      state.selectedItems,
      updateEntry,
      addEntry,
      toggleExpand,
      handleCheckboxChange,
    ],
  );

  const onSubmit = async (data: TOCSchema) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: "" });

    try {
      const formData = new FormData();
      formData.append("file", data.pdfFile);

      // Create JSON file with TOC data
      const tocData = {
        bookName: data.bookName,
        authors: data.authors,
        category: data.category,
        departmentName: data.departmentName,
        courseName: data.courseName,
        toc: data.toc,
        isPrivate: data.isPrivate,
      };
      const jsonBlob = new Blob([JSON.stringify(tocData)], {
        type: "application/json",
      });
      const jsonFile = new File([jsonBlob], "toc.json", {
        type: "application/json",
      });
      formData.append("json_file", jsonFile);

      const response = await fetch(
        "https://lms-backend.diagnotech-ai.com/v1/users/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      dispatch({
        type: "SET_API_RESPONSE",
        payload: JSON.stringify(result, null, 2),
      });
      toast.success("Table of Contents submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to submit the form. Please try again.",
      });
      toast.error("Failed to submit Table of Contents");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Your Material</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="bookName">Book Name</Label>
          <Input
            id="bookName"
            {...register("bookName")}
            placeholder="Enter material Title"
          />
          {errors.bookName && (
            <p className="text-red-500">{errors.bookName.message}</p>
          )}
        </div>
        <div className="mb-4">
          <Label htmlFor="authors">Author(s)</Label>
          <Input
            id="authors"
            {...register("authors")}
            placeholder="Write authors name"
          />
          {errors.authors && (
            <p className="text-red-500">{errors.authors.message}</p>
          )}
        </div>
        <div className="mb-4">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => setValue("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {category.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>
        <div className="mb-4">
          <Label htmlFor="departmentName">Department</Label>
          <Select onValueChange={(value) => setValue("departmentName", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.departmentName && (
            <p className="text-red-500">{errors.departmentName.message}</p>
          )}
        </div>
        <div className="mb-4">
          <Label htmlFor="courseName">Course Name</Label>
          <Input
            id="courseName"
            {...register("courseName")}
            placeholder="Enter course name"
          />
          {errors.courseName && (
            <p className="text-red-500">{errors.courseName.message}</p>
          )}
        </div>
        <PrivacySection
          isPrivate={state.isPrivate}
          onToggle={handlePrivacyToggle}
        />
        <div className="mb-4">
          <Label htmlFor="pdf-upload" className="block mb-2">
            Upload PDF (Required)
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="flex-grow"
              required
            />
            <Button type="button" disabled={state.isLoading}>
              {state.isLoading ? "Loading..." : <FileUp size={16} />}
            </Button>
          </div>
          {errors.pdfFile && (
            <p className="text-red-500">{errors.pdfFile.message}</p>
          )}
        </div>
        {state.fileName && (
          <p className="mb-4">Uploaded file: {state.fileName}</p>
        )}
        {state.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {state.toc.length === 0 && !state.error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Outline Available</AlertTitle>
            <AlertDescription>
              No table of contents found. You can add entries manually.
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-4">
          <Button type="button" onClick={() => addEntry()}>
            Add Main Entry
          </Button>
        </div>
        {state.toc.length > 0 && (
          <div className="mb-4 grid grid-cols-7 gap-2 font-bold">
            <div className="col-span-1">Select</div>
            <div className="col-span-3">Title</div>
            <div className="col-span-1">Start Page</div>
            <div className="col-span-1">End Page</div>
            <div className="col-span-1">Actions</div>
          </div>
        )}
        <div className="space-y-2">
          {state.toc.map((item) => renderTOCItem(item))}
        </div>
        {state.selectedItems.length > 0 && (
          <div className="mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Selected Items</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the selected entries and all their sub-entries.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteEntries}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <div className="mt-4">
          <Button type="submit" disabled={state.isLoading}>
            {state.isLoading ? (
              "Submitting..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save and Upload Table of
                Contents
              </>
            )}
          </Button>
        </div>
      </form>
      {state.apiResponse && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">API Response:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
            {state.apiResponse}
          </pre>
        </div>
      )}
    </div>
  );
}
interface PrivacySectionProps {
  isPrivate: boolean;
  onToggle: (checked: boolean) => void;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({
  isPrivate,
  onToggle,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              {isPrivate ? (
                <EyeOff className="h-5 w-5 text-primary" />
              ) : (
                <Eye className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-medium">Privacy Settings</h3>
              <p className="text-sm text-muted-foreground">
                {isPrivate
                  ? "Only you can access this material"
                  : "Anyone with the link can access this material"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Private materials are only visible to you.</p>
                  <p>
                    Public materials can be accessed by anyone with the link.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              checked={isPrivate}
              onCheckedChange={onToggle}
              className="ml-2"
            />
            <Label className="text-sm font-medium">
              {isPrivate ? "Private" : "Public"}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
