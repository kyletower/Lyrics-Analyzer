// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from 'node-fetch';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { API_CLIENT_ACCESS_TOKEN } = process.env;
const API_SEARCH_URL = `https://api.genius.com/search?q=`;

export default async function handler(req, res) {
  const { q } = req.query;
  const response = await fetch(`${API_SEARCH_URL}${q}`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + API_CLIENT_ACCESS_TOKEN },
  });
  const data = await response.json();
  getURLs(data);
  res.status(200).json(data);
}

const getURLs = data => {
  //   getURL(data);
  //   return;
  const hits = data.response.hits;
  const urls = hits.map(hit => hit.result.url);
  console.log(urls);
  //! fetching inside of a forEach is tricky. It doesn't wait for the one fetch to finish before
  //! it moves on to the next thing. It might be best to do a map and then do Promise.all
  urls.forEach(url => {
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'text/html' },
    }).then(response => {
      response.text().then(RAW_HTML => {
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
