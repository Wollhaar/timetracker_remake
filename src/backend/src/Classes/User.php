<?php


namespace DavidGoraj\Classes;


class User
{
    private $id;
    private $username;
    private $password_hash;
    private $email;
    private $last_name;
    private $first_name;
    private $employee_nr;
    private $hired;
    private $status;
    private $default_landing;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @return string
     */
    public function getPasswordHash()
    {
        return $this->password_hash;
    }

    /**
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getLastname()
    {
        return $this->last_name;
    }

    /**
     * @return string
     */
    public function getFirstname()
    {
        return $this->first_name;
    }

    /**
     * @return int
     */
    public function getEmployeeNr()
    {
        return $this->employee_nr;
    }

    /**
     * @return string
     */
    public function getHired()
    {
        return $this->hired;
    }

    /**
     * @return int
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @return array
     */
    public function getSummary(): array
    {
        return array(
            'id' => $this->id,
            'username' => $this->getUsername(),
            'email' => $this->email,
            'last_name' => $this->last_name,
            'first_name' => $this->first_name,
            'employee_nr' => $this->employee_nr,
            'hired' => $this->hired,
            'status' => $this->status,
            'default_landing' => $this->default_landing,
        );
    }

    /**
     * @param array $data
     */
    public function setData(Array $data)
    {
        $this->id = $data['id'] ?? null;
        $this->username = $data['username'] ?? null;
        $this->email = $data['email'] ?? null;
        $this->last_name = $data['last_name'] ?? null;
        $this->first_name = $data['first_name'] ?? null;
        $this->employee_nr = $data['employee_nr'] ?? null;
        $this->hired = $data['hired'] ?? null;
        $this->status = $data['status'] ?? null;
        $this->default_landing = $data['default_landing'] ?? null;
    }

    /**
     * @param String $data
     */
    public function setPasswordHash(String $data)
    {
        $this->password_hash = $data;
    }
}