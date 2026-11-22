export default interface Response<T>{
    mensagem: string;
    sucesso: boolean;
    timestamp: string;
    dados?: T
}