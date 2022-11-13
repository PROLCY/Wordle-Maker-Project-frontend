import { Route, Routes } from 'react-router-dom';
import MakerPage from './pages/MakerPage';
import SolverPage from './pages/SolverPage';
import LoadPage from './pages/LoadPage';
import TestPage from './pages/TestPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MakerPage />} />
            <Route path="/solve/:maker" element={<SolverPage />} />
            <Route path="/load/" element={<LoadPage />}/>
            <Route path="/test/" element={<TestPage/>}/>
        </Routes>
    );
};

export default App;
