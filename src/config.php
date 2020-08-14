<?php

try {
    $loader = require __DIR__ . '/vendor/autoload.php';
    //$loader->addPSR4('DavidGoraj\\backend\\Helper\\Controller\\', __DIR__);
}
catch (Exception $e) {
    echo 'Could´nt load Autoloader. Please contact Support! Error: ' . $e->getMessage();
}