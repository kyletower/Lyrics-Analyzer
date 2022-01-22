// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from 'node-fetch';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const API_URL = 'https://api.genius.com/';
// const API_CLIENT_ID =
//   'OnmDDkFJygIwtbqbtCzMWgCNo_u-uzTQNUlU8c7Uuu6p6Z9lhAlyIVk1UKTLJDfU';
// const API_CLIENT_SECRET =
//   'aQJioyNfV78zZopmWIvm7f3_0Dzz6Jrf3g6hqdwgmjZrp6pBoxASJl-zPfF1I_SmB6V8i356i6yCcVLnVmEwzQ';
const API_CLIENT_ACCESS_TOKEN =
  '2BFVGS1aXQXiTmuahLb1PbnfhksNqh5aRPGJ-CJR_8vfzMVhnCFb0s4qemBrvQq7';
const API_SEARCH_URL = `${API_URL}search?q=`;

export default function handler(req, res) {
  const { q } = req.query;
  fetch(`${API_SEARCH_URL}${q}`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + API_CLIENT_ACCESS_TOKEN },
  }).then((response) => {
    response.json().then((data) => {
      getURLs(data);
      res.status(200).json(data);
    });
  });
}

const getURLs = (data) => {
  //   getURL(data);
  //   return;
  const hits = data.response.hits;
  const urls = hits.map((hit) => hit.result.url);
  console.log(urls);
  urls.forEach((url) => {
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'text/html' },
    }).then((response) => {
      response.text().then((RAW_HTML) => {
        const dom = new JSDOM(`${RAW_HTML}`);
        // const lyrics = dom.window.document.querySelector('lyrics').textContent;
        // console.log(lyrics);
      });
    });
  });
  // lyrics = document.querySelector('.lyrics');
  // lyrics.textContent
};

// const getURL = (data) => {
//   const hit = data.response.hits[0];
//   const url = hit.result.url;

//   fetch(url, {
//     method: 'GET',
//     headers: { 'Content-Type': 'text/html' },
//   }).then((response) => {
//     response.text().then((RAW_HTML) => {
//       //   console.log(RAW_HTML);
//       const dom = new JSDOM(`${RAW_HTML}`);
//       const lyrics = dom.window.document.querySelector('.lyrics').textContent;
//       console.log(lyrics);
//     });
//   });
// };

// const getURL = (data) => {
//   const hit = data.response.hits[0];
//   const url = hit.result.url;

//   JSDOM.fromURL(url).then((dom) => {
//     console.log(dom);
//     // const lyrics = dom.window.document.querySelector('.lyrics');
//     // console.log(lyrics);
//   });
// };
