'use client';
import axios from 'axios';
import React from 'react';

export default function WeightedAveragePage() {
  async function calculateScores() {
    console.log("running calculation...");

    try {
      const response = await axios.get("/api/calculate");
      console.log(response.data);
      alert(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.info('Error during calculation:', error);
      // Handle the error according to your needs
    }
  }

  return (
    <div>
      <h1>Weighted Average Page</h1>
      <p>Upload a PDF to calculate the weighted average of the scores.</p>
      <p>
        Click the button below to calculate the weighted average of the scores.
      </p>
      <button onClick={calculateScores}>Calculate</button>
    </div>
  );
}
