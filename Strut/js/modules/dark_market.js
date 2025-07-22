function initDarkMarketPage() {
    if (!state.clan || !state.clan.darkMarket) {
        document.getElementById('app-container').innerHTML = `<p class="text-center text-red-500">Accesso negato. Il tuo clan non possiede un Dark Market.</p>`;
        return;
    }
    renderMarketHostInfo();
    renderStorableItems();
    renderForSaleItems();
}

function renderMarketHostInfo() {
    const hostInfoEl = document.getElementById('market-host-info');
    if (!hostInfoEl) return;

    const server = state.clan.infrastructure.servers.find(s => s.id === state.clan.darkMarket.hostedOnServerId);
    if (server) {
        hostInfoEl.textContent = `Ospitato su: Server #${server.id} (${server.ip})`;
    }
}

/**
 * VERSIONE CORRETTA: Ora mostra i dati sia dall'archivio personale che da quello del clan.
 */
function renderStorableItems() {
    const container = document.getElementById('clan-data-for-sale');
    if (!container) return;

    const listedItemIds = new Set(state.clan.darkMarket.listings.map(item => item.dataPacket.id));
    
    // 1. Unire i dati da tutte le fonti (personale e clan)
    const allAvailableData = [];
    // Dati personali
    state.dataLocker.personal.forEach(item => {
        allAvailableData.push({ ...item, dataSource: 'personal' });
    });
    // Dati del clan
    state.dataLocker.clan.forEach(clanItem => {
        allAvailableData.push({ ...clanItem.data, dataSource: 'clan', serverId: clanItem.serverId });
    });

    // Filtra i dati non ancora in vendita
    const availableData = allAvailableData.filter(item => !listedItemIds.has(item.id));
    const availableIntel = state.intelItems.filter(item => !listedItemIds.has(item.id));

    if (availableData.length === 0 && availableIntel.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun dato o intel disponibile da mettere in vendita.</p>`;
        return;
    }

    let html = '';

    // Sezione Dati Intel
    if (availableIntel.length > 0) {
        html += `<h4 class="text-lg font-semibold text-yellow-300 mb-2">Dati Intel</h4>`;
        html += availableIntel.map(item => `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-400">
                <p class="font-semibold text-white">${item.name}</p>
                <p class="text-xs text-gray-400">${item.description}</p>
                <div class="text-xs font-mono mt-2">Valore Stimato: <span class="text-yellow-400">${(item.value || 0).toLocaleString()} BTC</span></div>
                <div class="mt-2 flex gap-2">
                    <input type="number" step="0.000001" class="price-input bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white w-full" placeholder="Prezzo di vendita in BTC">
                    <button class="list-item-btn px-3 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700" data-item-id="${item.id}" data-item-type="intel">Vendi Intel</button>
                </div>
            </div>
        `).join('');
    }

    // Sezione Dati Comuni
    if (availableData.length > 0) {
        html += `<h4 class="text-lg font-semibold text-indigo-300 mt-4 mb-2">Dati Comuni</h4>`;
        html += availableData.map(item => {
            const sourceText = item.dataSource === 'personal' ? 'Archivio Personale' : `Server Clan #${item.serverId}`;
            const serverIdAttr = item.dataSource === 'clan' ? `data-server-id="${item.serverId}"` : '';
            const valueInBtc = item.value || 0;

            return `
            <div class="bg-gray-800 p-3 rounded-lg">
                <p class="font-semibold text-white">${item.name}</p>
                <p class="text-xs text-gray-400">Fonte: ${sourceText}</p>
                <p class="text-xs text-gray-400 mt-1">${item.description}</p>
                <div class="text-xs font-mono mt-2">Valore Stimato: <span class="text-yellow-400">${valueInBtc.toLocaleString()} BTC</span></div>
                <div class="mt-2 flex gap-2">
                    <input type="number" step="0.000001" class="price-input bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white w-full" placeholder="Prezzo di vendita in BTC">
                    <button class="list-item-btn px-3 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700" data-item-id="${item.id}" data-item-type="data" data-source="${item.dataSource}" ${serverIdAttr}>Vendi Dato</button>
                </div>
            </div>
        `}).join('');
    }

    container.innerHTML = html;

    container.querySelectorAll('.list-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const { itemId, itemType, source, serverId } = btn.dataset;
            const priceInput = btn.previousElementSibling;
            const price = parseFloat(priceInput.value);

            if (isNaN(price) || price <= 0) {
                alert("Inserisci un prezzo di vendita valido.");
                return;
            }
            
            listItemForSale(itemId, price, itemType, { source, serverId });
        });
    });
}


function renderForSaleItems() {
    const container = document.getElementById('market-listings');
    if (!container) return;

    if (state.clan.darkMarket.listings.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun oggetto attualmente in vendita.</p>`;
        return;
    }

    container.innerHTML = state.clan.darkMarket.listings.map(item => {
        const data = item.dataPacket;
        const borderColor = item.itemType === 'intel' ? 'border-yellow-500' : 'border-green-500';
        const itemTypeName = item.itemType === 'intel' ? 'INTEL' : 'DATO';

        return `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 ${borderColor}">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-semibold text-white">${data.name} <span class="text-xs font-mono text-gray-400">[${itemTypeName}]</span></p>
                        <p class="text-xs text-gray-400">Venduto da: ${item.seller}</p>
                    </div>
                    <button class="unlist-item-btn text-red-500 hover:text-red-400" data-listing-id="${item.listingId}"><i class="fas fa-times-circle"></i></button>
                </div>
                <div class="text-sm font-mono mt-2">Prezzo: <span class="text-yellow-400">${item.price.toLocaleString()} BTC</span></div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.unlist-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            unlistItem(btn.dataset.listingId);
        });
    });
}

/**
 * VERSIONE CORRETTA: Rimuove l'oggetto dalla fonte corretta (personale o clan).
 */
function listItemForSale(itemId, price, itemType, sourceInfo) {
    let itemIndex = -1;
    let itemToSell = null;

    if (itemType === 'data') {
        if (sourceInfo.source === 'personal') {
            itemIndex = state.dataLocker.personal.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                [itemToSell] = state.dataLocker.personal.splice(itemIndex, 1);
            }
        } else if (sourceInfo.source === 'clan') {
            itemIndex = state.dataLocker.clan.findIndex(item => item.data.id === itemId && item.serverId == sourceInfo.serverId);
            if (itemIndex > -1) {
                const clanItem = state.dataLocker.clan.splice(itemIndex, 1)[0];
                itemToSell = clanItem.data;
            }
        }
    } else if (itemType === 'intel') {
        itemIndex = state.intelItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            [itemToSell] = state.intelItems.splice(itemIndex, 1);
            
            const questId = itemToSell.questId;
            const questIndex = state.activeQuests.findIndex(q => q.id === questId);
            if (questIndex > -1) {
                const questTitle = state.activeQuests[questIndex].title;
                state.activeQuests.splice(questIndex, 1);
                state.completedQuests.push(questId);
                alert(`Mettendo in vendita l'intel, la missione "${questTitle}" è stata annullata.`);
            }
        }
    }

    if (!itemToSell) {
        alert("Oggetto non trovato.");
        return;
    }

    state.clan.darkMarket.listings.push({
        listingId: `listing-${Date.now()}`,
        itemType: itemType,
        dataPacket: itemToSell,
        price: price,
        seller: state.hackerName
    });

    saveState();
    renderStorableItems();
    renderForSaleItems();
}

function unlistItem(listingId) {
    const itemIndex = state.clan.darkMarket.listings.findIndex(item => item.listingId === listingId);
    if (itemIndex === -1) {
        alert("Oggetto non trovato.");
        return;
    }
    
    const [removedListing] = state.clan.darkMarket.listings.splice(itemIndex, 1);
    
    if (removedListing.itemType === 'data') {
        // Per semplicità, i dati rimossi tornano sempre all'archivio personale.
        // Una logica più complessa potrebbe ricordare la fonte originale.
        state.dataLocker.personal.push(removedListing.dataPacket);
    } else if (removedListing.itemType === 'intel') {
        state.intelItems.push(removedListing.dataPacket);
    }

    saveState();
    renderStorableItems();
    renderForSaleItems();
}
