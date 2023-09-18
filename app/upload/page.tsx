"use client";
import React, { useState, useEffect } from "react";
import mammoth from "mammoth";
import { useSearchParams } from "next/navigation";
import * as pdfjs from "pdfjs-dist/build/pdf";
import { Document, Page } from "react-pdf";
import { pdfjs as reactpdf } from "react-pdf";
reactpdf.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DEFAULT_SCALE_DELTA = 1.1;
const TOOLBAR_HEIGHT = 32;
const DEFAULT_ZOOM_SCALE = 1.3;

export default function WordToMd() {
  const [file, setFile] = useState<File | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [ui8intarray, setui8intarray] = useState<Uint8Array | null>(null);
  const [showPDF, setShowPDF] = useState(false);
  const [pdf, setPdf] = useState(null);

  const [zoom, setZoom] = useState(DEFAULT_ZOOM_SCALE);
  const [filename, setfilename] = useState(null);

  const searchParams = useSearchParams();
  const type = searchParams?.get("type");

  // useEffect(() => {
  //   async function fetchApi() {
  //     try {
  //       const response = await fetch('/api/upload');
  //       const data = await response.json();

  //       if (!data.success) {
  //         console.error('Failed to copy PDF Worker:', data.message);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching API route:', error);
  //     }
  //   }

  //   fetchApi();
  // }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      console.log(files[0]);
    }
  };

  async function pdfToImages(pdfData: any) {
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const images = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      //@ts-ignore
      await page.render({ canvasContext: ctx, viewport }).promise;

      images.push(canvas.toDataURL());
    }

    return images;
  }

  function readFileAsUint8Array(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        //@ts-ignore
        const arrayBuffer = event.target.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };

      reader.onerror = (event) => {
        //@ts-ignore
        reject(event.target.error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  async function onSubmitJs(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const pdfFile = file;
    if (!pdfFile) return;
    if (pdfFile.size > 1024 * 1024) {
      alert("File size exceeds 1MB");
      return;
    }
    setFile(pdfFile);
    const base64 = await convertToBase64(pdfFile);
    setFileBase64(base64);
    const ui8 = await readFileAsUint8Array(file as File);
    setui8intarray(ui8);
    await onSubmitPdf(e);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const pdfData = event.target?.result;
      if (pdfData) {
        const images = await pdfToImages(pdfData);
        // Now, you can handle these images as you wish.
        // Example: displaying them or providing download links as shown in your existing code
        images.forEach((dataUrl, index) => {
          const img = document.createElement("img");
          img.src = dataUrl;
          document.body.appendChild(img);

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `image_${index}.png`;
          link.textContent = `Download Image ${index}`;
          document.body.appendChild(link);
          // Simulate a click on the link
          link.click();

          // Remove the link from the document after the download
          document.body.removeChild(link);
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function onSubmitPdf(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const pdfData = event.target?.result;
      if (pdfData) {
        const imagesDataUrls = await pdfToImages(pdfData);
        setImages(imagesDataUrls); // Update the state with the new images
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
        const img = document.createElement("img");
        img.src = `data:image/png;base64,${base64Image}`;
        document.body.appendChild(img);

        const link = document.createElement("a");
        link.href = `data:image/png;base64,${base64Image}`;
        link.download = `image_${index}.png`;
        link.textContent = `Download Image ${index}`;
        document.body.appendChild(link);
        // Simulate a click on the link
        link.click();

        // Remove the link from the document after the download
        document.body.removeChild(link);
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

  function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
    setPdf(pdf);
  }

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  const options = {
    cMapUrl: "cmaps/",
    standardFontDataUrl: "standard_fonts/",
  };

  let width = 500;

  return (
    <>
      <div>
        <h1>File Upload</h1>
        <form onSubmit={onSubmitJs}>
          <input type="file" accept=".pdf" onChange={onFileChange} />
          <button type="submit" disabled={file ? false : true}>
            Convert PDF to Image(s)
          </button>
        </form>

        {fileBase64 && (
          <Document file={fileBase64} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        )}
      </div>
    </>
  );
}
