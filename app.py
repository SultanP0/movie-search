from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import sqlite3

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("OMDB_API_KEY")


def get_db():
    conn = sqlite3.connect("movies.db")
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS favorites (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            year TEXT NOT NULL,
            poster TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


@app.route("/")
def home():
    return jsonify({"message": "Movie API is running", "key_loaded": API_KEY is not None})


@app.route("/search")
def search():
    query = request.args.get("q", "")
    if query == "":
        return jsonify([])

    response = requests.get(
        "https://www.omdbapi.com/",
        params={"apikey": API_KEY, "s": query, "type": "movie"},
    )
    data = response.json()

    if data.get("Response") == "False":
        return jsonify([])

    movies = []
    for item in data["Search"]:
        movies.append(
            {
                "id": item["imdbID"],
                "title": item["Title"],
                "year": item["Year"],
                "poster": item["Poster"],
            }
        )
    return jsonify(movies)


@app.route("/favorites")
def get_favorites():
    conn = get_db()
    rows = conn.execute(
        "SELECT id, title, year, poster FROM favorites").fetchall()
    conn.close()

    favorites = []
    for row in rows:
        favorites.append(
            {"id": row[0], "title": row[1], "year": row[2], "poster": row[3]}
        )
    return jsonify(favorites)


@app.route("/favorites", methods=["POST"])
def add_favorite():
    data = request.get_json()
    conn = get_db()
    conn.execute(
        "INSERT OR IGNORE INTO favorites (id, title, year, poster) VALUES (?, ?, ?, ?)",
        (data["id"], data["title"], data["year"], data["poster"]),
    )
    conn.commit()
    conn.close()
    return jsonify(data), 201


@app.route("/favorites/<movie_id>", methods=["DELETE"])
def delete_favorite(movie_id):
    conn = get_db()
    conn.execute("DELETE FROM favorites WHERE id = ?", (movie_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Favorite removed"})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
