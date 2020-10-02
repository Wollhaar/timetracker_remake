<?php


namespace DavidGoraj\Classes;


class User
{
    private $id = null;
    private $username = null;
    private $password_hash = null;
    private $email = null;
    private $employee_nr = null;
    private $hired = null;
    private $status = null;

    /**
     * @return null
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return null
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @return null
     */
    public function getPasswordHash()
    {
        return $this->password_hash;
    }

    /**
     * @return null
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @return null
     */
    public function getEmployeeNr()
    {
        return $this->employee_nr;
    }

    /**
     * @return null
     */
    public function getHired()
    {
        return $this->hired;
    }

    /**
     * @return null
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
            'username' => $this->username,
            'email' => $this->email,
            'employee_nr' => $this->employee_nr,
            'hired' => $this->hired,
            'status' => $this->status,
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
        $this->employee_nr = $data['employee_nr'] ?? null;
        $this->hired = $data['hired'] ?? null;
        $this->status = $data['status'] ?? null;
    }

    /**
     * @param String $data
     */
    public function setPasswordHash(String $data)
    {
        $this->password_hash = $data;
    }
}