<?php


namespace DavidGoraj\backend\handle;


class Authentication
{
    private $credentials = array();
    private $user = array();

    private $auth = false;
    private $token = null;

    private $db_Conn;

    public function __construct()
    {
        $this->createAuthSession();
    }

    public function createAuthSession(): void
    {
        session_start();

        $this->token = uniqid();
        $_SESSION['AUTH_TOKEN'] = $this->token;

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
                empty($this->credentials['username'])) &&
            empty($this->credentials['username'])
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
                    $password == $res['password']
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