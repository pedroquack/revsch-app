
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Segmento } from "../../models/segmento";
import { Categoria } from "../../models/categoria";
import Response from "../../types/response";
import { path } from "../../api";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import "../categorias/Categorias.css";


export default function SegmentoDetalhe() {
    const { idSegmento } = useParams();

    const [segmento, setSegmento] = useState<Segmento | null>(null);
    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const getSegmento = async (id: number) => {
        try {
            const response = await axios.get(`${path}/segmento/${id}`);

            const data: Response<Segmento> = response.data;

            if (data.sucesso === false) {
                throw new Error(data.mensagem);
            }

            if (data.dados) {
                setSegmento(data.dados);

                if (data.dados.categoriaId) {
                    const catResponse = await axios.get(`${path}/categoria/${data.dados.categoriaId}`);
                    const catData: Response<Categoria> = catResponse.data;
                    if (catData.sucesso !== false && catData.dados) {
                        setCategoria(catData.dados);
                    }
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const excluirSegmento = async () => {
        if (!segmento) return;

        setLoading(true);

        try {
            const response = await axios.delete(
                `${path}/segmento/${segmento.id}`
            );

            const data: Response<Segmento> = response.data;

            if (!data.sucesso) {
                throw new Error(
                    data.mensagem || "Não foi possível excluir o segmento."
                );
            }

            toast.success(data.mensagem || "Segmento excluído com sucesso!");

            navigate("/segmentos");

        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
                toast.error(err.response.data.mensagem);
            } else if (err instanceof Error) {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idSegmento) {
            getSegmento(parseInt(idSegmento));
        }
    }, [idSegmento]);

    if (loading) {
        return <Loading />;
    }

    if (!segmento) {
        return (
            <div className="categoria-nao-encontrada">
                <p>Segmento não encontrado.</p>

                <Link to="/segmentos" className="categoria-voltar">
                    Voltar para Segmentos
                </Link>
            </div>
        );
    }

    return (
        <div className="categoria-detalhe-container">

            <Link to="/segmentos" className="categoria-voltar">
                ← Voltar para Segmentos
            </Link>

            <div className="categoria-detalhe-card">

                <div className="categoria-detalhe-imagem-wrapper">
                    <img
                        className="categoria-detalhe-imagem"
                        src={`https://placehold.co/500x500?text=${encodeURIComponent(segmento.nome)}`}
                        alt={segmento.nome}
                    />
                </div>

                <div className="categoria-detalhe-info">

                    <span className="categoria-detalhe-id">
                        Segmento #{segmento.id}
                    </span>

                    <h1 className="categoria-detalhe-nome">
                        {segmento.nome}
                    </h1>

                    {categoria && (
                        <div>
                            <span>Categoria: </span>
                            <Link to={`/categorias/${categoria.id}`} className="categoria-voltar">
                                {categoria.nome}
                            </Link>
                        </div>
                    )}

                    <div className="categoria-detalhe-acoes">

                        <Button
                            type="button"
                            onClick={() =>
                                navigate(`/segmentos/editar/${segmento.id}`)
                            }
                        >
                            Editar
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            onClick={excluirSegmento}
                        >
                            Excluir
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    );
}
