import Image from 'next/image';

const Results = ({ geniusData }) => {
  // Show/hide the song lyrics.
  const handleSongClick = (event) => {
    event.target.nextElementSibling.classList.toggle('hidden');
  };

  // Given a list of bad words and a DOMString, wrap each bad word into a span
  // with a class of highlight.
  const highlightBadWords = (badWords, lyricsHTML) => {
    badWords.forEach((badWord) => {
      // Match the bad word exactly \b...\b, case insensitive
      let reBadWord = new RegExp(`\\b${badWord}\\b`, 'ig');
      lyricsHTML = lyricsHTML.replaceAll(
        reBadWord,
        `<span class="highlight">${badWord}</span>`
      );
    });

    return lyricsHTML;
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
              width={50}
              height={50}
            />
            <p key={idx} onClick={handleSongClick}>
              <span key={idx} className='red-bold-small'>
                {hit.result.explicit ? 'E ' : ''}
              </span>
              {hit.result.full_title}
              <span key={idx} className='explicit-words'>
                {hit.result.explicit_words.length > 0 && ' [ '}
                {hit.result.explicit_words.map(
                  (explicit_word) => explicit_word + ' '
                )}
                {hit.result.explicit_words.length > 0 && ' ]'}
              </span>
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
// in lieu of dangerouslySetInnerHTML?
