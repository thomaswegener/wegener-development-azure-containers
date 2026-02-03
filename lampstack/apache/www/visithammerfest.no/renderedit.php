<?php
error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);
require_once('function.php');
$con = connect(); 


//  Login

function renderLogin()
{
?>

<br><br><br><br>
<section class="form wd-short" id="formbuilder-6">
    
    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
<!---Formbuilder Form--->
            <form action="login.php" method="post">
<div class="dragArea form-row">
<div class="col-lg-12">
<h4 class="mbr-fonts-style display-5">Logg inn med brukernavn og passord</h4>
</div>
<div class="col-lg-12">
<hr>
</div>
<div data-for="username" class="col-lg-6 form-group">
<input type="text" name="username" placeholder="Brukernavn" data-form-field="username" class="form-control display-7" value="
<?php if (isset($_COOKIE['user'])){echo $_COOKIE['user'];}?>


" id="username-formbuilder-6">
</div>
<div data-for="password" class="col-lg-6 form-group">
<input type="password" name="password" placeholder="Passord" data-form-field="password" class="form-control display-7" value="" id="password-formbuilder-6">
</div>
<div class="col-auto"><button type="submit" class="btn btn-black display-7">Logg inn</button></div>
</div>
</form><!---Formbuilder Form--->
</div>
    </div>
</section>
<br><br><br><br>

<?php
}
function renderLogout()
{
?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>     
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <form action="" method="POST" class="mbr-form form-wrapper form-with-styler">
            <div class="col-lg-12 btn-group">
                <button type="submit" name="logout" class="btn btn-black display-7">Avslutt redigeringsmodus / Logg ut</button>
            </div>           
            </form>
        </div>
    </div>
</section><br><br> 
<?php
}

//  Activity

function renderEditactivity($con, $id)
{
?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
                    <div class="container">
                        <div class="col-lg-8 mx-auto mbr-form">
                            <h4 class="mbr-fonts-style display-5">Edit activity</h4>


<?php
        $sql = "SELECT * FROM `activity` WHERE `id` = '$id'";
        $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row["id"];
                $pid = $row["pid"];
                $active = (int)$row["active"];
                $name = $row["name"]; 
                $nname = $row["nname"]; 
                $short = $row["short"]; 
                $nshort = $row["nshort"]; 
                $category = unserialize($row['type']);
                $season = unserialize($row['season']);
                $location = unserialize($row['location']);
                $map = $row["map"];
                $link = $row["link"]; 
                $capacity = $row["capacity"]; 
                $body = $row["body"]; 
                $nbody = $row["nbody"];

                if (!isset($category) || !is_array($category)) 
                {
                    $category = [];
                }

                 if (!isset($season) || !is_array($season)) 
                {
                    $season = [];
                }


                if (!isset($location) || !is_array($location)) 
                {
                    $location = [];
                }

               

                $categoryOptions = ["Activities", "Accommodation", "Adventures", "DMC", "Entertainment", "Festivals", "Food", "Transport", "Fishing", "Shopping"];
                $locationOptions = ["Alta", "Akkarfjord", "Hammerfest", "Havøysund", "Ingøy", "Kokelv", "Porsanger", "Rolvsøy", "Seiland", "Skaidi", "Sørøya"];
                $seasonOptions = ["Winter", "Summer"];

?>  
                <br><br>
                <form action="" method="POST" class="mbr-form form-wrapper form-with-styler" enctype="multipart/form-data">
                <div class="form-row">
                </div>
                <div class="dragArea form-row">

                <div class="col-lg-12 form-group">
                    <div class="form-check">
                        <!-- Use value="1" for checked state, and omit value for unchecked state (sends 0) -->
                        <input type="hidden" name="active" value="0">
                        <input type="checkbox" class="form-check-input" name="active" id="active-checkbox" value="1" <?php echo $active === 1 ? 'checked' : ''; ?>>
                        <label class="form-check-label" for="active-checkbox">Active</label>
                    </div>
                </div>

                <div data-for="name" class="col-lg-12 form-group">
                    <input type="hidden" name="id" value="<?php echo $id?>">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Name</label>
                    <input type="name" name="name" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo html_entity_decode($name);} ?>" id="name-formbuilder-15">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Navn</label>
                    <input type="nname" name="nname" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($nname)) {echo html_entity_decode($nname);} ?>" id="name-formbuilder-15">
                </div>
                
                <div data-for="type" class="col-lg-6 col-md-12 col-sm-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Partner / Aktør</label>
                    <select name="pid" data-form-field="type" class="form-control display-7" id="type-formbuilder-1f">
                        <option value="<?php if (isset($pid)) {echo htmlspecialchars($pid);} ?>"><?php echo getPartnerName($con, $pid);?></option>
                        <?php getDropdownPartners($con);?> 
                    </select>
                </div>

                <div class="col-lg-12 form-group" data-for="short">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Short descriptiop</label>
                <textarea name="short" placeholder="" data-form-field="body" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($short)) {echo html_entity_decode($short);} ?></textarea>
                </div>

                <div class="col-lg-12 form-group" data-for="nshort">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Kort beskrivelse</label>
                <textarea name="nshort" placeholder="" data-form-field="nshort" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($nshort)) {echo html_entity_decode($nshort);} ?></textarea>
                </div>

                <div data-for="category" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="category-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Category</label>
                    <select name="category[]" data-form-field="category" class="form-control display-7 multi-select" id="category-formbuilder-15" multiple>
                        <?php foreach ($categoryOptions as $categoryoption): ?>
                            <option value="<?php echo $categoryoption; ?>" <?php echo isSelected($categoryoption, $category); ?>><?php echo ucfirst($categoryoption); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div data-for="location" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="location-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Location</label>
                    <select name="location[]" data-form-field="target" class="form-control display-7 multi-select" id="location-formbuilder-15" multiple>
                        <?php foreach ($locationOptions as $locationoption): ?>
                            <option value="<?php echo $locationoption; ?>" <?php echo isSelected($locationoption, $location); ?>><?php echo ucfirst($locationoption); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div data-for="season" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="target-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Season</label>
                    <select name="season[]" data-form-field="season" class="form-control display-7 multi-select" id="target-formbuilder-15" multiple>
                        <?php foreach ($seasonOptions as $seasonoption): ?>
                            <option value="<?php echo $seasonoption; ?>" <?php echo isSelected($seasonoption, $season); ?>><?php echo ucfirst($seasonoption); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="col-lg-12 form-group" data-for="map">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Map (google maps iFrame)</label>
                <textarea name="map" placeholder="" data-form-field="map" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($map)) {echo html_entity_decode($map);} ?></textarea>
                </div>

                <div data-for="link" class="col-lg-12 form-group">
                <label for="link-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Link</label>
                <input type="text" name="link" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($link)) {echo htmlspecialchars($link);} ?>" id="link-formbuilder-15">
                </div>

                <div data-for="capacity" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Capacity (Eks: "10-16 pax")</label>
                    <input type="capacity" name="capacity" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($capacity)) {echo html_entity_decode($capacity);} ?>" id="name-formbuilder-15">
                </div>

                <div class="col-lg-12 form-group">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Description</label>
                <div id="editor1"><?php echo html_entity_decode($body); ?></div>
                <input type="hidden" name="body" id="content-field1">
                </div>
                

                <div class="col-lg-12 form-group">
                <label for="nbody-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Beskrivelse</label>
                <div id="editor2"><?php echo html_entity_decode($nbody); ?></div>
                <input type="hidden" name="nbody" id="content-field2">
                </div>


                
                <div class="col-lg-12 btn-group">
                <button type="submit" name="updateActivity" class="btn btn-black display-7">Oppdater</button>
                <button type="submit" name="deleteActivity" class="btn btn-primary display-7">Slett</button>
                </div>
                
                </div>
                </form>
                <br><br>
<?php
            }
        } 
        else 
        {
             
        } 
?>

                
                </div>
                    </div>
                </section><br><br> 
<?php
}
function renderAddactivity($type)
{   ?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <h4 class="mbr-fonts-style display-5"></h4>
                                
            <form action="" method="POST" class="mbr-form form-wrapper form-with-styler">
                <div class="col-lg-12 btn-group">
                    <input type="hidden" name="type" value="<?php echo $type?>">
                    <button type="submit" name="addActivity" class="btn btn-black display-7">Legg til Aktivitet</button>
                </div>      
            </form>
        </div>
    </div>
</section><br><br>

    <?php
}
function renderListActivities($con)
{
    $tableName = 'activity';
    $columns = ['id', 'name', 'pid'];

    renderTable($con, $tableName, $columns);
}

//  Partner

function renderEditpartner($con, $id)
{
?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
                    <div class="container">
                        <div class="col-lg-8 mx-auto mbr-form">
                            <h4 class="mbr-fonts-style display-5">Edit partner</h4>


<?php
        $sql = "SELECT * FROM `partner` WHERE `id` = '$id'";
        $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row['id'];
                $active = (int)$row['active'];
                $name = $row['name'];
                $facebook = $row['facebook'];
                $twitter = $row['twitter'];
                $instagram = $row['instagram'];
                $youtube = $row['youtube'];
                $adress = $row['adress'];
                $email = $row['email'];
                $phone = $row['phone'];
                $website = $row['website'];
                $category = unserialize($row['category']);
                $target = unserialize($row['target']);
                $location = unserialize($row['location']);
                $short = $row['short'];
                $nshort = $row['nshort'];
                $body = $row['description'];
                $nbody = $row['ndescription'];
                $button = $row['button'];
                $nbutton = $row['nbutton'];
                $button_link = $row['button_link'];
                $logo_png = $row['logo_png'];
                $image = $row['image'];
                $map = $row['map'];

                if (!isset($category) || !is_array($category)) 
                {
                    $category = [];
                }

                if (!isset($location) || !is_array($location)) 
                {
                    $location = [];
                }

                if (!isset($target) || !is_array($target)) 
                {
                    $target = [];
                }


                $categoryOptions = ["Activities", "Accommodation", "Adventures", "DMC", "Entertainment", "Festivals", "Food", "Transport", "Fishing", "Shopping"];
                $locationOptions = ["Alta", "Akkarfjord", "Hammerfest", "Havøysund", "Ingøy", "Kokelv", "Porsanger", "Rolvsøy", "Seiland", "Skaidi", "Sørøya"];
                $targetOptions = ["Family", "Friends", "Companies", "Adventurous couples", "Local treasures"];


?>  
                <br><br>
                <form action="" method="POST" class="mbr-form form-wrapper form-with-styler" enctype="multipart/form-data">
                <div class="form-row">
                </div>
                <div class="dragArea form-row">

                <div class="col-lg-12 form-group">
                    <div class="form-check">
                        <!-- Use value="1" for checked state, and omit value for unchecked state (sends 0) -->
                        <input type="hidden" name="active" value="0">
                        <input type="checkbox" class="form-check-input" name="active" id="active-checkbox" value="1" <?php echo $active === 1 ? 'checked' : ''; ?>>
                        <label class="form-check-label" for="active-checkbox">Active</label>
                    </div>
                </div>




                <div data-for="name" class="col-lg-12 form-group">
                    <input type="hidden" name="id" value="<?php echo $id?>">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Name - <?php echo $id?></label>
                    <input type="text" name="name" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo html_entity_decode($name);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="facebook" class="col-lg-12 form-group">
                    <label for="facebook-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Facebook link</label>
                    <input type="url" name="facebook" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($facebook)) {echo html_entity_decode($facebook);} ?>" id="facebook-formbuilder-15">
                </div>


                <div data-for="twitter" class="col-lg-12 form-group">
                    <label for="twitter-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Twitter link</label>
                    <input type="url" name="twitter" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($twitter)) {echo html_entity_decode($twitter);} ?>" id="twitter-formbuilder-15">
                </div>


                <div data-for="instagram" class="col-lg-12 form-group">
                    <label for="instagram-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Instagram link</label>
                    <input type="url" name="instagram" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($instagram)) {echo html_entity_decode($instagram);} ?>" id="instagram-formbuilder-15">
                </div>


                <div data-for="youtube" class="col-lg-12 form-group">
                    <label for="youtube-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Youtube link</label>
                    <input type="url" name="youtube" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($youtube)) {echo html_entity_decode($youtube);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="adress" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Adress</label>
                    <input type="text" name="adress" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($adress)) {echo html_entity_decode($adress);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="email" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">E-mail</label>
                    <input type="text" name="email" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($email)) {echo html_entity_decode($email);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="phone" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Phone</label>
                    <input type="text" name="phone" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($phone)) {echo html_entity_decode($phone);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="website" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Website</label>
                    <input type="text" name="website" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo html_entity_decode($website);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="category" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="category-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Category</label>
                    <select name="category[]" data-form-field="category" class="form-control display-7 multi-select" id="category-formbuilder-15" multiple>
                        <?php foreach ($categoryOptions as $categoryoption): ?>
                            <option value="<?php echo $categoryoption; ?>" <?php echo isSelected($categoryoption, $category); ?>><?php echo $categoryoption; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div data-for="location" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="location-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Location</label>
                    <select name="location[]" data-form-field="target" class="form-control display-7 multi-select" id="location-formbuilder-15" multiple>
                        <?php foreach ($locationOptions as $locationoption): ?>
                            <option value="<?php echo $locationoption; ?>" <?php echo isSelected($locationoption, $location); ?>><?php echo $locationoption; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div data-for="target" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="target-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Target</label>
                    <select name="target[]" data-form-field="target" class="form-control display-7 multi-select" id="target-formbuilder-15" multiple>
                        <?php foreach ($targetOptions as $targetoption): ?>
                            <option value="<?php echo $targetoption; ?>" <?php echo isSelected($targetoption, $target); ?>><?php echo $targetoption; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                                
                <div class="col-lg-12 form-group" data-for="short">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Short description</label>
                <textarea name="short" placeholder="" data-form-field="body" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($short)) {echo html_entity_decode($short);} ?></textarea>
                </div>

                <div class="col-lg-12 form-group" data-for="nshort">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Kort beskrivelse</label>
                <textarea name="nshort" placeholder="" data-form-field="nshort" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($nshort)) {echo html_entity_decode($nshort);} ?></textarea>
                </div>

                <div class="col-lg-12 form-group">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Description</label>
                <div id="editor1"><?php echo html_entity_decode($body); ?></div>
                <input type="hidden" name="body" id="content-field1">
                </div>
                

                <div class="col-lg-12 form-group">
                <label for="nbody-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Beskrivelse</label>
                <div id="editor2"><?php echo html_entity_decode($nbody); ?></div>
                <input type="hidden" name="nbody" id="content-field2">
                </div>


                <div data-for="button" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button text</label>
                    <input type="text" name="capacity" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button)) {echo html_entity_decode($button);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="nbutton" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Knapp tekst</label>
                    <input type="text" name="nbutton" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($nbutton)) {echo html_entity_decode($nbutton);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="button_link" class="col-lg-12 form-group">
                <label for="button_link-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button Link</label>
                <input type="text" name="button_link" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button_link)) {echo html_entity_decode($button_link);} ?>" id="link-formbuilder-15">
                </div>


                <div data-for="logo_png" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Lenke til logo</label>
                    <input type="text" name="logo_png" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($logo_png)) {echo html_entity_decode($logo_png);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="image" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Main Image</label>
                    <input type="text" name="image" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($image)) {echo html_entity_decode($image);} ?>" id="name-formbuilder-15">
                </div>


                <div class="col-lg-12 form-group" data-for="map">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Map (google maps iFrame)</label>
                <textarea name="map" placeholder="" data-form-field="map" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($map)) {echo html_entity_decode($map);} ?></textarea>
                </div>

                

                

                


                
                <div class="col-lg-12 btn-group">
                <button type="submit" name="updatePartner" class="btn btn-black display-7">Oppdater</button>
                <button type="submit" name="deletePartner" class="btn btn-primary display-7">Slett</button>
                </div>
                
                </div>
                </form>
                <br><br>
<?php
            }
        } 
        else 
        {
             
        } 
?>

                
                </div>
                    </div>
                </section><br><br> 
<?php
}
function renderAddpartner($type)
{   ?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <h4 class="mbr-fonts-style display-5"></h4>
                                
            <form action="" method="POST" class="mbr-form form-wrapper form-with-styler">
                <div class="col-lg-12 btn-group">
                    <input type="hidden" name="type" value="<?php echo $type?>">
                    <button type="submit" name="addPartner" class="btn btn-black display-7">Legg til aktør</button>
                </div>      
            </form>
        </div>
    </div>
</section><br><br>

    <?php
}
function renderListPartners($con)
{
    $tableName = 'partner';
    $columns = ['id', 'name', 'email'];

    renderTable($con, $tableName, $columns);
}

//  Store

function renderEditstore($con, $id)
{
?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
                    <div class="container">
                        <div class="col-lg-8 mx-auto mbr-form">
                            <h4 class="mbr-fonts-style display-5">Edit store</h4>


<?php
        $sql = "SELECT * FROM `store` WHERE `id` = '$id'";
        $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row['id'];
                $active = (int)$row['active'];
                $name = $row['name'];
                $facebook = $row['facebook'];
                $twitter = $row['twitter'];
                $instagram = $row['instagram'];
                $youtube = $row['youtube'];
                $adress = $row['adress'];
                $email = $row['email'];
                $phone = $row['phone'];
                $website = $row['website'];
                $category = unserialize($row['category']);
                $target = unserialize($row['target']);
                $location = unserialize($row['location']);
                $short = $row['short'];
                $nshort = $row['nshort'];
                $body = $row['description'];
                $nbody = $row['ndescription'];
                $button = $row['button'];
                $nbutton = $row['nbutton'];
                $button_link = $row['button_link'];
                $logo_png = $row['logo_png'];
                $image = $row['image'];
                $map = $row['map'];

                if (!isset($category) || !is_array($category)) 
                {
                    $category = [];
                }

                if (!isset($location) || !is_array($location)) 
                {
                    $location = [];
                }

                if (!isset($target) || !is_array($target)) 
                {
                    $target = [];
                }


                $categoryOptions = ["Activities", "Accommodation", "Adventures", "DMC", "Entertainment", "Festivals", "Food", "Transport", "Fishing", "Shopping"];
                $locationOptions = ["Alta", "Akkarfjord", "Hammerfest", "Havøysund", "Ingøy", "Kokelv", "Porsanger", "Rolvsøy", "Seiland", "Skaidi", "Sørøya"];
                $targetOptions = ["Family", "Friends", "Companies", "Adventurous couples", "Local treasures"];


?>  
                <br><br>
                <form action="" method="POST" class="mbr-form form-wrapper form-with-styler" enctype="multipart/form-data">
                <div class="form-row">
                </div>
                <div class="dragArea form-row">

                <div class="col-lg-12 form-group">
                    <div class="form-check">
                        <!-- Use value="1" for checked state, and omit value for unchecked state (sends 0) -->
                        <input type="hidden" name="active" value="0">
                        <input type="checkbox" class="form-check-input" name="active" id="active-checkbox" value="1" <?php echo $active === 1 ? 'checked' : ''; ?>>
                        <label class="form-check-label" for="active-checkbox">Active</label>
                    </div>
                </div>




                <div data-for="name" class="col-lg-12 form-group">
                    <input type="hidden" name="id" value="<?php echo $id?>">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Name - <?php echo $id?></label>
                    <input type="text" name="name" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo html_entity_decode($name);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="facebook" class="col-lg-12 form-group">
                    <label for="facebook-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Facebook link</label>
                    <input type="url" name="facebook" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($facebook)) {echo html_entity_decode($facebook);} ?>" id="facebook-formbuilder-15">
                </div>


                <div data-for="twitter" class="col-lg-12 form-group">
                    <label for="twitter-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Twitter link</label>
                    <input type="url" name="twitter" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($twitter)) {echo html_entity_decode($twitter);} ?>" id="twitter-formbuilder-15">
                </div>


                <div data-for="instagram" class="col-lg-12 form-group">
                    <label for="instagram-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Instagram link</label>
                    <input type="url" name="instagram" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($instagram)) {echo html_entity_decode($instagram);} ?>" id="instagram-formbuilder-15">
                </div>


                <div data-for="youtube" class="col-lg-12 form-group">
                    <label for="youtube-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Youtube link</label>
                    <input type="url" name="youtube" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($youtube)) {echo html_entity_decode($youtube);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="adress" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Adress</label>
                    <input type="text" name="adress" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($adress)) {echo html_entity_decode($adress);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="email" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">E-mail</label>
                    <input type="text" name="email" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($email)) {echo html_entity_decode($email);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="phone" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Phone</label>
                    <input type="text" name="phone" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($phone)) {echo html_entity_decode($phone);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="website" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Website</label>
                    <input type="text" name="website" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo html_entity_decode($website);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="category" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="category-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Category</label>
                    <select name="category[]" data-form-field="category" class="form-control display-7 multi-select" id="category-formbuilder-15" multiple>
                        <?php foreach ($categoryOptions as $categoryoption): ?>
                            <option value="<?php echo $categoryoption; ?>" <?php echo isSelected($categoryoption, $category); ?>><?php echo $categoryoption; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div data-for="location" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="location-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Location</label>
                    <select name="location[]" data-form-field="target" class="form-control display-7 multi-select" id="location-formbuilder-15" multiple>
                        <?php foreach ($locationOptions as $locationoption): ?>
                            <option value="<?php echo $locationoption; ?>" <?php echo isSelected($locationoption, $location); ?>><?php echo $locationoption; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div data-for="target" class="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label for="target-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Target</label>
                    <select name="target[]" data-form-field="target" class="form-control display-7 multi-select" id="target-formbuilder-15" multiple>
                        <?php foreach ($targetOptions as $targetoption): ?>
                            <option value="<?php echo $targetoption; ?>" <?php echo isSelected($targetoption, $target); ?>><?php echo $targetoption; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                                
                <div class="col-lg-12 form-group" data-for="short">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Short description</label>
                <textarea name="short" placeholder="" data-form-field="body" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($short)) {echo html_entity_decode($short);} ?></textarea>
                </div>

                <div class="col-lg-12 form-group" data-for="nshort">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Kort beskrivelse</label>
                <textarea name="nshort" placeholder="" data-form-field="nshort" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($nshort)) {echo html_entity_decode($nshort);} ?></textarea>
                </div>

                <div class="col-lg-12 form-group">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Description</label>
                <div id="editor1"><?php echo html_entity_decode($body); ?></div>
                <input type="hidden" name="body" id="content-field1">
                </div>
                

                <div class="col-lg-12 form-group">
                <label for="nbody-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Beskrivelse</label>
                <div id="editor2"><?php echo html_entity_decode($nbody); ?></div>
                <input type="hidden" name="nbody" id="content-field2">
                </div>


                <div data-for="button" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button text</label>
                    <input type="text" name="capacity" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button)) {echo html_entity_decode($button);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="nbutton" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Knapp tekst</label>
                    <input type="text" name="nbutton" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($nbutton)) {echo html_entity_decode($nbutton);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="button_link" class="col-lg-12 form-group">
                <label for="button_link-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button Link</label>
                <input type="text" name="button_link" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button_link)) {echo html_entity_decode($button_link);} ?>" id="link-formbuilder-15">
                </div>


                <div data-for="logo_png" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Lenke til logo</label>
                    <input type="text" name="logo_png" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($logo_png)) {echo html_entity_decode($logo_png);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="image" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Main Image</label>
                    <input type="text" name="image" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($image)) {echo html_entity_decode($image);} ?>" id="name-formbuilder-15">
                </div>


                <div class="col-lg-12 form-group" data-for="map">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Map (google maps iFrame)</label>
                <textarea name="map" placeholder="" data-form-field="map" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($map)) {echo html_entity_decode($map);} ?></textarea>
                </div>

                

                

                


                
                <div class="col-lg-12 btn-group">
                <button type="submit" name="updateStore" class="btn btn-black display-7">Oppdater</button>
                <button type="submit" name="deleteStore" class="btn btn-primary display-7">Slett</button>
                </div>
                
                </div>
                </form>
                <br><br>
<?php
            }
        } 
        else 
        {
             
        } 
?>

                
                </div>
                    </div>
                </section><br><br> 
<?php
}
function renderAddstore($type)
{   ?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <h4 class="mbr-fonts-style display-5"></h4>
                                
            <form action="" method="POST" class="mbr-form form-wrapper form-with-styler">
                <div class="col-lg-12 btn-group">
                    <input type="hidden" name="type" value="<?php echo $type?>">
                    <button type="submit" name="addStore" class="btn btn-black display-7">Legg til butikk</button>
                </div>      
            </form>
        </div>
    </div>
</section><br><br>

    <?php
}
function renderListStores($con)
{
    $tableName = 'store';
    $columns = ['id', 'name', 'email'];

    renderTable($con, $tableName, $columns);
}




//  Inspiration

function renderEditArticle($con, $id)
{
?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <h4 class="mbr-fonts-style display-5">Edit article</h4>


<?php
        $sql = "SELECT * FROM `article` WHERE `id` = '$id'";
        $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row['id'];
                $active = (int)$row["active"];
                $name = $row['name'];
                $nname = $row['nname'];
                $author = $row['author'];
                $date = $row['date'];
                $priority = $row['priority'];
                $short = $row['short'];
                $nshort = $row['nshort'];
                $body = $row['body'];
                $nbody = $row['nbody'];
                $button = $row['button'];
                $nbutton = $row['nbutton'];
                $button_link = $row['button_link'];
                $image = $row['image'];


?>  
                <br><br>
                <form action="" method="POST" class="mbr-form form-wrapper form-with-styler" enctype="multipart/form-data">
                    <div class="form-row"></div>
                    <div class="dragArea form-row">

                        <div class="col-lg-12 form-group">
                            <div class="form-check">
                                <!-- Use value="1" for checked state, and omit value for unchecked state (sends 0) -->
                                <input type="hidden" name="active" value="0">
                                <input type="checkbox" class="form-check-input" name="active" id="active-checkbox" value="1" <?php echo $active === 1 ? 'checked' : ''; ?>>
                                <label class="form-check-label" for="active-checkbox">Active</label>
                            </div>
                        </div>

                                        
                        <div data-for="type" class="col-lg-12 form-group">
                            <label for="type-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Type</label>
                            <select name="type" class="form-control display-7" id="type-formbuilder-15">
                                <option value="Inspiration">Inspiration</option>
                                <option value="Information">Information</option>
                            </select>
                        </div>

                        <div data-for="name" class="col-lg-12 form-group">
                        <input type="hidden" name="id" value="<?php echo $id?>">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Name</label>
                            <input type="text" name="name" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo $name;} ?>" id="name-formbuilder-15">
                        </div>

                        <div data-for="name" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Norsk navn</label>
                            <input type="text" name="nname" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($nname)) {echo $nname;} ?>" id="name-formbuilder-15">
                        </div>

                        <div data-for="name" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Author / Forfatter</label>
                            <input type="text" name="author" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($author)) {echo $author;} ?>" id="name-formbuilder-15">
                        </div>

                        <div data-for="date" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Date</label>
                            <input type="date" name="date" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($date)) {echo $date;} ?>" id="name-formbuilder-15">
                        </div>

                        <div data-for="priority" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Priority</label>
                            <input type="number" name="priority" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($priority)) {echo $priority;} ?>" id="name-formbuilder-15">
                        </div>

                        <div class="col-lg-12 form-group" data-for="short">
                        <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Short description</label>
                        <textarea name="short" placeholder="" data-form-field="body" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($short)) {echo html_entity_decode($short);} ?></textarea>
                        </div>

                        <div class="col-lg-12 form-group" data-for="nshort">
                        <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Kort beskrivelse</label>
                        <textarea name="nshort" placeholder="" data-form-field="nshort" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($nshort)) {echo html_entity_decode($nshort);} ?></textarea>
                        </div>
                        
                        <div class="col-lg-12 form-group">
                        <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Article</label>
                        <div id="editor1"><?php echo html_entity_decode($body); ?></div>
                        <input type="hidden" name="body" id="content-field1">
                        </div>
                        

                        <div class="col-lg-12 form-group">
                        <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Artikkel</label>
                        <div id="editor2"><?php echo html_entity_decode($nbody); ?></div>
                        <input type="hidden" name="nbody" id="content-field2">
                        </div>
                                        
                        <div data-for="button" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button</label>
                            <input type="text" name="button" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button)) {echo $button;} ?>" id="name-formbuilder-15">
                        </div>

                        <div data-for="nbutton" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Norsk knapp</label>
                            <input type="text" name="nbutton" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($nbutton)) {echo $nbutton;} ?>" id="name-formbuilder-15">
                        </div>
                        
                        <div data-for="name" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button Link</label>
                            <input type="text" name="button_link" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button_link)) {echo $button_link;} ?>" id="name-formbuilder-15">
                        </div>

                        <div data-for="image" class="col-lg-12 form-group">
                            <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Link to main image</label>
                            <input type="text" name="image" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($image)) {echo $image;} ?>" id="name-formbuilder-15">
                        </div>
                
                    <div class="col-lg-12 btn-group">
                    <button type="submit" name="updateArticle" class="btn btn-black display-7">Oppdater</button>
                    <button type="submit" name="deleteArticle" class="btn btn-primary display-7">Slett</button>
                    </div>
                
                </div>
            </form>
    
<br><br>
<?php
            }
        } 
        else 
        {
             
        } 
?>

                
        </div>
    </div>
</section><br><br> 
<?php
}
function renderAddArticle($type)
{   ?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <h4 class="mbr-fonts-style display-5"></h4>
                                
            <form action="" method="POST" class="mbr-form form-wrapper form-with-styler">
                <div class="col-lg-12 btn-group">
                    <input type="hidden" name="type" value="<?php echo $type?>">
                    <button type="submit" name="addArticle" class="btn btn-black display-7">Legg til artikkel</button>
                </div>      
            </form>
        </div>
    </div>
</section><br><br>

    <?php
}
function renderListArticles($con)
{
    $tableName = 'article';
    $columns = ['id', 'name', 'type'];

    renderTable($con, $tableName, $columns);
}

//  Information

function renderEditInformation($con, $id)
{
?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
                    <div class="container">
                        <div class="col-lg-8 mx-auto mbr-form">
                            <h4 class="mbr-fonts-style display-5">Edit Information</h4>


<?php
        $sql = "SELECT * FROM `information` WHERE `id` = 1";
        $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row['id'];
                $name = $row['name'];
                $facebook = $row['facebook'];
                $twitter = $row['twitter'];
                $instagram = $row['instagram'];
                $youtube = $row['youtube'];
                $adress = $row['adress'];
                $email = $row['email'];
                $website = $row['website'];
                $short = $row['short'];
                $nshort = $row['nshort'];
                $body = $row['description'];
                $nbody = $row['ndescription'];
                $button = $row['button'];
                $nbutton = $row['nbutton'];
                $button_link = $row['button_link'];
                $logo_png = $row['logo_png'];
                $image = $row['image'];
                $map = $row['map'];


?>  
                <br><br>
                <form action="" method="POST" class="mbr-form form-wrapper form-with-styler" enctype="multipart/form-data">
                <div class="form-row">
                </div>
                <div class="dragArea form-row">

                <div data-for="name" class="col-lg-12 form-group">
                    <input type="hidden" name="id" value="<?php echo $id?>">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Name - <?php echo $id?></label>
                    <input type="text" name="name" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo html_entity_decode($name);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="facebook" class="col-lg-12 form-group">
                    <label for="facebook-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Facebook link</label>
                    <input type="url" name="facebook" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($facebook)) {echo html_entity_decode($facebook);} ?>" id="facebook-formbuilder-15">
                </div>


                <div data-for="twitter" class="col-lg-12 form-group">
                    <label for="twitter-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Twitter link</label>
                    <input type="url" name="twitter" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($twitter)) {echo html_entity_decode($twitter);} ?>" id="twitter-formbuilder-15">
                </div>


                <div data-for="instagram" class="col-lg-12 form-group">
                    <label for="instagram-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Instagram link</label>
                    <input type="url" name="instagram" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($instagram)) {echo html_entity_decode($instagram);} ?>" id="instagram-formbuilder-15">
                </div>


                <div data-for="youtube" class="col-lg-12 form-group">
                    <label for="youtube-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Youtube link</label>
                    <input type="url" name="youtube" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($youtube)) {echo html_entity_decode($youtube);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="adress" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Adress</label>
                    <input type="text" name="adress" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($adress)) {echo html_entity_decode($adress);} ?>" id="name-formbuilder-15">
                </div>


                <div data-for="email" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">E-mail</label>
                    <input type="text" name="email" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($email)) {echo html_entity_decode($email);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="website" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Website</label>
                    <input type="text" name="website" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($name)) {echo html_entity_decode($website);} ?>" id="name-formbuilder-15">
                </div>
                
                <div class="col-lg-12 form-group" data-for="short">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Opening hours</label>
                <textarea name="short" placeholder="" data-form-field="body" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($short)) {echo html_entity_decode($short);} ?></textarea>
                </div>

                <div class="col-lg-12 form-group" data-for="nshort">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Åpningstider</label>
                <textarea name="nshort" placeholder="" data-form-field="nshort" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($nshort)) {echo html_entity_decode($nshort);} ?></textarea>
                </div>

                <div class="col-lg-12 form-group">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Description</label>
                <div id="editor1"><?php echo html_entity_decode($body); ?></div>
                <input type="hidden" name="body" id="content-field1">
                </div>
                

                <div class="col-lg-12 form-group">
                <label for="nbody-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Beskrivelse</label>
                <div id="editor2"><?php echo html_entity_decode($nbody); ?></div>
                <input type="hidden" name="nbody" id="content-field2">
                </div>


                <div data-for="button" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button text</label>
                    <input type="text" name="button" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button)) {echo html_entity_decode($button);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="nbutton" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Knapp tekst</label>
                    <input type="text" name="nbutton" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($nbutton)) {echo html_entity_decode($nbutton);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="button_link" class="col-lg-12 form-group">
                <label for="button_link-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Button Link</label>
                <input type="text" name="button_link" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($button_link)) {echo html_entity_decode($button_link);} ?>" id="link-formbuilder-15">
                </div>


                <div data-for="logo_png" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Lenke til logo</label>
                    <input type="text" name="logo_png" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($logo_png)) {echo html_entity_decode($logo_png);} ?>" id="name-formbuilder-15">
                </div>

                <div data-for="image" class="col-lg-12 form-group">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Main Image</label>
                    <input type="text" name="image" placeholder="" data-form-field="text" class="form-control display-7" value="<?php if (isset($image)) {echo html_entity_decode($image);} ?>" id="name-formbuilder-15">
                </div>


                <div class="col-lg-12 form-group" data-for="map">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Map (google maps iFrame)</label>
                <textarea name="map" placeholder="" data-form-field="map" class="form-control display-7" value="" id="body-formbuilder-15"><?php if (isset($map)) {echo html_entity_decode($map);} ?></textarea>
                </div>
               
                <div class="col-lg-12 btn-group">
                <button type="submit" name="updateInformation" class="btn btn-black display-7">Oppdater</button>

                </div>
                
                </div>
                </form>
                <br><br>
<?php
            }
        } 
        else 
        {
             
        } 
?>

                
                </div>
                    </div>
                </section><br><br> 
<?php
}
function renderListFaq($con)
{
    $tableName = 'faq';
    $columns = ['id', 'nquestion', 'nanswer'];

    renderTable($con, $tableName, $columns);
}
function renderEditFaq($con, $id)
{
?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
                    <div class="container">
                        <div class="col-lg-8 mx-auto mbr-form">
                            <h4 class="mbr-fonts-style display-5">Edit FAQ</h4>


<?php
        $sql = "SELECT * FROM `faq` WHERE `id` = $id";
        $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row['id'];
                $category = $row['category'];
                $question = $row['question'];
                $nquestion = $row['nquestion'];                
                $answer = $row['answer'];
                $nanswer = $row['nanswer'];


?>  
                <br><br>
                <form action="" method="POST" class="mbr-form form-wrapper form-with-styler" enctype="multipart/form-data">
                <div class="form-row">
                </div>
                <div class="dragArea form-row">

                <div data-for="name" class="col-lg-12 form-group">
                    <input type="hidden" name="id" value="<?php echo $id?>">
                    <label for="name-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Category</label>
                    
                    <select name="category" class="form-control display-7" id="category-formbuilder-15">
                        <option value="Transportation" <?php echo ($category == "Transportation" ? "selected" : ""); ?>>Transportation</option>
                        <option value="General information" <?php echo ($category == "General information" ? "selected" : ""); ?>>General information</option>
                        <option value="Sights and city attractions" <?php echo ($category == "Sights and city attractions" ? "selected" : ""); ?>>Sights and city attractions</option>
                        <option value="Nature and Tours" <?php echo ($category == "Nature and Tours" ? "selected" : ""); ?>>Nature and Tours</option>
                        <option value="How do I get to?" <?php echo ($category == "How do I get to?" ? "selected" : ""); ?>>How do I get to?</option>
                    </select>
                </div>

                <div class="col-lg-12 form-group">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Question</label>
                <div id="editor1"><?php echo html_entity_decode($question); ?></div>
                <input type="hidden" name="question" id="content-field1">
                </div>
                

                <div class="col-lg-12 form-group">
                <label for="nbody-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Spørsmål</label>
                <div id="editor2"><?php echo html_entity_decode($nquestion); ?></div>
                <input type="hidden" name="nquestion" id="content-field2">
                </div>

                <div class="col-lg-12 form-group">
                <label for="body-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Answer</label>
                <div id="editor3"><?php echo html_entity_decode($answer); ?></div>
                <input type="hidden" name="answer" id="content-field3">
                </div>
                

                <div class="col-lg-12 form-group">
                <label for="nbody-formbuilder-15" class="form-control-label mbr-fonts-style display-7">Svar</label>
                <div id="editor4"><?php echo html_entity_decode($nanswer); ?></div>
                <input type="hidden" name="nanswer" id="content-field4">
                </div>
               
                <div class="col-lg-12 btn-group">
                <button type="submit" name="updateFAQ" class="btn btn-black display-7">Oppdater</button>

                </div>
                
                </div>
                </form>
                <br><br>
<?php
            }
        } 
        else 
        {
             
        } 
?>

                
                </div>
                    </div>
                </section><br><br> 
<?php
}

function renderAddFaq($type)
{   ?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <h4 class="mbr-fonts-style display-5"></h4>
                                
            <form action="" method="POST" class="mbr-form form-wrapper form-with-styler">
                <div class="col-lg-12 btn-group">
                    <input type="hidden" name="type" value="<?php echo $type?>">
                    <button type="submit" name="addFaq" class="btn btn-black display-7">Add FAQ</button>
                </div>      
            </form>
        </div>
    </div>
</section><br><br>

    <?php
}


//  Shared

function renderAddimage($con, $page, $id)
{   ?>
<section class="form cid-rJuKrJumFj" id="formbuilder-15"><br><br>    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
            <h4 class="mbr-fonts-style display-5"></h4>
                <form method="POST" class="mbr-form form-with-styler" enctype="multipart/form-data">
                    <div class="form-row">
                        <input hidden="hidden" type="text" name="id"  value="<?php echo $id;?>">
                        <input hidden="hidden" type="text" name="page"  value="<?php echo $page;?>">
                    </div>
                    <div class="dragArea form-row">
                    <div class="custom-file mb-12">
                        <input type="file" name="images[]" multiple accept="image/*" max-size="52428800"class="custom-file-input"multiple> 
                        <label for="file" class="custom-file-label">Chose files</label>                          
                    </div>
                    <?php 
                        $sql = "SELECT filename FROM files";
                        $result = mysqli_query($con, $sql);

                    getImagelinks($con, $page, $id);

                    ?>
                    <div class="col-lg-3">
                    <button type="submit" name="addImage" value="addImage" class="btn btn-black btn-block" formaction="">Last opp bilder</button>
                    </div>
                                                        
                </div>
            </form>
        </div>
    </div>
</section>
<br><br>

<?php
}
function renderTable($con, $tableName, $columns)
{
    ?>
    <section data-bs-version="5.1" class="table1 directm4_table1 section-table cid-tIQG8r14Jg" id="table1-t">
        <div class="container">
            <div class="media-container-row align-center">
                <div class="col-12 col-md-12">
                    <h2 class="mbr-section-title mbr-fonts-style mbr-black pb-3 display-2">
                        <br><br><?php echo ucfirst($tableName); ?>
                    </h2>

                    <div class="table-wrapper mt-5">
                        <div class="container">
                            <div class="row search">
                                <div class="col-md-6"></div>
                                <div class="col-md-6">
                                    <div class="dataTables_filter">
                                        <label class="searchInfo mbr-fonts-style display-7">Search:</label>
                                        <input class="form-control input-sm" disabled="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container scroll">
                            <table class="table mx-auto isSearch" cellspacing="0" data-empty="No matching records found">
                                <thead>
                                    <tr class="table-heads">
                                        <?php foreach ($columns as $column) { ?>
                                            <th class="head-item mbr-fonts-style mbr-bold display-4"><?php echo ucfirst($column); ?></th>
                                        <?php } ?>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <?php
                                        $sql = "SELECT * FROM `$tableName`";
                                        $result = $con->query($sql);
                                        if ($result->num_rows > 0) {
                                            while ($row = $result->fetch_assoc()) {
                                                foreach ($columns as $column) {
                                                    if ($column === 'id' && isset($row['active']) && (int)$row['active'] === 0) {   
                                                        ?>
                                                        <td class="body-item mbr-fonts-style display-4" style="color:red;"><?php echo $row[$column]; ?></td>
                                                        <?php
                                                    } elseif ($column === 'pid' && $tableName === 'activity') {
                                                        $partnerName = getPartnerName($con, $row['pid']);
                                                        ?>
                                                        <td class="body-item mbr-fonts-style display-4"><?php echo $partnerName; ?></td>
                                                        <?php
                                                    } else {
                                                        ?>
                                                        <td class="body-item mbr-fonts-style display-4"><?php echo html_entity_decode($row[$column]); ?></td>
                                                        <?php
                                                    }
                                                }
                                                ?>
                                                <td class="body-item mbr-fonts-style display-4"><a href="admin.php?page=<?php echo $tableName; ?>&id=<?php echo $row['id']; ?>">Edit/Rediger</a></td>
                                                </tr><tr>
                                                <?php
                                            }
                                        }
                                        ?>
                                </tbody>
                            </table>
                            <div class="container table-info-container">
                                <div class="row info justify-content-start  ">
                                    <div class="col-lg-6 col-md-12 p-0">
                                        <div class="dataTables_info mbr-fonts-style display-7">
                                            <span class="infoBefore">Showing</span>
                                            <span class="inactive infoRows"></span>
                                            <span class="infoAfter">entries</span>
                                            <span class="infoFilteredBefore">(filtered from</span>
                                            <span class="inactive infoRows"></span>
                                            <span class="infoFilteredAfter">total entries)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php
}



?>