import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Produto from "../../models/produto";
import { Loja } from "../../models/loja";
import Response from "../../types/response";

import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select, { SelectOption } from "../../components/Select";

import { path } from "../../api";
import "./../categorias/CriarCategoria.css";

// Tipagem dos segmentos retornados pela API
interface Segmento {
  id: number;
  nome: string;
}

export default function EditarProduto() {
  const { idProduto } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [lojas, setLojas] = useState<SelectOption[]>([]);
  const [segmentos, setSegmentos] = useState<SelectOption[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Busca produto, lojas e segmentos
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!idProduto || !Number.isInteger(Number(idProduto))) {
          setProduto(null);
          return;
        }

        const [produtoResponse, lojasResponse, segmentosResponse] =
          await Promise.all([
            axios.get(`${path}/produto/${idProduto}`),
            axios.get(`${path}/lojas`),
            axios.get(`${path}/segmentos`),
          ]);

        const produtoData: Response<Produto> = produtoResponse.data;
        const lojasData: Response<Loja[]> = lojasResponse.data;
        const segmentosData: Response<Segmento[]> = segmentosResponse.data;

        if (!produtoData.sucesso) {
          throw new Error(
            produtoData.mensagem || "Não foi possível carregar o produto."
          );
        }

        if (!lojasData.sucesso) {
          throw new Error(
            lojasData.mensagem || "Não foi possível carregar as lojas."
          );
        }

        if (!segmentosData.sucesso) {
          throw new Error(
            segmentosData.mensagem || "Não foi possível carregar os segmentos."
          );
        }

        if (produtoData.dados) {
          setProduto(produtoData.dados);
        }

        setLojas(
          (lojasData.dados || []).map((loja) => ({
            value: loja.id,
            label: loja.nome,
          }))
        );

        setSegmentos(
          (segmentosData.dados || []).map((segmento) => ({
            value: segmento.id,
            label: segmento.nome,
          }))
        );
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setProduto(null);
        } else if (
          axios.isAxiosError(err) &&
          err.response?.data?.mensagem
        ) {
          setError(err.response.data.mensagem);
        } else if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [idProduto]);

  // Atualiza produto
  const editarProduto = async (form: FormData) => {
    if (!produto) return;

    setLoading(true);
    setError(null);

    try {
      const body = {
        nome: form.get("nome")?.toString(),
        urlProduto: form.get("urlProduto")?.toString(),
        lojaId: Number(form.get("lojaId")),
        segmentoId: Number(form.get("segmentoId")),
      };

      const response = await axios.put(
        `${path}/produto/${produto.id}`,
        body
      );

      const data: Response<Produto> = response.data;

      if (!data.sucesso) {
        throw new Error(
          data.mensagem || "Não foi possível atualizar o produto."
        );
      }

      toast.success(data.mensagem || "Produto atualizado com sucesso!");

      // Redireciona para a página inicial
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        setError(err.response.data.mensagem);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro ao atualizar o produto.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!produto) {
    return (
      <div className="categoria-nao-encontrada">
        <p>Produto não encontrado.</p>

        <Link to="/" className="categoria-voltar">
          Voltar para Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="criar-categoria-container">
      <Link to="/" className="criar-categoria-voltar">
        ← Voltar para Produtos
      </Link>

      <div className="criar-categoria-card">
        <div className="criar-categoria-header">
          <h1 className="criar-categoria-titulo">
            Editar Produto
          </h1>

          <p className="criar-categoria-subtitulo">
            Atualize os dados do produto abaixo.
          </p>
        </div>

        {error && (
          <div className="criar-categoria-erro" role="alert">
            {error}
          </div>
        )}

        <form
          className="criar-categoria-form"
          action={editarProduto}
        >
          <Input
            name="nome"
            label="Nome do produto"
            defaultValue={produto.nome}
            disabled={loading}
            required
          />

          <Input
            name="urlProduto"
            label="URL do produto"
            type="url"
            defaultValue={produto.urlProduto}
            disabled={loading}
            required
          />

          <Select
            name="lojaId"
            label="Loja"
            defaultValue={produto.lojaId}
            options={lojas}
            disabled={loading}
            required
          />

          <Select
            name="segmentoId"
            label="Segmento"
            defaultValue={produto.segmentoId}
            options={segmentos}
            disabled={loading}
            required
          />

          <div className="criar-categoria-acoes">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => navigate("/")}
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

