let presets, instruments, drums, sequencer, drumTracks;

buildLayout();

document.addEventListener("DOMContentLoaded", async () => {
    async function loadJSON(url) {
    	return (await fetch(url)).json();
    }

    instruments = await loadJSON('/assets/data/instruments.json'),
    drums = new Howl(instruments),
    presets = await loadJSON('/assets/data/presets.json');

    // Set Up Drum Sequencer
    drumTracks = presets[0].tracks;
    let i = 0;

    sequencer = new Timer(() => {
        if (i == 16) i = 0;

        drumTracks.forEach(track => {
            if (track.notes[i]) drums.play(track.name);
        });

        i++;
    }, getTempo());

    //<li><button type="button" class="dropdown-item" onclick="loadPreset(1)">Preset #1</button></li>
    //<li><button type="button" class="dropdown-item" onclick="loadPreset(2)">Preset #2</button></li>
    //<li><hr class="dropdown-divider"></li>
    //<li><button type="button" class="dropdown-item" onclick="location.reload()">Reset Tracks</button></li>

    // Load Presets into Dropdown
    var presetDropdown = document.getElementById("presetDropdown"),
        presetItems = ``;

    presets.forEach((preset, i) => {
        if (i > 0) {
            presetItems += `<li><button type="button" class="dropdown-item" onclick="loadPreset(${i})">${preset.name}</button></li>`;
        }
    });

    presetItems += '<li><hr class="dropdown-divider"></li>';
    presetItems += '<li><button type="button" class="dropdown-item" onclick="location.reload()">Reset Tracks</button></li>';
    presetDropdown.insertAdjacentHTML('beforeend', presetItems);

    // Load Preset Data into Modal
    var modalPreset = document.getElementById('modalPreset');

    modalPreset.addEventListener('show.bs.modal', e => {
        var modal = e.target,
            button = e.relatedTarget;

        // Update the modal's content
        modal.querySelector('.modal-title').textContent = "Your Preset";
        modal.querySelector('.modal-body code').textContent = getSequenceValues();
    });
});
