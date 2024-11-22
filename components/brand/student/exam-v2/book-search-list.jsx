"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Search } from "lucide-react";
import Link from "next/link";
import ReadBookBtn from "@/components/brand/exam-v2/read-book-btn";
import { Input } from "@/components/ui/input";

export default function BookSearchList({ books }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="flex flex-col transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <CardHeader className="bg-primary p-4">
              <Book className="w-12 h-12 text-white mb-2" />
              <h2 className="text-xl font-semibold text-white">
                {book.title.slice(0, 40)}
              </h2>
            </CardHeader>

            <CardContent className="flex justify-between items-center p-4">
              <Badge variant="outline" className="mb-2">
                {book.subject}
              </Badge>
              <p className="text-sm text-muted-foreground mb-2">
                {book.chapters} Chapters
              </p>
              <Badge variant="secondary">{book.difficulty}</Badge>
            </CardContent>

            <CardFooter className="flex gap-4 justify-center p-4 pt-0">
              <ReadBookBtn />
              <Link href="/exam-v2/chapter">
                <Button
                  className="w-full transition-all duration-300"
                  variant="outline"
                >
                  Start Prep
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
