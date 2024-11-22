import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME = "node-handles-selected-style";

export function isValidUrl(url: string) {
	return /^https?:\/\/\S+$/.test(url);
}



export const playAudio = (text:string) => {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech synthesis not supported");
  }
};

export const stopAudio = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
