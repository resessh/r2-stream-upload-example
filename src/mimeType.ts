const availableMimeTypes: Record<string, string> = {
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/tiff': 'tiff',
	'image/webp': 'webp',
	'image/avif': 'avif',
};

export function extension(mimeType: string): string | false {
	return availableMimeTypes[mimeType] || false;
}
