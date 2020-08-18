<?php
use DavidGoraj\backend\Helper\Controller\Handler;
use DavidGoraj\backend\handle\Authentication;
use Composer\Autoload\ClassLoader;
use Composer\Autoload\ComposerStaticInitccbabb5e063932030fc4e8093c1ee763 as ComposerStaticInit;
use ComposerAutoloaderInitccbabb5e063932030fc4e8093c1ee763 as AutoLoader;


require '../config.php';

$loader = new ClassLoader();
$loader->addPSR4('DavidGoraj\\backend\\Helper\\Controller\\', '/var/www/html');
echo '; Ausgabe - Init: ' . json_encode(ComposerStaticInit::getInitializer($loader));
echo '; Ausgabe - InitMixed: ' . json_encode(call_user_func(ComposerStaticInit::getInitializer($loader)));
echo '; Ausgabe - Prefixes: ' . json_encode($loader->getPrefixesPsr4());
echo '; Ausgabe - Fallback: ' . json_encode($loader->getFallbackDirsPsr4());
echo '; Ausgabe - ClassMap: ' . json_encode($loader->getClassMap());
die;

$request = $_REQUEST;
$post = $_POST;


if (empty($request)) $request = array('parameter' => array('test' => 'test123'));
$handle = Handler::handleRequest($request);



if (!is_array($post)) $post = json_decode($post);

switch ($post['action'])
{
    case 'login':
        Authentication::fillCredentials($post);
        Authentication::login();

        if (Authentication::$auth) {
//            \DavidGoraj\backend\handle\Response::
        }
        break;
    case 'logout':
//        Authentication::destroy();
        break;
    case 'register':

        break;
}