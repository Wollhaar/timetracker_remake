<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
{
    die();
}

$request = 'GET or POST not set.';

if (isset($_GET) || isset($_POST)) $request = $_REQUEST;

echo 'request: Dead end.';
echo 'Request-Data: ' . json_encode($request);
die;