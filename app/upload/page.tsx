"use client";
import React, { useState } from "react";
import mammoth from "mammoth";
import { useRouter, useSearchParams } from "next/navigation";

export default function WordToMd() {
  const [file, setFile] = useState<File | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    if (type === "pdf") {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      // Handle the response data (e.g., show success/error message)
      if (data.message) {
        alert(data.message); // Just a simple alert for demonstration
      } else if (data.error) {
        alert(data.error);
      }
      return;
    }

    if (type === "docx") {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      // Handle the response data (e.g., show success/error message)
      if (data.message) {
        alert(data.message); // Just a simple alert for demonstration
      } else if (data.error) {
        alert(data.error);
      }
      return;
    }

    // Convert the DOCX file to HTML using mammoth.js
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const conversionResult = await mammoth.convertToHtml({
        arrayBuffer: arrayBuffer,
      });
      setDocxHtml(conversionResult.value);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>File Upload</h1>

      <form onSubmit={onSubmit}>
        <input type="file" accept=".docx,.pdf" onChange={onFileChange} />
        <button type="submit">Upload and Convert</button>
      </form>

      {docxHtml && (
        <div>
          <h2>Uploaded Document:</h2>
          <div dangerouslySetInnerHTML={{ __html: docxHtml }} />
        </div>
      )}
    </div>
  );
}
