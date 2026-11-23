# Movie Search App

A full stack movie search app. Search for any movie, save your favorites, and view them on a separate page.

## Features

- Search movies using the OMDb API
- Save and remove favorites (stored in a SQLite database)
- Multiple pages with React Router (Search and Favorites)

## Tech Stack

- **Frontend:** React, Vite, React Router
- **Backend:** Python, Flask, flask-cors
- **Database:** SQLite
- **API:** OMDb

## How to Run It

You need Python, Node.js, and a free OMDb API key from https://www.omdbapi.com/apikey.aspx

### 1. Backend

From the main folder:

```
pip install flask flask-cors requests python-dotenv
```

Create a file named `.env` in the main folder with one line:

```
OMDB_API_KEY=your_key_here
```

Then start the server:

```
python app.py
```

### 2. Frontend

In a second terminal:

```
cd frontend
npm install
npm run dev
```

Open the link Vite shows (usually http://localhost:5173).

## What I Learned

- Building a Flask API with GET, POST, and DELETE routes
- Keeping API keys secret with a `.env` file
- Connecting a React frontend to a Flask backend
- Passing props and callbacks between React components
- Using React Router for multiple pages