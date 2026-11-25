
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Response from "../../types/response";
import { Segmento } from "../../models/segmento";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { path } from "../../api";
import "../categorias/CriarCategoria.css";

export default function EditarSegmento() {

    const { idSegmento } = useParams();

    const [segmento, setSegmento] = useState<Segmento | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idSegmento) {
            getSegmento(parseInt(idSegmento));
        }
    }, [idSegmento]);

    const editarSegmento = async (form: FormData) => {

        if (!segmento) return;

        setLoading(true);
        setError(null);

        try {

            const body = {
                nome: form.get("nome"),
            };

            const response = await axios.put(
                `${path}/segmento/${segmento.id}`,
                body
            );

            const data: Response<Segmento> = response.data;

            if (!data.sucesso) {
                throw new Error(
                    data.mensagem || "Não foi possível editar o segmento."
                );
            }

            toast.success(data.mensagem || "Segmento atualizado com sucesso!");

            navigate("/segmentos");

        } catch (err) {

            if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
                setError(err.response.data.mensagem);
            } else if (err instanceof Error) {
                setError(err.message);
            }

        } finally {
            setLoading(false);
        }
    };

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
        <div className="criar-categoria-container">

            <Link to="/segmentos" className="criar-categoria-voltar">
                ← Voltar para Segmentos
            </Link>

            <div className="criar-categoria-card">

                <div className="criar-categoria-header">
                    <h1 className="criar-categoria-titulo">
                        Editar Segmento
                    </h1>

                    <p className="criar-categoria-subtitulo">
                        Atualize os dados do segmento abaixo.
                    </p>
                </div>

                {error && (
                    <div className="criar-categoria-erro" role="alert">
                        {error}
                    </div>
                )}

                <form
                    className="criar-categoria-form"
                    action={editarSegmento}
                >

                    <Input
                        name="nome"
                        label="Nome do segmento"
                        defaultValue={segmento.nome}
                        disabled={loading}
                        required
                    />

                    <div className="criar-categoria-acoes">

                        <Button
                            type="button"
                            variant="secondary"
                            disabled={loading}
                            onClick={() =>
                                navigate(`/segmentos/${segmento.id}`)
                            }
                        >
                            Cancelar
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    );
}
