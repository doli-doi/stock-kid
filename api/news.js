export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'query required' });

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=3&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        }
      }
    );
    const data = await response.json();
    const news = data.items.map(item => ({
      title: item.title.replace(/<[^>]*>/g, ''),
      url: item.link,
      date: new Date(item.pubDate).toLocaleDateString('ko-KR'),
      description: item.description.replace(/<[^>]*>/g, '')
    }));
    res.status(200).json({ news });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
