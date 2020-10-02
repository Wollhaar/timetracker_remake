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
                var_dump(self::$data);
                UserController::registerUser(self::$data);
                Authentication::fillCredentials(self::$data);
                Authentication::login();
                break;
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