<?php

echo 'This is timetracker´s document root. And now follows the output of some global variables:';

echo '<pre>';
echo 'Server-Output:';
var_export($_SERVER);
echo 'GET-Output';
var_export($_SERVER);
echo 'POST-Output';
var_export($_SERVER);
echo '</pre>';
