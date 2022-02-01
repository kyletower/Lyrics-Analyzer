// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getURL } from 'next/dist/shared/lib/utils';
import fetch from 'node-fetch';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { API_CLIENT_ACCESS_TOKEN } = process.env;
// const API_CLIENT_ACCESS_TOKEN = '2BFVGS1aXQXiTmuahLb1PbnfhksNqh5aRPGJ-CJR_8vfzMVhnCFb0s4qemBrvQq7';
const API_SEARCH_URL = `https://api.genius.com/search?q=`;

// export default async handler = () => { } ???
export default async function handler(req, res) {
  const { q } = req.query;
  const response = await fetch(`${API_SEARCH_URL}${q}`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + API_CLIENT_ACCESS_TOKEN },
  });

  const data = await response.json();
  const urls = await getURLs(data);
  console.log({ urls });
  const lyricsAsTextArray = await getLyricsAsText(urls);
  // console.log({ lyricsAsTextArray });
  // data.response.hits[idx].result.lyrics_text
  // analyze lyrics func returns '' if clean, else returns list of explicit words
  const profaneWords = analyzeLyrics(lyricsAsTextArray);
  //   const totalNumberOfProfaneWords = Object.keys(profaneWords).length;
  //   console.log(
  //     url + ' ' + totalNumberOfProfaneWords === 0
  //       ? 'CLEAN'
  //       : 'EXPLICIT (' + totalNumberOfProfaneWords + ' profane words)'
  //   );
  console.log({ profaneWords });

  for (let i = 0; i < lyricsAsTextArray.length; i++) {
    data.response.hits[i].result.lyrics_text = lyricsAsTextArray[i];
    data.response.hits[i].result.explicit =
      Object.keys(profaneWords[i]).length !== 0;
    data.response.hits[i].result.explicit_words = Object.keys(profaneWords[i]);
  }
  // data.response.hits[idx].result.lyrics_text = lyricsAsTextArray[idx];

  res.status(200).json(data);
}

const getURLs = (data) => {
  const hits = data.response.hits;
  const MAX_RESULTS = 4;
  // limit hits to MAX_RESULTS
  if (hits.length > MAX_RESULTS) {
    hits.splice(MAX_RESULTS, hits.length - MAX_RESULTS);
  }
  const urls = hits.map((hit) => hit.result.url);
  return urls;
};

const getLyricsAsText = async (urls) => {
  const lyricsTextArray = [];

  const getDocumentsFromURLs = async (urls) => {
    const documents = [];
    for (let i = 0; i < urls.length; i++) {
      const dom = await JSDOM.fromURL(urls[i]);
      documents.push(dom);
    }

    return documents;
  };

  const documents = await getDocumentsFromURLs(urls);

  // const domSerialized = dom.serialize();
  // div id="lyrics-root"
  // class="Lyrics__Container-sc-1ynbvzw-6 lgZgEN"
  documents.forEach((dom) => {
    const lyricsDiv =
      dom.window.document.querySelector('#lyrics-root') ||
      dom.window.document.querySelector(
        '.Lyrics__Container-sc-1ynbvzw-6 lgZgEN'
      );
    const lyricsDivAsString = lyricsDiv.innerHTML;
    const lyricsDivAsStringModifed = lyricsDivAsString.replaceAll(`<br>`, `\n`);

    lyricsDiv.innerHTML = lyricsDivAsStringModifed;
    const lyricsText = lyricsDiv.textContent;
    // console.log(lyricsText);

    lyricsTextArray.push(lyricsText);
    console.log(lyricsTextArray.length);
    //   console.log({ lyricsTextArray });
  });

  return lyricsTextArray;
};

const analyzeLyrics = (lyricsArray) => {
  var Profane = require('profane');
  var p = new Profane();
  var wordCounts = [];
  p.removeWord('pis');
  p.removeWord('ho');
  // for (let i = 0; i < lyricsArray.length; i++) {
  //   wordCounts.push(p.getWordCounts(lyricsArray[i]));
  // }

  // // forEach doesn't exist for lyricsArray
  lyricsArray.forEach((lyric) => {
    wordCounts.push(p.getWordCounts(lyric));
  });

  //   console.log(wordCounts);
  return wordCounts;
  // return { lyrics, wordCounts };
};
