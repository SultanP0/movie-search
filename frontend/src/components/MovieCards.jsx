function MovieCards(props) {
  return (
    <div className="movie-card">
      {props.poster !== "N/A" ? (
        <img src={props.poster} alt={props.title} />
      ) : (
        <p>No poster</p>
      )}
      <h3>{props.title}</h3>
      <p>{props.year}</p>
      <button className="fav-button" onClick={props.onToggle}>
        {props.isFavorite ? "Remove" : "Save"}
      </button>
    </div>
  );
}

export default MovieCards;