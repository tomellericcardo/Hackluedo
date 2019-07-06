// Pagina di setup
var setup = {

    // Inizializzazione
    init: function() {
        setup.memorizza_elementi();
        setup.render_versioni();
        setup.init_versione();
        setup.init_giocatori();
        setup.init_conferma();
    },

    // Numeri di giocatori
    numero: 2,

    // Memorizzazione degli elementi
    memorizza_elementi: function() {
        setup.elemento_versione = document.querySelector('#versione');
        setup.elemento_ambientazione = document.querySelector('#ambientazione');
        setup.elemento_numero = document.querySelector('#numero');
        setup.elemento_nomi = document.querySelector('#nomi');
        setup.elemento_conferma = document.querySelector('#conferma');
    },

    // Renderizzazione versioni
    render_versioni: function() {
        fetch('/data/versioni.json').then(function(risposta) {
            return risposta.json();
        }).then(function(risposta) {
            var versioni = risposta.versioni;
            for (var i = 0; i < versioni.length; i++) {
                var versione = versioni[i];
                var opzione_versione = document.createElement('option');
                opzione_versione.value = versione.valore;
                opzione_versione.innerHTML = versione.nome;
                setup.elemento_versione.appendChild(opzione_versione);
                for (var j = 0; j < versione.ambientazioni.length; j++) {
                    var ambientazione = versione.ambientazioni[j];
                    var opzione_ambientazione = document.createElement('option');
                    opzione_ambientazione.className = versione.valore;
                    opzione_ambientazione.value = ambientazione.valore;
                    opzione_ambientazione.innerHTML = ambientazione.nome;
                    setup.elemento_ambientazione.appendChild(opzione_ambientazione);
                }
            }
        });
    },

    // Inizializzazione versione
    init_versione: function() {
        setup.elemento_versione.addEventListener('change', function() {
            setup.elemento_ambientazione.value = '';
            var versione = setup.elemento_versione.value;
            if (versione == '') setup.elemento_ambientazione.disabled = true;
            else {
                setup.elemento_ambientazione.disabled = false;
                var opzioni_ambientazione = document.querySelectorAll('#ambientazione option');
                for (var i = 0; i < opzioni_ambientazione.length; i++) {
                    var opzione = opzioni_ambientazione[i];
                    if (opzione.classList.contains(versione)) opzione.style.display = 'block';
                    else opzione.style.display = 'none';
                }
            }
        });
    },

    // Inizializzazione giocatori
    init_giocatori: function() {
        setup.elemento_numero.addEventListener('change', function() {
            setup.elemento_nomi.innerHTML = '';
            setup.numero = setup.elemento_numero.value;
            if (setup.numero < 2 || setup.numero > 6) setup.numero = 2;
            for (var i = 0; i < setup.numero; i++) {
                var elemento_nome = document.createElement('input');
                elemento_nome.type = 'text';
                elemento_nome.id = 'nome_' + i;
                elemento_nome.className = 'w3-input';
                elemento_nome.placeholder = 'Nome giocatore ' + (i + 1);
                setup.elemento_nomi.appendChild(elemento_nome);
            }
        });
    },

    // Inizializzazione conferma
    init_conferma: function() {
        setup.elemento_conferma.addEventListener('click', function() {
            var versione = setup.elemento_versione.value;
            var ambientazione = setup.elemento_ambientazione.value;
            if (versione != '' && ambientazione != '' && setup.nomi_validi()) setup.setup();
        });
    },

    // Controllo nomi validi
    nomi_validi: function() {
        var validi = true;
        var nomi = [];
        var i = 0;
        while (validi && i < setup.numero) {
            var nome = document.querySelector('#nome_' + i).value;
            nome = nome.trim().substring(0, 3).toUpperCase();
            if (nome == '') validi = false;
            else if (nomi.includes(nome)) validi = false;
            else nomi.push(nome);
            i++;
        }
        if (validi) setup.giocatori = nomi;
        return validi;
    },

    // Salvataggio informazioni e inizio gioco
    setup: function() {
        localStorage.setItem('versione', setup.elemento_versione.value);
        localStorage.setItem('ambientazione', setup.elemento_ambientazione.value);
        localStorage.setItem('giocatori', JSON.stringify(setup.giocatori));
        localStorage.setItem('partita', 'true');
        location.href = '/appunti';
    }

};


// Pagina pronta
document.addEventListener('DOMContentLoaded', function() {
    if (JSON.parse(localStorage.getItem('partita'))) location.href = '/';
    else setup.init();
});
