import { Route, Routes } from 'react-router-dom';
import MakerPage from './pages/MakerPage';
import SolverPage from './pages/SolverPage';
import LoadPage from './pages/LoadPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MakerPage />} />
            <Route path="/solve/:maker" element={<SolverPage />} />
            <Route path="/load/" element={<LoadPage />}/>
        </Routes>
    );
};

export default App;
