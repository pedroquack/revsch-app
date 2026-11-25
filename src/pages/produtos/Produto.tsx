import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Response from "../../types/response";
import ProdutoModel from "../../models/produto";
import { Segmento } from "../../models/segmento";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { path } from "../../api";
import "../lojas/Loja.css";
import "./Produto.css";

export default function Produto() {
    const { idProduto } = useParams();
    const [produto, setProduto] = useState<ProdutoModel | null>(null);
    const [segmento, setSegmento] = useState<Segmento | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [savingAvaliacao, setSavingAvaliacao] = useState<boolean>(false);
    const [avaliacaoEditandoId, setAvaliacaoEditandoId] = useState<number | null>(null);
    const [savingAvaliacaoId, setSavingAvaliacaoId] = useState<number | null>(null);
    const navigate = useNavigate();

    const getProduto = async (id: number) => {
        try {
            const response = await axios.get(`${path}/produto/${id}`);
            const data: Response<ProdutoModel> = response.data;

            if (data.sucesso === false) {
                throw new Error(data.mensagem);
            }

            if (data.dados) {
                setProduto(data.dados);

                if (data.dados.segmentoId) {
                    const segResponse = await axios.get(`${path}/segmento/${data.dados.segmentoId}`);
                    const segData: Response<Segmento> = segResponse.data;
                    if (segData.sucesso !== false && segData.dados) {
                        setSegmento(segData.dados);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idProduto) {
            getProduto(parseInt(idProduto));
        }
    }, [idProduto]);

    if (loading) {
        return <Loading />;
    }

    if (!produto) {
        return (
            <div className="loja-nao-encontrada">
                <p>Produto não encontrado.</p>
                <Link to="/" className="loja-voltar">
                    Voltar para Produtos
                </Link>
            </div>
        );
    }

    const excluirProduto = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${path}/produto/${produto.id}`);
            const data: Response<ProdutoModel> = response.data;

            if (!data.sucesso) {
                throw new Error(data.mensagem || "Não foi possível excluir o produto.");
            }

            toast.success(data.mensagem || "Produto excluído com sucesso!");
            navigate("/");
        } catch (err) {
            toast.error("Houve um erro ao excluir o produto");
        } finally {
            setLoading(false);
        }
    };

    const criarAvaliacao = async (form: FormData) => {
        setSavingAvaliacao(true);
        try {
            const urlImagem = form.get("urlImagem")?.toString().trim();
            const body = {
                nomeUsuario: form.get("nomeUsuario")?.toString().trim(),
                nota: Number(form.get("nota")),
                urlImagem: urlImagem || undefined,
                comentario: form.get("comentario")?.toString().trim(),
                produtoId: produto.id,
            };

            const response = await axios.post(`${path}/avaliacao`, body);
            const data: Response<unknown> = response.data;

            if (!data.sucesso) {
                throw new Error(data.mensagem || "Não foi possível enviar a avaliação.");
            }

            toast.success(data.mensagem || "Avaliação enviada com sucesso!");
            await getProduto(produto.id);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
                toast.error(err.response.data.mensagem);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Houve um erro ao enviar a avaliação.");
            }
        } finally {
            setSavingAvaliacao(false);
        }
    };

    const editarAvaliacao = async (id: number, form: FormData) => {
        setSavingAvaliacaoId(id);
        try {
            const urlImagem = form.get("urlImagem")?.toString().trim();
            const body = {
                nomeUsuario: form.get("nomeUsuario")?.toString().trim(),
                nota: Number(form.get("nota")),
                urlImagem: urlImagem || undefined,
                comentario: form.get("comentario")?.toString().trim(),
                produtoId: produto.id,
            };

            const response = await axios.put(`${path}/avaliacao/${id}`, body);
            const data: Response<unknown> = response.data;

            if (!data.sucesso) {
                throw new Error(data.mensagem || "Não foi possível atualizar a avaliação.");
            }

            toast.success(data.mensagem || "Avaliação atualizada com sucesso!");
            setAvaliacaoEditandoId(null);
            await getProduto(produto.id);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
                toast.error(err.response.data.mensagem);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Houve um erro ao atualizar a avaliação.");
            }
        } finally {
            setSavingAvaliacaoId(null);
        }
    };

    const excluirAvaliacao = async (id: number) => {
        setSavingAvaliacaoId(id);
        try {
            const response = await axios.delete(`${path}/avaliacao/${id}`);
            const data: Response<unknown> = response.data;

            if (!data.sucesso) {
                throw new Error(data.mensagem || "Não foi possível excluir a avaliação.");
            }

            toast.success(data.mensagem || "Avaliação excluída com sucesso!");
            await getProduto(produto.id);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
                toast.error(err.response.data.mensagem);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Houve um erro ao excluir a avaliação.");
            }
        } finally {
            setSavingAvaliacaoId(null);
        }
    };

    const avaliacoesComImagem = (produto.avaliacoes || []).filter((a) => a.urlImagem);
    const urlImagem =
        avaliacoesComImagem.length > 0
            ? avaliacoesComImagem[0].urlImagem
            : `https://placehold.co/500x500?text=${encodeURIComponent(produto.nome)}`;

    return (
        <div className="loja-detalhe-container">
            <Link to="/" className="loja-voltar">
                ← Voltar para Produtos
            </Link>

            <div className="loja-detalhe-card">
                <div className="loja-detalhe-imagem-wrapper">
                    <img
                        className="loja-detalhe-imagem"
                        src={urlImagem}
                        alt={produto.nome}
                    />
                </div>

                <div className="loja-detalhe-info">
                    <span className="loja-detalhe-id">Produto #{produto.id}</span>
                    <h1 className="loja-detalhe-nome">{produto.nome}</h1>

                    <div className="loja-detalhe-campo">
                        <span className="loja-detalhe-label">Avaliação média</span>
                        <span>{produto.mediaNotas} &#11088;</span>
                    </div>

                    {segmento && (
                        <div className="loja-detalhe-campo">
                            <span className="loja-detalhe-label">Segmento</span>
                            <Link to={`/segmentos/${segmento.id}`} className="loja-detalhe-url">
                                {segmento.nome}
                            </Link>
                        </div>
                    )}

                    {produto.urlProduto && (
                        <div className="loja-detalhe-campo">
                            <span className="loja-detalhe-label">Link do produto</span>
                            <a
                                className="loja-detalhe-url"
                                href={produto.urlProduto}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {produto.urlProduto}
                            </a>
                        </div>
                    )}

                    <div className="loja-detalhe-acoes">
                        <Link to={`/produtos/editar/${produto.id}`} className="loja-btn-editar">
                            Editar
                        </Link>
                        <button onClick={excluirProduto} type="button" className="loja-btn-excluir">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>

            <section className="produto-avaliacoes-secao">
                <h2 className="produto-avaliacoes-titulo">
                    Avaliações ({(produto.avaliacoes || []).length})
                </h2>

                <form className="produto-avaliacao-form" action={criarAvaliacao}>
                    <h3 className="produto-avaliacao-form-titulo">Deixe sua avaliação</h3>
                    <div className="produto-avaliacao-form-grid">
                        <Input
                            name="nomeUsuario"
                            label="Seu nome"
                            placeholder="Ex: João"
                            disabled={savingAvaliacao}
                            required
                        />
                        <Input
                            name="nota"
                            label="Nota (1 a 5)"
                            type="number"
                            min={1}
                            max={5}
                            step={1}
                            placeholder="Ex: 5"
                            disabled={savingAvaliacao}
                            required
                        />
                    </div>
                    <Input
                        name="urlImagem"
                        label="URL da imagem (opcional)"
                        type="url"
                        placeholder="https://..."
                        disabled={savingAvaliacao}
                    />
                    <Input
                        name="comentario"
                        label="Comentário"
                        placeholder="Conte o que achou do produto..."
                        disabled={savingAvaliacao}
                        required
                    />
                    <div className="produto-avaliacao-form-acoes">
                        <Button type="submit" disabled={savingAvaliacao}>
                            {savingAvaliacao ? "Enviando..." : "Enviar Avaliação"}
                        </Button>
                    </div>
                </form>

                {!produto.avaliacoes || produto.avaliacoes.length === 0 ? (
                    <div className="produto-avaliacoes-vazio">
                        Nenhuma avaliação cadastrada para este produto.
                    </div>
                ) : (
                    <div className="produto-avaliacoes-lista">
                        {produto.avaliacoes.map((avaliacao) => {
                            const isEditing = avaliacaoEditandoId === avaliacao.id;
                            const isBusy = savingAvaliacaoId === avaliacao.id;

                            return (
                                <div className="produto-avaliacao-card" key={avaliacao.id}>
                                    {isEditing ? (
                                        <form
                                            className="produto-avaliacao-editar-form"
                                            action={(form) => editarAvaliacao(avaliacao.id, form)}
                                        >
                                            <div className="produto-avaliacao-form-grid">
                                                <Input
                                                    name="nomeUsuario"
                                                    label="Seu nome"
                                                    defaultValue={avaliacao.nomeUsuario}
                                                    disabled={isBusy}
                                                    required
                                                />
                                                <Input
                                                    name="nota"
                                                    label="Nota (1 a 5)"
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    defaultValue={avaliacao.nota}
                                                    disabled={isBusy}
                                                    required
                                                />
                                            </div>
                                            <Input
                                                name="urlImagem"
                                                label="URL da imagem (opcional)"
                                                type="url"
                                                defaultValue={avaliacao.urlImagem ?? ""}
                                                disabled={isBusy}
                                            />
                                            <Input
                                                name="comentario"
                                                label="Comentário"
                                                defaultValue={avaliacao.comentario}
                                                disabled={isBusy}
                                                required
                                            />
                                            <div className="produto-avaliacao-acoes">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    disabled={isBusy}
                                                    onClick={() => setAvaliacaoEditandoId(null)}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button type="submit" disabled={isBusy}>
                                                    {isBusy ? "Salvando..." : "Salvar"}
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="produto-avaliacao-header">
                                                <div className="produto-avaliacao-usuario">
                                                    <img
                                                        className="produto-avaliacao-avatar"
                                                        src={`https://placehold.co/80x80?text=${encodeURIComponent(avaliacao.nomeUsuario[0])}`}
                                                        alt={avaliacao.nomeUsuario}
                                                    />
                                                    <div>
                                                        <p className="produto-avaliacao-nome">{avaliacao.nomeUsuario}</p>
                                                        {avaliacao.dataAvaliacao && (
                                                            <span className="produto-avaliacao-data">
                                                                {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR")}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="produto-avaliacao-nota">
                                                    {avaliacao.nota} &#11088;
                                                </span>
                                            </div>

                                            {avaliacao.comentario && (
                                                <p className="produto-avaliacao-comentario">{avaliacao.comentario}</p>
                                            )}

                                            {avaliacao.urlImagem && (
                                                <img
                                                    className="produto-avaliacao-imagem"
                                                    src={avaliacao.urlImagem}
                                                    alt={`Avaliação de ${avaliacao.nomeUsuario}`}
                                                />
                                            )}

                                            <div className="produto-avaliacao-acoes">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    disabled={isBusy}
                                                    onClick={() => setAvaliacaoEditandoId(avaliacao.id)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    disabled={isBusy}
                                                    onClick={() => excluirAvaliacao(avaliacao.id)}
                                                >
                                                    {isBusy ? "Excluindo..." : "Excluir"}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
