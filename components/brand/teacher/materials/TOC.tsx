/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFileUpload from "@/hooks/use-upload";
import api from "@/lib/axios-config";
import { extractPDFTableOfContents } from "@/lib/getTOC";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileUp,
  PlusCircle,
  Save,
} from "lucide-react";
import React, { useCallback, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PrivarySection from "../../student/library/privacy-card";
import { reducer } from "../../student/library/reducer";
import {
  State,
  TOCEntry,
  tocSchema,
  TOCSchema,
} from "../../student/library/types";
// import PrivarySection from "./library/privacy-card";
// import { reducer } from "./library/reducer";
// import { State, TOCEntry, tocSchema, TOCSchema } from "./library/types";

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

const category = ["Book", "Journal", "Thesis", "Notes", "Slides", "Others"];

export default function TOC({ sectionId }: { sectionId: string}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { uploadFile, error, loading } = useFileUpload();

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
      description: "",
      toc: [],
      isPrivate: false,
    },
    mode: "onSubmit",
  });
  const handlePrivacyToggle = useCallback(
    (checked: boolean) => {
      setValue("isPrivate", checked);
      dispatch({ type: "SET_IS_PRIVATE", payload: checked });
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
        title: "New Content",
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
    const jsonString = JSON.stringify(data.toc, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const jsonfile = new File([blob], `${data.bookName}.json`, {
      type: "application/json",
    });

    console.info("Uploading files:", data.pdfFile, jsonfile);

    console.log(jsonfile.type, jsonfile.size, jsonfile.name);

    try {
      const result = await uploadFile({
        pdfFile: data.pdfFile,
        jsonFile: jsonfile,
        author: data.authors,
        materialType: data.category,
        visibility: data.isPrivate,
        materialTitle: data.bookName,
      });

      if (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error,
        });
      }

      if (loading) {
        dispatch({
          type: "SET_LOADING",
          payload: true,
        });
      }

      dispatch({
        type: "SET_API_RESPONSE",
        payload: JSON.stringify(result, null, 2),
      });

      const sectionContent = await api.post(`/section/${sectionId}/content`, {
        title: data.bookName,
        section_id: sectionId,
        library_item_id: result.library_id,
      });
      console.log(sectionContent);

      toast.success("Table of Contents submitted successfully");
      window.location.reload();
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Type your message here."
            {...register("description")}
            id="description"
            rows={3}
            className="w-full"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <PrivarySection
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
            Add outline
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
                <Save className="mr-2 h-4 w-4" /> Save and Upload materials
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
