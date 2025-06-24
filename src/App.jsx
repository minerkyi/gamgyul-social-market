import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Products from './pages/products/Products';
import Page404 from './pages/Page404';
import Footer from './components/Footer';
import Sample from './pages/Sample';
import { FooterProvider } from "./contexts/FooterContext";

function App() {
  return (
    <BrowserRouter basename='/gamgyul-social-market'>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/products' element={<Products />} />
        <Route path='/sample' element={<Sample />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
      <FooterProvider>
        <Footer />
      </FooterProvider>
    </BrowserRouter>
  )
}

export default App;