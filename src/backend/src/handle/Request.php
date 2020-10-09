<?php


namespace DavidGoraj\handle;


use DavidGoraj\Helper\Controller\UserController;

class Request
{
    static $data;

    public function __construct(Array $data)
    {
        self::$data = $data;
        Authentication::setUserManagement();
    }

    public function call()
    {
        switch (self::$data['action'] ?? '') {
            case 'login':
                Authentication::fillCredentials(self::$data);
                Authentication::login();
                break;

            case 'logout':
                Authentication::destroy();
                self::$data = null;
                break;

            case 'register':
                UserController::registerUser(self::$data);
                Authentication::fillCredentials(self::$data);
                Authentication::login();
                break;

            case 'check_session':
                if (empty(Authentication::$auth)) {
                    echo 'request:' . json_encode(self::$data);
                    die ('{
                        "session": {
                            "authenticated": false
                        }
                        "error": {
                            "code": "E121",
                            "message": "Session not authenticated."
                        }
                    }');
                }
                break;

            default:
                Session::save(array('error' =>
                    array(
                        'code' => 'E120',
                        'action' => 'none',
                        'message' => 'Action got not set')
                ), 'user');
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