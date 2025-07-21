// File: js/modules/active_attacks.js
// VERSIONE AGGIORNATA: La risoluzione degli attacchi ora può generare e aggiungere host infetti al pool.

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

function handleAttackConsequences(attack, successRatio, effectiveStats) {
    const failureSeverity = 1 - successRatio;
    if (failureSeverity <= 0) return;

    let traceIncrease = 0;
    traceIncrease += failureSeverity * 20;
    traceIncrease += (effectiveStats.rl / 10);
    traceIncrease -= (effectiveStats.an / 2);
    traceIncrease += (100 - (attack.flowFc || 100)) / 10;
    traceIncrease += (attack.target.tier || 1) * 5;
    traceIncrease = Math.max(5, Math.ceil(traceIncrease));

    const getNodeInfo = (nodeId) => {
        if (networkNodeData[nodeId]) return networkNodeData[nodeId];
        const personalService = marketData.networkServices.find(s => s.id === nodeId);
        if (personalService) return { ...personalService, currentIp: state.purchasedServices[nodeId]?.currentIp };
        if (nodeId.startsWith('c_vpn_t') && state.clan?.infrastructure.c_vpn) {
            const tier = state.clan.infrastructure.c_vpn.tier - 1;
            return { ...marketData.clanInfrastructure.c_vpn.tiers[tier], currentIp: state.clan.infrastructure.c_vpn.currentIp };
        }
        return null;
    };

    attack.routingChain.forEach(nodeId => {
        const node = getNodeInfo(nodeId);
        const ip = node?.currentIp || node?.ipAddress;
        if (ip) {
            if (!state.ipTraceability[ip]) state.ipTraceability[ip] = 0;
            state.ipTraceability[ip] = Math.min(100, state.ipTraceability[ip] + traceIncrease);
        }
    });

    let traceSuccessful = true;
    for (const nodeId of [...attack.routingChain].reverse()) {
        const node = getNodeInfo(nodeId);
        if (node) {
            const chanceToBlockTrace = (node.anonymity * 5) / 100;
            if (Math.random() < chanceToBlockTrace) {
                traceSuccessful = false;
                showNotification(`La traccia dell'attacco è stata bloccata dal nodo: ${node.name}`, 'info');
                break;
            }
        }
    }

    if (traceSuccessful) {
        let sourceIp = state.identity.realIp;
        let traceDetails = `La catena di routing non ha retto. L'IP di origine è stato tracciato.`; // Messaggio di default

        if (attack.host && attack.host.type === 'clan') {
            const server = state.clan.infrastructure.servers.find(s => s.id === attack.host.serverId);
            if (server) {
                sourceIp = server.ip;
                traceDetails = `L'attacco è stato tracciato fino al server del clan: ${server.ip}.`;
            }
        } 
        // **FIX**: Logica specifica per attacchi da botnet
        else if (attack.host && attack.host.type === 'botnet_group') {
            const groupName = attack.host.name;
            const group = state.botnetGroups[groupName];
            sourceIp = `Gruppo Botnet: ${groupName}`; // L'origine è il gruppo

            if (group && group.hostIds.length > 0) {
                const hostIPs = group.hostIds.map(hostId => {
                    const host = state.infectedHostPool.find(h => h.id === hostId);
                    if (host) {
                        // Aumenta la tracciabilità dei singoli bot coinvolti
                        host.traceabilityScore = Math.min(100, (host.traceabilityScore || 0) + traceIncrease);
                        return host.ipAddress;
                    }
                    return null;
                }).filter(ip => ip);

                if (hostIPs.length > 0) {
                    traceDetails = `L'attacco è stato tracciato fino al gruppo botnet '${groupName}'. IP esposti: ${hostIPs.join(', ')}.`;
                } else {
                    traceDetails = `L'attacco è stato tracciato fino al gruppo botnet '${groupName}', ma non sono stati trovati IP specifici.`;
                }
            } else {
                 traceDetails = `L'attacco è stato tracciato fino al gruppo botnet '${groupName}', ma il gruppo è vuoto o non è stato trovato.`;
            }
        }

        if (!state.ipTraceability[sourceIp]) state.ipTraceability[sourceIp] = 0;
        state.ipTraceability[sourceIp] = Math.min(100, state.ipTraceability[sourceIp] + traceIncrease);

        state.identity.traces += Math.ceil(traceIncrease / 5);
        state.traceLogs.unshift({
            type: "Origine Esposta",
            ip: sourceIp,
            date: new Date().toISOString().split('T')[0],
            target: attack.target.name,
            details: traceDetails // Usa il messaggio dettagliato
        });
        if(state.traceLogs.length > 20) state.traceLogs.pop();
        
        showNotification(`ATTENZIONE: L'origine del tuo attacco (${sourceIp}) è stata tracciata!`, 'error');
        state.identity.suspicion = Math.min(100, state.identity.suspicion + Math.ceil(traceIncrease / 2));
    }

    if (state.activePage === 'profile') {
        updateProfileData();
    }
}


function resolveAttack(attack, progressPercentage) {
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

    const isDetected = effectiveStats.rl > req.rl;
    if (isDetected && (attack.target.tier >= 3)) {
        showNotification(`Attacco rilevato! ${attack.target.name} sta attuando contromisure!`, 'error');
    }

    if (successRatio < 1) {
        handleAttackConsequences(attack, successRatio, effectiveStats);
    }

    if (successRatio < 0.5) {
        alert('Attacco Fallito! Le statistiche del tuo flusso non erano abbastanza alte per superare le difese del bersaglio.');
        return;
    }

    const xpGain = Math.floor(((req.rc * 10) + (req.lcs * 5) + (req.an * 5) + attack.target.sensitivity * 2) * successRatio * (progressPercentage / 100));
    addXp(xpGain, 'player');
    if (attack.host && attack.host.type === 'clan' && state.clan) {
        addXp(xpGain, 'clan');
    }

    // --- NUOVA LOGICA DI ACQUISIZIONE HOST ---
    const objective = flowObjectives[attack.flowObjective];
    let infectionType = null;
    let hostsToInfect = 0;

    if (objective && (attack.flowObjective === 'remoteControl' || attack.flowObjective === 'botnet' || attack.flowObjective === 'worm')) {
        if (objective.pfe.bot_component) infectionType = 'BotnetAgent';
        else if (objective.pfe.replication) infectionType = 'WormAgent';
        else if (objective.pfe.c2) infectionType = 'Backdoor';
        
        if (infectionType) {
            hostsToInfect = Math.ceil(effectiveStats.eo / 2 * successRatio);
            for(let i = 0; i < hostsToInfect; i++) {
                const newHost = {
                    id: `host-${Date.now()}-${i}`,
                    ipAddress: generateRandomIp(),
                    location: attack.nationName || 'Sconosciuta',
                    status: 'Active',
                    infectionType: infectionType,
                    stabilityScore: Math.min(99, effectiveStats.rc * 20),
                    traceabilityScore: 10 + effectiveStats.rl,
                    resources: {
                        cpuPower: parseFloat((1 + Math.random() * effectiveStats.eo).toFixed(2)),
                        bandwidth: 100 + Math.floor(Math.random() * 900)
                    },
                    lastContact: Date.now()
                };
                state.infectedHostPool.push(newHost);
            }
            if (hostsToInfect > 0) {
                showNotification(`${hostsToInfect} nuovo/i host infettati con ${infectionType} e aggiunti al tuo pool!`, 'success');
                if (state.activePage === 'botnet') {
                    initBotnetPage(); // Aggiorna la pagina se l'utente è lì
                }
            }
        }
    }
    // --- FINE LOGICA ---

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
    } else if (hostsToInfect === 0) {
        alert('Operazione completata con successo parziale, ma non sono stati estratti dati di valore.');
    }
}

function stopAttack(attackId) {
    const attackIndex = state.activeAttacks.findIndex(a => a.id === attackId);
    if (attackIndex === -1) return;
    
    const attack = state.activeAttacks[attackIndex];
    const elapsedTime = (Date.now() - attack.startTime) / 1000;
    const progressPercentage = Math.min(100, (elapsedTime / attack.finalTime) * 100);

    state.activeAttacks.splice(attackIndex, 1);
    resolveAttack(attack, progressPercentage);
    
    saveState();
    updateActiveAttacks();
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
    resolveAttack(attack, 100);
    saveState();
    updateActiveAttacks();
}
