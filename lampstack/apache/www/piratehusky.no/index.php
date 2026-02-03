<?php
session_start();
require_once('render.php');
require_once('function.php');
require_once('header.php');

error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set('display_startup_errors', 1);
$con = connect();  



if (isset($_GET['page']) && $_GET['page'] === "about") 
{
	renderBanner($con, $language);
	renderAbout($con, $language);
	renderContact($con, $language);
	renderGuides($con, $language);
	renderDogs($con, $language);
}
elseif (isset($_GET['page']) && $_GET['page'] === "accommodation")  
{
	renderAccommodation($con, $language);
}
elseif (isset($_GET['page']) && $_GET['page'] === "activity")  
{
	renderActivity($con, $language);
}
elseif (isset($_GET['page']) && $_GET['page'] === "expedition")  
{
	renderExpedition($con, $language, $type);
	renderContact($con, $language);
}
elseif (isset($_GET['page']) && $_GET['page'] === "contact")  
{
	renderContact($con, $language);
}
elseif (isset($_GET['page']) && $_GET['page'] === "sustainability")  
{
	renderSustainability($con, $language);
}
else 
{	
	renderBanner($con, $language);
	renderAbout($con, $language);
	renderContact($con, $language);
	renderGuides($con, $language);
	renderDogs($con, $language);
}

require_once('footer.php');
?>