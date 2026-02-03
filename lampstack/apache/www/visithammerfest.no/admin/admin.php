<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header('Location: ../login.php');
    exit;
}
require_once('../render.php');
require_once('renderedit.php');
require_once('../function.php');
require_once('../header.php');
$con = connect();  

error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);


if (isset($_POST['addLink']))
{
	addLink($con);
}	
if (isset($_POST['updateLink']))
{
	updateLink($con, mysqli_real_escape_string($con, $_POST['id']), mysqli_real_escape_string($con, $_POST['head']), mysqli_real_escape_string($con, $_POST['url']));
}	
if (isset($_POST['deleteLink']))
{
	deleteLink($con, $_POST['id']);
}	
if (isset($_POST['addActivity']))
{
	addActivity($con, $_POST['type']);
}
if (isset($_POST['updateActivity']))
{
		$id = $_POST['id'];
		$newfile = "noimage";
		writeLog($con, $_SESSION["name"], "Updating activity with a new file image in the entry.");                   
	    $target_dir = "assets/images/uploads/";
	    $target_file = $target_dir . basename($_FILES["file"]["name"]);
	    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	    $fileid = addFile($con, $id, $imageFileType);
	    $target_file_new = $target_dir . "viten-" . $fileid . "." . $imageFileType;
	    writeLog($con, $_SESSION["name"], " Target file : " . $target_file_new . " ID : " . $id . " FILEID : " . $fileid . " Image filtype : " . $imageFileType);
 		$check = getimagesize($_FILES["file"]["tmp_name"]);
    	if($check !== false) 
    	{
        		writeLog($con, $_SESSION["name"],  "File is an image.". $check["mime"]); 
        		$uploadOk = 1;
    	} 
    	else 	
    	{
        		writeLog($con, $_SESSION["name"],  "File is not an image.");
        		$uploadOk = 0;
    	}
	    // Check if file already exists
	    if (file_exists($target_file_new)) 
	    {
	            writeLog($con, $_SESSION["name"],  "Sorry, file already exists.");
	            $uploadOk = 0;
	    }
	    if (!isset($fileid)) 
	    {
	            writeLog($con, $_SESSION["name"],  "Sorry, addfile failed.");
	            $uploadOk = 0;
	    }
	    // Check file size
	    if ($_FILES["file"]["size"] > 500000000000) 
	    {
	            writeLog($con, $_SESSION["name"],  "Sorry, your file is too large.");
	            $uploadOk = 0;
	    }
	    // Allow certain file formats
	    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" && $imageFileType != "pdf" && $imageFileType != "docx" && $imageFileType != "xlsx" ) 
	    {
	            writeLog($con, $_SESSION["name"],  "Sorry, only PDF, DOCX, XLSX, JPG, JPEG, PNG & GIF files are allowed.");
	            $uploadOk = 0;
	    }
	    // Check if $uploadOk is set to 0 by an error
	    if ($uploadOk == 0) 
	    {
	            writeLog($con, $_SESSION["name"],  "Sorry, your file was not uploaded.");
	            renderInfo("Problem med filen", "Det var problemer under opplasting, trolig er det filtypen som ikke kan leses, prøv et annet format.");
	    // if everything is ok, try to upload file
	    } 
	    else 
	    {
	            if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file_new)) 
	            {
	                    writeLog($con, $_SESSION["name"], "The file ". basename($_FILES["file"]["name"]). " has been uploaded.");
	                    $newfile = $target_file_new;
	            }
	            else 
	            {
	                    writeLog($con, $_SESSION["name"], "Sorry, there was an error uploading your file. " . $target_file_new . "  " . $_FILES["file"]["tmp_name"]);
	                    $newfile = "noimage";
	                    writeLog($con, $_SESSION["name"], "Noimage"); 
	            }
	    }     
	updateActivity($con, $_POST['id'], $_POST['type'], $_POST['head'], $_POST['link'], $_POST['body'], $newfile);
}		
if (isset($_POST['deleteActivity']))
{
	deleteActivity($con, $_POST['id']);
}	
if (isset($_POST['logout']))
{
	header("Location: logout.php");
}

if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) 
{ 
	if (isset($_GET['mode']) && $_GET['mode'] === "subscribers")  
	{
		getSubscribers($con);
	}
	if (isset($_GET['mode']) && $_GET['mode'] === "kurs")  
	{
		renderEditactivity($con, "undervisning");
	}
	elseif (isset($_GET['mode']) && $_GET['mode'] === "fritid")  
	{
		renderEditactivity($con, "fritid");
		renderLogout();
	}
	elseif (isset($_GET['mode']) && $_GET['mode'] === "sommerskole")  
	{
		
		renderEditactivity($con, "sommerskole");
		renderLogout();
	}
	elseif (isset($_GET['mode']) && $_GET['mode'] === "omoss")  
	{
		renderEditabout($con);
	}
	else 
	{	
		renderLogout();
		renderEditmenu($con);
		renderEditactivity($con, "fritid");
		renderEditactivity($con, "sommerskole");
		renderEditlinks($con);
		renderLogout();
	}
	

} 	
else 
{ 
	renderLogin();
}
?>
