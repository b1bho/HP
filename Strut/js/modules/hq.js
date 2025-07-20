// File: js/modules/hq.js

const MAX_NEWS_ITEMS = 5;

function renderHqPage() {
    const statsContainer = document.getElementById('hq-computer-stats');
    if (!statsContainer) return;
    statsContainer.innerHTML = '';
    const { hardwareBonuses, clanBonuses } = state;
    const personalStudyBonus = Math.round((1 - hardwareBonuses.studyTimeModifier) * 100);
    const clanStudyBonus = Math.round((1 - clanBonuses.studyTimeModifier) * 100);
    const totalStudyBonus = Math.round((1 - (hardwareBonuses.studyTimeModifier * clanBonuses.studyTimeModifier)) * 100);

    let bonusHTML = `
        <div class="hq-stat-card p-4 rounded-lg">
            <h4 class="text-lg font-bold text-indigo-300 mb-2">Bonus Globali Attivi</h4>
            <div class="text-sm space-y-1">
                <p>Velocità Studio: <span class="font-bold hq-bonus-text">+${totalStudyBonus}%</span> <span class="text-xs text-gray-400">(Personale: ${personalStudyBonus}%, Clan: ${clanStudyBonus}%)</span></p>
                <p>Efficienza (EO): <span class="font-bold hq-bonus-text">${(hardwareBonuses.toolStatModifiers.eo + clanBonuses.toolStatModifiers.eo)}</span></p>
                <p>Robustezza (RC): <span class="font-bold hq-bonus-text">+${(hardwareBonuses.toolStatModifiers.rc + clanBonuses.toolStatModifiers.rc).toFixed(2)}</span></p>
            </div>
        </div>`;
    statsContainer.innerHTML += bonusHTML;

    let hardwareHTML = `<div class="hq-stat-card p-4 rounded-lg"><h4 class="text-lg font-bold text-indigo-300 mb-2">Hardware Personale</h4><ul class="text-sm space-y-1 list-disc list-inside text-gray-300">`;
    const allPersonalItems = [...marketData.personalHardware, ...marketData.personalInfrastructure];
    const ownedItems = Object.keys(state.ownedHardware).filter(id => state.ownedHardware[id]);
    if (ownedItems.length > 0) {
        ownedItems.forEach(id => {
            const item = allPersonalItems.find(i => i.id === id);
            if(item) hardwareHTML += `<li>${item.name}</li>`;
        });
    } else {
        hardwareHTML += `<li>Nessun componente installato.</li>`;
    }
    hardwareHTML += `</ul></div>`;
    statsContainer.innerHTML += hardwareHTML;
}

function updateNewsTicker() {
    if (state.activePage !== 'hq') return;

    if (state.news.length < MAX_NEWS_ITEMS) {
        const availableNews = newsData.filter(n => !state.news.some(sn => sn.headline === n.headline));
        if (availableNews.length > 0) {
            const newNews = availableNews[Math.floor(Math.random() * availableNews.length)];
            state.news.unshift(newNews); 
        }
    } else {
        state.news.pop();
        const availableNews = newsData.filter(n => !state.news.some(sn => sn.headline === n.headline));
        if (availableNews.length > 0) {
            const newNews = availableNews[Math.floor(Math.random() * availableNews.length)];
            state.news.unshift(newNews);
        }
    }
    renderNewsTicker();
}

function renderNewsTicker() {
    const container = document.getElementById('news-ticker-container');
    if (!container) return;

    const getCategoryClass = (category) => {
        switch (category) {
            case 'Finanza': return 'border-green-500';
            case 'Geopolitica': return 'border-red-500';
            case 'Tech': return 'border-blue-500';
            case 'Cybersecurity': return 'border-yellow-500';
            case 'Economia': return 'border-indigo-500';
            default: return 'border-gray-500';
        }
    };

    container.innerHTML = state.news.map(newsItem => `
        <div class="news-item p-2 border-l-4 ${getCategoryClass(newsItem.category)} bg-gray-800/50 rounded-r-md">
            <p class="text-xs font-bold">${newsItem.category}</p>
            <p class="text-sm text-gray-300">${newsItem.headline}</p>
        </div>
    `).join('');
}


function initHqPage() {
    renderHqPage();
    renderQuestBoard();
    renderNewsTicker();

    const intelBtn = document.getElementById('goto-intel-console-btn');
    if (intelBtn) {
        intelBtn.addEventListener('click', () => switchPage('intelligence_console'));
    }

    // NUOVO: Aggiungi listener per il pulsante di refresh
    const refreshQuestsBtn = document.getElementById('refresh-quests-btn');
    if (refreshQuestsBtn) {
        refreshQuestsBtn.addEventListener('click', () => {
            if (typeof forceRefreshQuests === 'function') {
                forceRefreshQuests();
            }
        });
    }
}
