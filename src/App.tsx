import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Produtos from "./pages/produtos/Produtos";
import Categorias from "./pages/categorias/Categorias";
import Segmentos from "./pages/segmentos/Segmentos";
import Lojas from "./pages/lojas/Lojas";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="App">
      </div>
      <Routes>
        <Route path="/" element={<Produtos/>}/>
        <Route path="/categorias" element={<Categorias/>}/>
        <Route path="/segmentos" element={<Segmentos/>}/>
        <Route path="/lojas" element={<Lojas/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
