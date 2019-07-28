

class LolChat {
    /**
     * 
     * @param {string} a Adresse du serveur Web Socket
     * @param {string} p Port de connexion
     * @param {HtmlElement} el Balise Html dans laquelle écrire le chat
     */
    constructor(a, p, el) {
        this.adr = a;
        this.port = p;
        this.socket = new io();

        this.el = el;

        this.creerEl();
        this.init();
    }
    /**
     * Gestionnaire d'événement du serveur Web
     */
    init() {
        this.socket.on('connect',
            () => {
                console.log(this.socket.id);
                this.ecritMessage(this.socket.id + ' id reçu');
            });

        this.socket.on('connexion',
            (data) => {
                console.log(data);
                this.ecriteMessage('connexion établie');
                // socket.emit('my other event', { my: 'data' });
            });

        this.socket.on('message',
            data => {
                console.log(data);
                this.ecriteMessage(data);
            })

        this.socket.on('disconnect',
            () => {
                this.socket.open();
                this.ecriteMessage('Reconnexion');
        });
    }
    /**
     * Créer les éléments HTML de la page
     */
    creerEl(){
        let tab=['Saloon', 'Salle', 'Sale', 'Salé'];

        this.chat = document.createElement('ul');

        this.salons = document.createElement("select");
        this.salons.addEventListener('change', (ev) => {
            console.log(ev.currentTarget.value);
            this.changeSalon(ev.currentTarget.value);
        });

        for(let s of tab){
            let o = document.createElement('option');
            o.textContent = s;
            o.value = s;
            this.salons.append(o);
        }
        
        this.el.appendChild(this.salons);
        this.el.appendChild(this.chat);
    }
    /**
     * Envoyer un événement au serveur pour indiquer le changement de salon
     * @param {string} s Valeur du sélect pour récupérer le un salon
     */
    changeSalon(s) {
        this.socket.emit('changeSalon', s);
    }
    /**
     * Message reçu depuis le serveur
     * @param {string} m Message reçu depuis le serveur à écrire dans le chat
     */
    ecriteMessage(m) {
        let li = document.createElement('li');
        li.textContent = m;
        this.chat.appendChild(li);
    }
}

var loool = new LolChat("http://localhost", '3200', document.querySelector('#chat'));