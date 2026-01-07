export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 修复 404 问题：如果直接访问根目录，返回一个欢迎信息
    const urlPath = req.url.startsWith('/') ? req.url.slice(1) : req.url;
    
    if (!urlPath || !urlPath.startsWith('http')) {
        return res.status(200).send('<h1>🚀 备用加速节点已就绪</h1><p>请通过影视网页访问本接口。</p>');
    }

    try {
        const response = await fetch(urlPath, {
            method: req.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Referer': new URL(urlPath).origin
            }
        });
        const data = await response.arrayBuffer();
        res.status(response.status).send(Buffer.from(data));
    } catch (e) {
        res.status(500).send('抓取失败: ' + e.message);
    }
}
