import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    goal: '',
    pratice_exercise: [{
      pratice: '',
      pratice_time: '',
      exercise: '',
      exercise_time: ''
    }],
    allergy: [{
      has_allergy: '',
      which: []
    }],
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('pratice_exercise')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        pratice_exercise: [{
          ...formData.pratice_exercise[0],
          [field]: value
        }]
      });
    } else if (name.includes('allergy')) {
      if (name === 'allergy.has_allergy') {
        setFormData({
          ...formData,
          allergy: [{
            ...formData.allergy[0],
            has_allergy: value
          }]
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAllergyChange = (allergyType) => {
    const currentAllergies = formData.allergy[0].which;
    let newAllergies;

    if (currentAllergies.includes(allergyType)) {
      newAllergies = currentAllergies.filter(a => a !== allergyType);
    } else {
      newAllergies = [...currentAllergies, allergyType];
    }

    setFormData({
      ...formData,
      allergy: [{
        ...formData.allergy[0],
        which: newAllergies
      }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/userinfo', formData);
      
      if (response.data.success) {
        setMessage('Usuário criado com sucesso!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Cadastro</h2>
        
        {message && (
          <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

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
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
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
              <option value="">Selecione...</option>
              <option value="ectomorfo">Ectomorfo</option>
              <option value="mesomorfo">Mesomorfo</option>
              <option value="endomorfo">Endomorfo</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pratica Exercícios:</label>
            <select
              name="pratice_exercise.pratice"
              value={formData.pratice_exercise[0].pratice}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {formData.pratice_exercise[0].pratice === 'sim' && (
            <div className="form-group">
              <label htmlFor="pratice_time">Tempo de Prática:</label>
              <input
                type="text"
                id="pratice_time"
                name="pratice_exercise.pratice_time"
                value={formData.pratice_exercise[0].pratice_time}
                onChange={handleChange}
                placeholder="Ex: 2 anos"
              />
            </div>
          )}

          <div className="form-group">
            <label>Tipo de Exercício:</label>
            <select
              name="pratice_exercise.exercise"
              value={formData.pratice_exercise[0].exercise}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="musculacao">Musculação</option>
              <option value="cardio">Cardio</option>
              <option value="funcional">Funcional</option>
              <option value="crossfit">CrossFit</option>
              <option value="pilates">Pilates</option>
              <option value="yoga">Yoga</option>
              <option value="natacao">Natação</option>
              <option value="corrida">Corrida</option>
              <option value="ciclismo">Ciclismo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="exercise_time">Tempo de Exercício por Sessão:</label>
            <input
              type="text"
              id="exercise_time"
              name="pratice_exercise.exercise_time"
              value={formData.pratice_exercise[0].exercise_time}
              onChange={handleChange}
              placeholder="Ex: 1 hora"
            />
          </div>

          <div className="form-group">
            <label>Tem Alergia:</label>
            <select
              name="allergy.has_allergy"
              value={formData.allergy[0].has_allergy}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {formData.allergy[0].has_allergy === 'sim' && (
            <div className="form-group">
              <label>Tipos de Alergia:</label>
              <div className="checkbox-group">
                {['lactose', 'gluten', 'amendoim', 'frutos do mar', 'ovos', 'soja', 'nozes'].map(allergy => (
                  <div key={allergy} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={allergy}
                      checked={formData.allergy[0].which.includes(allergy)}
                      onChange={() => handleAllergyChange(allergy)}
                    />
                    <label htmlFor={allergy}>{allergy}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="form-link" style={{ color: '#000' }}>
          <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;