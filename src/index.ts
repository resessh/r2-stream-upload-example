import { Hono } from 'hono';
import { extension } from './mimeType';

const app = new Hono<{ Bindings: Env }>();

// ファイルアップロード用APIエンドポイント（ストリーム対応）
app.post('/api/upload', async (c) => {
	try {
		const contentType = c.req.header('Content-Type') || '';
		const ext = extension(contentType);
		if (!ext) {
			return c.json({ error: '無効なコンテンツタイプです' }, 400);
		}

		const stream = c.req.raw.body;
		if (!stream) {
			return c.json({ error: 'ファイルが見つかりません' }, 400);
		}

		const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
		await c.env.MY_BUCKET.put(fileName, stream, {
			httpMetadata: {
				contentType: contentType,
			},
		});

		return c.json({
			success: true,
			message: 'ファイルがアップロードされました',
			fileName: fileName,
		});
	} catch (error) {
		console.error('Upload error:', error);
		return c.json({ error: 'アップロードに失敗しました' }, 500);
	}
});

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
