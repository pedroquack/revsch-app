import Avaliacao from "./avaliacao";
import { Segmento } from "./segmento";

export default interface Produto{
    id: number;
    nome: string;
    urlProduto: string;
    lojaId: number;
    segmentoId: number;
    mediaNotas: number;
    segmento: Segmento;
    avaliacoes: Avaliacao[];
}