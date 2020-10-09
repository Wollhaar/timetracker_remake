<?php
use DavidGoraj\Helper\Controller\Handler;


require '../config.php';

$request = $_REQUEST;
$post = $_POST;

if (!is_string($request))$request = json_encode($request);

Handler::handleRequest($request);
$response = Handler::prepareToRespond();

$response->output();