export const mockExam = {
  id: "1",
  title: "Anatomy and Physiology Midterm",
  totalStudents: 120,
  totalMarks: 100,
  section: "A",
  instructor: "Dr. Sarah Thompson",
};

export const mockSubmissions = [
  {
    id: "1",
    studentId: "001",
    studentName: "John Doe",
    rollNo: "A001",
    submittedAt: "2023-10-15T09:30:00Z",
  },
  {
    id: "2",
    studentId: "002",
    studentName: "Jane Smith",
    rollNo: "A002",
    submittedAt: "2023-10-15T10:15:00Z",
  },
  {
    id: "3",
    studentId: "003",
    studentName: "Mike Johnson",
    rollNo: "A003",
    submittedAt: "2023-10-15T08:45:00Z",
  },
];

export const mockAnswers = {
  "001": [
    {
      questionId: "1",
      question: "What is the primary function of the respiratory system?",
      type: "mcq",
      options: [
        "Gas exchange",
        "Digestion",
        "Blood circulation",
        "Hormone production",
      ],
      studentAnswer: "Gas exchange",
      expectedAnswer: "Gas exchange",
      maxMarks: 5,
    },
    {
      questionId: "2",
      question: "Explain the process of muscle contraction.",
      type: "subjective",
      studentAnswer:
        "Muscle contraction occurs through the sliding filament mechanism where myosin heads attach to actin filaments and pull them inward, shortening the sarcomere.",
      expectedAnswer:
        "Muscle contraction involves the sliding filament theory where myosin heads form cross-bridges with actin filaments. ATP provides energy for the power stroke, pulling actin filaments toward the center of the sarcomere, causing the muscle to contract.",
      maxMarks: 10,
    },
    {
      questionId: "3",
      question: "What is the function of mitochondria in cells?",
      type: "mcq",
      options: [
        "Powerhouse of the cell",
        "Protein synthesis",
        "Lipid metabolism",
        "Detoxification",
      ],
      studentAnswer: "Powerhouse of the cell",
      expectedAnswer: "Powerhouse of the cell",
      maxMarks: 5,
    },
    {
      questionId: "4",
      question: "Describe the process of photosynthesis in plants.",
      type: "subjective",
      studentAnswer:
        "Photosynthesis is a process where plants use sunlight, carbon dioxide, and water to produce glucose and oxygen. It occurs in the chloroplasts of plant cells.",
      expectedAnswer:
        "Photosynthesis occurs in the chloroplasts of plant cells where light energy is converted into chemical energy. Plants use sunlight to convert carbon dioxide and water into glucose and oxygen. The process involves two main stages: the light-dependent reactions and the Calvin cycle.",
      maxMarks: 10,
    },
    {
      questionId: "5",
      question: "What is the role of enzymes in digestion?",
      type: "subjective",
      studentAnswer:
        "Enzymes help break down food into smaller molecules that can be absorbed by the body.",
      expectedAnswer:
        "Enzymes play a critical role in digestion by catalyzing the breakdown of complex food molecules into simpler substances that can be absorbed by the body. Different enzymes act on different types of nutrients, such as carbohydrates, proteins, and fats.",
      maxMarks: 10,
    },
  ],
  "002": [
    {
      questionId: "1",
      question: "What is the primary function of the respiratory system?",
      type: "mcq",
      options: [
        "Gas exchange",
        "Digestion",
        "Blood circulation",
        "Hormone production",
      ],
      studentAnswer: "Blood circulation",
      expectedAnswer: "Gas exchange",
      maxMarks: 5,
    },
    {
      questionId: "2",
      question: "Explain the process of muscle contraction.",
      type: "subjective",
      studentAnswer:
        "Muscles contract when nerve signals tell them to move. The fibers slide past each other using energy from ATP.",
      expectedAnswer:
        "Muscle contraction involves the sliding filament theory where myosin heads form cross-bridges with actin filaments. ATP provides energy for the power stroke, pulling actin filaments toward the center of the sarcomere, causing the muscle to contract.",
      maxMarks: 10,
    },
    {
      questionId: "3",
      question: "What is the function of the nucleus in a cell?",
      type: "mcq",
      options: [
        "Controls cell activities",
        "Produces energy",
        "Digestive center",
        "Helps in transport",
      ],
      studentAnswer: "Controls cell activities",
      expectedAnswer: "Controls cell activities",
      maxMarks: 5,
    },
    {
      questionId: "4",
      question: "How does the circulatory system work?",
      type: "subjective",
      studentAnswer:
        "The circulatory system transports blood through the heart and blood vessels to all parts of the body.",
      expectedAnswer:
        "The circulatory system consists of the heart, blood, and blood vessels. It is responsible for transporting oxygen, nutrients, and hormones to cells and removing waste products like carbon dioxide. The heart pumps blood through the arteries, capillaries, and veins.",
      maxMarks: 10,
    },
    {
      questionId: "5",
      question: "What happens during the process of mitosis?",
      type: "subjective",
      studentAnswer:
        "During mitosis, a cell divides into two identical cells. Each cell gets a copy of the DNA.",
      expectedAnswer:
        "Mitosis is a type of cell division in which a single cell divides to produce two genetically identical daughter cells. The process involves stages such as prophase, metaphase, anaphase, and telophase, followed by cytokinesis.",
      maxMarks: 10,
    },
  ],
  "003": [
    {
      questionId: "1",
      question: "What is the primary function of the respiratory system?",
      type: "mcq",
      options: [
        "Gas exchange",
        "Digestion",
        "Blood circulation",
        "Hormone production",
      ],
      studentAnswer: "Gas exchange",
      expectedAnswer: "Gas exchange",
      maxMarks: 5,
    },
    {
      questionId: "2",
      question: "Explain the process of muscle contraction.",
      type: "subjective",
      studentAnswer:
        "When muscles contract, calcium is released and causes the myosin and actin filaments to interact. The sliding of these filaments causes the muscle to shorten.",
      expectedAnswer:
        "Muscle contraction involves the sliding filament theory where myosin heads form cross-bridges with actin filaments. ATP provides energy for the power stroke, pulling actin filaments toward the center of the sarcomere, causing the muscle to contract.",
      maxMarks: 10,
    },
    {
      questionId: "3",
      question: "What is the main purpose of red blood cells?",
      type: "mcq",
      options: [
        "Transport oxygen",
        "Fight infections",
        "Produce hormones",
        "Protect organs",
      ],
      studentAnswer: "Transport oxygen",
      expectedAnswer: "Transport oxygen",
      maxMarks: 5,
    },
    {
      questionId: "4",
      question: "Discuss the importance of homeostasis in the human body.",
      type: "subjective",

      studentAnswer:
        "Homeostasis is vital for keeping the body's internal environment stable. It helps in regulating temperature and other bodily functions.",
      expectedAnswer:
        "Homeostasis refers to the process by which the body maintains a stable internal environment despite changes in external conditions. It involves regulation of temperature, pH, glucose levels, and other factors to ensure proper functioning of organs and systems.",
      maxMarks: 10,
    },
    {
      questionId: "5",
      question: "What is the role of DNA in genetic inheritance?",
      type: "subjective",
      studentAnswer:
        "DNA carries the genetic instructions that determine traits in an organism.",
      expectedAnswer:
        "DNA (deoxyribonucleic acid) is responsible for carrying genetic information that determines the traits and characteristics of an organism. During reproduction, DNA is passed from parents to offspring, thereby transferring genetic information across generations.",
      maxMarks: 10,
    },
  ],
};
