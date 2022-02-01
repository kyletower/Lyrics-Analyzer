import Image from 'next/image';

const Results = ({ geniusData }) => {
  return (
    <div>
      {geniusData &&
        geniusData.response.hits.map((hit, idx) => (
          <>
            {/* <Image
              key={idx}
              src='/pages/explicit.png'
              alt='explicit content'
              width={200}
              height={127}
            /> */}
            <p key={idx}>
              <span className='red-bold-small'>
                {hit.result.explicit ? 'E ' : ''}
              </span>
              {hit.result.full_title}
              <span className='explicit-words'>
                {hit.result.explicit_words.length > 0 && ' [ '}
                {hit.result.explicit_words.map(
                  (explicit_word, idx) => explicit_word + ' '
                )}
                {hit.result.explicit_words.length > 0 && ' ]'}
              </span>
            </p>
          </>
        ))}
    </div>
  );
};

export default Results;
