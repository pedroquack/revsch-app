import Avaliacao from "./avaliacao";

export default interface Produto{
    id: number;
    nome: string;
    urlProduto: string;
    lojaId: number;
    segmentoId: number;
    mediaNotas: number;
    avaliacoes: Avaliacao[];
}