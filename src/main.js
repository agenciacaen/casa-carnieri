import contentData from './data/content.json';
import portfolioData from './data/portfolio.json';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dados carregados:', contentData, portfolioData);
    
    // Atualizar textos estáticos principais
    const heroTitle = document.querySelector('h1');
    if(heroTitle) heroTitle.textContent = contentData.hero.title;

    const heroSubtitleElements = document.querySelectorAll('.elementor-widget-heading h2');
    if(heroSubtitleElements.length >= 2) {
        heroSubtitleElements[0].textContent = contentData.hero.subtitle;
        heroSubtitleElements[1].textContent = contentData.about.title;
    }

    const textEditors = document.querySelectorAll('.elementor-text-editor');
    if(textEditors.length >= 1) {
        textEditors[0].innerHTML = contentData.about.text;
    }
});
