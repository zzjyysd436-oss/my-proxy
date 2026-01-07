// Vercel 专用代理代码
export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 获取目标 URL（从路径中提取）
    const targetUrl = req.url.split('?')[0].slice(1) + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');

    if (!targetUrl.startsWith('http')) {
        return res.status(200).send('Vercel 备用代理已就绪！');
    }

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: req.headers,
        });

        const data = await response.arrayBuffer();
        res.status(response.status).send(Buffer.from(data));
    } catch (error) {
        res.status(500).send('代理错误: ' + error.message);
    }
}