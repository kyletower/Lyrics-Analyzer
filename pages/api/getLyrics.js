// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from 'node-fetch';

const API_URL = 'https://api.genius.com/';
// const API_CLIENT_ID =
//   'OnmDDkFJygIwtbqbtCzMWgCNo_u-uzTQNUlU8c7Uuu6p6Z9lhAlyIVk1UKTLJDfU';
// const API_CLIENT_SECRET =
//   'aQJioyNfV78zZopmWIvm7f3_0Dzz6Jrf3g6hqdwgmjZrp6pBoxASJl-zPfF1I_SmB6V8i356i6yCcVLnVmEwzQ';
const API_CLIENT_ACCESS_TOKEN =
  '2BFVGS1aXQXiTmuahLb1PbnfhksNqh5aRPGJ-CJR_8vfzMVhnCFb0s4qemBrvQq7';
// const API_SEARCH_URL = `${API_URL}search`;

export default function handler(req, res) {
  fetch(API_URL + 'songs/378195', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + API_CLIENT_ACCESS_TOKEN },
  }).then(function (response) {
    response.json().then(function (data) {
      res.status(200).json(data);
    });
  });
}
