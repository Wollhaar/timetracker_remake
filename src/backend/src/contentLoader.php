<?php
use DavidGoraj\backend\Helper\Controller\Handler;
use DavidGoraj\backend\handle\Request;
use DavidGoraj\backend\handle\Authentication;

require '../config.php';

//$handle = Handler::handleRequest($_REQUEST);

$post = $_POST;
$post = $_REQUEST;
switch ($post['content']) {
    case 'login':
        include 'http://virtualhosttest:8080/templates/login.html';
        break;
    case 'register':
        include 'virtualhosttest:8080/templates/register.html';
        break;
    case 'dashboard':
        include 'http://virtualhosttest:8080/templates/dashboard.html';
        break;
    case 'balance':
        include 'http://virtualhpsttest:8080/templates/balance.html';
        break;
    default:
//        $user = Authentication::status();
        include 'http://virtualhosttest:8080/templates/home.html';
}

die;