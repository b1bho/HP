function updateActiveAttacks() {
    if (state.activePage !== 'world') {
        const container = document.getElementById('active-attacks-grid-container');
        if(container) container.innerHTML = '';
        return;
    }
    renderActiveAttacksPanel();
}

function renderActiveAttacksPanel() {
    const container = document.getElementById('active-attacks-grid-container');
    if (!container) return;

    if (!state.activeAttacks || state.activeAttacks.length === 0) {
        container.innerHTML = `<p class="text-gray-500 italic col-span-full">Nessuna operazione in corso.</p>`;
        return;
    }

    const expandedAttacks = new Set();
    container.querySelectorAll('.operation-card.expanded').forEach(card => {
        expandedAttacks.add(card.dataset.attackId);
    });

    let attacksHTML = state.activeAttacks.map(attack => {
        const elapsedTime = (Date.now() - attack.startTime) / 1000;
        const remainingTime = Math.max(0, attack.finalTime - elapsedTime);
        const progressPercentage = Math.min(100, (elapsedTime / attack.finalTime) * 100);

        const currentQuantity = Math.floor((attack.target.rewardScale || 0) * (progressPercentage / 100));
        const currentPurity = 60 + (38 * (progressPercentage / 100));
        const xmrCost = Math.max(1, Math.ceil(2 + (remainingTime / 300)));
        const timeString = new Date(remainingTime * 1000).toISOString().substr(11, 8);
        const isExpanded = expandedAttacks.has(attack.id);

        return `
            <div class="operation-card bg-gray-900/80 backdrop-blur-sm border border-orange-500 rounded-lg shadow-2xl pointer-events-auto ${isExpanded ? 'expanded' : ''}" data-attack-id="${attack.id}">
                <div class="compact-view p-3 cursor-pointer flex items-center gap-4">
                    <i class="fas fa-crosshairs text-orange-400 text-lg px-2"></i>
                    <div class="flex-grow">
                        <div class="flex justify-between text-sm">
                            <span class="font-bold text-white">${attack.target.name}</span>
                            <span class="font-mono">${timeString}</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                            <div class="bg-orange-500 h-1.5 rounded-full" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>
                     <i class="fas fa-chevron-down expand-icon p-2 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}"></i>
                </div>
                <div class="expanded-view p-4 border-t border-gray-700">
                    <div class="grid grid-cols-3 gap-4 text-center mb-4">
                        <div>
                            <div class="text-xs text-gray-400">DATI STIMATI</div>
                            <div class="text-lg font-bold">${currentQuantity.toLocaleString()}</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-400">PUREZZA STIMATA</div>
                            <div class="text-lg font-bold">${currentPurity.toFixed(2)}%</div>
                        </div>
                         <div>
                            <div class="text-xs text-gray-400">RISCHIO</div>
                            <div class="text-lg font-bold text-red-500">${progressPercentage.toFixed(0)}%</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <button class="stop-attack-btn w-full px-4 py-2 font-semibold rounded-md bg-yellow-600 hover:bg-yellow-700 text-black" data-attack-id="${attack.id}">
                            <i class="fas fa-stop-circle mr-2"></i>Interrompi
                        </button>
                        <button class="skip-attack-btn w-full px-4 py-2 font-semibold rounded-md bg-purple-600 hover:bg-purple-700" data-attack-id="${attack.id}">
                            <i class="fas fa-forward mr-2"></i>Completa (${xmrCost} XMR)
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = attacksHTML;

    container.querySelectorAll('.compact-view').forEach(el => {
        el.addEventListener('click', (e) => {
            const card = e.target.closest('.operation-card');
            card.classList.toggle('expanded');
            card.querySelector('.expand-icon').classList.toggle('rotate-180');
        });
    });

    container.querySelectorAll('.stop-attack-btn').forEach(btn => {
        btn.addEventListener('click', () => stopAttack(btn.dataset.attackId));
    });
    container.querySelectorAll('.skip-attack-btn').forEach(btn => {
        btn.addEventListener('click', () => skipAttack(btn.dataset.attackId));
    });
}

/**
 * NUOVA FUNZIONE (FASE 3): Simula il tracciamento dell'IP dopo un attacco.
 * @param {object} attack - L'oggetto dell'attacco completato.
 * @param {number} successRatio - Il rapporto di successo dell'attacco (da 0 a 1).
 */
function handleTraceback(attack, successRatio) {
    let traceSuccessful = true;
    const reversedChain = [...attack.routingChain].reverse();

    for (const nodeId of reversedChain) {
        // Trova i dati del nodo da tutte le possibili fonti
        let nodeData = null;
        if (networkNodeData[nodeId]) {
            nodeData = networkNodeData[nodeId];
        } else {
            const personalNode = marketData.networkServices.find(item => item.id === nodeId);
            if (personalNode) {
                nodeData = personalNode;
            } else if (nodeId.startsWith('clan_vpn_t')) {
                const tier = parseInt(nodeId.replace('clan_vpn_t', ''));
                if (state.clan && state.clan.infrastructure.c_vpn && state.clan.infrastructure.c_vpn.tier === tier) {
                    nodeData = marketData.clanInfrastructure.c_vpn.tiers[tier - 1];
                }
            }
        }

        if (!nodeData) {
            traceSuccessful = false;
            break; // Nodo sconosciuto, la traccia si interrompe
        }

        // La probabilità di tracciare un nodo è inversamente proporzionale alla sua anonimità
        // e aumenta se l'attacco è fallito.
        const baseTraceChance = 1 / (nodeData.anonymity + 1);
        const failureModifier = 1 + (1 - successRatio); // Aumenta la probabilità fino al doppio se l'attacco è un fallimento totale
        const finalTraceChance = baseTraceChance * failureModifier;

        if (Math.random() > finalTraceChance) {
            // La traccia fallisce, l'anonimato del nodo ha retto
            traceSuccessful = false;
            break;
        }
        // Se il loop continua, la traccia è riuscita a superare questo nodo
    }

    if (traceSuccessful) {
        // La traccia ha superato l'intera catena ed è arrivata al giocatore!
        const suspicionGain = 30 + Math.floor(Math.random() * 20);
        const tracesGain = 5 + Math.floor(Math.random() * 5);
        state.identity.suspicion = Math.min(100, state.identity.suspicion + suspicionGain);
        state.identity.traces += tracesGain;
        alert(`DISASTRO! Il tuo attacco è stato tracciato fino alla sua origine. Il tuo livello di sospetto è aumentato drasticamente!`);
        if (state.activePage === 'profile') {
            updateProfileData();
        }
    }
}


function resolveAttack(attack, progressPercentage) {
    for (const nodeId of (attack.routingChain || [])) {
        let nodeData = networkNodeData[nodeId] || marketData.networkServices.find(i => i.id === nodeId);
        if (!nodeData && nodeId.startsWith('clan_vpn_t')) {
             const tier = parseInt(nodeId.replace('clan_vpn_t', ''));
             nodeData = marketData.clanInfrastructure.c_vpn.tiers[tier - 1];
        }
        if (nodeData && Math.random() < nodeData.blockRisk) {
            alert(`Attacco Fallito! Il nodo '${nodeData.name}' nella tua catena è stato scoperto e bloccato.`);
            state.identity.traces += 3;
            state.identity.suspicion += 20;
            if (state.activePage === 'profile') updateProfileData();
            return;
        }
    }

    const req = attack.target.req;
    const stats = attack.flowStats;
    const fcModifier = (attack.flowFc || 100) / 100;

    const effectiveStats = {
        lso: stats.lso * fcModifier, rc: stats.rc * fcModifier, lcs: stats.lcs * fcModifier,
        an: stats.an * fcModifier, eo: stats.eo * fcModifier, rl: stats.rl
    };

    const results = {
        lso: effectiveStats.lso >= req.lso, rc: effectiveStats.rc >= req.rc,
        lcs: effectiveStats.lcs >= req.lcs, an: effectiveStats.an >= req.an,
        eo: effectiveStats.eo >= req.eo, rl: effectiveStats.rl <= req.rl
    };
    
    const checks = Object.values(results);
    const passedChecks = checks.filter(Boolean).length;
    const totalChecks = checks.length;
    const successRatio = passedChecks / totalChecks;

    // Esegui il controllo di tracciamento dopo ogni attacco
    handleTraceback(attack, successRatio);

    if (successRatio < 0.5) {
        alert('Attacco Fallito! Le statistiche del tuo flusso non erano abbastanza alte per superare le difese del bersaglio.');
        if (attack.host.type === 'personal') {
            state.identity.traces += 2;
            state.identity.suspicion += 15;
        } else if (state.clan) {
            state.clan.visibility = (state.clan.visibility || 0) + 10;
        }
        if (state.activePage === 'profile') updateProfileData();
        return;
    }

    const xpGain = Math.floor(((req.rc * 10) + (req.lcs * 5) + (req.an * 5) + attack.target.sensitivity * 2) * successRatio * (progressPercentage / 100));
    addXp(xpGain, 'player');
    if (attack.host.type === 'clan' && state.clan) {
        addXp(xpGain, 'clan');
    }

    const performance = (effectiveStats.rc / req.rc + effectiveStats.lcs / req.lcs) / 2;
    const quantity = Math.floor(attack.target.rewardScale * successRatio * (progressPercentage / 100));
    const purity = Math.min(100, (60 + (performance - 1) * 40 + (req.rl - effectiveStats.rl) * 2) * successRatio * (progressPercentage / 100));
    const valueUSD = Math.floor(quantity * (purity / 100) * attack.target.sensitivity * 0.5);
    const valueBTC = valueUSD / state.btcValueInUSD;

    const dataPacket = {
        id: `data-${Date.now()}`, name: `${attack.target.rewardType}`,
        description: `Dati acquisiti da ${attack.target.name}, ${attack.nationName}`,
        purity: purity, sensitivity: attack.target.sensitivity,
        quantity: quantity, value: valueBTC
    };

    if (dataPacket.quantity > 0) {
        showStorageChoiceModal(dataPacket);
    } else {
        alert('Operazione completata con successo parziale, ma la qualità del flusso non è stata sufficiente per estrarre dati di valore.');
    }
}

function stopAttack(attackId) {
    const attackIndex = state.activeAttacks.findIndex(a => a.id === attackId);
    if (attackIndex === -1) return;
    
    const attack = state.activeAttacks[attackIndex];
    const elapsedTime = (Date.now() - attack.startTime) / 1000;
    const progressPercentage = Math.min(100, (elapsedTime / attack.finalTime) * 100);

    state.activeAttacks.splice(attackIndex, 1);
    saveState();
    updateActiveAttacks();
    
    resolveAttack(attack, progressPercentage);
}

function skipAttack(attackId) {
    const attackIndex = state.activeAttacks.findIndex(a => a.id === attackId);
    if (attackIndex === -1) return;
    const attack = state.activeAttacks[attackIndex];
    
    const elapsedTime = (Date.now() - attack.startTime) / 1000;
    const remainingTime = Math.max(0, attack.finalTime - elapsedTime);
    const xmrCost = Math.max(1, Math.ceil(2 + (remainingTime / 300)));

    if (state.xmr < xmrCost) {
        alert(`Non hai abbastanza Monero (XMR). Costo richiesto: ${xmrCost} XMR.`);
        return;
    }

    state.xmr -= xmrCost;
    updateUI();

    state.activeAttacks.splice(attackIndex, 1);
    saveState();
    updateActiveAttacks();

    resolveAttack(attack, 100);
}
