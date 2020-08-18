<?php


namespace DavidGoraj\backend\handle;


class Response
{
    public function __construct(Request $request)
    {
        return $request;
    }
}