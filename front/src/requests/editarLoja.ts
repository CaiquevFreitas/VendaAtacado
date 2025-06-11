import { Alert } from "react-native";

interface EditarLojaParams {
    id: string;
    campos: {
        nome?: string;
        horarioAbertura?: Date;
        horarioFechamento?: Date;
        telefone?: string;
        senha?: string;
    };
}

export async function editarLoja(params: EditarLojaParams) {
    try {
        // Constrói a URL com os parâmetros
        let url = `http://192.168.176.214:3000/editLoja/${params.id}?`;
        
        // Adiciona os campos que existem como parâmetros da URL
        if (params.campos.nome) {
            url += `nome=${encodeURIComponent(params.campos.nome)}&`;
        }
        
        if (params.campos.horarioAbertura) {
            url += `horarioAbertura=${encodeURIComponent(params.campos.horarioAbertura.toISOString())}&`;
        }
        
        if (params.campos.horarioFechamento) {
            url += `horarioFechamento=${encodeURIComponent(params.campos.horarioFechamento.toISOString())}&`;
        }
        
        if (params.campos.telefone) {
            url += `telefone=${encodeURIComponent(params.campos.telefone)}&`;
        }
        
        if (params.campos.senha) {
            url += `senha=${encodeURIComponent(params.campos.senha)}&`;
        }

        // Remove o último & se existir
        url = url.replace(/&$/, '');

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const dados = await response.json();

        if (response.ok) {
            Alert.alert('Sucesso', dados.message || 'Informações atualizadas com sucesso!');
            return dados;
        } else {
            Alert.alert('Erro', dados.error || 'Falha ao atualizar as informações');
            throw new Error(dados.error);
        }
    } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
        throw error;
    }
}