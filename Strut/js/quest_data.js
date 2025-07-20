const questsData = [
    {
        id: 'quest_001',
        title: 'Credenziali Social Media',
        informant: 'Mr. X',
        description: "Ho bisogno di accedere al profilo social di un certo 'Marco Bianchi'. Trova il suo username e la sua password. So che i suoi dati potrebbero trovarsi in un leak di dati anagrafici italiani.",
        targetKeyword: 'Marco Bianchi',
        suggestedDataSource: 'Dati Anagrafici (Italia)',
        rewards: {
            btc: 2500,
            xp: 150
        }
    },
    {
        id: 'quest_002',
        title: 'Transazione Sospetta',
        informant: 'Giornalista Investigativo',
        description: "Sto indagando su una transazione illecita verso Wall Street. Ho bisogno di una prova. Cerca il codice di transazione 'XF88-Kilo-9' in un archivio di dati finanziari americani.",
        targetKeyword: 'XF88-Kilo-9',
        suggestedDataSource: 'Dati Finanziari Top-Tier (USA)',
        rewards: {
            btc: 7000,
            xp: 300
        }
    },
    {
        id: 'quest_003',
        title: 'Il Paziente Zero',
        informant: 'Contatto Governativo',
        description: "Stiamo cercando di rintracciare l'origine di un'epidemia. Abbiamo bisogno della cartella clinica di 'Sarah Jenkins' da un database sanitario del Regno Unito. Massima discrezione.",
        targetKeyword: 'Sarah Jenkins',
        suggestedDataSource: 'Cartelle Cliniche (Regno Unito)',
        rewards: {
            btc: 12000,
            xp: 500
        }
    }
    // Aggiungi qui altre quest in futuro
];
