import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuizEditor from './components/QuizEditor';
import QuizTaker from './components/QuizTaker';
import ErrorPage from './components/ErrorPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-3">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-gray-800 hover:text-blue-600">Form Editor</Link>
              </li>
              <li>
                <Link to="/take-quiz" className="text-gray-800 hover:text-blue-600">Render Form</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<QuizEditor />} />
            <Route path="/take-quiz" element={<QuizTaker />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

