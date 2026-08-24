import ScrollReveal from "../components/ScrollReveal";
import "./About.css";

function About() {
  return (
    <main className="about-page">

      <section className="about-hero">
        <div>
          <p className="section-tag">ABOUT BA VIRTUAL</p>

          <h1>
            Experience British Airways
            <br />
            from the cockpit.
          </h1>

          <p>
            A virtual airline built for Infinite Flight pilots
            who share a passion for aviation, realism and
            exploring the world.
          </p>
        </div>
      </section>

      <section className="about-story">
        <ScrollReveal>
          <div className="about-story-content">

            <p className="section-tag">WHO WE ARE</p>

            <h2>More than just virtual flying.</h2>

            <p>
              British Airways Virtual is a community-driven
              virtual airline created for pilots who want to
              experience British Airways operations within
              Infinite Flight.
            </p>

            <p>
              Our goal is to create an enjoyable and realistic
              environment where pilots can operate scheduled
              flights, explore destinations and become part of
              a growing aviation community.
            </p>

          </div>
        </ScrollReveal>
      </section>

      <section className="mission-section">
        <ScrollReveal>

          <div className="mission-grid">

            <div className="mission-card">
              <div className="mission-number">01</div>

              <h3>Our Mission</h3>

              <p>
                To provide an engaging and realistic virtual
                airline experience for Infinite Flight pilots.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-number">02</div>

              <h3>Our Community</h3>

              <p>
                To bring aviation enthusiasts together and
                create a friendly community of virtual pilots.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-number">03</div>

              <h3>Our Operations</h3>

              <p>
                To operate scheduled flights across a growing
                virtual British Airways network.
              </p>
            </div>

          </div>

        </ScrollReveal>
      </section>

    </main>
  );
}

export default About;