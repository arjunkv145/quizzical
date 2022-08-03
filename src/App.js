import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Quiz from './components/Quiz'
import NoMatch from './components/NoMatch'

function App() {
  return (
    <Router>
      <div className="main-container">
        <Routes>
          <Route path="/quizzical" element={<Home Link={Link}/>} />
          <Route path="/quizzical/quiz" element={<Quiz/>} />
          <Route path="*" element={<NoMatch useLocation={useLocation}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
