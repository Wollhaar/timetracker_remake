<?php

echo 'This is timetracker´s document root. And now follows the output of some global variables:';

echo '<pre>';
echo 'Server-Output:';
var_export($_SERVER);
echo '<br/><br/>GET-Output';
var_export($_GET);
echo '<br/><br/>POST-Output';
var_export($_POST);
echo '</pre>';
