<?php


namespace DavidGoraj\backend\handle;


class Authentication
{
    static $credentials = array();
    static $user = array();
    static $db_Conn;
    static $auth = false;


    public function __construct()
    {
        $this->createAuthSession();
    }

    public function createAuthSession()
    {
        Session::create();
        self::$db_Conn = new Database();
    }

    public static function fillCredentials(Array $credentials)
    {
        if (isset($credentials)) {
            self::$credentials = $credentials;
        }

        if ((
                empty(self::$credentials['username']) ||
                empty(self::$credentials['email'])) &&
            empty(self::$credentials['password'])
        )
        {
            throw Exception('Error:Credentials are missing');
        }
    }

    public static function login(String $user = '', String $password = ''): bool
    {
        if (empty($user) || empty($password)) {
            if (!empty(self::$credentials)) {
                $user = self::$credentials['username'];
                $email = self::$credentials['email'];
                $password = self::$credentials['password'];
            }
            else return false;
        }

        if ((isset($user) || $email) && $password) {
            if (isset($user)) {
                $sql = "SELECT * FROM `users` WHERE username = ? AND password = ? LIMIT 1";
            }
            elseif (isset($email)) {
                $sql = "SELECT * FROM `users` WHERE email = ? AND password = ? LIMIT 1";
            }

            $password = password_hash($password, PASSWORD_BCRYPT);

            if (is_string($sql)) {
                $stmt = self::$db_Conn->mysqli_prepare($sql);
                $stmt->mysqli_stmt_bind_param('s', $user ? $user : $email);
                $stmt->mysqli_stmt_bind_param('s', $password);
                $res = $stmt->execute();

                if (
                    (
                        $user == $res['username'] ||
                        $email == $res['email']
                    ) &&
                    password_verify($password, $res['password'])
                )
                {
                    self::$user = $res;
                    self::$auth = true;
                }
            }
        }

        if (self::$auth) {
            return true;
        }
        return false;
    }
}

$auth = new Authentication();
echo json_encode($auth);

"CREATE TABLE `timetracking`.`users` ( 
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `username` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , 
    `password` CHAR(60) NOT NULL , 
    `email` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , 
    `employee_nr` INT(11) NULL , 
    `hired` DATE NULL , 
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    `status` TINYINT(2) NULL , 
    PRIMARY KEY (`id`) ,
    UNIQUE `users`(`username`) ,
    UNIQUE `email`(`email`)
) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin";

"CREATE TABLE `timetracking`.`user_timestamps` ( 
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    `type` TINYINT(2) NULL , 
    `start_stop` TINYINT(1) NULL , 
    `user_id` INT(11) UNSIGNED NOT NULL , 
    PRIMARY KEY (`id`) ,
    CONSTRAINT `FK_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin";
