-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE devoc_datatech;

USE devoc_datatech;

CREATE TABLE usuario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(95)  NOT NULL UNIQUE,     
  senha_hash VARCHAR(200) NOT NULL              
);

CREATE TABLE santo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL                     
);

CREATE TABLE quiz (                             
  id INT PRIMARY KEY AUTO_INCREMENT,
  fk_usuario INT NOT NULL,
  FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
  data_inicio  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_fim DATETIME NULL                 
);

CREATE TABLE resposta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fk_quiz INT NOT NULL,
  FOREIGN KEY (fk_quiz) REFERENCES quiz(id),
  fk_santo INT NOT NULL,
  FOREIGN KEY (fk_santo) REFERENCES santo(id),
  numero_pergunta INT,
  acertou TINYINT(1) NOT NULL,
  UNIQUE (fk_quiz, numero_pergunta)
 );

SELECT * FROM usuario;
