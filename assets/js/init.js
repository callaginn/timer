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

    // Load Presets into Dropdown
    loadPresetDropdown(presets);
});
