<?php


namespace DavidGoraj\handle;


class Database extends \mysqli
{
    const host = 'database';
    const port = '3306';
    const database = 'timetracking';
    const user = 'david';
    const password = 'p123';

    static $connection = null;

    public function __construct()
    {
        parent::__construct(
            self::host,
            self::user,
            self::password,
            self::database,
            self::port
        );

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
        self::$connection = self::class;
    }
}