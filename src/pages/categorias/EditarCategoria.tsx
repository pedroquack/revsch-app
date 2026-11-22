import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Response from "../../types/response";
import { Categoria } from "../../models/categoria";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { path } from "../../api";
import "./CriarCategoria.css";

export default function EditarCategoria() {
  const { idCategoria } = useParams();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const editarCategoria = async (form: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        nome: form.get("nome"),
      };

      const response = await axios.put(`${path}/categoria/${categoria.id}`, body);
      const data: Response<Categoria> = response.data;

      if (!data.sucesso) {
        throw new Error(data.mensagem || "Não foi possível editar a categoria.");
      }

      if (data.dados) {
        toast.success(data.mensagem || "Categoria atualizada com sucesso!");
        navigate("/categorias");
      }
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
      <Link to="/categorias" className="criar-categoria-voltar">
        ← Voltar para Categorias
      </Link>

      <div className="criar-categoria-card">
        <div className="criar-categoria-header">
          <h1 className="criar-categoria-titulo">Editar Categoria</h1>
          <p className="criar-categoria-subtitulo">
            Atualize os dados da categoria abaixo.
          </p>
        </div>

        {error && (
          <div className="criar-categoria-erro" role="alert">
            {error}
          </div>
        )}

        <form className="criar-categoria-form" action={editarCategoria}>
          <Input
            name="nome"
            label="Nome da categoria"
            defaultValue={categoria.nome}
            disabled={loading}
            required
          />

          <div className="criar-categoria-acoes">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate(`/categorias/${categoria.id}`)}
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
