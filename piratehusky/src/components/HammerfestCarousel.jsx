export default function Carousel() {
  const slides = [
    { src: "/assets/hammerfest-carousel/banner1.jpg", alt: "Banner 1", caption: "Dog Sledding Through the Arctic" },
    { src: "/assets/hammerfest-carousel/banner2.jpg", alt: "Banner 2", caption: "Sleep Beneath the Northern Lights" },
    { src: "/assets/hammerfest-carousel/banner3.jpg", alt: "Banner 3", caption: "Kayaking Norway’s Frozen Fjords" },
    { src: "/assets/hammerfest-carousel/banner4.jpg", alt: "Banner 4", caption: "Our Huskies, Our Family" },
    { src: "/assets/hammerfest-carousel/banner5.jpg", alt: "Banner 5", caption: "Stay Warm, Stay Wild" },
    { src: "/assets/hammerfest-carousel/banner6.jpg", alt: "Banner 6", caption: "Led by Passionate Arctic Guides" },
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