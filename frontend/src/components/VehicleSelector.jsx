import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const VehicleSelector = ({ onSelect }) => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    loadMakes();
  }, []);

  const loadMakes = async () => {
    const makesCol = collection(db, 'vehicle_makes');
    const snapshot = await getDocs(makesCol);
    setMakes(snapshot.docs.map(doc => doc.data().name));
  };

  const handleMakeChange = async (make) => {
    setSelectedMake(make);
    setSelectedModel('');
    setSelectedYear('');
    
    const modelsCol = collection(db, 'vehicle_models');
    const snapshot = await getDocs(modelsCol);
    setModels(snapshot.docs
      .map(doc => doc.data())
      .filter(model => model.make === make)
      .map(model => model.name)
    );
  };

  const handleModelChange = async (model) => {
    setSelectedModel(model);
    setSelectedYear('');
    
    const yearsCol = collection(db, 'vehicle_years');
    const snapshot = await getDocs(yearsCol);
    setYears(snapshot.docs
      .map(doc => doc.data())
      .filter(year => year.make === selectedMake && year.model === model)
      .map(year => year.year)
    );
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    onSelect({ make: selectedMake, model: selectedModel, year });
  };

  return (
    <div className="vehicle-selector">
      <select 
        value={selectedMake} 
        onChange={(e) => handleMakeChange(e.target.value)}
      >
        <option value="">Select Make</option>
        {makes.map(make => (
          <option key={make} value={make}>{make}</option>
        ))}
      </select>

      <select 
        value={selectedModel}
        onChange={(e) => handleModelChange(e.target.value)}
        disabled={!selectedMake}
      >
        <option value="">Select Model</option>
        {models.map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => handleYearChange(e.target.value)}
        disabled={!selectedModel}
      >
        <option value="">Select Year</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default VehicleSelector; 