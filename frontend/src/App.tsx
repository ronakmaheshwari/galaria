import './App.css'
import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import FileStore from './Files';
import SharedPage from './lib/SharedPage';
import Upload from './Upload';

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/files" element={<FileStore />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/share/:sharedId' element={<SharedPage />}/>
        <Route path='/upload' element={<Upload />} />
      </Routes>
    </Router>
  )
}

export default App
