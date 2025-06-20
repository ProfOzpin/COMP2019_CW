import Link from "next/link";
const robot = "/assets/robot.png";
const arrowUp = "/assets/arrow-up.svg";

const Hero = () => {
  return (
    <div className="app-container">
      <div className="main-content-card" style={{ position: "relative", overflow: "hidden" }}>
        {/* Decorative gradients */}
        <div className="pink__gradient"></div>
        <div className="white__gradient"></div>
        <div className="blue__gradient"></div>

        {/* Tagline */}
        <div style={{
          display: "inline-block",
          background: "linear-gradient(125.17deg, #272727 0%, #11101d 100%)",
          borderRadius: "10px",
          padding: "6px 18px",
          marginBottom: "1.2rem",
          fontWeight: 500,
          fontSize: "1rem"
        }}>
          <span style={{ color: "#fff" }}>Group B</span> SEGP
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.2em" }}>Imag.e</h1>
        <h2 style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1.5em",
          background: "radial-gradient(64.18% 64.18% at 71.16% 35.69%, #def9fa 0.89%, #bef3f5 17.23%, #9dedf0 42.04%, #7de7eb 55.12%, #5ce1e6 71.54%, #33bbcf 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textFillColor: "transparent"
        }}>
          Face Recognition
        </h2>

        {/* Get Started Button */}
        <Link href="/upload">
          <span className="get-started-button">
            Get Started
            <img src={arrowUp} alt="arrow up" />
          </span>
        </Link>

        {/* Description */}
        <p>
          Welcome to Group B face recognition web application.<br />
          Generate information of a person by inputting their image into our system.
        </p>

        {/* Robot Image */}
        <img src={robot} alt="robot" style={{ marginTop: "2em", width: "60%", maxWidth: "260px" }} />
      </div>
    </div>
  );
};

export default Hero;
