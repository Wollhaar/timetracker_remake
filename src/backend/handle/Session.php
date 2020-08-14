<?php

namespace DavidGoraj\backend\handle;

class Session
{
    public static function createSession(String $id = null)
    {
        session_id($id);
        session_start();
    }

    /**
     * @param mixed $input
     * @param string $index
     */
    public static function save($input, String $index): void
    {
        $_SESSION[$index] = $input;
    }

    /**
     * @param String $index
     * @return mixed|null
     */
    public static function load(String $index)
    {
        return $_SESSION[$index] ?? null;
    }

    public static function id(): string {
        return session_id();
    }

    public static function loadTestObject(String $index): Session
    {
        if (isset($_SESSION[$index]) && $_SESSION[$index] instanceof Session) {
            return $_SESSION[$index];
        }

        //return new Session();
    }
}