// Operazioni appunti
var operazioni = {

    // Inizializzazione
    init: function() {
        operazioni.init_modal();
        operazioni.init_certezza();
        operazioni.init_ipotesi();
        operazioni.init_reazioni();
    },

    // Inizializzazione delle modal
    init_modal: function() {
        appunti.elemento_chiudi_certezza.addEventListener('click', operazioni.chiudi_modal_certezza);
        appunti.elemento_chiudi_ipotesi.addEventListener('click', operazioni.chiudi_modal_ipotesi);
        appunti.elemento_aggiungi.addEventListener('click', function() {
            appunti.elemento_modal_ipotesi.style.display = 'block';
        });
    },

    // Chiusura modal certezza
    chiudi_modal_certezza: function() {
        appunti.elemento_modal_certezza.style.display = 'none';
        appunti.elemento_giocatore_certezza.value = '';
        appunti.elemento_possiede.value = 'possiede';
        appunti.elemento_carta.value = '';
    },

    // Chiusura modal ipotesi
    chiudi_modal_ipotesi: function() {
        appunti.elemento_modal_ipotesi.style.display = 'none';
        appunti.elemento_giocatore_ipotesi.style.display = 'block';
        appunti.elemento_giocatore_ipotesi.value = '';
        appunti.elemento_sospettato.value = '';
        appunti.elemento_stanza.value = '';
        appunti.elemento_arma.value = '';
        appunti.elemento_ipotesi.style.display = 'block';
        appunti.elemento_reazioni.style.display = 'none';
        appunti.elemento_reazioni_giocatori.innerHTML = '';
    },

    // Inizializzazione certezza
    init_certezza: function() {
        appunti.elemento_conferma_certezza.addEventListener('click', function() {
            var giocatore = appunti.elemento_giocatore_certezza.value;
            var possiede = appunti.elemento_possiede.value;
            var carta = appunti.elemento_carta.value;
            if (giocatore != '' && carta != '') {
                appunti.partita.operazioni.push({
                    tipo: 'certezza',
                    contenuto: {
                        giocatore: giocatore,
                        possiede: possiede == 'possiede' ? true : false,
                        carta: carta
                    }
                });
                if (possiede == 'possiede') operazioni.possiede(giocatore, carta);
                else operazioni.non_possiede(giocatore, carta);
                operazioni.completa_colonne();
                operazioni.chiudi_modal_certezza();
                appunti.aggiorna_appunti();
            }
        });
    },

    // Possesso carta
    possiede: function(giocatore, carta) {
        operazioni.imposta_possesso(giocatore, carta, true);
        for (var i = 0; i < appunti.giocatori.length; i++) {
            var giocatore_corrente = appunti.giocatori[i];
            if (giocatore_corrente != giocatore) {
                operazioni.imposta_possesso(giocatore_corrente, carta, false);
            }
        }
    },

    // Non possesso carta
    non_possiede: function(giocatore, carta) {
        operazioni.imposta_possesso(giocatore, carta, false);
    },

    // Imposta possesso
    imposta_possesso: function(giocatore, carta, possesso) {
        operazioni.evita_duplicati(giocatore, carta);
        if (possesso) appunti.partita.possessi[giocatore].possiede.push(carta);
        else appunti.partita.possessi[giocatore].non_possiede.push(carta);
        localStorage.setItem('appunti', JSON.stringify(appunti.partita));
    },

    // Evita duplicati
    evita_duplicati: function(giocatore, carta) {
        var i = appunti.partita.possessi[giocatore].possiede.indexOf(carta);
        if (i > -1) appunti.partita.possessi[giocatore].possiede.splice(i, 1);
        i = appunti.partita.possessi[giocatore].non_possiede.indexOf(carta);
        if (i > -1) appunti.partita.possessi[giocatore].non_possiede.splice(i, 1);
    },

    // Completa colonne
    completa_colonne: function() {
        var modifica = true;
        while (modifica) {
            modifica = false
            for (var i = 0; i < appunti.giocatori.length; i++) {
                var giocatore = appunti.giocatori[i];
                var carte_giocatore = appunti.carte_giocatore[giocatore];
                var carte_possedute = appunti.partita.possessi[giocatore].possiede.length;
                var carte_non_possedute = appunti.partita.possessi[giocatore].non_possiede.length;
                if ((appunti.carte.length - (carte_possedute + carte_non_possedute)) > 0) {
                    if (carte_possedute == carte_giocatore) {
                        for (var j = 0; j < appunti.carte.length; j++) {
                            var carta_corrente = appunti.carte[j];
                            if (appunti.partita.possessi[giocatore].possiede.indexOf(carta_corrente) < 0) {
                                operazioni.imposta_possesso(giocatore, carta_corrente, false);
                                modifica = true;
                            }
                        }
                    } else if ((appunti.carte.length - carte_non_possedute) == carte_giocatore) {
                        for (var j = 0; j < appunti.carte.length; j++) {
                            var carta_corrente = appunti.carte[j];
                            if (appunti.partita.possessi[giocatore].non_possiede.indexOf(carta_corrente) < 0) {
                                operazioni.possiede(giocatore, carta_corrente);
                                modifica = true;
                            }
                        }
                    }
                }
            }
        }
    },

    // Inizializzazione ipotesi
    init_ipotesi: function() {
        appunti.elemento_conferma_ipotesi.addEventListener('click', function() {
            var giocatore = appunti.elemento_giocatore_ipotesi.value;
            var sospettato = appunti.elemento_sospettato.value;
            var stanza = appunti.elemento_stanza.value;
            var arma = appunti.elemento_arma.value;
            if (giocatore != '' && sospettato != '' && stanza != '' && arma != '') {
                operazioni.render_reazioni(giocatore, sospettato, stanza, arma);
                operazioni.init_mostra();
                appunti.elemento_ipotesi.style.display = 'none';
                appunti.elemento_reazioni.style.display = 'block';
                appunti.elemento_giocatore_ipotesi.style.display = 'none';
            }
        });
    },

    // Renderizzazione reazioni
    render_reazioni: function(giocatore, sospettato, stanza, arma) {
        for (var i = 1; i < appunti.giocatori.length; i++) {
            var giocatore_corrente = appunti.giocatori[i];
            if (giocatore_corrente != giocatore && giocatore_corrente != 'Tavolo') {
                var label = document.createElement('label');
                label.for = giocatore_corrente + '_mostra';
                label.classList.add('w3-label');
                label.classList.add('w3-margin-top');
                label.innerHTML = giocatore_corrente;
                appunti.elemento_reazioni_giocatori.appendChild(label);
                var select = document.createElement('select');
                select.id = giocatore_corrente + '_mostra';
                select.name = giocatore_corrente + '_mostra';
                select.classList.add('w3-select');
                select.classList.add('mostra_carta');
                var option = document.createElement('option');
                option.value = '';
                option.innerHTML = 'Seleziona azione';
                select.appendChild(option);
                option = document.createElement('option');
                option.value = 'mostra';
                option.innerHTML = 'Mostra una carta';
                select.appendChild(option);
                option = document.createElement('option');
                option.value = 'non_mostra';
                option.innerHTML = 'Non mostra niente';
                select.appendChild(option);
                appunti.elemento_reazioni_giocatori.appendChild(select);
                select = document.createElement('select');
                select.id = giocatore_corrente + '_mostra_carta';
                select.classList.add('w3-select');
                select.classList.add('w3-hide');
                option = document.createElement('option');
                option.value = '';
                option.innerHTML = 'Seleziona carta mostrata';
                select.appendChild(option);
                option = document.createElement('option');
                option.value = sospettato;
                option.innerHTML = sospettato;
                select.appendChild(option);
                option = document.createElement('option');
                option.value = stanza;
                option.innerHTML = stanza;
                select.appendChild(option);
                option = document.createElement('option');
                option.value = arma;
                option.innerHTML = arma;
                select.appendChild(option);
                appunti.elemento_reazioni_giocatori.appendChild(select);
            }
        }
    },

    // Inizializzazione mostra
    init_mostra: function() {
        document.querySelectorAll('.mostra_carta').forEach(function(elemento_mostra) {
            elemento_mostra.addEventListener('change', function(event) {
                let elemento_mostra_carta = document.querySelector('#' + event.target.id + '_carta');
                if (elemento_mostra.value == 'mostra') {
                    elemento_mostra_carta.classList.remove('w3-hide');
                } else elemento_mostra_carta.classList.add('w3-hide');
            });
        });
    },

    // Inizializzazione reazioni
    init_reazioni: function() {
        appunti.elemento_conferma_reazioni.addEventListener('click', function() {
            var giocatore = appunti.elemento_giocatore_ipotesi.value;
            var sospettato = appunti.elemento_sospettato.value;
            var stanza = appunti.elemento_stanza.value;
            var arma = appunti.elemento_arma.value;
            var operazione = {
                tipo: 'ipotesi',
                contenuto: {
                    giocatore: giocatore,
                    sospettato: sospettato,
                    stanza: stanza,
                    arma: arma,
                    reazioni: []
                }
            };
            for (var i = 1; i < appunti.giocatori.length; i++) {
                var giocatore_corrente = appunti.giocatori[i];
                if (giocatore_corrente != giocatore && giocatore_corrente != 'Tavolo') {
                    var elemento_mostra = document.querySelector('#' + giocatore_corrente + '_mostra');
                    if (elemento_mostra.value == 'mostra') {
                        var elemento_mostra_carta = document.querySelector('#' + giocatore_corrente + '_mostra_carta');
                        operazione.contenuto.reazioni.push({
                            giocatore: giocatore_corrente,
                            mostra: true,
                            carta: elemento_mostra_carta.value
                        });
                        if (elemento_mostra_carta.value != '') {
                            operazioni.possiede(giocatore_corrente, elemento_mostra_carta.value);
                        }
                    } else if (elemento_mostra.value == 'non_mostra') {
                        operazione.contenuto.reazioni.push({
                            giocatore: giocatore_corrente,
                            mostra: false
                        });
                        operazioni.non_possiede(giocatore_corrente, sospettato);
                        operazioni.non_possiede(giocatore_corrente, stanza);
                        operazioni.non_possiede(giocatore_corrente, arma);
                    }
                }
            }
            appunti.partita.operazioni.push(operazione);
            operazioni.completa_colonne();
            operazioni.chiudi_modal_ipotesi();
            appunti.aggiorna_appunti();
        });
    }

};
