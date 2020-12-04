<?php

namespace DavidGoraj\handle;

class Session
{
    public static function create()
    {
        session_id('anbeca');
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
    public static function load(String $index): array
    {
        return $_SESSION[$index] ?? array();
    }

    public static function id(): string {
        return session_id();
    }

    /** destroying the session. Source: https://php.net/manual/en/function.session-destroy.php
     *
     */
    public static function destroy()
    {
        unset($_SESSION);

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }


    public static function status()
    {
        echo '{"status": "' .
            session_status() .
            '","session": "' .
            json_encode($_SESSION) .
            '","empty": "' .
            json_encode(empty($_SESSION['user']['id'])) .
            '"}';

    }

    public static function loadTestObject(String $index): Session
    {
        if (isset($_SESSION[$index]) && $_SESSION[$index] instanceof Session) {
            return $_SESSION[$index];
        }

        //return new Session();
    }
}