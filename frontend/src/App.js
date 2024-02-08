import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import POSPage from './pages/POSPage';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/pos' element={<POSPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
