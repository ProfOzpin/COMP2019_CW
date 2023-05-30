import styles from "./style";
import { Footer, Navbar, Hero, Help, Upload } from "./components";

const App = () => {
  console.log(window.location)
  let component
  switch (window.location.pathname){
    case "/":
      component = <Hero />
      break
    case "/Help":
      component = <Help />
      break
    case "/Upload":
      component = <Upload />
      break
  }

  // Navigation and footer is in every page.
  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          {component}
        </div>
      </div>
      
      <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
