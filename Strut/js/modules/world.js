// File: js/modules/world.js
// VERSIONE AGGIORNATA: Gestisce il lancio di attacchi da gruppi di botnet.

let selectedNation = null;
let selectedTarget = null;
let currentRoutingChain = [];

function renderLiveStats() {
    const leftPanel = document.getElementById('left-stats-panel');
    const rightPanel = document.getElementById('right-stats-panel');
    if (!leftPanel || !rightPanel) return;
    const createStat = (label, value) => `<div class="stat-item"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
    leftPanel.innerHTML = `${createStat('Attacchi Globali /s', (Math.random() * 100 + 350).toFixed(0))}${createStat('Dati Trasferiti', `${(Math.random() * 50 + 80).toFixed(2)} PB/s`)}${createStat('Vulnerabilità Scoperte', (Math.random() * 5 + 10).toFixed(0))}${createStat('Botnet Attive', '7')}`;
    rightPanel.innerHTML = `${createStat('Top Paese Attaccante', 'Russia')}${createStat('Top Paese Bersaglio', 'USA')}${createStat('Protocollo Comune', 'HTTPS/SSL')}${createStat('Tipo Attacco Comune', 'DDoS')}`;
}


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
    const networkNodesGroup = new THREE.Group();
    function latLonToVector3(lat, lon, r) { const p = (90 - lat) * (Math.PI / 180), t = (lon + 180) * (Math.PI / 180); return new THREE.Vector3(-(r*Math.sin(p)*Math.cos(t)),(r*Math.cos(p)),(r*Math.sin(p)*Math.sin(t)));}
    
    const discoverableNations = Object.keys(worldData).filter(nationName => {
        return worldData[nationName].targets.some(targetId => state.discoveredTargets.includes(targetId));
    });

    discoverableNations.forEach(nationName => {
        const nation = worldData[nationName];
        const color = nation.alignment === 'White Hat' ? 0x0ea5e9 : nation.alignment === 'Black Hat' ? 0xef4444 : 0xf59e0b;
        const nationMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color }));
        nationMesh.position.copy(latLonToVector3(nation.lat, nation.lon, 5));
        nationMesh.userData = { type: 'nation', name: nationName, ...nation };
        nationsGroup.add(nationMesh);
    });
    scene.add(nationsGroup);

    Object.values(worldTargets)
        .filter(t => t.category === 'network_nodes' && state.discoveredTargets.includes(t.id))
        .forEach(node => {
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

    function onWindowResize() {
        if (!globeContainer) return;
        camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    setTimeout(() => {
        onWindowResize();
        animate();
    }, 150); 
    
    renderLiveStats();
    const statsInterval = setInterval(renderLiveStats, 2000);
}


function showNationPanel(nation) {
    selectedNation = nation;
    selectedTarget = null;
    currentRoutingChain = [];

    const panel = document.getElementById('nation-panel');
    if (!panel) return;
    
    const nationTargets = nation.targets
        .filter(id => state.discoveredTargets.includes(id))
        .map(id => worldTargets[id]);

    const targetsByCategory = nationTargets.reduce((acc, target) => {
        if (!target) return acc;
        const category = target.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(target);
        return acc;
    }, {});

    let categoriesHtml = Object.keys(targetsByCategory).map(categoryId => {
        const category = targetCategories[categoryId];
        const targetsHtml = targetsByCategory[categoryId].map(t => `
            <div class="target-item p-3 rounded-lg cursor-pointer" data-target-id="${t.id}">
                <div class="flex justify-between items-center">
                    <h4 class="font-bold text-base">${t.name}</h4>
                    <span class="font-mono text-xs text-gray-500">Tier ${t.tier}</span>
                </div>
                <p class="text-sm text-gray-400 mt-1">${t.rewardType}</p>
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
        <div id="attack-section" class="hidden mt-auto pt-4 border-t border-gray-600"></div>
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
            renderAttackSection(panel);
        });
    });
}

function showNetworkNodePanel(node) {
    selectedNation = null;
    selectedTarget = node;
    currentRoutingChain = [];

    const panel = document.getElementById('nation-panel');
    if (!panel) return;

    panel.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-white flex items-center gap-4"><i class="fas fa-globe text-yellow-400"></i> ${node.name}</h2>
            <button id="close-nation-panel" class="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div class="mb-4">
             <p class="text-sm text-gray-400">Questo è un nodo critico della rete globale. IP: <span class="font-mono text-gray-300">${node.ipAddress}</span></p>
        </div>
        <div id="attack-section" class="mt-auto pt-4 border-t border-gray-600"></div>
    `;

    renderAttackSection(panel);

    panel.classList.remove('-translate-x-full');
    panel.classList.add('visible');

    panel.querySelector('#close-nation-panel').addEventListener('click', () => {
        panel.classList.add('-translate-x-full');
        panel.classList.remove('visible');
    });
}

function renderAttackSection(panel) {
    const attackSection = panel.querySelector('#attack-section');
    if (!attackSection || !selectedTarget) return;

    attackSection.classList.remove('hidden');
    const maxSlots = 4;
    let routingSlotsHTML = '';
    for (let i = 0; i < maxSlots; i++) {
        routingSlotsHTML += `<div class="routing-slot border-2 border-dashed border-gray-600 rounded-lg p-2 text-center text-gray-500 text-xs" data-slot-index="${i}">Slot Nodo ${i + 1}</div>`;
    }

    attackSection.innerHTML = `
        <h3 class="font-semibold mb-2 text-indigo-300">Prepara Attacco a: 
            <span class="text-white">${selectedTarget.name}</span> 
            <span class="font-mono text-sm text-gray-400">${selectedTarget.ipAddress}</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
                <h4 class="text-sm font-bold mb-2 text-gray-300">Nodi Disponibili</h4>
                <div id="available-nodes" class="space-y-2 p-2 bg-black/20 rounded-lg h-48 overflow-y-auto"></div>
            </div>
            <div class="md:col-span-2">
                <h4 class="text-sm font-bold mb-2 text-gray-300">Catena di Routing (Opzionale)</h4>
                <div id="routing-chain" class="space-y-2">${routingSlotsHTML}</div>
            </div>
        </div>
        <div class="mt-2 text-center text-xs" id="routing-ip-path"></div>
        <div id="routing-summary" class="mt-4 p-2 bg-gray-800 rounded-lg text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2"></div>
        <div class="mt-4 flex flex-col sm:flex-row gap-2">
            <select id="flow-select" class="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white w-full text-base focus:ring-indigo-500 focus:border-indigo-500">
                ${Object.keys(state.savedFlows).map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>
            <button id="launch-attack-button" class="w-full sm:w-auto px-4 py-3 font-medium rounded-md bg-red-600 hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-lg">
                <i class="fas fa-rocket mr-2"></i>Lancia
            </button>
        </div>
    `;
    
    populateAvailableNodes();
    setupDragAndDrop();
    updateRoutingSummaryUI();
    renderRoutingChain();
    panel.querySelector('#launch-attack-button').addEventListener('click', launchAttack);
    panel.querySelector('#flow-select').addEventListener('change', () => {
        renderRoutingChain();
        updateRoutingSummaryUI();
    });
}

function populateAvailableNodes() {
    const container = document.getElementById('available-nodes');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(networkNodeData).forEach(nodeId => {
        container.appendChild(createNodeElement(nodeId, networkNodeData[nodeId]));
    });

    marketData.networkServices.forEach(item => {
        if (state.purchasedServices[item.id]) {
            container.appendChild(createNodeElement(item.id, item));
        }
    });

    if (state.clan && state.clan.infrastructure.c_vpn) {
        const clanVpnTier = state.clan.infrastructure.c_vpn.tier;
        const vpnData = marketData.clanInfrastructure.c_vpn.tiers[clanVpnTier - 1];
        if (vpnData) {
            const clanVpnNodeId = vpnData.id;
            container.appendChild(createNodeElement(clanVpnNodeId, vpnData));
        }
    }
}

function createNodeElement(nodeId, nodeData) {
    const el = document.createElement('div');
    el.className = 'routing-node p-2 rounded-md cursor-grab';
    el.draggable = true;
    el.dataset.nodeId = nodeId;

    let ip = nodeData.ipAddress;
    if (state.purchasedServices[nodeId]) {
        ip = state.purchasedServices[nodeId].currentIp;
    } else if (nodeId.startsWith('c_vpn_t') && state.clan && state.clan.infrastructure.c_vpn) {
        ip = state.clan.infrastructure.c_vpn.currentIp;
    }

    const traceScore = state.ipTraceability[ip] || 0;
    
    let traceColorClass = 'trace-low';
    if (traceScore > 75) traceColorClass = 'trace-high';
    else if (traceScore > 40) traceColorClass = 'trace-medium';

    el.innerHTML = `
        <div class="flex justify-between items-center">
            <p class="font-bold text-sm">${nodeData.name}</p>
            <span class="font-mono text-xs text-gray-500">${ip}</span>
        </div>
        <p class="text-xs text-gray-400">${nodeData.type || 'N/A'} - ${nodeData.location}</p>
        <div class="trace-bar-bg mt-2">
            <div class="trace-bar-fill ${traceColorClass}" style="width: ${traceScore}%" title="Tracciabilità: ${traceScore}%"></div>
        </div>
    `;
    el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', nodeId);
        e.target.classList.add('opacity-50');
    });
    el.addEventListener('dragend', e => e.target.classList.remove('opacity-50'));
    return el;
}

function setupDragAndDrop() {
    const slots = document.querySelectorAll('.routing-slot');
    slots.forEach(slot => {
        slot.addEventListener('dragover', e => { e.preventDefault(); e.target.closest('.routing-slot').classList.add('bg-indigo-900'); });
        slot.addEventListener('dragleave', e => { e.target.closest('.routing-slot').classList.remove('bg-indigo-900'); });
        slot.addEventListener('drop', e => {
            e.preventDefault();
            e.target.closest('.routing-slot').classList.remove('bg-indigo-900');
            const nodeId = e.dataTransfer.getData('text/plain');
            const slotIndex = parseInt(e.target.closest('.routing-slot').dataset.slotIndex);
            
            let nodeData = null;
            if (networkNodeData[nodeId]) {
                nodeData = networkNodeData[nodeId];
            } else {
                const personalNode = marketData.networkServices.find(item => item.id === nodeId);
                if (personalNode) {
                    nodeData = personalNode;
                } else if (nodeId.startsWith('c_vpn_t')) {
                    const tier = parseInt(nodeId.replace('c_vpn_t', ''));
                    if (state.clan && state.clan.infrastructure.c_vpn && state.clan.infrastructure.c_vpn.tier === tier) {
                        nodeData = marketData.clanInfrastructure.c_vpn.tiers[tier - 1];
                    }
                }
            }

            if (nodeData) {
                const existingIndex = currentRoutingChain.findIndex(item => item && item.id === nodeId);
                if (existingIndex > -1) {
                    [currentRoutingChain[existingIndex], currentRoutingChain[slotIndex]] = [currentRoutingChain[slotIndex], { id: nodeId, data: nodeData }];
                } else {
                    currentRoutingChain[slotIndex] = { id: nodeId, data: nodeData };
                }
            }
            
            renderRoutingChain();
            updateRoutingSummaryUI();
        });
    });
}

function renderRoutingChain() {
    const slots = document.querySelectorAll('.routing-slot');
    const ipPathContainer = document.getElementById('routing-ip-path');
    if (!ipPathContainer) return;

    const flowSelect = document.getElementById('flow-select');
    let sourceIp = state.identity.realIp;
    let sourceIpLabel = `<span class="font-mono text-gray-400">${sourceIp}</span>`;

    if (flowSelect && flowSelect.value) {
        const flowName = flowSelect.value;
        const flow = state.savedFlows[flowName];
        if (flow && flow.host && flow.host.type === 'clan') {
            const server = state.clan.infrastructure.servers.find(s => s.id === flow.host.serverId);
            if (server) {
                sourceIp = server.ip;
                sourceIpLabel = `<span class="font-mono text-green-400" title="Origine: Server Clan #${server.id}">${sourceIp}</span>`;
            }
        } else if (flow && flow.host && flow.host.type === 'botnet_group') {
            sourceIp = `BOTNET: ${flow.host.name}`;
            sourceIpLabel = `<span class="font-mono text-purple-400" title="Origine: Gruppo Botnet">${sourceIp}</span>`;
        }
    }
    
    let ipPath = `${sourceIpLabel} <i class="fas fa-arrow-right text-gray-600 mx-1"></i>`;
    let lastIp = sourceIp;

    slots.forEach((slot, index) => {
        const node = currentRoutingChain[index];
        if (node) {
            let ip = node.data.ipAddress;
            if (state.purchasedServices[node.id]) {
                ip = state.purchasedServices[node.id].currentIp;
            } else if (node.id.startsWith('c_vpn_t') && state.clan && state.clan.infrastructure.c_vpn) {
                ip = state.clan.infrastructure.c_vpn.currentIp;
            }

            const traceScore = state.ipTraceability[ip] || 0;
            let traceColorClass = 'trace-low';
            if (traceScore > 75) traceColorClass = 'trace-high';
            else if (traceScore > 40) traceColorClass = 'trace-medium';

            slot.className = 'routing-slot occupied p-2 rounded-md relative';
            slot.innerHTML = `
                <div class="flex justify-between items-center">
                    <p class="font-bold text-sm text-white">${node.data.name}</p>
                    <span class="font-mono text-xs text-gray-400">${ip}</span>
                </div>
                <p class="text-xs text-gray-400">${node.data.type || 'N/A'} - ${node.data.location}</p>
                <div class="trace-bar-bg mt-2">
                    <div class="trace-bar-fill ${traceColorClass}" style="width: ${traceScore}%" title="Tracciabilità: ${traceScore}%"></div>
                </div>
                <button class="absolute top-1 right-1 text-red-500 hover:text-red-400 text-xs" data-slot-index="${index}">&times;</button>
            `;
            slot.querySelector('button').addEventListener('click', (e) => {
                const idx = parseInt(e.target.closest('button').dataset.slotIndex);
                currentRoutingChain[idx] = null;
                renderRoutingChain();
                updateRoutingSummaryUI();
            });
            lastIp = ip;
            ipPath += `<span class="font-mono text-indigo-300">${lastIp}</span> <i class="fas fa-arrow-right text-gray-600 mx-1"></i>`;
        } else {
            slot.className = 'routing-slot border-2 border-dashed border-gray-600 rounded-lg p-2 text-center text-gray-500 text-xs';
            slot.innerHTML = `Slot Nodo ${index + 1}`;
        }
    });

    if (selectedTarget) {
        ipPath += `<span class="font-mono text-red-400">${selectedTarget.ipAddress}</span>`;
    }

    ipPathContainer.innerHTML = ipPath;
}

function calculateRoutingModifiers(chain) {
    const modifiers = { latency: 0, blockRisk: 0, costUSD: 0, anonymity: 0, reliability: 1 };
    const activeNodes = chain.filter(n => n);

    activeNodes.forEach(nodeWrapper => {
        const node = nodeWrapper.data;
        modifiers.latency += node.latency || 0;
        modifiers.blockRisk += node.blockRisk || 0;
        modifiers.costUSD += node.costUSD || 0;
        modifiers.anonymity += node.anonymity || 0;
        if (node.reliability < modifiers.reliability) {
            modifiers.reliability = node.reliability;
        }
    });
    return modifiers;
}

function updateRoutingSummaryUI() {
    const summaryEl = document.getElementById('routing-summary');
    const launchBtn = document.getElementById('launch-attack-button');
    if (!summaryEl || !launchBtn) return;

    const modifiers = calculateRoutingModifiers(currentRoutingChain);
    const costInBtc = modifiers.costUSD / state.btcValueInUSD;

    summaryEl.innerHTML = `
        <div>Latenza: <span class="text-white">${modifiers.latency}ms</span></div>
        <div>Rischio Blocco: <span class="text-white">${(modifiers.blockRisk * 100).toFixed(0)}%</span></div>
        <div>Costo: <span class="text-white">${costInBtc.toFixed(6)} BTC</span></div>
        <div>Anonimato: <span class="text-white">+${modifiers.anonymity} AN</span></div>
    `;
    
    // **FIX**: The button is enabled as long as a target and flow are selected.
    const flowSelect = document.getElementById('flow-select');
    launchBtn.disabled = !(selectedTarget && flowSelect && flowSelect.value);
}

// --- FUNZIONE MODIFICATA ---
function launchAttack() {
    const flowName = document.getElementById('flow-select').value;
    
    // **FIX**: The check for active nodes is removed.
    if (!selectedTarget || !flowName) {
        alert("Errore: Seleziona un target e un flusso.");
        return;
    }
    
    const activeNodes = currentRoutingChain.filter(n => n);
    const flow = state.savedFlows[flowName];
    const target = selectedTarget;
    const routingModifiers = calculateRoutingModifiers(currentRoutingChain);
    const costInBtc = routingModifiers.costUSD / state.btcValueInUSD;

    if (state.btc < costInBtc) {
        alert(`BTC insufficienti per pagare il costo operativo della catena di routing (~${costInBtc.toFixed(6)} BTC).`);
        return;
    }
    state.btc -= costInBtc;
    updateUI();

    let finalFlowStats = JSON.parse(JSON.stringify(flow.stats));
    finalFlowStats.an += routingModifiers.anonymity;
    finalFlowStats.rl += Math.floor(routingModifiers.blockRisk * 10);
    finalFlowStats.rc = parseFloat((finalFlowStats.rc * routingModifiers.reliability).toFixed(2));

    if (flow.host && flow.host.type === 'botnet_group') {
        const group = state.botnetGroups[flow.host.name];
        if (group) {
            const activeHosts = state.infectedHostPool.filter(h => group.hostIds.includes(h.id) && h.status === 'Active');
            const aggregatePower = activeHosts.reduce((sum, host) => sum + host.resources.cpuPower, 0);
            finalFlowStats.eo += Math.floor(aggregatePower / 10);
        }
    }

    const baseTime = target.baseExecutionTime || 3600;
    const finalExecutionTime = Math.round(baseTime + (routingModifiers.latency / 10));

    const newAttack = {
        id: `attack-${Date.now()}`,
        target: target,
        nationName: selectedNation ? selectedNation.name : "Globale",
        startTime: Date.now(),
        finalTime: finalExecutionTime,
        flowName: flowName,
        host: flow.host,
        flowStats: finalFlowStats,
        flowFc: flow.fc,
        flowObjective: flow.objective,
        routingChain: activeNodes.map(n => n.id)
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
