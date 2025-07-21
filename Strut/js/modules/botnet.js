// js/modules/botnet.js

import { player, savePlayerData } from '../data.js';
import { addNotification } from '../main.js';
// La logica di executeFlow sarà simulata qui per ora, come da documento.
// import { executeFlow } from '../flow_logic.js'; 

// Stato del modulo
let botnetInterval;
let selectedHostIp = null;

// Elementi della modale
let hostModal, closeModalBtn, modalHostIp, modalHostLocation, modalHostStatus, modalHostInfection, modalHostResources, modalHostStability, modalHostTraceability, flowSelector, executeFlowBtn, scanDataBtn, propagateMalwareBtn, cleanHostBtn, modalHostLog;

export function initBotnet() {
    console.log("Initializing Botnet module...");
    const commandButton = document.getElementById('botnet-command-all');
    if (commandButton) {
        commandButton.addEventListener('click', () => executeBotnetCommand('all'));
    }
    
    // Inizializza gli elementi della modale
    hostModal = document.getElementById('host-interaction-modal');
    closeModalBtn = document.getElementById('close-host-modal');
    modalHostIp = document.getElementById('modal-host-ip');
    modalHostLocation = document.getElementById('modal-host-location');
    modalHostStatus = document.getElementById('modal-host-status');
    modalHostInfection = document.getElementById('modal-host-infection');
    modalHostResources = document.getElementById('modal-host-resources');
    modalHostStability = document.getElementById('modal-host-stability');
    modalHostTraceability = document.getElementById('modal-host-traceability');
    flowSelector = document.getElementById('flow-selector');
    executeFlowBtn = document.getElementById('execute-flow-btn');
    scanDataBtn = document.getElementById('scan-data-btn');
    propagateMalwareBtn = document.getElementById('propagate-malware-btn');
    cleanHostBtn = document.getElementById('clean-host-btn');
    modalHostLog = document.getElementById('modal-host-log');

    // Evento di chiusura della modale
    if(closeModalBtn) {
        closeModalBtn.onclick = () => {
            hostModal.style.display = "none";
            selectedHostIp = null;
        };
    }
    window.onclick = (event) => {
        if (event.target == hostModal) {
            hostModal.style.display = "none";
            selectedHostIp = null;
        }
    };
    
    // Aggiunge gli event listener per i pulsanti della modale
    if(executeFlowBtn) executeFlowBtn.addEventListener('click', handleExecuteFlow);
    if(scanDataBtn) scanDataBtn.addEventListener('click', handleScanData);
    if(propagateMalwareBtn) propagateMalwareBtn.addEventListener('click', handlePropagate);
    if(cleanHostBtn) cleanHostBtn.addEventListener('click', handleCleanHost);


    displayInfectedHosts();
    updateBotnetStats();

    // Avvia la generazione di reddito dalla botnet
    if (botnetInterval) clearInterval(botnetInterval);
    botnetInterval = setInterval(generateBotnetIncome, 5000); // Genera reddito ogni 5 secondi
}

function updateBotnetStats() {
    const hostCount = player.infectedHostPool.length;
    const totalResources = player.infectedHostPool.reduce((sum, host) => sum + host.resources, 0);
    const averageStability = hostCount > 0 ? (player.infectedHostPool.reduce((sum, host) => sum + host.stabilityScore, 0) / hostCount).toFixed(2) : 0;
    
    const hostCountEl = document.getElementById('botnet-host-count');
    const totalResourcesEl = document.getElementById('botnet-total-resources');
    const avgStabilityEl = document.getElementById('botnet-avg-stability');

    if(hostCountEl) hostCountEl.textContent = hostCount;
    if(totalResourcesEl) totalResourcesEl.textContent = totalResources;
    if(avgStabilityEl) avgStabilityEl.textContent = `${averageStability}%`;
}

function displayInfectedHosts() {
    const listElement = document.getElementById('infected-hosts-list');
    if (!listElement) return;
    listElement.innerHTML = ''; // Pulisce la lista esistente

    player.infectedHostPool.forEach(host => {
        const row = document.createElement('tr');
        row.setAttribute('data-host-ip', host.ip);
        row.innerHTML = `
            <td>${host.ip}</td>
            <td>${host.location}</td>
            <td>${host.infectionType}</td>
            <td>${host.resources}</td>
            <td>${host.stabilityScore.toFixed(2)}%</td>
            <td>${host.traceabilityScore.toFixed(2)}%</td>
            <td class="status-${host.status.toLowerCase()}">${host.status}</td>
        `;

        row.addEventListener('click', () => {
            openHostContextMenu(host.ip);
        });

        listElement.appendChild(row);
    });
    updateBotnetStats();
}

function openHostContextMenu(hostIp) {
    const host = player.infectedHostPool.find(h => h.ip === hostIp);
    if (!host) {
        console.error("Host non trovato:", hostIp);
        return;
    }

    selectedHostIp = host.ip;

    // Popola la modale con i dati dell'host
    updateHostModalDetails(host);

    // Popola il selettore dei flussi
    flowSelector.innerHTML = '<option value="">-- Seleziona un Flusso --</option>';
    player.savedFlows.forEach(flow => {
        const option = document.createElement('option');
        option.value = flow.id;
        option.textContent = flow.name;
        flowSelector.appendChild(option);
    });
    
    // Pulisce il log
    modalHostLog.innerHTML = '<li>Sistema pronto.</li>';

    // Mostra la modale
    hostModal.style.display = 'block';
}

function updateHostModalDetails(host) {
    if (!host || !modalHostIp) return;
    modalHostIp.textContent = `Host: ${host.ip}`;
    modalHostLocation.textContent = host.location;
    modalHostStatus.innerHTML = `<span class="status-${host.status.toLowerCase()}">${host.status}</span>`;
    modalHostInfection.textContent = host.infectionType;
    modalHostResources.textContent = host.resources;
    modalHostStability.textContent = `${host.stabilityScore.toFixed(2)}%`;
    modalHostTraceability.textContent = `${host.traceabilityScore.toFixed(2)}%`;
}

function addLogToHostModal(message) {
    if (!modalHostLog) return;
    const logEntry = document.createElement('li');
    const timestamp = new Date().toLocaleTimeString();
    logEntry.textContent = `[${timestamp}] ${message}`;
    modalHostLog.appendChild(logEntry);
    modalHostLog.scrollTop = modalHostLog.scrollHeight; // Auto-scroll in basso
}

function handleExecuteFlow() {
    if (!selectedHostIp) return;
    const host = player.infectedHostPool.find(h => h.ip === selectedHostIp);
    const flowId = flowSelector.value;

    if (!host || !flowId) {
        addLogToHostModal("Errore: Nessun host o flusso selezionato.");
        addNotification("Seleziona un host e un flusso da eseguire.", "error");
        return;
    }

    const flow = player.savedFlows.find(f => f.id === flowId);
    if (!flow) {
        addLogToHostModal(`Errore: Flusso con ID ${flowId} non trovato.`);
        return;
    }

    addLogToHostModal(`Esecuzione del flusso '${flow.name}' su ${host.ip}...`);
    
    // Simula il tempo di esecuzione
    setTimeout(() => {
        // Simulazione basata sulla documentazione
        const hasDataExfiltration = flow.blocks.some(b => b.type === 'dataExfiltration');
        const hasPropagation = flow.blocks.some(b => b.type === 'networkWorm');
        
        let success = Math.random() * 100 < host.stabilityScore;

        if (success) {
            addLogToHostModal(`Flusso '${flow.name}' eseguito con successo.`);
            if (hasDataExfiltration) {
                const dataValue = Math.floor(Math.random() * 500 + 100) * host.resources;
                player.dataPackets.push({
                    id: `dp_${Date.now()}`,
                    value: dataValue,
                    source: host.ip,
                    type: "Corporate Mails" // Tipo di esempio
                });
                addLogToHostModal(`Dati esfiltrati. Valore: $${dataValue}.`);
                addNotification(`Pacchetto dati acquisito da ${host.ip}`, "success");
            }
            if (hasPropagation) {
                addLogToHostModal("Tentativo di propagazione avviato...");
                if(Math.random() > 0.5) {
                     addLogToHostModal("Propagazione riuscita verso un nuovo host!");
                } else {
                     addLogToHostModal("Propagazione fallita, nessun nuovo target trovato.");
                }
            }
            host.stabilityScore -= 5;
        } else {
            addLogToHostModal(`Esecuzione del flusso fallita. Rischio di rilevamento aumentato.`);
            host.traceabilityScore += 15;
            host.stabilityScore -= 10;
        }

        host.stabilityScore = Math.max(0, host.stabilityScore);
        host.traceabilityScore = Math.min(100, host.traceabilityScore);

        if (host.traceabilityScore >= 100 || host.stabilityScore <= 0) {
            addLogToHostModal(`L'host ${host.ip} è diventato instabile ed è stato ripulito dalle autorità.`);
            handleCleanHost(true); // Pulizia silenziosa
        } else {
            updateHostModalDetails(host);
            displayInfectedHosts();
            savePlayerData();
        }

    }, 2000); // 2 secondi di tempo di esecuzione
}

function handleScanData() {
    if (!selectedHostIp) return;
    const host = player.infectedHostPool.find(h => h.ip === selectedHostIp);
    addLogToHostModal(`Scansione di ${host.ip} per dati di valore...`);

    setTimeout(() => {
        let success = Math.random() * 100 < host.stabilityScore - 10; // La scansione è rischiosa
        if (success && host.resources > 2) {
            const dataValue = Math.floor(Math.random() * 200 + 50) * host.resources;
            player.dataPackets.push({
                id: `dp_scan_${Date.now()}`,
                value: dataValue,
                source: host.ip,
                type: "User Credentials"
            });
            addLogToHostModal(`Scansione completata. Trovato pacchetto dati del valore di $${dataValue}.`);
            addNotification(`Pacchetto dati acquisito da ${host.ip}`, "success");
            host.stabilityScore -= 10;
            host.traceabilityScore += 5;
        } else {
            addLogToHostModal("Scansione fallita o non ha trovato nulla di valore. Tracciabilità aumentata.");
            host.traceabilityScore += 20;
        }

        host.stabilityScore = Math.max(0, host.stabilityScore);
        host.traceabilityScore = Math.min(100, host.traceabilityScore);
        updateHostModalDetails(host);
        displayInfectedHosts();
        savePlayerData();

    }, 2500);
}

function handlePropagate() {
    if (!selectedHostIp) return;
    const host = player.infectedHostPool.find(h => h.ip === selectedHostIp);
    addLogToHostModal(`Tentativo di propagazione da ${host.ip}...`);

    setTimeout(() => {
        let success = Math.random() * 100 < host.stabilityScore - 15; // La propagazione è molto rischiosa
        if (success) {
            addLogToHostModal("Propagazione riuscita! Un nuovo host è stato aggiunto alla tua botnet.");
            addNotification("Nuovo host aggiunto alla botnet!", "success");
            const newHost = {
                ip: `1${Math.floor(Math.random()*90+10)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
                location: host.location,
                infectionType: 'Worm',
                resources: Math.floor(Math.random() * 5 + 1),
                stabilityScore: 90,
                traceabilityScore: 10,
                status: 'Idle',
                log: []
            };
            player.infectedHostPool.push(newHost);
            host.stabilityScore -= 20;
            host.traceabilityScore += 10;
        } else {
            addLogToHostModal("Propagazione fallita. Il tentativo è stato rilevato.");
            host.traceabilityScore += 25;
        }

        host.stabilityScore = Math.max(0, host.stabilityScore);
        host.traceabilityScore = Math.min(100, host.traceabilityScore);
        updateHostModalDetails(host);
        displayInfectedHosts();
        savePlayerData();

    }, 3000);
}

function handleCleanHost(silent = false) {
    if (!selectedHostIp) return;
    
    const hostIndex = player.infectedHostPool.findIndex(h => h.ip === selectedHostIp);
    if (hostIndex > -1) {
        const host = player.infectedHostPool[hostIndex];
        player.infectedHostPool.splice(hostIndex, 1);

        player.stats.traceability -= 2;
        player.stats.traceability = Math.max(0, player.stats.traceability);
        
        if (!silent) {
            addNotification(`Host ${host.ip} ripulito e rimosso dalla botnet.`, "info");
            hostModal.style.display = "none";
        }
        
        selectedHostIp = null;
        displayInfectedHosts();
        savePlayerData();
    }
}


function executeBotnetCommand(command) {
    addNotification(`Esecuzione del comando '${command}' su tutti i bot...`, 'info');
}

function generateBotnetIncome() {
    if (player.infectedHostPool.length === 0) return;

    const income = player.infectedHostPool.reduce((total, host) => {
        const hostIncome = host.resources * (host.stabilityScore / 100) * 0.5;
        return total + hostIncome;
    }, 0);

    if (income > 0) {
        player.stats.money += income;
    }

    let needsUpdate = false;
    player.infectedHostPool.forEach(host => {
        if (Math.random() < 0.1) { 
            host.stabilityScore -= Math.random() * 0.5;
            needsUpdate = true;
        }
        if (Math.random() < 0.05) {
            host.traceabilityScore += Math.random() * 0.5;
            needsUpdate = true;
        }

        if (host.stabilityScore < 0) host.stabilityScore = 0;
        if (host.traceabilityScore > 100) host.traceabilityScore = 100;
        
        if (host.stabilityScore < 10 || host.traceabilityScore > 90) {
            if (Math.random() < 0.02) { // 2% di possibilità ogni 5 secondi
                addNotification(`L'host ${host.ip} è stato rilevato e ripulito dalle autorità!`, "warning");
                selectedHostIp = host.ip;
                handleCleanHost(true); 
                needsUpdate = true;
            }
        }
    });

    if(needsUpdate) {
        displayInfectedHosts(); 
        savePlayerData();
    }
}

export function cleanupBotnet() {
    if (botnetInterval) {
        clearInterval(botnetInterval);
        botnetInterval = null;
    }
    selectedHostIp = null;
}
