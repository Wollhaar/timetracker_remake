<?php


namespace DavidGoraj\backend\handle;


class Authentication
{
    private $credentials = array();
    private $user = array();

    private $auth = false;
    private $db_Conn;

    public function __construct()
    {
        $this->createAuthSession();
    }

    public function createAuthSession()
    {
        Session::createSession();
        $this->db_Conn = new Database();
    }

    public function fillCredentials(Array $credentials)
    {
        if (isset($credentials['username'])) {
            $this->credentials['username'] = $credentials['username'];
        }
        if (isset($credentials['email'])) {
            $this->credentials['email'] = $credentials['email'];
        }
        if (isset($credentials['password'])) {
            $this->credentials['password'] = $credentials['password'];
        }

        if ((
                empty($this->credentials['username']) ||
                empty($this->credentials['email'])) &&
            empty($this->credentials['password'])
        )
        {
            throw Exception('Error:Credentials are missing');
        }
    }

    public function login(String $user = '', String $password = ''): bool
    {
        if (empty($user) || empty($password)) {
            if (!empty($this->credentials)) {
                $user = $this->credentials['username'];
                $email = $this->credentials['email'];
                $password = $this->credentials['password'];
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
                $stmt = $this->db_Conn->mysqli_prepare($sql);
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
                    $this->user = $res;
                    $this->auth = true;
                }
            }
        }

        if ($this->auth) {
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
