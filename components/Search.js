import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Search = ({ setGeniusData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Display what the user is typing in the search box.
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Search API for user query.
  // NOTE: Switch to async await
  const handleGo = async () => {
    if (!searchQuery) {
      return;
    }
    setIsLoading(true);
    const res = await fetch(`/api/getLyrics?q=${searchQuery}`);
    const data = await res.json();
    setGeniusData(data);
    setIsLoading(false);
    console.log(data);
  };

  // Search when the user presses Enter.
  const keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      handleGo();
    }
  };

  return (
    <>
      <input
        onChange={handleChange}
        onKeyPress={(e) => keyPressHandler(e)}
        placeholder='Enter song/track title or artist or lyrics'
        type='search'
        value={searchQuery}
      />
      <button onClick={handleGo}>🔍</button>
      {isLoading && (
        <p>
          <LoadingSpinner />
        </p>
      )}
    </>
  );
};

export default Search;
