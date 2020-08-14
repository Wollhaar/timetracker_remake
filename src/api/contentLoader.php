<?php
use DavidGoraj\backend\Helper\Controller\Handler;
use DavidGoraj\backend\handle\Request;
use DavidGoraj\backend\handle\Authentication;

require '../config.php';

//$handle = Handler::handleRequest($_REQUEST);

$post = $_POST;
switch ($post['content']) {
    case 'login':
        include __DIR__ . '/../frontend/templates/login.html';
        break;
    case 'register':
        include __DIR__ . '/../frontend/templates/register.html';
        break;
    case 'dashboard':
        include __DIR__ . '/../frontend/templates/dashboard.html';
        break;
    case 'balance':
        include __DIR__ . '/../frontend/templates/balance.html';
        break;
    default:
//        $user = Authentication::status();
        include __DIR__ . '/../frontend/templates/home.html';
}

die;