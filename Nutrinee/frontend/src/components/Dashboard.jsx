import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [weightData, setWeightData] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weightHistory, setWeightHistory] = useState([]);
  const [exerciseHistory, setExerciseHistory] = useState([]);

  const fetchData = async () => {
    try {
      const [userResponse, weightResponse, exerciseResponse, weightHistoryResponse, exerciseHistoryResponse] = await Promise.all([
        axios.get(`/api/userinfo/${userId}`),
        axios.get(`/api/weighthistory/last/${userId}`),
        axios.get(`/api/exercisedata/last/${userId}`),
        axios.get(`/api/weighthistory/${userId}`),
        axios.get(`/api/exercisedata/${userId}`)
      ]);

      setUserData(userResponse.data.data);
      setWeightData(weightResponse.data.data);
      setExerciseData(exerciseResponse.data.data);

      const weightHistoryData = weightHistoryResponse.data.data || [];
      const formattedWeightHistory = weightHistoryData.map(item => ({
        week: `Semana ${item.actual_week}`,
        weight: parseFloat(item.new_weight),
        goal: parseFloat(item.goal),
        actualWeek: item.actual_week
      })).sort((a, b) => a.actualWeek - b.actualWeek);

      const exerciseHistoryData = exerciseHistoryResponse.data.data || [];
      const formattedExerciseHistory = exerciseHistoryData.map(item => ({
        day: `Dia ${item.actual_day}`,
        goalWalk: parseFloat(item.walk),
        performedWalk: parseFloat(item.new_walk),
        actualDay: item.actual_day
      })).sort((a, b) => a.actualDay - b.actualDay);

      setWeightHistory(formattedWeightHistory);
      setExerciseHistory(formattedExerciseHistory);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setWeightHistory([]);
      setExerciseHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userId) {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  const calculateBMI = () => {
    if (userData && weightData) {
      const heightInMeters = userData.height / 100;
      const currentWeight = weightData.new_weight || userData.weight;
      return parseFloat((currentWeight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return 0;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const getWeightProgress = () => {
    if (userData && weightData && userData.goal) {
      const currentWeight = weightData.new_weight || userData.weight;
      const progress = currentWeight - userData.goal;
      return progress > 0 ? `${progress.toFixed(1)} kg acima da meta` : `${Math.abs(progress).toFixed(1)} kg para a meta`;
    }
    return 'N/A';
  };

  const getCurrentWeight = () => {
    if (weightData && weightData.new_weight) {
      return parseFloat(weightData.new_weight.toFixed(1));
    }
    return userData ? parseFloat(userData.weight.toFixed(1)) : 0;
  };

  const getCurrentWalkTime = () => {
    if (exerciseData && exerciseData.new_walk) {
      return exerciseData.new_walk;
    }
    return exerciseData ? exerciseData.walk : 0;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Carregando...</h1>
      </div>
    );
  }

  const bmi = calculateBMI();
  const currentWeight = getCurrentWeight();
  const currentWalkTime = getCurrentWalkTime();

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {userData && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3 className="card-title">Bem-vindo, {userData.name}!</h3>
              <div className="card-value">{currentWeight} kg</div>
              <div className="card-label">Peso Atual</div>
            </div>

            <div className="dashboard-card">
              <h3 className="card-title">Meta de Peso</h3>
              <div className="card-value">{userData.goal} kg</div>
              <div className="card-label">{getWeightProgress()}</div>
            </div>

            <div className="dashboard-card">
              <h3 className="card-title">IMC</h3>
              <div className="card-value">{bmi}</div>
              <div className="card-label">{getBMICategory(bmi)}</div>
            </div>

            <div className="dashboard-card">
              <h3 className="card-title">Altura</h3>
              <div className="card-value">{userData.height} cm</div>
              <div className="card-label">Altura registrada</div>
            </div>

            {exerciseData && (
              <div className="dashboard-card">
                <h3 className="card-title">Exercícios</h3>
                <div className="card-value">Dia {exerciseData.actual_day || exerciseData.day}</div>
                <div className="card-label">Caminhada: {currentWalkTime} min</div>
              </div>
            )}

            {weightData && (
              <div className="dashboard-card">
                <h3 className="card-title">Progresso Semanal</h3>
                <div className="card-value">Semana {weightData.actual_week || weightData.week}</div>
                <div className="card-label">Peso atual: {currentWeight} kg</div>
              </div>
            )}

            {userData.pratice_exercise && userData.pratice_exercise[0] && (
              <div className="dashboard-card">
                <h3 className="card-title">Atividade Física</h3>
                <div className="card-value">{userData.pratice_exercise[0].exercise}</div>
                <div className="card-label">
                  {userData.pratice_exercise[0].pratice === 'sim' ? 'Ativo' : 'Inativo'}
                  {userData.pratice_exercise[0].exercise_time && 
                    ` - ${userData.pratice_exercise[0].exercise_time}`
                  }
                </div>
              </div>
            )}

            {userData.allergy && userData.allergy[0] && (
              <div className="dashboard-card">
                <h3 className="card-title">Alergias</h3>
                <div className="card-value">
                  {userData.allergy[0].has_allergy === 'sim' ? 'Sim' : 'Não'}
                </div>
                <div className="card-label">
                  {userData.allergy[0].has_allergy === 'sim' ? (
                    userData.allergy[0].which && userData.allergy[0].which.length > 0 ? (
                      <div>
                        <strong>Tipos:</strong><br />
                        {userData.allergy[0].which.map((allergyType, index) => (
                          <span key={index}>
                            {allergyType}
                            {index < userData.allergy[0].which.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    ) : (
                      'Tipos não especificados'
                    )
                  ) : (
                    'Nenhuma alergia registrada'
                  )}
                </div>
              </div>
            )}

            <div className="dashboard-card">
              <h3 className="card-title">Tipo Corporal</h3>
              <div className="card-value">{userData.body}</div>
              <div className="card-label">Biotipo registrado</div>
            </div>

            {weightData && (
              <div className="dashboard-card">
                <h3 className="card-title">Progresso Total</h3>
                <div className="card-value">
                  {weightData.new_weight > userData.weight 
                    ? `+${(weightData.new_weight - userData.weight).toFixed(1)} kg`
                    : `-${(userData.weight - weightData.new_weight).toFixed(1)} kg`
                  }
                </div>
                <div className="card-label">
                  {weightData.new_weight > userData.weight 
                    ? 'Ganho desde o início'
                    : 'Perda desde o início'
                  }
                </div>
              </div>
            )}
          </div>

          <div className="charts-section">
            <h2 className="charts-title">Evolução do Progresso</h2>
            
            <div className="charts-grid">
              <div className="chart-card" style={{ backgroundColor: 'white' }}>
                <h3 className="chart-title" style={{ color: '#000' }}>Evolução do Peso</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightHistory} style={{ backgroundColor: 'white' }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${parseFloat(value).toFixed(1)} kg`, 
                        name
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#007bff" 
                      strokeWidth={2} 
                      name="Peso Atual"
                      dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      stroke="#28a745" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      name="Meta de Peso"
                      dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card" style={{ backgroundColor: 'white' }}>
                <h3 className="chart-title" style={{ color: '#000' }}>Tempo de Caminhada</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={exerciseHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: 'Dia', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${parseFloat(value).toFixed(1)} min`, 
                        name
                      ]}
                    />
                    <Legend />
                    
                    <Line 
                      type="monotone"
                      dataKey="goalWalk"
                      stroke="#28a745"
                      strokeWidth={2}
                      name="Meta de Caminhada"
                      dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                    />

                    <Line 
                      type="monotone"
                      dataKey="performedWalk"
                      stroke="#fd7e14"
                      strokeWidth={2}
                      name="Caminhada Realizada"
                      dot={{ fill: '#fd7e14', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card chart-full" style={{ backgroundColor: 'white' }}>
              <h3 className="chart-title" style={{ color: '#000' }}>Evolução do IMC</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart 
                  data={weightHistory.map(item => ({
                    ...item,
                    imc: parseFloat((item.weight / ((userData.height / 100) ** 2)).toFixed(1))
                  }))}
                  style={{ backgroundColor: 'white' }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'IMC', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${parseFloat(value).toFixed(1)}`, 
                      name
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="imc" 
                    stroke="#ffc107" 
                    strokeWidth={2} 
                    name="IMC"
                    dot={{ fill: '#ffc107', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;