import { useState, useEffect } from 'react';
import axios from 'axios';

const WeightHistory = ({ userId }) => {
  const [weightData, setWeightData] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchWeightHistory = async () => {
    try {
      const response = await axios.get(`/api/weighthistory/last/${userId}`);
      setWeightData(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar histórico de peso:', error);
      setMessage('Erro ao carregar histórico de peso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeightHistory();
  }, [userId]);

  const handleUpdateWeight = async (e) => {
    e.preventDefault();
    if (!newWeight) return;

    setUpdating(true);
    setMessage('');

    try {
      const response = await axios.patch(`/api/weighthistory/${userId}`, {
        new_weight: parseFloat(newWeight)
      });

      if (response.data.success) {
        setMessage('Peso atualizado com sucesso!');
        setNewWeight('');
        
        await fetchWeightHistory();
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao atualizar peso');
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
      <h1 className="content-title">Histórico de Peso</h1>
      
      <div className="content-card">
        {message && (
          <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {weightData && (
          <div>
            <h3 className="card-title">Dados Atuais</h3>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Semana:</strong> {weightData.week}</p>
              <p><strong>Semana Real:</strong> {weightData.actual_week}</p>
              <p><strong>Peso Inicial:</strong> {weightData.weight} kg</p>
              <p><strong>Peso Atual:</strong> {weightData.new_weight || weightData.weight} kg</p>
              <p><strong>Meta:</strong> {weightData.goal} kg</p>
              <p><strong>Diferença para Meta:</strong> {((weightData.new_weight || weightData.weight) - weightData.goal).toFixed(1)} kg</p>
            </div>

            <h3 className="card-title">Atualizar Peso</h3>
            <form onSubmit={handleUpdateWeight} className="update-form">
              <input
                type="number"
                step="0.1"
                placeholder="Novo peso (kg)"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                required
              />
              <button type="submit" disabled={updating}>
                {updating ? 'Atualizando...' : 'Atualizar'}
              </button>
            </form>

            <div className="progress-info">
              <h4>Progresso</h4>
              <p>
                {(weightData.new_weight || weightData.weight) > weightData.weight 
                  ? `Você ganhou ${((weightData.new_weight || weightData.weight) - weightData.weight).toFixed(1)} kg desde o início`
                  : (weightData.new_weight || weightData.weight) < weightData.weight
                  ? `Você perdeu ${(weightData.weight - (weightData.new_weight || weightData.weight)).toFixed(1)} kg desde o início`
                  : 'Sem mudança no peso desde o início'
                }
              </p>
              <p>
                {(weightData.new_weight || weightData.weight) > weightData.goal
                  ? `Você está ${((weightData.new_weight || weightData.weight) - weightData.goal).toFixed(1)} kg acima da sua meta`
                  : (weightData.new_weight || weightData.weight) < weightData.goal
                  ? `Você está ${(weightData.goal - (weightData.new_weight || weightData.weight)).toFixed(1)} kg da sua meta`
                  : 'Você atingiu sua meta de peso!'
                }
              </p>
            </div>

            {weightData.new_weight && weightData.new_weight !== weightData.weight && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#e3f2fd', 
                borderRadius: '10px' 
              }}>
                <h4>Última Atualização</h4>
                <p>
                  <strong>Mudança:</strong> {
                    weightData.new_weight > weightData.weight 
                      ? `+${(weightData.new_weight - weightData.weight).toFixed(1)} kg`
                      : `${(weightData.new_weight - weightData.weight).toFixed(1)} kg`
                  }
                </p>
                <p><strong>Peso anterior:</strong> {weightData.weight} kg</p>
                <p><strong>Peso atual:</strong> {weightData.new_weight} kg</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightHistory;