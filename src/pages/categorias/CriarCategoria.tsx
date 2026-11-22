import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { path } from "../../api";
import Response from "../../types/response";
import { Categoria } from "../../models/categoria";
import "./CriarCategoria.css";

export default function CriarCategoria() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const criarCategoria = async (form: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        nome: form.get("nome"),
      };

      const response = await axios.post(`${path}/categoria`, body);
      const data: Response<Categoria> = response.data;

      if (!data.sucesso) {
        throw new Error(data.mensagem || "Não foi possível cadastrar a categoria.");
      }

      if (data.dados) {
        toast.success(data.mensagem || "Categoria criada com sucesso!");
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
          <h1 className="criar-categoria-titulo">Nova Categoria</h1>
          <p className="criar-categoria-subtitulo">
            Preencha os dados abaixo para cadastrar uma nova categoria.
          </p>
        </div>

        {error && (
          <div className="criar-categoria-erro" role="alert">
            {error}
          </div>
        )}

        <form className="criar-categoria-form" action={criarCategoria}>
          <Input
            name="nome"
            label="Nome da categoria"
            placeholder="Ex: Eletrônicos"
            disabled={loading}
            required
          />

          <div className="criar-categoria-acoes">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate("/categorias")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Categoria"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
