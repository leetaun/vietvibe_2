/** Keep three base64 images comfortably below Vercel's request payload limit. */
export async function prepareTryOnImage(source: string): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('Không đọc được ảnh thử đồ. Bạn chọn lại ảnh nhé.'));
    element.src = source;
  });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context || !image.naturalWidth || !image.naturalHeight) throw new Error('Không xử lý được ảnh thử đồ.');
  let scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
  for (let attempt = 0; attempt < 7; attempt++) {
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL('image/jpeg', .88);
    if (result.length <= 900_000) return result;
    scale *= .8;
  }
  throw new Error('Ảnh quá lớn để gửi. Bạn chọn ảnh nhỏ hơn nhé.');
}
