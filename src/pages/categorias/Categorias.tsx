import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Categoria } from "../../models/categoria";
import Response from "../../types/response";
import { path } from "../../api";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import "./Categorias.css";

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const getCategorias = async () => {
    try {
      const response = await axios.get(`${path}/categorias`);
      const data: Response<Categoria[]> = response.data;

      if (data.sucesso === false) {
        throw new Error(data.mensagem);
      }

      if (data.dados) {
        setCategorias(data.dados);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="categorias-header">
        <h1 className="categorias-titulo">Categorias</h1>
        <Button onClick={() => navigate("/categorias/criar")}>
          + Nova Categoria
        </Button>
      </div>

      <div className="categorias-container">
        {categorias.map((c) => (
          <div
            onClick={() => navigate(`/categorias/${c.id}`)}
            className="card-categoria"
            key={c.id}
          >
            <div className="imagem-categoria-wrapper">
              <img
                className="imagem-categoria"
                src={`https://placehold.co/500x500?text=${encodeURIComponent(c.nome)}`}
                alt={c.nome}
              />
            </div>
            <div className="card-categoria-body">
              <h2 className="card-categoria-nome">{c.nome}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
