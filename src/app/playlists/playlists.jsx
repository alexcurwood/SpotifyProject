import "./playlists.css";
import { useState } from "react";

export default function Playlists({ playlists }) {
  const [displayPlaylists, setDisplayPlaylists] = useState(true);
  const [genreButtons, setGenreButtons] = useState();
  const [playlistId, setPlaylistId] = useState();

  function handleClick(e) {
    setDisplayPlaylists(false);
    setPlaylistId(e.target.id);
    createGenreButtons(e.target.id);
  }

  async function createGenreButtons(playlistId) {
    const access_token = localStorage.getItem("access_token");
    const json = await getPlaylist(playlistId, access_token);
    let genres = [];
    json.tracks.items.map((track) => {
      if (track.track.artists[0].name) {
        // for (genre of track.track.artists[0].name) {
        //   if (!genre in genres) {
        //     genres.append(genre);
        //   }
        // }
        genres.push(track.track.artists[0].name);
      }
    });
    let genreButtons = genres.map((genre) => <button>{genre}</button>);
    setGenreButtons(genreButtons);
  }

  async function getPlaylist(playlistId, access_token) {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    const json = await response.json();
    return json;
  }

  function handleBack() {
    setDisplayPlaylists(true);
  }

  let playlistContainers = playlists.map((playlist) => (
    <div className="playlistContainer">
      <p>{playlist.name}</p>
      <button id={playlist.id} onClick={(e) => handleClick(e)}>
        Use Playlist
      </button>
    </div>
  ));

  return (
    <div className="playlists">
      {displayPlaylists ? (
        <div>{playlistContainers}</div>
      ) : (
        <div>
          <button onClick={handleBack}>Back</button>
          <div className="genre-buttons">{genreButtons}</div>
          <iframe
            className="playlist"
            style={{ borderRadius: 12 + "px" }}
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
            height="700"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
}
