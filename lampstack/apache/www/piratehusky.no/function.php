<?php
require_once('render.php');
function connect() 
{
    $con =  mysqli_connect("lamp-mysql", "pirate", "kYDH7Uy9ukX9GCtA", "piratehusky");
        mysqli_set_charset($con,"utf8");
        // Check connection
        if (mysqli_connect_errno()) 
        {
        // If there is an error with the connection, stop the script and display the error.
            die ('Failed to connect to MySQL: ' . mysqli_connect_error());
      } return $con;
}


function getDropdown($con, $lang, $type)
{
    $sql = "SELECT * FROM `$type`";
    $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                    if ($lang === "no")
                    {
                        $name = $row["no_name"];
                    }    
                    else
                    {
                        $name = $row["name"];
                    }
                    $id = $row["id"];
                    echo ('<a class="text-black dropdown-item text-primary display-4" href="index.php?page='. $type .'&lang='.$lang.'#'. $id .'">'. $name .'</a>');
            }
        } 
        else 
        {
             writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
        } 
}
//Login Section
function dontwriteNull($hours)
{
    if ($hours === "00:00:00" || $hours === "00:00" || $hours === "0" || $hours === "0:00" || $hours === 0)
    {
        return " ";
    }
    else
    {
        return $hours;
    }

}

function addActivity($con, $type) 
{

        $sql = "INSERT INTO `activity`(`id`, `type`, `header`, `body`, `image`) VALUES (null, '$type','new',null,null)";

        if (mysqli_query($con, $sql)) 
        {
                header('Location: index.php');
                echo "New record created successfully";
        } 
        else 
        {
                echo "Error: " . $sql . "<br>" . mysqli_error($con);
        }

        
}
function updateActivity($con, $id, $type, $header, $link, $body, $image)
{
    if ($image === "noimage")
    {
        $sql = "UPDATE `activity` SET `id`= '$id',`type`='$type',`header`='$header',`link`='$link',`body`='$body' WHERE `id`='$id'";
    }
    else
    {
    $sql = "UPDATE `activity` SET `id`= '$id',`type`='$type',`header`='$header',`link`='$link',,`body`='$body'`image`='$image' WHERE `id`='$id'";
    }
    if (mysqli_query($con, $sql)) 
    {
            header('Location: index.php');
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
            header('Location: index.php');
            echo "Record deleted successfully";
    } 
    else 
    {
            writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));  
    }
    
} 
function addMenu($con) 
{

        $sql = "INSERT INTO `menu`(`id`, `name`, `url`, `description`, `image`) VALUES (null,'new',null,null,null)";

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
function updateMenu($con, $id, $name, $url, $description, $image)
{
    if ($image === "noimage")
    {
        $sql = "UPDATE `menu` SET `id`='$id',`name`='$name',`url`='$url',`description`='$description' WHERE `id`='$id'";
    }
    else
    {
        $sql = "UPDATE `menu` SET `id`='$id',`name`='$name',`url`='$url',`description`='$description',`image`='$image' WHERE `id`='$id'";
    }

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
function deleteMenu($con, $id)
{
    $sql = "DELETE FROM `menu` WHERE `id` = '$id'";
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
        writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
    }
} 











function writeLog($con, $name, $message)
{
        $timestamp = date("Y-m-d H:i:s");

        $sql = "INSERT INTO `log` (`id`,`timestamp`, `name`, `description`) VALUES 
                            (NULL, '$timestamp', '$name', '$message');";

   
        if (mysqli_query($con, $sql)) 
        {
              
        } 
        else 
        {
            echo "admin", "Klarer ikke skrive medling til logg! <br> Error: " . $sql . "" . mysqli_error($con);
        }
}
        

function getImagelinks($con, $id) 
{
    if($id!= 0)
    {
        $sql = "SELECT * FROM `discrepancy_images` WHERE discrepancyid = '$id'";
    $result = $con->query($sql);

        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $text = "onclick=\\'.\\'return confirm(\\'Vil du slette bildet?\\')";
               echo('<div class="wrapper">
                                <a href="http://timer.wegener.no/uploads/d-' . $row['id'] . '.' . $row['filetype'] . '">
                                        <img src="http://timer.wegener.no/uploads/d-' . $row['id'] . "." . $row['filetype'] . '" width="50" height="50">
                                </a>
                                <a onClick="javascript: return confirm(\'Vil du slette bildet?\');" href="http://timer.wegener.no/discrepancy.php?id=' . $id . '&mode=' . $_GET['mode'] . '&deleteimage='. $row['id'] . '" class="close" id="close">
                                        
                                </a>
                        </div>  
                ');
            }
        } 
        else 
        {
             
        } 
    }
}
function deleteimage($con, $id)
{

    $sql = "UPDATE `discrepancy_images` SET `discrepancyid`='0' WHERE id = $id";
    if (mysqli_query($con, $sql)) 
    {
        writeLog($con, $_SESSION["fname"], "Have removed an image (see discrepancy id 0");
    } 
    else 
    {
        writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
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
function addFile2($con, $activityid, $filetype)
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

function editFile($con, $id, $project, $fromdate, $todate, $filename)
{
    $date = date("Y-m-d");
    if ($todate == '' || !isset($todate)) 
    {
        $sql = "UPDATE `filearchive` SET `locationid`='$project',`fromdate`='$fromdate',`todate`=NULL,`filename`='$filename' WHERE id = $id";
    }
    else
    {
        $sql = "UPDATE `filearchive` SET `locationid`='$project',`fromdate`='$fromdate',`todate`='$todate',`filename`='$filename' WHERE id = $id";
    }
    if (mysqli_query($con, $sql)) 
    {
        writeLog($con, $_SESSION["fname"], "Have updated file information : " . $filename . $id);
        header('Location: project.php?mode=archive');
    } 
    else 
    {
        writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));

    }
    

} 



function updateResponsibility($con, $id, $responsibility, $responsible, $backup, $winter, $summer)
{
        $sql = "UPDATE `location` SET `responsibility`='$responsibility',`responsible`='$responsible',`backup`='$backup',`winter`='$winter',`summer`='$summer' WHERE `id` = '$id'";  
            if (mysqli_query($con, $sql)) 
            {
               writeLog($con, $_SESSION["fname"], "Has updated responsibility for " . getProjectname($con, $id));

            } else 
            {
               writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }

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
         writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
    } 
    
}

function getProjectname($con, $projectid) 
{
    $sql = "SELECT * FROM `location` WHERE id= '$projectid'";
    $result = $con->query($sql);

    if ($result->num_rows > 0) 
    {
        while($row = $result->fetch_assoc()) 
        {
           return $row["name"]; 
        }
    } else 
    {
         return "*";
    } 

}
function getLocationsjs($con) 
{
    $sql = "SELECT name FROM `location` ORDER BY name";
    $result = $con->query($sql);
    $projectnames;    if ($result->num_rows > 0) 
    {
        while($row = $result->fetch_assoc()) 
        {
           array_push($projectnames, $row["name"]); 

        }
    }
    writeLog($con, $_SESSION["fname"], "has ran location names, array size is " . sizeof($projectnames));
    return $projectnames;
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
              writeLog($con, $_SESSION["fname"], "has tryed a password change and been rejected");
          }
   
        if(mysqli_query($con, $sql))  
        {
              writeLog($con, $_SESSION["fname"], "has updated " . $user . "´s password");
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

function getTaskresponcible($con, $id)
{
        $sql = "SELECT `who` FROM task WHERE id='$id'";
        $result = $con->query($sql);
        if ($result->num_rows > 0) 
    {
        while($row = $result->fetch_assoc()) 
        {
           return $row["who"]; 
        }
    } else 
    {
         return "*";
    } 
}

function getTaskstatus($con, $id)
{
        $sql = "SELECT `status` FROM task WHERE id='$id'";
        $result = $con->query($sql);
        if ($result->num_rows > 0) 
    {
        while($row = $result->fetch_assoc()) 
        {
            if ($row["status"] === "new")
            {
                return "Åpen";
            } 
            else
            {
                return "Lukket";
            }
        }
    } else 
    {
         return "*";
    } 
}

function getDiscrepancy($con, $id)
{
        $sql = "SELECT * FROM discrepancy WHERE id='$id'";
        $discrepancy = $con->query($sql);
        return $discrepancy;
}

function getTool($con, $id) 
{
        $sql = "SELECT * FROM `tools` WHERE id= '$id'";
        $result = $con->query($sql);
        return $result;
}
function getFile($con, $id) 
{
        $sql = "SELECT * FROM `filearchive` WHERE id= '$id'";
        $result = $con->query($sql);
        return $result;
}
function getRecurrence($con, $id) 
{
        $sql = "SELECT * FROM `recurrence` WHERE id= '$id'";
        $result = $con->query($sql);
        return $result;
}

function getLocation($con, $id) 
{
        $sql = "SELECT * FROM `location` WHERE id= '$id'";
        $project = $con->query($sql);
        return $project;
}

function setTask($con, $id, $cdate, $vdate, $ddate, $project, $recipient, $description, $priority, $invalid, $who, $status, $comment, $startt, $stopt, $ot50, $ot100, $utb, $inb, $uta, $fa, $ta, $tah, $tavk, $vvsel, $b1, $b2)
{
    if ($id === "new" && $status === "new") //create a new task
    {
            $sql = "INSERT INTO `task`(`id`, `cdate`, `vdate`, `ddate`, `location`, `recipient`, `description`, `priority`, `invalid`, `who`, `status`, `comment`, `startt`, `stopt`, `ot50`, `ot100`,`utb`, `inb`, `uta`, `fa`, `ta`, `tah`, `tavk`, `vvsel`, `b1`, `b2`) VALUES 
                            (NULL, '$cdate', '$vdate', '$ddate', '$project', '$recipient', '$description', '$priority', '$invalid', '$who', '$status', NULL, NULL, NULL, '$ot50', '$ot100','$utb', '$inb', '$uta', '$fa', '$ta', '$tah', '$tavk', '$vvsel', '$b1', '$b2');";
            if (mysqli_query($con, $sql)) 
            {
               writeLog($con, $_SESSION["fname"], "Has created a new task");
               header('Location: index.php');
            } else 
            {
                    writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }

    }
    if ($id === "new" && $status === "done") //create a new task
    {
            $sql = "INSERT INTO `task`(`id`, `cdate`, `vdate`, `ddate`, `location`, `recipient`, `description`, `priority`, `invalid`, `who`, `status`, `comment`, `startt`, `stopt`, `ot50`, `ot100`,`utb`, `inb`, `uta`, `fa`, `ta`, `tah`, `tavk`, `vvsel`, `b1`, `b2`) VALUES 
                            (NULL, '$cdate', '$vdate', '$ddate', '$project', '$recipient', '$description', '$priority', '$invalid', '$who', '$status', NULL, NULL, NULL, '$ot50', '$ot100','$utb', '$inb', '$uta', '$fa', '$ta', '$tah', '$tavk', '$vvsel', '$b1', '$b2');";
            if (mysqli_query($con, $sql)) 
            {
                $id = mysqli_insert_id($con);
                writeLog($con, $_SESSION["fname"], "Has created a new task");
               
                header("Location: timer.php?id=$id"); 
            } else 
            {
                    writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }

    }
    if ($id === "new" && $status === "away") //create a new task
    {
            $sql = "INSERT INTO `task`(`id`, `cdate`, `vdate`, `ddate`, `location`, `recipient`, `description`, `priority`, `invalid`, `who`, `status`, `comment`, `startt`, `stopt`, `ot50`, `ot100`, `utb`, `inb`, `uta`, `fa`, `ta`, `tah`, `tavk`, `vvsel`, `b1`, `b2`) VALUES 
                            (NULL, '$cdate', '$vdate', '$ddate', '$project', '$recipient', '$description', '$priority', '$invalid', '$who', 'done', '$comment', '$startt', '$stopt', '$ot50', '$ot100', '$utb', '$inb', '$uta', '$fa', '$ta', '$tah', '$tavk', '$vvsel', '$b1', '$b2');";
            if (mysqli_query($con, $sql)) 
            {
               writeLog($con, $_SESSION["fname"], "Has created a new task");
               header('Location: index.php');
            } else 
            {
                    writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }

    }
    elseif ($status === "new") //update a task with new details
    {
            $sql = "UPDATE `task` SET `vdate`='$vdate',`ddate`='$ddate',`location`='$project',`recipient`='$recipient',`description`='$description',`priority`='$priority',`who`='$who' WHERE `id` = '$id'";  
            if (mysqli_query($con, $sql)) 
            {
               writeLog($con, $_SESSION["fname"], "Has updated a task");
               header('Location: index.php');
            } else 
            {
                    writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }
    }
    elseif ($status === "done") //update task with status done, comment, start and stoptime.
    {
            $sql = "UPDATE `task` SET `status`='done',`comment`='$comment',`startt`='$startt',`stopt`='$stopt' WHERE `id` = '$id'";
            if (mysqli_query($con, $sql)) 
            {
                    writeLog($con, $_SESSION["fname"], "Has closed a task");
            } 
            else 
            {
                    writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }
    }
}

function setDiscrepancy($con, $mode, $id, $cdate, $ddate, $project, $invalid, $description, $type, $status)
{
    if ($id === "new")
    {   
            $originator = $_SESSION['name'];

            $sql = "INSERT INTO `discrepancy`(`id`, `cdate`, `ddate`, `location`, `description`, `originator`, `connectedtask`, `closedby`, `invalid`,  `type`, `status`) VALUES 
                            (NULL, '$cdate', '$ddate', '$project', '$description', '$originator', NULL, NULL, '$invalid',  '$type', '$status');";
            if (mysqli_query($con, $sql)) 
            {
                $_SESSION['did'] = mysqli_insert_id($con);
                writeLog($con, $_SESSION["fname"], "Has created a new discrepancy");

            }
            else
            {
                    writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }
                
            
    }
    else
    {
            if ($status === "Lukket") {$closedby = $_SESSION['name'];}else{$closedby = NULL;}
            $sql = "UPDATE `discrepancy` SET `cdate`='$cdate',`ddate`='$ddate', `location`='$project', `description`='$description', `closedby`='$closedby', `type`='$type', `status`='$status' WHERE `id` = '$id'";
            if (mysqli_query($con, $sql)) 
            {
                    $_SESSION['did'] = mysqli_insert_id($con);
                    writeLog($con, $_SESSION["fname"], "Has updated a discrepancy");

            } 
            else 
            {
                     writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }
    }
}

function setConnectedtask($con, $discrepancyid, $taskid)
{
    if ($taskid != 0 || $taskid != NULL || $discrepancyid != 0 || $discrepancyid != NULL)
    {
         $sql = "UPDATE `discrepancy` SET `connectedtask`='$taskid' WHERE `id` = '$discrepancyid'";
         if (mysqli_query($con, $sql)) 
            {
                    writeLog($con, $_SESSION["fname"], "Have added taskconnection to a discrepancy");
            } 
            else 
            {
               writeLog($con, $_SESSION["fname"], "Error: Failed to add taskconnection to discrepancy: " . $sql . "" . mysqli_error($con));
            }
    }
} 



function setToolstatus($con, $id, $status)
{
    if ($status === "return")
    {
         $sql = "UPDATE `tools` SET `inuse`='0' WHERE `id` = '$id'";
         if (mysqli_query($con, $sql)) 
            {
                    writeLog($con, $_SESSION["fname"], "Have returned a tool");
                    writeToollog($con, $id, $_SESSION["name"], "Lagt tilbake på lager");
            } 
            else 
            {
               writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }
    }
    elseif($status === "claim")
    {
        $user = $_SESSION["name"];
        $sql = "UPDATE `tools` SET `inuse`='1', `user`='$user' WHERE `id` = '$id'";
         if (mysqli_query($con, $sql)) 
            {
                    writeLog($con, $_SESSION["fname"], "Have clamed a tool");
                    writeToollog($con, $id, $_SESSION["name"], "Har lånt verktøyet");
            } 
            else 
            {
                    writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }
    }


} 

function setLockstatus($con, $id, $status)
{
    if ($status === "lock")
    {
         $sql = "UPDATE `writeprotect` SET `status`='Låst' WHERE `id` = '$id'";
         if (mysqli_query($con, $sql)) 
            {
                    writeLog($con, $_SESSION["fname"], "Have locked a month");
            } 
            else 
            {
               writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
            }
    }
} 

function getLockstatus($con, $date)
{
    $checkmonth = date('m-Y', strtotime($date));
    $lockstatus = 0;
    $sql = "SELECT * FROM `writeprotect` ORDER BY month DESC";   
        $result = $con->query($sql);
                if ($result->num_rows > 0) 
                {
                        while($row = $result->fetch_assoc()) 
                        {
                                $id = $row["id"];
                                $month = date('m-Y', strtotime($row["month"]));
                                $status  = $row["status"];
                                if ($checkmonth === $month AND $status === "Låst")
                                {
                                    $lockstatus = 1;
                                }

                        }
                    
                } 
                else 
                {                 
                } 
                return $lockstatus;
} 


function editTask($con, $mode, $id) 
{
    if ($mode === "new")  //gather values for a new task
    { 
        $id = NULL;
        $who = $_SESSION['name'];
        $projectid = "";
        $projectname = "Velg bygg : ";
        $ddate = date('Y-m-d H:00:00');
        $priority = "Avtalt tid";
        $description = "";
        $recipient = "";

        renderTaskform($con, $mode, $id, $who, $projectid, $projectname, $recipient, $ddate, $priority, $description);

    }
    elseif ($mode === "away")  //gather values for a new task
    { 
        $id = NULL;
        $who = $_SESSION['name'];
        $projectid = "";
        $projectname = "Velg bygg : ";
        $ddate = date('Y-m-d H:00:00');
        $priority = "Avtalt tid";
        $description = "";
        $recipient = "";

        renderTaskform($con, $mode, $id, $who, $projectid, $projectname, $recipient, $ddate, $priority, $description);

    }
    elseif ($mode === "edit")  //get values from database and present in form, allowing change
    {
            $result = getTask($con, $id);
            if ($result->num_rows > 0) 
                    {
                            while($row = $result->fetch_assoc()) 
                            {   
                                    $id = $row["id"];
                                    $projectname = getProjectname($con, $row["location"]);
                                    $ddate = $row["ddate"];
                                    $projectid = $row["location"];
                                    $recipient = $row["recipient"];
                                    $user = $row["who"];
                                    $who = $row["who"];
                                    $priority = $row["priority"];
                                    $description = $row["description"];
                            }
                    }   
            renderTaskform($con, $mode, $id, $who, $projectid, $projectname, $recipient, $ddate, $priority, $description);     
    }
    elseif ($mode === "sign")  // get values from the database and present in the close section of the form.
    {   
        $result = getTask($con, $id);
        if ($result->num_rows > 0) 
                {
                        while($row = $result->fetch_assoc()) 
                        {
                                if (isset($row["who"]) && isset($row["location"]))
                                {
                                    $username = $row["who"];
                                    $projectname = getProjectname($con, $row["location"]);

                                    if (isset($row["comment"]))
                                    {
                                        $comment = $row["comment"];
                                    }
                                    else
                                    {
                                        $comment = "";
                                    }
                                    if (isset($row["stopt"]))
                                    {
                                        $stopdate = date('Y-m-d', strtotime($row["stopt"]));
                                    }
                                    else
                                    {
                                        $stopdate = date('Y-m-d');
                                    }
                                    if (isset($row["startt"]))
                                    {
                                        $starttime = date('H:i', strtotime($row["startt"]));
                                    }
                                    else
                                    {
                                        $starttime = "12:00";
                                    }
                                    if (isset($row["stopt"]))
                                    {
                                        $stoptime = date('H:i', strtotime($row["stopt"]));
                                    }
                                    else
                                    {
                                        $stoptime = "12:00";
                                    }
                                }
                                else
                                {
                                    renderError("Error", "Mangler innhold fra databasen, får ikke lukket oppgaven");
                                }           
                                
                        }
                } 
                else
                {
                        renderInfo("Error", "Mangler innhold fra databasen, får ikke lukket oppgaven (edittask)");
                        writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
                } 

        signTaskform($con, $id, $username, $project, $comment, $stopdate, $starttime, $stoptime);     
    }

    elseif ($mode === "invalid")  // handle the onbutonpress action to set the invalid flag for a task. 
    {
        $invalid = 1;
        $sql = "UPDATE task SET invalid = '$invalid' WHERE id = '$id'";
        if(mysqli_query($con, $sql))  
        {
              writeLog($con, $_SESSION["fname"], "has made task " . $id . " invalid");
              header("Location: index.php");
        } 
        else 
        {
               renderInfo("Error", "Error: det blei no tull " . $id . " " . mysqli_error($con));
               writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
        }
        
    }
    else
    {
        renderInfo("Error", "editTask is in exeption");
        writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
    }

}



function editDiscrepancy($con, $mode, $id) 
{
    if ($mode === "new")  //gather values for a new task
    { 
        $id = NULL;
        $project = "92";
        $cdate = date('Y-m-d');
        $ddate = date('Y-m-d');
        $ddate = date('Y-m-d', strtotime($ddate . ' +1 day'));
        $description = "";
        $type = "";
        $status = "";
        renderDiscrepancyform($con, $mode, $id, $cdate, $ddate, $project, $description, $type, $status);

    }
    elseif ($mode === "edit")  //get values from database and present in form, allowing change
    {
            $result = getDiscrepancy($con, $id);
            if ($result->num_rows > 0) 
                    {
                            while($row = $result->fetch_assoc()) 
                            {   
                                    $id = $row["id"];
                                    $projectname = getProjectname($con, $row["location"]);
                                    $project = $row["location"];
                                    $cdate = $row["cdate"];
                                    $ddate = $row["ddate"];
                                    $description = $row["description"];
                                    $type = $row["type"];
                                    $status = $row["status"];
                            }
                    }   
            renderDiscrepancyform($con, $mode, $id, $cdate, $ddate, $project, $description, $type, $status);    
    }
    
    elseif ($mode === "invalid")  // handle the onbutonpress action to set the invalid flag for a task. 
    {
        $invalid = 1;
        $sql = "UPDATE discrepancy SET invalid = '$invalid' WHERE id = '$id'";
        if(mysqli_query($con, $sql))  
        {
              writeLog($con, $_SESSION["fname"], "has made discrepancy " . $id . " invalid");
              header("Location: index.php");
        } 
        else 
        {
               renderError("Error", "Error: Det har skedd en feil med avvik " . $id . " " . mysqli_error($con));
        }
        
    }
    else
    {
        renderError("Error", "Systemfeil, endre avvik. Adrministrator er varslet");
        writeLog($con, $_SESSION["fname"], "Error: " . $sql . "" . mysqli_error($con));
    }

}

?>