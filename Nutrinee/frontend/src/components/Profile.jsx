import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/userinfo/${userId}`);
      const user = response.data.data;
      setUserData(user);
      setFormData({
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        body: user.body
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setMessage('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');

    try {
      const response = await axios.put(`/api/userinfo/${userId}`, formData);
      
      if (response.data.success) {
        setMessage('Perfil atualizado com sucesso!');
        setEditMode(false);
        fetchUserData();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      try {
        const response = await axios.delete(`/api/userinfo/${userId}`);
        
        if (response.data.success) {
          alert('Conta excluída com sucesso!');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        }
      } catch (error) {
        setMessage('Erro ao excluir conta');
      }
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
      <h1 className="content-title">Perfil</h1>
      
      <div className="content-card">
        {message && (
          <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {userData && !editMode && (
          <div>
            <h3 className="card-title">Informações Pessoais</h3>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Nome:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Altura:</strong> {userData.height} cm</p>
              <p><strong>Peso:</strong> {userData.weight} kg</p>
              <p><strong>Meta de Peso:</strong> {userData.goal} kg</p>
              <p><strong>Tipo Corporal:</strong> {userData.body}</p>
              <p><strong>Data de Cadastro:</strong> {new Date(userData.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>

            <h3 className="card-title">Exercícios</h3>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Pratica Exercícios:</strong> {userData.pratice_exercise[0].pratice}</p>
              {userData.pratice_exercise[0].pratice_time && (
                <p><strong>Tempo de Prática:</strong> {userData.pratice_exercise[0].pratice_time}</p>
              )}
              <p><strong>Tipo de Exercício:</strong> {userData.pratice_exercise[0].exercise}</p>
              {userData.pratice_exercise[0].exercise_time && (
                <p><strong>Tempo por Sessão:</strong> {userData.pratice_exercise[0].exercise_time}</p>
              )}
            </div>

            <h3 className="card-title">Alergias</h3>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Tem Alergia:</strong> {userData.allergy[0].has_allergy}</p>
              {userData.allergy[0].has_allergy === 'sim' && (
                <div>
                  {userData.allergy[0].which && userData.allergy[0].which.length > 0 ? (
                    <p>
                      <strong>Tipos:</strong> {userData.allergy[0].which.map((allergyType, index) => (
                        <span key={index}>
                          {allergyType}
                          {index < userData.allergy[0].which.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p><strong>Tipos:</strong> Não especificados</p>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setEditMode(true)} 
                className="btn"
                style={{ flex: 1 }}
              >
                Editar Perfil
              </button>
              <button 
                onClick={handleDelete} 
                className="btn"
                style={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' 
                }}
              >
                Excluir Conta
              </button>
            </div>
          </div>
        )}

        {editMode && (
          <div>
            <h3 className="card-title">Editar Perfil</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nome:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="height">Altura (cm):</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Peso (kg):</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="goal">Meta de Peso (kg):</label>
                <input
                  type="number"
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="body">Tipo Corporal:</label>
                <select
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  required
                >
                  <option value="ectomorfo">Ectomorfo</option>
                  <option value="mesomorfo">Mesomorfo</option>
                  <option value="endomorfo">Endomorfo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn" disabled={updating} style={{ flex: 1 }}>
                  {updating ? 'Atualizando...' : 'Salvar Alterações'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditMode(false)}
                  className="btn"
                  style={{ 
                    flex: 1, 
                    background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)' 
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;