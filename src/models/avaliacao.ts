export default interface Avaliacao{
    id: number;
    nomeUsuario: string;
    nota: number;
    comentario: string;
    dataAvaliacao: string;
    produtoId: string;
    urlImagem?: string;
}