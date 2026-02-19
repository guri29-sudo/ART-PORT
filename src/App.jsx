import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Storefront from './Storefront';
import Admin from './Admin';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
