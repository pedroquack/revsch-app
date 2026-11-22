import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { type Categoria } from "../../models/categoria";
import Response from "../../types/response";
import { path } from "../../api";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import "./Categoria.css";

export default function Categoria() {
  const { idCategoria } = useParams();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const getCategoria = async (id: number) => {
    try {
      const response = await axios.get(`${path}/categoria/${id}`);
      const data: Response<Categoria> = response.data;

      if (data.sucesso === false) {
        throw new Error(data.mensagem);
      }

      if (data.dados) {
        setCategoria(data.dados);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const excluirCategoria = async () => {
    if (!categoria) return;
    setLoading(true);

    try {
      const response = await axios.delete(`${path}/categoria/${categoria.id}`);
      const data: Response<Categoria> = response.data;

      if (!data.sucesso) {
        throw new Error(data.mensagem || "Não foi possível excluir a categoria.");
      }

      toast.success(data.mensagem || "Categoria excluída com sucesso!");
      navigate("/categorias");
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
    if (idCategoria) {
      getCategoria(parseInt(idCategoria));
    }
  }, [idCategoria]);

  if (loading) {
    return <Loading />;
  }

  if (!categoria) {
    return (
      <div className="categoria-nao-encontrada">
        <p>Categoria não encontrada.</p>
        <Link to="/categorias" className="categoria-voltar">
          Voltar para Categorias
        </Link>
      </div>
    );
  }

  return (
    <div className="categoria-detalhe-container">
      <Link to="/categorias" className="categoria-voltar">
        ← Voltar para Categorias
      </Link>

      <div className="categoria-detalhe-card">
        <div className="categoria-detalhe-imagem-wrapper">
          <img
            className="categoria-detalhe-imagem"
            src={`https://placehold.co/500x500?text=${encodeURIComponent(categoria.nome)}`}
            alt={categoria.nome}
          />
        </div>

        <div className="categoria-detalhe-info">
          <span className="categoria-detalhe-id">Categoria #{categoria.id}</span>
          <h1 className="categoria-detalhe-nome">{categoria.nome}</h1>

          <div className="categoria-detalhe-acoes">
            <Button
              type="button"
              onClick={() => navigate(`/categorias/editar/${categoria.id}`)}
            >
              Editar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={excluirCategoria}
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
