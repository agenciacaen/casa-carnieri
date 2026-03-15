const API_URL = 'https://mvbxpnmdcijfzoexwvla.supabase.co/functions/v1/chat';

async function fetchData() {
    try {
        // Cache-busting: Adicionando timestamp para evitar que o navegador sirva uma versão antiga da API
        const response = await fetch(API_URL + '?t=' + Date.now());
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        console.log('Dados recebidos do Supabase:', data);
        
        if (data.content && data.portfolio) {
            // Garantir que o Elementor terminou de processar os widgets antes de injetar os dados
            setTimeout(() => {
                renderContent(data.content, data.portfolio);
            }, 500); 
        }
    } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error);
        // Fallback para dados locais se a API falhar
        try {
            const [contentRes, portfolioRes] = await Promise.all([
                fetch('./data/content.json?v=' + Date.now()),
                fetch('./data/portfolio.json?v=' + Date.now())
            ]);
            renderContent(await contentRes.json(), await portfolioRes.json());
        } catch (e) {
            console.error('Fallback falhou:', e);
        }
    }
}

function renderContent(contentData, portfolioData) {
    // 1. Hero Title - Seletor exato do site live
    const heroTitle = document.querySelector('.elementor-element-33fb3a41 h2.elementor-heading-title');
    if(heroTitle && contentData.hero?.title) {
        heroTitle.innerHTML = contentData.hero.title;
    }

    // 2. Hero Subtitle - Seletor exato do site live
    const heroSubtitle = document.querySelector('.elementor-element-287841c9 h2.elementor-heading-title');
    if(heroSubtitle && contentData.hero?.subtitle) {
        heroSubtitle.textContent = contentData.hero.subtitle;
    }

    // 3. About Section Title/Bio - Seletor exato (Container que engloba o texto sobre)
    const aboutTitle = document.querySelector('.elementor-element-2191593 .elementor-heading-title');
    if(aboutTitle && contentData.about?.title) {
        aboutTitle.textContent = contentData.about.title;
    }

    // 4. Botão Hero CTA - Seletor exato do botão Elementor
    const heroCtaBtn = document.querySelector('.elementor-element-42171bb5 a.elementor-button .elementor-button-text');
    if (heroCtaBtn && contentData.buttons?.hero_cta) {
        heroCtaBtn.textContent = contentData.buttons.hero_cta;
    }

    // 5. Botão Serviços (Custom .botao2)
    const servicesBtn = document.querySelector('.botao2 span');
    if (servicesBtn && contentData.buttons?.services) {
        servicesBtn.textContent = contentData.buttons.services;
    }

    // 6. Botão Eternalizar Momentos (Abaixo do Vídeo)
    const eternalizarBtn = document.querySelector('.elementor-element-2475026 .elementor-button-text');
    if (eternalizarBtn && contentData.buttons?.eternalizar) {
        eternalizarBtn.textContent = contentData.buttons.eternalizar;
    }

    // 7. Botão Eleve Seu Posicionamento (Seção A Casa Carnieri)
    const eleveBtn = document.querySelector('.elementor-element-7f13c6d .elementor-button-text');
    if (eleveBtn && contentData.buttons?.eleve_posicionamento) {
        eleveBtn.textContent = contentData.buttons.eleve_posicionamento;
    }

    // 8. Botão Valorizar Minha Imagem (Formulário Rodapé)
    const valorizarBtn = document.querySelector('.elementor-element-3b6b100 .elementor-button-text');
    if (valorizarBtn && contentData.buttons?.valorizar_imagem) {
        valorizarBtn.textContent = contentData.buttons.valorizar_imagem;
    }

    // 9. Stats Label - Seletor exato live
    const statsLabel = document.querySelector('.elementor-element-21014e7a .elementor-heading-title');
    if (statsLabel && contentData.sections?.stats?.label) {
        statsLabel.textContent = contentData.sections.stats.label;
    }

    // 7. About Text (Fallback seletor genérico do Elementor)
    const aboutText = document.querySelector('.elementor-element-2191593 .elementor-text-editor');
    if(aboutText && contentData.about?.text) {
        aboutText.innerHTML = contentData.about.text;
    }

    // 8. Portfólio Dinâmico
    const portfolioContainer = document.querySelector('.elementor-posts-container');
    if (portfolioContainer && portfolioData && portfolioData.length > 0) {
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

