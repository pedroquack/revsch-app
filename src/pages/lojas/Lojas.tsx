import { useEffect, useState } from "react";
import { Loja } from "../../models/loja";
import "./Lojas.css";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import axios from "axios";
import Response from "../../types/response";
import { useNavigate } from "react-router-dom";
import { path } from "../../api";

export default function Lojas() {

    const [lojas, setLojas] = useState<Loja[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const getLojas = async () => {
        try {
            const response = await axios.get(`${path}/lojas`)

            const data: Response<Loja[]> = response.data
            if (data.sucesso === false) {
                throw new Error(data.mensagem)
            }

            if (data.dados) {
                setLojas(data.dados)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getLojas()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <div className="lojas-header">
                <h1 className="lojas-titulo">Lojas</h1>
                <Button onClick={() => navigate("/lojas/criar")}>
                    + Nova Loja
                </Button>
            </div>
            <div className="lojas-container">
                {lojas.map(l => (
                    <div onClick={() => navigate(`/lojas/${l.id}`)} className="card-loja" key={l.id}>
                        <div className="imagem-loja-wrapper">
                            <img
                                className="imagem-loja"
                                src={`https://placehold.co/500x500?text=${encodeURIComponent(l.nome)}`}
                                alt={l.nome}
                            />
                        </div>
                        <div className="card-loja-body">
                            <h2 className="card-loja-nome">{l.nome}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}