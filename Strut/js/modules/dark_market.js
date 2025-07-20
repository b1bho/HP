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
 * VERSIONE AGGIORNATA: Ora mostra sia i Dati normali (dall'archivio personale)
 * sia i Dati Intel pronti per essere messi in vendita.
 */
function renderStorableItems() {
    const container = document.getElementById('clan-data-for-sale');
    if (!container) return;

    const listedItemIds = new Set(state.clan.darkMarket.listings.map(item => item.dataPacket.id));
    
    // Filtra i dati personali e intel non ancora in vendita
    const availableData = state.dataLocker.personal.filter(item => !listedItemIds.has(item.id));
    const availableIntel = state.intelItems.filter(item => !listedItemIds.has(item.id));

    if (availableData.length === 0 && availableIntel.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun dato personale o intel disponibile da mettere in vendita.</p>`;
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
                <div class="text-xs font-mono mt-2">Valore Stimato: <span class="text-yellow-400">${item.value.toLocaleString()} BTC</span></div>
                <div class="mt-2 flex gap-2">
                    <input type="number" class="price-input bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white w-full" placeholder="Prezzo di vendita in BTC">
                    <button class="list-item-btn px-3 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700" data-intel-id="${item.id}">Vendi Intel</button>
                </div>
            </div>
        `).join('');
    }

    // Sezione Dati Comuni
    if (availableData.length > 0) {
        html += `<h4 class="text-lg font-semibold text-indigo-300 mt-4 mb-2">Dati Comuni (Archivio Personale)</h4>`;
        html += availableData.map(item => `
            <div class="bg-gray-800 p-3 rounded-lg">
                <p class="font-semibold text-white">${item.name}</p>
                <p class="text-xs text-gray-400">${item.description}</p>
                <div class="text-xs font-mono mt-2">Valore Stimato: <span class="text-yellow-400">${item.value.toLocaleString()} BTC</span></div>
                <div class="mt-2 flex gap-2">
                    <input type="number" class="price-input bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white w-full" placeholder="Prezzo di vendita in BTC">
                    <button class="list-item-btn px-3 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700" data-data-id="${item.id}">Vendi Dato</button>
                </div>
            </div>
        `).join('');
    }

    container.innerHTML = html;

    // Aggiungi listener ai pulsanti
    container.querySelectorAll('.list-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const dataId = btn.dataset.dataId;
            const intelId = btn.dataset.intelId;
            const priceInput = btn.previousElementSibling;
            const price = parseInt(priceInput.value);

            if (isNaN(price) || price <= 0) {
                alert("Inserisci un prezzo di vendita valido.");
                return;
            }
            
            if (dataId) {
                listItemForSale(dataId, price, 'data');
            } else if (intelId) {
                listItemForSale(intelId, price, 'intel');
            }
        });
    });
}

/**
 * VERSIONE AGGIORNATA: Ora gestisce la visualizzazione di entrambi i tipi di dati.
 */
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
 * VERSIONE AGGIORNATA: Quando un Dato Intel viene messo in vendita,
 * la missione associata viene automaticamente annullata.
 */
function listItemForSale(itemId, price, itemType) {
    let itemIndex = -1;
    let itemToSell = null;

    if (itemType === 'data') {
        itemIndex = state.dataLocker.personal.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            [itemToSell] = state.dataLocker.personal.splice(itemIndex, 1);
        }
    } else if (itemType === 'intel') {
        itemIndex = state.intelItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            [itemToSell] = state.intelItems.splice(itemIndex, 1);
            
            // NUOVA LOGICA: Annulla la missione associata
            const questId = itemToSell.questId;
            const questIndex = state.activeQuests.findIndex(q => q.id === questId);
            if (questIndex > -1) {
                const questTitle = state.activeQuests[questIndex].title;
                state.activeQuests.splice(questIndex, 1); // Rimuovi da attive
                state.completedQuests.push(questId); // Aggiungi a completate per non farla riapparire
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
        itemType: itemType, // Salva il tipo di oggetto
        dataPacket: itemToSell,
        price: price,
        seller: state.hackerName
    });

    saveState();
    renderStorableItems();
    renderForSaleItems();
}

/**
 * VERSIONE AGGIORNATA: Gestisce la rimozione dalla vendita di Dati e Intel.
 */
function unlistItem(listingId) {
    const itemIndex = state.clan.darkMarket.listings.findIndex(item => item.listingId === listingId);
    if (itemIndex === -1) {
        alert("Oggetto non trovato.");
        return;
    }
    
    const [removedListing] = state.clan.darkMarket.listings.splice(itemIndex, 1);
    
    // Rimette l'oggetto nel giusto archivio in base al suo tipo
    if (removedListing.itemType === 'data') {
        state.dataLocker.personal.push(removedListing.dataPacket);
    } else if (removedListing.itemType === 'intel') {
        state.intelItems.push(removedListing.dataPacket);
        
        // Logica inversa: se rimuovi l'intel dalla vendita, la missione NON torna attiva
        // per evitare abusi. La scelta di vendere è definitiva.
    }

    saveState();
    renderStorableItems();
    renderForSaleItems();
}
