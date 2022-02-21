import fetch from 'node-fetch';
import Profane from 'profane';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { API_CLIENT_ACCESS_TOKEN } = process.env;
const API_SEARCH_URL = `https://api.genius.com/search?q=`;

// NOTE: Switch to an arrow function:
// export default async handler = () => { } ???
export default async function handler(req, res) {
  const { q } = req.query;
  const response = await fetch(`${API_SEARCH_URL}${q}`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + API_CLIENT_ACCESS_TOKEN },
  });

  const data = await response.json();
  const urls = await getURLs(data);
  const lyricsAsTextArray = await getLyricsAsTextArray(urls);
  const profaneWords = analyzeLyrics(lyricsAsTextArray);
  updateData(data, profaneWords, lyricsAsTextArray);

  res.status(200).json(data);
}

const getLyricsAsTextArray = async (urls) => {
  const lyricsAsTextArray = [];
  const documents = await getDocumentsFromURLs(urls);

  documents.forEach((dom) => {
    const lyricsDiv =
      dom.window.document.querySelector('#lyrics-root') ||
      dom.window.document.querySelector(
        '.Lyrics__Container-sc-1ynbvzw-6 lgZgEN'
      );

    convertAnchorTagsToParagraphTags(dom, lyricsDiv);
    removeElementsByClassName('Lyrics__Footer-sc-1ynbvzw-2 lYpBt', lyricsDiv);
    removeElementsWithEmptyTextContent(lyricsDiv);
    // removeExtraBRTags(lyricsDiv);

    const lyricsText = lyricsDiv.textContent;

    lyricsAsTextArray.push({
      lyricsText: lyricsText,
      lyricsInnerHTML: lyricsDiv.innerHTML,
    });
  });

  return lyricsAsTextArray;
};

const getDocumentsFromURLs = async (urls) => {
  const documents = [];
  for (let i = 0; i < urls.length; i++) {
    const dom = await JSDOM.fromURL(urls[i]);
    documents.push(dom);
  }

  return documents;
};

const convertAnchorTagsToParagraphTags = (dom, lyricsDiv) => {
  // Select all anchor tags and replace with p tags.
  let aTags = lyricsDiv.getElementsByTagName('a');

  while (aTags.length > 0) {
    const p = dom.window.document.createElement('p');
    p.innerHTML = aTags[0].innerHTML;
    aTags[0].replaceWith(p);
  }

  return lyricsDiv;
};

const removeElementsByClassName = (className, html) => {
  let tagsToRemove = html.getElementsByClassName(className);

  while (tagsToRemove[0]) {
    tagsToRemove[0].parentNode.removeChild(tagsToRemove[0]);
  }
};

const removeElementsByTagName = (tagName, html) => {
  let tagsToRemove = html.getElementsByTagName(tagName);

  while (tagsToRemove[0]) {
    tagsToRemove[0].parentNode.removeChild(tagsToRemove[0]);
  }
};

const removeElementsWithEmptyTextContent = (lyricsDiv) => {
  let tags = lyricsDiv.getElementsByTagName('*');

  for (let i = tags.length - 1; i > 0; i--) {
    if (tags[i].nodeName !== 'BR' && tags[i].textContent === '') {
      tags[i].parentNode.removeChild(tags[i]);
    }
  }
};

const removeExtraBRTags = (lyricsDiv) => {
  // find br's whose parent is not a span and delete
  let brTags = lyricsDiv.getElementsByTagName('br');
  for (let i = brTags.length - 1; i > 0; i--) {
    if (brTags[i].parentNode.nodeName !== 'SPAN') {
      console
        .log
        // 'removing br tag with parent of ' + brTags[i].parentNode.nodeName
        ();
      brTags[i].parentNode.removeChild(brTags[i]);
    }
  }
};

const getURLs = (data) => {
  const hits = data.response.hits;
  const MAX_RESULTS = 3;

  // Limit results.
  if (hits.length > MAX_RESULTS) {
    hits.splice(MAX_RESULTS, hits.length - MAX_RESULTS);
  }

  const urls = hits.map((hit) => hit.result.url);
  return urls;
};

const analyzeLyrics = (lyricObjects) => {
  var profanity = new Profane();
  profanity.setUseWholeWordMatch(true);
  var wordCounts = [];

  lyricObjects.forEach((lyricObject) => {
    wordCounts.push(profanity.getWordCounts(lyricObject.lyricsText));
  });

  return wordCounts;
  // return { lyrics, wordCounts };  // for highlighting in context of full lyrics
};

const updateData = (data, profaneWords, lyricsAsTextArray) => {
  // Update data to contain lyrics_text, lyrics_innerHTML, explicit, and explicit_words
  for (let i = 0; i < lyricsAsTextArray.length; i++) {
    data.response.hits[i].result.lyrics_text = lyricsAsTextArray[i].lyricsText;
    data.response.hits[i].result.lyrics_innerHTML =
      lyricsAsTextArray[i].lyricsInnerHTML;
    data.response.hits[i].result.explicit_words = Object.keys(profaneWords[i]);
    // NOTE: Below is a bit redundant due to the above explicit_words data
    data.response.hits[i].result.explicit =
      Object.keys(profaneWords[i]).length !== 0;
  }
};
