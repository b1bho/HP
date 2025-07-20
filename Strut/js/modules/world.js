let selectedNation = null;
let selectedTarget = null;
let attachedFlows = [];

function initGlobe() {
    const globeContainer = document.getElementById('globe-container');
    const globeCanvas = document.getElementById('globe-canvas');
    if (!globeCanvas || !globeContainer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: globeCanvas, antialias: true, alpha: true });
    
    renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 6;
    controls.maxDistance = 20;

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/land_ocean_ice_cloud_2048.jpg');
    
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(5, 64, 64), 
        new THREE.MeshPhongMaterial({ map: earthTexture, transparent: true, opacity: 0.9 })
    );
    scene.add(earth);
    
    const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.SphereGeometry(5.1, 32, 32)),
        new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.3 })
    );
    scene.add(wireframe);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    camera.position.z = 10;
    
    const nationsGroup = new THREE.Group();
    const networkNodesGroup = new THREE.Group(); // Gruppo per i nodi di rete
    function latLonToVector3(lat, lon, r) { const p = (90 - lat) * (Math.PI / 180), t = (lon + 180) * (Math.PI / 180); return new THREE.Vector3(-(r*Math.sin(p)*Math.cos(t)),(r*Math.cos(p)),(r*Math.sin(p)*Math.sin(t)));}
    
    // Aggiunge le nazioni
    Object.keys(worldData).forEach(nationName => {
        const nation = worldData[nationName];
        const color = nation.alignment === 'White Hat' ? 0x0ea5e9 : nation.alignment === 'Black Hat' ? 0xef4444 : 0xf59e0b;
        const nationMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color }));
        nationMesh.position.copy(latLonToVector3(nation.lat, nation.lon, 5));
        nationMesh.userData = { type: 'nation', name: nationName, ...nation };
        nationsGroup.add(nationMesh);
    });
    scene.add(nationsGroup);

    // Aggiunge i nodi di rete globali
    Object.values(worldTargets).filter(t => t.category === 'network_nodes').forEach(node => {
        const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        nodeMesh.position.copy(latLonToVector3(node.lat, node.lon, 5.05));
        nodeMesh.userData = { type: 'network_node', ...node };
        networkNodesGroup.add(nodeMesh);
    });
    scene.add(networkNodesGroup);


    const raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        
        const nationIntersects = raycaster.intersectObjects(nationsGroup.children);
        const nodeIntersects = raycaster.intersectObjects(networkNodesGroup.children);

        if (nodeIntersects.length > 0) {
            showNetworkNodePanel(nodeIntersects[0].object.userData);
        } else if (nationIntersects.length > 0) {
            showNationPanel(nationIntersects[0].object.userData);
        }
    });

    // ... resto della funzione initGlobe (animazione, resize, etc.) ...
    let activeAttacks = [];
    const attackInterval = setInterval(() => {
        if (activeAttacks.length < 20) { 
            const p1 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(5);
            const p2 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(5);
            const mid = p1.clone().lerp(p2, 0.5).normalize().multiplyScalar(5 + Math.random() * 1.5);
            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
            const material = new THREE.LineBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.6 });
            const curveObject = new THREE.Line(geometry, material);

            scene.add(curveObject);
            activeAttacks.push({ curve: curveObject, startTime: Date.now(), duration: 2000 });
        }
    }, 500);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        const now = Date.now();
        activeAttacks = activeAttacks.filter(attack => {
            const elapsed = now - attack.startTime;
            if (elapsed > attack.duration) {
                attack.curve.geometry.dispose();
                attack.curve.material.dispose();
                scene.remove(attack.curve);
                return false;
            }
            attack.curve.material.opacity = 1.0 - (elapsed / attack.duration);
            return true;
        });
        renderer.render(scene, camera);
    }
    animate();
    
    renderLiveStats();
    const statsInterval = setInterval(renderLiveStats, 2000);
    
    function onWindowResize() {
        if (!globeContainer) return;
        camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    setTimeout(onWindowResize, 100); 
}

function renderLiveStats() {
    const leftPanel = document.getElementById('left-stats-panel');
    const rightPanel = document.getElementById('right-stats-panel');
    if (!leftPanel || !rightPanel) return;
    const createStat = (label, value) => `<div class="stat-item"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
    leftPanel.innerHTML = `${createStat('Attacchi Globali /s', (Math.random() * 100 + 350).toFixed(0))}${createStat('Dati Trasferiti', `${(Math.random() * 50 + 80).toFixed(2)} PB/s`)}${createStat('Vulnerabilità Scoperte', (Math.random() * 5 + 10).toFixed(0))}${createStat('Botnet Attive', '7')}`;
    rightPanel.innerHTML = `${createStat('Top Paese Attaccante', 'Russia')}${createStat('Top Paese Bersaglio', 'USA')}${createStat('Protocollo Comune', 'HTTPS/SSL')}${createStat('Tipo Attacco Comune', 'DDoS')}`;
}

function showNationPanel(nation) {
    selectedNation = nation;
    selectedTarget = null;
    attachedFlows = [];

    const panel = document.getElementById('nation-panel');
    if (!panel) return;

    // Raggruppa i target per categoria
    const nationTargets = nation.targets.map(id => worldTargets[id]);
    const targetsByCategory = nationTargets.reduce((acc, target) => {
        const category = target.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(target);
        return acc;
    }, {});

    let categoriesHtml = Object.keys(targetsByCategory).map(categoryId => {
        const category = targetCategories[categoryId];
        const targetsHtml = targetsByCategory[categoryId].map(t => `
            <div class="target-item p-3 rounded-lg cursor-pointer" data-target-id="${t.id}">
                <h4 class="font-bold text-base">${t.name}</h4>
                <p class="text-sm text-gray-400">${t.rewardType}</p>
            </div>
        `).join('');

        return `
            <div class="mb-4">
                <h3 class="font-semibold mb-2 text-indigo-300 flex items-center gap-2"><i class="${category.icon}"></i> ${category.name}</h3>
                <div class="space-y-2">${targetsHtml}</div>
            </div>
        `;
    }).join('');

    panel.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-white flex items-center gap-4">${nation.flag} ${nation.name}</h2>
            <button id="close-nation-panel" class="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        
        <div class="space-y-4 text-sm mb-6">
            <div><span class="text-gray-300 font-semibold">Livello Sicurezza:</span> <span class="font-bold text-white">${nation.security}%</span></div>
            <div><span class="text-gray-300 font-semibold">Economia:</span> <span class="font-bold text-white">${nation.economy}%</span></div>
        </div>

        <div class="flex-grow" id="target-list-container">${categoriesHtml}</div>
        
        <div id="attack-section" class="hidden mt-auto pt-4 border-t border-gray-600">
            <!-- Sezione di attacco (invariata) -->
        </div>
    `;
    
    panel.classList.remove('-translate-x-full');
    panel.classList.add('visible');
    
    panel.querySelector('#close-nation-panel').addEventListener('click', () => {
        panel.classList.add('-translate-x-full');
        panel.classList.remove('visible');
    });
    
    panel.querySelectorAll('.target-item').forEach(item => {
        item.addEventListener('click', () => {
            selectedTarget = worldTargets[item.dataset.targetId];
            
            panel.querySelectorAll('.target-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');

            // Ricrea la sezione attacco quando un target è selezionato
            renderAttackSection(panel);
        });
    });
}

// NUOVA FUNZIONE per mostrare il pannello dei nodi di rete
function showNetworkNodePanel(node) {
    selectedNation = null; // Non è una nazione
    selectedTarget = node;
    attachedFlows = [];

    const panel = document.getElementById('nation-panel');
    if (!panel) return;

    panel.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-white flex items-center gap-4"><i class="fas fa-globe text-yellow-400"></i> ${node.name}</h2>
            <button id="close-nation-panel" class="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div class="mb-4">
             <p class="text-sm text-gray-400">Questo è un nodo critico della rete globale. Gli attacchi qui hanno conseguenze su larga scala.</p>
        </div>
        <div id="attack-section" class="mt-auto pt-4 border-t border-gray-600">
            <!-- Sezione attacco verrà renderizzata qui -->
        </div>
    `;

    renderAttackSection(panel);

    panel.classList.remove('-translate-x-full');
    panel.classList.add('visible');

    panel.querySelector('#close-nation-panel').addEventListener('click', () => {
        panel.classList.add('-translate-x-full');
        panel.classList.remove('visible');
    });
}


// NUOVA FUNZIONE per renderizzare la sezione di attacco dinamicamente
function renderAttackSection(panel) {
    const attackSection = panel.querySelector('#attack-section');
    if (!attackSection) return;

    attackSection.classList.remove('hidden');
    attackSection.innerHTML = `
        <h3 class="font-semibold mb-2 text-indigo-300">Prepara Attacco a: <span class="text-white">${selectedTarget.name}</span></h3>
        <div class="mb-3">
            <label for="flow-select" class="text-sm text-gray-400 block mb-2">Seleziona un flusso da agganciare:</label>
            <div class="flex flex-col sm:flex-row gap-2">
                <select id="flow-select" class="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white w-full text-base focus:ring-indigo-500 focus:border-indigo-500">
                    ${Object.keys(state.savedFlows).map(name => `<option value="${name}">${name}</option>`).join('')}
                </select>
                <button id="attach-flow-btn" class="px-4 py-2 font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-base flex-shrink-0">Aggancia</button>
            </div>
        </div>
        <div id="flow-slots" class="space-y-2 mb-4"></div>
        <button id="launch-attack-button" class="w-full px-4 py-3 font-medium rounded-md bg-red-600 hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-lg" disabled>
            <i class="fas fa-rocket mr-2"></i>Lancia Attacco
        </button>
    `;
    
    panel.querySelector('#attach-flow-btn').addEventListener('click', attachFlow);
    panel.querySelector('#launch-attack-button').addEventListener('click', launchAttack);
    updateAttackUI();
}


function updateAttackUI() {
    const slotsContainer = document.getElementById('flow-slots');
    const launchBtn = document.getElementById('launch-attack-button');
    if (!slotsContainer || !selectedTarget) return;

    const maxSlots = 1; 
    slotsContainer.innerHTML = '';
    
    for (let i = 0; i < maxSlots; i++) {
        const flowName = attachedFlows[i];
        if (flowName) {
            const flowStats = state.savedFlows[flowName].stats;
            slotsContainer.innerHTML += `
                <div class="flow-slot filled p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p class="font-bold text-base text-indigo-300">${flowName}</p>
                        <p class="text-sm text-gray-400">RC: ${flowStats.rc.toFixed(2)}, AN: ${flowStats.an}, EO: ${flowStats.eo}</p>
                    </div>
                    <button class="detach-flow-btn text-red-500 hover:text-red-400 text-xl" data-index="${i}">&times;</button>
                </div>`;
        } else {
            slotsContainer.innerHTML += `<div class="flow-slot p-3 rounded-lg flex items-center justify-center"><p class="text-sm text-gray-500">Slot Flusso Vuoto</p></div>`;
        }
    }

    launchBtn.disabled = attachedFlows.length === 0;

    slotsContainer.querySelectorAll('.detach-flow-btn').forEach(btn => {
        btn.addEventListener('click', (e) => detachFlow(parseInt(e.target.dataset.index)));
    });
}

function attachFlow() {
    if (attachedFlows.length >= 1) {
        alert("Puoi agganciare un solo flusso per questo tipo di attacco.");
        return;
    }
    const flowSelect = document.getElementById('flow-select');
    const flowName = flowSelect.value;
    if (flowName && state.savedFlows[flowName]) {
        attachedFlows.push(flowName);
        updateAttackUI();
    }
}

function detachFlow(index) {
    attachedFlows.splice(index, 1);
    updateAttackUI();
}

function launchAttack() {
    if (!selectedTarget || attachedFlows.length === 0) {
        alert("Errore: Target o flusso non validi.");
        return;
    }

    const flowName = attachedFlows[0];
    const flow = state.savedFlows[flowName];
    const target = selectedTarget;
    
    if (!flow || !flow.host) {
        alert("Errore: Dati del flusso o dell'host corrotti. Prova a salvare di nuovo il flusso.");
        return;
    }

    if (!flow.objective || flow.objective === 'none') {
        alert("Non puoi lanciare un attacco con un flusso senza obiettivo. Seleziona un Obiettivo Primario nell'editor e salvalo di nuovo.");
        return;
    }

    const fcModifier = 1.5 - ((flow.fc || 100) / 100);
    const eoModifier = 1 + ((flow.stats.eo - 5) / 10);
    const finalExecutionTime = Math.round(target.baseExecutionTime * fcModifier * eoModifier);

    const newAttack = {
        id: `attack-${Date.now()}`,
        target: target,
        nationName: selectedNation ? selectedNation.name : "Globale",
        startTime: Date.now(),
        finalTime: finalExecutionTime,
        flowName: flowName,
        host: flow.host,
        flowStats: flow.stats,
        flowFc: flow.fc || 100
    };

    state.activeAttacks.push(newAttack);
    saveState();
    updateActiveAttacks();
    
    const panel = document.getElementById('nation-panel');
    panel.classList.add('-translate-x-full');
    panel.classList.remove('visible');
    
    alert(`Attacco avviato contro ${target.name}! Tempo stimato: ${new Date(finalExecutionTime * 1000).toISOString().substr(11, 8)}`);
}

function showStorageChoiceModal(dataPacket) {
    const modal = document.getElementById('storage-choice-modal');
    if (!modal) return;

    const canStoreInClan = state.clan && state.clan.infrastructure.servers && state.clan.infrastructure.servers.length > 0;

    let clanStorageOptions = '';
    if (canStoreInClan) {
        clanStorageOptions = state.clan.infrastructure.servers.map(server => `
            <button class="store-clan-btn p-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-left" data-server-id="${server.id}">
                <i class="fas fa-server text-2xl mb-2"></i>
                <h4 class="font-bold">Server #${server.id}</h4>
                <p class="text-xs text-purple-200">${server.ip}</p>
            </button>
        `).join('');
    } else {
        clanStorageOptions = `
            <button class="p-4 rounded-lg bg-gray-600 cursor-not-allowed" disabled>
                <i class="fas fa-server text-2xl mb-2"></i>
                <h4 class="font-bold">Server del Clan</h4>
                <p class="text-xs text-gray-400">Nessun server disponibile.</p>
            </button>
        `;
    }

    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-6 relative border border-green-500">
            <h2 class="text-2xl font-bold text-green-400 mb-4"><i class="fas fa-check-circle mr-2"></i>Dati Acquisiti!</h2>
            <div class="data-card p-4 rounded-lg mb-6">
                <h4 class="font-bold text-white">${dataPacket.name}</h4>
                <p class="text-sm text-gray-400">${dataPacket.description}</p>
                <div class="mt-3 pt-3 border-t border-gray-600 grid grid-cols-3 gap-2 text-xs font-mono">
                    <div><span class="text-gray-500">Purezza:</span> <span class="text-indigo-300">${dataPacket.purity.toFixed(2)}%</span></div>
                    <div><span class="text-gray-500">Sensibilità:</span> <span class="text-indigo-300">${dataPacket.sensitivity}</span></div>
                    <div><span class="text-gray-500">Valore:</span> <span class="text-yellow-400">${dataPacket.value.toLocaleString()} BTC</span></div>
                </div>
            </div>
            <h3 class="font-semibold text-center mb-4">Scegli dove archiviare i dati:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button id="store-personal-btn" class="p-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-left">
                    <i class="fas fa-desktop text-2xl mb-2"></i>
                    <h4 class="font-bold">Computer Personale</h4>
                    <p class="text-xs text-blue-200">Accesso immediato, ma più rischioso.</p>
                </button>
                ${clanStorageOptions}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('store-personal-btn').addEventListener('click', () => {
        state.dataLocker.personal.push(dataPacket);
        saveState();
        modal.classList.add('hidden');
        if (state.activePage === 'profile' && state.activeProfileSection === 'data-locker') {
            renderDataLockerSection();
        }
    });
    
    modal.querySelectorAll('.store-clan-btn').forEach(button => {
        button.addEventListener('click', () => {
            const serverId = parseInt(button.dataset.serverId);
            state.dataLocker.clan.push({ serverId: serverId, data: dataPacket });
            saveState();
            modal.classList.add('hidden');
            if (state.activePage === 'profile' && state.activeProfileSection === 'data-locker') {
                renderDataLockerSection();
            }
        });
    });
}

function initWorldPage() {
    initGlobe();
    updateActiveAttacks();
}
