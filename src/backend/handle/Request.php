<?php


namespace DavidGoraj\backend\handle;


class Request
{
    static $data;

    public function __construct(Array $data)
    {
        self::$data = $data;
    }

    public function resolve()
    {

    }
}