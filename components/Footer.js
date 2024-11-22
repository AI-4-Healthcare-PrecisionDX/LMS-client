import { Copyright } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left flex gap-1 items-center">
          <Copyright className="h-5 w-5" /> 2024{" "}
          <a
            href="https://diagnotech-ai.com/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            DiagnoTech-Ai
          </a>
        </p>
      </div>
    </footer>
  );
}
