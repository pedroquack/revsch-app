import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Response from "../../types/response";
import { type Loja } from "../../models/loja";
import Loading from "../../components/Loading";
import "./Loja.css";
import { toast } from "react-toastify";
import { path } from "../../api";

export default function Loja() {

    const { idLoja } = useParams();
    const [loja, setLoja] = useState<Loja | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate()

    const getLoja = async (id: number) => {
        try {
            const response = await axios.get(`${path}/loja/${id}`)

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

    const excluirLoja = async () => {
        setLoading(true);
        try {

            const response = await axios.delete(`${path}/loja/${loja.id}`);
            const data: Response<Loja> = response.data;

            if (!data.sucesso) {
                throw new Error(data.mensagem || "Não foi possível excluir a loja.");
            }

            if (data.dados) {
                toast.success(data.mensagem)
                navigate("/lojas");
            }
        } catch (err) {
           toast.error("Houve um erro ao excluir a loja");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="loja-detalhe-container">
            <Link to="/lojas" className="loja-voltar">
                ← Voltar para Lojas
            </Link>

            <div className="loja-detalhe-card">
                <div className="loja-detalhe-imagem-wrapper">
                    <img
                        className="loja-detalhe-imagem"
                        src={`https://placehold.co/500x500?text=${encodeURIComponent(loja.nome)}`}
                        alt={loja.nome}
                    />
                </div>

                <div className="loja-detalhe-info">
                    <span className="loja-detalhe-id">Loja #{loja.id}</span>
                    <h1 className="loja-detalhe-nome">{loja.nome}</h1>

                    <div className="loja-detalhe-campo">
                        <span className="loja-detalhe-label">Site oficial</span>
                        <a
                            className="loja-detalhe-url"
                            href={loja.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {loja.url}
                        </a>
                    </div>

                    <div className="loja-detalhe-acoes">
                        <Link to={`/lojas/editar/${loja.id}`} className="loja-btn-editar">
                            Editar
                        </Link>
                        <button onClick={excluirLoja} type="button" className="loja-btn-excluir">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}