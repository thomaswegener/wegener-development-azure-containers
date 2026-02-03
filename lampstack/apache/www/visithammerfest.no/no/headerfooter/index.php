<?php
session_start();
require_once('../../render.php');
require_once('../../function.php');
require_once('../../header.php');
error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);
$con = connect();  

	renderBooking($con, "no");

require_once('../../footer.php');
?>