-- Cliente
insert into cliente(idCliente, nomeCliente, email, cpf, telefone, dataNascimento, senha) values
(default, 'Caique Vidal', 'caiquevidal@gmail.com', '09574365498', '71987649090', '2003-02-03', '12345678'),
(default, 'João Vitor', 'joaovitor@gmail.com', '12345678901', '71965490001', '2001-05-10', '12345678'),
(default, 'Marcos Vinicius', 'marcosvinicius@gmail.com', '23456789012', '71999998652', '2000-11-25', '12345678'),
(default, 'Albert Duarte', 'albertduarte@gmail.com', '34567890123', '71999990003', '1998-07-14', '12345678'),
(default, 'Marlon Gabriel', 'marlongabriel@gmail.com', '45678901234', '71999623004', '2002-09-08', '12345678'),
(default, 'Eduardo Santos', 'eduardosantos@gmail.com', '56789012345', '71999982105', '1999-03-21', '12345678');

-- Loja
insert into loja (idLoja, nomeVendedor, nomeLoja, email, telefone, cnpj, senha, horarioAbertura, horarioFechamento, dataNascimento)values
(default, 'Ana Paula', 'Frutaria Tropical', 'frutaria.tropical@gmail.com', '71999910001', '12345678000101', '12345678', '07:00:00', '18:00:00', '1985-04-12'),
(default, 'Carlos Eduardo', 'Delícias da Vovó', 'delicias.vovo@gmail.com', '71999910002', '23456789000102', '12345678', '09:00:00', '20:00:00', '1990-08-30'),
(default, 'Fernanda Souza', 'Sabor Caseiro', 'sabor.caseiro@gmail.com', '71999910003', '34567890000103', '12345678', '10:00:00', '15:00:00', '1988-11-18'),
(default, 'Roberto Lima', 'Açougue Bom Corte', 'bomcorte.acougue@gmail.com', '71999910004', '45678901000104', '12345678', '08:00:00', '19:00:00', '1982-06-25'),
(default, 'Juliana Mendes', 'Bolos & Sorrisos', 'bolos.sorrisos@gmail.com', '71999910005', '56789012000105', '12345678', '08:30:00', '17:30:00', '1995-03-10'),
(default, 'Mateus Rocha', 'Verde Vivo', 'verdevivo.hortifruti@gmail.com', '71999910006', '67890123000106', '12345678', '06:00:00', '18:00:00', '1987-01-22'),
(default, 'Patrícia Ferreira', 'Estação da Bebida', 'estacaobebida@gmail.com', '71999910007', '78901234000107', '12345678', '10:00:00', '22:00:00', '1992-09-14'),
(default, 'Tiago Almeida', 'Limpex Distribuidora', 'limpex@gmail.com', '71999910008', '89012345000108', '12345678', '08:00:00', '18:00:00', '1980-12-05');
