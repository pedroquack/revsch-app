import { useEffect, useState } from "react"
import Produto from "../../models/produto"
import axios from "axios";
import Response, { FiltrarProdutos } from "../../types/response";
import { path } from "../../api";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import "./Produtos.css";
import Input from "../../components/Input";
import Select, { SelectOption } from "../../components/Select";
import { Categoria } from "../../models/categoria";
import { Loja } from "../../models/loja";

export default function Produtos() {

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categorias, setCategorias] = useState<SelectOption[]>([])
    const [lojas, setLojas] = useState<SelectOption[]>([])
    const navigate = useNavigate();

    const getProdutos = async () => {
        try {
            const response = await axios.get(`${path}/produtos`)

            const data: Response<Produto[]> = response.data
            if (data.sucesso === false) {
                throw new Error(data.mensagem)
            }

            if (data.dados) {
                setProdutos(data.dados)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const getCategoriaOptions = async () => {
        try {
            const response = await axios.get(`${path}/categorias`);
            const data: Response<Categoria[]> = response.data;

            if (data.sucesso === false) {
                throw new Error(data.mensagem);
            }

            if (data.dados) {

                let categoriaOptions: SelectOption[] = data.dados.map(c => {
                    return {
                        label: c.nome,
                        value: c.id
                    }
                })
                categoriaOptions = [{ value: '', label: "Todas" }, ...categoriaOptions];
                setCategorias(categoriaOptions);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getLojaOptions = async () => {
        try {
            const response = await axios.get(`${path}/lojas`);
            const data: Response<Loja[]> = response.data;

            if (data.sucesso === false) {
                throw new Error(data.mensagem);
            }

            if (data.dados) {

                let lojaOptions: SelectOption[] = data.dados.map(c => {
                    return {
                        label: c.nome,
                        value: c.id
                    }
                })
                lojaOptions = [{ value: '', label: "Todas" }, ...lojaOptions];
                setLojas(lojaOptions);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filtrarProdutos = async (form: FormData) => {
        try {

            const nomeProduto = form.get("nomeProduto")?.toString().trim();
            const idLoja = form.get("idLoja")?.toString();
            const idCategoria = form.get("idCategoria")?.toString();
            const params: Record<string, string> = {};
            if (nomeProduto){
                params.nomeProduto = nomeProduto;
            }
            if (idLoja){
                params.idLoja = idLoja;
            }
            if (idCategoria){
                params.idCategoria = idCategoria;
            }

            const response = await axios.get(`${path}/produtos/filtrar`, {
                params: params
            })

            const data: Response<Produto[]> = response.data
            if (data.sucesso === false) {
                throw new Error(data.mensagem)
            }

            if (data.dados) {
                setProdutos(data.dados)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProdutos();
        getCategoriaOptions();
        getLojaOptions();
    }, [])

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className="produtos-header">
                <h1 className="produtos-titulo">Produtos</h1>
                <Button onClick={() => navigate("/produtos/criar")}>
                    + Novo Produto
                </Button>
            </div>
            <div className="produtos-form">
                <form className="produtos-form-card" action={filtrarProdutos}>
                    <Input
                        name="nomeProduto"
                        label="Nome do Produto"
                        placeholder="Buscar por nome..."
                    />
                    <Select
                        name="idLoja"
                        defaultValue={''}
                        label="Loja"
                        options={lojas}
                    />
                    <Select
                        name="idCategoria"
                        defaultValue={''}
                        label="Categoria"
                        options={categorias}
                    />
                    <div className="produtos-form-acoes">
                        <Button
                            type="reset"
                            variant="secondary"
                            onClick={() => getProdutos()}
                        >
                            Limpar
                        </Button>
                        <Button type="submit">Buscar</Button>
                    </div>
                </form>
            </div>
            <div className="produtos-container">
                {produtos.map(p => {

                    const avaliacoesComImagem = p.avaliacoes.filter(a => a.urlImagem)
                    const urlImagem = avaliacoesComImagem.length > 0 ? avaliacoesComImagem[0].urlImagem : `https://placehold.co/500x500?text=${encodeURIComponent(p.nome)}`

                    return (
                        <div onClick={() => navigate(`/produtos/${p.id}`)} className="card-produto" key={p.id}>
                            <div className="imagem-produto-wrapper">
                                <img
                                    className="imagem-produto"
                                    src={urlImagem}
                                    alt={p.nome}
                                />
                            </div>
                            <div className="card-produto-body">
                                <h2 className="card-produto-nome">{p.nome}</h2>
                                <span>{p.mediaNotas} &#11088;</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
