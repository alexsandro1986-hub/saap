import React, { useState } from 'react';
import { format } from "date-fns";

function Card({ tarefas, buscarTarefas }) {
 
  const [editedTarefa, setEditedTarefa] = useState({ ...tarefas });
  const [isFazendoModalOpen, setIsFazendoModalOpen] = useState(false);
  const [isProntoModalOpen, setIsProntoModalOpen] = useState(false);
  const [usuarioNomezinho, setUsuarioNome] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fazerData, setFazerData] = useState({
    fk_id_usuario: '',
  });

  const alterarSituacao = async (novaSituacao, noModal) => {
    if (novaSituacao === 'fazendo') {
      setIsFazendoModalOpen(true);
    } else if( novaSituacao === 'pronto'){
      setIsProntoModalOpen(true)
    } 
    else {
      await atualizarTarefa(novaSituacao);
    }
  };

  const atualizarTarefa = async (novaSituacao, dadosfazer = null) => {
    const body = { ...tarefas, status: novaSituacao };
    console.log("body", body)
    let date = format(new Date(), "yyyy-MM-dd")

    if (dadosfazer) {
      body.fk_id_usuario = dadosfazer.fk_id_usuario;
      body.datacadastro = date ;
    }
    await fetch(`http://localhost:3000/tarefas/${tarefas.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    buscarTarefas();
  };

  const salvarFazendo = async (statusNovo) => {
    await atualizarTarefa('fazendo', fazerData);
    setIsFazendoModalOpen(false);
    setFazerData({fk_id_usuario: ''});
  };

  const salvarPronto = async () => {
    await atualizarTarefa('pronto', fazerData);
    setIsFazerModalOpen(false);
    setFazerData({fk_id_usuario: ''});
  };

  const editarTarefa = async () => {
    let date = format(new Date(), "yyyy-MM-dd")
    const corpo = {...editedTarefa, datacadastro: date}
   
   
    await fetch(`http://localhost:3000/tarefas/${tarefas.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    });
    buscarTarefas();
    setIsEditModalOpen(false);
  };
  const usuarioNome = async (idUsuario) => {
   let usuario =  await fetch(`http://localhost:3000/tarefas/${idUsuario}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
     
    });
    return usuario
  };

  const deletarTarefa = async () => {
    const confirmed = window.confirm("Tem certeza de que deseja deletar este tarefa?");
    if (confirmed) {
      await fetch(`http://localhost:3000/tarefas/${tarefas.id}`, { method: 'DELETE' });
      buscarTarefas();
    }
  };

  return (
    <div className="card">
      <h3>Setor: {tarefas.nomesetor}</h3>
      <p>Descricao: {tarefas.descricao}</p>
      <p>Prioridade: {tarefas.prioridade}</p>
      {tarefas.status !== 'a fazer' && <p>Vinculado: Usuario {tarefas.fk_id_usuario}</p>}
    
      
      {tarefas.status === 'a fazer' && (
        <>
          <button onClick={() => alterarSituacao('fazendo')}>Fazendo</button>
          <button onClick={() => alterarSituacao('pronto')}>Pronto</button>
        </>
      )}

      {tarefas.status === 'pronto' && (
          <>
        <button onClick={() => alterarSituacao('a fazer', 'noModal')}>A fazer </button>
        <button onClick={() => alterarSituacao('fazendo', 'noModal')}>Fazendo </button>
        </>
      )}

      {tarefas.status === 'fazendo' && (
        <>
        <button onClick={() => alterarSituacao('a fazer','noModal')}>A fazer</button>
        <button onClick={() => alterarSituacao('pronto', 'noModal')}>Pronto</button>
        </>
      )}

      <button onClick={() => setIsEditModalOpen(true)}>Editar</button>
      <button onClick={deletarTarefa}>Deletar</button>

      {isFazendoModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrar Tarefa</h2>
            <input
              placeholder="ID do Usuário"
              value={fazerData.fk_id_usuario}
              onChange={(e) => setFazerData({ ...fazerData, fk_id_usuario: e.target.value })}
            />
            <button onClick={salvarFazendo}>Confirmar</button>
            <button onClick={() => setIsFazendoModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {isProntoModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrar Tarefa</h2>
            <input
              placeholder="ID do Usuário"
              value={fazerData.fk_id_usuario}
              onChange={(e) => setFazerData({ ...fazerData, fk_id_usuario: e.target.value })}
            />
            <button onClick={salvarPronto}>Confirmar</button>
            <button onClick={() => setIsProntoModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar tarefaa</h2>
            <input
              value={editedTarefa.nomesetor}
              onChange={(e) => setEditedTarefa({ ...editedTarefa, nomesetor: e.target.value })}
              placeholder="nomesetor"
            />
            <input
              value={editedTarefa.descricao}
              onChange={(e) => setEditedTarefa({ ...editedTarefa, descricao: e.target.value })}
              placeholder="descricao"
            />
           <select
              value={editedTarefa.prioridade}
              onChange={(e) => setEditedTarefa({ ...editedTarefa, prioridade: e.target.value })}
            >
              <option value="baixa">baixa</option>
              <option value="média">média</option>
              <option value="alta">alta</option>
            </select>
            
            <button onClick={editarTarefa}>Salvar</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
