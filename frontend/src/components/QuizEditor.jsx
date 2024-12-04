import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const questionTypes = [
  { value: "fillInBlanks", label: "Fill in the Blanks" },
  { value: "comprehension", label: "Comprehension" },
  { value: "mcq", label: "Multiple Choice" },
];

const categories = [
  { value: "general", label: "General Knowledge" },
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "literature", label: "Literature" },
];

function QuizEditor() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/questions`);
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch questions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (type) => {
    try {
      setLoading(true);
      const newQuestion = {
        type,
        title: `New ${type} Question`,
        category: 'general',
        content: '',
        answers: ['', '', '', ''],
        correctAnswer: '0',
        points: 1,
        paragraph: type === 'comprehension' ? '' : undefined
      };

      const response = await axios.post(`${API_URL}/questions`, newQuestion, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setQuestions(prev => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError(`Failed to add ${type} question. Please try again.`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id, field, value) => {
    try {
      const updatedQuestion = questions.find(q => q._id === id);
      if (!updatedQuestion) return;

      const newQuestion = { ...updatedQuestion, [field]: value };
      
      await axios.put(`${API_URL}/questions/${id}`, newQuestion, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setQuestions(questions.map(q => q._id === id ? newQuestion : q));
      setError(null);
    } catch (err) {
      setError('Failed to update question');
      console.error('Error:', err);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${API_URL}/questions/${id}`);
      setQuestions(questions.filter(q => q._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete question');
      console.error('Error:', err);
    }
  };

  const renderQuestionEditor = (question) => (
    <div key={question._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{question.title}</h3>
        <button
          onClick={() => deleteQuestion(question._id)}
          className="text-red-600 hover:text-red-800 px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Title
          </label>
          <input
            type="text"
            value={question.title}
            onChange={(e) => updateQuestion(question._id, "title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={question.category}
            onChange={(e) => updateQuestion(question._id, "category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Content
          </label>
          <textarea
            value={question.content}
            onChange={(e) => updateQuestion(question._id, "content", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        {question.type === "comprehension" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paragraph
            </label>
            <textarea
              value={question.paragraph}
              onChange={(e) => updateQuestion(question._id, "paragraph", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Answer Options
          </label>
          {question.answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...question.answers];
                  newAnswers[index] = e.target.value;
                  updateQuestion(question._id, "answers", newAnswers);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
              />
              <input
                type="radio"
                name={`correct-${question._id}`}
                checked={question.correctAnswer === String(index)}
                onChange={() => updateQuestion(question._id, "correctAnswer", String(index))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points
          </label>
          <input
            type="number"
            min="0"
            value={question.points}
            onChange={(e) => updateQuestion(question._id, "points", Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Form Editor</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {questions.map(renderQuestionEditor)}

      <div className="fixed bottom-6 right-6 flex flex-col sm:flex-row gap-2">
        {questionTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => addQuestion(type.value)}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-full shadow-lg transition-colors"
          >
            Add {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizEditor;

