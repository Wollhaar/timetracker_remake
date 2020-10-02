<?php


namespace DavidGoraj\Helper\Controller;


use DavidGoraj\Classes\User;
use DavidGoraj\handle\Authentication;
use DavidGoraj\handle\Database;

class UserController
{
    static $database_connection;
    static $user = null;

    public function __construct()
    {
        self::$user = new User();

        if (!self::$database_connection) {
            self::$database_connection = new Database();
        }
    }

    public function setData($data)
    {
        self::$user->setData($data);
        self::$user->setPasswordHash($data['password_hash']);
    }

    public static function registerUser(Array $data)
    {
        if (
            empty($data['username']) ||
            empty($data['password']) ||
            empty($data['email'])
        ) {
            return false;
        }

        $sql = "INSERT INTO users (
                    `username`, 
                    `password`, 
                    `email`, 
                    `employee`, 
                    `hired`, 
                    `status`
                ) 
                
                VALUES (?,?,?,?,?,?)";

        $stmt = self::$database_connection->prepare($sql);
        $stmt->bind_param('s', $data['username']);
        $stmt->bind_param('s', $data['password_hash']);
        $stmt->bind_param('s', $data['email']);
        $stmt->bind_param('i', $data['employee_nr']);
        $stmt->bind_param('d', $data['hired']);
        $stmt->bind_param('i', $data['status']);
        $res = $stmt->execute();

        if ($res) {
            self::$user->setData($data);
        }
    }

    public function getUser()
    {
        if (empty(self::$user)) {
            return 'E201:No userdata set.';
        }
        else {
            $username = self::$user->getUsername();
            $email = self::$user->getEmail();
        }

        if (isset($username)) {
            $sql = "SELECT * FROM `users` WHERE username = ? LIMIT 1";
        }
        elseif (isset($email)) {
            $sql = "SELECT * FROM `users` WHERE email = ? LIMIT 1";
        }

        if (!empty($sql) && is_null(self::$database_connection->connect_error)) {
            $parameter = $username ?? $email;

            $stmt = self::$database_connection->prepare($sql);
            $stmt->bind_param('i', $parameter);
//            $stmt->fetch();
            $stmt->execute();

            $res = $stmt->get_result()->fetch_assoc();

            if ($res) {
                self::$user->setData($res);
                self::$user->setPasswordHash($res['password']);
            }
            else {
                self::$user = null;
            }
        }

        return self::$user;
    }

    public function setPassword()
    {
        if (empty(Authentication::$auth)) {
            return 'User not authenticated.';
        }
        $id = self::$user->getId();
        $password_hash = self::$user->getPasswordHash();

        if (empty($password_hash)) {
            return 'No password set.';
        }
        if (empty($id)) {
            return 'User not found.';
        }

        $sql = "UPDATE `users` SET password = ? WHERE id = ? LIMIT 1;
                SELECT password FROM `users` WHERE id = ? LIMIT 1";

        if (is_null(self::$database_connection->connect_error)) {
            $stmt = self::$database_connection->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->bind_param('s', $password_hash);
            $stmt->bind_param('i', $id);
            $stmt->execute();

            $res = $stmt->get_result()->fetch_assoc();

            if ($res['password'] === $password_hash) {
                self::$user->setPasswordHash($res['password']);
            }
        }

        return self::$user;
    }
}