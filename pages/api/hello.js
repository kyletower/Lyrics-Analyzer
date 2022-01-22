// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // const data = new URL(req.url, `http://${req.headers.host}`);

  console.dir(req.query);
  res.status(200).json(req.query);
}
