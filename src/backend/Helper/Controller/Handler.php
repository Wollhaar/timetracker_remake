<?php


namespace DavidGoraj\backend\Helper\Controller;


class Handler
{
    public function handleRequest(String $parameters)
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            $session = new RequestController();
        }


        $parameters = json_decode($parameters);
    }
}