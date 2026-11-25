
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Segmento } from "../../models/segmento";
import Response from "../../types/response";
import { path } from "../../api";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import "../categorias/Categorias.css";

export default function Segmentos() {
    const [segmentos, setSegmentos] = useState<Segmento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const getSegmentos = async () => {
        try {
            const response = await axios.get(`${path}/segmentos`);

            const data: Response<Segmento[]> = response.data;

            if (data.sucesso === false) {
                throw new Error(data.mensagem);
            }

            if (data.dados) {
                setSegmentos(data.dados);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSegmentos();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className="categorias-header">
                <h1 className="categorias-titulo">Segmentos</h1>

                <Button onClick={() => navigate("/segmentos/criar")}>
                    + Novo Segmento
                </Button>
            </div>

            <div className="categorias-container">
                {segmentos.map((s) => (
                    <div
                        onClick={() => navigate(`/segmentos/${s.id}`)}
                        className="card-categoria"
                        key={s.id}
                    >
                        <div className="imagem-categoria-wrapper">
                            <img
                                className="imagem-categoria"
                                src={`https://placehold.co/500x500?text=${encodeURIComponent(s.nome)}`}
                                alt={s.nome}
                            />
                        </div>

                        <div className="card-categoria-body">
                            <h2 className="card-categoria-nome">
                                {s.nome}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
