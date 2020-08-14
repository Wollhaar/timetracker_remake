<?php


namespace DavidGoraj\backend\handle;


class Database
{
    const host = 'database';
    const port = '3306';
    const database = 'timetracking';
    const user = 'david';
    const password = 'p123';

    static $connection = null;

    public function __construct()
    {
        return $this->getConnection();
    }

    /**
     * @return mixed
     */
    public static function getConnection()
    {
        if (empty(self::$connection)) {
            self::createConnection();
        }
        return self::$connection;
    }

    public static function createConnection()
    {
        self::$connection = mysqli_connect(
            self::host,
            self::user,
            self::password,
            self::database,
            self::port);
    }
}