import { card } from "../assets";
import styles from "../style";
import React, {useState} from "react";
import axios from 'axios';

function Upload() {
  
  /**
   * State variable image to update image on webpage.
   * State variable selectedFile holds file input to be saved.
   */
  const [image, setImage] = useState()
  const [selectedFile, setSelectedFile] = useState(null);

  /**
   * This function handles the change of image on the webpage upon user selection of file.
   * 
   * @param {*} event 
   */
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
    hide();
    
  };

  /**
   * This function saves the uploaded file into static/uploads file. and calls the function to read and display report.
   * 
   */
  const handleFileUpload = async () => {
    var loading = document.getElementById("loading");
    var text_uploaded = document.getElementById("text_uploaded");
    loading.style.display="block";
    text_uploaded.style.display="none";
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      readFile();
      loading.style.display="none";
      text_uploaded.style.display="block";

    } catch (error) {
      console.log(error);
    }
  };
  
  /**
   * This function opens report.txt and displays it on webpage.
   * 
   */
  const [text, setText] = useState("");
  const readFile = async () => {
    try {
      const response = await fetch("./../../back-end/report.txt");
      const text = await response.text();
      setText(text);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This function hides all placeholder elements.
   * 
   */
  function hide(){
    var img_placeholder = document.getElementById("img_placeholder");
    var text_placeholder = document.getElementById("text_placeholder");

    img_placeholder.style.display= "none";
    text_placeholder.style.display= "none";
  }

  /**
   * This function shows ensures all placeholder elements are in place everytime the file reloads.
   * 
   */
  function defaultSettings(){
    var uploaded = document.getElementById("uploaded");
    var text_uploaded = document.getElementById("text_uploaded");
    var img_placeholder = document.getElementById("img_placeholder");
    var loading = document.getElementById("loading");

    if(img_placeholder.style.display== "none"){
      uploaded.style.display="block";
      
    }
    else{
      uploaded.style.display="none";
      text_uploaded.style.display="none";
      loading.style.display="none";
    }

  }

  return (
    <section onLoad={() => defaultSettings()} className={`flex ${styles.flexStart} items-center md:items-start md:flex-row flex-col ${styles.paddingY}`}>

    <div className={`flex ${styles.flexStart} ${styles.paddingX} flex-col items-center`}>
      <div className="mb-10">
        <input type="file" id="fileupload" accept="image/*" onChange={handleFileChange} className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}/>
      </div>

      {/* Display the image uploaded by user */}
      <div id ="uploaded">
        <img src={image} alt="uploadedimage" className="w-[100%] h-[100%] max-w-md" />
      </div>

      {/* Default image on webpage */}
      <div id ="img_placeholder">
        <img src={card} alt="imageplaceholder" className="w-[100%] h-[100%] max-w-md" />
      </div>

      <div className="mt-10 mb-10">
        <button onClick={handleFileUpload} disabled={!selectedFile} className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles} cursor-pointer`}>
          Upload
        </button>
      </div>
    </div>

    <div className={`${styles.flexStart} ${styles.paddingX} flex-col`}>
      <h2 className={styles.heading2}>
        Results
      </h2>

      <div id="text_placeholder" >
        <p className={`${styles.paragraph} max-w-[600px] mt-5`}>
          Here is where the report will be generated!
        </p> 
      </div>

      <div id="loading" >
        <p className={`${styles.paragraph} max-w-[600px] mt-5`}>
          Loading.............
        </p> 
      </div>

      {/* Displays the report generated */}
      <div id="text_uploaded">
        <p className={`${styles.paragraph} max-w-[600px] mt-5`}>
          {text}
        </p>
      </div>
    </div>

  </section>
  );
}

export default Upload;