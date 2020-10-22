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
                    self::$data['tracking_list'] =
                        self::$timeManager::getTracking('today');
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

                    self::$data['tracking_list'] =
                        self::$timeManager::getTracking('today');
                }
                break;

            case 'track':
//                TODO: control if user, is the one user who tracking
                $user = new User();
                $user->setData(Session::load('user'));

                self::$timeManager->setUser($user);
                self::$data['tracked'] = self::$timeManager::newStamp(self::$data);
                break;

            case 'tracking_list':
                $user = new User();
                $user->setData(Session::load('user'));

                self::$timeManager->setUser($user);
                self::$data['tracking_list'] =
                    self::$timeManager::getTracking(self::$data['tracking_area']);
                break;

            default:
                Session::save(array('error' =>
                    array(
                        'code' => 'E120',
                        'action' => 'none',
                        'message' => 'Action got not set')
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
}