<?php
#include '/usr/share/nmap/nmap-services';

$response = new \DavidGoraj\backend\handle\Response(new \DavidGoraj\backend\handle\Request());

echo json_encode($response);
?>

<!doctype html>
<html>
<head>
    <title>I bims</title>
</head>
<body>
<header><h1>Hello, ich bin eine Titelseite.</h1></header>
<div class="wrapper">
    <?php echo $_SERVER['DOCUMENT_ROOT']; ?>
    <p>Hello, ich bin ein wenig Content.</p>
</div>
<footer>Und ich bin der Footer</footer>
</body>
</html>