# Form Builder

## Description

This is a comprehensive full-stack Form Builder built with React for the frontend and Node.js with Express for the backend. It allows users to create, edit, and take questions on various topics, with support for multiple question types and real-time scoring.

## Features

- Form Editor:
  - Create and questions with multiple question types:
    - Multiple Choice
    - Fill in the Blanks
    - Comprehension (with paragraph)
  - Add, edit, and delete questions
  - Set points for each question
  - Categorize questions
- Form Taker:
  - Take Questions with a user-friendly interface
  - Real-time answer selection
  - Immediate feedback upon submission
  - Score calculation and display
- Error handling and display for both frontend and backend
- RESTful API for quiz operations

## Technologies Used

### Frontend:

- React (Create React App)
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Error Boundary for React error handling

### Backend:

- Node.js
- Express.js for server framework
- MongoDB for database
- Mongoose for object modeling
- Cors for handling Cross-Origin Resource Sharing
- Dotenv for environment variable management

# Form Builder

[... Keep the existing content ...]

## API Endpoints

The backend provides the following API endpoints:

### Questions

#### Get All Questions

- Method: GET
- URL: `/api/questions`
- Description: Retrieves all questions from the database.
- Response: An array of question objects.
- Example Response:
  ```json
  [
    {
      "_id": "60d3b41ef682fbd39c74cb3a",
      "type": "mcq",
      "title": "What is the capital of France?",
      "category": "geography",
      "content": "Choose the correct answer.",
      "answers": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": "2",
      "points": 1
    }
    // ... more questions
  ]
  ```
