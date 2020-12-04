<?php
namespace DavidGoraj\Helper;

function formatTimeToHours($time)
{
    return round($time / 1000 / 60 / 60);
}