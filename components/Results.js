// TO DO:
// Album Thumbnail: ...result.header_image_thumbnail_url
// Clicking on a result displays full lyrics
// full lyrics displays profane words highlighted
// https://images.genius.com/fbb184d87696e22dfa4a9eaebaed0a8f.300x300x1.jpg
//              src={hit.result.header_image_thumbnail_url}

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
            <Image
              key={idx}
              src={hit.result.header_image_thumbnail_url}
              alt='album cover'
              width={25}
              height={25}
              layout='responsive'
            />
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
            {/* <div
              className='lyrics'
              dangerouslySetInnerHTML={{ __html: hit.result.lyrics_innerHTML }}
            ></div> */}
          </>
        ))}
    </div>
  );
};

export default Results;
// Note: should I use
// import parse from "html-react-parser";
/* <div className='lyrics'>{parseFloat(hit.result.lyrics_innerHTML}</div> */
// in lieu of dangerouslySetInnerHTML
