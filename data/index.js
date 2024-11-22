// mockData.js
export const questionTypes = [
  { title: "Question Bank", description: "Create from existing questions" },
  {
    title: "Adaptive Learning",
    description: "Questions adapt to student's level",
  },
  {
    title: "Application-based",
    description: "Apply concepts to real-world scenarios",
  },
  {
    title: "Writing Assignment",
    description: "Essay or long-form writing tasks",
  },
  {
    title: "Scenario-based",
    description: "Questions based on a given scenario",
  },
];
export const mergedBooksAndChapters = [
  {
    id: 1,
    title: "Fundamentals of Anatomy and Physiology",
    subject: "Anatomy",
    author: "Anna ChruŚCik, Kate Kauter, Louisa Windus and Eliza Whiteside",
    chapters: 12,
    difficulty: "Intermediate",
    pdfUrl: "/pdfs/book1.pdf",
    chapterDetails: [
      {
        id: 1,
        title: "Levels of Organisation, Homeostasis and Nomenclature",
        estimatedTime: 40,
        difficulty: "Easy",
        pageRanges: { start: 11, end: 37 },
        sections: [
          {
            id: "1.1",
            title: "Overview of Anatomy and Physiology",
            estimatedTime: 10,
            pageRanges: { start: 12, end: 15 },
          },
          {
            id: "1.2",
            title: "Structural Organisation of the Human Body",
            estimatedTime: 10,
            pageRanges: { start: 16, end: 23 },
          },
          {
            id: "1.3",
            title: "Homeostasis",
            estimatedTime: 10,
            pageRanges: { start: 24, end: 28 },
          },
          {
            id: "1.4",
            title: "Anatomical Terminology",
            estimatedTime: 10,
            pageRanges: { start: 29, end: 37 },
          },
        ],
      },
      {
        id: 2,
        title: "Cells and Reproduction",
        estimatedTime: 90,
        difficulty: "Intermediate",
        pageRanges: { start: 38, end: 145 },
        sections: [
          {
            id: "2.1",
            title: "Synthesis of Biological Macromolecules",
            estimatedTime: 10,
            pageRanges: { start: 39, end: 41 },
          },
          {
            id: "2.2",
            title: "Carbohydrates",
            estimatedTime: 10,
            pageRanges: { start: 42, end: 55 },
          },
          {
            id: "2.3",
            title: "Lipids",
            estimatedTime: 10,
            pageRanges: { start: 56, end: 65 },
          },
          {
            id: "2.4",
            title: "Protein",
            estimatedTime: 10,
            pageRanges: { start: 66, end: 78 },
          },
          {
            id: "2.5",
            title: "Nucleic Acid",
            estimatedTime: 10,
            pageRanges: { start: 78, end: 85 },
          },
          {
            id: "2.6",
            title: "The Cell Membrane",
            estimatedTime: 10,
            pageRanges: { start: 86, end: 100 },
          },
          {
            id: "2.7",
            title: "The Cytoplasm and Cellular Organelles",
            estimatedTime: 10,
            pageRanges: { start: 101, end: 111 },
          },
          {
            id: "2.8",
            title: "The Nucleus and DNA Replication",
            estimatedTime: 10,
            pageRanges: { start: 112, end: 120 },
          },
          {
            id: "2.9",
            title: "Protein Synthesis",
            estimatedTime: 10,
            pageRanges: { start: 121, end: 130 },
          },
          {
            id: "2.10",
            title: "Cell Growth and Division",
            estimatedTime: 5,
            pageRanges: { start: 131, end: 139 },
          },
          {
            id: "2.11",
            title: "Cellular Differentiation",
            estimatedTime: 5,
            pageRanges: { start: 140, end: 145 },
          },
        ],
      },
      {
        id: 3,
        title: "Tissues, Organs, Systems",
        estimatedTime: 60,
        difficulty: "Intermediate",
        pageRanges: { start: 146, end: 192 },
        sections: [
          {
            id: "3.1",
            title: "Types of Tissues",
            estimatedTime: 10,
            pageRanges: { start: 147, end: 154 },
          },
          {
            id: "3.2",
            title: "Epithelial Tissue",
            estimatedTime: 10,
            pageRanges: { start: 155, end: 167 },
          },
          {
            id: "3.3",
            title: "Connective Tissue Supports and Protects",
            estimatedTime: 10,
            pageRanges: { start: 168, end: 178 },
          },
          {
            id: "3.4",
            title: "Muscle Tissue and Motion",
            estimatedTime: 10,
            pageRanges: { start: 179, end: 183 },
          },
          {
            id: "3.5",
            title: "Nervous Tissue Mediates Perception and Response",
            estimatedTime: 10,
            pageRanges: { start: 184, end: 186 },
          },
          {
            id: "3.6",
            title: "Tissue Injury and Ageing",
            estimatedTime: 10,
            pageRanges: { start: 187, end: 192 },
          },
        ],
      },
      {
        id: 4,
        title: "Integumentary System",
        estimatedTime: 15,
        difficulty: "Easy",
        pageRanges: { start: 193, end: 200 },
        sections: [
          {
            id: "4.1",
            title: "Layers of the Skin",
            estimatedTime: 15,
            pageRanges: { start: 194, end: 200 },
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Anatomy & Physiology",
    subject: "Anatomy and Physiology",
    author: "OpenStax",
    chapters: 28,
    difficulty: "Intermediate",
    pdfUrl: "/pdfs/anatomy-physiology-openstax.pdf",
  },
  {
    id: 3,
    title:
      "Osteosarcoma: A Review of Diagnosis, Management, and Treatment Strategies",
    subject: "Oncology",
    author: "David S. Geller, Richard Gorlick",
    chapters: 8,
    difficulty: "Advanced",
    pdfUrl: "/pdfs/osteosarcoma-review.pdf",
  },
  {
    id: 4,
    title: "Basic Cardiac Rhythms-Identification and Response",
    subject: "Cardiology",
    author: "The University of Toledo",
    chapters: 6,
    difficulty: "Intermediate",
    pdfUrl: "/pdfs/basic-cardiac-rhythms.pdf",
  },
  {
    id: 5,
    title: "Oral and Maxillofacial Surgery for the Clinician",
    subject: "Dentistry",
    author: "Krishnamurthy Bonanthaya, Elavenil Panneerselvam",
    chapters: 20,
    difficulty: "Advanced",
    pdfUrl: "/pdfs/oral-maxillofacial-surgery.pdf",
  },
  {
    id: 6,
    title: "Common Skin Conditions Explained",
    subject: "Dermatology",
    author: "Unknown",
    chapters: 10,
    difficulty: "Beginner",
    pdfUrl: "/pdfs/common-skin-conditions.pdf",
  },
];
export const questions_mcq = [
  {
    id: 1,
    question: "What is the main function of the serous membranes?",
    type: "mcq",
    options: [
      "To protect the skin",
      "To line and cover coelomic cavities and organs",
      "To absorb nutrients",
      "To conduct electrical impulses",
    ],
    answer: "To line and cover coelomic cavities and organs",
    concept: `These membranes line the coelomic cavities of
the body, that is, those cavities that do not open to the outside, and they cover the organs located within
those cavities.`,
  },
  {
    id: 2,
    question:
      "During which phase of mitosis do sister chromatids get pulled apart?",
    type: "mcq",
    options: ["Prophase", "Anaphase", "Metaphase", "Telophase"],
    answer: "Anaphase",
    concept: `Anaphase takes place over a few minutes, when the pairs of
sister chromatids are separated from one another, forming individual chromosomes once again. These
chromosomes are pulled to opposite ends of the cell by their kinetochores, as the microtubules shorten.
Each end of the cell receives one partner from each pair of sister chromatids, ensuring that the two new
daughter cells will contain identical genetic material`,
  },
  {
    id: 3,
    question: "What are the primary functions of serous membranes in the body?",
    type: "mcq",
    options: [
      "To line and cover coelomic cavities and organs",
      "To absorb nutrients",
      "To protect the skin",
      "To conduct electrical impulses",
    ],
    answer: "To line and cover coelomic cavities and organs",
    concept: `A serous membrane is an epithelial membrane composed of mesodermally derived epithelium called
the mesothelium that is supported by connective tissue. These membranes line the coelomic cavities of
the body, that is, those cavities that do not open to the outside, and they cover the organs located within those cavities.`,
  },
  {
    id: 4,
    question: "Which nitrogenous base is present in RNA but not in DNA?",
    type: "mcq",
    options: ["Thymine", "Cytosine", "Uracil", "Adenine"],
    answer: "Uracil",
    concept: `Each nucleotide in DNA contains one of four possible nitrogenous
bases: adenine (A), guanine (G) cytosine (C), and thymine (T).`,
  },
  {
    id: 5,
    question: "How do DNA and RNA differ in structure and function?",
    type: "mcq",
    options: [
      "RNA contains uracil while DNA contains thymine",
      "DNA is single-stranded, RNA is double-stranded",
      "Both DNA and RNA contain ribose",
      "DNA is a protein, RNA is a carbohydrate",
    ],
    answer: "RNA contains uracil while DNA contains thymine",
    concept: `DNA carries the cells genetic
blueprint and passes it on from parents to offspring (in the form of chromosomes). It has a double-
helical structure with the two strands running in opposite directions, connected by hydrogen
bonds, and complementary to each other. RNA is a single-stranded polymer composed of linked
nucleotides made up of a pentose sugar (ribose), a nitrogenous base, and a phosphate group`,
  },
  {
    id: 6,
    question: "What is the Central Dogma of molecular biology?",
    type: "mcq",
    options: [
      "RNA -> DNA -> Protein",
      "Protein -> RNA -> DNA",
      "DNA -> RNA -> Protein",
      "DNA -> Protein -> RNA",
    ],
    answer: "DNA -> RNA -> Protein",
    concept: `DNA
dictates the structure of mRNA in a process scientists call transcription, and RNA dictates the protein's
structure in a process scientists call translation. This is the Central Dogma of Life, which holds true for all
organisms; however, exceptions to the rule occur in connection with viral infections.`,
  },
  {
    id: 7,
    question: "Which type of muscle tissue is voluntary and striated?",
    type: "mcq",
    options: [
      "Smooth muscle",
      "Cardiac muscle",
      "Skeletal muscle",
      "Epithelium",
    ],
    answer: "Skeletal muscle",
    concept: `The three types of muscle cells are skeletal, cardiac, and smooth. Their morphologies match their
specific functions in the body. Skeletal muscle is voluntary and responds to conscious stimuli. The
cells are striated and multinucleated appearing as long, unbranched cylinders. Cardiac muscle is
involuntary and found only in the heart. Each cell is striated with a single nucleus and they attach to
one another to form long fibres. Cells are attached to one another at intercalated disks. The cells are
interconnected physically and electrochemically to act as a syncytium. Cardiac muscle cells
contract autonomously and involuntarily. Smooth muscle is involuntary. Each cell is a spindle-
shaped fibre and contains a single nucleus. No striations are evident because the actin and myosin
filaments do not align in the cytoplasm.`,
  },
  {
    id: 8,
    question:
      "What mechanisms are involved in the process of thermoregulation in humans?",
    type: "mcq",
    options: [
      "Sweating and vasodilation",
      "Vasoconstriction and shivering",
      "Both a and b",
      "Neither a nor b",
    ],
    answer: "Both a and b",
    concept: `Thermoregulation is coordinated by the nervous system. The processes of temperature control are
centred in a region of the brain called the hypothalamus.`,
  },
  {
    id: 9,
    question: "Which structure in the body helps to maintain thermoregulation?",
    type: "mcq",
    options: ["Cerebellum", "Hypothalamus", "Medulla Oblongata", "Thalamus"],
    answer: "Hypothalamus",
    concept: `Thermoregulation is coordinated by the nervous system. The processes of temperature control are
centred in a region of the brain called the hypothalamus.`,
  },
  {
    id: 10,
    question:
      "What advantages do adult stem cells have in cell-based therapies compared to embryonic stem cells?",
    type: "mcq",
    options: [
      "Embryonic stem cells have higher potential for rejection",
      "Adult stem cells are more versatile",
      "Adult stem cells cannot differentiate",
      "Embryonic stem cells are safer",
    ],
    answer: "Embryonic stem cells have higher potential for rejection",
    concept: `Because of their capacity to divide and differentiate into specialised cells, stem cells offer a potential
treatment for diseases such as diabetes and heart disease (Figure 2.11.3). Cell-based therapy refers to
treatment in which stem cells induced to differentiate in a growth dish are injected into a patient to repair
damaged or destroyed cells or tissues. Many obstacles must be overcome for the application of cell-based
therapy. Although embryonic stem cells have a nearly unlimited range of differentiation potential, they are
seen as foreign by the patient's immune system and may trigger rejection. Also, the destruction of embryos
to isolate embryonic stem cells raises considerable ethical and legal questions.`,
  },
];

export const questions_essay = [
  {
    id: 1,
    type: "essay",
    question: "What is the main function of the serous membranes?",
    answer:
      "The main function of serous membranes is to line the coelomic cavities of the body and cover the organs located within these cavities.",
    concept: `These membranes line the coelomic cavities of
      the body, that is, those cavities that do not open to the outside, and they cover the organs located within
      those cavities`,
  },
  {
    id: 2,
    type: "essay",
    question:
      "During which phase of mitosis do sister chromatids get pulled apart?",
    answer: "Sister chromatids get pulled apart during Anaphase.",
    concept: `Anaphase takes place over a few minutes, when the pairs of
sister chromatids are separated from one another, forming individual chromosomes once again. These
chromosomes are pulled to opposite ends of the cell by their kinetochores, as the microtubules shorten.
Each end of the cell receives one partner from each pair of sister chromatids, ensuring that the two new
daughter cells will contain identical genetic material`,
  },
  {
    id: 3,
    type: "essay",
    question: "What are the primary functions of serous membranes in the body?",
    answer:
      "Serous membranes primarily function to line coelomic cavities and cover organs within.",
    concept: `A serous membrane is an epithelial membrane composed of mesodermally derived epithelium called
      the mesothelium that is supported by connective tissue. These membranes line the coelomic cavities of
      the body, that is, those cavities that do not open to the outside, and they cover the organs located within those cavities.`,
  },
  {
    id: 4,
    type: "essay",
    question: "Which nitrogenous base is present in RNA but not in DNA?",
    answer: "Uracil is present in RNA but not in DNA.",
    concept: `Each nucleotide in DNA contains one of four possible nitrogenous
bases: adenine (A), guanine (G) cytosine (C), and thymine (T).`,
  },
  {
    id: 5,
    type: "essay",
    question: "How do DNA and RNA differ in structure and function?",
    answer:
      "DNA is double-stranded and carries genetic information, while RNA is single-stranded and helps in protein synthesis.",
    concept: `DNA carries the cells genetic
      blueprint and passes it on from parents to offspring (in the form of chromosomes). It has a double-
      helical structure with the two strands running in opposite directions, connected by hydrogen
      bonds, and complementary to each other. RNA is a single-stranded polymer composed of linked
      nucleotides made up of a pentose sugar (ribose), a nitrogenous base, and a phosphate group`,
  },
  {
    id: 6,
    type: "essay",
    question: "What is the Central Dogma of molecular biology?",
    answer:
      "The Central Dogma of molecular biology states that DNA is transcribed into RNA, which is then translated into proteins.",
    concept: `DNA
      dictates the structure of mRNA in a process scientists call transcription, and RNA dictates the protein’s
      structure in a process scientists call translation. This is the Central Dogma of Life, which holds true for all
      organisms; however, exceptions to the rule occur in connection with viral infections.`,
  },
  {
    id: 7,
    type: "essay",
    question: "Which type of muscle tissue is voluntary and striated?",
    answer:
      "Skeletal muscle is the type of muscle tissue that is voluntary and striated.",
    concept: `The three types of muscle cells are skeletal, cardiac, and smooth. Their morphologies match their
      specific functions in the body. Skeletal muscle is voluntary and responds to conscious stimuli. The
      cells are striated and multinucleated appearing as long, unbranched cylinders. Cardiac muscle is
      involuntary and found only in the heart. Each cell is striated with a single nucleus and they attach to
      one another to form long fibres. Cells are attached to one another at intercalated disks. The cells are
      interconnected physically and electrochemically to act as a syncytium. Cardiac muscle cells
      contract autonomously and involuntarily. Smooth muscle is involuntary. Each cell is a spindle-
      shaped fibre and contains a single nucleus. No striations are evident because the actin and myosin
      filaments do not align in the cytoplasm.`,
  },
  {
    id: 8,
    type: "essay",
    question:
      "What mechanisms are involved in the process of thermoregulation in humans?",
    answer:
      "Thermoregulation in humans is primarily coordinated by the nervous system, especially the hypothalamus.",
    concept: `Thermoregulation is coordinated by the nervous system. The processes of temperature control are
      centred in a region of the brain called the hypothalamus.`,
  },
  {
    id: 9,
    type: "essay",
    question: "Which structure in the body helps to maintain thermoregulation?",
    answer:
      "The hypothalamus is the structure that helps maintain thermoregulation in the body.",
    concept: `Thermoregulation is coordinated by the nervous system. The processes of temperature control are
      centred in a region of the brain called the hypothalamus.`,
  },
  {
    id: 10,
    type: "essay",
    question:
      "What advantages do adult stem cells have in cell-based therapies compared to embryonic stem cells?",
    answer:
      "Adult stem cells are less likely to trigger immune rejection in cell-based therapies, unlike embryonic stem cells.",
    concept: `Because of their capacity to divide and differentiate into specialised cells, stem cells offer a potential
      treatment for diseases such as diabetes and heart disease (Figure 2.11.3). Cell-based therapy refers to
      treatment in which stem cells induced to differentiate in a growth dish are injected into a patient to repair
      damaged or destroyed cells or tissues. Many obstacles must be overcome for the application of cell-based
      therapy. Although embryonic stem cells have a nearly unlimited range of differentiation potential, they are
      seen as foreign by the patient’s immune system and may trigger rejection. Also, the destruction of embryos
      to isolate embryonic stem cells raises considerable ethical and legal questions.`,
  },
];

export const books = [
  {
    id: 1,
    title: "Fundamentals of Anatomy and Physiology",
    subject: "Anatomy",
    author: "Anna ChruŚCik, Kate Kauter, Louisa Windus and Eliza Whiteside",
    chapters: 12,
    difficulty: "Intermediate",
    department: "Science",
    materialType: "Book",
    pdfUrl: "/pdfs/book1.pdf",
    category: "Book",
    course: "Anatomy and Physiology",
  },
  {
    id: 2,
    title: "Anatomy & Physiology",
    subject: "Anatomy and Physiology",
    author: "OpenStax",
    chapters: 28,
    difficulty: "Intermediate",
    department: "Science",
    materialType: "Book",
    pdfUrl: "/pdfs/anatomy-physiology-openstax.pdf",
    category: "Book",
    course: "Anatomy and Physiology",
  },
  {
    id: 3,
    title:
      "Osteosarcoma: A Review of Diagnosis, Management, and Treatment Strategies",
    subject: "Oncology",
    author: "David S. Geller, Richard Gorlick",
    chapters: 8,
    difficulty: "Advanced",
    department: "Science",
    materialType: "Book",
    pdfUrl: "/pdfs/osteosarcoma-review.pdf",
    category: "Book",
    course: "Anatomy and Physiology",
  },
  {
    id: 4,
    title: "Basic Cardiac Rhythms-Identification and Response",
    subject: "Cardiology",
    author: "The University of Toledo",
    chapters: 6,
    difficulty: "Intermediate",
    department: "Science",
    materialType: "Book",
    pdfUrl: "/pdfs/basic-cardiac-rhythms.pdf",
    category: "Book",
    course: "Anatomy and Physiology",
  },
  {
    id: 5,
    title: "Oral and Maxillofacial Surgery for the Clinician",
    subject: "Dentistry",
    author: "Krishnamurthy Bonanthaya, Elavenil Panneerselvam",
    chapters: 20,
    difficulty: "Advanced",
    department: "Science",
    materialType: "Book",
    pdfUrl: "/pdfs/oral-maxillofacial-surgery.pdf",
    category: "Slides",
    course: "Neurology",
  },
  {
    id: 6,
    title: "Common Skin Conditions Explained",
    subject: "Dermatology",
    author: "Unknown", // The author wasn't provided in the original list
    chapters: 10,
    difficulty: "Beginner",
    department: "Science",
    materialType: "Book",
    pdfUrl: "/pdfs/common-skin-conditions.pdf",
    category: "Slides",
    course: "Anatomy and Physiology",
  },
];

export const chapters = [
  {
    id: 1,
    title: "Levels of Organisation, Homeostasis and Nomenclature",
    estimatedTime: 40,
    difficulty: "Easy",
    pageRanges: { start: 11, end: 37 },
    sections: [
      {
        id: "1.1",
        title: "Overview of Anatomy and Physiology",
        estimatedTime: 10,
        pageRanges: { start: 12, end: 15 },
      },
      {
        id: "1.2",
        title: "Structural Organisation of the Human Body",
        estimatedTime: 10,
        pageRanges: { start: 16, end: 23 },
      },
      {
        id: "1.3",
        title: "Homeostasis",
        estimatedTime: 10,
        pageRanges: { start: 24, end: 28 },
      },
      {
        id: "1.4",
        title: "Anatomical Terminology",
        estimatedTime: 10,
        pageRanges: { start: 29, end: 37 },
      },
    ],
  },
  {
    id: 2,
    title: "Cells and Reproduction",
    estimatedTime: 90,
    difficulty: "Intermediate",
    pageRanges: { start: 38, end: 145 },
    sections: [
      {
        id: "2.1",
        title: "Synthesis of Biological Macromolecules",
        estimatedTime: 10,
        pageRanges: { start: 39, end: 41 },
      },
      {
        id: "2.2",
        title: "Carbohydrates",
        estimatedTime: 10,
        pageRanges: { start: 42, end: 55 },
      },
      {
        id: "2.3",
        title: "Lipids",
        estimatedTime: 10,
        pageRanges: { start: 56, end: 65 },
      },
      {
        id: "2.4",
        title: "Protein",
        estimatedTime: 10,
        pageRanges: { start: 66, end: 78 },
      },
      {
        id: "2.5",
        title: "Nucleic Acid",
        estimatedTime: 10,
        pageRanges: { start: 78, end: 85 },
      },
      {
        id: "2.6",
        title: "The Cell Membrane",
        estimatedTime: 10,
        pageRanges: { start: 86, end: 100 },
      },
      {
        id: "2.7",
        title: "The Cytoplasm and Cellular Organelles",
        estimatedTime: 10,
        pageRanges: { start: 101, end: 111 },
      },
      {
        id: "2.8",
        title: "The Nucleus and DNA Replication",
        estimatedTime: 10,
        pageRanges: { start: 112, end: 120 },
      },
      {
        id: "2.9",
        title: "Protein Synthesis",
        estimatedTime: 10,
        pageRanges: { start: 121, end: 130 },
      },
      {
        id: "2.10",
        title: "Cell Growth and Division",
        estimatedTime: 5,
        pageRanges: { start: 131, end: 139 },
      },
      {
        id: "2.11",
        title: "Cellular Differentiation",
        estimatedTime: 5,
        pageRanges: { start: 140, end: 145 },
      },
    ],
  },
  {
    id: 3,
    title: "Tissues, Organs, Systems",
    estimatedTime: 60,
    difficulty: "Intermediate",
    pageRanges: { start: 146, end: 192 },
    sections: [
      {
        id: "3.1",
        title: "Types of Tissues",
        estimatedTime: 10,
        pageRanges: { start: 147, end: 154 },
      },
      {
        id: "3.2",
        title: "Epithelial Tissue",
        estimatedTime: 10,
        pageRanges: { start: 155, end: 167 },
      },
      {
        id: "3.3",
        title: "Connective Tissue Supports and Protects",
        estimatedTime: 10,
        pageRanges: { start: 168, end: 178 },
      },
      {
        id: "3.4",
        title: "Muscle Tissue and Motion",
        estimatedTime: 10,
        pageRanges: { start: 179, end: 183 },
      },
      {
        id: "3.5",
        title: "Nervous Tissue Mediates Perception and Response",
        estimatedTime: 10,
        pageRanges: { start: 184, end: 186 },
      },
      {
        id: "3.6",
        title: "Tissue Injury and Ageing",
        estimatedTime: 10,
        pageRanges: { start: 187, end: 192 },
      },
    ],
  },
  {
    id: 4,
    title: "Integumentary System",
    estimatedTime: 15,
    difficulty: "Easy",
    pageRanges: { start: 193, end: 200 },
    sections: [
      {
        id: "4.1",
        title: "Layers of the Skin",
        estimatedTime: 15,
        pageRanges: { start: 194, end: 200 },
      },
    ],
  },
];

export const cards = [
  {
    front: "Myocardial Infarction",
    back: "Commonly known as a heart attack, occurs when blood flow to the heart is blocked",
  },
  {
    front: "Pneumothorax",
    back: "A collapsed lung, air collects in the pleural space between the lung and chest wall",
  },
  {
    front: "Appendicitis",
    back: "Inflammation of the appendix, typically requiring surgical removal",
  },
  {
    front: "Parkinson's Disease",
    back: "A progressive nervous system disorder affecting movement",
  },
  {
    front: "Pulmonary Embolism",
    back: "Blockage in one of the pulmonary arteries in the lungs",
  },
  {
    front: "Sepsis",
    back: "Life-threatening condition caused by the body's response to an infection",
  },
  {
    front: "Crohn's Disease",
    back: "Inflammatory bowel disease causing inflammation of the digestive tract",
  },
  {
    front: "Alzheimer's Disease",
    back: "Progressive brain disorder that slowly destroys memory and thinking skills",
  },
  {
    front: "Hypertension",
    back: "High blood pressure, a common condition increasing the risk of heart disease and stroke",
  },
  {
    front: "Diabetes Mellitus",
    back: "Group of diseases that affect how the body uses blood sugar (glucose)",
  },
];

export const patientCasePracticeDetails = {
  name: "Sarah Collins",
  id: "ET92103",
  age: 34,
  gender: "Female",
  bloodType: "O+",
  height: "170 cm",
  weight: "65 kg",
  status: "Follow-up",
  caseScenario:
    "Patient presented with recurring migraines, light sensitivity, and occasional nausea for the past 6 months. Frequency of migraines has increased from once a month to weekly occurrences, significantly impacting daily activities and work performance.",
  testReports: [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      date: "2023-06-10",
      result: "Within normal ranges",
    },
    {
      id: 2,
      name: "Thyroid Function Test",
      date: "2023-06-10",
      result: "TSH: 2.5 mIU/L (Normal)",
    },
    {
      id: 3,
      name: "Vitamin D Level",
      date: "2023-06-10",
      result: "25 ng/mL (Insufficient)",
    },
    {
      id: 4,
      name: "MRI Brain Scan",
      date: "2023-06-15",
      result: "No structural abnormalities detected",
    },
    {
      id: 5,
      name: "Electroencephalogram (EEG)",
      date: "2023-06-20",
      result: "Normal brain wave patterns",
    },
  ],
  conversations: [
    {
      id: 1,
      date: "2023-06-05",
      role: "doctor",
      content:
        "Hi Sarah, I see you're here for headaches today. Can you tell me more about when they started and what you've been experiencing?",
    },
    {
      id: 2,
      date: "2023-06-05",
      role: "patient",
      content:
        "Sure, I've been having these terrible headaches for about two years now. They’re always on one side of my head, and they come with nausea and this awful sensitivity to light. It gets so bad sometimes that I have to just sit in a dark room.",
    },
    {
      id: 3,
      date: "2023-06-05",
      role: "doctor",
      content:
        "That sounds very painful. When did the headaches first start? Was there anything significant going on in your life around that time?",
    },
    {
      id: 4,
      date: "2023-06-05",
      role: "patient",
      content:
        "Well, I first noticed them after I started a new job that was pretty stressful. But back then, they were just occasional. Over the last year or so, they’ve been getting more frequent—about twice a month now.",
    },
    {
      id: 5,
      date: "2023-06-05",
      role: "doctor",
      content:
        "Got it. Are there any specific triggers that you’ve noticed? For example, stress, certain foods, sleep disturbances?",
    },
    {
      id: 6,
      date: "2023-06-05",
      role: "patient",
      content:
        "Yes, stress is a big one, and sometimes if I don’t get enough sleep, it seems to make them worse. I’ve also noticed that if I have a glass of wine, it can sometimes trigger a headache the next day.",
    },
    {
      id: 7,
      date: "2023-06-20",
      role: "doctor",
      content:
        "Understood. So, the headaches are typically on one side, and you mentioned they’re accompanied by nausea and light sensitivity. Do you also experience any changes in vision before the headache starts, like flashing lights or blind spots?",
    },
    {
      id: 8,
      date: "2023-06-20",
      role: "patient",
      content:
        "Yes, sometimes I get blurry vision or see little zigzag lines about 30 minutes before the pain hits.",
    },
    {
      id: 9,
      date: "2023-06-20",
      role: "doctor",
      content:
        "That sounds like you’re experiencing a migraine with aura. Given the duration, frequency, and the symptoms you’ve described, I believe you’re dealing with classic migraines. Have you tried any treatments or medications?",
    },
    {
      id: 10,
      date: "2023-06-20",
      role: "patient",
      content:
        "I’ve tried over-the-counter pain meds like ibuprofen, but they don’t do much. Sometimes they dull the pain a little, but I still feel miserable for hours.",
    },
    {
      id: 11,
      date: "2023-06-20",
      role: "doctor",
      content:
        "Unfortunately, over-the-counter medications often aren't enough for migraines. Based on your symptoms, I'd recommend starting with a prescription migraine medication called a triptan, which can help stop the headache if you take it early enough. We may also want to explore preventive options if your migraines become more frequent.",
    },
    {
      id: 12,
      date: "2023-06-20",
      role: "patient",
      content:
        "That would be great. I just want to stop them from getting worse.",
    },
    {
      id: 13,
      date: "2023-06-20",
      role: "doctor",
      content:
        "In addition to medication, lifestyle changes can also help manage migraines. Since stress is a major trigger for you, stress management techniques like meditation or yoga could make a big difference. I’d also recommend keeping a headache diary to track your triggers, so we can identify if certain foods or activities might be contributing.",
    },
    {
      id: 14,
      date: "2023-06-20",
      role: "patient",
      content:
        "I can definitely try that. I think tracking them would help me understand what’s going on better.",
    },
    {
      id: 15,
      date: "2023-06-20",
      role: "doctor",
      content:
        "Good idea. Let’s also run some blood tests to rule out any other potential causes of your headaches, such as vitamin deficiencies or thyroid issues. We’ll start with a complete blood count and thyroid function tests. If your symptoms become more frequent or change, we might consider imaging, like an MRI, to ensure there are no structural problems.",
    },
    {
      id: 16,
      date: "2023-06-20",
      role: "patient",
      content:
        "That makes sense. I really appreciate your help with this. I just want to get back to feeling normal.",
    },
    {
      id: 17,
      date: "2023-06-20",
      role: "doctor",
      content:
        "Of course, Sarah. I’ll write you a prescription for the triptans, and we’ll schedule a follow-up in a few months to see how you’re responding to the treatment and lifestyle changes. In the meantime, avoid known triggers like alcohol and get plenty of rest.",
    },
  ],
  doctorNotes: [
    {
      id: 1,
      date: "2023-06-05",
      content:
        "Patient reports increased frequency of migraines. Symptoms suggest classic migraine with aura. Ordering blood tests and MRI to rule out secondary causes. Initiating preventive treatment with Topiramate 25mg daily.",
    },
    {
      id: 2,
      date: "2023-06-20",
      content:
        "Test results normal. No structural abnormalities on MRI. Vitamin D insufficient. Patient reports partial improvement with Topiramate. Increasing dosage to 50mg daily. Recommended Vitamin D supplementation.",
    },
    {
      id: 3,
      date: "2023-07-18",
      content:
        "Follow-up appointment scheduled. Will assess efficacy of increased Topiramate dosage and Vitamin D supplementation. Consider alternative preventive medications if no significant improvement.",
    },
  ],
  diagnoses: [
    {
      id: 1,
      date: "2023-06-20",
      name: "Chronic Migraine without Aura",
      details:
        "Diagnosis based on reported symptoms, frequency of occurrences, and exclusion of secondary causes through normal MRI and blood test results.",
    },
    {
      id: 2,
      date: "2023-06-20",
      name: "Vitamin D Insufficiency",
      details:
        "Blood test reveals Vitamin D levels at 25 ng/mL, which is below the optimal range. May contribute to headache frequency.",
    },
  ],
  treatments: [
    {
      id: 1,
      date: "2023-06-20",
      plan: "Implement pharmaceutical intervention and lifestyle modifications for migraine management.",
      medications: [
        {
          name: "Topiramate",
          dosage: "50mg once daily, increased from 25mg",
        },
        {
          name: "Sumatriptan",
          dosage:
            "50mg as needed for acute migraine attacks, not to exceed 200mg in 24 hours",
        },
        { name: "Vitamin D3", dosage: "2000 IU daily" },
      ],
      lifestyle: [
        "Maintain consistent sleep schedule, aiming for 7-9 hours per night",
        "Practice stress-reduction techniques such as mindfulness meditation for 15 minutes daily",
        "Engage in regular, moderate exercise for at least 30 minutes, 3 times a week",
        "Avoid known dietary triggers, particularly aged cheeses, processed meats, and artificial sweeteners",
        "Limit caffeine intake to no more than 200mg per day",
        "Use a migraine diary to track potential triggers and medication efficacy",
      ],
    },
  ],
};

export const courseData = [
  {
    id: 1,
    courseName: "Anatomy and Physiology",
    type: "Medical Science",
    condition: "current",
    totalStudents: 120,
    href: "/teacher/course-details/1",
    section: "A",
    instructor: "Dr. Sarah Thompson",
  },
  {
    id: 2,
    courseName: "Biochemistry",
    type: "Medical Science",
    condition: "previous",
    totalStudents: 95,
    href: "/teacher/course-details/2",
    section: "B",
    instructor: "Dr. Michael Green",
  },
  {
    id: 3,
    courseName: "Pharmacology",
    type: "Pharmacology",
    condition: "current",
    totalStudents: 80,
    href: "/teacher/course-details/3",
    section: "C",
    instructor: "Dr. Emily Williams",
  },
  {
    id: 4,
    courseName: "Microbiology",
    type: "Medical Science",
    condition: "current",
    totalStudents: 110,
    href: "/teacher/course-details/4",
    section: "D",
    instructor: "Dr. Robert Carter",
  },
  {
    id: 5,
    courseName: "Pathology",
    type: "Medical Science",
    condition: "previous",
    totalStudents: 140,
    href: "/teacher/course-details/5",
    section: "E",
    instructor: "Dr. Jessica Adams",
  },
  {
    id: 6,
    courseName: "Surgery Basics",
    type: "Surgical Skills",
    condition: "current",
    totalStudents: 90,
    href: "/teacher/course-details/6",
    section: "F",
    instructor: "Dr. Richard White",
  },
  {
    id: 7,
    courseName: "Community Medicine",
    type: "Public Health",
    condition: "current",
    totalStudents: 100,
    href: "/teacher/course-details/7",
    section: "G",
    instructor: "Dr. Rachel Johnson",
  },
  {
    id: 8,
    courseName: "Forensic Medicine",
    type: "Forensic Science",
    condition: "previous",
    totalStudents: 85,
    href: "/teacher/course-details/8",
    section: "H",
    instructor: "Dr. David Brown",
  },
  {
    id: 9,
    courseName: "Obstetrics and Gynecology",
    type: "Medical Science",
    condition: "current",
    totalStudents: 125,
    href: "/teacher/course-details/9",
    section: "I",
    instructor: "Dr. Laura Miller",
  },
  {
    id: 10,
    courseName: "Pediatrics",
    type: "Medical Science",
    condition: "current",
    totalStudents: 130,
    href: "/teacher/course-details/10",
    section: "J",
    instructor: "Dr. Steven Peterson",
  },
  {
    id: 11,
    courseName: "Orthopedics",
    type: "Surgical Skills",
    condition: "previous",
    totalStudents: 75,
    href: "/teacher/course-details/11",
    section: "K",
    instructor: "Dr. Anthony Moore",
  },
  {
    id: 12,
    courseName: "Ophthalmology",
    type: "Medical Science",
    condition: "current",
    totalStudents: 90,
    href: "/teacher/course-details/12",
    section: "L",
    instructor: "Dr. Melissa Turner",
  },
];

export const questionBankAssignmentQuestions = [
  {
    id: 1,
    question:
      "Which type of tissue provides support and connects other tissues?",
    options: [
      "Epithelial Tissue",
      "Connective Tissue",
      "Muscle Tissue",
      "Nervous Tissue",
    ],
    correct_answer: "Connective Tissue",
    solution:
      "Connective tissues are specialized to support and connect other tissues and organs in the body.",
    type: "mcq",
  },
  {
    id: 2,
    question:
      "What type of stem cells have the potential to differentiate into any type of cell in the body?",
    options: [
      "Adult Stem Cells",
      "Embryonic Stem Cells",
      "Induced Pluripotent Stem Cells",
      "Multipotent Stem Cells",
    ],
    correct_answer: "Embryonic Stem Cells",
    solution:
      "Embryonic stem cells are pluripotent and have the potential to differentiate into any type of cell in the body.",
    type: "mcq",
  },
  {
    id: 3,
    question:
      "Which of the following is responsible for regulating the cell cycle by providing 'stop' and 'go' signals?",
    options: [
      "Cyclins",
      "Tumor Suppressor Genes",
      "Proto-Oncogenes",
      "All of the above",
    ],
    correct_answer: "All of the above",
    solution:
      "Cyclins, proto-oncogenes, and tumor suppressor genes play critical roles in the regulation of the cell cycle.",
    type: "mcq",
  },
  {
    id: 4,
    question: "What is the main function of the mitochondria?",
    options: [
      "Protein Synthesis",
      "Energy Production",
      "DNA Replication",
      "Detoxification",
    ],
    correct_answer: "Energy Production",
    solution: "Mitochondria produce cellular energy in the form of ATP.",
    type: "mcq",
  },
  {
    id: 5,
    question:
      "Which phase of the cell cycle is characterized by DNA replication?",
    options: ["G1 Phase", "S Phase", "G2 Phase", "M Phase"],
    correct_answer: "S Phase",
    solution:
      "During the S phase of the cell cycle, DNA replication occurs in preparation for cell division.",
    type: "mcq",
  },
  {
    id: 6,
    question:
      "What type of feedback loop is most common in maintaining homeostasis in the body?",
    options: [
      "Positive Feedback",
      "Negative Feedback",
      "Neutral Feedback",
      "None of the above",
    ],
    correct_answer: "Negative Feedback",
    solution:
      "Negative feedback loops are most common in homeostasis, where they help return physiological parameters to their set points.",
    type: "mcq",
  },
  {
    id: 7,
    question:
      "Which of the following processes occurs during gas exchange in the lungs?",
    options: [
      "Oxygen is absorbed, and carbon dioxide is released",
      "Carbon dioxide is absorbed, and oxygen is released",
      "Oxygen and carbon dioxide are both absorbed",
      "None of the above",
    ],
    correct_answer: "Oxygen is absorbed, and carbon dioxide is released",
    solution:
      "During gas exchange in the lungs, oxygen is absorbed into the bloodstream, and carbon dioxide is released from the blood into the lungs.",
    type: "mcq",
  },
  {
    id: 8,
    question:
      "Which type of muscle tissue is responsible for involuntary movements of internal organs?",
    options: [
      "Skeletal Muscle",
      "Cardiac Muscle",
      "Smooth Muscle",
      "None of the above",
    ],
    correct_answer: "Smooth Muscle",
    solution:
      "Smooth muscle tissue controls involuntary movements in internal organs such as the digestive and reproductive systems.",
    type: "mcq",
  },
  {
    id: 9,
    question:
      "Which of the following structures controls protein synthesis in the cell?",
    options: [
      "Ribosomes",
      "Golgi Apparatus",
      "Mitochondria",
      "Endoplasmic Reticulum",
    ],
    correct_answer: "Ribosomes",
    solution:
      "Ribosomes are responsible for synthesizing proteins by translating mRNA into amino acid sequences.",
    type: "mcq",
  },
  {
    id: 10,
    question:
      "What is the smallest independently functioning unit of a living organism?",
    options: ["Cell", "Tissue", "Organ", "Molecule"],
    correct_answer: "Cell",
    solution:
      "A cell is the smallest independently functioning unit of a living organism.",
    type: "mcq",
  },
];

export const adaptiveLearningQuestions = [
  {
    id: 1,
    question:
      "Explain the relationship between anatomy and physiology, and why are they often studied together?",
    type: "essay",
    expected_answer:
      "Anatomy is the study of body structures, while physiology is the study of the function of these structures. They are often studied together because the function of a body part is closely related to its structure.",
  },
  {
    id: 2,
    question:
      "List and describe the six levels of structural organization in the human body.",
    type: "essay",
    expected_answer:
      "The six levels of organization are: 1. Chemical level (atoms, molecules), 2. Cellular level (cells), 3. Tissue level (tissues), 4. Organ level (organs), 5. Organ system level (organ systems), 6. Organism level (the whole body).",
  },
  {
    id: 3,
    question:
      "Differentiate between negative and positive feedback mechanisms in maintaining homeostasis. Provide an example for each.",
    type: "essay",
    expected_answer:
      "Negative feedback reverses changes in physiological conditions to maintain homeostasis, such as temperature regulation. Positive feedback amplifies changes, such as contractions during childbirth.",
  },
  {
    id: 4,
    question:
      "What is homeostasis, and why is it important for human survival?",
    type: "essay",
    expected_answer:
      "Homeostasis is the maintenance of a stable internal environment within the body. It is essential for survival because it keeps physiological parameters, like temperature and pH, within a range that allows cells and systems to function properly.",
  },
  {
    id: 5,
    question:
      "Which organ systems are involved in maintaining homeostasis in the human body?",
    type: "mcq",
    options: [
      "Nervous system",
      "Endocrine system",
      "Muscular system",
      "All of the above",
    ],
    correct_answer: "All of the above",
    solution:
      "The nervous and endocrine systems play key roles in regulating homeostasis, and the muscular system also aids in maintaining temperature homeostasis.",
  },
  {
    id: 6,
    question:
      "How do dehydration synthesis and hydrolysis reactions differ in biological macromolecules?",
    type: "essay",
    expected_answer:
      "Dehydration synthesis involves removing a water molecule to join two monomers, while hydrolysis involves adding a water molecule to break a polymer into monomers.",
  },
  {
    id: 7,
    question:
      "What role do proteins play in the human body? Provide examples of different types of proteins and their functions.",
    type: "essay",
    expected_answer:
      "Proteins are essential for structure, function, and regulation of tissues and organs. Examples include enzymes (speed up reactions), structural proteins (keratin), and transport proteins (hemoglobin).",
  },
  {
    id: 8,
    question: "Describe the process of gas exchange in the respiratory system.",
    type: "essay",
    expected_answer:
      "Gas exchange occurs in the alveoli of the lungs, where oxygen is absorbed into the bloodstream and carbon dioxide is released from the blood into the alveoli to be exhaled.",
  },
  {
    id: 9,
    question:
      "Identify and explain the functions of two types of epithelial tissues.",
    type: "essay",
    expected_answer:
      "1. Simple squamous epithelium: allows for diffusion and filtration, found in air sacs of lungs. 2. Stratified squamous epithelium: protects against abrasion, found in the skin.",
  },
  {
    id: 10,
    question:
      "How do hormones regulate homeostasis in the human body? Provide an example of a hormone involved in this process.",
    type: "essay",
    expected_answer:
      "Hormones regulate homeostasis by signaling organs to adjust their activity. For example, insulin helps regulate blood sugar levels by signaling cells to absorb glucose.",
  },
];

export const applicationBasedQuestions = [
  {
    id: 1,
    question:
      "Describe a real-world example where negative feedback is crucial for maintaining homeostasis in the human body.",
    expected_answer:
      "Negative feedback regulates body temperature by triggering sweating when overheated or shivering when cold, restoring homeostasis.",
    type: "essay",
  },
  {
    id: 2,
    question:
      "In what situations would the breakdown of homeostasis, such as in cancer, cause abnormal cell division, and how could it be controlled?",
    expected_answer:
      "Disruption of homeostasis in the regulation of the cell cycle, caused by malfunctioning tumor suppressor genes, leads to uncontrollable cell division, which can be managed through targeted cancer therapies like radiation and chemotherapy.",
    type: "essay",
  },
  {
    id: 3,
    question:
      "Apply the principles of protein denaturation to explain how cooking an egg leads to irreversible changes in its structure.",
    expected_answer:
      "Heat causes denaturation of proteins in the egg white, disrupting its secondary and tertiary structures and leading to a solidified, irreversible state.",
    type: "essay",
  },
  {
    id: 4,
    question:
      "Given the role of phospholipids in cell membranes, explain why drugs that disrupt phospholipid bilayers can be used to target cancer cells.",
    expected_answer:
      "Drugs disrupting phospholipid bilayers can cause cancer cell membranes to break down, leading to cell death, as cancer cells rely heavily on membrane integrity for proliferation.",
    type: "essay",
  },
  {
    id: 5,
    question:
      "How would you use the concept of stem cells to design a therapy for repairing heart tissue after a heart attack?",
    expected_answer:
      "Induced pluripotent stem cells could be programmed to differentiate into cardiac cells and then injected into damaged heart tissue to promote repair.",
    type: "essay",
  },
  {
    id: 6,
    question:
      "If you were tasked with developing a drug that affects neurotransmitter release, what role would the synapse and neurotransmitter reuptake play in your strategy?",
    expected_answer:
      "The drug could inhibit neurotransmitter reuptake to increase the availability of neurotransmitters in the synapse, enhancing neural signal transmission in cases of depression.",
    type: "essay",
  },
  {
    id: 7,
    question:
      "Explain how a malfunction in mitochondria could contribute to muscle fatigue in athletes.",
    expected_answer:
      "Mitochondrial malfunction would result in reduced ATP production, limiting energy supply to muscle cells, leading to early fatigue during physical exertion.",
    type: "essay",
  },
  {
    id: 8,
    question:
      "How would an understanding of epithelial tissue regeneration help in designing skin grafts for burn patients?",
    expected_answer:
      "Knowledge of epithelial tissue's ability to regenerate from stem cells could guide the use of tissue engineering techniques to create skin grafts that promote healing.",
    type: "essay",
  },
  {
    id: 9,
    question:
      "Describe how understanding the cell cycle could aid in the development of new treatments for cancer.",
    expected_answer:
      "By targeting the specific checkpoints in the cell cycle where cancer cells evade normal regulation, new therapies could halt abnormal cell division.",
    type: "essay",
  },
  {
    id: 10,
    question:
      "In the context of lipid metabolism, how could a diet high in unsaturated fats benefit cardiovascular health?",
    expected_answer:
      "Unsaturated fats help maintain healthy cholesterol levels, reduce the risk of arterial plaque buildup, and thus lower the risk of heart disease.",
    type: "essay",
  },
];

export const writingAssignmentQuestions = [
  {
    id: 1,
    question:
      "Explain how the body regulates blood pressure through the interaction of the nervous and endocrine systems.",
    expected_answer:
      "The nervous system detects changes in blood pressure through baroreceptors, and the endocrine system releases hormones such as adrenaline and aldosterone to regulate blood pressure.",
    type: "essay",
  },
  {
    id: 2,
    question:
      "Discuss the role of inflammation in tissue injury and the process of tissue repair.",
    expected_answer:
      "Inflammation is the body’s immediate response to injury, causing redness, heat, swelling, and pain. It initiates repair by recruiting immune cells and fibroblasts to regenerate damaged tissue.",
    type: "essay",
  },
  {
    id: 3,
    question:
      "Describe the stages of the cell cycle and explain how the cycle is regulated to prevent cancerous growth.",
    expected_answer:
      "The cell cycle includes interphase (G1, S, G2) and mitosis. It is regulated by proteins like cyclins and tumor suppressor genes, which ensure that cells only divide when appropriate. Malfunctions in this regulation can lead to cancer.",
    type: "essay",
  },
  {
    id: 4,
    question:
      "Explain how protein folding affects the function of enzymes and how misfolding can lead to diseases.",
    expected_answer:
      "Proteins must fold correctly to function. Misfolding disrupts their active sites, leading to malfunction. Diseases like Alzheimer's result from the accumulation of misfolded proteins.",
    type: "essay",
  },
  {
    id: 5,
    question:
      "Analyze the structural differences between skeletal, cardiac, and smooth muscle tissues and how these differences relate to their functions.",
    expected_answer:
      "Skeletal muscle is voluntary, striated, and multinucleated for fast contractions. Cardiac muscle is involuntary and striated, with intercalated disks for synchronous heartbeats. Smooth muscle is involuntary and non-striated, ideal for slow, sustained contractions in organs.",
    type: "essay",
  },
  {
    id: 6,
    question:
      "Discuss the process of apoptosis and its significance in maintaining healthy tissue.",
    expected_answer:
      "Apoptosis is programmed cell death that removes damaged or unnecessary cells without causing inflammation. It is crucial in development, tissue maintenance, and preventing cancer.",
    type: "essay",
  },
  {
    id: 7,
    question:
      "Evaluate the importance of stem cells in regenerative medicine and discuss the ethical concerns surrounding their use.",
    expected_answer:
      "Stem cells can differentiate into various cell types, making them valuable for repairing damaged tissues. However, ethical concerns arise, especially regarding the use of embryonic stem cells, which involve the destruction of embryos.",
    type: "essay",
  },
  {
    id: 8,
    question:
      "Compare and contrast the roles of DNA and RNA in protein synthesis.",
    expected_answer:
      "DNA stores genetic information in the nucleus, while RNA transcribes this information and translates it into proteins in the cytoplasm. DNA remains in the nucleus, whereas RNA leaves to carry out its function.",
    type: "essay",
  },
  {
    id: 9,
    question:
      "Describe the process of thermoregulation in humans and explain how it helps maintain homeostasis.",
    expected_answer:
      "Thermoregulation involves vasodilation and sweating to release heat and vasoconstriction and shivering to conserve heat. The hypothalamus controls these mechanisms to maintain a stable internal temperature.",
    type: "essay",
  },
  {
    id: 10,
    question:
      "Explain how cancer treatments target rapidly dividing cells and discuss the side effects of these treatments.",
    expected_answer:
      "Cancer treatments like chemotherapy and radiation target rapidly dividing cells, but they also affect healthy cells like hair and gut lining cells, leading to side effects such as hair loss and nausea.",
    type: "essay",
  },
];

export const scenarioBasedQuestions = [
  {
    id: 1,
    question:
      "A patient is diagnosed with a condition that causes their cells to replicate uncontrollably. Based on what you know about the cell cycle, explain the role of proto-oncogenes and tumor suppressor genes in this condition.",
    expected_answer:
      "Proto-oncogenes regulate cell division by signaling the start of the cycle, while tumor suppressor genes stop abnormal cell growth. A malfunction in either can lead to unchecked cell division, contributing to cancer.",
    type: "essay",
  },
  {
    id: 2,
    question:
      "A child presents with severe fatigue and low energy levels. Blood tests reveal a deficiency in ATP production. How might a malfunction in the mitochondria contribute to this condition?",
    expected_answer:
      "Mitochondria are responsible for producing ATP, the cell's energy currency. A malfunction in the mitochondria would lead to decreased ATP production, reducing the energy available to the child, resulting in fatigue.",
    type: "essay",
  },
  {
    id: 3,
    question:
      "During childbirth, the patient experiences strong contractions of the uterus. Explain how positive feedback plays a role in the birthing process.",
    expected_answer:
      "Positive feedback intensifies uterine contractions during childbirth. Stretch receptors in the cervix trigger the release of oxytocin, which strengthens contractions, pushing the baby down further and continuing the cycle until birth.",
    type: "essay",
  },
  {
    id: 4,
    question:
      "A patient has suffered a severe burn. Explain how the understanding of epithelial tissue regeneration can aid in developing treatments for burn victims.",
    expected_answer:
      "Epithelial tissue has a capacity for regeneration. Understanding this process can help guide the use of tissue engineering techniques, such as skin grafts, to promote healing in burn patients.",
    type: "essay",
  },
  {
    id: 5,
    question:
      "A patient with diabetes is struggling with poor wound healing. How might the disruption of homeostasis affect the healing process?",
    expected_answer:
      "Diabetes can disrupt the normal processes of inflammation and tissue repair by affecting blood flow and the immune response, delaying wound healing.",
    type: "essay",
  },
  {
    id: 6,
    question:
      "You are designing a drug to treat cardiovascular disease. How might this drug target the phospholipid bilayer of cells to prevent plaque formation in arteries?",
    expected_answer:
      "By targeting the phospholipid bilayer, the drug could reduce cholesterol accumulation in artery walls, preventing plaque formation and improving blood flow.",
    type: "essay",
  },
  {
    id: 7,
    question:
      "A patient with heart disease is prescribed a medication that affects the sodium-potassium pump. Explain the significance of this pump in maintaining heart function.",
    expected_answer:
      "The sodium-potassium pump regulates ion concentrations in cardiac cells, maintaining the electrical activity necessary for heartbeats. Disruptions in this pump can lead to arrhythmias and impaired heart function.",
    type: "essay",
  },
  {
    id: 8,
    question:
      "A patient with multiple sclerosis shows signs of damage to the myelin sheath surrounding their nerves. Explain how this could affect their nervous system function.",
    expected_answer:
      "The myelin sheath insulates nerve fibers, speeding up the transmission of nerve impulses. Damage to it slows communication between neurons, leading to muscle weakness and coordination problems.",
    type: "essay",
  },
  {
    id: 9,
    question:
      "A patient is recovering from a penetrating wound. Describe the positive feedback mechanism involved in blood clotting.",
    expected_answer:
      "In response to the wound, the body initiates a positive feedback loop where each step in the clotting process releases substances that accelerate clot formation, sealing the wound to prevent blood loss.",
    type: "essay",
  },
  {
    id: 10,
    question:
      "A patient is diagnosed with osteoporosis. Explain how the balance between osteoblasts and osteoclasts is disrupted in this condition.",
    expected_answer:
      "Osteoporosis occurs when osteoclasts (which break down bone) outpace osteoblasts (which build bone), leading to reduced bone density and increased fracture risk.",
    type: "essay",
  },
];
