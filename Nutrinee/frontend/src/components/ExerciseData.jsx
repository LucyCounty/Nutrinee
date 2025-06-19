import { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseData = ({ userId }) => {
  const [exerciseData, setExerciseData] = useState(null);
  const [newWalk, setNewWalk] = useState('');
  const [walkRange, setWalkRange] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExerciseData();
  }, [userId]);

  const fetchExerciseData = async () => {
    try {
      const response = await axios.get(`/api/exercisedata/last/${userId}`);
      setExerciseData(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar dados de exercício:', error);
      setMessage('Erro ao carregar dados de exercício');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExercise = async (e) => {
    e.preventDefault();
    if (!newWalk || !walkRange) return;

    const rangeRegex = /^\d{1,2}-\d{1,2}$/;
    if (!rangeRegex.test(walkRange)) {
      setMessage('O intervalo deve estar no formato "início-fim" (ex: 3-8)');
      return;
    }

    setUpdating(true);
    setMessage('');

    try {
      const response = await axios.patch(`/api/exercisedata/${userId}`, {
        new_walk: parseInt(newWalk),
        walk_range: walkRange
      });

      if (response.data.success) {
        setMessage('Dados de exercício atualizados com sucesso!');
        setNewWalk('');
        setWalkRange('');
        fetchExerciseData(); 
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao atualizar dados de exercício');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="content-container">
        <h1 className="content-title">Carregando...</h1>
      </div>
    );
  }

  return (
    <div className="content-container">
      <h1 className="content-title">Dados de Exercício</h1>
      
      <div className="content-card">
        {message && (
          <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {exerciseData && (
          <div>
            <h3 className="card-title">Dados Atuais</h3>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Dia:</strong> {exerciseData.day}</p>
              <p><strong>Dia Real:</strong> {exerciseData.actual_day}</p>
              <p><strong>Caminhada Base:</strong> {exerciseData.walk} minutos</p>
              <p><strong>Nova Caminhada:</strong> {exerciseData.new_walk} minutos</p>
              <p><strong>Intervalo de Caminhada:</strong> {exerciseData.walk_range}</p>
            </div>

            <h3 className="card-title">Atualizar Exercício</h3>
            <form onSubmit={handleUpdateExercise} className="update-form">
              <input
                type="number"
                placeholder="Nova caminhada (minutos)"
                value={newWalk}
                onChange={(e) => setNewWalk(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Intervalo (ex: 3-8)"
                value={walkRange}
                onChange={(e) => setWalkRange(e.target.value)}
                required
              />
              <button type="submit" disabled={updating}>
                {updating ? 'Atualizando...' : 'Atualizar'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
              <h4>Progresso de Exercício</h4>
              <p>
                {exerciseData.new_walk > exerciseData.walk 
                  ? `Você aumentou ${exerciseData.new_walk - exerciseData.walk} minutos de caminhada`
                  : exerciseData.new_walk < exerciseData.walk
                  ? `Você diminuiu ${exerciseData.walk - exerciseData.new_walk} minutos de caminhada`
                  : 'Você manteve o mesmo tempo de caminhada'
                }
              </p>
              <p><strong>Dica:</strong> Tente manter uma rotina regular de exercícios para melhores resultados!</p>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '10px' }}>
              <h4>Como usar o intervalo:</h4>
              <p>O intervalo representa o período de tempo durante o qual você realizou a atividade.</p>
              <p>Exemplo: "3-8" significa das 3h às 8h, ou seja, 5 horas de atividade.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseData;