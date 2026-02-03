import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p className="mb-2">
          © 2025 Pirate Husky AS – All Rights Reserved
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/locations/porsanger" className="text-light text-decoration-none">Porsanger</Link>
          <Link to="/locations/hammerfest" className="text-light text-decoration-none">Hammerfest</Link>
          <Link to="/locations/nordkapp" className="text-light text-decoration-none">Nordkapp</Link>
        </div>
      </div>
    </footer>
  );
}