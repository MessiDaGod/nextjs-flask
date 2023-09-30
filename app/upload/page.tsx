"use client";
import React, { useState } from "react";
import * as pdfjs from "pdfjs-dist/build/pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `./pdf.worker.js`;

export default function Upload({}) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [ui8intarray, setui8intarray] = useState<Uint8Array | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImportFile(files[0]);
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

    if (!importFile) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);
    const pdfFile = importFile;
    if (!pdfFile) return;
    if (pdfFile.size > 1024 * 1024) {
      alert("File size exceeds 1MB");
      return;
    }
    setImportFile(pdfFile);
    const base64 = await convertToBase64(pdfFile);
    setFileBase64(base64);
    const ui8 = await readFileAsUint8Array(importFile as File);
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
    reader.readAsArrayBuffer(importFile);
  }

  async function onSubmitPdf(e: React.FormEvent) {
    e.preventDefault();

    if (!importFile) {
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
    reader.readAsArrayBuffer(importFile);
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

  return (
    <div>
        <h1>File Upload</h1>
        <form onSubmit={onSubmitJs}>
          <input type="file" accept=".pdf" onChange={onFileChange} />
          <button type="submit" disabled={importFile ? false : true}>
            Convert PDF to Image(s)
          </button>
        </form>
    </div>
  );
}
