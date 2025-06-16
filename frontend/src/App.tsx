import './App.css'
import { Button } from './components/ui/button'
import FileManagerPage from './FileManagerPage';
import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/files" element={<FileManagerPage />} />
         <Route path="/signup" element={<SignUp />} />
           <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  )
}

export default App
