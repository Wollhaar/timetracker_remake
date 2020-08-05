<?php


namespace DavidGoraj\backend\handle;


class Session
{
    static $id;

    public function __construct()
    {
        $this->createSession();
        if (empty(self::$id)) self::$id = session_id();

        if (session_status() === PHP_SESSION_ACTIVE) {
            return true;
        }
        return false;
    }

    /**
     * @return string
     */
    public static function getId(): string
    {
        return self::$id;
    }

    public function createSession()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            $session = session_start();
            if (!$session) {
                $this->createSession();
            }
        }
    }

    /**
     * @param mixed $input
     * @param string $index
     */
    public static function inputSession($input, String $index): void
    {
        $_SESSION[$index] = $input;
    }
}