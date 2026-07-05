import { SermonQuote } from '../types';

export interface ExportConfig {
  format: 'story' | 'square' | 'pinterest' | 'standard';
  platform: 'instagram' | 'whatsapp' | 'facebook' | 'pinterest' | 'x' | 'linkedin' | 'image' | 'video';
}

export function exportQuoteCardToImage(quote: SermonQuote, config: ExportConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Determine canvas dimensions based on format
      let width = 1080;
      let height = 1080; // Default square (1:1)

      if (config.format === 'story') {
        width = 1080;
        height = 1920; // Story (9:16)
      } else if (config.format === 'pinterest') {
        width = 1000;
        height = 1500; // Pinterest (2:3)
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get 2D canvas context');
      }

      // 1. Draw Background
      if (quote.bgType === 'solid') {
        ctx.fillStyle = quote.background;
        ctx.fillRect(0, 0, width, height);
      } else if (quote.bgType === 'gradient' || quote.bgType === 'illustration') {
        // Simple linear gradient parser (e.g. "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)")
        // We will create a diagonal gradient as a robust representation
        const grad = ctx.createLinearGradient(0, 0, width, height);
        
        // Extract hex colors
        const hexMatches = quote.background.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
        if (hexMatches && hexMatches.length >= 2) {
          const step = 1 / (hexMatches.length - 1);
          hexMatches.forEach((color, idx) => {
            grad.addColorStop(idx * step, color);
          });
        } else {
          // Fallback defaults
          grad.addColorStop(0, '#1e3a8a');
          grad.addColorStop(1, '#93c5fd');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Add a subtle vignette or radial overlay for illustrations
      if (quote.bgType === 'illustration') {
        const radGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.8);
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Elegant Border/Box Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      if (quote.textColor.includes('slate-900') || quote.textColor.includes('stone-900')) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      }
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // 3. Draw Brand/App Logo
      ctx.fillStyle = quote.textColor.includes('slate-900') || quote.textColor.includes('stone-900') ? '#0f172a' : '#ffffff';
      ctx.textAlign = 'center';
      
      // Draw "S E L A H" Header
      ctx.font = 'bold 24px "Space Grotesk", "Inter", sans-serif';
      ctx.fillText('S E L A H', width / 2, height * 0.08);

      // Draw Scripture category/topic tag
      ctx.font = '500 18px "Space Grotesk", "Inter", sans-serif';
      ctx.fillText(`•  ${quote.topic.toUpperCase()}  •`, width / 2, height * 0.11);

      // 4. Draw Quote Body (Multiline Word Wrapping)
      const maxTextWidth = width - 180;
      let fontSize = width > 1000 ? 46 : 38;
      
      // Select Font family based on template
      let fontFamily = '"Playfair Display", "Georgia", serif';
      if (quote.templateId === 'modern' || quote.templateId === 'youth') {
        fontFamily = '"Space Grotesk", "Impact", sans-serif';
        fontSize = width > 1000 ? 56 : 46;
      } else if (quote.templateId === 'minimal') {
        fontFamily = '"Inter", sans-serif';
      }

      ctx.font = `italic ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = quote.textColor.includes('slate-900') || quote.textColor.includes('stone-900') ? '#1e293b' : '#f8fafc';
      ctx.textBaseline = 'middle';

      const words = `“ ${quote.quote} ”`.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxTextWidth && n > 0) {
          lines.push(currentLine);
          currentLine = words[n] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      // Draw wrapped lines centered vertically
      const totalTextHeight = lines.length * (fontSize * 1.35);
      let startY = (height / 2) - (totalTextHeight / 2) - 30;

      lines.forEach((line, i) => {
        ctx.fillText(line.trim(), width / 2, startY + (i * fontSize * 1.35));
      });

      // 5. Draw Scripture Reference
      const referenceY = (height / 2) + (totalTextHeight / 2) + 50;
      ctx.font = 'italic 500 24px "Playfair Display", "Inter", sans-serif';
      ctx.fillText(`${quote.scripture} (${quote.scriptureVersion})`, width / 2, referenceY);

      // 6. Draw Speaker & Church Info
      const footerY = height * 0.88;
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillText(quote.speaker, width / 2, footerY);

      ctx.font = '500 18px "Inter", sans-serif';
      ctx.fillStyle = quote.textColor.includes('slate-900') || quote.textColor.includes('stone-900') ? '#64748b' : 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(quote.church, width / 2, footerY + 32);

      // Convert to image data url
      const dataUrl = canvas.toDataURL('image/png');
      
      // Trigger download immediately
      const link = document.createElement('a');
      link.download = `selah_quote_${quote.id}_${config.platform}.png`;
      link.href = dataUrl;
      link.click();

      resolve(dataUrl);
    } catch (err) {
      reject(err);
    }
  });
}
