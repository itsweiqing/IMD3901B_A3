AFRAME.registerComponent('timer', {
    schema: {
        countdown: {type: 'number', default: 30},
        gameMode: {type: 'string', default: 'compete'}
    },

    init: function () {
        this.el.addEventListener('startGame', () => {
            this.startCountdown();
        });
    },
    startCountdown: function () {
        this.data.countdown = 30;
        this.timerInterval = setInterval(() => {
            this.data.countdown--;
            this.el.setAttribute('text', 'value', `Time remaining: ${this.data.countdown}s`); // Corrected line
            if (this.data.countdown <= 0) {
                clearInterval(this.timerInterval);
                socket.emit('timerEnded', this.data.gameMode);
            }
        }, 1000);
    }
});