DROP DATABASE IF EXISTS reservation_db;
CREATE DATABASE reservation_db;

USE reservation_db;

--create tables

CREATE TABLES tables (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    phone VARCHAR (255) NOT NULL,
    isWaiting BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(id)
    --what is primary key--
);
