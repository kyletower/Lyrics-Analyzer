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
  // const response = await fetch(`${API_SEARCH_URL}${q}`, {
  // method: 'GET',
  // headers: { Authorization: 'Bearer ' + API_CLIENT_ACCESS_TOKEN },
  // });
  // const data = await response.json();
  // const urls = await getURLs(data);
  // const lyricsAsTextArray = await getLyricsAsTextArray(urls)

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
