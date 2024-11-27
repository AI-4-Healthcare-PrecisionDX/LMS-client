import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tocEntrySchema: z.ZodSchema<any> = z.lazy(() =>
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

export const tocSchema = z.object({
  bookName: z.string().min(1, "Book name is required"),
  authors: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  pdfFile: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "The file must be a PDF",
    }),
  toc: z.array(tocEntrySchema).optional(),
  isPrivate: z.boolean().default(false),
});

export type TOCSchema = z.infer<typeof tocSchema>;
export type TOCEntry = z.infer<typeof tocEntrySchema>;

export type State = {
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

export type Action =
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
