import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { path } from "../../api";
import Response from "../../types/response";
import { Loja } from "../../models/loja";
import "./CriarLoja.css";
import { toast } from "react-toastify";

export default function CriarLoja() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const criarLoja = async (form: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        nome: form.get("nome"),
        url: form.get("url"),
      };

      const response = await axios.post(`${path}/loja`, body);
      const data: Response<Loja> = response.data;

      if (!data.sucesso) {
        throw new Error(data.mensagem || "Não foi possível cadastrar a loja.");
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
  };

  return (
    <div className="criar-loja-container">
      <Link to="/lojas" className="criar-loja-voltar">
        ← Voltar para Lojas
      </Link>

      <div className="criar-loja-card">
        <div className="criar-loja-header">
          <h1 className="criar-loja-titulo">Nova Loja</h1>
          <p className="criar-loja-subtitulo">
            Preencha os dados abaixo para cadastrar uma nova loja.
          </p>
        </div>

        {error && (
          <div className="criar-loja-erro" role="alert">
            {error}
          </div>
        )}

        <form className="criar-loja-form" action={criarLoja}>
          <Input
            name="nome"
            label="Nome da loja"
            placeholder="Ex: Mercado Livre"
            disabled={loading}
            required
          />
          <Input
            name="url"
            label="URL do site"
            type="url"
            placeholder="https://www.exemplo.com.br"
            disabled={loading}
            required
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
  );
}
