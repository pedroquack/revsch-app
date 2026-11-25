
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Input from "../../components/Input";
import Select, { SelectOption } from "../../components/Select";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

import { path } from "../../api";
import Response from "../../types/response";
import Produto from "../../models/produto";
import { Loja } from "../../models/loja";

import "./CriarProduto.css";

interface Segmento {
  id: number;
  nome: string;
}

export default function CriarProduto() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [lojas, setLojas] = useState<SelectOption[]>([]);
  const [segmentos, setSegmentos] = useState<SelectOption[]>([]);

  const navigate = useNavigate();

  // Busca as opções dos selects
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const [lojasResponse, segmentosResponse] = await Promise.all([
          axios.get(`${path}/lojas`),
          axios.get(`${path}/segmentos`),
        ]);

        const lojasData: Response<Loja[]> = lojasResponse.data;
        const segmentosData: Response<Segmento[]> = segmentosResponse.data;

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
        if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
          setError(err.response.data.mensagem);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao carregar as opções do formulário.");
        }
      } finally {
        setLoading(false);
      }
    };

    carregarOpcoes();
  }, []);

  // Cadastra o produto
  const criarProduto = async (form: FormData) => {
    setSaving(true);
    setError(null);

    try {
      const body = {
        nome: form.get("nome")?.toString().trim(),
        urlProduto: form.get("urlProduto")?.toString().trim(),
        lojaId: Number(form.get("lojaId")),
        segmentoId: Number(form.get("segmentoId")),
      };

      const response = await axios.post(`${path}/produto`, body);

      const data: Response<Produto> = response.data;

      if (!data.sucesso) {
        throw new Error(
          data.mensagem || "Não foi possível cadastrar o produto."
        );
      }

      toast.success(data.mensagem || "Produto cadastrado com sucesso!");

      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        setError(err.response.data.mensagem);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro ao cadastrar o produto.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="criar-produto-container">
      <Link to="/" className="criar-produto-voltar">
        ← Voltar para Produtos
      </Link>

      <div className="criar-produto-card">
        <div className="criar-produto-header">
          <h1 className="criar-produto-titulo">Novo Produto</h1>

          <p className="criar-produto-subtitulo">
            Preencha os dados abaixo para cadastrar um novo produto.
          </p>
        </div>

        {error && (
          <div className="criar-produto-erro" role="alert">
            {error}
          </div>
        )}

        <form className="criar-produto-form" action={criarProduto}>
          <Input
            name="nome"
            label="Nome do produto"
            placeholder="Ex: Smartphone Samsung"
            disabled={saving}
            required
          />

          <Input
            name="urlProduto"
            label="URL do produto"
            type="url"
            placeholder="https://www.exemplo.com.br/produto"
            disabled={saving}
            required
          />

          <Select
            name="lojaId"
            label="Loja"
            placeholder="Selecione uma loja"
            options={lojas}
            disabled={saving}
            required
          />

          <Select
            name="segmentoId"
            label="Segmento"
            placeholder="Selecione um segmento"
            options={segmentos}
            disabled={saving}
            required
          />

          <div className="criar-produto-acoes">
            <Button
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
