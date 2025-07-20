function initQuestSystem() {
    // Se non ci sono quest attive, ne genera una nuova
    if (state.activeQuests.length === 0) {
        generateNewQuest();
    }
}

function generateNewQuest() {
    const availableQuests = questsData.filter(q => !state.completedQuests.includes(q.id));
    if (availableQuests.length > 0) {
        const newQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
        state.activeQuests.push({ ...newQuest, status: 'offered' });
        saveState();
    }
}

function renderQuestBoard() {
    const container = document.getElementById('quest-board');
    if (!container) return;

    if (state.activeQuests.length === 0) {
        container.innerHTML = `<div class="clan-card p-4 rounded-lg text-center text-gray-500">Nessuna missione disponibile al momento.</div>`;
        return;
    }

    container.innerHTML = state.activeQuests.map(quest => {
        let buttonHTML = '';
        if (quest.status === 'offered') {
            buttonHTML = `<button class="accept-quest-btn mt-4 px-4 py-2 font-semibold rounded-md bg-green-600 hover:bg-green-700" data-quest-id="${quest.id}">Accetta Missione</button>`;
        } else if (quest.status === 'accepted') {
            buttonHTML = `<div class="mt-4 text-yellow-400 font-semibold">Missione in corso...</div>`;
        }

        return `
            <div class="clan-card p-6 rounded-lg border-l-4 border-indigo-500">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-xl font-bold text-white">${quest.title}</h4>
                        <p class="text-sm text-gray-400">Da: ${quest.informant}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-yellow-400">${quest.rewards.btc.toLocaleString()} BTC</p>
                        <p class="text-sm text-indigo-300">${quest.rewards.xp} XP</p>
                    </div>
                </div>
                <p class="text-gray-300 mt-4">${quest.description}</p>
                <div class="mt-4 pt-4 border-t border-gray-700 text-sm">
                    <p><span class="font-semibold text-gray-400">Obiettivo:</span> Trovare la keyword <span class="font-mono text-orange-400">"${quest.targetKeyword}"</span></p>
                    <p><span class="font-semibold text-gray-400">Fonte Dati Suggerita:</span> <span class="italic text-gray-300">${quest.suggestedDataSource}</span></p>
                </div>
                ${buttonHTML}
            </div>
        `;
    }).join('');

    container.querySelectorAll('.accept-quest-btn').forEach(btn => {
        btn.addEventListener('click', () => acceptQuest(btn.dataset.questId));
    });
}

function acceptQuest(questId) {
    const quest = state.activeQuests.find(q => q.id === questId);
    if (quest) {
        quest.status = 'accepted';
        saveState();
        renderQuestBoard();
    }
}

function completeQuest(questId) {
    const questIndex = state.activeQuests.findIndex(q => q.id === questId);
    if (questIndex > -1) {
        const quest = state.activeQuests[questIndex];
        
        // Assegna ricompense
        state.btc += quest.rewards.btc;
        addXp(quest.rewards.xp);

        // Sposta la quest in "completate"
        state.completedQuests.push(quest.id);
        state.activeQuests.splice(questIndex, 1);

        // Genera una nuova quest
        generateNewQuest();

        saveState();
        updateUI();
        
        // Aggiorna la bacheca se siamo nella pagina HQ
        if(state.activePage === 'hq') {
            renderQuestBoard();
        }

        alert(`Quest "${quest.title}" completata! Hai ricevuto ${quest.rewards.btc.toLocaleString()} BTC e ${quest.rewards.xp} XP.`);
    }
}