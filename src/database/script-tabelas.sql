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
	nome VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	senha VARCHAR(50) NOT NULL,
	senha_hash VARCHAR(200) NOT NULL,
    CONSTRAINT ck_senha CHECK(senha = senha_hash)
);

SELECT * FROM usuario;
