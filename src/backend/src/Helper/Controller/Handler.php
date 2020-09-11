<?php


namespace DavidGoraj\Helper\Controller;


use DavidGoraj\handle\Response;
use DavidGoraj\handle\Request;
use DavidGoraj\handle\Session;

class Handler
{
    static $session = null;
    static $request = null;

    public static function handleRequest(String $parameters)
    {
        $parameters = json_decode($parameters, true);
        self::$session = $parameters['session_id'] ?? null;

        Session::create(self::$session);

        if (session_status() === PHP_SESSION_ACTIVE) {
            self::$request = new Request($parameters);
        }


        $response = new Response();
        $response->fill(Session::load('user'), 'user');
        $response->fill(Request::getData(), 'request');
        $response->encode();
        return $response->output();
    }
}