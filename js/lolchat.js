class LolChat {
    /**
     * 
     * @param {string} a Adresse du serveur Web Socket
     * @param {string} p Port de connexion
     * @param {HtmlElement} el Balise Html dans laquelle écrire le chat
     * @param {HtmlElement} i Balise Html dans laquelle écrire les infos
     */
    constructor(a, p, el, i) {
        this.adr = a;
        this.port = p;
        this.socket = io.connect(a, {transports: ['websocket', 'polling', 'flashsocket']});

        this.id;

        this.el = el;
        this.infos = i;

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
                this.ecritInfos(this.socket.id + ' id reçu');
                this.id = this.socket.id;
            });

        this.socket.on('connexion',
            (data) => {
                console.log(data);
                this.ecritInfos('connexion établie');
            });

        this.socket.on('messageRecu',
            data => {
                console.log(data);
                this.ecriteMessageEl(data);
            });

        this.socket.on('changementDeSalon',
            data => {
                console.log(data);
                this.ecritInfos('Changement de salon : ', data);
            })

        this.socket.on('disconnect',
            () => {
                this.socket.open();
                this.ecriteMessageEl('Reconnexion');
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

        this.txt = document.createElement('input');
        this.txt.name = 'Message';
        this.txt.placeholder = 'Saisissez un message';

        for(let s of tab){
            let o = document.createElement('option');
            o.textContent = s;
            o.value = s;
            this.salons.append(o);
        }
        
        this.el.appendChild(this.salons);
        this.el.appendChild(this.chat);
        this.el.appendChild(this.txt);

        document.addEventListener('keydown', (ev) => {
            if(ev.key == 'Enter' && this.txt.value != ''){
                this.message = this.txt.value;
                this.socket.emit('messageEnvoye', this.message);
                this.txt.value = '';
            }
        });
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
    ecriteMessageEl(m) {
        let li = document.createElement('li');
        if(m == this.message){
            li.className = 'self';
        }
        li.textContent = m;
        this.chat.appendChild(li);
    }
    /**
     * 
     * @param {sting} m Message à écrire en information 
     */
    ecritInfos(m){
        let i = document.createElement("p");
        i.textContent = m;
        this.infos.appendChild(i);
    }
}

var loool = new LolChat("http://localhost:3200", '3200', document.querySelector('#chat'), document.querySelector('#infos'));