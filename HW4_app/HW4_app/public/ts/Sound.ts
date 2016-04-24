﻿class Sound {
    static Fire: HTMLAudioElement;
    static Hit: HTMLAudioElement;
    static Sell: HTMLAudioElement;
    static Buy: HTMLAudioElement;
    static Death: HTMLAudioElement;
    static No: HTMLAudioElement;

    static Music:HTMLAudioElement;

    static init() {
        Sound.Fire = new Audio('sound/fire.ogg');
        Sound.Fire.volume = 0.75;
        Sound.Hit = new Audio('sound/explosion.wav');
        Sound.Sell = new Audio('sound/sell.ogg');
        Sound.Buy = new Audio('sound/buy.ogg');
        Sound.No = new Audio('sound/no.mp3');
        Sound.Death = new Audio('sound/death.ogg');
        Sound.Death.volume = 0.5;
        Sound.Music = new Audio('sound/music.mp3');

        Sound.Music.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        Sound.Music.volume = 0.75;
        Sound.Music.play();
    }

}