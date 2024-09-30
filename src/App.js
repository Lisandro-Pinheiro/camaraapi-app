import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState('');
  const [parliamentarians, setParliamentarians] = useState([]);

  useEffect(() => {
    const fetchParties = async () => {
      const response = await axios.get('https://dadosabertos.camara.leg.br/api/v2/partidos');
      setParties(response.data.dados);
    };
    fetchParties();
  }, []);

  const handlePartyChange = async (event) => {
    const partyId = event.target.value;
    setSelectedParty(partyId);

    // Convert partyId to the correct type and find the party
    const party = parties.find(p => String(p.id) === String(partyId));  // Ensures the comparison is type-safe

    if (party) {  // Check if party is not undefined
      try {
        const response = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados?siglaPartido=${party.sigla}`);
        setParliamentarians(response.data.dados);
      } catch (error) {
        console.error('Erro ao buscar parlamentares:', error);
      }
    } else {
      console.error('Partido não encontrado');
      setParliamentarians([]);
    }
  };

  return (
    <div>
      <h1>Parlamentares por Partido</h1>
      <select onChange={handlePartyChange}>
        <option value="">Selecione um partido</option>
        {parties.map(party => (
          <option key={party.id} value={party.id}>{party.nome}</option>
        ))}
      </select>

      {selectedParty && (
        <div>
          <h2>Parlamentares do partido:</h2>
          <ul>
            {parliamentarians.map(parliamentarian => (
              <li key={parliamentarian.id}>
                {parliamentarian.nome} - {parliamentarian.siglaPartido}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
