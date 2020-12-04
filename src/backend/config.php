<?php

try {
    $loader = require __DIR__ . '/vendor/autoload.php';
    //$loader->addPSR4('DavidGoraj\\backend\\Helper\\Controller\\', __DIR__);
}
catch (Exception $e) {
    echo 'Could´nt load Autoloader. Please contact Support! Error: ' . $e->getMessage();
}



define('INACTIV', 0);
define('EMPLOYEE', 1);
define('COM_ADMIN', 7);
define('CHEF', 8);
define('ADMIN', 9);

define('DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);

global $months;
$months = array(
    1 => array('full' => 'Januar'),
    2 => array('full' => 'Februar'),
    3 => array('full' => 'März'),
    4 => array('full' => 'April'),
    5 => array('full' => 'Mai'),
    6 => array('full' => 'Juni'),
    7 => array('full' => 'Juli'),
    8 => array('full' => 'August'),
    9 => array('full' => 'September'),
    10 => array('full' => 'Oktober'),
    11 => array('full' => 'November'),
    12 => array('full' => 'Dezember')
);

foreach($months AS $key => $month) {
    $months[$key]['short'] = substr($month['full'], 0, 3);
}