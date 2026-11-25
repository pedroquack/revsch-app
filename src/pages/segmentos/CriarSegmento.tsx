
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { path } from "../../api";
import Response from "../../types/response";
import { Segmento } from "../../models/segmento";
import "../categorias/CriarCategoria.css";


export default function CriarSegmento() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const criarSegmento = async (form: FormData) => {

        setLoading(true);
        setError(null);

        try {

            const body = {
                nome: form.get("nome"),
            };

            const response = await axios.post(
                `${path}/segmento`,
                body
            );

            const data: Response<Segmento> = response.data;

            if (!data.sucesso) {
                throw new Error(
                    data.mensagem || "Não foi possível cadastrar o segmento."
                );
            }

            toast.success(data.mensagem || "Segmento criado com sucesso!");

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

    return (
        <div className="criar-categoria-container">

            <Link to="/segmentos" className="criar-categoria-voltar">
                ← Voltar para Segmentos
            </Link>

            <div className="criar-categoria-card">

                <div className="criar-categoria-header">
                    <h1 className="criar-categoria-titulo">
                        Novo Segmento
                    </h1>

                    <p className="criar-categoria-subtitulo">
                        Preencha os dados abaixo para cadastrar um novo segmento.
                    </p>
                </div>

                {error && (
                    <div className="criar-categoria-erro" role="alert">
                        {error}
                    </div>
                )}

                <form
                    className="criar-categoria-form"
                    action={criarSegmento}
                >

                    <Input
                        name="nome"
                        label="Nome do segmento"
                        placeholder="Ex: Tecnologia"
                        disabled={loading}
                        required
                    />

                    <div className="criar-categoria-acoes">

                        <Button
                            type="button"
                            variant="secondary"
                            disabled={loading}
                            onClick={() => navigate("/segmentos")}
                        >
                            Cancelar
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Segmento"}
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    );
}
