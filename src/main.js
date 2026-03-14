async function fetchData() {
    try {
        const [contentRes, portfolioRes] = await Promise.all([
            fetch('./data/content.json?v=' + Date.now()),
            fetch('./data/portfolio.json?v=' + Date.now())
        ]);
        
        const contentData = await contentRes.json();
        const portfolioData = await portfolioRes.json();
        
        console.log('Dados carregados dinamicamente:', contentData, portfolioData);
        renderContent(contentData, portfolioData);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function renderContent(contentData, portfolioData) {
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

    // Atualizar Portfólio Dinamicamente
    const portfolioContainer = document.querySelector('.elementor-posts-container');
    if (portfolioContainer && portfolioData && portfolioData.length > 0) {
        // Limpar conteúdo anterior para garantir atualização realista
        portfolioContainer.innerHTML = ''; 

        portfolioData.forEach(item => {
            const article = document.createElement('article');
            article.className = 'elementor-post elementor-grid-item post-193 ensaio type-ensaio status-publish has-post-thumbnail hentry';
            article.setAttribute('data-portfolio-id', item.id);
            article.setAttribute('role', 'listitem');

            article.innerHTML = `
                <a class="elementor-post__thumbnail__link" href="${item.link}" tabindex="-1">
                    <div class="elementor-post__thumbnail">
                        <img width="1200" height="1799" src="${item.coverImage}" class="attachment-full size-full" alt="${item.title}" loading="lazy" />
                    </div>
                </a>
                <div class="elementor-post__text">
                    <h3 class="elementor-post__title">
                        <a href="${item.link}">${item.title}</a>
                    </h3>
                </div>
            `;
            portfolioContainer.appendChild(article);
        });
    }
}

document.addEventListener('DOMContentLoaded', fetchData);

