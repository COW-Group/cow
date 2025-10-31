import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../components/home/HomePage';
import { BoardView } from '../components/board/BoardView';

export function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board/:boardId" element={<BoardView />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
