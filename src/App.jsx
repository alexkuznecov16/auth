import Header from './Components/Header/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Auth from './auth/auth'
import Footer from './Components/Footer/Footer';
import Todos from './Components/Todos/Todos';


const App = () => {
  return (
    <>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" exact element={<Todos />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  )
}

export default App