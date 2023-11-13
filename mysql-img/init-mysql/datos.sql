
-- Crear la base de datos "prueba"
CREATE DATABASE IF NOT EXISTS prueba;

-- Usar la base de datos "prueba"
USE prueba;

-- Crear la tabla "personas"
CREATE TABLE IF NOT EXISTS personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apellidos VARCHAR(200),
    nombres VARCHAR(200),
    dni INT(8)
);

-- Insertar registros en la tabla "personas"
INSERT INTO personas (apellidos, nombres, dni) VALUES
    ('Monkey D.', 'Luffy', 1111111111),
    ('Ronoroa', 'Zoro', 77777777);