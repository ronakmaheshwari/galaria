import './App.css'
import LandingPage from './LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import FileStore from './Files';
import SharedPage from './SharedPage';
import Upload from './Upload';
import OTPPage from './otp-page';


function App() {
  return (
      <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/files" element={<FileStore />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/otp" element={<OTPPage />} />
              <Route path='/share/:sharedId' element={<SharedPage />}/>
              <Route path='/upload' element={<Upload />} />
            </Routes>
      </Router>
   
  )
}

export default App
