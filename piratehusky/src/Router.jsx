import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Tours from './pages/Tours';
import DogSledding from './pages/tours/DogSledding';
import Hiking from './pages/tours/Hiking';
import Kayaking from './pages/tours/Kayaking';
import Skiing from './pages/tours/Skiing';
// import Shop from './pages/Shop';
import Accommodation from './pages/Accommodation';
import YouTube from './pages/YouTube';
import Camp from './pages/accommodation/Camp';
import Lodge from './pages/accommodation/Lodge';
import About from './pages/about/About';
import Guides from './pages/about/Guides';
import Dogs from './pages/about/Dogs';
import Contact from './pages/about/Contact';
import Sustainability from './pages/about/Sustainability';
import Porsanger from './pages/locations/Porsanger';
import Hammerfest from './pages/locations/Hammerfest';
import Nordkapp from './pages/locations/Nordkapp';
import Admin from './pages/admin/Admin';
import Sledespesialisten from './pages/Sledespesialisten';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/dog-sledding" element={<DogSledding />} />
      <Route path="/tours/hiking" element={<Hiking />} />
      <Route path="/tours/kayaking" element={<Kayaking />} />
      <Route path="/tours/skiing" element={<Skiing />} />
      <Route path="/youtube" element={<YouTube />} />
      <Route path="/accommodation" element={<Accommodation />} />
      <Route path="/accommodation/camp" element={<Camp />} />
      <Route path="/accommodation/lodge" element={<Lodge />} />
      <Route path="/about/about" element={<About />} /> 
      <Route path="/about/sustainability" element={<Sustainability />} />
      <Route path="/about/guides" element={<Guides />} />
      <Route path="/about/dogs" element={<Dogs />} />
      <Route path="/about/contact" element={<Contact />} />
      <Route path="/locations/porsanger" element={<Porsanger />} />
      <Route path="/locations/hammerfest" element={<Hammerfest />} />
      <Route path="/locations/nordkapp" element={<Nordkapp />} />
      <Route path="/sledespesialisten" element={<Sledespesialisten />} />
      <Route path="/sledespeialisten" element={<Navigate to="/sledespesialisten" replace />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
