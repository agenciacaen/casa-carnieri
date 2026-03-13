import fs from 'fs';
import * as cheerio from 'cheerio';

try {
  const html = fs.readFileSync('index.html', 'utf8');
  const $ = cheerio.load(html);

  const content = {
    hero: {
      title: $('h1').text().trim().split('\n')[0] || 'Alexandre Casa Carnieri',
      subtitle: $('.elementor-widget-heading h2').eq(0).text().trim() || 'Fotografia',
    },
    about: {
      title: $('.elementor-widget-heading h2').eq(1).text().trim() || 'Sobre',
      text: $('.elementor-text-editor').eq(0).text().trim() || ''
    },
    services: []
  };

  const portfolio = [];
  
  // Find all elements that look like cards pointing to /ensaio/ or /categorias/
  $('a[href*="ensaio/"], a[href*="categorias/"]').each((i, el) => {
    const link = $(el).attr('href');
    // We only want the links that wrap an image or have a title inside
    const imgEl = $(el).find('img').length > 0 ? $(el).find('img') : $(el).closest('.elementor-widget-wrap').find('img');
    const titleEl = $(el).closest('.elementor-widget-wrap').find('h2, h3, .elementor-heading-title');
    
    // Many images are lazy loaded
    let imageSrc = imgEl.attr('data-lazy-src') || imgEl.attr('src') || '';
    if(imageSrc.startsWith('data:image')) imageSrc = ''; // Ignore placeholders
    
    let title = $(el).text().trim();
    if(!title && titleEl.length > 0) {
      title = titleEl.text().trim();
    }
    
    if(link && link !== '#' && !link.includes('replytocom') && imageSrc) {
       // Avoid duplicates
       if(!portfolio.find(p => p.link === link || p.coverImage === imageSrc)) {
         portfolio.push({
           id: link.split('/').filter(x => x && x !== 'index.html').pop() || `item-${i}`,
           title: title || 'Ensaio Fotográfico',
           link: link,
           coverImage: imageSrc
         });
       }
    }
  });

  if (!fs.existsSync('src')) fs.mkdirSync('src');
  if (!fs.existsSync('src/data')) fs.mkdirSync('src/data');

  fs.writeFileSync('src/data/content.json', JSON.stringify(content, null, 2));
  fs.writeFileSync('src/data/portfolio.json', JSON.stringify(portfolio, null, 2));
  
  console.log('Extração Final Completa:');
  console.log(`Portfólios encontrados: ${portfolio.length}`);
} catch(e) {
  console.error(e);
}
