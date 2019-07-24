// Annulla operazioni
var annulla = {

    // Inizializzazione
    init: function() {
        appunti.elemento_annulla.addEventListener('click', function() {
            appunti.elemento_modal_annulla.style.display = 'block';
        });
        appunti.elemento_chiudi_annulla.addEventListener('click', function() {
            appunti.elemento_modal_annulla.style.display = 'none';
        });
        appunti.elemento_conferma_annulla.addEventListener('click', function() {
            appunti.elemento_modal_annulla.style.display = 'none';
            appunti.partita.operazioni.pop();
            annulla.ricalcola_possessi();
            location.href = '/appunti';
        });
    },

    // Ricalcolo dei possessi
    ricalcola_possessi: function() {
        var possessi = annulla.init_possessi();
        for (var i = 0; i < appunti.partita.operazioni.length; i++) {
            var operazione = appunti.partita.operazioni[i];
            if (operazione.tipo == 'certezza') {
                var giocatore = operazione.contenuto.giocatore;
                var possiede = operazione.contenuto.possiede;
                var carta = operazione.contenuto.carta;
                annulla.certezza(possessi, giocatore, possiede, carta);
            } else {
                var sospettato = operazione.contenuto.sospettato;
                var stanza = operazione.contenuto.stanza;
                var arma = operazione.contenuto.arma;
                var reazioni = operazione.contenuto.reazioni;
                annulla.ipotesi(possessi, sospettato, stanza, arma, reazioni);
            }
        }
        appunti.partita.possessi = possessi;
        localStorage.setItem('appunti', JSON.stringify(appunti.partita));
    },

    // Inizializzazione possessi
    init_possessi: function() {
        var possessi = {};
        for (var i = 0; i < appunti.giocatori.length; i++) {
            var giocatore = appunti.giocatori[i];
            possessi[giocatore] = {
                possiede: [],
                non_possiede: []
            };
        }
        return possessi;
    },

    // Aggiunta certezza
    certezza: function(possessi, giocatore, possiede, carta) {
        if (possiede) annulla.possiede(possessi, giocatore, carta);
        else annulla.non_possiede(possessi, giocatore, carta);
        annulla.completa_colonne(possessi);
    },

    // Possesso carta
    possiede: function(possessi, giocatore, carta) {
        annulla.imposta_possesso(possessi, giocatore, carta, true);
        for (var i = 0; i < appunti.giocatori.length; i++) {
            var giocatore_corrente = appunti.giocatori[i];
            if (giocatore_corrente != giocatore) {
                annulla.imposta_possesso(possessi, giocatore_corrente, carta, false);
            }
        }
    },

    // Non possesso carta
    non_possiede: function(possessi, giocatore, carta) {
        annulla.imposta_possesso(possessi, giocatore, carta, false);
    },

    // Imposta possesso
    imposta_possesso: function(possessi, giocatore, carta, possesso) {
        annulla.evita_duplicati(possessi, giocatore, carta);
        if (possesso) possessi[giocatore].possiede.push(carta);
        else possessi[giocatore].non_possiede.push(carta);
    },

    // Evita duplicati
    evita_duplicati: function(possessi, giocatore, carta) {
        var i = possessi[giocatore].possiede.indexOf(carta);
        if (i > -1) possessi[giocatore].possiede.splice(i, 1);
        i = possessi[giocatore].non_possiede.indexOf(carta);
        if (i > -1) possessi[giocatore].non_possiede.splice(i, 1);
    },

    // Completa colonne
    completa_colonne: function(possessi) {
        var modifica = true;
        while (modifica) {
            modifica = false
            for (var i = 0; i < appunti.giocatori.length; i++) {
                var giocatore = appunti.giocatori[i];
                var carte_giocatore = appunti.carte_giocatore[giocatore];
                var carte_possedute = possessi[giocatore].possiede.length;
                var carte_non_possedute = possessi[giocatore].non_possiede.length;
                if ((appunti.carte.length - (carte_possedute + carte_non_possedute)) > 0) {
                    if (carte_possedute == carte_giocatore) {
                        for (var j = 0; j < appunti.carte.length; j++) {
                            var carta_corrente = appunti.carte[j];
                            if (possessi[giocatore].possiede.indexOf(carta_corrente) < 0) {
                                annulla.imposta_possesso(possessi, giocatore, carta_corrente, false);
                                modifica = true;
                            }
                        }
                    } else if ((appunti.carte.length - carte_non_possedute) == carte_giocatore) {
                        for (var j = 0; j < appunti.carte.length; j++) {
                            var carta_corrente = appunti.carte[j];
                            if (possessi[giocatore].non_possiede.indexOf(carta_corrente) < 0) {
                                annulla.possiede(possessi, giocatore, carta_corrente);
                                modifica = true;
                            }
                        }
                    }
                }
            }
        }
    },

    // Aggiunta ipotesi
    ipotesi: function(possessi, sospettato, stanza, arma, reazioni) {
        for (var i = 1; i < reazioni.length; i++) {
            var reazione = reazioni[i];
            if (reazione.mostra) {
                if (reazione.carta != '') {
                    annulla.possiede(possessi, reazione.giocatore, reazione.carta);
                }
            } else {
                annulla.non_possiede(possessi, reazione.giocatore, sospettato);
                annulla.non_possiede(possessi, reazione.giocatore, stanza);
                annulla.non_possiede(possessi, reazione.giocatore, arma);
            }
        }
        annulla.completa_colonne(possessi);
    }

};
