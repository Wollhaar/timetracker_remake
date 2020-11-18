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

        Session::create();

        if ($parameters['data']['action'] == 'register')
            Session::save($parameters['data'], 'register_user');

        if (session_status() === PHP_SESSION_ACTIVE) {
            self::$session = array('id' => Session::id());

            self::$request = new Request($parameters['data']);
            self::$request->call();

            self::$session = array_merge(self::$session, Session::load('session'));

            if (empty(Session::id())) {
                self::$session = array(
                    'session' => 'destroyed',
                    'action' => array('load' => 'login')
                );
            }
        }
    }

    public static function prepareToRespond()
    {
        $response = new Response();
        $response->fill(self::$session, 'session');
        $response->fill(Request::getData(), 'request');

        if (session_status() === PHP_SESSION_ACTIVE) {
            $response->fill(Session::load('user'), 'user');
            $response->fill(Session::load('action'), 'action');
//        $response->fill(Request::$timeManager::$tracked, 'track');
//            $response->fill(Session::load('register_user'), 'register');

            if (!empty(Session::load('error')))
                $response->fill(Session::load('error'), 'error');
            if (!empty(Session::load('debug')))
                $response->fill(Session::load('debug'), 'debug');
        }
        $response->encode();

        return $response;
    }
}