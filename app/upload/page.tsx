"use client";
import React, { useState } from "react";
import mammoth from "mammoth";
import { useSearchParams } from "next/navigation";
import * as pdfjs from 'pdfjs-dist/build/pdf';

// This path might need to be adjusted based on where your Next.js public folder and node_modules are.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';


export default function WordToMd() {
  const [file, setFile] = useState<File | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const type = searchParams?.get("type");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      console.log(files[0])
    }
  };

  async function pdfToImages(pdfData: any) {
    const loadingTask = pdfjs.getDocument({data: pdfData});
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const images = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 1.5; // adjust as needed
      const viewport = page.getViewport({scale});

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      //@ts-ignore
      await page.render({canvasContext: ctx, viewport}).promise;

      images.push(canvas.toDataURL());
    }

    return images;
  }

  // Usage:
  // const images = await pdfToImages(somePdfData);

  async function onSubmitJs(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const pdfData = event.target?.result;
      if (pdfData) {
        const images = await pdfToImages(pdfData);
        // Now, you can handle these images as you wish.
        // Example: displaying them or providing download links as shown in your existing code
        images.forEach((dataUrl, index) => {
          const img = document.createElement('img');
          img.src = dataUrl;
          document.body.appendChild(img);

          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `image_${index}.png`;
          link.textContent = `Download Image ${index}`;
          document.body.appendChild(link);
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // // Handle the response data for both PDF and DOCX types
    // if (data.message) {
    //   alert(data.message);
    // } else if (data.error) {
    //   alert(data.error);
    //   return;
    // }

    if (type === "pdf" && data.images) {
      // Display images and provide download links
      data.images.forEach((base64Image: any, index: any) => {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${base64Image}`;
        document.body.appendChild(img);

        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64Image}`;
        link.download = `image_${index}.png`;
        link.textContent = `Download Image ${index}`;
        document.body.appendChild(link);
      });

      return; // Make sure to return after handling the PDF to prevent the rest of the function from executing
    } else if (type === "docx") {
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
    }
  };

  return (
    <div>
      <h1>File Upload</h1>

      <form onSubmit={onSubmit}>
        <input type="file" accept=".docx,.pdf" onChange={onFileChange} />
        <button type="submit">Convert Python</button>
      </form>
      <form onSubmit={onSubmitJs}>
        <input type="file" accept=".docx,.pdf" onChange={onFileChange} />
        <button type="submit">Convert JS</button>
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
