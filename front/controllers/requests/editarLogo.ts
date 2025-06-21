import API_URL from './api.url';

export async function editarLogo(idLoja: number, imagemUri: string) {
    const formData = new FormData();
    const filename = imagemUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image';

    formData.append('logo', {
        uri: imagemUri,
        name: filename,
        type
    } as any);

    const response = await fetch(`${API_URL}/editLogo/${idLoja}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar logo');
    }
    return data;
}
