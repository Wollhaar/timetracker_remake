<?php
use DavidGoraj\Helper\Controller\Handler;
require '../config.php';

Handler::handleRequest(json_encode($_REQUEST));
$response = Handler::prepareToRespond();

$response->output();