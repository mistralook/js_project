class Timer {
    constructor(duration) {
        this.duration = duration;
        this.now = Date.now;
        this.end = Date.now;
    }

    displayCountdown() {
        const count = parseInt((this.end - this.now()) / 1000);
        const timer = document.getElementById("timer");
        timer.textContent =
            count > 0 ? (window.requestAnimationFrame(() => this.displayCountdown()), count) : 0;
    }

    start() {
        this.end = this.now() + this.duration;
        window.requestAnimationFrame(() => this.displayCountdown());
    }

    stop() {
        this.end = this.now;
    }
}
export default Timer;