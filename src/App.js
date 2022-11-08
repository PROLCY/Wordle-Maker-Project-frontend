import { Route, Routes } from 'react-router-dom';
import MakerPage from './pages/MakerPage';
import SolverPage from './pages/SolverPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MakerPage />} />
            <Route path="/solve/:maker" element={<SolverPage />} />
        </Routes>
    );
};

export default App;
