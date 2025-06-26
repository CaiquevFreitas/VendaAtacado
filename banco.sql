create database VendaAtacado;
use VendaAtacado;

create table loja(
	idLoja int primary key auto_increment,
    nomeVendedor varchar(255) not null,
    nomeLoja varchar(100) not null,
    logo varchar(1000),
    email varchar(100) not null,
    telefone char(11) not null unique,
	cnpj char(14) not null unique,
    senha char(8) not null,
    horarioAbertura time not null,
    horarioFechamento time not null,
    dataNascimento date not null,
    nota double
);

create table endereco(
	idEndereco int primary key auto_increment,
    estado varchar(100) not null,
    cidade varchar(100) not null,
    bairro varchar(100) not null,
	logradouro varchar(100) not null,
    cep varchar(10),
    numero varchar(5),
    fk_idLoja int not null,
    foreign key (fk_idLoja) references loja(idLoja)
);

create table cliente(
	idCliente int primary key auto_increment,
    nomeCliente varchar(255) not null,
    foto varchar(100),
    email varchar(100) not null,
    cpf char(11) not null unique,
    telefone char(11) not null unique,
    dataNascimento date not null,
    senha char(8) not null
);

create table produto(
	idProduto int primary key auto_increment,
    nomeProduto varchar(100),
    imagem varchar(100),
    descricao varchar(300),
    status boolean default true,
    categoria enum('Frutas','Vegetais','Doces','Almoço','Bebidas','Verduras', 'Carnes','Limpeza', 'Bolos', 'Salgados'),
    preco double,
    estoque int,
    fk_idLoja int not null,
    foreign key (fk_idLoja) references loja(idLoja)
);

create table avaliacao(
	idAvaliacao int primary key auto_increment,
    nota int not null,
    comentario varchar(100),
    fk_idProduto int,
    fk_idLoja int,
    fk_idCliente int not null,
    foreign key(fk_idProduto) references produto(idProduto),
    foreign key(fk_idLoja) references  loja(idLoja),
	foreign key(fk_idCliente) references cliente(idCliente)
);

create table pedido(
	idPedido int primary key auto_increment,
	total double not null,
    status enum('Em Processamento', 'Enviado', 'Entregue', 'Cancelado'),
    fk_idCliente int not null,
    fk_idLoja int not null,
    foreign key(fk_idCliente) references cliente(idCliente),
    foreign key (fk_idLoja) references loja(idLoja)
);


create table itemPedido(
	idItemPedido int primary key auto_increment,
    quantidade int not null,
    precoUnitario double not null,
    fk_idProduto int not null,
    fk_idPedido int not null,
    foreign key(fk_idProduto) references produto(idProduto),
	foreign key(fk_idPedido) references pedido(idPedido)
);

create table carrinho(
	idCarrinho int primary key auto_increment,
	fk_idCliente int not null,
	foreign key(fk_idCliente) references cliente(idCliente)
);

create table itemCarrinho(
	idItemCarrinho int primary key auto_increment,
    quantidade int not null,
    precoUnitario double not null,
	fk_idProduto int not null,
    fk_idCarrinho int not null,
	foreign key(fk_idProduto) references produto(idProduto),
    foreign key(fk_idCarrinho) references carrinho(idCarrinho)
);
