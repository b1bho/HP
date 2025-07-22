// File: js/modules/market.js
// VERSIONE CORRETTA: Aggiunto lo stato 'attachedService' alla creazione di nuovi server.

function renderMarket() {
    const hardwareContainer = document.getElementById('hardware-market');
    const infraContainer = document.getElementById('infra-market');
    const networkServicesContainer = document.getElementById('network-services-market');
    const clanInfraContainer = document.getElementById('clan-infra-market');

    if (!hardwareContainer || !infraContainer || !clanInfraContainer || !networkServicesContainer) return;

    hardwareContainer.innerHTML = '';
    infraContainer.innerHTML = '';
    networkServicesContainer.innerHTML = '';
    clanInfraContainer.innerHTML = '';

    marketData.personalHardware.forEach(item => hardwareContainer.appendChild(createMarketItem(item, 'hardware')));
    marketData.personalInfrastructure.forEach(item => infraContainer.appendChild(createMarketItem(item, 'hardware')));
    marketData.networkServices.forEach(item => networkServicesContainer.appendChild(createMarketItem(item, 'service')));

    Object.values(marketData.clanInfrastructure).forEach(infra => {
        if (infra.id === 'c_server') {
            clanInfraContainer.appendChild(createMarketItem(infra, 'clan'));
        } else if (infra.tiers) {
            const currentTier = (state.clan && state.clan.infrastructure[infra.id]) ? state.clan.infrastructure[infra.id].tier : 0;
            if (currentTier < infra.tiers.length) {
                const tierToDisplay = infra.tiers[currentTier];
                clanInfraContainer.appendChild(createMarketItem(tierToDisplay, 'clan', infra.id));
            }
        }
    });
}

function createMarketItem(item, type, baseId = null) {
    const itemId = item.id;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'market-item p-4 rounded-lg flex flex-col';
    const costInBtc = item.costUSD / state.btcValueInUSD;
    
    let isOwned = false;
    if (type === 'hardware') {
        isOwned = !!state.ownedHardware[itemId];
    } else if (type === 'service') {
        isOwned = !!state.purchasedServices[itemId];
    }
    
    const canAfford = type === 'clan' ? (state.clan && state.clan.treasury >= costInBtc) : (state.btc >= costInBtc);
    const isLeader = state.clan && state.clan.members.find(m => m.name === state.hackerName && m.role === 'Leader');
    
    let canBuy = false;
    let buttonText = 'Compra';

    if (type === 'hardware' || type === 'service') {
        canBuy = canAfford && !isOwned;
        if (isOwned) buttonText = 'Posseduto';
    } else if (type === 'clan') {
        const isServer = item.id === 'c_server';
        if (isServer) {
            const serverCount = state.clan && state.clan.infrastructure.servers ? state.clan.infrastructure.servers.length : 0;
            if (serverCount >= 5) {
                canBuy = false;
                buttonText = 'Massimo Raggiunto';
            } else {
                canBuy = isLeader && canAfford;
                buttonText = `Compra (${serverCount}/5)`;
            }
        } else {
            const currentTier = (state.clan && state.clan.infrastructure[baseId]) ? state.clan.infrastructure[baseId].tier : 0;
            const isFirstPurchase = currentTier === 0;
            canBuy = isLeader && canAfford && isFirstPurchase;
        }
    }

    itemDiv.innerHTML = `
        <h4 class="text-lg font-bold text-white">${item.name}</h4>
        <p class="text-sm text-gray-400 flex-grow my-2">${item.description}</p>
        <div class="flex justify-between items-center mt-4">
            <span class="text-yellow-400 font-bold">${costInBtc.toFixed(6)} BTC</span>
            <button class="buy-btn px-4 py-2 text-sm font-medium rounded-md" data-item-id="${itemId}" data-item-base-id="${baseId || itemId}" data-item-type="${type}" ${!canBuy ? 'disabled' : ''}>${buttonText}</button>
        </div>`;

    if (canBuy) {
        itemDiv.querySelector('.buy-btn').addEventListener('click', buyMarketItem);
    }
    return itemDiv;
}

function buyMarketItem(event) {
    const { itemId, itemBaseId, itemType } = event.target.dataset;

    if (itemType === 'hardware' || itemType === 'service') {
        const itemData = itemType === 'hardware' 
            ? [...marketData.personalHardware, ...marketData.personalInfrastructure].find(i => i.id === itemId)
            : marketData.networkServices.find(i => i.id === itemId);

        if (!itemData) return;

        const costInBtc = itemData.costUSD / state.btcValueInUSD;
        if (state.btc >= costInBtc) {
            if (confirm(`Acquistare ${itemData.name} per ~${costInBtc.toFixed(6)} BTC?`)) {
                state.btc -= costInBtc;
                if (itemType === 'hardware') {
                    state.ownedHardware[itemId] = true;
                } else { // service
                    state.purchasedServices[itemId] = {
                        id: itemId,
                        currentIp: itemData.ipAddress 
                    };
                }
                updateAllBonuses();
                saveState();
                updateUI();
                renderMarket();
            }
        }
    } else if (itemType === 'clan') {
        if (itemBaseId === 'c_server') {
            const item = marketData.clanInfrastructure.clanServer;
            const costInBtc = item.costUSD / state.btcValueInUSD;
            const serverCount = state.clan && state.clan.infrastructure.servers ? state.clan.infrastructure.servers.length : 0;
            if (state.clan && state.clan.treasury >= costInBtc && serverCount < 5) {
                if (confirm(`Acquistare un nuovo Server Clan per ~${costInBtc.toFixed(6)} BTC?`)) {
                    state.clan.treasury -= costInBtc;
                    if (!state.clan.infrastructure.servers) state.clan.infrastructure.servers = [];
                    if (!state.clan.id) state.clan.id = Math.floor(Math.random() * 100);
                    const newServerId = state.clan.infrastructure.servers.length > 0 ? Math.max(...state.clan.infrastructure.servers.map(s => s.id)) + 1 : 1;
                    const newIp = `10.C${state.clan.id}.${newServerId}.${Math.floor(Math.random() * 254) + 1}`;
                    const newServer = {
                        id: newServerId,
                        ip: newIp,
                        attachedFlows: Array(item.flowSlots).fill(null),
                        attachedService: null // Aggiunto stato per i servizi
                    };
                    state.clan.infrastructure.servers.push(newServer);
                    updateAllBonuses();
                    updateClanEcosystemScore();
                    saveState();
                    updateUI();
                    renderMarket();
                    if (state.activePage === 'profile') renderClanSection();
                }
            }
        } else {
            const infra = marketData.clanInfrastructure[itemBaseId];
            if (!infra) return;
            const item = infra.tiers.find(t => t.id === itemId);
            if (!item) return;
            const costInBtc = item.costUSD / state.btcValueInUSD;
            if (state.clan && state.clan.treasury >= costInBtc && !state.clan.infrastructure[itemBaseId]) {
                if (confirm(`Acquistare ${item.name} per il clan per ~${costInBtc.toFixed(6)} BTC?`)) {
                    state.clan.treasury -= costInBtc;
                    const newInfra = { tier: 1, attachedFlows: [] };
                    if (itemBaseId === 'c_vpn' || itemBaseId === 'c_firewall') {
                        newInfra.currentIp = item.ipAddress;
                    }
                    state.clan.infrastructure[itemBaseId] = newInfra;
                    updateAllBonuses();
                    updateClanEcosystemScore();
                    saveState();
                    updateUI();
                    renderMarket();
                    if (state.activePage === 'profile') renderClanSection();
                }
            } else {
                alert("Condizioni non soddisfatte per l'acquisto.");
            }
        }
    }
}

function initMarketPage() {
    renderMarket();
}
