import { TOCEntry } from "./types";

export function addEntryToToc(
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

export function updateEntryInToc(
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

export function deleteEntriesFromToc(
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
