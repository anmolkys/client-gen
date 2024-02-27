import React from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const Pdf = ({ onParse }) => {
    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function (event) {
        const pdfData = new Uint8Array(event.target.result);
        extractTextFromPdf(pdfData);
      };
      reader.readAsArrayBuffer(file);
    }
  
    async function extractTextFromPdf(pdfData) {
      const pdfDoc = await pdfjs.getDocument(pdfData).promise;
      const numPages = pdfDoc.numPages;
      let pdfText = "";
  
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join("\n");
        pdfText += pageText + "\n";
      }
  
      onParse(pdfText.trim());
    }
  
    return (
      <div>
        <input type="file" onChange={handleFileUpload} />
      </div>
    );
  };
  
  export default Pdf;