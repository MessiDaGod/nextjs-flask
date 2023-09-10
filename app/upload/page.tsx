'use client'
import React, { useState } from 'react';

export default function WordToMd() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/word_to_md', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>File Upload</h1>

      <form onSubmit={onSubmit}>
        <input type="file" accept=".docx" onChange={onFileChange} />
        <button type="submit">Upload</button>
      </form>

      {response && (
        <div>
          <h2>Server Response:</h2>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};
