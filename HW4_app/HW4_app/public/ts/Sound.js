var Sound = (function () {
    function Sound() {
    }
    Sound.init = function () {
        Sound.Fire = new Audio('sound/fire.wav');
        Sound.Fire.volume = 0.5;
        Sound.Hit = new Audio('sound/explosion.wav');
        Sound.Hit.volume = 0.66;
        Sound.Sell = new Audio('sound/sell.ogg');
        Sound.Buy = new Audio('sound/buy.ogg');
        Sound.No = new Audio('sound/no.mp3');
        Sound.Death = new Audio('sound/death.ogg');
        Sound.Death.volume = 0.3;
        Sound.Music = new Audio('sound/music.mp3');
        Sound.Music.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        Sound.Music.volume = 0.66;
        Sound.Music.play();
    };
    return Sound;
}());
//# sourceMappingURL=Sound.js.map