import { useQuery } from "@tanstack/react-query";
import { SectionExclusiveContent, TemplateCourse } from "./materials/types";

export const useFilteredContents = ({
    section_exclusive_contents,
    template_course,
    searchTerm,
    filterVisibility,
    filterMaterialType,
}: {
    section_exclusive_contents: SectionExclusiveContent[];
    template_course: TemplateCourse;
    searchTerm: string;
    filterVisibility: string;
    filterMaterialType: string;
}) => {
    return useQuery({
        queryKey: [
            "filteredContents",
            searchTerm,
            filterVisibility,
            filterMaterialType,
        ],
        queryFn: () => {
            const allContents = [
                ...section_exclusive_contents.map(content => ({
                    ...content,
                    source: 'section'
                })),
                ...(template_course.course_materials || []).map(material => ({
                    library_item: material,
                    source: 'template'
                }))
            ];

            const uniqueContents = allContents.filter((content, index, self) =>
                index === self.findIndex((c) =>
                    c.library_item.library_id === content.library_item.library_id
                )
            );

            // console.log("uniqueContents", uniqueContents);

            return uniqueContents.filter((content) => {
                const materialTitle = content.library_item?.material_title?.toLowerCase() || '';
                const author = (content.library_item.author) ? content.library_item.author.toLowerCase() : (content.library_item.library_item.author) ? content.library_item.library_item.author.toLowerCase() : '';
                const description = content.library_item?.material_description?.toLowerCase() || '';
                const searchTermLower = searchTerm.toLowerCase();

                const matchesSearch =
                    searchTerm === "" ||
                    materialTitle.includes(searchTermLower) ||
                    author.includes(searchTermLower) ||
                    description.includes(searchTermLower);

                const matchesMaterialType =
                    filterMaterialType === "all" ||
                    (content.library_item.material_type ? content.library_item.material_type : content.library_item.library_item.material_type) === filterMaterialType;

                const matchesVisibility =
                    filterVisibility === "all" ||
                    (filterVisibility === "visible"
                        ? (content.library_item.visibility ? content.library_item.visibility : content.library_item.library_item.visibility)
                        : !content.library_item?.visibility);

                return matchesSearch && matchesMaterialType && matchesVisibility;
            });
        },
        enabled: !!section_exclusive_contents && !!template_course?.course_materials,
    });
};

// const { getLibraryFileForCourseByLibraryID } = useFileUpload();


// export const getPdfUrl = async (library_item: any, setIsDialogOpen: (value: boolean) => void, setIsLoadingPdf: (value: boolean) => void, setSelectedPdf: (value: string | null) => void, setSelectedPdfName: (value: string) => void) => {
//     try {
//         const file_url = await getLibraryFileForCourseByLibraryID((library_item.library_id) ? library_item.library_id : library_item.library_item.library_id);
//         setSelectedPdf(file_url);
//         setSelectedPdfName((library_item.material_title) ? library_item.material_title : library_item.library_item.material_title);
//     } catch (error) {
//         toast.error("Failed to load PDF");
//         setIsDialogOpen(false);
//     } finally {
//         setIsLoadingPdf(false);
//     }
// };
