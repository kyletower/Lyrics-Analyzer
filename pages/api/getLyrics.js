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
  console.log(q);
  const response = await fetch(`${API_SEARCH_URL}${q}`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + API_CLIENT_ACCESS_TOKEN },
  });

  const data = await response.json();
  console.log(data);
  const urls = await getURLs(data);
  console.log({ urls });
  const lyricsAsTextArray = getLyricsAsText(urls);
  console.log({ lyricsAsTextArray });
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
  res.status(200).json(data);
}

const getURLs = (data) => {
  const hits = data.response.hits;
  // limit hits to 4
  if (hits.length > 4) {
    hits.splice(4, hits.length - 4);
  }
  const urls = hits.map((hit) => hit.result.url);
  return urls;
};

const getLyricsAsText = async (urls) => {
  const lyricsTextArray = [];
  urls.forEach((url) => {
    const dom = JSDOM.fromURL(url);

    // const domSerialized = dom.serialize();
    // div id="lyrics-root"
    // class="Lyrics__Container-sc-1ynbvzw-6 lgZgEN"
    const lyricsDiv =
      dom.window.document.querySelector('#lyrics-root') ||
      dom.window.document.querySelector(
        '.Lyrics__Container-sc-1ynbvzw-6 lgZgEN'
      );
    const lyricsDivAsString = lyricsDiv.innerHTML;
    const lyricsDivAsStringModifed = lyricsDivAsString.replaceAll(`<br>`, `\n`);

    lyricsDiv.innerHTML = lyricsDivAsStringModifed;
    const lyricsText = lyricsDiv.textContent;
    //   console.log(lyricsText);

    lyricsTextArray.push(lyricsText);
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
  for (let i = 0; i < lyricsArray.length; i++) {
    wordCounts.push(p.getWordCounts(lyricsArray[i]));
  }

  // // forEach doesn't exist for lyricsArray
  // lyricsArray.forEach((lyric) => {
  //   wordCounts.push(p.getWordCounts(lyric));
  // });

  //   console.log(wordCounts);
  return wordCounts;
  // return { lyrics, wordCounts };
};
