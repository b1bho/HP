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

function renderQuestBoard() { const container = document.getElementById('quest-board'); if (!container) return; if (state.activeQuests.length === 0) { container.innerHTML = `<div class="clan-card p-4 rounded-lg text-center text-gray-500">Nessuna missione disponibile...</div>`; return; } container.innerHTML = state.activeQuests.map(quest => { let buttonHTML = ''; if (quest.status === 'offered') { buttonHTML = `<button class="accept-quest-btn ..." data-quest-id="${quest.id}">Accetta</button>`; } else if (quest.status === 'accepted') { buttonHTML = `<div class="..."><div class="text-yellow-400 ...">In corso...</div><button class="abandon-quest-btn ..." data-quest-id="${quest.id}">Annulla</button></div>`; } else if (quest.status === 'objective_found') { buttonHTML = `<div class="..."><p class="..."><i class="fas fa-check-circle"></i> Obiettivo Trovato!</p><button class="complete-quest-btn ..." data-quest-id="${quest.id}">Completa</button></div>`; } const rewardInBtc = quest.rewards.usd / state.btcValueInUSD; return `<div class="clan-card ..."><div class="..."><p class="font-bold text-yellow-400">~${rewardInBtc.toFixed(6)} BTC</p><p class="text-sm text-indigo-300">${quest.rewards.xp} XP</p></div>...${buttonHTML}</div>`; }).join(''); /* ... listeners ... */ }


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

