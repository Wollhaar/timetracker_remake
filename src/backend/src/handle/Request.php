<?php


namespace DavidGoraj\handle;


use DavidGoraj\Classes\User;
use DavidGoraj\Helper\Controller\Timecontroller;
use DavidGoraj\Helper\Controller\UserController;

class Request
{
    static $data;
    static $timeManager;

    public function __construct(Array $data)
    {
        self::$data = $data;
        Authentication::setUserManagement();

        self::$timeManager = new Timecontroller();
    }

    public function call()
    {
        switch (self::$data['action'] ?? '') {
            case 'login':
                Authentication::fillCredentials(self::$data);
                Authentication::login();

                if (Authentication::$auth) {
                    self::$data['tracking_list'] = $this->getTracks();
                }
                break;

            case 'logout':
                Authentication::destroy();
                break;

            case 'register':
                $admin = new User();
                $admin->setData(Session::load('user'));

                if (Authentication::checkAuthorization($admin))
                    UserController::registerUser(self::$data);
                break;

            case 'check_session':
                if (Session::load('session')['authenticated'] !== true) {
                    Session::save(array ('load' => 'home'), 'action');
                    Session::save(array (), 'user');

                    Session::save(array (
                        'code' => 'E121',
                        'message' => 'Session not authenticated.'
                    ), 'error');

                    Session::save(self::$data, 'request');
                }
                else {
                    Authentication::$auth = true;
                    self::$data['tracking_list'] = $this->getTracks();
                    Session::save(array('load' => 'default'), 'action');
                }
                break;

            case 'track':
                $user = new User();
                $user->setData(Session::load('user'));

                self::$timeManager->setUser($user);
                self::$data['tracked'] = self::$timeManager::newStamp(self::$data);
                self::$data['tracking_list'] = self::$timeManager::getTracking('today');
                break;

            case 'tracking_list':
                $user = new User();
                $user->setData(Session::load('user'));
                self::$timeManager->setUser($user);

                self::$data['tracking_list'] = self::$timeManager::getAllTracks();
                Session::save(array('load' => 'balance'), 'action');
                break;

            case 'update_track':
                $user = new User();
                $user->setData(Session::load('user'));

                self::$timeManager->setUser($user);
                self::$data['updated'] = self::$timeManager::updateTime(self::$data);
                self::$data['tracking_list'] = $this->getTracks();

                Session::save(array_merge(
                    Session::load('action'),
                    array('update' => 'tracking')
                ), 'action');
                break;

            case 'delete_track':
                $user = new User();
                $user->setData(Session::load('user'));

                self::$timeManager->setUser($user);
                self::$data['deleted'] = self::$timeManager::delete(self::$data['id']);
                self::$data['tracking_list'] = $this->getTracks();

                Session::save(array_merge(
                    Session::load('action'),
                    array('update' => 'tracking')
                ), 'action');
                break;

            default:
                Session::save(array(
                        'code' => 'E120',
                        'action' => self::$data['action'] ?? 'none',
                        'message' => 'Action got not found'
                ), 'error');
        }
    }

    /**
     * @return array
     */
    public static function getData(): array
    {
        return self::$data;
    }

    /**
     * @return array
     */
    public function getTracks(): array
    {
        $user = new User();
        $user->setData(Session::load('user'));

        self::$timeManager->setUser($user);
        return self::$timeManager::getTracking('today');
    }
}