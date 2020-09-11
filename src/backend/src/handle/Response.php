<?php


namespace DavidGoraj\handle;


class Response
{
    private $data = array();

    public function fill(Array $data, String $purpose = null)
    {
        $this->data[$purpose] = $data;
    }

    public function encode()
    {
        $this->data = json_encode($this->data);
    }

    public function output()
    {
        return $this->data;
    }
}