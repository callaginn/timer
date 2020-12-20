/*/ ============================================================================
    DRIFTLESS TIMER
============================================================================ /*/

function Timer(callback, timeInterval, errorCallback) {
    this.timeInterval = timeInterval;

    this.setInterval = (interval) => {
        console.log(interval);
        console.log(Number(interval));
        this.timeInterval = Number(interval);
    }

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


/*/ ============================================================================
    DRUM SEQUENCER
============================================================================ /*/

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

var drumTracks = [
    {
        sampleName: 'closed-hihat',
        trackMatrix: [0,0,0,0,  0,0,0,0,    0,0,0,0,    0,0,0,0]
    },
    {
        sampleName: 'open-hihat',
        trackMatrix: [0,0,0,0,  0,0,0,0,    0,0,0,0,    0,0,0,0]
    },
    {
        sampleName: 'crash',
        trackMatrix: [0,0,0,0,  0,0,0,0,    0,0,0,0,    0,0,0,0]
    },
    {
        sampleName: 'snare',
        trackMatrix: [0,0,0,0,  0,0,0,0,    0,0,0,0,    0,0,0,0]
    },
    {
        sampleName: 'clap',
        trackMatrix: [0,0,0,0,  0,0,0,0,    0,0,0,0,    0,0,0,0]
    },
    {
        sampleName: 'kick',
        trackMatrix: [0,0,0,0,  0,0,0,0,    0,0,0,0,    0,0,0,0]
    }
];

function getTempo() {
    // 1 minute = 60,000 ms
    // 60,000 / BPM = duration of quarter note
    // 60,000 / BPM / 4

    let bpm = Number(document.querySelector('input[name="bpm"]').value);
    return (60000 / bpm) / 4;
}

let msTempo = getTempo();
let i = 0;

const sequencer = new Timer(() => {
    if (i == 16) i = 0;

    drumTracks.forEach(track => {
        if (track.trackMatrix[i]) drums.play(track.sampleName);
    });

    i++;
}, msTempo);

function toggleNote(input) {
    var track = input.closest(".track"),
        tracks = track.closest(".tracks"),
        columnID = [...track.querySelectorAll("input")].indexOf(input),
        rowID = [...tracks.querySelectorAll(".track")].indexOf(track),
        note = drumTracks[rowID].trackMatrix[columnID];

    console.log("Toggling Note: ", rowID, columnID);
    drumTracks[rowID].trackMatrix[columnID] = (note === 0) ? 1 : 0;
}
