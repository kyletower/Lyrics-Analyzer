import React from 'react';

const Results = ({ geniusData }) => {
  return (
    <div>
      {geniusData &&
        geniusData.response.hits.map((hit, idx) => (
          <p key={idx}>{hit.result.full_title}</p>
        ))}
    </div>
  );
};

export default Results;
