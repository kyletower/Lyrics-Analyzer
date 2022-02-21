// TO DO:
// full lyrics displays profane words highlighted
// Loading spinner
import Image from 'next/image';
// import { useEffect } from 'react';

const Results = ({ geniusData }) => {
  const handleSongClick = (event) => {
    console.log(event.target.nextElementSibling.classList);
    event.target.nextElementSibling.classList.toggle('hidden');
  };

  // badWords = ['poop']
  const highlightBadWords = (badWords, lyricsHTML) => {
    badWords.forEach((badWord) => {
      console.log('highlighting the baddies:' + badWord);
      let reBadWord = new RegExp(`\\b${badWord}\\b`, 'ig');
      lyricsHTML = lyricsHTML.replaceAll(
        reBadWord,
        `<span class="highlight">${badWord}</span>`
      );
    });

    return lyricsHTML;
  };

  // for each profane word, find profane word and replace
  // with <span class="profane">profanity</span>
  return (
    <div>
      {geniusData &&
        geniusData.response.hits.map((hit, idx) => (
          <>
            <Image
              key={idx}
              src={hit.result.header_image_thumbnail_url}
              alt='album cover'
              width={50}
              height={50}
              // layout='responsive'
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
              {/* { find badWord replace with <span class='highlight'>badWord</span>} */}
            </p>

            <div
              className='lyrics hidden'
              dangerouslySetInnerHTML={{
                __html: highlightBadWords(
                  hit.result.explicit_words,
                  hit.result.lyrics_innerHTML
                ),
              }}
            ></div>
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
