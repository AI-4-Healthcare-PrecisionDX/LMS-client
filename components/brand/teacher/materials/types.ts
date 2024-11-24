export type LibraryItem = {
  material_type: string
  material_title: string
  material_description: string
  author: string
  visibility: boolean,
  library_id: string,
  file_url: string
}

export type SectionExclusiveContent = {
  section_id: string
  title: string
  description: string
  library_item: LibraryItem
}

export type Props = {
  section_exclusive_contents: SectionExclusiveContent[]
}

export interface Step {
  selector: string;
  content: string;
}
