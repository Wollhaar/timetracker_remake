<?php


namespace DavidGoraj\handle;


use DavidGoraj\Classes\User;
use DavidGoraj\Helper\Controller\UserController;

class Authentication
{
    static $userManager = null;
    static $credentials = array();
    static $auth = false;

    public static function setUserManagement()
    {
        self::$userManager = new UserController();
    }

    public static function fillCredentials(Array $credentials)
    {
        if (isset($credentials)) {
            self::$credentials = $credentials;
        }

        if (
            (
                empty(self::$credentials['username']) ||
                empty(self::$credentials['email'])
            ) &&
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
        self::$credentials['password_hash'] = password_hash(self::$credentials['password'], PASSWORD_BCRYPT);
        return self::$credentials['password_hash'];
    }

    public static function login(): bool
    {
        if (!empty(self::$credentials)) {
            $user = self::$credentials['username'];
            $email = self::$credentials['email'];
            $password = self::$credentials['password'];
        }
        else return false;

        $userData = self::$userManager->getUser();

        if (!is_null($userData) &&
            (
                $user == $userData->getUsername() ||
                $email == $userData->getEmail()
            ) &&
            password_verify($password, $userData->getPasswordHash())
        )
        {
            self::$auth = true;
            Session::save(array('load' => array('content' => 'default')), 'action');
            Session::save($userData->getSummary(), 'user');
        }
        else {
            self::$auth = false;
            Session::save(array('load' =>
                array(
                    'content' => 'login',
                    'login' => 'failed' // TODO: no need?
                )
            ),
                'action');
            Session::save(self::$credentials, 'user');
        }
        Session::save(self::$auth, 'authenticated');

        return self::$auth;
    }

    public static function checkAuthorization(User $user): bool
    {
        if ($user->getStatus() > COM_ADMIN) $auth = true;
        else $auth = false;

        return $auth;
    }

    public static final function destroy()
    {
        self::$userManager = null;
        self::$credentials = null;
        self::$auth = null;

        Session::destroy();
    }
}
