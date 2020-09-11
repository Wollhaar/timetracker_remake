<?php


namespace DavidGoraj\handle;


class Request
{
    static $data;

    public function __construct(Array $data)
    {
        self::$data = $data;
    }

    public function call()
    {
        switch (self::$data['action'] ?? '') {
            case 'login':
                Authentication::fillCredentials(self::$data);
                Authentication::login();

                if (Authentication::$auth) {
                    self::$data['user']['auth'] = Authentication::$auth;
                    self::$data['user']['user_data'] = Authentication::$user;

                    Session::save(self::$data['user_data'], 'user');
                }
                break;
            case 'logout':
                Authentication::destroy();
                self::$data = null;
                break;
            case 'register':

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