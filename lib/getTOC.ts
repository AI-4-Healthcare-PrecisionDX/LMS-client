import * as pdfjsLib from "pdfjs-dist";

interface PageRange {
  start: number;
  end: number;
}

interface TOCSection {
  id: string;
  title: string;
  estimatedTime: number;
  pageRanges: PageRange;
}

interface TOCEntry extends TOCSection {
  difficulty: string;
  sections: TOCSection[];
}

interface FlatOutlineItem {
  item: any;
  level: number;
}

class PDFTOCExtractor {
  private pdfDocument: pdfjsLib.PDFDocumentProxy;
  private toc: TOCEntry[] = [];
  private flatOutlines: FlatOutlineItem[] = [];

  constructor(pdfDocument: pdfjsLib.PDFDocumentProxy) {
    this.pdfDocument = pdfDocument;
  }

  async extractTOC(): Promise<TOCEntry[]> {
    const outlines = await this.pdfDocument.getOutline();
    if (!outlines) return [];

    this.flattenOutlines(outlines);
    await this.processFlatOutlines();
    return this.toc;
  }

  private flattenOutlines(outlines: any[], level = 0): void {
    for (const item of outlines) {
      this.flatOutlines.push({ item, level });
      if (item.items) {
        this.flattenOutlines(item.items, level + 1);
      }
    }
  }

  private async getPageNumber(dest: string): Promise<number> {
    try {
      if (typeof dest === "string") {
        const destRef = await this.pdfDocument.getDestination(dest);
        if (destRef) {
          return (await this.pdfDocument.getPageIndex(destRef[0])) + 1;
        }
      } else if (Array.isArray(dest)) {
        return (await this.pdfDocument.getPageIndex(dest[0])) + 1;
      }
    } catch (error) {
      console.warn("Error getting page number:", error);
    }
    return 1; // Default to first page if there's an error
  }

  private async processFlatOutlines(): Promise<void> {
    for (let i = 0; i < this.flatOutlines.length; i++) {
      const { item, level } = this.flatOutlines[i];
      const startPage = await this.getPageNumber(item.dest);
      const endPage = await this.calculateEndPage(i, startPage);

      if (level === 0) {
        this.addMainEntry(item.title, startPage, endPage);
      } else {
        this.addSubEntry(item.title, startPage, endPage);
      }
    }
  }

  private async calculateEndPage(
    currentIndex: number,
    startPage: number
  ): Promise<number> {
    if (currentIndex + 1 < this.flatOutlines.length) {
      const nextStartPage = await this.getPageNumber(
        this.flatOutlines[currentIndex + 1].item.dest
      );
      return Math.max(startPage, nextStartPage - 1);
    }
    return this.pdfDocument.numPages;
  }

  private addMainEntry(
    title: string,
    startPage: number,
    endPage: number
  ): void {
    this.toc.push({
      id: (this.toc.length + 1).toString(),
      title,
      estimatedTime: 15, // Placeholder
      difficulty: "Easy", // Placeholder
      pageRanges: { start: startPage, end: endPage },
      sections: [],
    });
  }

  private addSubEntry(title: string, startPage: number, endPage: number): void {
    const parentEntry = this.toc[this.toc.length - 1];
    parentEntry.sections.push({
      id: `${parentEntry.id}.${parentEntry.sections.length + 1}`,
      title,
      estimatedTime: 15, // Placeholder
      pageRanges: { start: startPage, end: endPage },
    });
    parentEntry.pageRanges.end = Math.max(parentEntry.pageRanges.end, endPage);
  }
}

export async function extractPDFTableOfContents(
  pdfData: Uint8Array
): Promise<TOCEntry[]> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdfDocument = await loadingTask.promise;
    const extractor = new PDFTOCExtractor(pdfDocument);
    return await extractor.extractTOC();
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error(
      "Error processing PDF. Please check the file and try again."
    );
  }
}

interface BookInfo {
  title: string;
  author: string;
  category: string;
}

export async function extractPDFMetadata(pdfData: Uint8Array): Promise<BookInfo> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdfDocument = await loadingTask.promise;

    const metadata = await pdfDocument.getMetadata();
    const numPages = pdfDocument.numPages;

    let title = (metadata.info as { Title?: string })?.Title || "";
    let author = (metadata.info as { Author?: string })?.Author || "";
    let category = "";

    // If metadata doesn't provide title or author, try to extract from first few pages
    if (!title || !author) {
      for (let i = 1; i <= Math.min(5, numPages); i++) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item: any) => item.str).join(" ");

        if (!title) {
          const titleMatch = text.match(/(?:title|book name):\s*(.*)/i);
          if (titleMatch) title = titleMatch[1].trim();
        }

        if (!author) {
          const authorMatch = text.match(/(?:author|by):\s*(.*)/i);
          if (authorMatch) author = authorMatch[1].trim();
        }

        if (!category) {
          const categoryMatch = text.match(/(?:category|genre):\s*(.*)/i);
          if (categoryMatch) category = categoryMatch[1].trim();
        }

        if (title && author && category) break;
      }
    }

    return {
      title: title || "Unknown Title",
      author: author || "Unknown Author",
      category: category || "Unknown Category"
    };
  } catch (error) {
    console.error("Error extracting book info:", error);
    throw new Error("Error extracting book information. Please check the file and try again.");
  }
}


