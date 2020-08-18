<?php

require_once 'vendor/autoload.php';

echo \DavidGoraj\backend\handle\Authentication::$auth;

require 'config.php';

if (isset($_GET) || isset($_POST)) $request = $_REQUEST;

if (!is_string($request)) $request = json_encode(array_merge_recursive($_REQUEST, Array('load' => 'content', 'nix')));
//$handle = Handler::handleRequest($request);