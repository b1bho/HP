function updateActiveAttacks() {
    // Questa funzione ora si attiva solo se la pagina del mondo è visibile
    if (state.activePage !== 'world') {
        const container = document.getElementById('active-attacks-grid-container');
        if(container) container.innerHTML = ''; // Pulisce il pannello se si cambia pagina
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

        const currentQuantity = Math.floor(attack.target.rewardScale * (progressPercentage / 100));
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

function resolveAttack(attack, progressPercentage) {
    const req = attack.target.req;
    const stats = attack.flowStats;
    const fcModifier = (attack.flowFc || 100) / 100;

    const effectiveStats = {
        lso: stats.lso * fcModifier,
        rc: stats.rc * fcModifier,
        lcs: stats.lcs * fcModifier,
        an: stats.an * fcModifier,
        eo: stats.eo * fcModifier,
        rl: stats.rl
    };

    const results = {
        lso: effectiveStats.lso >= req.lso,
        rc: effectiveStats.rc >= req.rc,
        lcs: effectiveStats.lcs >= req.lcs,
        an: effectiveStats.an >= req.an,
        eo: effectiveStats.eo >= req.eo,
        rl: effectiveStats.rl <= req.rl
    };
    
    const checks = Object.values(results);
    const passedChecks = checks.filter(Boolean).length;
    const totalChecks = checks.length;
    const successRatio = passedChecks / totalChecks;

    // Fallimento completo solo se meno della metà dei requisiti sono soddisfatti (es. < 3 su 6)
    if (successRatio < 0.5) {
        alert('Attacco Fallito! Le tue difese non erano adeguate e l\'operazione è stata scoperta e interrotta.');
        if (attack.host.type === 'personal') {
            state.identity.traces += 2;
            state.identity.suspicion += 15;
        } else if (state.clan) {
            state.clan.visibility = (state.clan.visibility || 0) + 10;
        }
        if (state.activePage === 'profile') updateProfileData();
        return;
    }

    // Successo (parziale o completo)
    const xpGain = Math.floor(((req.rc * 10) + (req.lcs * 5) + (req.an * 5) + attack.target.sensitivity * 2) * successRatio * (progressPercentage / 100));
    addXp(xpGain, 'player');
    if (attack.host.type === 'clan' && state.clan) {
        addXp(xpGain, 'clan');
    }

    const performance = (effectiveStats.rc / req.rc + effectiveStats.lcs / req.lcs) / 2;
    
    const dataPacket = {
        id: `data-${Date.now()}`,
        name: `${attack.target.rewardType}`,
        description: `Dati acquisiti da ${attack.target.name}, ${attack.nationName}`,
        purity: Math.min(100, (60 + (performance - 1) * 40 + (req.rl - effectiveStats.rl) * 2) * successRatio * (progressPercentage / 100)),
        sensitivity: attack.target.sensitivity,
        quantity: Math.floor(attack.target.rewardScale * successRatio * (progressPercentage / 100)),
        value: 0
    };
    dataPacket.value = Math.floor(dataPacket.quantity * (dataPacket.purity / 100) * dataPacket.sensitivity * 0.1);

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
