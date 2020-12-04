<?php


namespace DavidGoraj\Helper\Controller;


use DavidGoraj\Classes\User;
use DavidGoraj\handle\Authentication;
use DavidGoraj\handle\Session;
use DavidGoraj\Helper\Documentation;

class Action
{
    static $what;
    static $handle = array();
    static $result = array();

    public static function set(String $action, $data = array())
    {
        self::$what = $action;
        self::$handle = array_merge(self::$handle, $data);
    }

    public static function call()
    {
        switch (self::$what ?? '') {
            case 'login':
                Authentication::fillCredentials(self::$handle);
                Authentication::login();

                if (Authentication::$auth) {
                    self::getTracks();
                }
                break;

            case 'logout':
                Authentication::destroy();
                break;

            case 'register':
                $admin = new User();
                $admin->setData(Session::load('user'));

                if (Authentication::checkAuthorization($admin))
                    UserController::registerUser(self::$handle);
                break;

            case 'check_session':
                if (Session::load('session')['authenticated'] !== true) {
                    Session::save(array ('load' => 'home'), 'action');
                    Session::save(array (), 'user');

                    Session::save(array (
                        'code' => 'E121',
                        'message' => 'Session not authenticated.'
                    ), 'error');

                    Session::save(self::$handle, 'request');
                }
                else {
                    Authentication::$auth = true;
                    self::getTracks();
                    Session::save(array('load' => 'default'), 'action');
                }
                break;

            case 'track':
                $user = new User();
                $user->setData(Session::load('user'));

                TimeController::setUser($user);
                self::$result['tracked'] = TimeController::newStamp(self::$handle);
                self::$result['tracking_list'] = TimeController::getTracking('today');

                Session::save(array('load' => 'default'), 'action');
                break;

            case 'tracking_list':
                $user = new User();
                $user->setData(Session::load('user'));
                TimeController::setUser($user);

                self::$result['tracking_list'] = TimeController::getAllTracks();
                Session::save(array_merge(
                    Session::load('action'),
                    array('load' => 'balance')
                ), 'action');
                break;

            case 'update_track':
                $user = new User();
                $user->setData(Session::load('user'));

                TimeController::setUser($user);
                self::$result['updated'] = TimeController::updateTime(self::$handle);
                self::getTracks();

                Session::save(array_merge(
                    Session::load('action'),
                    array('update' => 'tracking')
                ), 'action');
                break;

            case 'delete_track':
                $user = new User();
                $user->setData(Session::load('user'));

                TimeController::setUser($user);
                self::$result['deleted'] = TimeController::delete(self::$handle['id']);
                self::getTracks();

                Session::save(array_merge(
                    Session::load('action'),
                    array('update' => 'tracking')
                ), 'action');
                break;

            case 'document':
                $user = new User();
                $user->setData(Session::load('user'));

                $docu = new Documentation(self::$handle['area'], $user);

                $docu->prepare();
                $docu->fill(self::$handle['time_list']);

                self::$result['created']['docu'] = $docu->create();

                Session::save(array_merge(
                    Session::load('action'),
                    array('call' => 'docu')),
                'action');

                self::$what = 'tracking_list';
                self::call();
                break;

            default:
                Session::save(array(
                    'code' => 'E120',
                    'action' => self::$what ?? 'none',
                    'message' => 'Action got not found'
                ), 'error');
        }
    }

    public static function getResults(): array
    {
        return self::$result;
    }

    public static function getResultsOfAction(): array
    {
        return self::$result[self::$what] ?? array();
    }

    public static function getTracks()
    {
        $user = new User();
        $user->setData(Session::load('user'));

        TimeController::setUser($user);
        self::$result['tracking_list'] = TimeController::getTracking('today');
    }
}