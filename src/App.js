
import { motion } from "framer-motion";
import React, { useState } from 'react';
import { FiStar } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { Highlight } from "prism-react-renderer";
import './App.css';

const App = () => {
  const [streamData, setStreamData] = useState('');
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'codellama',
          prompt: 'in python, Write me a function that ouputs the fibonacci sequence'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const reader = response.body.getReader();

      // Fonction récursive pour lire les données au fur et à mesure qu'elles arrivent
      const readStream = async () => {
        const { done, value } = await reader.read();

        if (done) {
          console.log('Fin du flux de données');
          return;
        }

        // Convertir les données ArrayBuffer en chaîne de caractères
        const chunk = new TextDecoder().decode(value);
        const goodResponse = JSON.parse(chunk)

        const formattedResponse = goodResponse.response.replace(/\n/g, '<br />')
        // Afficher les données
        console.log('Données reçues:', goodResponse.response);
        setStreamData(prevData => prevData + formattedResponse)

        // Continuer la lecture
        readStream();
      };

      // Commencer la lecture
      readStream();
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  return (
    <div className="App">
      <h1>Lala</h1>
      <button onClick={fetchData} className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
      Hover me
      </button>
      <div className="w-[98%] p-4 border m-auto mt-2 bg-black text-white text-lg rounded opacity-90">
        <p dangerouslySetInnerHTML={{ __html: streamData }}></p>
      </div>
      
    </div>
  );
}

export default App;