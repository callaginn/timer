const drums = new Howl({
    "src": [
        "./sounds/drums.webm",
        "./sounds/drums.mp3"
    ],
    "sprite": {
        "clap": [
            0,
            734.2630385487529
        ],
        "closed-hihat": [
            2000,
            445.94104308390035
        ],
        "crash": [
            4000,
            1978.6848072562354
        ],
        "kick": [
            7000,
            553.0839002267571
        ],
        "open-hihat": [
            9000,
            962.7664399092968
        ],
        "snare": [
            11000,
            354.48979591836684
        ]
    }
});

/*/ ============================================================================
    DRUM LOOP TEST
============================================================================ /*/

function playSound() {
    setInterval(() => drums.play('kick'), 500);
    setInterval(() => drums.play('snare'), 1000);
    setInterval(() => drums.play('closed-hihat'), 250);
}

function stopSound() {
    location.reload();
}


/*/ ============================================================================
    TIMER DRIFT
============================================================================ /*/

let timeout;

function startTest() {
    console.log("Started!");
    const startTime = Date.now();
    let totalTime = 0;
    const round = () => {
        timeout = setTimeout(() => {
            // Increment Total Time
            totalTime += 1000;

            var elapsedTime = Date.now() - startTime;
            console.log('Total drift', elapsedTime - totalTime);

            // Rerun
            round();
        }, 1000);
    }

    round();
}

function stopTest() {
    console.log("Stopped!");
    clearTimeout(timeout);
}


/*/ ============================================================================
    DRIFTLESS TIMER
============================================================================ /*/

function TimerDemo(callback, timeInterval, errorCallback) {
    this.timeInterval = timeInterval;

    // Start Timer
    this.start = () => {
        // Expected time it should take...
        this.expected = Date.now() + this.timeInterval;
        this.timeout = setTimeout(this.round, this.timeInterval);
        console.log("Started!");
    }

    // Stop Timer
    this.stop = () => {
        clearTimeout(this.timeout);
        console.log("Stopped!");
    }

    // Run Callback with Adjusted Time Interval
    this.round = () => {
        let drift = Date.now() - this.expected;

        callback();

        this.expected += this.timeInterval;
        console.log(drift);
        console.log(this.timeInterval - drift);

        // Check if drift is greater than time interval and run error callback
        if (drift > timeInterval) {
            if (errorCallback) errorCallback();

            console.error("Drift is greater than the time interval! Catching Up!");
            this.timeout = setTimeout(this.round, 0);
        } else {
            this.timeout = setTimeout(this.round, this.timeInterval - drift);
        }
    }
}

function Timer(callback, timeInterval, errorCallback) {
    this.timeInterval = timeInterval;

    // Start Timer
    this.start = () => {
        this.expected = Date.now() + this.timeInterval;
        this.timeout = setTimeout(this.round, this.timeInterval);
    }

    // Stop Timer
    this.stop = () => clearTimeout(this.timeout);

    // Run Callback with Adjusted Time Interval
    this.round = () => {
        let drift = Date.now() - this.expected;

        callback();

        this.expected += this.timeInterval;

        // Check if drift is greater than time interval and run error callback
        if (drift > timeInterval) {
            if (errorCallback) errorCallback();

            console.error("Drift is greater than the time interval! Catching Up!");
            this.timeout = setTimeout(this.round, 0);
        } else {
            this.timeout = setTimeout(this.round, this.timeInterval - drift);
        }
    }
}

const myTimer = new TimerDemo(() => {
    console.log("It Ran!")
}, 250, () => {
    console.error("Error!");
});


/*/ ============================================================================
    DRIFTLESS DRUM LOOPS
============================================================================ /*/

const kick = new Timer(() => drums.play('kick'), 500);
const snare = new Timer(() => drums.play('snare'), 1000);
const hihat = new Timer(() => drums.play('closed-hihat'), 250);

function startDriftlessDrums() {
    kick.start();
    snare.start();
    hihat.start();
}

function stopDriftlessDrums() {
    kick.stop();
    snare.stop();
    hihat.stop();
}


/*/ ============================================================================
    DRUM SEQUENCER
============================================================================ /*/

const drumTracks = [
    {
        sampleName: 'kick',
        trackMatrix: [1,0,0,0,  0,0,0,0,    1,0,1,0,    0,0,0,0]
    },
    {
        sampleName: 'snare',
        trackMatrix: [0,0,0,0,  1,0,0,0,    0,0,0,0,    1,0,0,0]
    },
    {
        sampleName: 'closed-hihat',
        trackMatrix: [1,0,1,0,  1,0,1,0,    1,0,1,0,    1,0,1,0]
    },
    {
        sampleName: 'clap',
        trackMatrix: [0,0,0,0,  1,0,0,0,    0,0,0,0,    1,0,1,0]
    }
];

// 1 minute = 60,000 ms
// 60,000 / BPM = duration of quarter note
// 60,000 / BPM / 4
let bpm = 120;
let msTempo = (60000 / bpm) / 4;
let i = 0;

const sequencer = new Timer(() => {
    if (i == 16) i = 0;

    drumTracks.forEach(track => {
        if (track.trackMatrix[i]) drums.play(track.sampleName);
    });

    i++;
}, msTempo);
