// File: js/modules/profile.js
// VERSIONE AGGIORNATA: Aggiunto indicatore di tracciabilità per le infrastrutture del clan.

function switchProfileSection(sectionName) {
    state.activeProfileSection = sectionName;
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.profile-sidebar-btn').forEach(b => b.classList.remove('active'));
    
    const sectionEl = document.getElementById(`${sectionName}-section`);
    const buttonEl = document.querySelector(`.profile-sidebar-btn[data-section="${sectionName}"]`);
    
    if(sectionEl) sectionEl.classList.add('active');
    if(buttonEl) buttonEl.classList.add('active');

    if (sectionName === 'clan') {
        renderClanSection();
    } else if (sectionName === 'data-locker') {
        renderDataLockerSection();
    }
    
    saveState();
}

function renderTalentTree() {
    const container = document.getElementById('talents-section');
    if (!container) return;
    container.innerHTML = '<div id="talent-accordion-container" class="space-y-2"></div>';
    const talentAccordionContainer = container.querySelector('#talent-accordion-container');

    for (const branchName in talentData) {
        const branch = talentData[branchName];
        const branchWrapper = document.createElement('div');
        const branchHeader = document.createElement('button');
        branchHeader.className = 'talent-branch-header w-full text-left flex justify-between items-center';
        branchHeader.innerHTML = `<span class="text-xl font-bold"><i class="${branch.icon} mr-4 text-purple-400"></i>${branchName.split(': ')[1]}</span><i class="fas fa-chevron-down transition-transform"></i>`;
        const talentPanel = document.createElement('div');
        talentPanel.className = 'talent-panel';
        const panelContent = document.createElement('div');
        panelContent.className = 'p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
        talentPanel.appendChild(panelContent);
        for (const talentName in branch.talents) {
            panelContent.appendChild(createTalentCard(talentName, branch.talents[talentName]));
        }
        branchHeader.addEventListener('click', () => {
            branchHeader.classList.toggle('active');
            branchHeader.querySelector('.fa-chevron-down').classList.toggle('rotate-180');
            talentPanel.style.maxHeight = talentPanel.style.maxHeight ? null : panelContent.scrollHeight + "px";
        });
        branchWrapper.append(branchHeader, talentPanel);
        talentAccordionContainer.appendChild(branchWrapper);
    }
}

function createTalentCard(talentName, talent) {
    const talentCard = document.createElement('div');
    talentCard.className = 'talent-card rounded-lg p-4 shadow-md flex-grow';
    talentCard.dataset.talentName = talentName;
    const unlockedLevels = state.unlocked[talentName] || 0;
    talentCard.innerHTML = `
        <div class="talent-header flex justify-between items-center">
            <h4 class="text-lg font-semibold text-white">${talentName}</h4>
            <span class="text-sm font-bold text-indigo-400">${unlockedLevels} / ${talent.levels.length}</span>
        </div>
        <div class="mt-2 text-xs text-gray-400">${talent.description}</div>`;
    talentCard.addEventListener('click', () => openTalentModal(talentName, talent));
    return talentCard;
}

function openTalentModal(talentName, talent) {
    const talentModal = document.getElementById('talent-modal');
    talentModal.classList.remove('hidden');
    
    const unlockedLevels = state.unlocked[talentName] || 0;
    let levelsHtml = '';

    talent.levels.forEach((level, index) => {
        const levelId = `${talentName}-${index}`;
        const isUnlocked = index < unlockedLevels;
        const canStudy = (index === unlockedLevels) && (state.talentPoints >= level.cost);
        const isStudying = state.studying[levelId];
        
        let buttonHtml = '';
        if(isStudying) {
            const speedUpCost = 5;
            buttonHtml = `<div class="mt-2 text-center">
                    <span class="inline-block text-sm font-bold text-yellow-400"><i class="fas fa-spinner fa-spin mr-1"></i> In Studio...</span>
                    <div class="progress-bar-container h-2 w-full my-2"><div id="progress-${levelId}" class="progress-bar h-2"></div></div>
                    <button class="speedup-btn mt-2 px-3 py-1 text-xs font-medium rounded-md bg-orange-600 hover:bg-orange-700" data-level-id="${levelId}" data-cost="${speedUpCost}"><i class="fas fa-forward"></i> Accelera (${speedUpCost} XMR)</button>
                </div>`;
        } else if (isUnlocked) {
            buttonHtml = `<span class="mt-2 inline-block text-sm font-bold text-green-400"><i class="fas fa-check-circle mr-1"></i> Sbloccato</span>`;
        } else {
            const totalStudyModifier = state.hardwareBonuses.studyTimeModifier * state.clanBonuses.studyTimeModifier;
            const finalStudyTime = Math.round(level.studyTime * totalStudyModifier);
            buttonHtml = `<button class="unlock-btn mt-2 px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed" data-talent-name="${talentName}" data-level-index="${index}" ${!canStudy ? 'disabled' : ''}><i class="fas fa-book mr-2"></i>Studia (${finalStudyTime}s)</button>`;
        }

        levelsHtml += `
            <div class="p-4 mb-3 rounded-md border-l-4 ${isUnlocked ? 'border-green-500 bg-gray-700/50' : isStudying ? 'border-yellow-500 bg-gray-900' : 'border-gray-600 bg-gray-900'}">
                <div class="flex justify-between items-start">
                    <div>
                        <h5 class="font-bold text-lg ${isUnlocked ? 'text-green-300' : 'text-white'}">${level.name}</h5>
                        <p class="text-sm text-gray-400 mt-1"><span class="font-semibold">Sblocca:</span> ${Array.isArray(level.unlocks) ? level.unlocks.join(', ') : level.unlocks}</p>
                    </div>
                    <div class="text-right ml-4 flex-shrink-0">
                        <p class="text-sm text-gray-400">Costo: <span class="font-bold text-indigo-400">${level.cost} PT</span></p>
                        ${buttonHtml}
                    </div>
                </div>
            </div>`;
    });

    talentModal.innerHTML = `
        <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
            <button id="close-modal-talent" class="absolute top-4 right-4 text-gray-400 hover:text-white">
                <i class="fas fa-times fa-lg"></i>
            </button>
            <h2 id="modal-title" class="text-2xl font-bold text-white mb-2">${talentName}</h2>
            <p id="modal-description" class="text-gray-300 mb-4">${talent.description}</p>
            <div id="modal-levels-container">${levelsHtml}</div>
        </div>`;
}

function handleStudyClick(e) {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.classList.contains('unlock-btn')) {
        startStudyingTalent(button.dataset.talentName, parseInt(button.dataset.levelIndex));
    } else if (button.classList.contains('speedup-btn')) {
        speedUpStudy(button.dataset.levelId, parseInt(button.dataset.cost));
    }
}

function startStudyingTalent(talentName, levelIndex) {
    const talent = findTalentByName(talentName);
    if (!talent) return;
    const level = talent.levels[levelIndex];
    const levelId = `${talentName}-${levelIndex}`;
    const unlockedLevels = state.unlocked[talentName] || 0;

    if (levelIndex === unlockedLevels && state.talentPoints >= level.cost && !state.studying[levelId]) {
        state.talentPoints -= level.cost;
        const totalStudyModifier = state.hardwareBonuses.studyTimeModifier * state.clanBonuses.studyTimeModifier;
        const finalStudyTime = level.studyTime * totalStudyModifier;
        state.studying[levelId] = { startTime: Date.now(), duration: finalStudyTime * 1000 };
        saveState();
        renderTalentTree();
        openTalentModal(talentName, talent);
        updateUI();
    }
}

function speedUpStudy(levelId, cost) {
    if (state.xmr >= cost) {
        if (confirm(`Sei sicuro di voler spendere ${cost} XMR per completare istantaneamente questo studio?`)) {
            state.xmr -= cost;
            const [talentName] = levelId.split('-');
            state.unlocked[talentName] = (state.unlocked[talentName] || 0) + 1;
            delete state.studying[levelId];
            saveState();
            updateUI();
            renderTalentTree();
            if (state.activePage === 'editor') renderToolbox();
            closeModal(document.getElementById('talent-modal'));
        }
    } else {
        alert("Non hai abbastanza XMR.");
    }
}

function closeModal(modalElement) {
    if (modalElement) modalElement.classList.add('hidden');
}

function renderProfileContent() {
    const identitySection = document.getElementById('identity-section');
    identitySection.innerHTML = `
        <h2 class="text-3xl font-bold mb-4 branch-title">Stato dell'Identità</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h3 class="text-lg font-semibold mb-2 text-yellow-400">Stato di Indagine</h3>
                <div class="space-y-2 text-sm">
                    <p>Indagato da: <span id="investigated-by" class="font-bold text-white"></span></p>
                    <p>Livello di Sospetto:</p>
                    <div class="w-full bg-gray-700 rounded-full h-2.5">
                        <div id="suspicion-bar" class="bg-yellow-500 h-2.5 rounded-full"></div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
                 <h3 class="text-lg font-semibold mb-2 text-red-400">Tracce Digitali</h3>
                 <p class="text-sm">Tracce totali: <span id="traces-left" class="font-bold text-white"></span></p>
            </div>
        </div>
        
        <div>
            <h3 class="text-xl font-semibold mb-3 text-gray-300">Log Dettagliato Tracce</h3>
            <div class="bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" class="px-4 py-2">Tipo</th>
                            <th scope="col" class="px-4 py-2">IP Associato</th>
                            <th scope="col" class="px-4 py-2">Target</th>
                            <th scope="col" class="px-4 py-2">Dettagli</th>
                        </tr>
                    </thead>
                    <tbody id="trace-logs-table">
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    const moralitySection = document.getElementById('morality-section');
    moralitySection.innerHTML = `<h2 class="text-3xl font-bold mb-4 branch-title">Sistema di Moralità</h2><div class="bg-gray-800 p-4 rounded-lg"><div class="flex justify-between items-center mb-2 font-bold"><span class="text-blue-400">White Hat</span><span class="text-gray-400">Grey Hat</span><span class="text-red-400">Black Hat</span></div><div class="w-full bg-gradient-to-r from-blue-500 via-gray-500 to-red-500 rounded-full h-4 relative"><div id="morality-indicator" class="absolute top-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-900" style="transform: translate(-50%, -50%);"></div></div><div class="mt-4 text-center"><p>Allineamento attuale: <span id="morality-status" class="font-bold"></span></p></div><div class="mt-6 flex justify-center gap-4"><button id="action-white-hat" class="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700">Azione White Hat</button><button id="action-black-hat" class="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700">Azione Black Hat</button></div></div>`;
    
    renderTalentTree();
    updateProfileData();

    document.getElementById('action-white-hat').addEventListener('click', () => updateMorality(-10));
    document.getElementById('action-black-hat').addEventListener('click', () => updateMorality(10));
}

function updateProfileData() {
    const { identity, morality, traceLogs } = state;
    document.getElementById('traces-left').textContent = identity.traces;
    document.getElementById('investigated-by').textContent = identity.investigatedBy;
    document.getElementById('suspicion-bar').style.width = `${identity.suspicion}%`;
    document.getElementById('morality-indicator').style.left = `${(morality + 100) / 2}%`;
    
    if (morality < -33) document.getElementById('morality-status').textContent = 'White Hat';
    else if (morality > 33) document.getElementById('morality-status').textContent = 'Black Hat';
    else document.getElementById('morality-status').textContent = 'Grey Hat';

    const tableBody = document.getElementById('trace-logs-table');
    if (tableBody) {
        if (traceLogs.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-center text-gray-500">Nessuna traccia significativa rilevata.</td></tr>`;
        } else {
            tableBody.innerHTML = traceLogs.map(log => `
                <tr class="border-b border-gray-700">
                    <td class="px-4 py-2 font-medium text-red-400">${log.type}</td>
                    <td class="px-4 py-2 font-mono text-white">${log.ip}</td>
                    <td class="px-4 py-2 text-gray-300">${log.target}</td>
                    <td class="px-4 py-2 text-gray-400">${log.details}</td>
                </tr>
            `).join('');
        }
    }
}

function updateMorality(amount) {
    state.morality = Math.max(-100, Math.min(100, state.morality + amount));
    updateProfileData();
    saveState();
}

function renderClanSection() {
    const container = document.getElementById('clan-section');
    if (!container) return;

    if (!state.clan) {
        container.innerHTML = `
            <h2 class="text-3xl font-bold mb-4 branch-title">Unisciti a un Clan</h2>
            <div class="space-y-6">
                <div class="clan-card p-6 rounded-lg">
                    <h3 class="text-xl font-semibold mb-2">Crea un nuovo Clan</h3>
                    <p class="text-gray-400 mb-4 text-sm">Fonda la tua organizzazione, recluta membri e scala le classifiche. Costo di fondazione: 0.3 BTC.</p>
                    <div class="flex gap-2">
                        <input type="text" id="clan-name-input" placeholder="Nome Clan" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 w-full text-white">
                        <input type="text" id="clan-tag-input" placeholder="TAG" maxlength="4" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 w-20 text-white">
                        <button id="create-clan-btn" class="px-4 py-2 font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700">Crea</button>
                    </div>
                </div>
                 <div class="clan-card p-6 rounded-lg">
                    <h3 class="text-xl font-semibold mb-2">Unisciti a un Clan esistente</h3>
                    <p class="text-gray-400 mb-4 text-sm">Trova un clan e richiedi di unirti per collaborare con altri hacker.</p>
                    <p class="text-gray-500">Funzionalità di ricerca e unione in sviluppo.</p>
                </div>
            </div>`;
        document.getElementById('create-clan-btn').addEventListener('click', createClan);
    } else {
        const { name, tag, rank, treasury, members, infrastructure, level, xp, xpToNextLevel, ecosystem } = state.clan;
        const xpPercentage = (xpToNextLevel > 0) ? (xp / xpToNextLevel) * 100 : 0;

        const maxSecurity = 250;
        const maxCapacity = 250;
        const securityPercentage = (ecosystem && ecosystem.security) ? (ecosystem.security / maxSecurity) * 100 : 0;
        const capacityPercentage = (ecosystem && ecosystem.capacity) ? (ecosystem.capacity / maxCapacity) * 100 : 0;

        let actionsHTML = `<button id="leave-clan-btn" class="w-full px-4 py-2 font-semibold rounded-md bg-red-600 hover:bg-red-700">Abbandona Clan</button>`;
        const isLeader = state.clan.members.find(m => m.name === state.hackerName && m.role === 'Leader');

        if (isLeader) {
            if (state.clan.darkMarket) {
                actionsHTML += `<button id="delete-dark-market-btn" class="w-full mt-2 px-4 py-2 font-semibold rounded-md bg-yellow-600 hover:bg-yellow-700 text-black">Smantella Dark Market</button>`;
            } else {
                actionsHTML += `<button id="create-dark-market-btn" class="w-full mt-2 px-4 py-2 font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700">Crea Dark Market</button>`;
            }
        }

        container.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                 <div>
                    <h2 class="text-3xl font-bold branch-title">[${tag}] ${name}</h2>
                    <p class="text-lg font-semibold text-gray-400">Rango Clan: ${rank}</p>
                 </div>
                 <div class="w-1/3">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-bold text-indigo-300">LVL ${level}</span>
                        <span class="text-xs text-gray-400">${xp} / ${xpToNextLevel} XP</span>
                    </div>
                    <div class="xp-bar-bg">
                        <div class="xp-bar-fill" style="width: ${xpPercentage}%"></div>
                    </div>
                 </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <div class="clan-card p-4 rounded-lg">
                        <h3 class="text-xl font-semibold mb-3">Stato Ecosistema</h3>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between items-center text-sm mb-1">
                                    <span class="font-semibold text-gray-300 flex items-center gap-2"><i class="fas fa-shield-alt text-blue-400"></i>Sicurezza</span>
                                    <span class="font-mono text-blue-300">${ecosystem ? ecosystem.security : 0} / ${maxSecurity}</span>
                                </div>
                                <div class="xp-bar-bg"><div class="xp-bar-fill bg-blue-500" style="width: ${securityPercentage}%"></div></div>
                            </div>
                            <div>
                                <div class="flex justify-between items-center text-sm mb-1">
                                    <span class="font-semibold text-gray-300 flex items-center gap-2"><i class="fas fa-hdd text-green-400"></i>Capacità</span>
                                    <span class="font-mono text-green-300">${ecosystem ? ecosystem.capacity : 0} / ${maxCapacity}</span>
                                </div>
                                <div class="xp-bar-bg"><div class="xp-bar-fill bg-green-500" style="width: ${capacityPercentage}%"></div></div>
                            </div>
                        </div>
                    </div>
                    <div class="clan-card p-4 rounded-lg">
                        <h3 class="text-xl font-semibold mb-3">Infrastruttura Clan</h3>
                        <div id="clan-infra-list" class="space-y-4"></div>
                    </div>
                </div>
                <div class="lg:col-span-1 space-y-6">
                     <div class="clan-card p-4 rounded-lg">
                        <h3 class="text-xl font-semibold mb-2">Tesoreria</h3>
                        <p class="text-2xl font-bold text-yellow-400 mb-3">${(state.clan.treasury || 0).toFixed(6)} BTC</p>
                        <div class="flex gap-2">
                            <input type="number" id="donation-amount" placeholder="Quantità" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 w-full text-white">
                            <button id="donate-btn" class="px-4 py-2 font-semibold rounded-md bg-green-600 hover:bg-green-700">Dona</button>
                        </div>
                    </div>
                    <div class="clan-card p-4 rounded-lg">
                        <h3 class="text-xl font-semibold mb-3">Membri (${members.length})</h3>
                        <div id="clan-member-list" class="space-y-2 max-h-60 overflow-y-auto pr-2"></div>
                    </div>
                    <div class="clan-card p-4 rounded-lg">
                        <h3 class="text-xl font-semibold mb-2">Azioni</h3>
                        <div id="clan-actions">
                            ${actionsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const memberList = document.getElementById('clan-member-list');
        members.forEach(m => {
            memberList.innerHTML += `<div class="member-list-item p-2 rounded flex justify-between items-center"><span>${m.name}</span><span class="font-bold text-sm ${m.role === 'Leader' ? 'role-leader' : 'role-member'}">${m.role}</span></div>`;
        });

        const infraList = document.getElementById('clan-infra-list');
        infraList.innerHTML = '';
        if (Object.keys(infrastructure).length > 0) {
            for (const infraId in infrastructure) {
                infraList.appendChild(createInfraCard(infraId, infrastructure[infraId]));
            }
        } else {
            infraList.innerHTML = `<p class="text-gray-400 text-center py-4">Nessuna infrastruttura. Acquista i componenti base nel mercato del clan.</p>`;
        }

        document.getElementById('donate-btn').addEventListener('click', donateToClan);
        document.getElementById('leave-clan-btn').addEventListener('click', leaveClan);
        if (document.getElementById('create-dark-market-btn')) {
            document.getElementById('create-dark-market-btn').addEventListener('click', createDarkMarket);
        }
        if (document.getElementById('delete-dark-market-btn')) {
            document.getElementById('delete-dark-market-btn').addEventListener('click', deleteDarkMarket);
        }
    }
}
function createClan() { const name = document.getElementById('clan-name-input').value.trim(); const tag = document.getElementById('clan-tag-input').value.trim().toUpperCase(); const costUSD = 20000; const costInBtc = costUSD / state.btcValueInUSD; if (!name || !tag) { alert("Nome e TAG sono obbligatori."); return; } if (tag.length > 4) { alert("Il TAG può avere max 4 caratteri."); return; } if (state.btc < costInBtc) { alert(`Non hai abbastanza BTC. Costo: ~${costInBtc.toFixed(6)} BTC.`); return; } if (confirm(`Creare il clan "${name}" per ~${costInBtc.toFixed(6)} BTC?`)) { state.btc -= costInBtc; state.clan = { id: Date.now() % 1000, name, tag, rank: 1, treasury: 0, level: 1, xp: 0, xpToNextLevel: 500, members: [{ name: state.hackerName, role: 'Leader' }], infrastructure: {}, ecosystem: { security: 0, capacity: 0, total: 0 } }; updateClanEcosystemScore(); updateUI(); renderClanSection(); saveState(); } }
function createDarkMarket() {
    const cost = 500000;
    const costInBtc = cost / state.btcValueInUSD;
    if (!state.clan || state.clan.treasury < costInBtc) {
        alert(`Fondi insufficienti nella tesoreria del clan. Costo: ~${costInBtc.toFixed(6)} BTC.`);
        return;
    }
    if (!state.clan.infrastructure.servers || state.clan.infrastructure.servers.length === 0) {
        alert("È necessario possedere almeno un server del clan per ospitare un Dark Market.");
        return;
    }

    const modal = document.getElementById('talent-modal');
    let serverOptions = state.clan.infrastructure.servers.map(server =>
        `<button class="server-choice-btn w-full text-left p-3 rounded-md bg-gray-700 hover:bg-indigo-600" data-server-id="${server.id}">
            Server #${server.id} (${server.ip})
        </button>`
    ).join('');

    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button id="close-modal-server-choice" class="absolute top-4 right-4 text-gray-400 hover:text-white"><i class="fas fa-times fa-lg"></i></button>
            <h2 class="text-2xl font-bold text-white mb-4">Ospita Dark Market</h2>
            <p class="text-gray-400 mb-4">Scegli su quale server del clan ospitare il tuo nuovo Dark Market. Questa azione costerà ~${costInBtc.toFixed(6)} BTC.</p>
            <div class="space-y-2">${serverOptions}</div>
        </div>
    `;
    modal.classList.remove('hidden');

    modal.querySelector('#close-modal-server-choice').addEventListener('click', () => closeModal(modal));
    modal.querySelectorAll('.server-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const serverId = parseInt(btn.dataset.serverId);
            if (confirm(`Sei sicuro di voler creare il Dark Market sul Server #${serverId} per ~${costInBtc.toFixed(6)} BTC?`)) {
                state.clan.treasury -= costInBtc;
                state.clan.darkMarket = {
                    hostedOnServerId: serverId,
                    listings: []
                };
                saveState();
                renderClanSection();
                updateUI();
                closeModal(modal);
            }
        });
    });
}
function deleteDarkMarket() {
    if (confirm("Sei sicuro di voler smantellare il Dark Market? Questa azione è irreversibile e tutti gli oggetti in vendita andranno persi.")) {
        delete state.clan.darkMarket;
        saveState();
        renderClanSection();
        updateUI();
    }
}
function donateToClan() {
    const amount = parseFloat(document.getElementById('donation-amount').value);
    if (isNaN(amount) || amount <= 0) { alert("Importo non valido."); return; }
    if (state.btc < amount) { alert("Non hai abbastanza BTC."); return; }
    state.btc -= amount;
    state.clan.treasury += amount;
    updateUI();
    renderClanSection();
    saveState();
}
function leaveClan() {
    if (confirm("Sei sicuro di voler abbandonare il clan? Questa azione non può essere annullata.")) {
        state.clan = null;
        updateAllBonuses();
        renderClanSection();
        saveState();
    }
}
function attachServiceToServer(serverId, serviceId) {
    const server = state.clan.infrastructure.servers.find(s => s.id === serverId);
    if (!server) return;

    const isServiceAttachedElsewhere = state.clan.infrastructure.servers.some(s => s.attachedService === serviceId);
    if (isServiceAttachedElsewhere) {
        alert('Questo servizio è già in uso su un altro server.');
        return;
    }

    server.attachedService = serviceId;
    saveState();
    renderClanSection();
}
function detachServiceFromServer(serverId) {
    const server = state.clan.infrastructure.servers.find(s => s.id === serverId);
    if (server) {
        server.attachedService = null;
        saveState();
        renderClanSection();
    }
}

// --- FUNZIONE MODIFICATA ---
function createInfraCard(infraId, infraState) {
    if (infraId === 'servers') {
        const serverData = marketData.clanInfrastructure.clanServer;
        const container = document.createElement('div');
        container.className = 'space-y-4';
        if (!infraState || infraState.length === 0) return container;

        infraState.forEach(server => {
            const card = document.createElement('div');
            card.className = 'infra-card p-4 rounded-lg';
            
            const ip = server.ip;
            const traceScore = state.ipTraceability[ip] || 0;
            let traceColorClass = 'trace-low';
            if (traceScore > 75) traceColorClass = 'trace-high';
            else if (traceScore > 40) traceColorClass = 'trace-medium';

            let flowSlotsHTML = `<div class="mt-3 pt-3 border-t border-gray-600 space-y-2">
                                 <h5 class="text-sm font-semibold text-gray-300">Slot Flussi (${server.attachedFlows.filter(f => f).length}/${serverData.flowSlots})</h5>`;
            for (let i = 0; i < serverData.flowSlots; i++) {
                const attachedFlow = server.attachedFlows[i];
                if (attachedFlow) {
                     flowSlotsHTML += `<div class="flex items-center justify-between bg-gray-800/50 p-2 rounded-md"><span class="text-xs font-mono text-indigo-300">${attachedFlow}</span><button class="detach-flow-server-btn text-red-500 hover:text-red-400 text-xs" data-server-id="${server.id}" data-slot-index="${i}"><i class="fas fa-times-circle"></i> Sgancia</button></div>`;
                } else {
                     let options = '<option value="">Seleziona Flusso...</option>';
                     Object.keys(state.savedFlows).forEach(name => { options += `<option value="${name}">${name}</option>`; });
                     flowSlotsHTML += `<div class="flex items-center gap-2"><select class="flow-select-server bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-xs w-full">${options}</select><button class="attach-flow-server-btn px-2 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700" data-server-id="${server.id}" data-slot-index="${i}">Aggancia</button></div>`;
                }
            }
            flowSlotsHTML += '</div>';

            let serviceSlotHTML = '';
            const clanVpn = state.clan.infrastructure.c_vpn;
            if (clanVpn) {
                const vpnData = marketData.clanInfrastructure.c_vpn.tiers[clanVpn.tier - 1];
                const vpnAttachedServer = state.clan.infrastructure.servers.find(s => s.attachedService === 'c_vpn');

                serviceSlotHTML = `<div class="mt-3 pt-3 border-t border-gray-600 space-y-2">
                                     <h5 class="text-sm font-semibold text-gray-300">Slot Servizio di Rete</h5>`;

                if (server.attachedService === 'c_vpn') {
                    serviceSlotHTML += `
                        <div class="flex items-center justify-between bg-gray-800/50 p-2 rounded-md">
                            <span class="text-xs font-mono text-purple-300">${vpnData.name}</span>
                            <button class="detach-service-btn text-red-500 hover:text-red-400 text-xs" data-server-id="${server.id}">
                                <i class="fas fa-times-circle"></i> Sgancia
                            </button>
                        </div>`;
                } else if (vpnAttachedServer) {
                    serviceSlotHTML += `
                        <div class="bg-gray-800/50 p-2 rounded-md text-center">
                            <span class="text-xs text-gray-500">Slot occupato da VPN (su Server #${vpnAttachedServer.id})</span>
                        </div>`;
                } else {
                    serviceSlotHTML += `
                        <div class="flex items-center gap-2">
                             <span class="text-xs text-gray-400 flex-grow">Slot Libero</span>
                             <button class="attach-service-btn px-2 py-1 text-xs font-semibold rounded-md bg-purple-600 hover:bg-purple-700" data-server-id="${server.id}" data-service-id="c_vpn">
                                Aggancia VPN
                            </button>
                        </div>`;
                }
                serviceSlotHTML += `</div>`;
            }

            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-bold text-white flex items-center gap-3"><i class="fas ${serverData.icon}"></i>Server Clan #${server.id}</h4>
                    <span class="font-mono text-sm text-green-400">${ip}</span>
                </div>
                <div class="trace-bar-bg mt-2">
                    <div class="trace-bar-fill ${traceColorClass}" style="width: ${traceScore}%" title="Tracciabilità: ${traceScore}%"></div>
                </div>
                ${flowSlotsHTML}${serviceSlotHTML}
            `;
            container.appendChild(card);
        });

        container.querySelectorAll('.attach-flow-server-btn').forEach(btn => btn.addEventListener('click', () => attachFlowToServer(parseInt(btn.dataset.serverId), parseInt(btn.dataset.slotIndex), btn.previousElementSibling.value)));
        container.querySelectorAll('.detach-flow-server-btn').forEach(btn => btn.addEventListener('click', () => detachFlowFromServer(parseInt(btn.dataset.serverId), parseInt(btn.dataset.slotIndex))));
        container.querySelectorAll('.attach-service-btn').forEach(btn => btn.addEventListener('click', () => attachServiceToServer(parseInt(btn.dataset.serverId), btn.dataset.serviceId)));
        container.querySelectorAll('.detach-service-btn').forEach(btn => btn.addEventListener('click', () => detachServiceFromServer(parseInt(btn.dataset.serverId))));
        
        return container;
    }

    const infraData = marketData.clanInfrastructure[infraId];
    if (!infraData || !infraData.tiers) return document.createElement('div');

    const currentTier = infraData.tiers[infraState.tier - 1];
    const card = document.createElement('div');
    card.className = 'infra-card p-4 rounded-lg';

    let upgradeButtonHTML = '';
    if (infraState.tier < infraData.tiers.length) {
        const nextTier = infraData.tiers[infraState.tier];
        const costInBtc = nextTier.costUSD / state.btcValueInUSD;
        const canAfford = state.clan.treasury >= costInBtc;
        upgradeButtonHTML = `<button class="upgrade-infra-btn px-3 py-1 text-xs font-semibold rounded-md ${canAfford ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}" data-infra-id="${infraId}" ${!canAfford ? 'disabled' : ''}>Potenzia a T${infraState.tier + 1} (~${costInBtc.toFixed(6)} BTC)</button>`;
    } else {
        upgradeButtonHTML = `<span class="px-3 py-1 text-xs font-semibold text-green-400">Livello Massimo</span>`;
    }

    let detailsHTML = '<div class="mt-3 pt-3 border-t border-gray-600 space-y-2">';
    if (infraState.currentIp && currentTier.refreshCostXMR) {
        const ip = infraState.currentIp;
        const traceScore = state.ipTraceability[ip] || 0;
        let traceColorClass = 'trace-low';
        if (traceScore > 75) traceColorClass = 'trace-high';
        else if (traceScore > 40) traceColorClass = 'trace-medium';

        detailsHTML += `
            <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300 font-semibold">IP Pubblico:</span>
                <div class="flex items-center gap-2">
                    <span class="font-mono text-white">${ip}</span>
                    <button class="refresh-ip-btn px-2 py-1 text-xs font-semibold rounded-md bg-purple-600 hover:bg-purple-700" data-service-id="${currentTier.id}" title="Cambia IP (${currentTier.refreshCostXMR} XMR)">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            <div class="trace-bar-bg">
                <div class="trace-bar-fill ${traceColorClass}" style="width: ${traceScore}%" title="Tracciabilità: ${traceScore}%"></div>
            </div>
        `;
    }

    if (currentTier.flowSlots > 0) {
         detailsHTML += `<h5 class="text-sm font-semibold text-gray-300">Slot Flussi (${infraState.attachedFlows.filter(f => f).length}/${currentTier.flowSlots})</h5>`;
        for(let i = 0; i < currentTier.flowSlots; i++) {
            const attachedFlow = infraState.attachedFlows[i];
            if (attachedFlow) {
                detailsHTML += `<div class="flex items-center justify-between bg-gray-800/50 p-2 rounded-md"><span class="text-xs font-mono text-indigo-300">${attachedFlow}</span><button class="detach-flow-btn text-red-500 hover:text-red-400 text-xs" data-infra-id="${infraId}" data-slot-index="${i}"><i class="fas fa-times-circle"></i> Sgancia</button></div>`;
            } else {
                 let options = '<option value="">Seleziona Flusso...</option>';
                 Object.keys(state.savedFlows).forEach(name => { options += `<option value="${name}">${name}</option>`; });
                 detailsHTML += `<div class="flex items-center gap-2"><select class="flow-select bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-xs w-full">${options}</select><button class="attach-flow-btn px-2 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700" data-infra-id="${infraId}" data-slot-index="${i}">Aggancia</button></div>`;
            }
        }
    }
    detailsHTML += '</div>';

    card.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h4 class="text-lg font-bold text-white flex items-center gap-3"><i class="fas ${infraData.icon}"></i>${infraData.name}</h4>
                <p class="text-sm text-gray-400 mt-1">${currentTier.description}</p>
            </div>
            <div class="text-right">
                <span class="tier-indicator text-xs font-bold px-2 py-1 rounded-full text-white">Tier ${infraState.tier}</span>
                <div class="mt-2">${upgradeButtonHTML}</div>
            </div>
        </div>
        ${detailsHTML}
    `;

    card.querySelectorAll('.upgrade-infra-btn').forEach(btn => btn.addEventListener('click', () => upgradeInfra(btn.dataset.infraId)));
    card.querySelectorAll('.attach-flow-btn').forEach(btn => btn.addEventListener('click', () => attachFlow(btn.dataset.infraId, btn.dataset.slotIndex, btn.previousElementSibling.value)));
    card.querySelectorAll('.detach-flow-btn').forEach(btn => btn.addEventListener('click', () => detachFlow(btn.dataset.infraId, btn.dataset.slotIndex)));
    card.querySelectorAll('.refresh-ip-btn').forEach(btn => btn.addEventListener('click', (e) => refreshVpnIp(e.target.closest('button').dataset.serviceId)));

    return card;
}
function upgradeInfra(infraId) {
    const infraData = marketData.clanInfrastructure[infraId];
    const infraState = state.clan.infrastructure[infraId];

    if (infraState.tier >= infraData.tiers.length) {
        alert("Infrastruttura già al livello massimo.");
        return;
    }

    const nextTier = infraData.tiers[infraState.tier];
    const costInBtc = nextTier.costUSD / state.btcValueInUSD;

    if (state.clan.treasury >= costInBtc) {
        if(confirm(`Potenziare ${infraData.name} a Tier ${infraState.tier + 1} per ~${costInBtc.toFixed(6)} BTC?`)) {
            state.clan.treasury -= costInBtc;
            infraState.tier++;
            if (nextTier.ipAddress) {
                infraState.currentIp = nextTier.ipAddress;
            }
            updateAllBonuses();
            updateClanEcosystemScore();
            saveState();
            renderClanSection();
            if (state.activePage === 'market') initMarketPage();
        }
    } else {
        alert("Fondi insufficienti nella tesoreria del clan.");
    }
}
function attachFlow(infraId, slotIndex, flowName) {
    if(!flowName) return;
    const infraState = state.clan.infrastructure[infraId];
    if (infraState.attachedFlows[slotIndex]) {
        alert("Slot già occupato.");
        return;
    }
    infraState.attachedFlows[slotIndex] = flowName;
    saveState();
    renderClanSection();
}
function detachFlow(infraId, slotIndex) {
    state.clan.infrastructure[infraId].attachedFlows[slotIndex] = null;
    saveState();
    renderClanSection();
}
function attachFlowToServer(serverId, slotIndex, flowName) {
    if (!flowName) return;
    if (!state.clan || !state.clan.infrastructure.servers) return;
    const server = state.clan.infrastructure.servers.find(s => s.id === serverId);
    if (server && server.attachedFlows[slotIndex] === null) {
        server.attachedFlows[slotIndex] = flowName;
        saveState();
        renderClanSection();
    } else {
        alert("Slot già occupato o server non trovato.");
    }
}
function detachFlowFromServer(serverId, slotIndex) {
    if (!state.clan || !state.clan.infrastructure.servers) return;
    const server = state.clan.infrastructure.servers.find(s => s.id === serverId);
    if (server) {
        server.attachedFlows[slotIndex] = null;
        saveState();
        renderClanSection();
    }
}
function renderDataLockerSection() {
    const container = document.getElementById('data-locker-section');
    if (!container) return;

    const renderIntelCards = (intelArray) => {
        if (!intelArray || intelArray.length === 0) {
            return `<p class="text-gray-500 text-center italic">Nessuna informazione cruciale recuperata.</p>`;
        }
        return intelArray.map(item => `
            <div class="data-card p-4 rounded-lg border-l-4 border-yellow-400 bg-gray-800">
                <h4 class="font-bold text-yellow-300 flex items-center gap-2"><i class="fas fa-star"></i> ${item.name}</h4>
                <p class="text-sm text-gray-300 mt-1">${item.description}</p>
                <div class="mt-3 pt-3 border-t border-gray-600 text-xs font-mono">
                    <span class="text-gray-500">Valore di Mercato Stimato:</span> <span class="text-yellow-400">${item.value.toLocaleString()} BTC</span>
                </div>
            </div>
        `).join('');
    };

    const renderPersonalDataCards = (dataArray) => {
        if (dataArray.length === 0) {
            return `<p class="text-gray-500 text-center">Archivio personale vuoto.</p>`;
        }
        return dataArray.map(data => `
            <div class="data-card p-4 rounded-lg">
                <h4 class="font-bold text-white">${data.name}</h4>
                <p class="text-sm text-gray-400">${data.description}</p>
                <div class="mt-3 pt-3 border-t border-gray-600 grid grid-cols-3 gap-2 text-xs font-mono">
                    <div><span class="text-gray-500">Purezza:</span> <span class="text-indigo-300">${data.purity.toFixed(2)}%</span></div>
                    <div><span class="text-gray-500">Sensibilità:</span> <span class="text-indigo-300">${data.sensitivity}</span></div>
                    <div><span class="text-gray-500">Valore:</span> <span class="text-yellow-400">${data.value.toLocaleString()} BTC</span></div>
                </div>
            </div>
        `).join('');
    };

    const renderClanDataCards = (dataArray) => {
        if (!state.clan || !state.clan.infrastructure.servers) return '<p class="text-gray-500">Non sei in un clan o il clan non ha server.</p>';
        if (dataArray.length === 0) {
            return `<p class="text-gray-500 text-center">Archivio del clan vuoto.</p>`;
        }
        return dataArray.map(item => {
            const server = state.clan.infrastructure.servers.find(s => s.id === item.serverId);
            const serverInfo = server ? `Server #${server.id} (${server.ip})` : 'Server Sconosciuto';
            const data = item.data;
            return `
                <div class="data-card p-4 rounded-lg">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-white">${data.name}</h4>
                            <p class="text-sm text-gray-400">${data.description}</p>
                        </div>
                        <div class="text-right ml-2">
                            <p class="text-xs font-mono text-green-400">${serverInfo}</p>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-600 grid grid-cols-3 gap-2 text-xs font-mono">
                        <div><span class="text-gray-500">Purezza:</span> <span class="text-indigo-300">${data.purity.toFixed(2)}%</span></div>
                        <div><span class="text-gray-500">Sensibilità:</span> <span class="text-indigo-300">${data.sensitivity}</span></div>
                        <div><span class="text-gray-500">Valore:</span> <span class="text-yellow-400">${data.value.toLocaleString()} BTC</span></div>
                    </div>
                </div>
            `;
        }).join('');
    };

    container.innerHTML = `
        <h2 class="text-3xl font-bold mb-6 branch-title">Archivio Dati</h2>

        <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4 text-yellow-300">Archivio Intel (Dati Missione)</h3>
            <div class="space-y-4">
                ${renderIntelCards(state.intelItems)}
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h3 class="text-xl font-semibold mb-4 text-gray-300">Archivio Personale (HQ)</h3>
                <div class="space-y-4">
                    ${renderPersonalDataCards(state.dataLocker.personal)}
                </div>
            </div>
            <div>
                <h3 class="text-xl font-semibold mb-4 text-gray-300">Archivio Clan</h3>
                <div class="space-y-4">
                    ${renderClanDataCards(state.dataLocker.clan)}
                </div>
            </div>
        </div>
    `;
}
function initProfilePage() {
    renderProfileContent();
    document.querySelectorAll('.profile-sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => switchProfileSection(btn.dataset.section));
    });
    switchProfileSection(state.activeProfileSection);

    const talentModal = document.getElementById('talent-modal');
    talentModal.addEventListener('click', (e) => {
        if (e.target.id === 'close-modal-talent' || e.target.closest('#close-modal-talent')) {
            closeModal(talentModal);
        } else {
            handleStudyClick(e);
        }
    });
}
