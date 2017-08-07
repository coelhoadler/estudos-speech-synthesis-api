class WebAPISpeech {

    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.defaultVoice = null;

        if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.populateVoiceList;
        }
    
        this.populateVoiceList();
    }

    speak(text) {
        if (typeof text === 'undefined')
            return false;

        let spk = new SpeechSynthesisUtterance(text);
        let lang = document.querySelectorAll('#voiceSelect option:checked')[0].getAttribute('data-lang');

        spk.lang = lang;
        spk.volume = document.querySelector("input[name='ctr_volume']").value;
	    spk.rate = parseFloat(document.querySelector("input[name='ctr_rate']").value);
	    spk.pitch = parseFloat(document.querySelector("input[name='ctr_pitch']").value);

        spk.onend = function (event) {
            console.info(`A máquina terminou de falar a frase`);
        }

        this.synth.speak(spk);
    }

    populateVoiceList() {
        if (typeof speechSynthesis === 'undefined') {
            return;
        }

        this.voices = speechSynthesis.getVoices();

        for (let i = 0; i < this.voices.length; i++) {
            let option = document.createElement('option');
            option.textContent = this.voices[i].name + ' (' + this.voices[i].lang + ')';

            if (this.voices[i].default) {
                option.textContent += ' -- PADRAO DO SISTEMA';
            }

            option.setAttribute('data-lang', this.voices[i].lang);
            option.setAttribute('data-name', this.voices[i].name);
            document.getElementById("voiceSelect").appendChild(option);
        }
    }

    getTexts() {
        let phrases = document.querySelectorAll(".__text");

        for (let i in phrases) {
            let phrase = phrases[i];
            if (typeof phrase !== 'undefined') {
                let content = phrase.textContent;
                console.info(content);
                this.speak(content);
            }
        }
    }

    adicionarFrase() {
        let textarea = document.querySelector("#txtAreaSuaFrase");
        let phrase = textarea.value;
        if (phrase) {
            let phraseEL = document.createElement("blockquote");
            let textnode = document.createTextNode(phrase);
            phraseEL.appendChild(textnode);
            phraseEL.setAttribute("class", "__text");
            document.querySelector("#__container-phrases").appendChild(phraseEL);

            textarea.value = '';
            textarea.focus();
        }
    }    

}