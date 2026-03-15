// synthesized UI sounds using the Web Audio API, this is pretty cool
(function () {
    let _ctx = null;

    function ctx() {
        if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (_ctx.state === 'suspended') _ctx.resume();
        return _ctx;
    }

    // schedules a frequency/gain ramp on an AudioParam
    function ramp(param, from, to, duration, now) {
        param.setValueAtTime(from, now);
        param.exponentialRampToValueAtTime(Math.max(to, 0.0001), now + duration);
    }

    // short tick for mode toggle, general UI
    window.playClick = function () {
        const c = ctx(), now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(c.destination);
        ramp(osc.frequency, 1100, 700, 0.07, now);
        ramp(gain.gain, 0.12, 0.0001, 0.08, now);
        osc.start(now);
        osc.stop(now + 0.09);
    };

    // ascending sweep for page navigation
    window.playNavigate = function () {
        const c = ctx(), now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(c.destination);
        ramp(osc.frequency, 300, 540, 0.18, now);
        ramp(gain.gain, 0.1, 0.0001, 0.22, now);
        osc.start(now);
        osc.stop(now + 0.24);
    };

    // two-note ascending chirp for modal open
    window.playOpen = function () {
        const c = ctx(), now = c.currentTime;
        [[380, 560, 0.0], [560, 840, 0.07]].forEach(function (def) {
            const f0 = def[0], f1 = def[1], delay = def[2];
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(c.destination);
            ramp(osc.frequency, f0, f1, 0.1, now + delay);
            ramp(gain.gain, 0.1, 0.0001, 0.14, now + delay);
            osc.start(now + delay);
            osc.stop(now + delay + 0.16);
        });
    };

    // descending tone for modal close, back navigation
    window.playClose = function () {
        const c = ctx(), now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(c.destination);
        ramp(osc.frequency, 560, 300, 0.14, now);
        ramp(gain.gain, 0.1, 0.0001, 0.17, now);
        osc.start(now);
        osc.stop(now + 0.18);
    };

    // soft low tap for clicking empty/background areas
    window.playBackground = function () {
        const c = ctx(), now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(c.destination);
        ramp(osc.frequency, 180, 90, 0.08, now);
        ramp(gain.gain, 0.07, 0.0001, 0.1, now);
        osc.start(now);
        osc.stop(now + 0.11);
    };
}());
