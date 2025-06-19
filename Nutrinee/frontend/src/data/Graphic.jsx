import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

const WeightGoalChart = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5050/api/weighthistory/${userId}`)
      .then(response => {
        const formattedData = response.data.map(entry => ({
          date: new Date(entry.date).toLocaleDateString('pt-BR'),
          weight: entry.weight,
          goal: entry.goal
        }));
        setData(formattedData);
      })
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Peso Atual" />
        <Line type="monotone" dataKey="goal" stroke="#82ca9d" name="Meta" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightGoalChart;
