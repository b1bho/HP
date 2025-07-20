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

function renderStorableItems() {
    const container = document.getElementById('clan-data-for-sale');
    if (!container) return;

    const listedDataIds = state.clan.darkMarket.listings.map(item => item.dataPacket.id);
    const availableData = state.dataLocker.clan.filter(item => !listedDataIds.includes(item.data.id));

    if (availableData.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun dato disponibile da mettere in vendita.</p>`;
        return;
    }

    container.innerHTML = availableData.map(item => {
        const data = item.data;
        return `
            <div class="bg-gray-800 p-3 rounded-lg">
                <p class="font-semibold text-white">${data.name}</p>
                <p class="text-xs text-gray-400">${data.description}</p>
                <div class="text-xs font-mono mt-2">Valore Stimato: <span class="text-yellow-400">${data.value.toLocaleString()} BTC</span></div>
                <div class="mt-2 flex gap-2">
                    <input type="number" class="price-input bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white w-full" placeholder="Prezzo di vendita in BTC">
                    <button class="list-item-btn px-3 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700" data-data-id="${data.id}">Vendi</button>
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.list-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const dataId = btn.dataset.dataId;
            const priceInput = btn.previousElementSibling;
            const price = parseInt(priceInput.value);

            if (isNaN(price) || price <= 0) {
                alert("Inserisci un prezzo di vendita valido.");
                return;
            }
            listItemForSale(dataId, price);
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
        return `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-green-500">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-semibold text-white">${data.name}</p>
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

function listItemForSale(dataId, price) {
    const itemIndex = state.dataLocker.clan.findIndex(item => item.data.id === dataId);
    if (itemIndex === -1) {
        alert("Dato non trovato.");
        return;
    }

    const [itemToSell] = state.dataLocker.clan.splice(itemIndex, 1);

    state.clan.darkMarket.listings.push({
        listingId: `listing-${Date.now()}`,
        dataPacket: itemToSell.data,
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
    
    // Simula il ritorno dell'oggetto all'archivio del clan
    // In un gioco completo, potrebbe tornare all'archivio del venditore originale
    const [removedListing] = state.clan.darkMarket.listings.splice(itemIndex, 1);
    
    // Per semplicità, non lo rimettiamo nell'archivio. In un gioco reale, dovremmo gestire a quale server apparteneva.
    // state.dataLocker.clan.push({ serverId: ???, data: removedListing.dataPacket });

    saveState();
    renderStorableItems();
    renderForSaleItems();
}
