<?php


namespace DavidGoraj\handle;


use DavidGoraj\Helper\Controller\Action;

class Request
{
    static $data;

    public function __construct(Array $data)
    {
        self::$data = $data;
        Authentication::setUserManagement();
    }

    public static function handle()
    {
        Action::set(self::$data['action'], self::$data);
    }

    /**
     * @return array
     */
    public static function getData(): array
    {
        return self::$data;
    }
}