// Gestione partita
var partita = {

    // Inizializzazione
    init: function() {
        partita.installa_sw();
        partita.memorizza_elementi();
        partita.controlla_partita();
        partita.init_nuova();
        partita.init_continua();
        partita.init_chiudi();
        partita.init_conferma();
    },

    // Installazione service worker
    installa_sw: function() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    },

    // Memorizzazione degli elementi
    memorizza_elementi: function() {
        partita.elemento_continua = document.querySelector('#continua');
        partita.elemento_nuova = document.querySelector('#nuova');
        partita.elemento_modal = document.querySelector('.w3-modal');
        partita.elemento_chiudi = document.querySelector('#chiudi');
        partita.elemento_conferma = document.querySelector('#conferma');
    },

    // Controllo partita in corso
    controlla_partita: function() {
        if (JSON.parse(localStorage.getItem('partita'))) {
            partita.in_corso = true;
            partita.elemento_continua.classList.remove('w3-text-grey');
        }
    },

    // Inizializzazione nuova partita
    init_nuova: function() {
        partita.elemento_nuova.addEventListener('click', function() {
            if (partita.in_corso) partita.elemento_modal.style.display = 'block';
            else location.href = '/setup';
        });
    },

    // Inizializzazione continua partita
    init_continua: function() {
        partita.elemento_continua.addEventListener('click', function() {
            if (partita.in_corso) location.href = '/appunti';
        });
    },

    // Inizializzazione chiusura
    init_chiudi: function() {
        partita.elemento_chiudi.addEventListener('click', function() {
            partita.elemento_modal.style.display = 'none';
        });
    },

    // Inizializzazione conferma
    init_conferma: function() {
        partita.elemento_conferma.addEventListener('click', function() {
            localStorage.setItem('partita', 'false');
            localStorage.removeItem('info');
            location.href = '/setup';
        });
    }

};


// Pagina pronta
document.addEventListener('DOMContentLoaded', partita.init());
