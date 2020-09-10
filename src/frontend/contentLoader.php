<?php

$post = $_POST;
switch ($post['content']) {
    case 'login':
        include 'templates/login.html';
        break;
    case 'register':
        include 'templates/register.html';
        break;
    case 'dashboard':
        include 'templates/dashboard.html';
        break;
    case 'balance':
        include 'templates/balance.html';
        break;
    default:
        include 'templates/home.html'; // TODO: CURL
}
die;