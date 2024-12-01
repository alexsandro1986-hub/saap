CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    fk_id_usuario INTEGER REFERENCES usuario(id),
    descricao TEXT ,
    nomeSetor VARCHAR(100) ,
    prioridade VARCHAR(10) NOT NULL CHECK (prioridade IN ('baixa', 'média', 'alta')),
    dataCadastro DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'a fazer' CHECK (status IN ('a fazer', 'fazendo', 'pronto'))
);

INSERT INTO usuario (nome, email) VALUES 
('Lucas Oliveira', 'lucas.oliveira@example.com'),
('Fernanda Silva', 'fernanda.silva@example.com'),
('Carlos Gomes', 'carlos.gomes@example.com'),
('Juliana Souza', 'juliana.souza@example.com'),
('Roberto Costa', 'roberto.costa@example.com');

INSERT INTO tarefas (fk_id_usuario, descricao, nomeSetor, prioridade, dataCadastro, status) VALUES
(1, 'Desenvolver projeto de construção de ponte', 'Engenharia Civil', 'alta', '2024-12-01', 'a fazer'),
(2, 'Analisar estruturas de edifícios para reforço', 'Arquitetura', 'média', '2024-12-02', 'fazendo'),
(3, 'Criar novos modelos de turbinas eólicas', 'Energia Renovável', 'alta', '2024-12-03', 'pronto'),
(4, 'Desenvolver estudo sobre resistência de materiais', 'Materiais', 'baixa', '2024-12-04', 'a fazer'),
(5, 'Construir protótipo de dispositivo hidráulico', 'Hidráulica', 'média', '2024-12-05', 'fazendo'),
(1, 'Planejar construção de canal para irrigação', 'Agronomia', 'alta', '2024-12-06', 'a fazer'),
(2, 'Desenvolver tecnologia para monitoramento de estruturas', 'Tecnologia', 'média', '2024-12-07', 'fazendo'),
(3, 'Projetar soluções de automação para fábricas', 'Automação Industrial', 'alta', '2024-12-08', 'pronto'),
(4, 'Estudar resistência de compostos químicos', 'Química', 'baixa', '2024-12-09', 'a fazer'),
(5, 'Desenvolver análise de impacto ambiental de projetos', 'Meio Ambiente', 'média', '2024-12-10', 'fazendo');

