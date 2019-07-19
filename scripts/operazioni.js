// Operazioni appunti
var operazioni = {

    // Inizializzazione
    init: function() {
        operazioni.init_aggiungi();
        operazioni.init_tipo();
        operazioni.init_certezza();
        operazioni.init_ipotesi();
        operazioni.init_reazioni();
    },

    // Inizializzazione aggiungi
    init_aggiungi: function() {
        appunti.elemento_chiudi.addEventListener('click', operazioni.chiudi_modal);
        appunti.elemento_aggiungi.addEventListener('click', function() {
            appunti.elemento_modal.style.display = 'block';
        });
    },

    // Chiusura modal
    chiudi_modal: function() {
        appunti.elemento_modal.style.display = 'none';
        appunti.elemento_tipo.style.display = 'block';
        appunti.elemento_giocatore.style.display = 'block';
        appunti.elemento_tipo.value = 'certezza';
        appunti.elemento_certezza.style.display = 'block';
        appunti.elemento_ipotesi.style.display = 'none';
        appunti.elemento_reazioni.style.display = 'none';
        appunti.elemento_reazioni_giocatori.innerHTML = '';
        appunti.elemento_giocatore.value = '';
        appunti.elemento_possiede.value = 'non_possiede';
        appunti.elemento_carta.value = '';
        appunti.elemento_sospettato.value = '';
        appunti.elemento_stanza.value = '';
        appunti.elemento_arma.value = '';
    },

    // Inizializzazione tipologia
    init_tipo: function() {
        appunti.elemento_tipo.addEventListener('change', function() {
            appunti.elemento_reazioni.style.display = 'none';
            appunti.elemento_reazioni_giocatori.innerHTML = '';
            if (appunti.elemento_tipo.value == 'certezza') {
                appunti.elemento_certezza.style.display = 'block';
                appunti.elemento_ipotesi.style.display = 'none';
            } else {
                appunti.elemento_certezza.style.display = 'none';
                appunti.elemento_ipotesi.style.display = 'block';
            }
        });
    },

    // Inizializzazione certezza
    init_certezza: function() {
        appunti.elemento_conferma_certezza.addEventListener('click', function() {
            var giocatore = appunti.elemento_giocatore.value;
            var possiede = appunti.elemento_possiede.value;
            var carta = appunti.elemento_carta.value;
            if (giocatore != '' && carta != '') {
                if (possiede == 'possiede') operazioni.possiede(giocatore, carta);
                else operazioni.non_possiede(giocatore, carta);
                operazioni.completa_colonne();
                operazioni.chiudi_modal();
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
        if (possesso) appunti.partita[giocatore].possiede.push(carta);
        else appunti.partita[giocatore].non_possiede.push(carta);
        localStorage.setItem('info', JSON.stringify(appunti.partita));
    },

    // Evita duplicati
    evita_duplicati: function(giocatore, carta) {
        var i = appunti.partita[giocatore].possiede.indexOf(carta);
        if (i > -1) appunti.partita[giocatore].possiede.splice(i, 1);
        i = appunti.partita[giocatore].non_possiede.indexOf(carta);
        if (i > -1) appunti.partita[giocatore].non_possiede.splice(i, 1);
    },

    // Completa colonne
    completa_colonne: function() {
        var modifica = true;
        while (modifica) {
            modifica = false
            for (var i = 0; i < appunti.giocatori.length; i++) {
                var giocatore = appunti.giocatori[i];
                var carte_giocatore = appunti.carte_giocatore[giocatore];
                var carte_possedute = appunti.partita[giocatore].possiede.length;
                var carte_non_possedute = appunti.partita[giocatore].non_possiede.length;
                if ((appunti.carte.length - (carte_possedute + carte_non_possedute)) > 0) {
                    if (carte_possedute == carte_giocatore) {
                        for (var j = 0; j < appunti.carte.length; j++) {
                            var carta_corrente = appunti.carte[j];
                            if (appunti.partita[giocatore].possiede.indexOf(carta_corrente) < 0) {
                                operazioni.imposta_possesso(giocatore, carta_corrente, false);
                                modifica = true;
                            }
                        }
                    } else if ((appunti.carte.length - carte_non_possedute) == carte_giocatore) {
                        for (var j = 0; j < appunti.carte.length; j++) {
                            var carta_corrente = appunti.carte[j];
                            if (appunti.partita[giocatore].non_possiede.indexOf(carta_corrente) < 0) {
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
            var giocatore = appunti.elemento_giocatore.value;
            var sospettato = appunti.elemento_sospettato.value;
            var stanza = appunti.elemento_stanza.value;
            var arma = appunti.elemento_arma.value;
            if (giocatore != '' && giocatore != 'Tavolo' && sospettato != '' && stanza != '' && arma != '') {
                operazioni.render_reazioni(giocatore, sospettato, stanza, arma);
                operazioni.init_mostra();
                appunti.elemento_certezza.style.display = 'none';
                appunti.elemento_ipotesi.style.display = 'none';
                appunti.elemento_reazioni.style.display = 'block';
                appunti.elemento_tipo.style.display = 'none';
                appunti.elemento_giocatore.style.display = 'none';
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
            var giocatore = appunti.elemento_giocatore.value;
            var sospettato = appunti.elemento_sospettato.value;
            var stanza = appunti.elemento_stanza.value;
            var arma = appunti.elemento_arma.value;
            for (var i = 1; i < appunti.giocatori.length; i++) {
                var giocatore_corrente = appunti.giocatori[i];
                if (giocatore_corrente != giocatore && giocatore_corrente != 'Tavolo') {
                    var elemento_mostra = document.querySelector('#' + giocatore_corrente + '_mostra');
                    if (elemento_mostra.value == 'mostra') {
                        var elemento_mostra_carta = document.querySelector('#' + giocatore_corrente + '_mostra_carta');
                        if (elemento_mostra_carta.value != '') {
                            operazioni.possiede(giocatore_corrente, elemento_mostra_carta.value);
                        }
                    } else if (elemento_mostra.value == 'non_mostra') {
                        operazioni.non_possiede(giocatore_corrente, sospettato);
                        operazioni.non_possiede(giocatore_corrente, stanza);
                        operazioni.non_possiede(giocatore_corrente, arma);
                    }
                }
            }
            operazioni.completa_colonne();
            operazioni.chiudi_modal();
            appunti.aggiorna_appunti();
        });
    }

};


// Pagina pronta
document.addEventListener('DOMContentLoaded', operazioni.init});
