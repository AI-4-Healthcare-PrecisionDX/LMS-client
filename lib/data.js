// lib/utils.js
export function generateQuestions(amount, mode, book, chapter) {
  // This is a mock implementation. In a real application, you'd generate questions based on the book and chapter content.
  return Array.from({ length: amount }, (_, i) => ({
    id: i + 1,
    text: `Question ${i + 1} about ${book} ${chapter}?`,
    type: mode === "mix" ? (Math.random() > 0.5 ? "mcq" : "essay") : mode,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "option-1", // Assuming first option is always correct for simplicity
  }));
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

// lib/data.js
export const books = [
  { id: 1, title: "To Kill a Mockingbird" },
  { id: 2, title: "1984" },
  { id: 3, title: "Pride and Prejudice" },
];

export const chapters = {
  1: ["Chapter 1", "Chapter 2", "Chapter 3"],
  2: ["Part 1", "Part 2", "Part 3"],
  3: ["Volume 1", "Volume 2", "Volume 3"],
};

export const chapterContent = {
  "To Kill a Mockingbird": {
    "Chapter 1":
      "Scout Finch lives with her brother Jem and their father Atticus in the sleepy Alabama town of Maycomb...",
    "Chapter 2":
      "September arrives, and Dill leaves Maycomb to return home. Scout goes to school for the first time...",
    "Chapter 3":
      "Scout is frustrated by the slow pace of her education and the strict rules of her new teacher, Miss Caroline...",
  },
  1984: {
    "Part 1":
      "The story begins in London in 1984. Winston Smith, the protagonist, lives in a society where the government, led by Big Brother, controls every aspect of people's lives...",
    "Part 2":
      "Winston and Julia's relationship deepens. They rent a room above Mr. Charrington's shop where they can meet in secret...",
    "Part 3":
      "Winston is taken to the Ministry of Love, where he is interrogated and tortured by O'Brien...",
  },
  "Pride and Prejudice": {
    "Volume 1":
      "The novel opens with Mrs. Bennet trying to persuade Mr. Bennet to visit Mr. Bingley, a rich and eligible bachelor who has arrived in the neighborhood...",
    "Volume 2":
      "Mr. Collins proposes to Elizabeth, but she refuses him. Charlotte Lucas, Elizabeth's close friend, accepts Mr. Collins's proposal...",
    "Volume 3":
      "Elizabeth visits Pemberley with her aunt and uncle Gardiner. She is impressed by the estate and hears good reports of Darcy from his housekeeper...",
  },
};
