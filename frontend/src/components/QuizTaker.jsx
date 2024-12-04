import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function QuizTaker() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/questions`);
      setQuiz({ questions: response.data });
      setError(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to fetch questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (submitted) return; // Prevent multiple submissions

    let totalScore = 0;
    const responses = [];

    quiz.questions.forEach((question) => {
      const isCorrect = answers[question._id] === question.correctAnswer;
      if (isCorrect) {
        totalScore += question.points;
      }
      responses.push({
        questionId: question._id,
        answer: answers[question._id],
        isCorrect
      });
    });

    setScore(totalScore);
    setSubmitted(true);

    // Save responses to the backend
    try {
      await Promise.all(responses.map(response => 
        axios.post(`${API_URL}/responses`, response)
      ));
    } catch (error) {
      console.error('Error saving responses:', error);
      setError('Failed to save responses. Your score may not be recorded.');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!quiz) return <div className="text-center py-8">No questions available.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Take Quiz</h1>
      {quiz.questions.map((question) => (
        <div key={question._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
          {question.type === 'comprehension' && (
            <p className="mb-4 text-gray-600">{question.paragraph}</p>
          )}
          <p className="mb-4">{question.content}</p>
          <div className="space-y-2">
            {question.answers.map((answer, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={String(index)}
                  checked={answers[question._id] === String(index)}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  disabled={submitted}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-700">{answer}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={submitted}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
          submitted
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {submitted ? 'Quiz Submitted' : 'Submit Quiz'}
      </button>
      {score !== null && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="text-xl font-semibold text-green-800">
            Your Score: {score} / {quiz.questions.reduce((total, q) => total + q.points, 0)}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizTaker;

