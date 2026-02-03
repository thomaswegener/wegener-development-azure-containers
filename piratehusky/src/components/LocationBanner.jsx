// src/components/LocationBanner.jsx
import { Link } from "react-router-dom";
import porsanger from "/assets/icons/porsanger.png";
import nordkapp from "/assets/icons/nordkapp.png";
import hammerfest from "/assets/icons/hammerfest.png";

const locations = [
  {
    name: "Porsanger",
    img: porsanger,
    to: "/locations/porsanger",
  },
  {
    name: "Nordkapp",
    img: nordkapp,
    to: "/locations/nordkapp",
  },
  {
    name: "Hammerfest",
    img: hammerfest,
    to: "/locations/hammerfest",
  },
];

export default function LocationBanner() {
  return (
    <section className="py-5" style={{ background: "#f6f6f8" }}>
      <h2 className="text-center mb-4 fw-bold">
        Explore Pirate Husky Experiences in 3 Destinations
      </h2>
      <div className="d-flex justify-content-center gap-4 flex-wrap">
        {locations.map((loc) => (
          <Link
            to={loc.to}
            key={loc.name}
            className="d-flex flex-column align-items-center text-decoration-none"
            style={{
              border: "1px solid #ddd",
              borderRadius: 16,
              background: "#fff",
              padding: 24,
              width: 200,
              boxShadow: "0 2px 12px #0001",
              transition: "transform 0.2s",
            }}
          >
            <img
              src={loc.img}
              alt={loc.name}
              style={{ width: 100, height: 100, borderRadius: "50%", marginBottom: 16 }}
            />
            <span className="fw-bold fs-4" style={{ color: "#2d3946" }}>{loc.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
