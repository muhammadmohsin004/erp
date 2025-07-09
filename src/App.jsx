
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Routes } from './routes/Route';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;