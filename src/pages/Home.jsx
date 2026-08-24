import heroImage from "../assets/ba-hero.png";
import "./Home.css";
import ScrollReveal from "../components/ScrollReveal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/news")
      .then((response) => response.json())
      .then((data) => setNews(data))
      .catch((error) =>
        console.error("Error fetching news:", error)
      );
  }, []);

  return (
    <main className="home">

      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-content">

          <h1>
            Experience the world
            <br />
            from the cockpit.
          </h1>

          <p className="hero-description">
            Fly with British Airways Virtual and experience the world
            of virtual aviation through Infinite Flight.
          </p>

          <div className="hero-buttons">

            <button
              className="hero-button primary"
              onClick={() => navigate("/register")}
            >
              Join Us
            </button>

            <button
              className="hero-button secondary"
              onClick={() => navigate("/pilots")}
            >
              Explore Our Staff
            </button>

          </div>

        </div>
      </section>


      {/* ==========================================
          ABOUT SECTION
      ========================================== */}

      <section className="about-section">

        <ScrollReveal>

          <div className="about-content">

            <p className="section-tag">
              ABOUT BA VIRTUAL
            </p>

            <h2>
              More than a flight. It's the experience.
            </h2>

            <p>
              British Airways Virtual is a virtual airline community
              created for Infinite Flight pilots who share a passion
              for aviation, realistic operations and exploring the world
              from the cockpit.
            </p>

            <p>
              From short regional flights to long-haul international
              operations, our pilots can experience the world of
              British Airways through virtual aviation.
            </p>

          </div>

        </ScrollReveal>

      </section>


      {/* ==========================================
          OPERATIONS SECTION
      ========================================== */}

      <section className="operations-section">

        <ScrollReveal>

          <div className="operations-header">

            <p className="section-tag">
              OUR OPERATIONS
            </p>

            <h2>
              Fly beyond the ordinary.
            </h2>

            <p>
              Explore our virtual airline operations and experience
              British Airways across the Infinite Flight network.
            </p>

          </div>


          <div className="operations-grid">

            <div className="operation-card">

              <div className="operation-icon">
                ✈️
              </div>

              <h3>
                Scheduled Flights
              </h3>

              <p>
                Operate scheduled British Airways routes across our
                virtual network.
              </p>

            </div>


            <div className="operation-card">

              <div className="operation-icon">
                🌍
              </div>

              <h3>
                Global Network
              </h3>

              <p>
                Connect destinations around the world through our
                growing virtual route network.
              </p>

            </div>


            <div className="operation-card">

              <div className="operation-icon">
                🛫
              </div>

              <h3>
                Virtual Fleet
              </h3>

              <p>
                Fly a diverse fleet of aircraft inspired by the
                British Airways fleet.
              </p>

            </div>

          </div>

        </ScrollReveal>

      </section>


      {/* ==========================================
          NEWS SECTION
      ========================================== */}

      <section className="news-section">

        <ScrollReveal>

          <div className="news-header">

            <p className="section-tag">
              LATEST NEWS
            </p>

            <h2>
              What's happening at BA Virtual
            </h2>

            <p>
              Stay up to date with the latest announcements,
              events and operations from our virtual airline.
            </p>

          </div>


          <div className="news-grid">

            {news.map((item) => (

              <article
                className="news-card"
                key={item.id}
              >

                <div className="news-date">
                  {item.date}
                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

                <button>
                  Read More
                </button>

              </article>

            ))}

          </div>

        </ScrollReveal>

      </section>

    </main>
  );
}

export default Home;
