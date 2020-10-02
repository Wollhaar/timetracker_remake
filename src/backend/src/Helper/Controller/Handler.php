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
            self::$session = array('id' => Session::id());

            self::$request = new Request($parameters['data']);
            self::$request->call();

            self::$session['authenticated'] = Session::load('authenticated');

        }
    }

    public static function prepareToRespond()
    {
        $response = new Response();
        $response->fill(self::$session, 'session');
        $response->fill(Session::load('user'), 'user');
        $response->fill(Request::getData(), 'request');
        $response->encode();

        return $response;
    }
}