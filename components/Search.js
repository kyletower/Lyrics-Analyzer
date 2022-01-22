import { useState } from 'react';

const Search = ({ setGeniusData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleChange = event => {
    setSearchQuery(event.target.value);
  };
  const handleGo = () => {
    if (!searchQuery) {
      return;
    }

    fetch(`/api/getLyrics?q=${searchQuery}`)
      .then(response => response.json())
      .then(data => setGeniusData(data) || console.log(data));
  };
  return (
    <>
      <input
        onChange={handleChange}
        placeholder='Enter song/track title'
        type='search'
        value={searchQuery}
      />
      <button onClick={handleGo}>Go</button>
    </>
  );
};

export default Search;
