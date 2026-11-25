import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Produtos from "./pages/produtos/Produtos";
import Categorias from "./pages/categorias/Categorias";
import Categoria from "./pages/categorias/Categoria";
import CriarCategoria from "./pages/categorias/CriarCategoria";
import EditarCategoria from "./pages/categorias/EditarCategoria";
import Segmentos from "./pages/segmentos/Segmentos";
import Lojas from "./pages/lojas/Lojas";
import './App.css'
import Loja from "./pages/lojas/Loja";
import CriarLoja from "./pages/lojas/CriarLoja";
import EditarLoja from "./pages/lojas/EditarLoja";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditarProduto from "./pages/produtos/EditarProduto";
import CriarProduto from "./pages/produtos/CriarProduto";
import Produto from "./pages/produtos/Produto";
import Segmento from "./pages/segmentos/Segmento";
import CriarSegmento from "./pages/segmentos/CriarSegmento";
import EditarSegmento from "./pages/segmentos/EditarSegmento";




function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar />
      <div className="App">
      </div>
      <Routes>
        <Route path="/" element={<Produtos />} />
        <Route path="/segmentos">
          <Route index element={<Segmentos />} />
          <Route path=":idSegmento" element={<Segmento />} />
          <Route path="criar" element={<CriarSegmento />} />
          <Route path="editar/:idSegmento" element={<EditarSegmento />} />
        </Route>
        <Route path="/categorias">
          <Route index element={<Categorias />} />
          <Route path=":idCategoria" element={<Categoria />} />
          <Route path="criar" element={<CriarCategoria />} />
          <Route path="editar/:idCategoria" element={<EditarCategoria />} />
        </Route>
        <Route path="/lojas">
          <Route index element={<Lojas />} />
          <Route path=":idLoja" element={<Loja />} />
          <Route path="criar" element={<CriarLoja />} />
          <Route path="editar/:idLoja" element={<EditarLoja />} />
        </Route>
        <Route path="/produtos/:idProduto" element={<Produto />} />
        <Route path="/produtos/editar/:idProduto" element={<EditarProduto />} />
        <Route path="/produtos/criar" element={<CriarProduto />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
