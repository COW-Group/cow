import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import Tickets from './pages/tickets/Tickets';
import CreateTicket from './pages/tickets/CreateTicket';
import TicketDetails from './pages/tickets/TicketDetails';
import KnowledgeBase from './pages/knowledge-base/KnowledgeBase';
import KnowledgeBaseSearch from './pages/knowledge-base/Search';
import KnowledgeBaseCategory from './pages/knowledge-base/Category';
import KnowledgeBaseArticle from './pages/knowledge-base/Article';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/search" element={<KnowledgeBaseSearch />} />
          <Route path="/knowledge-base/category/:slug" element={<KnowledgeBaseCategory />} />
          <Route path="/knowledge-base/article/:slug" element={<KnowledgeBaseArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;