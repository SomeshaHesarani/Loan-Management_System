import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch all holidays
  useEffect(() => {
    axios.get('http://localhost:4000/api/holidays')
      .then(response => setHolidays(response.data))
      .catch(error => console.error(error));
  }, []);

  // Add a new holiday
  const addHoliday = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/holidays', {
        date,
        name,
        description,
      });
      setHolidays([...holidays, response.data.holiday]);
      alert('Holiday added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding holiday');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Holiday Management</h1>

      {/* Add Holiday Form */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Add Holiday</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Holiday Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={addHoliday}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Holiday
          </button>
        </div>
      </div>

      {/* Holidays List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Holidays</h2>
        <ul className="list-disc pl-6">
          {holidays.map((holiday) => (
            <li key={holiday._id} className="text-gray-700">
              {new Date(holiday.date).toLocaleDateString()} - {holiday.name} - {holiday.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Holiday;