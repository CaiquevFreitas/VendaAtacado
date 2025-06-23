export type RootStackParamList = {
    ClienteTabs: undefined;
    LojaTabs: undefined;
    Login: undefined;
    LoginLoja: undefined;
    Cadastro: undefined;
    CadastroLoja: undefined;
    ConfiguracoesLoja: undefined;
    AlterarInformacoesLoja: undefined;
    AlterarEndereco: undefined;
    AlterarLogo: undefined;
    ConfiguracoesCliente: undefined;
    AlterarInformacoesCliente: undefined;
    AlterarFotoCliente: undefined;
    PageLoja: {
        nome: string;
        logo: string;
        endereco: string;
        seguidores?: string;
        nota?: number;
        produtos: any[];
        avaliacoes: any[];
        seguindo?: boolean;
    };
};
  
