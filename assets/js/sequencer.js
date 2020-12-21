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

console.print = str => {
	console.log(JSON.stringify(str, null, 4));
};

function getTempo() {
    // 1 minute = 60,000 ms
    // 60,000 / BPM = duration of quarter note
    // 60,000 / BPM / 4

    let bpm = Number(document.querySelector('input[name="bpm"]').value);
    return (60000 / bpm) / 4;
}

function toggleNote(input) {
    var track = input.closest(".track"),
        tracks = track.closest(".tracks"),
        columnID = [...track.querySelectorAll("input")].indexOf(input),
        rowID = [...tracks.querySelectorAll(".track")].indexOf(track),
        note = drumTracks[rowID].notes[columnID];

    console.log("Toggling Note: ", rowID, columnID);
    drumTracks[rowID].notes[columnID] = (note === 0) ? 1 : 0;
}

function getSequenceValues() {
    var thisPreset = {
        "name": document.querySelector('input[name="preset-name"]').value || "Untitled Beat",
        "bpm": Number(document.querySelector('input[name="bpm"]').value),
        "tracks": drumTracks
    }

    var str = JSON.stringify(thisPreset, null, '\t');

    str.match(/"notes": [^\]]+]/gm).forEach((match, i) => {
        str = str.replaceAll(match, match.replaceAll(/\n\t+/gm, ''));
    });

    return str;
}


/*/ ========================================================================
    BUILD LAYOUT
======================================================================== /*/

function buildLayout() {
    document.querySelectorAll(".track .items").forEach((track, trackID) => {
        for (let i = 0; i < 4; i++) {
            var ids = [];

            for (let a = 0; a < 4; a++) ids.push(`input-${trackID}-${i * 4 + a}`);

            track.insertAdjacentHTML('beforeend', `<div class="col-md-6 col-lg-3 mb-3">
                <div class="btn-group w-100">
                    <input type="checkbox" class="btn-check" id="${ids[0]}" onchange="toggleNote(this)">
                    <label class="btn btn-outline-secondary w-100" for="${ids[0]}">${i*4+1}</label>

                    <input type="checkbox" class="btn-check" id="${ids[1]}" onchange="toggleNote(this)">
                    <label class="btn btn-outline-secondary w-100" for="${ids[1]}">${i*4+2}</label>

                    <input type="checkbox" class="btn-check" id="${ids[2]}" onchange="toggleNote(this)">
                    <label class="btn btn-outline-secondary w-100" for="${ids[2]}">${i*4+3}</label>

                    <input type="checkbox" class="btn-check" id="${ids[3]}" onchange="toggleNote(this)">
                    <label class="btn btn-outline-secondary w-100" for="${ids[3]}">${i*4+4}</label>
                </div>
            </div>`);
        };
    });
}

function loadPreset(i) {
    drumTracks = presets[i].tracks;

    console.log(drumTracks);

    drumTracks.forEach((track, t) => {
        track.notes.forEach((noteValue, n) => {
            console.log(`input-${t}-${n}`);
            var chkNote = document.getElementById(`input-${t}-${n}`),
                chkValue = Number(chkNote.checked);

            if (chkValue !== noteValue) {
                //chkNote.click();
                chkNote.checked = noteValue;
            }

            console.log(Number(chkNote.checked), noteValue);
        });

        //if (track.notes[i]) drums.play(track.name);
    });
}
