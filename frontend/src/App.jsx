import './App.css'
import { Routes, Route } from 'react-router-dom';
import Register from '../src/components/Register';
import Login from '../src/components/Login'
import Home from "../src/components/Home"
import Main from "../src/components/Main"
import Home2 from './components/Home2';
import QuestionDetail from './components/QuestionDetail';
import AskNewQuestion from './components/AskNewQuestion';

function App() {


  return (

    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      {/* <Route path="/" element={<Home2 />} /> */}
      <Route path="/question/:questionId" element={<QuestionDetail />} />
      <Route path='/ask-new-question' element={<AskNewQuestion />} />
      <Route path="/" element={<Main />} />
      {/* <Route path="/" element={<Main />} /> */}
    </Routes>


  )
}

export default App
