import { useEffect, useState } from "react";
import Response from "../../types/response";
import { Loja } from "../../models/loja";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { path } from "../../api";
import './CriarLoja.css'
import { toast } from "react-toastify";

export default function EditarLoja() {
    const { idLoja } = useParams();
    const [loja, setLoja] = useState<Loja | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const getLoja = async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:5191/loja/${id}`)

            const data: Response<Loja> = response.data
            if (data.sucesso === false) {
                throw new Error(data.mensagem)
            }

            if (data.dados) {
                setLoja(data.dados)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (idLoja) {
            getLoja(parseInt(idLoja));
        }
    }, [idLoja])

    if (loading) {
        return <Loading />;
    }

    if (!loja) {
        return (
            <div className="loja-nao-encontrada">
                <p>Loja não encontrada.</p>
                <Link to="/lojas" className="loja-voltar">
                    Voltar para Lojas
                </Link>
            </div>
        );
    }

    const editarLoja = async (form: FormData) => {
        setLoading(true);
        setError(null);

        try {
            const body = {
                nome: form.get("nome"),
                url: form.get("url"),
            };

            const response = await axios.put(`${path}/loja/${loja.id}`, body);
            const data: Response<Loja> = response.data;

            if (!data.sucesso) {
                throw new Error(data.mensagem || "Não foi possível editar a loja.");
            }

            if (data.dados) {
                toast.success(data.mensagem)
                navigate("/lojas");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="criar-loja-container">
            <Link to="/lojas" className="criar-loja-voltar">
                ← Voltar para Lojas
            </Link>

            <div className="criar-loja-card">
                <div className="criar-loja-header">
                    <h1 className="criar-loja-titulo">Editar Loja</h1>
                    <p className="criar-loja-subtitulo">
                        Preencha os dados abaixo para editar a loja.
                    </p>
                </div>

                {error && (
                    <div className="criar-loja-erro" role="alert">
                        {error}
                    </div>
                )}

                <form className="criar-loja-form" action={editarLoja}>
                    <Input
                        name="nome"
                        label="Nome da loja"
                        placeholder="Ex: Mercado Livre"
                        disabled={loading}
                        required
                        defaultValue={loja.nome}
                    />
                    <Input
                        name="url"
                        label="URL do site"
                        type="url"
                        placeholder="https://www.exemplo.com.br"
                        disabled={loading}
                        required
                        defaultValue={loja.url}
                    />

                    <div className="criar-loja-acoes">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={loading}
                            onClick={() => navigate("/lojas")}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Loja"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}