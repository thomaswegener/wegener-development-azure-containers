export default function Carousel() {
  const slides = [
    { src: "/assets/main-carousel/banner1.jpg", alt: "Dog sledding through Arctic Norway", caption: "Dog Sledding Through the Arctic" },
    { src: "/assets/main-carousel/banner2.jpg", alt: "Northern lights above our Arctic camp", caption: "Sleep Beneath the Northern Lights" },
    { src: "/assets/main-carousel/banner3.jpg", alt: "Kayaking Norway’s frozen fjords", caption: "Kayaking Norway’s Frozen Fjords" },
    { src: "/assets/main-carousel/banner4.jpg", alt: "Our huskies and family at the kennel", caption: "Our Huskies, Our Family" },
    { src: "/assets/main-carousel/banner5.jpg", alt: "Warm lodge stay in Finnmark", caption: "Stay Warm, Stay Wild" },
    { src: "/assets/main-carousel/banner6.jpg", alt: "Guided Arctic adventures with Pirate Husky", caption: "Led by Passionate Arctic Guides" },
    { src: "/assets/main-carousel/banner7.jpg", alt: "Arctic overnight adventure in Finnmark", caption: "A Night in the True North" },
    { src: "/assets/main-carousel/banner8.jpg", alt: "Book your Arctic husky adventure", caption: "Your Adventure Starts With a Pawshake" },
  ];

  return (
    <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
              <img
                src={slide.src}
                className="d-block w-100"
                alt={slide.alt}
                style={{ objectFit: "cover", height: "800px" }}
              />
              <div className="carousel-caption d-none d-md-block" style={{ bottom: "30px" }}>
                <h5 className="text-white text-shadow">{slide.caption}</h5>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
