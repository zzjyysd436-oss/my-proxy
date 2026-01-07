export default async function handler(req, res) {
    // 设置允许跨域的头信息
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // 处理预检请求
    if (req.method === 'OPTIONS') return res.status(200).end();

    // 从 URL 路径中提取目标地址
    // 比如：https://your-vercel.app/https://api.com
    const targetUrl = req.url.slice(1);
    
    if (!targetUrl.startsWith('http')) {
        return res.status(200).send('🚀 增强版代理运行中...');
    }

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                // 模拟真实浏览器，防止资源站拦截
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'zh-CN,zh;q=0.9'
            }
        });

        const data = await response.arrayBuffer();
        res.status(response.status).send(Buffer.from(data));
    } catch (e) {
        res.status(500).send('代理抓取失败: ' + e.message);
    }
}
