import Image from 'next/image';

const Results = ({ geniusData }) => {
  const handleSongClick = (event) => {
    console.log(event);
  };

  return (
    <div>
      {geniusData &&
        geniusData.response.hits.map((hit, idx) => (
          <>
            {/* <Image
              key={idx}
              src=''
              alt=''
              width={}
              height={}
            /> */}
            <p key={idx} onClick={handleSongClick}>
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
            <div
              className='lyrics'
              dangerouslySetInnerHTML={{ __html: hit.result.lyrics_innerHTML }}
            ></div>
          </>
        ))}
    </div>
  );
};

export default Results;
