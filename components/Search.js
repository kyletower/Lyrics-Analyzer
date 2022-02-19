import { useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

const Search = ({ setGeniusData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGo = () => {
    if (!searchQuery) {
      return;
    }
    setIsLoading(true);
    fetch(`/api/getLyrics?q=${searchQuery}`)
      .then((res) => res.json())
      .then(
        (data) =>
          setGeniusData(data) || setIsLoading(false) || console.log(data)
      );
  };

  const keyPressHandler = (event) => {
    console.log(event.key);
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
      <button onClick={handleGo}>Go</button>
      {isLoading && (
        <p>
          <LoadingSpinner />
        </p>
      )}
    </>
  );
};

export default Search;
