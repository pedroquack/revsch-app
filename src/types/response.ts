export default interface Response<T>{
    mensagem: string;
    sucesso: boolean;
    timestamp: string;
    dados?: T
}

export interface FiltrarProdutos{
    idLoja?: number;
    idCategoria?: number;
    nomeProduto?: string;
}