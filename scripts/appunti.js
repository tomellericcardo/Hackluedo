// Pagina appunti
var appunti = {

    // Inizializzazione
    init: function() {
        appunti.memorizza_elementi();
        appunti.leggi_ambientazione();
    },

    // Icone degli appunti
    icone: {
        non_possiede: 'radio_button_unchecked',
        forse_possiede: 'help_outline',
        possiede: 'check_circle'
    },

    // Memorizzazione elementi
    memorizza_elementi: function() {
        appunti.elemento_tabella = document.querySelector('table');
        appunti.elemento_aggiungi = document.querySelector('#aggiungi');
        appunti.elemento_modal_certezza = document.querySelector('#modal_certezza');
        appunti.elemento_chiudi_certezza = document.querySelector('#chiudi_certezza');
        appunti.elemento_giocatore_certezza = document.querySelector('#giocatore_certezza');
        appunti.elemento_possiede = document.querySelector('#possiede');
        appunti.elemento_carta = document.querySelector('#carta');
        appunti.elemento_conferma_certezza = document.querySelector('#conferma_certezza');
        appunti.elemento_modal_ipotesi = document.querySelector('#modal_ipotesi');
        appunti.elemento_chiudi_ipotesi = document.querySelector('#chiudi_ipotesi');
        appunti.elemento_giocatore_ipotesi = document.querySelector('#giocatore_ipotesi');
        appunti.elemento_ipotesi = document.querySelector('#ipotesi');
        appunti.elemento_sospettato = document.querySelector('#sospettato');
        appunti.elemento_stanza = document.querySelector('#stanza');
        appunti.elemento_arma = document.querySelector('#arma');
        appunti.elemento_conferma_ipotesi = document.querySelector('#conferma_ipotesi');
        appunti.elemento_reazioni = document.querySelector('#reazioni');
        appunti.elemento_reazioni_giocatori = document.querySelector('#reazioni_giocatori');
        appunti.elemento_conferma_reazioni = document.querySelector('#conferma_reazioni');
        appunti.elemento_annulla = document.querySelector('#annulla');
        appunti.elemento_modal_annulla = document.querySelector('#modal_annulla');
        appunti.elemento_chiudi_annulla = document.querySelector('#chiudi_annulla');
        appunti.elemento_conferma_annulla = document.querySelector('#conferma_annulla');
    },

    // Lettura ambientazione
    leggi_ambientazione: function() {
        fetch('/data/versioni.json').then(function(risposta) {
            return risposta.json();
        }).then(function(risposta) {
            var ambientazione = localStorage.getItem('ambientazione');
            var versioni = risposta.versioni;
            for (var i = 0; i < versioni.length; i++) {
                var ambientazioni = versioni[i].ambientazioni;
                if (ambientazioni[0].valore == ambientazione) {
                    appunti.sospettati = ambientazioni[0].sospettati;
                    appunti.stanze = ambientazioni[0].stanze;
                    appunti.armi = ambientazioni[0].armi;
                    break;
                } else if (ambientazioni[1].valore == ambientazione) {
                    appunti.sospettati = ambientazioni[1].sospettati;
                    appunti.stanze = ambientazioni[1].stanze;
                    appunti.armi = ambientazioni[1].armi;
                    break;
                }
            }
            appunti.carte = [].concat(appunti.sospettati, appunti.stanze, appunti.armi);
            appunti.n_carte = appunti.carte.length - 3;
            appunti.giocatori = JSON.parse(localStorage.getItem('giocatori'));
            appunti.carte_giocatore = {};
            appunti.render_appunti();
            appunti.render_campi();
            appunti.init_partita();
        });
    },

    // Renderizzazione appunti
    render_appunti: function() {
        var n_giocatori = appunti.giocatori.length;
        var n_carte_tavolo = appunti.n_carte % n_giocatori;
        for (var i = 0; i < n_giocatori; i++) {
            var giocatore = appunti.giocatori[i];
            var n_carte_giocatore = Math.round((appunti.n_carte - n_carte_tavolo) / n_giocatori);
            appunti.carte_giocatore[giocatore] = n_carte_giocatore;
        }
        if (n_carte_tavolo > 0) {
            appunti.giocatori.push('Tavolo');
            appunti.carte_giocatore.Tavolo = n_carte_tavolo;
        }
        var tr = document.createElement('tr');
        var th, td, x, j;
        for (i = -1; i < appunti.giocatori.length; i++) {
            th = document.createElement('th');
            if (i < 0) th.innerHTML = '';
            else th.innerHTML = '<p class="giocatore">' + appunti.giocatori[i] + '</p>';
            tr.appendChild(th);
        }
        appunti.elemento_tabella.appendChild(tr);
        appunti.render_celle();
    },

    // Renderizzazione celle
    render_celle: function() {
        var elementi = ['Sospettati', 'Stanze', 'Armi'];
        for (x = 0; x < elementi.length; x++) {
            var carte = appunti[elementi[x].toLowerCase()];
            for (i = -1; i < carte.length; i++) {
                tr = document.createElement('tr');
                for (j = -1; j < appunti.giocatori.length; j++) {
                    if (i < 0) {
                        th = document.createElement('th');
                        th.innerHTML = j < 0 ? elementi[x] : '';
                        tr.appendChild(th);
                    } else {
                        td = document.createElement('td');
                        if (j < 0) {
                            td.innerHTML = carte[i];
                            td.classList.add('carta');
                        } else {
                            td.innerHTML = '<i class="material-icons">&nbsp;</i>';
                            td.classList.add('cella');
                            appunti.init_cella(td, appunti.giocatori[j], carte[i]);
                        }
                        tr.appendChild(td);
                    }
                }
                appunti.elemento_tabella.appendChild(tr);
            }
        }
    },

    // Inizializzazione cella
    init_cella: function(td, giocatore, carta) {
        td.addEventListener('click', function() {
            appunti.elemento_giocatore_certezza.value = giocatore;
            appunti.elemento_carta.value = carta;
            appunti.elemento_modal_certezza.style.display = 'block';
        });
    },

    // Renderizzazione campi
    render_campi: function() {
        appunti.render_giocatori_certezza();
        appunti.render_giocatori_ipotesi();
        appunti.render_sospettati();
        appunti.render_stanze();
        appunti.render_armi();
    },

    // Renderizzazione giocatori certezza
    render_giocatori_certezza: function() {
        for (var i = 0; i < appunti.giocatori.length; i++) {
            var giocatore = appunti.giocatori[i];
            var option = document.createElement('option');
            option.value = giocatore;
            option.innerHTML = giocatore;
            appunti.elemento_giocatore_certezza.appendChild(option);
        }
    },

    // Renderizzazione giocatori ipotesi
    render_giocatori_ipotesi: function() {
        for (var i = 0; i < appunti.giocatori.length; i++) {
            var giocatore = appunti.giocatori[i];
            if (giocatore != 'Tavolo') {
                var option = document.createElement('option');
                option.value = giocatore;
                option.innerHTML = giocatore;
                appunti.elemento_giocatore_ipotesi.appendChild(option);
            }
        }
    },

    // Renderizzazione sospettati
    render_sospettati: function() {
        for (var i = 0; i < appunti.sospettati.length; i++) {
            var sospettato = appunti.sospettati[i];
            var option_carta = document.createElement('option');
            option_carta.value = sospettato;
            option_carta.innerHTML = sospettato;
            appunti.elemento_carta.appendChild(option_carta);
            var option = document.createElement('option');
            option.value = sospettato;
            option.innerHTML = sospettato;
            appunti.elemento_sospettato.appendChild(option);
        }
    },

    // Renderizzazione stanze
    render_stanze: function() {
        for (var i = 0; i < appunti.stanze.length; i++) {
            var stanza = appunti.stanze[i];
            var option_carta = document.createElement('option');
            option_carta.value = stanza;
            option_carta.innerHTML = stanza;
            appunti.elemento_carta.appendChild(option_carta);
            var option = document.createElement('option');
            option.value = stanza;
            option.innerHTML = stanza;
            appunti.elemento_stanza.appendChild(option);
        }
    },

    // Renderizzazione armi
    render_armi: function() {
        for (var i = 0; i < appunti.armi.length; i++) {
            var arma = appunti.armi[i];
            var option_carta = document.createElement('option');
            option_carta.value = arma;
            option_carta.innerHTML = arma;
            appunti.elemento_carta.appendChild(option_carta);
            var option = document.createElement('option');
            option.value = arma;
            option.innerHTML = arma;
            appunti.elemento_arma.appendChild(option);
        }
    },

    // Inizializzazione partita
    init_partita: function() {
        appunti.partita = JSON.parse(localStorage.getItem('appunti'));
        if (!appunti.partita) {
            appunti.partita = {
                operazioni: [],
                possessi: {}
            };
            for (var i = 0; i < appunti.giocatori.length; i++) {
                var giocatore = appunti.giocatori[i];
                appunti.partita.possessi[giocatore] = {
                    possiede: [],
                    non_possiede: []
                };
            }
            localStorage.setItem('appunti', JSON.stringify(appunti.partita));
        } else appunti.aggiorna_appunti();
    },

    // Aggiornamento appunti
    aggiorna_appunti: function() {
        var celle = document.querySelectorAll('.cella i');
        for (var giocatore in appunti.partita.possessi) {
            for (var i = 0; i < appunti.partita.possessi[giocatore].possiede.length; i++) {
                var carta = appunti.partita.possessi[giocatore].possiede[i];
                var indice = appunti.carte.indexOf(carta) * appunti.giocatori.length;
                indice += appunti.giocatori.indexOf(giocatore);
                celle[indice].innerHTML = appunti.icone.possiede;
                celle[indice].parentElement.parentElement.classList.add('esclusa');
            }
            for (var i = 0; i < appunti.partita.possessi[giocatore].non_possiede.length; i++) {
                var carta = appunti.partita.possessi[giocatore].non_possiede[i];
                var indice = appunti.carte.indexOf(carta) * appunti.giocatori.length;
                indice += appunti.giocatori.indexOf(giocatore);
                celle[indice].innerHTML = appunti.icone.non_possiede;
            }
        }
    }

};


// Pagina pronta
document.addEventListener('DOMContentLoaded', function() {
    if (!JSON.parse(localStorage.getItem('partita'))) location.href = '/';
    else {
        appunti.init();
        operazioni.init();
        annulla.init();
    }
});
