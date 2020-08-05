<?php

if (session_status() === PHP_SESSION_ACTIVE) {
    $session = new RequestController();
}

include 'frontend/frontpage.html';