import styles, { layout } from "../style";
import { features } from "../constants";
import ContactUs from "./ContactUs";

/**
 * Retrieves questions in constants/index.js and display.
 * 
 * @param {*} param0 
 */
const FeatureCard = ({ title, content, index }) => (
    <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-0" : "mb-0"} feature-card`}>
      <div className="flex-1 flex flex-col ml-3">
        <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1">
          {title}
        </h4>
        <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
          {content}
        </p>
      </div>
    </div>
  );

const Help = () => {
    return (
      <section className={layout.section}>
        <div className={layout.sectionInfo}>
          <h2 className={styles.heading2}>
            Frequently Asked Questions 
          </h2>
          <p className={`${styles.paragraph} max-w-[650px] mt-2`}>
            Curious about this image caption generator system? Look through our list of commonly asked questions or contact us for more information!
          </p>

          <div className="ss:flex hidden md:mr-4 mr-0 mt-10">
            <ContactUs />
          </div>
        </div>

        <div className={`${layout.sectionImg} flex-col`}>
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} {...feature} index={index} />
          ))}
        </div>
        
        {/* This button only shows in mobile devices */}
        <div className={`ss:hidden ${styles.flexCenter} mt-5 mb-5`}>
          <ContactUs />
        </div>
      </section>
    );
  };
  
  

export default Help;