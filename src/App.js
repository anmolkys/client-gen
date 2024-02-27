import { useState , useEffect } from "react"
import axios from "axios";
import Pdf from "./Components/Pdf";
import Reply from "./Components/Reply";
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import ImageUploader from "./Components/ImageUploader";
import "./App.css"

const App = () => {

  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [parsedText, setParsedText] = useState("");
  const [summary,setSummary] = useState("")
  const handleParse = (text) => {
    setParsedText(text);
  };
  let debounceTimer;

  const [replyList,setList] = useState([])
  const [buttonText,setButton] = useState("Ask");

  function ask() {
    setButton("⚡Loading")
    setIsAskButtonDisabled(true);
    axios.post('https://letthemcook-production.up.railway.app/ask', {
      text: parsedText,
      question: question
    })
      .then(response => {
        console.log('Response:', response.data);
        let richText = documentToPlainTextString(response.data.output)
        setReply(richText);
        setList(prevList => [...prevList, documentToPlainTextString(response.data.output)]);
        setQuestion("");
        setButton("Ask")
        setIsAskButtonDisabled(false)
      })
      .catch(error => {
        console.error('Error:', error);
        setButton("Try Again?")
        setIsAskButtonDisabled(false)
      })
  }

  function clearList() {
    setList([]);
  }

  function summarise(){
    setSummary("⚡Loading")
    axios.post('https://letthemcook-production.up.railway.app/summary', {
      text: parsedText,
    })
      .then(response => {
        console.log('Response:', response.data);
        let richText = documentToPlainTextString(response.data.output)
        setSummary(richText);
      })
      .catch(error => {
        console.error('Error:', error);
        setSummary(error)
      })
  }



  useEffect(() => {
    // Debounce the summarise function for parsedText
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (parsedText !== "") {
        summarise();
      }
    }, 500); // Adjust the delay time as needed
  }, [parsedText]);

  const [dataFromChild, setDataFromChild] = useState('');

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };

  useEffect(()=>{
    setList(prevList => [...prevList, dataFromChild]);
  },[dataFromChild])

  const [isAskButtonDisabled,setIsAskButtonDisabled] = useState(false);

  return (
    <div className="container"> 
      <h1 id="title">Chat with PDF</h1>
      <div id="upload">
        <Pdf onParse={handleParse}></Pdf>
        <ImageUploader onData={handleDataFromChild}></ImageUploader>
      </div>
      <h5>Summary: {summary}</h5>
      <button onClick={clearList} className="clearButton">Clear</button>
      <ul className="replylist">
        {replyList.map((reply, index) => (
          <li key={index}><Reply reply={reply} /></li>
        ))}
      </ul>
      <div className="chat">
      <input type="text" value={question} onChange={(e) => { setQuestion(e.target.value) }}></input>
      <button onClick={ask} disabled={isAskButtonDisabled}>{buttonText}</button>
      </div>
    </div>
  )
}

export default App;