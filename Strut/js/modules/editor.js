// File: js/modules/editor.js
// VERSIONE AGGIORNATA: Aggiunta la possibilità di ospitare flussi sui gruppi della botnet.

let currentObjective = 'none';
let currentFc = { score: 0, hints: [] };

function validateFlow() {
    const objective = flowObjectives[currentObjective];
    const canvas = document.getElementById('canvas');
    const nodes = Array.from(canvas.querySelectorAll('.canvas-node'));
    const nodeNames = nodes.map(node => node.dataset.blockName);
    let hints = [];
    let allRequiredInputsMet = true;

    nodes.forEach(nodeEl => {
        const blockName = nodeEl.dataset.blockName;
        const blockInterface = blockInterfaces[blockName];
        if (!blockInterface) return;
        let hasError = false;
        blockInterface.inputs.forEach(inputDef => {
            if (inputDef.optional) return;
            const inputId = `${nodeEl.id}-input-${inputDef.name.replace(/\s/g, '')}`;
            const isConnected = lines.some(line => line.end.id === inputId);
            if (!isConnected) {
                allRequiredInputsMet = false;
                hasError = true;
                hints.push({ text: `Input '${inputDef.name}' richiesto per il blocco '${blockName}' non è collegato.`, type: 'error' });
            }
        });
        if(hasError) {
            nodeEl.classList.add('invalid');
        } else {
            nodeEl.classList.remove('invalid');
        }
    });

    if (!allRequiredInputsMet) {
        currentFc = { score: 0, hints: hints };
        updateFcUI();
        return;
    }
    
    if (!objective || currentObjective === 'none') {
        currentFc = { score: 100, hints: [{ text: "Nessun obiettivo selezionato, validazione non attiva.", type: "info" }] };
        updateFcUI();
        return;
    }

    let score = 0;
    let totalWeight = 0;
    hints = [];

    for (const pfeKey in objective.pfe) {
        const rule = objective.pfe[pfeKey];
        if (rule.required) totalWeight += rule.weight;
        let requirementMet = false;
        if (rule.paths) {
            for (const path of rule.paths) {
                const allCategoriesInPathFound = path.every(category =>
                    nodeNames.some(name => blockCategories[name] === category)
                );
                if (allCategoriesInPathFound) {
                    requirementMet = true;
                    break;
                }
            }
        } else {
            requirementMet = nodeNames.some(name => blockCategories[name] === pfeKey);
        }
        if (requirementMet) {
            score += rule.weight;
        } else if (rule.required) {
            hints.push({ text: rule.hint, type: 'error' });
        } else {
            hints.push({ text: rule.hint, type: 'warning' });
        }
    }

    const finalScore = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 100;
    if (hints.length === 0 && finalScore > 0) {
        hints.push({ text: "Flusso funzionalmente completo!", type: "success" });
    }

    currentFc = { score: finalScore, hints: hints };
    updateFcUI();
}

function updateFcUI() {
    const fcPanel = document.getElementById('fc-panel');
    if (!fcPanel) return;
    const scoreColor = currentFc.score < 50 ? 'text-red-400' : currentFc.score < 90 ? 'text-yellow-400' : 'text-green-400';
    let hintsHTML = currentFc.hints.map(hint => {
        const hintColor = hint.type === 'error' ? 'text-red-400' : hint.type === 'warning' ? 'text-yellow-400' : hint.type === 'success' ? 'text-green-400' : 'text-gray-400';
        const hintIcon = hint.type === 'error' ? 'fa-times-circle' : hint.type === 'warning' ? 'fa-exclamation-triangle' : hint.type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        return `<div class="text-xs ${hintColor}"><i class="fas ${hintIcon} mr-1"></i> ${hint.text}</div>`;
    }).join('');
    fcPanel.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="font-bold">Punteggio FC:</span>
            <span class="font-bold text-lg ${scoreColor}">${currentFc.score}%</span>
        </div>
        <div class="xp-bar-bg mb-2"><div class="xp-bar-fill" style="width:${currentFc.score}%"></div></div>
        <div class="space-y-1">${hintsHTML}</div>`;
}

function updateCurrentFlowStatsUI() {
    const currentFlowStatsEl = document.getElementById('current-flow-stats');
    if (!currentFlowStatsEl) return;
    const canvas = document.getElementById('canvas');
    const nodes = Array.from(canvas.querySelectorAll('.canvas-node'));
    const stats = calculateFlowStats(nodes);
    currentFlowStatsEl.innerHTML = `
        <div class="flex items-center justify-between" title="Visibilità: Quanto è 'rumoroso' e facile da individuare il tuo flusso. Più basso è, meglio è."><div class="flex items-center gap-2 text-gray-300"><i class="fas fa-eye w-4 text-center text-gray-400"></i><span>Visibilità</span></div><span class="font-bold text-indigo-300">${stats.lso}</span></div>
        <div class="flex items-center justify-between" title="Robustezza: La stabilità e qualità del codice. Più alto è, meglio è."><div class="flex items-center gap-2 text-gray-300"><i class="fas fa-shield-alt w-4 text-center text-gray-400"></i><span>Robustezza</span></div><span class="font-bold text-indigo-300">${stats.rc.toFixed(2)}</span></div>
        <div class="flex items-center justify-between" title="Crittografia: Il livello di cifratura del flusso. Più alto è, meglio è."><div class="flex items-center gap-2 text-gray-300"><i class="fas fa-lock w-4 text-center text-gray-400"></i><span>Crittografia</span></div><span class="font-bold text-indigo-300">${stats.lcs}</span></div>
        <div class="flex items-center justify-between" title="Anonimato: Quanto la tua identità è nascosta. Più alto è, meglio è."><div class="flex items-center gap-2 text-gray-300"><i class="fas fa-user-ninja w-4 text-center text-gray-400"></i><span>Anonimato</span></div><span class="font-bold text-indigo-300">${stats.an}</span></div>
        <div class="flex items-center justify-between" title="Efficienza: La velocità e l'impatto del flusso. Più alto è, meglio è."><div class="flex items-center gap-2 text-gray-300"><i class="fas fa-bolt w-4 text-center text-gray-400"></i><span>Efficienza</span></div><span class="font-bold text-indigo-300">${stats.eo}</span></div>
        <div class="flex items-center justify-between" title="Rischio: Il rischio di conseguenze legali o di essere tracciato. Più basso è, meglio è."><div class="flex items-center gap-2 text-gray-300"><i class="fas fa-gavel w-4 text-center text-gray-400"></i><span>Rischio</span></div><span class="font-bold text-indigo-300">${stats.rl}</span></div>`;
}

function createNode(name, x, y, id = null) {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const blockInterface = blockInterfaces[name];
    if (!blockInterface) {
        console.error(`Interfaccia non trovata per il blocco: ${name}`);
        return;
    }

    const nodeId = id || 'node-' + Date.now() + Math.random();
    const node = document.createElement('div');
    node.id = nodeId;
    node.className = 'canvas-node';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.dataset.blockName = name;

    const iconClass = blockIcons[name] || 'fa-question-circle';
    let connectorsHTML = '<div class="connectors-top"></div><div class="connectors-left"></div><div class="connectors-right"></div><div class="connectors-bottom"></div>';
    node.innerHTML = `<span class="node-name">${name}</span><i class="fas ${iconClass} node-icon"></i>${connectorsHTML}`;
    
    canvas.appendChild(node);

    const topContainer = node.querySelector('.connectors-top');
    const leftContainer = node.querySelector('.connectors-left');
    const rightContainer = node.querySelector('.connectors-right');
    const bottomContainer = node.querySelector('.connectors-bottom');
    
    blockInterface.inputs.forEach(input => {
        const connector = document.createElement('div');
        connector.id = `${nodeId}-input-${input.name.replace(/\s/g, '')}`;
        connector.className = 'connector input';
        connector.dataset.type = input.type;
        connector.dataset.name = input.name;
        connector.title = `${input.name} (${input.type})`;
        const color = dataTypes[input.type]?.color || '#ffffff';
        connector.style.backgroundColor = color;
        if (input.type === 'ControlFlow') {
            topContainer.appendChild(connector);
        } else {
            leftContainer.appendChild(connector);
        }
    });

    blockInterface.outputs.forEach(output => {
        const connector = document.createElement('div');
        connector.id = `${nodeId}-output-${output.name.replace(/\s/g, '')}`;
        connector.className = 'connector output';
        connector.dataset.type = output.type;
        connector.dataset.name = output.name;
        connector.title = `${output.name} (${output.type})`;
        const color = dataTypes[output.type]?.color || '#ffffff';
        connector.style.backgroundColor = color;
        if (output.type === 'ControlFlow') {
            bottomContainer.appendChild(connector);
        } else {
            rightContainer.appendChild(connector);
        }
    });

    node.addEventListener('dblclick', () => deleteNode(nodeId));
    updateCurrentFlowStatsUI();
    validateFlow();
    return node;
}

function deleteNode(nodeId) {
    const nodeToRemove = document.getElementById(nodeId);
    if (nodeToRemove) {
        lines = lines.filter(line => {
            if (line.start.id.startsWith(nodeId) || line.end.id.startsWith(nodeId)) {
                line.remove(); return false;
            }
            return true;
        });
        nodeToRemove.remove();
        updateCurrentFlowStatsUI();
        validateFlow();
    }
}

function updateLines() {
    lines.forEach(line => {
        try {
            if (document.body.contains(line.start) && document.body.contains(line.end)) line.position();
        } catch (e) {}
    });
}

function clearCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    lines.forEach(line => line.remove());
    lines = [];
    if (startSocket) {
        startSocket.classList.remove('selected');
        startSocket = null;
    }
    canvas.innerHTML = '<div class="absolute top-4 left-4 text-gray-400 text-sm p-2 bg-black/30 rounded">Trascina gli attrezzi qui e collega i punti</div>';
    updateCurrentFlowStatsUI();
    validateFlow();
}

function getAllAvailableBlocks() {
    const baseBlocks = ["Punto di Ingresso (Target)", "Crea Stringa", "Unisci Stringhe", "Imposta Oggetto Email", "Imposta Corpo Email", "Prendi Info da Archivio"];
    const unlockedBlocks = new Set(baseBlocks);
    for (const talentName in state.unlocked) {
        const talent = findTalentByName(talentName);
        if (talent) {
            for (let i = 0; i < state.unlocked[talentName]; i++) {
                if (talent.levels[i] && Array.isArray(talent.levels[i].unlocks)) {
                    talent.levels[i].unlocks.forEach(block => unlockedBlocks.add(block));
                }
            }
        }
    }
    return Array.from(unlockedBlocks).sort();
}

function renderToolbox() {
    const toolboxContent = document.getElementById('toolbox-content');
    if (!toolboxContent) return;
    toolboxContent.innerHTML = '';
    const availableBlocks = getAllAvailableBlocks();
    if (availableBlocks.length === 0) {
        toolboxContent.innerHTML = '<p class="text-sm text-gray-400 text-center">Sblocca talenti per ottenere attrezzi.</p>';
        return;
    }
    const categorizedBlocks = {};
    availableBlocks.forEach(blockName => {
        const category = blockToCategoryMap[blockName] || 'Sconosciuto';
        if (!categorizedBlocks[category]) categorizedBlocks[category] = [];
        categorizedBlocks[category].push(blockName);
    });
    const sortedCategories = Object.keys(categorizedBlocks).sort((a, b) => {
        if (a === 'Base' || a === 'Logica di Flusso') return -1;
        if (b === 'Base' || b === 'Logica di Flusso') return 1;
        return a.localeCompare(b);
    });
    for (const categoryName of sortedCategories) {
        const blocks = categorizedBlocks[categoryName];
        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = 'toolbox-category-wrapper';
        const categoryHeader = document.createElement('button');
        categoryHeader.className = 'talent-branch-header w-full text-left flex justify-between items-center p-2';
        categoryHeader.innerHTML = `<span class="text-md font-semibold">${categoryName}</span><i class="fas fa-chevron-down transition-transform"></i>`;
        const blocksPanel = document.createElement('div');
        blocksPanel.className = 'talent-panel';
        const panelContent = document.createElement('div');
        panelContent.className = 'p-2 flex flex-col gap-2';
        blocksPanel.appendChild(panelContent);
        blocks.sort().forEach(blockName => {
            const iconClass = blockIcons[blockName] || 'fa-question-circle';
            const blockDiv = document.createElement('div');
            blockDiv.className = 'tool-block';
            blockDiv.innerHTML = `<i class="fas ${iconClass}"></i> <span class="text-sm">${blockName}</span>`;
            blockDiv.draggable = true;
            blockDiv.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', blockName));
            panelContent.appendChild(blockDiv);
        });
        categoryHeader.addEventListener('click', () => {
            categoryHeader.classList.toggle('active');
            categoryHeader.querySelector('.fa-chevron-down').classList.toggle('rotate-180');
            blocksPanel.style.maxHeight = blocksPanel.style.maxHeight ? null : panelContent.scrollHeight + "px";
        });
        categoryWrapper.append(categoryHeader, blocksPanel);
        toolboxContent.appendChild(categoryWrapper);
    }
    document.getElementById('toolbox-search').addEventListener('input', filterToolbox);
}

function filterToolbox(event) {
    const searchTerm = event.target.value.toLowerCase();
    const categories = document.querySelectorAll('.toolbox-category-wrapper');
    categories.forEach(categoryWrapper => {
        const blocks = categoryWrapper.querySelectorAll('.tool-block');
        let categoryVisible = false;
        blocks.forEach(block => {
            const blockName = block.textContent.toLowerCase();
            if (blockName.includes(searchTerm)) {
                block.style.display = 'flex';
                categoryVisible = true;
            } else {
                block.style.display = 'none';
            }
        });
        categoryWrapper.style.display = categoryVisible ? 'block' : 'none';
    });
}

function calculateFlowStats(nodes) {
    const stats = { lso: 0, rc: 0, lcs: 0, an: 0, eo: 0, rl: 0 };
    if (nodes.length === 0) return stats;
    let rcSum = 0;
    nodes.forEach(node => {
        const nodeStat = blockStats[node.dataset.blockName];
        if (nodeStat) {
            stats.lso += nodeStat.lso;
            rcSum += nodeStat.rc;
            stats.lcs += nodeStat.lcs;
            stats.an += nodeStat.an;
            stats.eo += nodeStat.eo;
            stats.rl += nodeStat.rl;
        }
    });
    stats.rc = nodes.length > 0 ? parseFloat((rcSum / nodes.length).toFixed(2)) : 0;
    stats.rc += state.hardwareBonuses.toolStatModifiers.rc + state.clanBonuses.toolStatModifiers.rc;
    stats.eo += state.hardwareBonuses.toolStatModifiers.eo + state.clanBonuses.toolStatModifiers.eo;
    return stats;
}

function populateObjectiveSelector() {
    const objectiveSelect = document.getElementById('flow-objective-select');
    if (!objectiveSelect) return;
    objectiveSelect.innerHTML = '';
    for (const key in flowObjectives) {
        objectiveSelect.add(new Option(flowObjectives[key].label, key));
    }
    objectiveSelect.addEventListener('change', (e) => {
        currentObjective = e.target.value;
        validateFlow();
    });
}

// --- FUNZIONE MODIFICATA ---
function populateHostSelector() {
    const hostSelect = document.getElementById('flow-host-select');
    if (!hostSelect) return;
    hostSelect.innerHTML = '<option value="personal">Computer Personale (HQ)</option>';
    
    // Server del Clan
    if (state.clan && state.clan.infrastructure.servers && state.clan.infrastructure.servers.length > 0) {
        const serverGroup = document.createElement('optgroup');
        serverGroup.label = 'Server del Clan';
        state.clan.infrastructure.servers.forEach(server => {
            serverGroup.innerHTML += `<option value="clan-${server.id}">Server #${server.id} (${server.ip})</option>`;
        });
        hostSelect.appendChild(serverGroup);
    }

    // Gruppi Botnet
    if (Object.keys(state.botnetGroups).length > 0) {
        const botnetGroup = document.createElement('optgroup');
        botnetGroup.label = 'Gruppi Botnet';
        Object.keys(state.botnetGroups).forEach(groupName => {
            botnetGroup.innerHTML += `<option value="botnet-${groupName}">${groupName}</option>`;
        });
        hostSelect.appendChild(botnetGroup);
    }
}

function populateSavedFlowsDropdown() {
    const dropdown = document.getElementById('saved-flows-dropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '<option value="">Carica un Flusso...</option>';

    if (Object.keys(state.savedFlows).length > 0) {
        const sessionGroup = document.createElement('optgroup');
        sessionGroup.label = 'Flussi di Sessione';
        Object.keys(state.savedFlows).forEach(flowName => {
            const option = new Option(flowName, flowName);
            option.dataset.type = 'session';
            sessionGroup.appendChild(option);
        });
        dropdown.appendChild(sessionGroup);
    }

    if (Object.keys(state.permanentFlows).length > 0) {
        const permanentGroup = document.createElement('optgroup');
        permanentGroup.label = 'Flussi Permanenti';
        Object.keys(state.permanentFlows).forEach(flowName => {
            const option = new Option(flowName, flowName);
            option.dataset.type = 'permanent';
            permanentGroup.appendChild(option);
        });
        dropdown.appendChild(permanentGroup);
    }
}

// --- FUNZIONE MODIFICATA ---
function getFlowData() {
    const canvas = document.getElementById('canvas');
    const hostSelect = document.getElementById('flow-host-select');
    const nodesOnCanvas = Array.from(canvas.querySelectorAll('.canvas-node'));
    const nodesData = nodesOnCanvas.map(n => ({ id: n.id, name: n.dataset.blockName, x: n.offsetLeft, y: n.offsetTop }));
    const linesData = lines.map(l => ({ start: l.start.id, end: l.end.id }));

    const hostValue = hostSelect.value;
    let hostData = {};
    if (hostValue === 'personal') {
        hostData = { type: 'personal', name: 'Computer Personale' };
    } else if (hostValue.startsWith('clan-')) {
        const serverId = parseInt(hostValue.replace('clan-', ''));
        const server = state.clan.infrastructure.servers.find(s => s.id === serverId);
        if (server) {
            hostData = { type: 'clan', serverId: server.id, name: `Server #${server.id}` };
        }
    } else if (hostValue.startsWith('botnet-')) {
        const groupName = hostValue.replace('botnet-', '');
        hostData = { type: 'botnet_group', name: groupName };
    }
    
    return {
        nodes: nodesData,
        lines: linesData,
        stats: calculateFlowStats(nodesOnCanvas),
        objective: currentObjective,
        fc: currentFc.score,
        host: hostData
    };
}

function saveFlow() {
    const flowNameInput = document.getElementById('flow-name-input');
    const flowName = flowNameInput.value.trim();
    if (!flowName) { alert('Inserisci un nome per il flusso.'); return; }

    state.savedFlows[flowName] = getFlowData();
    saveState();
    populateSavedFlowsDropdown();
    alert(`Flusso di sessione "${flowName}" salvato!`);
}

function saveFlowPermanently() {
    const flowNameInput = document.getElementById('flow-name-input');
    const flowName = flowNameInput.value.trim();
    if (!flowName) { alert('Inserisci un nome per il flusso.'); return; }

    state.permanentFlows[flowName] = getFlowData();
    saveState();
    populateSavedFlowsDropdown();
    alert(`Flusso permanente "${flowName}" salvato! Non verrà eliminato con il reset.`);
}

function loadFlow() {
    const dropdown = document.getElementById('saved-flows-dropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const flowName = selectedOption.value;
    const flowType = selectedOption.dataset.type;

    if (!flowName) { alert('Seleziona un flusso da caricare.'); return; }

    const flowData = flowType === 'permanent' ? state.permanentFlows[flowName] : state.savedFlows[flowName];
    if (!flowData) return;

    clearCanvas();
    flowData.nodes.forEach(nd => createNode(nd.name, nd.x, nd.y, nd.id));
    if (flowData.lines) {
        flowData.lines.forEach(ld => {
            const startNode = document.getElementById(ld.start);
            const endNode = document.getElementById(ld.end);
            if (startNode && endNode) {
                try {
                    lines.push(new LeaderLine(startNode, endNode, { color: 'rgba(168, 85, 247, 0.8)', size: 3, path: 'fluid', endPlug: 'arrow1' }));
                } catch (err) { console.error("LeaderLine error:", err); }
            }
        });
    }
    document.getElementById('flow-name-input').value = flowName;
    document.getElementById('flow-objective-select').value = flowData.objective || 'none';
    
    const hostSelect = document.getElementById('flow-host-select');
    if (flowData.host) {
        if (flowData.host.type === 'personal') {
            hostSelect.value = 'personal';
        } else if (flowData.host.type === 'clan') {
            hostSelect.value = `clan-${flowData.host.serverId}`;
        } else if (flowData.host.type === 'botnet_group') {
            hostSelect.value = `botnet-${flowData.host.name}`;
        }
    } else {
        hostSelect.value = 'personal';
    }

    currentObjective = flowData.objective || 'none';
    validateFlow();
    updateCurrentFlowStatsUI();
}

function deleteFlow() {
    const dropdown = document.getElementById('saved-flows-dropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const flowName = selectedOption.value;
    const flowType = selectedOption.dataset.type;

    if (!flowName) { alert('Seleziona un flusso da eliminare.'); return; }
    
    if (confirm(`Eliminare il flusso "${flowName}"?`)) {
        if (flowType === 'permanent') {
            delete state.permanentFlows[flowName];
        } else {
            delete state.savedFlows[flowName];
        }
        saveState();
        populateSavedFlowsDropdown();
        const flowNameInput = document.getElementById('flow-name-input');
        if (flowNameInput.value === flowName) flowNameInput.value = '';
    }
}


function initEditorPage() {
    renderToolbox();
    populateSavedFlowsDropdown();
    populateHostSelector();
    populateObjectiveSelector();
    updateCurrentFlowStatsUI();
    validateFlow();

    document.getElementById('save-flow-button').addEventListener('click', saveFlow);
    document.getElementById('save-flow-perm-button').addEventListener('click', saveFlowPermanently);
    document.getElementById('load-flow-button').addEventListener('click', loadFlow);
    document.getElementById('delete-flow-button').addEventListener('click', deleteFlow);
    document.getElementById('clear-connections-button').addEventListener('click', clearCanvas);

    const canvas = document.getElementById('canvas');
    canvas.addEventListener('dragover', (e) => e.preventDefault());
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const blockName = e.dataTransfer.getData('text/plain');
        if (blockName) {
            const canvasRect = canvas.getBoundingClientRect();
            createNode(blockName, e.clientX - canvasRect.left, e.clientY - canvasRect.top);
        }
    });

    interact('.canvas-node').draggable({
        ignoreFrom: '.connector',
        onmove: (event) => {
            const target = event.target;
            target.style.left = (target.offsetLeft + event.dx) + 'px';
            target.style.top = (target.offsetTop + event.dy) + 'px';
            updateLines();
        },
        onend: validateFlow
    });

    canvas.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.classList.contains('connector')) {
            if (startSocket) {
                startSocket.classList.remove('selected');
                startSocket = null;
                document.querySelectorAll('.connector').forEach(c => c.classList.remove('compatible', 'incompatible'));
            }
            return;
        }

        if (!startSocket) {
            if (target.classList.contains('output')) {
                startSocket = target;
                startSocket.classList.add('selected');
                document.querySelectorAll('.connector.input').forEach(c => {
                    if (areTypesCompatible(startSocket.dataset.type, c.dataset.type)) {
                        c.classList.add('compatible');
                    } else {
                        c.classList.add('incompatible');
                    }
                });
            }
        } else {
            if (target.classList.contains('input') && areTypesCompatible(startSocket.dataset.type, target.dataset.type)) {
                try {
                    lines.push(new LeaderLine(startSocket, target, { 
                        color: 'rgba(168, 85, 247, 0.8)', size: 3, path: 'fluid',
                        endPlug: 'arrow1'
                    }));
                } catch(err) { console.error("LeaderLine error:", err); }
                validateFlow();
            }
            startSocket.classList.remove('selected');
            startSocket = null;
            document.querySelectorAll('.connector').forEach(c => c.classList.remove('compatible', 'incompatible'));
        }
    });
}
