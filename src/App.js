import { useState , useEffect } from "react"
import axios from "axios";
import Pdf from "./Components/Pdf";
import Reply from "./Components/Reply";
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
    setButton("Loading...")
    axios.post('https://letthemcook-production.up.railway.app/ask', {
      text: parsedText,
      question: question
    })
      .then(response => {
        console.log('Response:', response.data);
        setReply(response.data.output);
        setList(prevList => [...prevList, response.data.output]);
        setQuestion("");
        setButton("Ask")
      })
      .catch(error => {
        console.error('Error:', error);
        setButton("Try Again?")
      })
  }

  function clearList() {
    setList([]);
  }

  function summarise(){
    setSummary("Loading...")
    axios.post('https://letthemcook-production.up.railway.app/summary', {
      text: parsedText,
    })
      .then(response => {
        console.log('Response:', response.data);
        setSummary(response.data.output);
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

  return (
    <div className="container"> 
      <h1 id="title">Chat with PDF</h1>

      <Pdf onParse={handleParse}></Pdf>
      <h5>Summary: {summary}</h5>
      <button onClick={clearList} className="clearButton">Clear</button>
      <ul className="replylist">
        {replyList.map((reply, index) => (
          <li key={index}><Reply reply={reply} /></li>
        ))}
      </ul>
      <div className="chat">
      <input type="text" value={question} onChange={(e) => { setQuestion(e.target.value) }}></input>
      <button onClick={ask}>{buttonText}</button>
      </div>
    </div>
  )
}

export default App;