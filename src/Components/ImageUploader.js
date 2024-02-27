import React, { useState } from "react";

const ImageUploader = ({onData}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonText,setText] = useState("Check Image"); 
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const [imageOutput,setOutput] = useState("");

  const handleUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const imageDataUrl = reader.result;
      const base64ImageData = imageDataUrl.split(",")[1];

      // Prepare the data to send to the API
      const image = {
      inlineData : {
        data: base64ImageData,
        mimeType: selectedFile.type,
      }};

      async function send (){

        try{
            setText("⚡Loading")
            setIsImageButtonDisabled(true)
            const response = await fetch('https://letthemcook-production.up.railway.app/imageupload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(image)
            });
            const data = await response.json();
            setOutput(data.output)
            setText("Check Image")
            setIsImageButtonDisabled(false)
            console.log(data.output)
            sendDataToParent(data.output);
        }
      
      catch(error){
        console.log(error)
        setText("Error?")
        setIsImageButtonDisabled(false);
      }
    }


    send();

    };
    reader.onerror = (error) => {
      console.error("Error reading the file:", error);
    };
  };


  const [isImageButtonDisabled, setIsImageButtonDisabled] = useState(false);

  const sendDataToParent = () => {
    // Call the function passed from the parent with the data
    onData(imageOutput);
  };

  return (
    <div id="imgContainer">
    <label>Image Upload:</label>
    <div id="imgUpload">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} id="imageBtn" disabled={isImageButtonDisabled}>{buttonText}</button>
    </div>
    </div>
  );
};

export default ImageUploader;
