<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header('Location: login.php');
    exit;
}
require_once('render.php');
require_once('renderedit.php');
require_once('function.php');
require_once('header.php');
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
if (isset($_POST['addPartner']))
{
	addPartner($con, $_POST['type']);
}
if (isset($_POST['addStore']))
{
  addStore($con, $_POST['type']);
}
if (isset($_POST['addArticle']))
{
	addArticle($con, $_POST['type']);
}
if (isset($_POST['addEmployee']))
{
	addEmployee($con, $_POST['type']);
}
if (isset($_POST['addFaq']))
{
	addFaq($con, $_POST['type']);
}


if (isset($_GET['deleteimage']))
{
    deleteImage($con, $_GET['page'], $_GET['deleteimage']);
    writeLog($con, $_SESSION["name"], "Have removed an image( ". $_GET['deleteimage'] ." ) from discrapancy " . $_GET['id']);
    header('Location: admin.php?page=' . $_GET['page'] .'&id='. $_GET['id'] . '');
}
if (isset($_POST['addImage']))
{
	$uploadsDir = 'assets/images/uploads/';
  	$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  	$maxFileSize = 50 * 1024 * 1024; // 50MB
  	$page = $_POST['page'];
  	$pageid = $_POST['id'];

  // Create the uploads directory if it doesn't exist
  if (!is_dir($uploadsDir)) 
  {
    mkdir($uploadsDir, 0777, true);
  }

  // Process each uploaded file
  $uploadedFiles = $_FILES['images'];
  $numFiles = count($uploadedFiles['name']);
  for ($i = 0; $i < $numFiles; $i++) {
    $fileName = $uploadedFiles['name'][$i];
    $fileTmpName = $uploadedFiles['tmp_name'][$i];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $fileSize = $uploadedFiles['size'][$i];

    // Check if the file extension is allowed
    if (in_array($fileExtension, $allowedExtensions)) 
    {
      // Check if the file size is within the limit
      if ($fileSize <= $maxFileSize) 
      {
        $newFileName = uniqid('image_') . '.' . $fileExtension;
        $destination = $uploadsDir . $newFileName;

        // Check if the file already exists in the destination directory
        if (file_exists($destination)) 
        {
          echo "File $fileName already exists.<br>";
        } 
        else 
        {
          // Move the uploaded file to the destination directory
          if (move_uploaded_file($fileTmpName, $destination)) 
          {
            // Insert file record in the database
            $insertQuery = "INSERT INTO `files`(`id`, `page`, `pageid`, `filename`, `photographer`) VALUES (null,'$page','$pageid','$newFileName',null)";
            if (mysqli_query($con, $insertQuery)) 
            {
              echo "File $fileName uploaded successfully.<br>";
            } 
            else 
            {
              echo "Failed to upload $fileName.<br>";
            }
          } 
          else 
          {
            echo "Failed to upload $fileName.<br>";
          }
        }
      } 
      else 
      {
        echo "File $fileName exceeds the maximum allowed size.<br>";
      }
    } 
    else 
    {
      echo "Invalid file extension for $fileName.<br>";
    }
  }
}
if (isset($_POST['updateImage']) && isset($_POST['photographer'])) {
    

    $id = htmlentities($_POST['updateImage']);
		$escaped_id = mysqli_real_escape_string($con, $id);
		$photographer = htmlentities($_POST['photographer']);
		$escaped_photographer = mysqli_real_escape_string($con, $photographer);
    updateImage($con, $escaped_id, $escaped_photographer);
}



if (isset($_POST['updateActivity']))
{
	$id = htmlentities($_POST['id']);
	$escaped_id = mysqli_real_escape_string($con, $id);
	$pid = htmlentities($_POST['pid'] ?? null);
	$escaped_pid = mysqli_real_escape_string($con, $pid);
	$active = htmlentities($_POST['active'] ?? null);
	$escaped_active = mysqli_real_escape_string($con, $active);	
	$name = htmlentities($_POST['name'] ?? null);
	$nname = htmlentities($_POST['nname'] ?? null);
	$short = htmlentities($_POST['short'] ?? null);
	$nshort = htmlentities($_POST['nshort'] ?? null);
	

	$selectedValuesCategory = $_POST['category'];
    $serializedValuesCategory = serialize($selectedValuesCategory);
    $escaped_category = mysqli_escape_string($con, $serializedValuesCategory);

    $selectedValuesSeason = $_POST['season'];
    $serializedValuesSeason = serialize($selectedValuesSeason);
    $escaped_season = mysqli_escape_string($con, $serializedValuesSeason);

    $selectedValuesLocation = $_POST['location'];
    $serializedValuesLocation = serialize($selectedValuesLocation);
    $escaped_location = mysqli_escape_string($con, $serializedValuesLocation);

    


	$map = htmlentities($_POST['map'] ?? null);
	$link = htmlentities($_POST['link'] ?? null);
	$capacity = htmlentities($_POST['capacity'] ?? null);
	$body = htmlentities($_POST['body'] ?? null);
	$nbody = htmlentities($_POST['nbody'] ?? null);

// Assuming you have a database connection established
	
	
	$escaped_name = mysqli_real_escape_string($con, $name);
	$escaped_nname = mysqli_real_escape_string($con, $nname);
	$escaped_short = mysqli_real_escape_string($con, $short);
	$escaped_nshort = mysqli_real_escape_string($con, $nshort);
	
	$escaped_map = mysqli_real_escape_string($con, $map);
	$escaped_link = mysqli_real_escape_string($con, $link);
	$escaped_capacity = mysqli_real_escape_string($con, $capacity);
	$escaped_body = mysqli_real_escape_string($con, $body);
	$escaped_nbody = mysqli_real_escape_string($con, $nbody);
	writeLog($con, $_SESSION["name"], "Updating activity");                   
	updateActivity($con, $escaped_id, $escaped_pid, $escaped_active, $escaped_name, $escaped_nname, $escaped_short, $escaped_nshort, $escaped_category, $escaped_season, $escaped_location, $escaped_map, $escaped_link, $escaped_capacity, $escaped_body, $escaped_nbody);
}	



if (isset($_POST['updatePartner']))
{
	    // Apply HTML entity encoding
    $id = htmlentities($_POST['id']);
    $escaped_id = mysqli_real_escape_string($con, $id);
    $active = htmlentities($_POST['active'] ?? null);
	$escaped_active = mysqli_real_escape_string($con, $active);
    $name = htmlentities($_POST['name'] ?? null);
    $escaped_name = mysqli_real_escape_string($con, $name);

    $facebook = htmlentities($_POST['facebook'] ?? null);
    $escaped_facebook = mysqli_real_escape_string($con, $facebook);
    $twitter = htmlentities($_POST['twitter'] ?? null);;
    $escaped_twitter = mysqli_real_escape_string($con, $twitter);
    $instagram = htmlentities($_POST['instagram'] ?? null);
    $escaped_instagram = mysqli_real_escape_string($con, $instagram);
    $youtube = htmlentities($_POST['youtube'] ?? null);
    $escaped_youtube = mysqli_real_escape_string($con, $youtube);
    $adress = htmlentities($_POST['adress'] ?? null);
    $escaped_adress = mysqli_real_escape_string($con, $adress);
    $email = htmlentities($_POST['email'] ?? null);
    $escaped_email = mysqli_real_escape_string($con, $email);
    $phone = htmlentities($_POST['phone'] ?? null);
    $escaped_phone = mysqli_real_escape_string($con, $phone);
    $website = htmlentities($_POST['website'] ?? null);
    $escaped_website = mysqli_real_escape_string($con, $website);

    // Serialize the array to store it as a string in the database
    $selectedValuesCategory = $_POST['category'];
    $serializedValuesCategory = serialize($selectedValuesCategory);
    $escaped_category = mysqli_escape_string($con, $serializedValuesCategory);

    $selectedValuesLocation = $_POST['location'];
    $serializedValuesLocation = serialize($selectedValuesLocation);
    $escaped_location = mysqli_escape_string($con, $serializedValuesLocation);

    $selectedValuesTarget = $_POST['target'];
    $serializedValuesTarget = serialize($selectedValuesTarget);
    $escaped_target = mysqli_escape_string($con, $serializedValuesTarget);

    $short = htmlentities($_POST['short'] ?? null);
    $nshort = htmlentities($_POST['nshort'] ?? null);
    $body = htmlentities($_POST['body'] ?? null);
    $nbody = htmlentities($_POST['nbody'] ?? null);
    $button = htmlentities($_POST['button'] ?? null);
    $nbutton = htmlentities($_POST['nbutton'] ?? null);
    $button_link = htmlentities($_POST['button_link'] ?? null);
    $logo_png = htmlentities($_POST['logo_png'] ?? null);
    $image = htmlentities($_POST['image'] ?? null);
    $map = htmlentities($_POST['map'] ?? null);
    
    $escaped_short = mysqli_real_escape_string($con, $short);
    $escaped_nshort = mysqli_real_escape_string($con, $nshort);
    $escaped_body = mysqli_real_escape_string($con, $body);
    $escaped_nbody = mysqli_real_escape_string($con, $nbody);
    $escaped_button = mysqli_real_escape_string($con, $button);
    $escaped_nbutton = mysqli_real_escape_string($con, $nbutton);
    $escaped_button_link = mysqli_real_escape_string($con, $button_link);
    $escaped_logo_png = mysqli_real_escape_string($con, $logo_png);
    $escaped_image = mysqli_real_escape_string($con, $image);
    $escaped_map = mysqli_real_escape_string($con, $map);
	writeLog($con, $_SESSION["name"], "Updating partner, ID: " . $escaped_id);                   
	updatePartner($con, $escaped_id, $escaped_active, $escaped_name, $escaped_facebook, $escaped_twitter, $escaped_instagram, $escaped_youtube, $escaped_adress, $escaped_email, $escaped_phone, $escaped_website, $escaped_category, $escaped_location, $escaped_target, $escaped_short, $escaped_nshort, $escaped_body, $escaped_nbody, $escaped_button, $escaped_nbutton, $escaped_button_link, $escaped_logo_png, $escaped_image, $escaped_map);
}


if (isset($_POST['updateStore']))
{
      // Apply HTML entity encoding
    $id = htmlentities($_POST['id']);
    $escaped_id = mysqli_real_escape_string($con, $id);
    $active = htmlentities($_POST['active'] ?? null);
  $escaped_active = mysqli_real_escape_string($con, $active);
    $name = htmlentities($_POST['name'] ?? null);
    $escaped_name = mysqli_real_escape_string($con, $name);

    $facebook = htmlentities($_POST['facebook'] ?? null);
    $escaped_facebook = mysqli_real_escape_string($con, $facebook);
    $twitter = htmlentities($_POST['twitter'] ?? null);;
    $escaped_twitter = mysqli_real_escape_string($con, $twitter);
    $instagram = htmlentities($_POST['instagram'] ?? null);
    $escaped_instagram = mysqli_real_escape_string($con, $instagram);
    $youtube = htmlentities($_POST['youtube'] ?? null);
    $escaped_youtube = mysqli_real_escape_string($con, $youtube);
    $adress = htmlentities($_POST['adress'] ?? null);
    $escaped_adress = mysqli_real_escape_string($con, $adress);
    $email = htmlentities($_POST['email'] ?? null);
    $escaped_email = mysqli_real_escape_string($con, $email);
    $phone = htmlentities($_POST['phone'] ?? null);
    $escaped_phone = mysqli_real_escape_string($con, $phone);
    $website = htmlentities($_POST['website'] ?? null);
    $escaped_website = mysqli_real_escape_string($con, $website);

    // Serialize the array to store it as a string in the database
    $selectedValuesCategory = $_POST['category'];
    $serializedValuesCategory = serialize($selectedValuesCategory);
    $escaped_category = mysqli_escape_string($con, $serializedValuesCategory);

    $selectedValuesLocation = $_POST['location'];
    $serializedValuesLocation = serialize($selectedValuesLocation);
    $escaped_location = mysqli_escape_string($con, $serializedValuesLocation);

    $selectedValuesTarget = $_POST['target'];
    $serializedValuesTarget = serialize($selectedValuesTarget);
    $escaped_target = mysqli_escape_string($con, $serializedValuesTarget);

    $short = htmlentities($_POST['short'] ?? null);
    $nshort = htmlentities($_POST['nshort'] ?? null);
    $body = htmlentities($_POST['body'] ?? null);
    $nbody = htmlentities($_POST['nbody'] ?? null);
    $button = htmlentities($_POST['button'] ?? null);
    $nbutton = htmlentities($_POST['nbutton'] ?? null);
    $button_link = htmlentities($_POST['button_link'] ?? null);
    $logo_png = htmlentities($_POST['logo_png'] ?? null);
    $image = htmlentities($_POST['image'] ?? null);
    $map = htmlentities($_POST['map'] ?? null);
    
    $escaped_short = mysqli_real_escape_string($con, $short);
    $escaped_nshort = mysqli_real_escape_string($con, $nshort);
    $escaped_body = mysqli_real_escape_string($con, $body);
    $escaped_nbody = mysqli_real_escape_string($con, $nbody);
    $escaped_button = mysqli_real_escape_string($con, $button);
    $escaped_nbutton = mysqli_real_escape_string($con, $nbutton);
    $escaped_button_link = mysqli_real_escape_string($con, $button_link);
    $escaped_logo_png = mysqli_real_escape_string($con, $logo_png);
    $escaped_image = mysqli_real_escape_string($con, $image);
    $escaped_map = mysqli_real_escape_string($con, $map);
  writeLog($con, $_SESSION["name"], "Updating store, ID: " . $escaped_id);                   
  updateStore($con, $escaped_id, $escaped_active, $escaped_name, $escaped_facebook, $escaped_twitter, $escaped_instagram, $escaped_youtube, $escaped_adress, $escaped_email, $escaped_phone, $escaped_website, $escaped_category, $escaped_location, $escaped_target, $escaped_short, $escaped_nshort, $escaped_body, $escaped_nbody, $escaped_button, $escaped_nbutton, $escaped_button_link, $escaped_logo_png, $escaped_image, $escaped_map);
}

if (isset($_POST['updateArticle']))
{
	$id = htmlentities($_POST['id'] ?? null);
	$escaped_id = mysqli_real_escape_string($con, $id);
	$active = htmlentities($_POST['active'] ?? null);
	$escaped_active = mysqli_real_escape_string($con, $active);
	$priority = htmlentities($_POST['priority'] ?? null);
	$escaped_priority = mysqli_real_escape_string($con, $priority);
	$date = htmlentities($_POST['date'] ?? null);
	$escaped_date = mysqli_real_escape_string($con, $date);
	$type = htmlentities($_POST['type'] ?? null);
	$escaped_type = mysqli_real_escape_string($con, $type);
	$name = htmlentities($_POST['name'] ?? null);
	$escaped_name = mysqli_real_escape_string($con, $name);
	$nname = htmlentities($_POST['nname'] ?? null);
	$escaped_nname = mysqli_real_escape_string($con, $nname);
	$author = htmlentities($_POST['author'] ?? null);
	$escaped_author = mysqli_real_escape_string($con, $author);
	$short = htmlentities($_POST['short'] ?? null);
	$escaped_short = mysqli_real_escape_string($con, $short);
	$nshort = htmlentities($_POST['nshort'] ?? null);
	$escaped_nshort = mysqli_real_escape_string($con, $nshort);
	$body = htmlentities($_POST['body'] ?? null);
	$escaped_body = mysqli_real_escape_string($con, $body);
	$nbody = htmlentities($_POST['nbody'] ?? null);
	$escaped_nbody = mysqli_real_escape_string($con, $nbody);
	$image = htmlentities($_POST['image'] ?? null);
	$escaped_image = mysqli_real_escape_string($con, $image);
	$button = htmlentities($_POST['button'] ?? null);
	$escaped_button = mysqli_real_escape_string($con, $button);
	$nbutton = htmlentities($_POST['nbutton'] ?? null);
	$escaped_nbutton = mysqli_real_escape_string($con, $nbutton);
	$button_link = htmlentities($_POST['button_link'] ?? null);
	$escaped_button_link = mysqli_real_escape_string($con, $button_link);  

	updateArticle($con, $escaped_id, $escaped_active, $escaped_priority, $escaped_date, $escaped_type, $escaped_name, $escaped_nname, $escaped_author, $escaped_short, $escaped_nshort, $escaped_body, $escaped_nbody, $escaped_image, $escaped_button, $escaped_nbutton, $escaped_button_link);
}
if (isset($_POST['updateInformation']))
{
	    // Apply HTML entity encoding
    $id = htmlentities($_POST['id']);
    $name = htmlentities($_POST['name'] ?? null);
    $facebook = htmlentities($_POST['facebook'] ?? null);
    $twitter = htmlentities($_POST['twitter'] ?? null);;
    $instagram = htmlentities($_POST['instagram'] ?? null);
    $youtube = htmlentities($_POST['youtube'] ?? null);
    $adress = htmlentities($_POST['adress'] ?? null);
    $email = htmlentities($_POST['email'] ?? null);
    $website = htmlentities($_POST['website'] ?? null);
    $short = htmlentities($_POST['short'] ?? null);
    $nshort = htmlentities($_POST['nshort'] ?? null);
    $body = htmlentities($_POST['body'] ?? null);
    $nbody = htmlentities($_POST['nbody'] ?? null);
    $button = htmlentities($_POST['button'] ?? null);
    $nbutton = htmlentities($_POST['nbutton'] ?? null);
    $button_link = htmlentities($_POST['button_link'] ?? null);
    $logo_png = htmlentities($_POST['logo_png'] ?? null);
    $image = htmlentities($_POST['image'] ?? null);
    $map = htmlentities($_POST['map'] ?? null);

    // Apply MySQLi real escape string
    $escaped_id = mysqli_real_escape_string($con, $id);
    $escaped_name = mysqli_real_escape_string($con, $name);
	$escaped_facebook = mysqli_real_escape_string($con, $facebook);
    $escaped_twitter = mysqli_real_escape_string($con, $twitter);
    $escaped_instagram = mysqli_real_escape_string($con, $instagram);
    $escaped_youtube = mysqli_real_escape_string($con, $youtube);
    $escaped_adress = mysqli_real_escape_string($con, $adress);
    $escaped_email = mysqli_real_escape_string($con, $email);
    $escaped_website = mysqli_real_escape_string($con, $website);
    $escaped_short = mysqli_real_escape_string($con, $short);
    $escaped_nshort = mysqli_real_escape_string($con, $nshort);
    $escaped_body = mysqli_real_escape_string($con, $body);
    $escaped_nbody = mysqli_real_escape_string($con, $nbody);
    $escaped_button = mysqli_real_escape_string($con, $button);
    $escaped_nbutton = mysqli_real_escape_string($con, $nbutton);
    $escaped_button_link = mysqli_real_escape_string($con, $button_link);
    $escaped_logo_png = mysqli_real_escape_string($con, $logo_png);
    $escaped_image = mysqli_real_escape_string($con, $image);
    $escaped_map = mysqli_real_escape_string($con, $map);
	writeLog($con, $_SESSION["name"], "Updating partner, ID: " . $escaped_id);                   
	updateInformation($con, $escaped_id, $escaped_name, $escaped_facebook, $escaped_twitter, $escaped_instagram, $escaped_youtube, $escaped_adress, $escaped_email, $escaped_website, $escaped_short, $escaped_nshort, $escaped_body, $escaped_nbody, $escaped_button, $escaped_nbutton, $escaped_button_link, $escaped_logo_png, $escaped_image, $escaped_map);
}
if (isset($_POST['updateFAQ']))
{
	    // Apply HTML entity encoding
    $id = htmlentities($_POST['id']);
    $category = htmlentities($_POST['category'] ?? null);
    $question = htmlentities($_POST['question'] ?? null);
    $nquestion = htmlentities($_POST['nquestion'] ?? null);
    $answer = htmlentities($_POST['answer'] ?? null);
    $nanswer = htmlentities($_POST['nanswer'] ?? null);
    // Apply MySQLi real escape string
    $escaped_id = mysqli_real_escape_string($con, $id);
    $escaped_catergory = mysqli_real_escape_string($con, $category);
    $escaped_question = mysqli_real_escape_string($con, $question);
    $escaped_nquestion = mysqli_real_escape_string($con, $nquestion);
    $escaped_answer = mysqli_real_escape_string($con, $answer);
    $escaped_nanswer = mysqli_real_escape_string($con, $nanswer);
	writeLog($con, $_SESSION["name"], "Updating partner, ID: " . $escaped_id);                   
	updateFaq($con, $escaped_id, $escaped_catergory, $escaped_question, $escaped_nquestion, $escaped_answer, $escaped_nanswer);
}

if (isset($_POST['deleteActivity']))
{
	deleteActivity($con, $_POST['id']);
}

if (isset($_POST['deletePartner']))
{
	deletePartner($con, $_POST['id']);
}	

if (isset($_POST['deleteStore']))
{
  deleteStore($con, $_POST['id']);
} 
if (isset($_POST['deleteArticle']))
{
	deleteArticle($con, $_POST['id']);
}

if (isset($_POST['logout']))
{
	header("Location: logout.php");
}
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) 
{ 	

	if (isset($_GET['page']) && $_GET['page'] === "activities")  
	{
		$page = $_GET['page'];
		renderListActivities($con);
		renderAddactivity($page);
		renderLogout();
	}
	elseif (isset($_GET['page']) && $_GET['page'] === "activity")  
	{
		$id = $_GET['id'];
		$page = $_GET['page'];
		renderEditActivity($con, $id);
		renderAddimage($con, $page, $id);
		renderLogout();
	}
	elseif (isset($_GET['page']) && $_GET['page'] === "partners")  
	{
		$page = $_GET['page'];
		renderListPartners($con);
		renderAddpartner($page);
		renderLogout();
	}
	elseif (isset($_GET['page']) && $_GET['page'] === "partner")  
	{
		$id = $_GET['id'];
		$page = $_GET['page'];
		renderEditPartner($con, $id);
		renderAddimage($con, $page, $id);
		renderLogout();
	}



  elseif (isset($_GET['page']) && $_GET['page'] === "stores")  
  {
    $page = $_GET['page'];
    renderListStores($con);
    renderAddStore($page);
    renderLogout();
  }
  elseif (isset($_GET['page']) && $_GET['page'] === "store")  
  {
    $id = $_GET['id'];
    $page = $_GET['page'];
    renderEditStore($con, $id);
    renderAddimage($con, $page, $id);
    renderLogout();
  }




	elseif (isset($_GET['page']) && $_GET['page'] === "articles")  
	{
		$page = $_GET['page'];
		renderListArticles($con);
		renderAddArticle($page);
		renderLogout();
	}
	elseif (isset($_GET['page']) && $_GET['page'] === "article")  
	{
		$id = $_GET['id'];
		$page = $_GET['page'];
		renderEditArticle($con, $id);
		renderAddimage($con, $page, $id);
		renderLogout();
	}
	elseif (isset($_GET['page']) && $_GET['page'] === "information")  
	{
		$page = $_GET['page'];
		renderEditInformation($con, 1);
		renderAddimage($con, $page, 1);
		renderLogout();
	}
	elseif (isset($_GET['page']) && $_GET['page'] === "faqs")  
	{
		$page = $_GET['page'];
		renderListFaq($con);
		renderAddFaq($page);
		renderLogout();	
	}
	elseif (isset($_GET['page']) && $_GET['page'] === "faq")  
	{
		$id = $_GET['id'];
		renderEditFaq($con, $id);
		renderLogout();	
	}




	else 
	{	
		$page = "activities";
		renderListActivities($con);
		renderAddactivity($page);
		renderLogout();
	}
} 	
else 
{ 
	renderLogin();
}
require_once('footer.php');
?>
