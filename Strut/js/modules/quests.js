const QUEST_LIFETIME_MS = 1000 * 60 * 5; 
const MAX_ACTIVE_QUESTS = 3; 

function initQuestSystem() {
    if (state.activeQuests.length === 0) {
        manageQuests();
    }
}

/**
 * NUOVA FUNZIONE DI DEBUG: Forza l'aggiornamento delle missioni offerte.
 * Rimuove tutte le missioni con stato "offered" e ne genera di nuove.
 */
function forceRefreshQuests() {
    // Rimuove solo le missioni che sono ancora in stato "offered"
    state.activeQuests = state.activeQuests.filter(q => q.status !== 'offered');
    
    // Chiama la funzione principale per riempire gli slot vuoti
    manageQuests();
    
    // Assicura che la bacheca venga ridisegnata immediatamente
    if (state.activePage === 'hq') {
        renderQuestBoard();
    }
}

function manageQuests() {
    let boardNeedsUpdate = false;

    const initialCount = state.activeQuests.length;
    state.activeQuests = state.activeQuests.filter(quest => {
        if (quest.status === 'offered') {
            return (Date.now() - quest.offerTime) < QUEST_LIFETIME_MS;
        }
        return true;
    });

    if (state.activeQuests.length < initialCount) {
        boardNeedsUpdate = true;
    }

    while (state.activeQuests.length < MAX_ACTIVE_QUESTS) {
        if (generateNewQuest()) {
            boardNeedsUpdate = true;
        } else {
            break;
        }
    }

    if (boardNeedsUpdate && state.activePage === 'hq') {
        renderQuestBoard();
    }
}


function generateNewQuest() {
    const activeQuestIds = state.activeQuests.map(q => q.id);
    const availableQuests = questsData.filter(q =>
        !state.completedQuests.includes(q.id) && !activeQuestIds.includes(q.id)
    );

    if (availableQuests.length > 0) {
        const newQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
        state.activeQuests.push({
            ...newQuest,
            status: 'offered',
            offerTime: Date.now()
        });
        saveState();
        return true;
    }
    return false;
}

function renderQuestBoard() {
    const container = document.getElementById('quest-board');
    if (!container) return;

    if (state.activeQuests.length === 0) {
        container.innerHTML = `<div class="clan-card p-4 rounded-lg text-center text-gray-500">Nessuna missione disponibile...</div>`;
        return;
    }

    container.innerHTML = state.activeQuests.map(quest => {
        let buttonHTML = '';

        if (quest.status === 'offered') {
            buttonHTML = `<button class="accept-quest-btn w-full px-4 py-2 font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700" data-quest-id="${quest.id}">Accetta Missione</button>`;
        } else if (quest.status === 'accepted') {
            buttonHTML = `
                <div class="text-center">
                    <div class="text-yellow-400 font-bold text-sm mb-2"><i class="fas fa-spinner fa-spin"></i> In corso...</div>
                    <button class="abandon-quest-btn w-full px-3 py-1 text-xs font-semibold rounded-md bg-gray-600 hover:bg-gray-700" data-quest-id="${quest.id}">Annulla</button>
                </div>`;
        } else if (quest.status === 'objective_found') {
            buttonHTML = `
                <div class="text-center">
                    <p class="text-green-400 text-sm mb-2"><i class="fas fa-check-circle"></i> Obiettivo Trovato!</p>
                    <button class="complete-quest-btn w-full px-4 py-2 font-semibold rounded-md bg-green-600 hover:bg-green-700" data-quest-id="${quest.id}">Completa Missione</button>
                </div>`;
        }

        const rewardInBtc = quest.rewards.usd / state.btcValueInUSD;

        return `
            <div class="clan-card p-2 rounded-lg">
                <div class="flex justify-between items-start">
                    <div class="flex-grow pr-4">
                        <h4 class="text-lg font-bold text-white">${quest.title}</h4>
                        <p class="text-sm text-gray-400">Da: ${quest.informant}</p>
                        <p class="text-sm text-gray-300 mt-2">${quest.description}</p>
                         <p class="text-xs text-gray-500 mt-2">Obiettivo Ricerca: <span class="font-mono text-yellow-300">${quest.targetKeyword}</span></p>
                    </div>
                    <div class="text-right ml-4 flex-shrink-0 w-48">
                        <div class="mb-4 text-center">
                            <p class="font-bold text-yellow-400 text-lg">~${rewardInBtc.toFixed(6)} BTC</p>
                            <p class="text-sm text-indigo-300">${quest.rewards.xp} XP</p>
                        </div>
                        ${buttonHTML}
                    </div>
                </div>
            </div>`;
    }).join('');

    container.querySelectorAll('.accept-quest-btn').forEach(btn => {
        btn.addEventListener('click', () => acceptQuest(btn.dataset.questId));
    });
    container.querySelectorAll('.abandon-quest-btn').forEach(btn => {
        btn.addEventListener('click', () => abandonQuest(btn.dataset.questId));
    });
    container.querySelectorAll('.complete-quest-btn').forEach(btn => {
        btn.addEventListener('click', () => completeQuest(btn.dataset.questId));
    });
}

function acceptQuest(questId) {
    const quest = state.activeQuests.find(q => q.id === questId);
    if (quest && quest.status === 'offered') {
        quest.status = 'accepted';
        delete quest.offerTime;
        saveState();
        renderQuestBoard();
    }
}

function abandonQuest(questId) {
    if (confirm("Sei sicuro di voler annullare questa missione? Non potrai più riprenderla.")) {
        state.activeQuests = state.activeQuests.filter(q => q.id !== questId);
        state.completedQuests.push(questId);
        state.intelItems = state.intelItems.filter(item => item.questId !== questId);
        saveState();
        renderQuestBoard();
    }
}

function completeQuest(questId) { const questIndex = state.activeQuests.findIndex(q => q.id === questId); if (questIndex > -1) { const quest = state.activeQuests[questIndex]; const rewardInBtc = quest.rewards.usd / state.btcValueInUSD; state.btc += rewardInBtc; addXp(quest.rewards.xp); state.completedQuests.push(quest.id); state.activeQuests.splice(questIndex, 1); state.intelItems = state.intelItems.filter(item => item.questId !== questId); saveState(); updateUI(); if(state.activePage === 'hq') { renderQuestBoard(); } if (state.activePage === 'profile' && state.activeProfileSection === 'data-locker') { renderDataLockerSection(); } alert(`Missione "${quest.title}" completata! Ricevuti ~${rewardInBtc.toFixed(6)} BTC e ${quest.rewards.xp} XP.`); } }

