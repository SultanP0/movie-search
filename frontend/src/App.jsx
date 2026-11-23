import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieCards from "./components/MovieCards";
import Navbar from "./components/Navbar";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data));
  }, []);

  function handleSearch() {
    fetch(`http://127.0.0.1:5000/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }

  function addFavorite(movie) {
    fetch("http://127.0.0.1:5000/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    }).then(() => {
      setFavorites([...favorites, movie]);
    });
  }

  function removeFavorite(id) {
    fetch(`http://127.0.0.1:5000/favorites/${id}`, {
      method: "DELETE",
    }).then(() => {
      setFavorites(favorites.filter((movie) => movie.id !== id));
    });
  }

  return (
    <BrowserRouter>
      <h1>Movie Search</h1>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search for a movie"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
              </div>

              <div className="movie-grid">
                {movies.map((movie) => {
                  const isFavorite = favorites.some(
                    (fav) => fav.id === movie.id
                  );
                  return (
                    <MovieCards
                      key={movie.id}
                      title={movie.title}
                      year={movie.year}
                      poster={movie.poster}
                      isFavorite={isFavorite}
                      onToggle={() =>
                        isFavorite
                          ? removeFavorite(movie.id)
                          : addFavorite(movie)
                      }
                    />
                  );
                })}
              </div>
            </div>
          }
        />
        <Route
          path="/favorites"
          element={
            <div>
              {favorites.length === 0 && (
                <p style={{ textAlign: "center" }}>No favorites yet.</p>
              )}
              <div className="movie-grid">
                {favorites.map((movie) => (
                  <MovieCards
                    key={movie.id}
                    title={movie.title}
                    year={movie.year}
                    poster={movie.poster}
                    isFavorite={true}
                    onToggle={() => removeFavorite(movie.id)}
                  />
                ))}
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;