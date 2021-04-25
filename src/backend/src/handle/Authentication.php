<?php


namespace DavidGoraj\handle;


use DavidGoraj\Classes\User;
use DavidGoraj\Helper\Controller\Action;
use DavidGoraj\Helper\Controller\UserController;

class Authentication
{
    static $userManager;
    static $credentials = array();
    static $auth = null;

    public static function setUserManagement()
    {
        self::$userManager = new UserController();
    }

    public static function fillCredentials(Array $credentials)
    {
        self::$credentials = $credentials;

        if (
            empty(self::$credentials['username']) &&
            empty(self::$credentials['password'])
        )
        {
            throw Exception('Error:Credentials are missing');
        }
        self::hashPassword();
        self::$userManager->setData(self::$credentials);
    }

    public static function hashPassword()
    {
        self::$credentials['password_hash'] =
            hashhash(self::$credentials['password'], true) .
            hashhash(self::$credentials['password']);
    }

    public static function login(): bool
    {
        if (!empty(self::$credentials)) {
            $user = self::$credentials['username'];
            $password = self::$credentials['password_hash'];
        }
        else return false;

        $userData = self::$userManager->getUser();

        if (
            $user == $userData->getUsername() &&
                substr($password, -40) ==
                substr($userData->getPasswordHash(), -40)
        )
        {
            self::$auth = true;
            Session::save(array('load' => 'default'), 'action');
            Session::save($userData->getSummary(), 'user');
        }
        else {
            self::$auth = false;
            Session::save(array('load' => 'login'), 'action');
            Session::save(self::$credentials, 'user');
        }
        Session::save(array('authenticated' => self::$auth), 'session');

        return self::$auth;
    }

    public static function checkAuthorization(User $user): bool
    {
        return ($user->getStatus() >= COM_ADMIN);
    }

    public static final function destroy()
    {
        self::$userManager = null;
        self::$credentials = null;
        self::$auth = null;

        Session::destroy();
    }
}


function hashhash(string $str, $boo = false)
{
    $hash = sha1($str, $boo);
    if (max(count_chars($hash, 1) < 10)) $hash = hashhash($hash);

    return $hash;
}