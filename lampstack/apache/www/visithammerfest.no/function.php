<?php
require_once('render.php');
function connect() 
{
    $con =  mysqli_connect("lamp-mysql", "visithammerfest", "Pa6jgVzHFjdXKbTq", "visithammerfest");
        mysqli_set_charset($con,"utf8");
        // Check connection
        if (mysqli_connect_errno()) 
        {
        // If there is an error with the connection, stop the script and display the error.
            die ('Failed to connect to MySQL: ' . mysqli_connect_error());
      } return $con;
}


// Activity 

function addActivity($con) 
{
        $sql = "INSERT INTO `activity`(`id`, `pid`, `active`, `name`, `nname`, `short`, `nshort`, `type`, `season`, `location`, `map`, `link`, `capacity`, `body`, `nbody`) VALUES (null,null,null,'NEW','NY',null,null,null,null,null,null,null,null,null,null)";
        if (mysqli_query($con, $sql)) 
        {
                $activityid = mysqli_insert_id($con);
                header('Location: admin.php?page=activity&id='.$activityid);
                writeLog($con, $_SESSION["name"], "New activity created successfully");
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
        }   
}
function updateActivity($con, $id, $pid, $active, $name, $nname, $short, $nshort, $type, $season, $location, $map, $link, $capacity, $body, $nbody)
{
    $sql = "UPDATE `activity` SET `id`= '$id', `pid`= '$pid',`active`='$active',`name`='$name',`nname`='$nname',`short`='$short',`nshort`='$nshort',`type`='$type',`season`='$season',`location`='$location',`map`='$map',`link`='$link',`capacity`='$capacity',`body`='$body',`nbody`='$nbody'  WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=activity&id='.$id);
            writeLog($con, $_SESSION["name"], "updateActivity success");
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }    
}
function deleteActivity($con, $id)
{
    $sql = "DELETE FROM `activity` WHERE `id` =  '$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php');
            writeLog($con, $_SESSION["name"], "Activity deleted successfully");
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));  
    }    
} 





// Inspiration

function addArticle($con) 
{
        $date = date('Y-m-d');
        $sql = "INSERT INTO `article`(`id`, `active`, `priority`, `date`, `type`, `name`, `nname`, `author`, `short`, `nshort`, `body`, `nbody`, `image`, `button`, `nbutton`, `button_link`) VALUES (null,null,null,'$date',null,'NEW',null,null,null,null,null,null,null,null,null,null)";

        if (mysqli_query($con, $sql)) 
        {
                $articleid = mysqli_insert_id($con);
                header('Location: admin.php?page=article&id='.$articleid);
                writeLog($con, $_SESSION["name"], "New articel created successfully");
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error addarticle : " . $sql . "<br>" . mysqli_error($con));
        }   
}
function updateArticle($con, $id, $active, $priority, $date, $type, $name, $nname, $author, $short, $nshort, $body, $nbody, $image, $button, $nbutton, $button_link)
{
    
    $sql = "UPDATE `article` SET `id`='$id',`active`='$active',`priority`='$priority',`date`='$date',`type`='$type',`name`='$name',`nname`='$nname',`author`='$author',`short`='$short',`nshort`='$nshort',`body`='$body',`nbody`='$nbody',`image`='$image',`button`='$button',`nbutton`='$nbutton',`button_link`='$button_link' WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=article&id='.$id);
            writeLog($con, $_SESSION["name"], "updateArticle success");
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }
    
}
function deleteArticle($con, $id)
{
    $sql = "DELETE FROM `article` WHERE `id` =  '$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=articles');
            writeLog($con, $_SESSION["name"], "Inspiration deleted successfully");
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));  
    }
    
}





// store

function addStore($con) 
{
        $sql = "INSERT INTO `store`(`id`, `active`, `name`, `facebook`, `twitter`, `instagram`, `youtube`, `adress`, `email`, `phone`,  `website`, `category`, `target`, `short`, `nshort`, `description`, `ndescription`, `button`, `nbutton`, `button_link`, `logo_png`, `image`, `map`) VALUES (null, null,'NEW',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)";

        if (mysqli_query($con, $sql)) 
        {
                $storeid = mysqli_insert_id($con);
                header('Location: admin.php?page=store&id='.$storeid);
                writeLog($con, $_SESSION["name"], "New store created successfully");
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error addstore : " . $sql . "<br>" . mysqli_error($con));
        }   
}
function updateStore($con, $id, $active, $name, $facebook, $twitter, $instagram, $youtube, $adress, $email, $phone, $website, $category, $location, $target, $short, $nshort, $body, $nbody, $button, $nbutton, $button_link, $logo_png, $image, $map)
{
    
    $sql = "UPDATE `store` SET `id`='$id',`active`='$active',`name`='$name',`facebook`='$facebook',`twitter`='$twitter',`instagram`='$instagram',`youtube`='$youtube',`adress`='$adress',`email`='$email',`phone`='$phone',`website`='$website',`category`='$category',`location`='$location',`target`='$target',`short`='$short',`nshort`='$nshort',`description`='$body',`ndescription`='$nbody',`button`='$button',`nbutton`='$nbutton',`button_link`='$button_link',`logo_png`='$logo_png',`image`='$image',`map`='$map' WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=store&id='.$id);
            writeLog($con, $_SESSION["name"], "updateStore success. ID: " . $id);
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }
    
}
function deleteStore($con, $id)
{
    $sql = "DELETE FROM `store` WHERE `id` =  '$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php');
            writeLog($con, $_SESSION["name"], "Store deleted successfully");
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));  
    }
    
}

// Partner

function addPartner($con) 
{
        $sql = "INSERT INTO `partner`(`id`, `active`, `name`, `facebook`, `twitter`, `instagram`, `youtube`, `adress`, `email`, `phone`,  `website`, `category`, `target`, `short`, `nshort`, `description`, `ndescription`, `button`, `nbutton`, `button_link`, `logo_png`, `image`, `map`) VALUES (null, null,'NEW',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)";

        if (mysqli_query($con, $sql)) 
        {
                $partnerid = mysqli_insert_id($con);
                header('Location: admin.php?page=partner&id='.$partnerid);
                writeLog($con, $_SESSION["name"], "New partner created successfully");
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error addpartner : " . $sql . "<br>" . mysqli_error($con));
        }   
}
function updatePartner($con, $id, $active, $name, $facebook, $twitter, $instagram, $youtube, $adress, $email, $phone, $website, $category, $location, $target, $short, $nshort, $body, $nbody, $button, $nbutton, $button_link, $logo_png, $image, $map)
{
    
    $sql = "UPDATE `partner` SET `id`='$id',`active`='$active',`name`='$name',`facebook`='$facebook',`twitter`='$twitter',`instagram`='$instagram',`youtube`='$youtube',`adress`='$adress',`email`='$email',`phone`='$phone',`website`='$website',`category`='$category',`location`='$location',`target`='$target',`short`='$short',`nshort`='$nshort',`description`='$body',`ndescription`='$nbody',`button`='$button',`nbutton`='$nbutton',`button_link`='$button_link',`logo_png`='$logo_png',`image`='$image',`map`='$map' WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=partner&id='.$id);
            writeLog($con, $_SESSION["name"], "updatePartner success. ID: " . $id);
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }
    
}
function deletePartner($con, $id)
{
    $sql = "DELETE FROM `partner` WHERE `id` =  '$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php');
            writeLog($con, $_SESSION["name"], "Partner deleted successfully");
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));  
    }
    
}





// Information

function updateInformation($con, $id, $name, $facebook, $twitter, $instagram, $youtube, $adress, $email, $website, $short, $nshort, $body, $nbody, $button, $nbutton, $button_link, $logo_png, $image, $map)
{
    
    $sql = "UPDATE `information` SET `id`='$id',`name`='$name',`facebook`='$facebook',`twitter`='$twitter',`instagram`='$instagram',`youtube`='$youtube',`adress`='$adress',`email`='$email',`website`='$website',`short`='$short',`nshort`='$nshort',`description`='$body',`ndescription`='$nbody',`button`='$button',`nbutton`='$nbutton',`button_link`='$button_link',`logo_png`='$logo_png',`image`='$image',`map`='$map' WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=information&id='.$id);
            writeLog($con, $_SESSION["name"], "updateInformation success. ID: " . $id);
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }
    
}

function addFaq($con) 
{

        $sql = "INSERT INTO `faq`(`id`, `category`, `question`, `nquestion`, `answer`, `nanswer`) VALUES (null,null,'NEW',null,null,null)";

        if (mysqli_query($con, $sql)) 
        {

                $faqid = mysqli_insert_id($con);
                header('Location: admin.php?page=faq&id='.$faqid);
                echo "New faq item created successfully";
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
        }

        
}
function updateFaq($con, $id, $category, $question, $nquestion, $answer, $nanswer)
{
    $sql = "UPDATE `faq` SET `id`='$id',`category`='$category',`question`='$question',`nquestion`='$nquestion',`answer`='$answer',`nanswer`='$nanswer' WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=faq&id=' . $id);
            echo "Record updated successfully";
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }
    
}
function deleteFaq($con, $id)
{
    $sql = "DELETE FROM `faq` WHERE `id` = '$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: admin.php?page=information');
            echo "Record deleted successfully";
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));  
    }
    
}




function addLink($con) 
{

        $sql = "INSERT INTO `links`(`id`, `name`, `url`) VALUES (null,'new',null)";

        if (mysqli_query($con, $sql)) 
        {
                header('Location: index.php');
                echo "New menu item created successfully";
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
        }

        
}
function updateLink($con, $id, $name, $url)
{
    $sql = "UPDATE `links` SET `id`='$id',`name`='$name',`url`='$url' WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: index.php');
            echo "Record updated successfully";
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }
    
}
function deleteLink($con, $id)
{
    $sql = "DELETE FROM `links` WHERE `id` = '$id'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: index.php');
            echo "Record deleted successfully";
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));  
    }
    
} 
function addSubscriber($con, $email) 
{

        $sql = "INSERT INTO `subscribers`(`id`, `email`) VALUES (null, '$email')";

        if (mysqli_query($con, $sql)) 
        {
                header('Location: index.php');
                echo "Du vil nå motta våre nyhetsbrev";
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
        }

        
}
function getSubscribers($con) 
{

        $sql = "SELECT * FROM `subscribers`";
        $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                    $email = $row["email"];
                    echo ($email . "; ");
            }
        } 
        else 
        {
             writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
        } 

        
}
function unsubscribe($con, $email)
{
    $sql = "DELETE FROM `subscrivers` WHERE `email` = '$email'";
    if (mysqli_query($con, $sql)) 
    {
            header('Location: index.php');
            echo "Record deleted successfully";
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con)); 
    }
    
} 
function login($con, $user, $pass) 
{
		$user =	mysqli_real_escape_string($con, $user);
        $pass = mysqli_real_escape_string($con, $pass);
        $saltQuery = "SELECT salt FROM users WHERE username='$user';";
        $gsalt = $con->query($saltQuery);
		$row = mysqli_fetch_assoc($gsalt);
		$salt = $row['salt'];
		$saltedPW =  $escapedPW . $salt;
		$hashedPW = hash('sha256', $saltedPW);
        $sql = "SELECT 1 FROM users WHERE username='$user' AND password='$hashedPW'";
        $result = $con->query($sql);
        if ($result === FALSE)
        die("Could not query database");
        if (mysqli_num_rows($result) == 1)
        {
            $_SESSION["authenticated"] = TRUE;
            $host = $_SERVER["HTTP_HOST"];
            $path = rtrim(dirname($_SERVER["PHP_SELF"]), "/\\");
            header("Location: https://$host$path/index.php");
            exit;
        }
}
function deleteFile($con, $id)
{
    $sql = "UPDATE `filearchive` SET `locationid`='0' WHERE id = $id";
    if (mysqli_query($con, $sql)) 
    {
        writeLog($con, $_SESSION["name"], "Have removed a file (see location id 0");
        header('Location: project.php?mode=archive');
    } 
    else 
    {
        writeLog($con, $_SESSION["name"], "Error: " . $sql . "" . mysqli_error($con));
    }
} 
function writeLog($con, $name, $message)
{
        $timestamp = date("Y-m-d H:i:s");
        $safemessage = mysqli_real_escape_string($con, $message);
        $sql = "INSERT INTO `log` (`id`,`timestamp`, `name`, `description`) VALUES 
                            (NULL, '$timestamp', '$name', '$safemessage');";

   
        if (mysqli_query($con, $sql)) 
        {
              
        } 
        else 
        {
            echo "admin", "Klarer ikke skrive medling til logg! <br> Error: " . $sql . "" . mysqli_error($con);
        }
}
function getImagelinks($con, $page, $id)
{
    // Prepare and execute the SELECT query with prepared statements
    $query = "SELECT * FROM files WHERE page = ? AND pageid = ?";
    $stmt = mysqli_prepare($con, $query);

    // Bind the values to the prepared statement
    mysqli_stmt_bind_param($stmt, "si", $page, $id);

    // Execute the prepared statement
    mysqli_stmt_execute($stmt);

    // Get the result set
    $result = mysqli_stmt_get_result($stmt);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $text = "onclick=\\'.\\'return confirm(\\'Vil du slette bildet?\\')";
            echo('
                <div class="wrapper">
                    <a href="assets/images/uploads/' . $row['filename'] . '">
                        <img style="max-height: 100px; width: auto; display: block;" src="assets/images/uploads/' . $row['filename'] . '">
                    </a>
                    <form method="post" action="admin.php?id=' . $id . '&page=' . $_GET['page'] . '">
                        <input type="hidden" name="updateImage" value="' . $row['id'] . '">
                        <input type="text" name="photographer" value="' . htmlspecialchars($row['photographer']) . '">
                        <input type="submit" value="Update">
                    </form>
                    <a onClick="javascript: return confirm(\'Vil du slette bildet?\');" href="admin.php?id=' . $id . '&page=' . $_GET['page'] . '&deleteimage=' . $row['id'] . '" class="close" id="close">
                    </a>
                </div>
            ');
        }
    } else {
        echo "There are no uploaded images!";
    }

    // Close the prepared statement
    mysqli_stmt_close($stmt);

    // Close the database connection
    mysqli_close($con);
}
function updateImage($con, $id, $photographer)
{
    
    $sql = "UPDATE `files` SET `photographer`='$photographer' WHERE `id`='$id'";
    if (mysqli_query($con, $sql)) 
    {
            writeLog($con, $_SESSION["name"], "updateImage success");
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
    }
    
}
function deleteImage($con, $page, $id)
{

   
    $sql = "UPDATE `files` SET `pageid`='0' WHERE id = $id";
    


    if (mysqli_query($con, $sql)) 
    {
        writeLog($con, $_SESSION["name"], "Have removed an image");
    } 
    else 
    {
        writeLog($con, $_SESSION["name"], "Error: " . $sql . "" . mysqli_error($con));
    }

}
function addFile($con, $activityid, $filetype)
{
        writeLog($con, $_SESSION["name"], "addfile start " . $activityid . " oo " . $filetype); 
        $thisdate = date('Y-m-d');    
        $filename =  "bilde";
        $sql = "INSERT INTO `activity_images`(`id`, `activityid`, `date`, `filename`, `filetype`) VALUES 
                            (NULL, '$activityid', '$thisdate', '$filename', '$filetype');";

   
        if (mysqli_query($con, $sql)) 
        {
                $value =  mysqli_insert_id($con);
                writeLog($con, $_SESSION["name"], "Has added a file, sql updated ::" . $value); 
                return $value;
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error: " . $sql . "" . mysqli_error($con));
        }
        writeLog($con, $_SESSION["name"], "addfile end"); 
}
function addFile2($con, $page, $id, $filetype)
{
        writeLog($con, $_SESSION["name"], "addfile2 start " . $page . " oo " . $id . " oo " . $filetype); 
        $thisdate = date('Y-m-d');    
        $filename =  "vh-" . $page . "-";

        if ($page === "activity")
        {
            $sql = "INSERT INTO `activity_images`(`id`, `activityid`, `date`, `filename`, `filetype`) VALUES 
                            (NULL, '$id', '$thisdate', '$filename', '$filetype');";
        }
        elseif ($page === "partner")
        {
            $sql = "INSERT INTO `partner_images`(`id`, `partnerid`, `date`, `filename`, `filetype`) VALUES 
                            (NULL, '$id', '$thisdate', '$filename', '$filetype');";
        }
        elseif ($page === "store")
        {
            $sql = "INSERT INTO `store_images`(`id`, `partnerid`, `date`, `filename`, `filetype`) VALUES 
                            (NULL, '$id', '$thisdate', '$filename', '$filetype');";
        }
        elseif ($page === "inspiration")
        {
            $sql = "INSERT INTO `inspiration_images`(`id`, `inspirationid`, `date`, `filename`, `filetype`) VALUES 
                            (NULL, '$id', '$thisdate', '$filename', '$filetype');";
        }
        else
        {
            writeLog($con, $_SESSION["name"], "Addfile2 running but not allocated to any database");
            exit; 
        }
   
        if (mysqli_query($con, $sql)) 
        {
                $value =  mysqli_insert_id($con);
                writeLog($con, $_SESSION["name"], "Has added a file, sql updated ::" . $value); 

                $newfilename = $filename.$value;

                if ($page === "activity")
                {
                    $sql = "UPDATE `activity_images` SET `filename`='$newfilename', WHERE id ='$value'";
                }
                elseif ($page === "partner")
                {
                    $sql = "UPDATE `partner_images` SET `filename`='$newfilename',WHERE id ='$value'";
                }
                elseif ($page === "store")
                {
                    $sql = "UPDATE `store_images` SET `filename`='$newfilename',WHERE id ='$value'";
                }
                elseif ($page === "inspiration")
                {
                    $sql = "UPDATE `inspiration_images` SET `filename`='$newfilename', WHERE id ='$value'";
                }
                else
                {
                    writeLog($con, $_SESSION["name"], "Addfile2 running but not allocated to any database");
                    exit; 
                }
                if (mysqli_query($con, $sql)) 
                {

                
                    return $value;
                }
        } 
        else 
        {
                writeLog($con, $_SESSION["name"], "Error: " . $sql . "" . mysqli_error($con));
        }
        writeLog($con, $_SESSION["name"], "Addfile end"); 
}
function getAuth($con, $name) 
{
    $sql = "SELECT `auth` FROM `profile` WHERE username = '$name'";
    $result = $con->query($sql);

    if ($result->num_rows > 0) 
    {
        while($row = $result->fetch_assoc()) 
        {
           return $row["auth"]; 
        }
    } else 
    {
         writeLog($con, $_SESSION["name"], "Error: " . $sql . "" . mysqli_error($con));
    } 
    
}
function passwordChange($con, $user, $pass1, $pass2)
{

    if($pass1 === $pass2) 
    {
        if(($_SESSION["auth"] === "admin") || ($_SESSION['name'] === $user))
        { 
            $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $sql = "UPDATE accounts SET password = '$password' WHERE username = '$user'";
        }

          else
          {
              echo "You are not allowed to change this password!";
              writeLog($con, $_SESSION["name"], "has tryed a password change and been rejected");
          }
   
        if(mysqli_query($con, $sql))  
        {
              writeLog($con, $_SESSION["name"], "has updated " . $user . "´s password");
              $project = ("Location: profile.php?user=");
              header($project . $user);
        } 
            else 
            {
               echo "Error: Fikk ikke oppdatert passord";
            }


    }
    else
    {
        echo "paswords doesnt match";
    }
        

}
function getTask($con, $id)
{
        $sql = "SELECT * FROM task WHERE id='$id'";
        $task = $con->query($sql);
        return $task;
}
function getPartnerName($con, $pid)
{
    $sql = "SELECT name FROM partner WHERE id = $pid";
    $result = $con->query($sql);
    
    if($result)
    {
        if ($result->num_rows > 0) 
        {
            $row = $result->fetch_assoc();
            return $row['name'];
        }
        return '';
    }
}
function getStoreName($con, $pid)
{
    $sql = "SELECT name FROM store WHERE id = $pid";
    $result = $con->query($sql);
    
    if($result)
    {
        if ($result->num_rows > 0) 
        {
            $row = $result->fetch_assoc();
            return $row['name'];
        }
        return '';
    }
}
function getFile($con, $id) 
{
        $sql = "SELECT * FROM `filearchive` WHERE id= '$id'";
        $result = $con->query($sql);
        return $result;
}
function getLocation($con, $id) 
{
        $sql = "SELECT * FROM `location` WHERE id= '$id'";
        $project = $con->query($sql);
        return $project;
}
function getDropdownPartners($con) 
{
    $sql = "SELECT id, name FROM partner ORDER BY name ASC";
    $result = mysqli_query($con, $sql);
     
           
    if ($result->num_rows > 0) 
    {
        // output data of each row
        while ( $row=mysqli_fetch_assoc($result)) 
        {
            echo "<option value='".$row["id"]."''>".$row["name"]."</option>";
        }
    } 
    else 
    {
         writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
    } 
}


function getDropdownStores($con) 
{
    $sql = "SELECT id, name FROM store ORDER BY name ASC";
    $result = mysqli_query($con, $sql);
     
           
    if ($result->num_rows > 0) 
    {
        // output data of each row
        while ( $row=mysqli_fetch_assoc($result)) 
        {
            echo "<option value='".$row["id"]."''>".$row["name"]."</option>";
        }
    } 
    else 
    {
         writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
    } 
}

function getSelectedValuesArray($serializedValues)
{
    return unserialize($serializedValues);
}
function isSelected($option, $selectedArray = []) {
    return in_array($option, $selectedArray) ? 'selected' : '';
}

?>