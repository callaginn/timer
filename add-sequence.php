<?php

    $file = 'assets/data/presets.json';

    $presets = json_decode(file_get_contents('assets/data/presets.json'), true);
    $presets[] = json_decode(file_get_contents('php://input'), true);
    $json = json_encode($presets, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);

    // Save Changes to File
	file_put_contents($file, $json);

    header('Content-Type: application/json');
    print $json;
