import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  const [quote, setQuote] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:3000/quote')
    .then((res)=>{
      console.log("Quotes fetched successfully:", res.data)
      setQuote(res.data)
    })
    .catch((err)=>{
      console.error("Error fetching quotes:", err)
    })
  }, [])

  return (
    <>
    <h1>See Your Quotes</h1>
    {quote.map((q)=>{
      <div key={q.id}>
        <p>{q.text}</p>
      </div>
    })}
    </>
  )
}

export default App
