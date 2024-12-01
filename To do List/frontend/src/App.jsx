import React, { useEffect, useState } from 'react';
import Card from './components/Card';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [isAddingtarefas, setIsAddingtarefas] = useState(false);
  const [isAddingusuario, setIsAddingusuario] = useState(false);
  const [novotarefas, setNovotarefas] = useState({
    nomesetor: '', descricao: '', prioridade: '', fk_id_usuario: ''
  });
  const [novousuario, setNovousuario] = useState({
    nome: '',
    email: '',
  });

  // versão compacta que serve para todos os status
  const filtroTarefasPorStatus = (status) => tarefas.filter(tarefas => tarefas.status === status);

  // versão para criar uma função para cada status diferente (usei no disponivel para exemplificar)
  function filtrarAFazer() {
    console.log("bb", tarefas)
    return tarefas.filter(tarefas => tarefas.status === 'a fazer');
  }

  function adicionarTarefas() {
    setIsAddingtarefas(true);
  }

  function adicionarUsuario() {
    setIsAddingusuario(true);
  }

  const salvarTarefas = async () => {

    try {
      await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novotarefas),
      });
      setIsAddingtarefas(false);
      setNovotarefas({ nomesetor: '', descricao: '', prioridade: '', status: 'a fazer' });
      buscarTarefas();
      alert("Cadastro concluído com sucesso.")
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const salvarUsuario = async () => {
    console.log(novousuario.email)
    if (novousuario.email == '' || !novousuario.email.includes("@")) {
      alert('Por favor, insira um email válido!');
      return
    } else {
      try {
        await fetch('http://localhost:3000/usuario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novousuario),
        });
        setIsAddingusuario(false);
        setNovousuario({ nome: '', email: '' });
        buscarUsuario();
        alert("Cadastro concluído com sucesso")
      } catch (error) {
        console.error('Erro ao salvar usuario:', error);
      }

    }
  };

  const buscarTarefas = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas');
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const buscarUsuario = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuario');
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error('Erro ao buscar usuario:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
    buscarUsuario();
  }, []);

  return (
    <div>
      <header>
        <h1>Gereciamento de Tarefas</h1>
        <button onClick={adicionarTarefas}>Cadastro de Tarefas</button>
        <button onClick={adicionarUsuario}>Cadastro de Usuários</button>
      </header>
      <div className="dashboard">
        <div className="coluna-dashboard">
          <h2>A fazer</h2>
          {filtrarAFazer().map(tarefas => (
            <Card key={tarefas.id} tarefas={tarefas} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Fazendo</h2>
          {filtroTarefasPorStatus('fazendo').map(tarefas => (
            <Card key={tarefas.id} tarefas={tarefas} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Pronto</h2>
          {filtroTarefasPorStatus('pronto').map(tarefas => (
            <Card key={tarefas.id} tarefas={tarefas} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
      </div>
      {isAddingtarefas && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar tarefas</h2>
            <input
              placeholder="Id do Usuário"
              value={novotarefas.fk_id_usuario}
              onChange={(e) => setNovotarefas({ ...novotarefas, fk_id_usuario: e.target.value })}
            />
            <input
              placeholder="Nome do Setor"
              value={novotarefas.nomesetor}
              onChange={(e) => setNovotarefas({ ...novotarefas, nomesetor: e.target.value })}
            />
            <input
              placeholder="Descrição"
              value={novotarefas.descricao}
              onChange={(e) => setNovotarefas({ ...novotarefas, descricao: e.target.value })}
            />
            <select
              value={novotarefas.prioridade}
              onChange={(e) => setNovotarefas({ ...novotarefas, prioridade: e.target.value })}
            >
              <option value="baixa">baixa</option>
              <option value="média">média</option>
              <option value="alta">alta</option>
            </select>
            <button onClick={salvarTarefas}>Salvar</button>
            <button onClick={() => setIsAddingtarefas(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {isAddingusuario && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar usuario</h2>
            <input
              placeholder="Nome"
              value={novousuario.nome}
              onChange={(e) => setNovousuario({ ...novousuario, nome: e.target.value })}
            />
            <input
              placeholder="Email"
              value={novousuario.email}
              onChange={(e) => setNovousuario({ ...novousuario, email: e.target.value })}
            />
            <button onClick={salvarUsuario}>Salvar</button>
            <button onClick={() => setIsAddingusuario(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;