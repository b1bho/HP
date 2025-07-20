// File: js/modules/hq.js
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

function initHqPage() {
    renderHqPage();
    renderQuestBoard(); // Aggiungi questa chiamata

    const intelBtn = document.getElementById('goto-intel-console-btn');
    if (intelBtn) {
        intelBtn.addEventListener('click', () => switchPage('intelligence_console'));
    }
}
