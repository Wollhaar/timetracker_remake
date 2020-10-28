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
                    $this->getTracks();
                }
                break;

            case 'logout':
                Authentication::destroy();
                self::$data = null;
                break;

            case 'register':
                $admin = new User();
                $admin->setData(Session::load('user'));
                echo 'user-status: ' .$admin->getStatus();

                if (Authentication::checkAuthorization($admin))
                    UserController::registerUser(self::$data);
                break;

            case 'check_session':
                if (empty(Session::load('user')['id'])) {
                    echo json_encode( array (
                        "session" => array (
                            "authenticated" => Authentication::$auth
                        ),
                        array (
                            "error" => array (
                                "code" => "E121",
                                "message" => "Session not authenticated."
                            )
                        ),
                        'request:' => self::$data
                    ));
                    die;
                }
                else {
                    Authentication::$auth = true;

                    self::$data['tracking_list'] = $this->getTracks();
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
                self::$data['tracking_list'] = $this->getTracks();
                break;

            default:
                Session::save(array('error' =>
                    array(
                        'code' => 'E120',
                        'action' => self::$data['action'] ?? 'none',
                        'message' => 'Action got not found')
                ), 'action');
                Session::save(UserController::$user->getSummary(), 'user');
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