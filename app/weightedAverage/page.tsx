'use client';
import axios from 'axios';
import { error } from 'console';
import React from 'react';

export default function WeightedAveragePage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function calculateScores() {
    console.log("running calculation...");
    setErrorMessage(null);
    try {
      const csvResponse = await fetch('/salarydata.csv');
      const csvData = await csvResponse.text();
      console.log(csvData);
      const response = await axios.post("/api/calculate", csvData, {
        headers: {
          'Content-Type': 'text/csv'
        }
      });
      alert(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.info('Error during calculation:', JSON.stringify((error as any).response.data, null, 2));
      setErrorMessage((error as any).response.data)
    }
  }

  const createMarkup = () => {
    return { __html: errorMessage || '' }; // Returns an empty string if errorMessage is null
  };

  return (
    <div>
      <h1>Weighted Average Page</h1>
      <p>Upload a PDF to calculate the weighted average of the scores.</p>
      <p>
        Click the button below to calculate the weighted average of the scores.
      </p>
      <button onClick={calculateScores}>Calculate</button>
      {errorMessage && <div dangerouslySetInnerHTML={createMarkup()} />}
    </div>
  );
}
