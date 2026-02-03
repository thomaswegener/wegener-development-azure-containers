<?php
error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);
require_once('function.php');
$con = connect();   

function normalizeMediaUrl($url)
{
    if (!is_string($url)) {
        return $url;
    }

    $trimmed = trim($url);
    if ($trimmed === '') {
        return $trimmed;
    }

    $prefixes = [
        'https://dev.wegener.no/visithammerfest.no/',
        'http://dev.wegener.no/visithammerfest.no/',
        '//dev.wegener.no/visithammerfest.no/',
        'dev.wegener.no/visithammerfest.no/'
    ];

    foreach ($prefixes as $prefix) {
        if (stripos($trimmed, $prefix) === 0) {
            $trimmed = 'https://visithammerfest.no/' . substr($trimmed, strlen($prefix));
            break;
        }
    }

    return resolveMediaExtension($trimmed);
}

function resolveMediaExtension($url)
{
    if (!is_string($url)) {
        return $url;
    }

    $trimmed = trim($url);
    if ($trimmed === '') {
        return $trimmed;
    }

    $parts = parse_url($trimmed);
    if (!is_array($parts)) {
        $parts = [];
    }
    if (preg_match('#^[a-z][a-z0-9+.-]*://#i', $trimmed) || str_starts_with($trimmed, '//')) {
        $host = strtolower($parts['host'] ?? '');
        if ($host !== '' && !in_array($host, ['visithammerfest.no', 'www.visithammerfest.no'], true)) {
            return $trimmed;
        }
    }

    if (!isset($parts['path'])) {
        return $trimmed;
    }

    $path = $parts['path'];
    if ($path === '' || preg_match('/\\.[A-Za-z0-9]+$/', $path)) {
        return $trimmed;
    }

    $relativePath = ltrim($path, '/');
    $extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

    foreach ($extensions as $ext) {
        $candidate = $relativePath . $ext;
        if (is_file(__DIR__ . '/' . $candidate)) {
            $newPath = (str_starts_with($path, '/') ? '/' : '') . $candidate;
            $rebuilt = $newPath;
            if (isset($parts['query'])) {
                $rebuilt .= '?' . $parts['query'];
            }
            if (isset($parts['fragment'])) {
                $rebuilt .= '#' . $parts['fragment'];
            }
            return $rebuilt;
        }
    }

    return $trimmed;
}

function resolveLocalMediaPath($url)
{
    if (!is_string($url)) {
        return null;
    }

    $trimmed = trim($url);
    if ($trimmed === '') {
        return null;
    }

    $parts = parse_url($trimmed);
    if (!is_array($parts)) {
        $parts = [];
    }
    if (preg_match('#^[a-z][a-z0-9+.-]*://#i', $trimmed) || str_starts_with($trimmed, '//')) {
        $host = strtolower($parts['host'] ?? '');
        if ($host !== '' && !in_array($host, ['visithammerfest.no', 'www.visithammerfest.no'], true)) {
            return null;
        }
    }

    $path = $parts['path'] ?? $trimmed;
    if ($path === '' || str_contains($path, '..')) {
        return null;
    }

    $relative = ltrim($path, '/');
    return __DIR__ . '/' . $relative;
}

function resolveWebpVariant($url)
{
    if (!is_string($url)) {
        return null;
    }

    $trimmed = trim($url);
    if ($trimmed === '') {
        return null;
    }

    $parts = parse_url($trimmed);
    if (!is_array($parts)) {
        $parts = [];
    }
    $path = $parts['path'] ?? $trimmed;
    if (!preg_match('/\\.(jpe?g)$/i', $path)) {
        return null;
    }

    $webpPath = preg_replace('/\\.(jpe?g)$/i', '.webp', $path);
    $localPath = resolveLocalMediaPath($webpPath);
    if (!$localPath || !is_file($localPath)) {
        return null;
    }

    $rebuilt = $webpPath;
    if (isset($parts['query'])) {
        $rebuilt .= '?' . $parts['query'];
    }
    if (isset($parts['fragment'])) {
        $rebuilt .= '#' . $parts['fragment'];
    }

    return $rebuilt;
}

function renderPictureTag($src, $attrs = '')
{
    $normalized = resolveMediaExtension($src);
    $webp = resolveWebpVariant($normalized);
    $safeSrc = htmlspecialchars($normalized, ENT_QUOTES, 'UTF-8');
    $safeAttrs = trim($attrs);
    $attrSegment = $safeAttrs !== '' ? ' ' . $safeAttrs : '';

    if ($webp) {
        $safeWebp = htmlspecialchars($webp, ENT_QUOTES, 'UTF-8');
        return '<picture><source type="image/webp" srcset="' . $safeWebp . '"><img src="' . $safeSrc . '"' . $attrSegment . '></picture>';
    }

    return '<img src="' . $safeSrc . '"' . $attrSegment . '>';
}

//  Activity

function renderActivities($con, $language)
{

    $categoryLabel = ($language === 'no') ? 'Kategori:' : 'Category:';
    $locationLabel = ($language === 'no') ? 'Sted:' : 'Location:';
    $seasonLabel = ($language === 'no') ? 'Sesong:' : 'Season:';
    $applyFiltersLabel = ($language === 'no') ? 'Bruk filtre' : 'Apply Filters';

    $categoryOptions = [
        "Activities" => "Aktiviteter",
        "Accommodation" => "Overnatting",
        "Adventures" => "Eventyr",
        "DMC" => "DMC",
        "Entertainment" => "Underholdning",
        "Festivals" => "Festivaler",
        "Food" => "Mat",
        "Transport" => "Transport",
        "Fishing" => "Fiske",
        "Shopping" => "Handel"
    ];

    $locationOptions = [
        "Alta" => "Alta",
        "Akkarfjord" => "Akkarfjord",
        "Hammerfest" => "Hammerfest",
        "Havøysund" => "Havøysund",
        "Ingøy" => "Ingøy",
        "Kokelv" => "Kokelv",
        "Porsanger" => "Porsanger",
        "Rolvsøy" => "Rolvsøy",
        "Seiland" => "Seiland",
        "Skaidi" => "Skaidi",
        "Sørøya" => "Sørøya"
    ];

    $seasonOptions = [
        "Summer" => "Sommer",
        "Winter" => "Vinter"
    ];

    ?>
    <section data-bs-version="5.1" class="team1 cid-tHBvcdoEVv" id="team1-a">
        <div class="container">
            <div class="row justify-content-center">
                    <div class="col-md-3">
                        <div class="form-group">
                        <label for="activity_category" class="form-control-label mbr-fonts-style display-7"><?php echo $categoryLabel; ?></label>
                        <select id="activity_category" name="category" class="form-control display-7 multi-select" multiple>
                            
                            <?php
                            foreach ($categoryOptions as $value => $name) {
                                echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                            }
                            ?>
                        </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                        <label for="activity_location" class="form-control-label mbr-fonts-style display-7"><?php echo $locationLabel; ?></label>
                        <select id="activity_location" name="location" class="form-control display-7 multi-select" multiple>
                            
                            <?php
                            foreach ($locationOptions as $value => $name) {
                                echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                            }
                            ?>
                        </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                        <label for="activity_season" class="form-control-label mbr-fonts-style display-7"><?php echo $seasonLabel; ?></label>
                        <select id="activity_season" name="season" class="form-control display-7 multi-select" multiple>
                            
                            <?php
                            foreach ($seasonOptions as $value => $name) {
                                echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                            }
                            ?>
                        </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                        <button type="button" class="btn mt-3 btn-primary btn-block" onclick="applyActivityFilters()"><?php echo $applyFiltersLabel; ?></button>
                    </div>
                    </div>



                <br><br>
    <?php

                // Get the selected filter values
$category = isset($_GET['category']) ? explode(',', $_GET['category']) : [];
$location = isset($_GET['location']) ? explode(',', $_GET['location']) : [];
$season = isset($_GET['season']) ? explode(',', $_GET['season']) : [];

// Remove empty values from the arrays
$category = array_filter($category);
$location = array_filter($location);
$season = array_filter($season);

// Build the SQL query with filter conditions
$sql = "SELECT * FROM `activity` WHERE active = 1";
if (!empty($category)) {
    $category = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $category);
    $categoryCondition = "type LIKE '%" . implode("%' OR type LIKE '%", $category) . "%'";
    $sql .= " AND ($categoryCondition)";
}
if (!empty($location)) {
    $location = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $location);
    $locationCondition = "location LIKE '%" . implode("%' OR location LIKE '%", $location) . "%'";
    $sql .= " AND ($locationCondition)";
}
if (!empty($season)) {
    $season = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $season);
    $seasonCondition = "season LIKE '%" . implode("%' OR season LIKE '%", $season) . "%'";
    $sql .= " AND ($seasonCondition)";
}

$sql .= " ORDER BY rand()";
   
    $result = $con->query($sql);

        if ($result)
        {
            if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row["id"];
                $name = $row["name"]; 
                $nname = $row["nname"]; 
                $short = $row["short"]; 
                $nshort = $row["nshort"]; 
                $type = $row["type"]; 
                $season = $row["season"]; 
                $location = implode(', ', unserialize($row["location"]));
                $map = $row["map"];
                $link = normalizeMediaUrl($row["link"]); 
                $capacity = $row["capacity"]; 
                $body = $row["body"]; 
                $nbody = $row["nbody"];


                if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                {
                    renderActivitycard($id, $nname, $nshort, $location, $link, "Vis mer"); 
                }
                else
                {
                    renderActivitycard($id, $name, $short, $location, $link, "Read more"); 
                }
            }
        } 
        else 
        {
             
        } 
        }
        

        ?>
                </div>
            </div>
        </section>
<?php



}
function renderActivitycard($id, $name, $short, $location, $link, $button)
{?>


    
            
            <div class="col-sm-6 col-lg-4">
                <div class="card-wrap">
                    <div class="image-wrap" style="height: 250px;">
                        <?php echo renderPictureTag($link, 'alt="" style="object-fit: contain; height: 100%; width: 100%;"'); ?>
                    </div>
                    <div class="content-wrap">
                        <h5 class="mbr-section-title card-title mbr-fonts-style align-center m-0 display-5">
                            <strong><?php echo $name?></strong></h5>
                        <h6 class="mbr-role mbr-fonts-style align-center mb-3 display-4">
                            <strong><?php echo $location?></strong>
                        </h6>
                        <p class="card-text mbr-fonts-style align-center display-7"><?php echo $short?></p>
                        
                        <div class="mbr-section-btn card-btn align-center"><a class="btn btn-primary display-4" href="index.php?page=activity&id=<?php echo $id?>"><?php echo $button?></a></div>
                    </div>
                </div>
            </div>   

<?php
}
function renderActivity($con, $language, $id)
{ 
    
    $sql = "SELECT * FROM `activity` WHERE id = $id AND active = 1"; 
    $result = $con->query($sql);

        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row["id"];
                $pid = $row["pid"];
                $type = implode(', ', unserialize($row["type"])); 
                $season = implode(', ', unserialize($row["season"])); 
                $location = implode(', ', unserialize($row["location"]));
                $map = html_entity_decode($row["map"]); 
                $link = normalizeMediaUrl($row["link"]); 
                $capacity = $row["capacity"]; 
                if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                {
                    $name = html_entity_decode($row["nname"]);  
                    $short = html_entity_decode($row["nshort"]); 
                    $body = html_entity_decode($row["nbody"]); 
                }
                else
                {
                    
                    $name = html_entity_decode($row["name"]);  
                    $short = html_entity_decode($row["short"]); 
                    $body = html_entity_decode($row["body"]); 
                }
                $sql2 = "SELECT * FROM `partner` WHERE id = $pid"; 
                $result2 = $con->query($sql2);
                if ($result2)
                {
                if ($result2->num_rows > 0) 
                {
                    while($row2 = $result2->fetch_assoc()) 
                    {

                        $pname = $row2["name"]; 
                        $pmail = $row2["email"]; 
                        $pwebs = $row2["website"]; 

                        if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                        {  
                            $pshort = $row2["nshort"]; 
                            $details = "Detaljer:";
                            $locationline = "Lokasjon: " . $location;
                            $typeline = "Type aktivitet: " . ucfirst($type); 
                            $seasonline = "Sesong: " . ucfirst($season);
                            $capacityline = "Kapasitet: " . $capacity;
                        }
                        else
                        {
                            $pshort = $row2["short"]; 
                            $details = "Details:";    
                            $locationline = "Location: " . $location;  
                            $typeline = "Type of activity: " . ucfirst($type);
                            $seasonline = "Season: " . ucfirst($season);  
                            $capacityline = "Capacity: " . $capacity;
                        }
renderSlider($con, $id, "activity", $pname);
?>
<section data-bs-version="5.1" class="content5 cid-tIZaoeUabx" id="content5-16">
    
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                
                <h4 class="mbr-section-subtitle mbr-fonts-style mb-4 display-5"><?php echo $name;?></h4>
                <div class="display-7">
                <p class="mbr-text mbr-fonts-style"><?php echo $body;?></p>
                </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="content13 cid-tIZ8fgoytl" id="content13-11">  
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                <h3 class="mbr-section-title mbr-fonts-style mb-4 display-5">
                    <strong><?php echo $details;?></strong></h3>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-6">
                        <ul class="list mbr-fonts-style display-7">
                            <li><strong><?php echo $locationline;?></strong></li>
                            <li><strong><?php echo $typeline;?></strong></li>
                            <li><strong><?php echo $seasonline;?></strong></li>
                            <li><strong><?php echo $capacityline;?></strong></li>
                        </ul>
                    </div>
                    <div class="col-12 col-lg-6">
                        <ul class="list mbr-fonts-style display-7">
                            <strong><?php echo $pshort;?></strong>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="contacts3 map1 cid-tIZ8JAyrdG" id="contacts3-14">
    <div class="container">
        
        <div class="row justify-content-center mt-4">
            <div class="card col-12 col-md-6">
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont socicon-homeadvisor socicon"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5"><strong>E-mail</strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7"><a href="mailto:<?php echo $pmail; ?>" class="text-primary"><?php echo $pmail; ?></a></p>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont socicon-homeadvisor socicon"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5">
                            <strong>Website</strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7"><a href="<?php echo $pwebs; ?>" class="text-primary"><?php echo $pwebs; ?></a></p>
                    </div>
                </div>
            </div>
            <div class="map-wrapper col-12 col-md-6">
                <div class="google-map"><?php echo $map; ?></div>
            </div>
        </div>
    </div>
</section>


<?php  
                    }
                }
                }else
                {
                    renderInfo("Ingen kobling mot aktør", "Opprett en aktør som kan kobles mot aktivitet");
                }
             }
        }
}


//  Partner

function renderPartners($con, $language)
{ 
    $categoryLabel = ($language === 'no') ? 'Kategori:' : 'Category:';
    $locationLabel = ($language === 'no') ? 'Sted:' : 'Location:';
    $targetLabel = ($language === 'no') ? 'Målgruppe:' : 'Target:';
    $applyFiltersLabel = ($language === 'no') ? 'Bruk filtre' : 'Apply Filters';

    $categoryOptions = [
        "Activities" => "Aktiviteter",
        "Accommodation" => "Overnatting",
        "Adventures" => "Eventyr",
        "DMC" => "DMC",
        "Entertainment" => "Underholdning",
        "Festivals" => "Festivaler",
        "Food" => "Mat",
        "Transport" => "Transport",
        "Fishing" => "Fiske",
        "Shopping" => "Handel"

    ];

    $locationOptions = [
        "Alta" => "Alta",
        "Akkarfjord" => "Akkarfjord",
        "Hammerfest" => "Hammerfest",
        "Havøysund" => "Havøysund",
        "Ingøy" => "Ingøy",
        "Kokelv" => "Kokelv",
        "Porsanger" => "Porsanger",
        "Rolvsøy" => "Rolvsøy",
        "Seiland" => "Seiland",
        "Skaidi" => "Skaidi",
        "Sørøya" => "Sørøya"
    ];

    $targetOptions = [
        "Family" => "Familie",
        "Friends" => "Venner",
        "Companies" => "Bedrifter",
        "Adventurous couples" => "Eventyrlystne par",
        "Local treasures" => "Lokale skatter"
    ];

    ?>
    <section data-bs-version="5.1" class="team1 cid-tHBvcdoEVv" id="team1-a">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-3">
                <div class="form-group">
                    <label for="partner_category" class="form-control-label mbr-fonts-style display-7"><?php echo $categoryLabel; ?></label>
                    <select id="partner_category" name="category" class="form-control display-7 multi-select" multiple>
                        <?php
                        foreach ($categoryOptions as $value => $name) {
                            echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="partner_location" class="form-control-label mbr-fonts-style display-7"><?php echo $locationLabel; ?></label>
                    <select id="partner_location" name="location" class="form-control display-7 multi-select" multiple>
                        <?php
                        foreach ($locationOptions as $value => $name) {
                            echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="partner_target" class="form-control-label mbr-fonts-style display-7"><?php echo $targetLabel; ?></label>
                    <select id="partner_target" name="target" class="form-control display-7 multi-select" multiple>
                        <?php
                        foreach ($targetOptions as $value => $name) {
                            echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <!-- Move the button inside its own div and add "text-center" class to center the button -->
                        <button type="button" class="btn mt-3 btn-primary btn-block" onclick="applyPartnerFilters()"><?php echo $applyFiltersLabel; ?></button>
                </div>
            </div>
                <p></p>
    <?php

                // Get the selected filter values
$category = isset($_GET['category']) ? explode(',', $_GET['category']) : [];
$location = isset($_GET['location']) ? explode(',', $_GET['location']) : [];
$target = isset($_GET['target']) ? explode(',', $_GET['target']) : [];

// Remove empty values from the arrays
$category = array_filter($category);
$location = array_filter($location);
$target = array_filter($target);

// Build the SQL query with filter conditions
$sql = "SELECT * FROM `partner` WHERE active = 1";
if (!empty($category)) {
    $category = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $category);
    $categoryCondition = "category LIKE '%" . implode("%' OR category LIKE '%", $category) . "%'";
    $sql .= " AND ($categoryCondition)";
}
if (!empty($location)) {
    $location = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $location);
    $locationCondition = "location LIKE '%" . implode("%' OR location LIKE '%", $location) . "%'";
    $sql .= " AND ($locationCondition)";
}
if (!empty($target)) {
    $target = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $target);
    $targetCondition = "target LIKE '%" . implode("%' OR target LIKE '%", $target) . "%'";
    $sql .= " AND ($targetCondition)";
}

$sql .= " ORDER BY rand()";
                
    // Execute the filtered SQL query
    $result = $con->query($sql);
        if ($result)
        {
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
                $category = $row['category'];
                $target = $row['target'];
                $short = $row['short'];
                $nshort = $row['nshort'];
                $description = $row['description'];
                $ndescription = $row['ndescription'];
                $button = $row['button'];
                $nbutton = $row['nbutton'];
                $button_link = $row['button_link'];
                $logo_png = normalizeMediaUrl($row['logo_png']);
                $image = normalizeMediaUrl($row['image']);
                $map = $row['map'];
                if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                {
                    renderPartnercard($id, $name, $facebook, $twitter, $instagram, $youtube, $nshort, $image, "Vis mer"); 
                }
                else
                {
                    renderPartnercard($id, $name, $facebook, $twitter, $instagram, $youtube, $short, $image, "Read more"); 
                }
            }
        } 
        else 
        { 
            
        }
        } 
        ?>
                </div>
            </div>
        </section>
<?php

}
function renderPartnercard($id, $name, $facebook, $twitter, $instagram, $youtube, $short, $image, $button)
{?>
<div class="col-sm-6 col-lg-4">
    <div class="card-wrap">
        <div class="image-wrap" style="height: 250px;">
            <?php echo renderPictureTag($image, 'alt="" style="object-fit: contain; height: 100%; width: 100%;"'); ?>
        </div>
        <div class="content-wrap">
            <h5 class="mbr-section-title card-title mbr-fonts-style align-center m-0 display-5">
                <strong><?php echo $name; ?></strong>
            </h5>
            <h6 class="mbr-role mbr-fonts-style align-center mb-3 display-4">
                <strong></strong>
            </h6>
            <p class="card-text mbr-fonts-style align-center display-7">
                <?php echo $short; ?>
            </p>
            <div class="social-row display-7">
                <?php if (isset($facebook) && !empty($facebook)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $facebook; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-facebook"></span>
                        </a>
                    </div>
                <?php } ?>
                <?php if (isset($twitter) && !empty($twitter)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $twitter; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-twitter"></span>
                        </a>
                    </div>
                <?php } ?>
                <?php if (isset($instagram) && !empty($instagram)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $instagram; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-instagram"></span>
                        </a>
                    </div>
                <?php } ?>
                <?php if (isset($youtube) && !empty($youtube)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $youtube; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-youtube"></span>
                        </a>
                    </div>
                <?php } ?>
            </div>
            <div class="mbr-section-btn card-btn align-center">
                <a class="btn btn-primary display-4" href="<?php echo "index.php?page=partner&id=". $id; ?>"><?php echo $button; ?></a>
            </div>
        </div>
    </div>
</div>
<?php
}
function renderPartner($con, $language, $id)
{
    // Prepare the query to fetch partner data based on the provided ID
    $sql = "SELECT * FROM `partner` WHERE id = $id AND active = 1";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $name = $row['name'];
            $facebook = $row['facebook'];
            $twitter = $row['twitter'];
            $instagram = $row['instagram'];
            $youtube = $row['youtube'];
            $adress = $row['adress'];
            $email = $row['email'];
            $phone = $row['phone'];
            $website = $row['website'];
            $category = $row['category'];
            $target = $row['target'];
            $button = $row['button'];
            $nbutton = $row['nbutton'];
            $button_link = $row['button_link'];
            $logo_png = normalizeMediaUrl($row['logo_png']);
            $image = normalizeMediaUrl($row['image']);
            $map = html_entity_decode($row['map']);

            // Select the appropriate language columns
            $shortColumn = ($language === "no") ? "nshort" : "short";
            $descriptionColumn = ($language === "no") ? "ndescription" : "description";

            // Retrieve and decode the language-specific values
            $short = html_entity_decode($row[$shortColumn]);
            $body = html_entity_decode($row[$descriptionColumn]);
            $information = ($language === "no") ? "Informasjon:" : "Information:";
            $contact = ($language === "no") ? "Kontakt:" : "Contact:";
            $web = ($language === "no") ? "Nettsted:" : "Website:";


            renderSlider($con, $id, "partner", $name);
?>

<section data-bs-version="5.1" class="content5 cid-tIZaoeUabx" id="body">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                <h4 class="mbr-section-subtitle mbr-fonts-style mb-4 display-5"><?php echo $name; ?></h4>
                <div class="display-7">
                    <p class="mbr-text mbr-fonts-style"><?php echo $body; ?></p>
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="content13 cid-tIZ8fgoytl" id="content13-11">
    <div class="container">
        
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-6">
                        <?php if (isset($logo_png)) {
                            echo renderPictureTag($logo_png, 'style="max-width:200px;width:100%" alt=""');
                        } ?>
                    </div>
                    <div class="col-12 col-lg-6">
                        <ul class="list mbr-fonts-style display-7">
                            <strong><?php echo $short; ?></strong>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="contacts3 map1 cid-tIZ8JAyrdG" id="contacts3-14">
    <div class="container">

        <div class="row justify-content-center mt-4">
            <div class="card col-12 col-md-6">
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont socicon-homeadvisor socicon"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5"><strong><?php echo $contact; ?></strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7"><a href="mailto:<?php echo $email; ?>"class="text-primary"><?php echo $email; ?></a><br><a href="tel:<?php echo $phone; ?>"class="text-primary"><?php echo $phone; ?></a>
                        </p>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont socicon-homeadvisor socicon"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5"><strong><?php echo $web; ?></strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7"><a href="<?php echo $website; ?>"
                                                                           class="text-primary"><?php echo $website; ?></a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="map-wrapper col-12 col-md-6">
                <div class="google-map"><?php echo $map; ?></div>
            </div>
        </div>
    </div>
</section>
<?php
        }
    }

}

//  Stores

function renderStores($con, $language)
{ 
    $categoryLabel = ($language === 'no') ? 'Kategori:' : 'Category:';
    $locationLabel = ($language === 'no') ? 'Sted:' : 'Location:';
    $targetLabel = ($language === 'no') ? 'Målgruppe:' : 'Target:';
    $applyFiltersLabel = ($language === 'no') ? 'Bruk filtre' : 'Apply Filters';

    $categoryOptions = [
        "Activities" => "Aktiviteter",
        "Accommodation" => "Overnatting",
        "Adventures" => "Eventyr",
        "DMC" => "DMC",
        "Entertainment" => "Underholdning",
        "Festivals" => "Festivaler",
        "Food" => "Mat",
        "Transport" => "Transport",
        "Fishing" => "Fiske",
        "Shopping" => "Handel"
    ];

    $locationOptions = [
        "Alta" => "Alta",
        "Akkarfjord" => "Akkarfjord",
        "Hammerfest" => "Hammerfest",
        "Havøysund" => "Havøysund",
        "Ingøy" => "Ingøy",
        "Kokelv" => "Kokelv",
        "Porsanger" => "Porsanger",
        "Rolvsøy" => "Rolvsøy",
        "Seiland" => "Seiland",
        "Skaidi" => "Skaidi",
        "Sørøya" => "Sørøya"
    ];

    $targetOptions = [
        "Family" => "Familie",
        "Friends" => "Venner",
        "Companies" => "Bedrifter",
        "Adventurous couples" => "Eventyrlystne par",
        "Local treasures" => "Lokale skatter"
    ];

    ?>
    <section data-bs-version="5.1" class="team1 cid-tHBvcdoEVv" id="team1-a">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-3">
                <div class="form-group">
                    <label for="store_category" class="form-control-label mbr-fonts-style display-7"><?php echo $categoryLabel; ?></label>
                    <select id="store_category" name="category" class="form-control display-7 multi-select" multiple>
                        <?php
                        foreach ($categoryOptions as $value => $name) {
                            echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="store_location" class="form-control-label mbr-fonts-style display-7"><?php echo $locationLabel; ?></label>
                    <select id="store_location" name="location" class="form-control display-7 multi-select" multiple>
                        <?php
                        foreach ($locationOptions as $value => $name) {
                            echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="store_target" class="form-control-label mbr-fonts-style display-7"><?php echo $targetLabel; ?></label>
                    <select id="store_target" name="target" class="form-control display-7 multi-select" multiple>
                        <?php
                        foreach ($targetOptions as $value => $name) {
                            echo '<option value="' . $value . '">' . ($language === 'no' ? $name : ucfirst($value)) . '</option>';
                        }
                        ?>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <!-- Move the button inside its own div and add "text-center" class to center the button -->
                        <button type="button" class="btn mt-3 btn-primary btn-block" onclick="applyShopFilters()"><?php echo $applyFiltersLabel; ?></button>
                </div>
            </div>
                <p></p>
    <?php

                // Get the selected filter values
$category = isset($_GET['category']) ? explode(',', $_GET['category']) : [];
$location = isset($_GET['location']) ? explode(',', $_GET['location']) : [];
$target = isset($_GET['target']) ? explode(',', $_GET['target']) : [];

// Remove empty values from the arrays
$category = array_filter($category);
$location = array_filter($location);
$target = array_filter($target);

// Build the SQL query with filter conditions
$sql = "SELECT * FROM `store` WHERE active = 1";
if (!empty($category)) {
    $category = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $category);
    $categoryCondition = "category LIKE '%" . implode("%' OR category LIKE '%", $category) . "%'";
    $sql .= " AND ($categoryCondition)";
}
if (!empty($location)) {
    $location = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $location);
    $locationCondition = "location LIKE '%" . implode("%' OR location LIKE '%", $location) . "%'";
    $sql .= " AND ($locationCondition)";
}
if (!empty($target)) {
    $target = array_map(function ($item) use ($con) {
        return $con->real_escape_string($item);
    }, $target);
    $targetCondition = "target LIKE '%" . implode("%' OR target LIKE '%", $target) . "%'";
    $sql .= " AND ($targetCondition)";
}

$sql .= " ORDER BY rand()";
                
    // Execute the filtered SQL query
    $result = $con->query($sql);
        if ($result)
        {
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
                $category = $row['category'];
                $target = $row['target'];
                $short = $row['short'];
                $nshort = $row['nshort'];
                $description = $row['description'];
                $ndescription = $row['ndescription'];
                $button = $row['button'];
                $nbutton = $row['nbutton'];
                $button_link = $row['button_link'];
                $logo_png = normalizeMediaUrl($row['logo_png']);
                $image = normalizeMediaUrl($row['image']);
                $map = $row['map'];
                if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                {
                    renderStorecard($id, $name, $facebook, $twitter, $instagram, $youtube, $nshort, $image, "Vis mer"); 
                }
                else
                {
                    renderStorecard($id, $name, $facebook, $twitter, $instagram, $youtube, $short, $image, "Read more"); 
                }
            }
        } 
        else 
        { 
            
        }
        } 
        ?>
                </div>
            </div>
        </section>
<?php

}
function renderStorecard($id, $name, $facebook, $twitter, $instagram, $youtube, $short, $image, $button)
{?>
<div class="col-sm-6 col-lg-4">
    <div class="card-wrap">
        <div class="image-wrap" style="height: 250px;">
            <?php echo renderPictureTag($image, 'alt="" style="object-fit: contain; height: 100%; width: 100%;"'); ?>
        </div>
        <div class="content-wrap">
            <h5 class="mbr-section-title card-title mbr-fonts-style align-center m-0 display-5">
                <strong><?php echo $name; ?></strong>
            </h5>
            <h6 class="mbr-role mbr-fonts-style align-center mb-3 display-4">
                <strong></strong>
            </h6>
            <p class="card-text mbr-fonts-style align-center display-7">
                <?php echo $short; ?>
            </p>
            <div class="social-row display-7">
                <?php if (isset($facebook) && !empty($facebook)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $facebook; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-facebook"></span>
                        </a>
                    </div>
                <?php } ?>
                <?php if (isset($twitter) && !empty($twitter)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $twitter; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-twitter"></span>
                        </a>
                    </div>
                <?php } ?>
                <?php if (isset($instagram) && !empty($instagram)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $instagram; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-instagram"></span>
                        </a>
                    </div>
                <?php } ?>
                <?php if (isset($youtube) && !empty($youtube)) { ?>
                    <div class="soc-item">
                        <a href="<?php echo $youtube; ?>" target="_blank">
                            <span class="mbr-iconfont socicon socicon-youtube"></span>
                        </a>
                    </div>
                <?php } ?>
            </div>
            <div class="mbr-section-btn card-btn align-center">
                <a class="btn btn-primary display-4" href="<?php echo "index.php?page=store&id=". $id; ?>"><?php echo $button; ?></a>
            </div>
        </div>
    </div>
</div>
<?php
}
function renderStore($con, $language, $id)
{
    // Prepare the query to fetch store data based on the provided ID
    $sql = "SELECT * FROM `store` WHERE id = $id AND active = 1";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $name = $row['name'];
            $facebook = $row['facebook'];
            $twitter = $row['twitter'];
            $instagram = $row['instagram'];
            $youtube = $row['youtube'];
            $adress = $row['adress'];
            $email = $row['email'];
            $phone = $row['phone'];
            $website = $row['website'];
            $category = $row['category'];
            $target = $row['target'];
            $button = $row['button'];
            $nbutton = $row['nbutton'];
            $button_link = $row['button_link'];
            $logo_png = normalizeMediaUrl($row['logo_png']);
            $image = normalizeMediaUrl($row['image']);
            $map = html_entity_decode($row['map']);

            // Select the appropriate language columns
            $shortColumn = ($language === "no") ? "nshort" : "short";
            $descriptionColumn = ($language === "no") ? "ndescription" : "description";

            // Retrieve and decode the language-specific values
            $short = html_entity_decode($row[$shortColumn]);
            $body = html_entity_decode($row[$descriptionColumn]);
            $information = ($language === "no") ? "Informasjon:" : "Information:";
            $contact = ($language === "no") ? "Kontakt:" : "Contact:";
            $web = ($language === "no") ? "Nettsted:" : "Website:";


            renderSlider($con, $id, "store", $name);
?>

<section data-bs-version="5.1" class="content5 cid-tIZaoeUabx" id="body">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                <h4 class="mbr-section-subtitle mbr-fonts-style mb-4 display-5"><?php echo $name; ?></h4>
                <div class="display-7">
                    <p class="mbr-text mbr-fonts-style"><?php echo $body; ?></p>
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="content13 cid-tIZ8fgoytl" id="content13-11">
    <div class="container">
        
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-6">
                        <?php if (isset($logo_png)) {
                            echo renderPictureTag($logo_png, 'style="max-width:200px;width:100%" alt=""');
                        } ?>
                    </div>
                    <div class="col-12 col-lg-6">
                        <ul class="list mbr-fonts-style display-7">
                            <strong><?php echo $short; ?></strong>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="contacts3 map1 cid-tIZ8JAyrdG" id="contacts3-14">
    <div class="container">

        <div class="row justify-content-center mt-4">
            <div class="card col-12 col-md-6">
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont socicon-homeadvisor socicon"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5"><strong><?php echo $contact; ?></strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7"><a href="mailto:<?php echo $email; ?>"class="text-primary"><?php echo $email; ?></a><br><a href="tel:<?php echo $phone; ?>"class="text-primary"><?php echo $phone; ?></a>
                        </p>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont socicon-homeadvisor socicon"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5"><strong><?php echo $web; ?></strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7"><a href="<?php echo $website; ?>"
                                                                           class="text-primary"><?php echo $website; ?></a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="map-wrapper col-12 col-md-6">
                <div class="google-map"><?php echo $map; ?></div>
            </div>
        </div>
    </div>
</section>
<?php
        }
    }

}
//  Inspiration

function renderArticles($con, $language, $type)
{   
    ?>
    <section data-bs-version="5.1" class="team2 cid-tHQomXuSaz" xmlns="http://www.w3.org/1999/html" id="team2-d">
        <div class="container">
    <?php
    
    $stmt = $con->prepare("SELECT * FROM `article` WHERE type = ? AND active = 1 ORDER BY priority ASC, date DESC");
    $stmt->bind_param("s", $type);  // "s" indicates the variable type is 'string'

    $stmt->execute();

    $result = $stmt->get_result();
    ?>

    <?php
        
            if ($result->num_rows > 0) 
            {
            while($row = $result->fetch_assoc()) 
            {
                $id = html_entity_decode($row['id']);
                $author = html_entity_decode($row['author']);  
                $image = normalizeMediaUrl(html_entity_decode($row['image']));
                $button_link = html_entity_decode($row['button_link']);

                if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                {
                    $name = html_entity_decode($row['nname']);
                    $short = html_entity_decode($row['nshort']);
                    $button = "Les mer";
                }
                else
                {
                    $name = html_entity_decode($row['name']);
                    $short = html_entity_decode($row['short']); 
                    $button = "Read more";
                }
                ?>
                <div class="card">
                    <div class="card-wrapper">
                        <div class="row align-items-center">
                            <div class="col-12 col-md-4">
                                <div class="image-wrapper">
                                    <?php if (isset($image)) { echo renderPictureTag($image, 'alt=""'); } ?>
                                </div>
                            </div>
                            <div class="col-12 col-md">
                                <div class="card-box">
                                    <h5 class="card-title mbr-fonts-style m-0 mb-3 display-5">
                                        <strong><a href="<?php if (isset($button_link)) {   echo $button_link;} ?>"><?php if (isset($name)) {   echo $name;} ?></a></strong></h5>
                                    <!-- <h6 class="card-subtitle mbr-fonts-style mb-3 display-4">
                                        <strong><?php if (isset($author)) {   echo $author;} ?></strong></h6> -->
                                    <p class="mbr-text mbr-fonts-style display-7">
                                        <?php if (isset($short)) {   echo $short;} ?>
                                    </p>
                                    <a class="btn btn-primary display-4" href="<?php echo "index.php?page=article&id=". $id; ?>"><?php echo $button; ?></a>                          
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
                <?php 
                }
            } 
            else 
            {            
            } 
        ?>       
        </div>
    </section>
<?php
 
}
function renderArticle($con, $language, $id)
{ 

    $sql = "SELECT * FROM `article` WHERE id = $id AND active = 1"; 
    $result = $con->query($sql);

        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = html_entity_decode($row['id']);
                $author = html_entity_decode($row['author']);  
                $image = normalizeMediaUrl(html_entity_decode($row['image']));
                $button_link = html_entity_decode($row['button_link']);

                if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                {
                    $name = html_entity_decode($row['nname']);
                    $body = html_entity_decode($row['nbody']);
                    $button = html_entity_decode($row['nbutton']);
                }
                else
                {
                    $name = html_entity_decode($row['name']);
                    $body = html_entity_decode($row['body']); 
                    $button = html_entity_decode($row['button']);
                }
renderSlider($con, $id, "article", $name);
?>
<section data-bs-version="5.1" class="content5 cid-tIZaoeUabx" id="body">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10"> 
                <h4 class="mbr-section-subtitle mbr-fonts-style mb-4 display-5"><?php echo $name;?></h4>
                <h6 class="card-subtitle mbr-fonts-style mb-3 display-4">
                    <strong><?php if (isset($author)) {   echo ($language === "no") ? "Skrevet av: "  . $author : "Writen by: " . $author;} ?></strong></h6>
                <div class="display-7">
                    <p class="mbr-text mbr-fonts-style"><?php echo $body;?></p>
                </div>
            </div>
        </div>
    </div>
</section>

<?php  

        }
    }

}


//  Information

function renderInformationBanner($con, $language)
{
    // Prepare the query to fetch partner data based on the provided ID
    $sql = "SELECT * FROM `information` WHERE id = 1";
    $result = $con->query($sql);

    if ($result->num_rows > 0) 
    {
        while ($row = $result->fetch_assoc()) 
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
            $button = $row['button'];
            $nbutton = $row['nbutton'];
            $button_link = $row['button_link'];
            $logo_png = normalizeMediaUrl($row['logo_png']);
            $image = normalizeMediaUrl($row['image']);
            $map = html_entity_decode($row['map']);

            // Select the appropriate language columns
            $shortColumn = ($language === "no") ? "nshort" : "short";
            $buttonColumn = ($language === "no") ? "nbutton" : "button";
            $descriptionColumn = ($language === "no") ? "ndescription" : "description";

            // Retrieve and decode the language-specific values
            $short = html_entity_decode($row[$shortColumn]);
            $button = html_entity_decode($row[$buttonColumn]);
            $body = html_entity_decode($row[$descriptionColumn]);
            $information = ($language === "no") ? "Informasjon:" : "Information:";
            $mail = ($language === "no") ? "E-post:" : "E-mail:";
            $web = ($language === "no") ? "Webside:" : "Website:";


            $translations = array(
                'en' => array(
                    'header_title' => 'Visit Hammerfest',
                    'header_text' => 'Experience the Arctic magic<br>- where the midnight sun and the mesmerizing northern lights illuminate your journey into the heart of Arctic wonder.',
                    'opening_hours' => 'Opening Hours<br>' . $short,
                    'call_us' => 'Call us<br>Phone number<br><a style="color: white;" href="tel:+ 47 78 41 21 85"><strong>+ 47 78 41 21 85</strong></a>',
                    'send_us' => 'Send us<br>Email address<br><a style="color: white;" href="mailto:'  . $email . '"><strong>' . $email . '</strong></a>',
                    'drop_by' => 'Drop by<br>Our office<br>' . $adress,
                ),
                'no' => array(
                    'header_title' => 'Besøk Hammerfest',
                    'header_text' => 'Opplev den arktiske magien<br>- hvor midnattssolen og det fortryllende nordlyset lyser opp reisen din til hjertet av arktisk undring.',
                    'opening_hours' => 'Åpningstider<br>' . $short,
                    'call_us' => 'Ring oss<br>Telefonnummer<br><a style="color: white;" href="tel:+ 47 78 41 21 85"><strong>+ 47 78 41 21 85</strong></a>',
                    'send_us' => 'Send oss<br>E-postadresse<br><a style="color: white;" href="mailto:'  . $email . '"><strong>' . $email . '</strong></a>',
                    'drop_by' => 'Kom innom<br>Vårt kontor<br>' . $adress,
                ),
            );

            // Check if the language is set and valid, otherwise set it to English as the default
            if (isset($language) && array_key_exists($language, $translations)) 
            {
                $translation = $translations[$language];
            } else 
            {
                $translation = $translations['en'];
            }      
                ?>

                <section data-bs-version="5.1" class="header19 cid-tKOMxMjRcr mbr-fullscreen mbr-parallax-background" id="header19-1b">
                    <div class="mbr-overlay" style="opacity: 0.5; background-color: rgb(35, 35, 35);"></div>
                    <div class="container">
                        <div class="media-container">
                            <div class="col-md-12 align-center">
                                <h1 class="mbr-section-title mbr-white mbr-bold mbr-fonts-style mb-3 display-1"><?php echo $translation['header_title']; ?></h1>
                                <p class="mbr-text mbr-white mbr-fonts-style display-7">
                                    <?php echo $translation['header_text']; ?>
                                </p>

                                <div class="row justify-content-center">
                                    <div class="col-12 col-md-6 col-lg-3">
                                        <div class="card-wrapper">
                                            <div class="card-box align-center">
                                                <span class="mbr-iconfont mobi-mbri-clock mobi-mbri"></span>
                                                <h4 class="card-title align-center mbr-black mbr-fonts-style display-7">
                                                    <strong><?php echo $translation['opening_hours']; ?></strong></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6 col-lg-3">
                                        <div class="card-wrapper">
                                            <div class="card-box align-center">
                                                <span class="mbr-iconfont mobi-mbri-phone mobi-mbri"></span>
                                                <h4 class="card-title align-center mbr-black mbr-fonts-style display-7">
                                                    <strong><?php echo $translation['call_us']; ?></strong></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6 col-lg-3">
                                        <div class="card-wrapper">
                                            <div class="card-box align-center">
                                                <span class="mbr-iconfont mobi-mbri-letter mobi-mbri"></span>
                                                <h4 class="card-title align-center mbr-black mbr-fonts-style display-7">
                                                    <strong><?php echo $translation['send_us']; ?></strong></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6 col-lg-3">
                                        <div class="card-wrapper">
                                            <div class="card-box align-center">
                                                <span class="mbr-iconfont mobi-mbri-map-pin mobi-mbri"></span>
                                                <h4 class="card-title align-center mbr-black mbr-fonts-style display-7">
                                                    <strong><?php echo $translation['drop_by']; ?></strong></h4>
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
    }

}
function renderBigmap()
{?>
    <section data-bs-version="5.1" class="map2 cid-tKP9tIZr0w" id="map2-1c">  
    <div>
        
        <div class="google-map"><iframe frameborder="0" style="border:0" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5284.285668775693!2d23.6898391!3d70.6637975!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x45c8ba4bac921f3d%3A0xcbcef80c539ec131!2sVisit%20Hammerfest!5e0!3m2!1sen!2sno!4v1690106884200!5m2!1sen!2sno" allowfullscreen=""></iframe></div>
    </div>
</section>

<?php
}
function renderLegal($con, $language)
{
if ($language === "no")
    {?>  
<section data-bs-version="5.1" class="tabs content18 cid-tKPb7BBuPB" id="tabs1-1g">

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8">
                <h3 class="mbr-section-title mb-0 mbr-fonts-style display-2">
                    <strong>Informasjon</strong></h3>
            </div>
        </div>
        <div class="row justify-content-center mt-4">
            <div class="col-12 col-md-8">
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item first mbr-fonts-style"><a class="nav-link mbr-fonts-style show active display-7" role="tab" data-toggle="tab" data-bs-toggle="tab" href="#tabs1-1g_tab0" aria-selected="true">
                            <strong>Personvern</strong></a></li>
                    <li class="nav-item"><a class="nav-link mbr-fonts-style active display-7" role="tab" data-toggle="tab" data-bs-toggle="tab" href="#tabs1-1g_tab1" aria-selected="true"><strong>Bestillingsvilkår</strong></a></li>
                    <li class="nav-item"><a class="nav-link mbr-fonts-style active display-7" role="tab" data-toggle="tab" data-bs-toggle="tab" href="#tabs1-1g_tab2" aria-selected="true"><strong>Prisgaranti</strong></a></li>
                </ul>
                <div class="tab-content">
                    <div id="tab1" class="tab-pane in active" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <p class="mbr-text mbr-fonts-style display-7"><strong>Sist oppdatert: 03.05.2021
                                    <br></strong><br>"Nettstedet" refererer til all informasjon på dette domenet. "Vi" refererer til eieren av dette domenet.
                                    <br>
                                    <br>Nettstedet bruker loggfiler. Disse filene henter informasjon som IP-adresser, nettlesertype, referansesider, ISP, tidsstempel, osv. Ingen av disse opplysningene kan brukes til å identifisere deg personlig. Nettstedet bruker også informasjonskapsler (cookies).<br>
                                    <br><strong>Personvernerklæring
                                        <br></strong>Hvilken personlig informasjon vi kan hente, behandle og lagre, er bestemt av den norske Personopplysningsloven og den europeiske GDPR. Dette gjelder hele selskapet, inkludert nettstedet.
                                    <br>
                                    <br>Den norske Personopplysningsloven fastsetter at vi er forpliktet til å gi informasjon om hvordan personopplysninger vi mottar blir brukt. Mottatte personopplysninger blir behandlet i henhold til kapittel II, paragraf 8 i den norske Personopplysningsloven.
                                    <br>
                                    <br><strong>Ansvar for behandling av personopplysninger
                                        <br></strong>Hovedansvaret for behandling av personopplysninger ligger hos oss som registrert organisasjon.
                                    <br>
                                    <br><strong>Tilgang til, retting eller sletting av personlig informasjon
                                        <br></strong>For spørsmål om tilgang til, retting eller sletting av personlig informasjon, vennligst send oss en e-post via vår kontaktside.
                                    <br>
                                    <br>På grunn av systembackup kan personopplysninger forbli i sikkerhetskopien i 60 dager etter sletting.
                                    <br>
                                    <br><strong>Informasjon som behandles og formål med behandlingen
                                        <br></strong>På nettstedet samler vi inn personopplysninger gjennom ulike skjemaer som brukeren kan fylle ut, for eksempel for å fullføre en bestilling, melde seg på et arrangement, delta i en konkurranse eller bestille en tjeneste. I slike tilfeller ber vi om den informasjonen vi trenger for å levere tjenesten og/eller kontakte personen. Av og til ber vi også om annen informasjon som brukes til statistiske formål, for eksempel alder eller postadresse. Det er valgfritt for nettstedsbrukeren å registrere personlig informasjon i våre skjemaer.
                                    <br>
                                    <br><strong>Eksterne leverandører / databehandlere
                                        <br></strong>Visit Group Tech. er ansvarlig for utvikling og vedlikehold av og behandling av personopplysninger på www.nordkapp.no. Vi er ansvarlig for drift av dette domenet. Vi er ansvarlig for utvikling, drift og vedlikehold av og behandling av personopplysninger på vårt nettsted.
                                    <br>
                                    <br><strong>Lagring og deling av personopplysninger
                                        <br></strong>Personopplysninger registrert i skjemaer på nettstedet vårt er ikke tilgjengelige for andre nettstedsbesøkende. Informasjonen lagres av oss og brukes kun til det formålet som skjemaet gjelder. Informasjon deles ikke med tredjeparter med mindre dette er nødvendig for å levere den bestilte tjenesten eller hvis du har samtykket til dette ved utfylling av skjemaet. Vi selger ikke personlig informasjon til andre.
                                    <br>
                                    <br>Informasjon registrert i forbindelse med bestillinger i vår bestillingstjeneste lagres hos Visit TG i Citybreak-bestillingssystemet. Hvis du har bestilt en tjeneste levert av en tredjepart (f.eks. hotellinnkvartering eller en sightseeingtur), vil informasjonen bli delt med leverandøren. Informasjonen brukes kun til formålet med bestillingen. Personopplysninger deles ikke med tredjeparter utover dette, med mindre du har gitt ditt samtykke ved utfylling av skjemaet.
                                    <br>
                                    <br><strong>Søk på nettstedet
                                        <br></strong>Søkeord som brukes på nettstedet samles og lagres av Google Analytics, samt av søkeverktøyet som opereres av Inmeta. Formålet med dette er å kunne bruke data om hva det blir søkt etter, for å tilpasse innholdet på sidene og forbedre søkefunksjonen. Søkeord kan ikke knyttes til annen informasjon om brukeren som gjorde søket.
                                    <br>
                                    <br><strong>SSL-kryptering
                                        <br></strong>Våre nettsider er sikret med SSL-sertifisering, noe som betyr at sidene er kryptert. Dette vises ved at sidene har en https-adresse. Du kan sjekke dette ved å klikke på hengelåsikonet som vises ved siden av sidens adresse i nettleseren din.
                                    <br>
                                    <br><strong>Facebook pålogging
                                        <br></strong>På noen sider kan du også legge ut kommentarer via et Facebook-kommentarfelt. Disse kommentarene er knyttet til din Facebook-profil, som vises med profilbildet ditt og navnet ditt, samt yrke/arbeidsplass (hvis du velger å skrive noe i Facebook-kommentarfeltet). Kommentaren din og informasjonen fra profilen din vil vises på siden der du skrev den til alle besøkende på siden. Denne informasjonen tilhører Facebook og lagres ikke hos Visit Nordkapp. Visit Nordkapp bruker ikke dine kommentarer eller profilinformasjon utover at det vises i kommentarfeltet på siden.
                                    <br>
                                    <br>Hvis du er logget på din Facebook-konto, kan du også "like" sider på nettstedet. Når du "liker" en side på nettstedet vårt, vil dine Facebook-venner se at du har likt den bestemte siden. Andre brukere som ikke er Facebook-venner, vil kun se antallet "likes" som er klikket.
                                    <br>
                                    <br>I disse tilfellene gjelder Facebooks personvernserklæring. Se Facebooks personvernserklæring på facebook.com.
                                    <br>
                                    <br><strong>Bestilling på dette nettstedet
                                        <br></strong>All personlig informasjon blir oppgitt på en kryptert side, der det er trygt å oppgi informasjon om deg selv og ditt kredittkort.
                                    <br>
                                    <br>Vår betalingsgateway har implementert flere sikkerhetstiltak for å beskytte din personlige informasjon og kredittkortinformasjon. Din e-postadresse vil ikke bli brukt til noe annet enn å sende deg bestillingsbekreftelsen eller sende deg praktisk informasjon angående din bestilling hos oss.
                                    <br>
                                    <br><strong>Bestillingsknapper og eksterne lenker
                                        <br></strong>På noen sider på nettstedet finnes bestillingsknapper som fører til andre nettsteder, for eksempel kjøpsknapper i en arrangementskalender eller presentasjon av et hotell eller bordbestilling på en restaurant.
                                    <br>
                                    <br>Hvis lenken fører til et nettsted som ikke er vårt, er vi ikke ansvarlige for innsamling av personlig informasjon på det eksterne nettstedet. I slike tilfeller gjelder det eksterne nettstedets personvernserklæring.
                                    <br>
                                    <br><strong>Integrerte elementer fra eksterne nettsteder
                                        <br></strong>Nettstedet inneholder integrerte elementer fra eksterne nettsteder (som Tripadvisor, Facebook, Twitter, Youtube, Flickr og Instagram) i form av widgets eller andre integrerte elementer. Disse elementene plasserer informasjonskapsler (cookies) i nettleseren din, som de bruker til statistiske og markedsføringsformål (se informasjon om informasjonskapsler). Vi lagrer ikke informasjon om din bruk av disse elementene. Denne informasjonen samles og lagres bare av den eksterne organisasjonen (Tripadvisor, Facebook, Twitter, Youtube, Flickr, Instagram, osv.).
                                    <br>
                                    <br><strong>Betaling
                                        </strong><br>Informasjon om betalingen sendes til betalingsleverandøren og databehandleren NETS.
                                    <br>
                                    <br><strong>Behandling av personlig informasjon
                                        <br></strong>Vi behandler kun informasjon som er nødvendig for å fullføre kjøpet og avtalen med kunden, for eksempel navn, kontaktinformasjon, adresse og kredittkortdetaljer.
                                    <br>
                                    <br>Din e-post kan brukes i vårt nyhetsbrev hvis du gir ditt samtykke til slik bruk. Dette kan brukes til å sende informasjon om din valgte tur eller innkvartering. Vi kan også kontakte deg for å få din vurdering av din valgte aktivitet. E-posten brukes kun når du frivillig har gitt oss ditt samtykke ved å sende inn din e-post til oss. Du har til enhver tid muligheten til å melde deg av nyhetsbrevene ved å følge avmeldingslenken i nyhetsbrevet.
                                    <br>
                                    <br><strong>Rettigheter og lovverk
                                        <br></strong>Du har rett til å be om tilgang, retting og sletting av dine egne personopplysninger. Vennligst kontakt oss via vår kontaktside.
                                    <br>
                                    <br>Dette domenet og nettstedet er underlagt norsk lov og lovverk.
                                    <br>
                                    <br></p>
                            </div>
                        </div>
                    </div>
                    <div id="tab2" class="tab-pane" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <p class="mbr-text mbr-fonts-style display-7">Book Finnmark AS er ansvarlig for å videreformidle bestillingen din til den relevante leverandøren. Det er leverandørens ansvar å tilby aktiviteten, leieutstyret eller innkvarteringen i tråd med bestillingen din. Vi vil sørge for at du mottar relevant informasjon før ankomst/tur, og vil kontakte deg i tilfelle større endringer eller avlysning av bestillingen din. Avtalen kan gjelde for en aktivitet, innkvartering, produkt, tjeneste eller en kombinasjon av disse.
                                    <br>
                                    <br>Din bestilling er bekreftet når du mottar en bekreftelses-e-post med et referansenummer for bestillingen. Vi anbefaler våre gjester å skrive ut denne bekreftelsen og ta den med på reisen. Du kan også vise bekreftelsen elektronisk på nettbrettet eller mobiltelefonen. En minimumsalder på 18 år gjelder for å foreta en bestilling gjennom Book Finnmark. Det er også mulig å bestille per telefon eller e-post, men det påløper en serviceavgift per bestilling. Hvis du trenger å kontakte leverandøren din før, under eller etter ankomstdatoen, vil du finne kontaktinformasjon på bestillingsbekreftelsen eller på leverandørens nettsted. Du kan også kontakte Book Finnmark via e-post: booking@bookfinnmark.com
                                    <br>Betaling og sikkerhet
                                    <br>Betalingen behandles ved bestillingstidspunktet. Book Finnmark er ansvarlig for den faktiske transaksjonen og for å sikre at riktig beløp belastes kortet ditt. Vi vil kontakte deg i tilfelle problemer med kredittkortet ditt. Hvis vi ikke klarer å ta kontakt, blir bestillingen din kansellert. All personlig informasjon og kredittkortinformasjon behandles på en kryptert side, slik at all informasjon som oppgis, er sikker. Kun Book Finnmark og leverandøren av det relevante produktet vil ha tilgang til navnet ditt og kontaktinformasjonen din. Denne informasjonen vil bli brukt til å behandle bestillingen din.
                                    <br>
                                    <br><strong>Avbestilling/endringer fra gjesten
                                        <br></strong>For å avbestille eller endre bestillingen din, vennligst kontakt Book Finnmark. Alle avbestillinger må sendes per e-post til booking@bookfinnmark.com
                                    <br>For avbestillinger mindre enn 7 dager før ankomst, vennligst kontakt både leverandøren og Book Finnmark.
                                    <br>
                                    <br>Book Finnmark har ingen kontroll over valutakursen som vil bli beregnet for refusjoner til kredittkort, og er ikke ansvarlig for tap som oppstår på grunn av svingninger i valutaen. Vennligst merk at bestillingsgebyrer og kredittkortgebyrer ikke refunderes. Avbestilling av en eksisterende bestilling kan pålegges en administrasjonsavgift belastet av oss eller en leverandør. Noen av våre leverandører og samarbeidspartnere opererer med forskjellige avbestillingsvilkår i tillegg til våre, for eksempel flyselskaper og utleiefirmaer. Du vil bli informert om disse reglene ved bestilling fra disse leverandørene. Vennligst merk at Book Finnmark ikke betaler noen bankgebyrer som påløper for internasjonale overføringer. Dette gebyret vil bli trukket fra refusjonen.
                                    <br>
                                    <br>Følgende avbestillingsgebyrer/frister gjelder:
                                    <br>
                                    <br>Full refusjon gis for avbestillinger gjort mer enn 7 dager før ankomstdatoen/turdatoen
                                    <br>Ingen refusjon gis for avbestillinger gjort mindre enn 7 dager før ankomstdatoen/turdatoen
                                    <br>Enhver endring gjort av gjesten betraktes som en avbestilling.
                                    <br>
                                    <br>Noen leverandører og partnere har andre avbestillingsvilkår enn de nevnte ovenfor. Dette gjelder spesielt for bestilling av flybilletter, innkvartering og leiebiler. I slike tilfeller vil vilkårene bli vist på utsjekkingssiden eller i produktbeskrivelsen på bestillingstidspunktet.
                                    <br>
                                    <br><strong>Spesielle vilkår for bestilling av innkvartering:
                                        <br></strong>Innsjekking og utsjekking: Innsjekkingstiden er kl. 15.00 på ankomstdatoen. Rommet må forlates kl. 12.00 på avreisedatoen. Rommet er reservert til kl. 18.00 på ankomstdatoen. Hvis du planlegger å ankomme senere, må du varsle overnattingsleverandøren på forhånd.
                                    <br>Ansvar for skader: Gjesten, eller garantisten for rommet/leiligheten/hytta, er ansvarlig for eventuelle skader som skyldes uaktsom eller uforsvarlig oppførsel av gjestene.
                                    <br>Forsikring/avbestillingsbeskyttelse
                                    <br>Vi anbefaler alle våre gjester å sørge for at de har en god forsikring før de starter turen, i tilfelle sykdom, tapt bagasje, ulykke, ansvar osv.
                                    <br>
                                    <br><strong>Våre leverandører
                                        <br></strong>Vi er ansvarlige for at våre leverandører får betalt for det du har bestilt gjennom oss. Våre leverandører er ansvarlige for å gjennomføre bestillingen i samsvar med gjeldende lover og regler som gjelder for leverandøren, inkludert at leverandøren har nødvendig forsikring, tillatelser, lisenser og er godkjent av lokale myndigheter.
                                    <br>
                                    <br>Eventuelle klager på leverandøren og tjenestene de leverer må rettes direkte til leverandøren. Book Finnmark har ikke kontroll over leverandørenes tjenester og kan ikke påta seg ansvar for leverandørens tjenester eller handlinger.
                                    <br>
                                    <br><strong>Kontaktinformasjon:
                                        <br></strong>Book Finnmark AS
                                    <br>Nordkappgata 1
                                    <br>9750 Honningsvåg
                                    <br>Norway
                                    <br>Tlf: +47 78470404
                                    <br>E-post: booking@bookfinnmark.com
                                    <br>Org.nr: 916 986 261
                                    <br>
                                    <br><strong>Endringer i bestillingsvilkårene
                                        <br></strong>Book Finnmark forbeholder seg retten til å endre disse vilkårene uten forhåndsvarsel.
                                    <br>
                                    <br></p>
                            </div>
                        </div>
                    </div>
                    <div id="tab3" class="tab-pane" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <p class="mbr-text mbr-fonts-style display-7"><strong>Alltid laveste pris</strong>
                                    <br>Du som booker via våre nettsider kan være sikker på å ha fått best pris hos våre leverandører. Ta gjerne kontakt med lokale overnattingssteder og tilbydere av aktiviteter - dersom du finner den samme tjenesten til lavere pris hører vi gjerne fra deg. Kontakt oss for mer informasjon.

<br><br><strong>Forbehold</strong>
<br>Prisgarantien omfatter ikke prisforhøyelser som skyldes endrede skatter og avgifter, tollgebyrer og tjenester, samt prisforhøyelser på tilslutningstransport som er utenfor vår kontroll. For ytterligere informasjon, sjekk vilkårene for din aktuelle booking.

<br><br>Prisgarantien gjelder ikke kontraktpriser eller andre ikke-offentlige priser, inkludert gruppepriser, pakkepriser, salgsfremmende priser og medlemskap-priser. Prisgarantien gjelder heller ikke for utgåtte priser, herunder priser lagret i din egen nettleser (lagret informasjon), priser med andre betalingsvilkår - for eksempel forhåndsbetaling.

<br><br>Denne prisgarantien gjelder kun bookbare produkter på dette nettstedet. Leverandører som ikke er knyttet til vårt bookingsystem må kontaktes direkte.
                                    <br>
                                    <br></p>
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
    else
    { ?>

<section data-bs-version="5.1" class="tabs content18 cid-tKPb7BBuPB" id="tabs1-1g">

    

    
    
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8">
                <h3 class="mbr-section-title mb-0 mbr-fonts-style display-2">
                    <strong>Information</strong></h3>
                
            </div>
        </div>
        <div class="row justify-content-center mt-4">
            <div class="col-12 col-md-8">
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item first mbr-fonts-style"><a class="nav-link mbr-fonts-style show active display-7" role="tab" data-toggle="tab" data-bs-toggle="tab" href="#tabs1-1g_tab0" aria-selected="true">
                            <strong>Privacy</strong></a></li>
                    <li class="nav-item"><a class="nav-link mbr-fonts-style active display-7" role="tab" data-toggle="tab" data-bs-toggle="tab" href="#tabs1-1g_tab1" aria-selected="true"><strong>Booking terms</strong></a></li>
                    <li class="nav-item"><a class="nav-link mbr-fonts-style active display-7" role="tab" data-toggle="tab" data-bs-toggle="tab" href="#tabs1-1g_tab2" aria-selected="true"><strong>Price guarantee</strong></a></li>
                    
                    
                    
                </ul>
                <div class="tab-content">
                    <div id="tab1" class="tab-pane in active" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <p class="mbr-text mbr-fonts-style display-7"><strong>Last updated: 03.05.2021
<br></strong><br>"The website" refers to all of the information on this domain. "We" refers to the owner of this domain.
<br>
<br>The website uses log files. These files retrieve information such as IP addresses, browser type, reference pages, ISP, time stamp, etc. None of this information may be used to identify you personally. The website also uses cookies.<br>
<br><strong>Personal privacy policy
<br></strong>What personal information we may retrieve, process and store is determined by the Norwegian Personal Data Act and the Europen GDPR. This applies to the entire company including the website.
<br>
<br>The Norwegian Personal Data Act states that we are obliged to provide information about how personal data we receive is used. Personal data received is processed pursuant to Chapter II, Section 8 of the Norwegian Personal Data Act.
<br>
<br><strong>Responsibility for processing personal data
<br></strong>The main responsibility for processing personal data lies with us as a registered organisation.
<br>
<br><strong>Accessing, correcting or deleting personal information
<br></strong>For queries about accessing, correcting or deleting of personal information please send us an email via our contact information.
<br>
<br>Due to system backups, personal data may remain in the backup for 60 days after deletion.
<br>
<br><strong>Information processed and purpose of processing
<br></strong>On the website we collect personal data through various forms that the user can fill out, for example, to complete a booking, sign up for an event, participate in a competition or order a service. In such instances we request the information we need in order to deliver the service and/or contact the person. Occasionally, we ask for other information that is used for statistical purposes, such as age or postal address. It is optional for the website user to register personal information in our forms.
<br>
<br><strong>External providers/data processors
<br></strong>Visit Group Tech. is responsible for the development and maintenance of and processing personal data at www.nordkapp.no. We are responsible for running this domain. We are responsible for the development, operation and maintenance of and processing personal data at our website
<br>
<br><strong>Storage and sharing of personal data
<br></strong>Personal information registered in forms on our website is not accessible to other site visitors. The information is stored by us and is not used for any other purpose than that to which the form applies. Information is not shared with third parties unless this is necessary in order to deliver the service that is ordered or if you have consented to this upon completing the form. We do not sell personal information to others.
<br>
<br>Information registered in connection with bookings in our booking service is stored at Visit TG in the Citybreak booking system. If you have ordered a service provided by a third party (e.g. hotel accommodation or a sightseeing tour), the information will be shared with the supplier. The information is not used for any other purpose than the booking. Personal information is not shared with third parties beyond this, unless you have given your consent upon completing the form.
<br>
<br><strong>Searching on the website
<br></strong>Search words used on the website are collected and stored by Google Analytics, as well as by the search tool operated by Inmeta. The purpose of this is to be able to use data about what it is being searched for, to customise the content of the pages and improve the search function. Search words cannot be linked to other information about the user who made the search.
<br>
<br><strong>SSL encryption
<br></strong>Our websites are secured with SSL certification, which means that the pages are encrypted. This is shown by the pages having an https address. You may check this by clicking the padlock icon that appears next to the page’s address in your browser.
<br>
<br><strong>Facebook login
<br></strong>On some pages you can also post comments via a Facebook comment field. These comments are linked to your Facebook profile, which is displayed with your profile picture and name, as well as occupation/workplace (if you choose to write something in the Facebook comment field). Your comment and the said information from your profile will appear on the page where you wrote it to all visitors to the page. This information is Facebook's property and is not stored at Visit Nordkapp. Visit Nordkapp does not use your comments or profile information beyond it appearing in the comment field on the page.
<br>
<br>If you are logged in to your Facebook account you may also "like" pages on the website. When you “like” a page on our website, your Facebook friends will see that you have liked that particular page. Other users that are not Facebook friends only see the number of “likes” clicked.
<br>
<br>In these instances, it is Facebook’s privacy statement which applies. See Facebook's privacy statement at facebook.com.
<br>
<br><strong>Booking on this website
<br></strong>All personal data is entered on an encrypted page where it is safe to provide information about yourself and your credit card.
<br>
<br>Our payment gateway has implemented a number of security measures to protect your personal information and credit card information. Your e-mail address will not be used for any purpose other than sending you your booking confirmation or send you practical information regarding your booking with us.
<br>
<br><strong>Order buttons and external links
<br></strong>On some pages on the website, there are order buttons that lead to other websites, such as purchase buttons in an event calendar or in the presentation of a hotel or booking a table at a restaurant.
<br>
<br>If the link leads to a website other than ours, we are not responsible for gathering of personal information on the external site. In such instances, it is the external website's privacy statement which applies.
<br>
<br><strong>Integrated elements from external websites
<br></strong>The website contains integrated elements from external websites (such as Tripadvisor, Facebook, Twitter, Youtube, Flickr and Instagram) in the form of widgets or other integrated elements. These elements place cookies in your browser, which they use for statistical and marketing purposes (see information about cookies). We do not store information about your use of these elements. This information is only collected and stored by the external organization (Tripadvisor, Facebook, Twitter, Youtube, Flickr, Instagram, etc.).
<br>
<br><strong>Payment
</strong><br>Information regarding payment is sent to payment provider and data processor NETS.
<br>
<br><strong>Processing of personal information
<br></strong>We do only process information that is necessary to complete the purchase and the agreement with the customer, such as name, contact information, address and credit card details.
<br>
<br>Your e-mail may be used in our newsletter if you willingly consent to such use. This may be used for the purpose of sending information about your chosen tour or accommodation. We may also contact you to get your review of your chosen activity. The e-mail is only used when you have voluntarily given us your consent by submitting your e-mail to us. You have the opportunity at all times to unsubscribe from the newsletters by following the unsubscribe link in the newsletter.
<br>
<br><strong>Rights and legislation
<br></strong>You are entitled to request access, correction and deletion of your own personal information. Please contact us through our contact page.
<br>
<br>This domain and web site are subject to Norwegian law and legislation.
<br>
<br></p>
                            </div>
                        </div>
                    </div>
                    <div id="tab2" class="tab-pane" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <p class="mbr-text mbr-fonts-style display-7">Book Finnmark AS is responsible for forwarding your booking to the relevant supplier. It is the supplier’s responsibility to provide the activity, rental equipment or accommodation in line with your booking. We will ensure you receive relevant information before your arrival / tour, and will contact you in the event of any major changes or cancellation of your booking. The agreement may apply to an activity, accommodation, product, service or a combination of these.
<br>
<br>Your booking is confirmed when you receive a confirmation e-mail with a booking reference number. We recommend our guests to print this confirmation and bring it along on your journey. You may also show the confirmation electronically on your tablet or mobile. A minimum age of 18 applies to make a booking through Book Finnmark. It is also possible to book by phone or e-mail, but a service charge per booking applies. If you need to contact your supplier before, during or after your arrival date you will find contact information on the booking confirmation or on the suppliers's website. You can also contact Book Finnmark by e-mail: booking@bookfinnmark.com
<br>Payment and security
<br>The payment is processed at the time of booking. Book Finnmark is responsible for the actual transaction, and for ensuring that the correct amount is charged to your card. We will contact you in the event of problems with your credit card. If we are unable to make contact, your booking will be cancelled. All personal data and credit card information is handled on an encrypted site, so all information provided is secure. Only Book Finnmark and the supplier of the relevant product will have access to your name and contact details. This information will be used to process your booking.
<br>
<br><strong>Cancellation / changes by the guest 
<br></strong>To cancel or change your booking, please contact Book Finnmark. All cancellations must be sent by e-mail to booking@bookfinnmark.com
<br>For cancellations less than 7 days prior to arrival, please contact both the supplier and Book Finnmark.
<br>
<br>Book Finnmark has no control over the exchange rate that will be calculated for refunds to credit cards and is not responsible for any loss incurred due to fluctuations in currency. Please note that booking fees and credit card fees are non-refundable. Cancellation of an existing booking may be subject to an administration fee charged by us or a supplier. Some of our suppliers and partners operate with different cancellation terms in addition to ours, such as airlines and rental companies. You will be informed of regulations when ordering from these suppliers. Please note that Book Finnmark does not pay any bank fees incurred for international transfers. This fee will be deducted from the refund.
<br>
<br>The following cancellation fees / deadlines apply:
<br>
<br>A full refund is provided for cancellations made more than 7 days prior to the arrival date / tour date
<br>No refund is provided for cancellations made less than 7 days prior to the arrival date / tour date
<br>Any changes made by the guest are regarded as a cancellation.
<br>
<br>Some suppliers and partners have other terms of cancellation than those mentioned above. This applies particularly to the booking of airline tickets, accommodation and rental cars. In such cases, the terms and conditions will be displayed on the checkout page or in the product description at the time of booking.
<br>
<br><strong>Special conditions for booking of accommodation: 
<br></strong>Check-in and check-out: The check-in time is 15.00 (3pm) on the arrival date. The room must be vacated by 12.00 on the departure date. The room is reserved until 18.00 (6pm) on the arrival date. If you plan to arrive later, you must notify the accommodation provider in advance.
<br>Liability for damages: The guest, or the guarantor for the room/apartment/cabin, is liable for any damages resulting from negligent or reckless behaviour by the guests.
<br>Insurance/cancellation protection
<br>We recommend all our guests to ensure they have good insurance before commencing their trip in case of illness, lost luggage, accident, liability, etc.
<br>
<br><strong>Our suppliers
<br></strong>We are responsible for our suppliers getting paid for what you have ordered through us. Our suppliers are responsible for carrying out your booking in accordance with applicable laws and regulations that apply to the supplier, including that the supplier has the necessary insurance, permits, equipment, staffing, etc.
<br>
<br>Cancellations/major changes from our side
<br>Cancellations or major changes may occur due to:
<br>
<br>Conditions that are beyond our or our supplier’s control, e.g. weather, accidents/breakdowns, strikes etc.
<br>Conditions for the booking not being met, e.g. minimum number of participants. A minimum of two full-priced participants applies for most trips, but this may increase to a minimum of six full-priced participants for certain tours including boat or transportation.
<br>
<br>If such cancellation or major change occurs, and you do not accept the alternative provided, we will give a full refund. However, in order to give you the best possible experience, we reserve the right to make minor adjustments in the arrangements from the supplier. Such adjustments may occur due to closed roads, weather, snow or other conditions of nature. Please note that Book Finnmark has no control over the exchange rate calculated by refund to credit cards and is not responsible for any loss due to currency conversions. Also note that Book Finnmark does not pay any bank fees incurred for international transfers, and that such fees are deducted from the amount to be refunded. Credit card fees are non-refundable. Book Finnmark is not responsible for delays in reimbursement due to payment providers or external circumstances.
<br> 
<br><strong>Groups
</strong><br>Please contact Book Finnmark by e-mail for group bookings.
<br>
<br><strong>Price categories
<br></strong>The supplier determines the price level and the age limits applicable for children’s and youth discounts. Student discount: a valid student card must be presented. Senior discount: applicable for guests aged 67 and over with valid ID. Relevant documentation must be presented on arrival.
<br>
<br><strong>Claims and complaints
<br></strong>Claims or complaints related to specific activities or products must be directed to the supplier concerned. Book Finnmark has no liability related to the individual product. Book Finnmark is responsible for forwarding your booking to your chosen supplier, who in turn is responsible for providing the activity, accommodation or rental equipment in accordance with your booking. It is the supplier’s responsibility to ensure that safety and provision of the product is in line with the product description. Book Finnmark is not responsible for the outcome on tours that depend on weather and nature. This includes whale watching, northern lights tours or any other wildlife sightseeing tour. We encourage travelers to take their time and to visit the chosen tour supplier several times if necessary. Nature rewards the traveller.
<br><br>Welcome to Arctic adventures in Finnmark!
<br>
<br>BOOK FINNMARK</p>
                            </div>
                        </div>
                    </div>
                    <div id="tab3" class="tab-pane" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <p class="mbr-text mbr-fonts-style display-7">Price Guarantee
<br>If you book through our website you can be assured of receiving the best price with our suppliers. Please compare the prices at our local providers of accommodation and activities - if you find the same service at a lower price, we would like to hear from you. Contact us for more information about our price policy.
<br>
<br>Disclaimer
<br>The price guarantee does not include price increases due to changes in taxes , customs fees and services, as well as price increases for transport connection which is beyond our control. For further information, check the terms of your current booking.
<br>
<br>The price guarantee does not apply to contract awards or other non-public rates, including group rates, package rates, promotional prices and subscription prices. The price guarantee does not apply to discontinued prices, including prices stored in your browser (stored information) prices with other payment arrangements - such as prepayment.
<br>
<br>This price guarantee applies only bookable products on this site.</p>
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
}

function renderFAQ($con, $language)
{
    $categories = [
        "Transportation" => $language === "no" ? "Transport" : "Transportation",
        "General information" => $language === "no" ? "Generell informasjon" : "General information",
        "Sights and city attractions" => $language === "no" ? "Severdigheter og byattraksjoner" : "Sights and city attractions",
        "Nature and Tours" => $language === "no" ? "Natur og turer" : "Nature and Tours",
        "How do I get to?" => $language === "no" ? "Hvordan kommer jeg til?" : "How do I get to?"
    ];

    // Prepare the query based on the language
    $query = $language === "no" ? "SELECT nquestion AS question, nanswer AS answer, category FROM faq ORDER BY category" :
                                  "SELECT question, answer, category FROM faq ORDER BY category";

    // Execute the query
    $result = $con->query($query);

    if ($result) {
        // Keep track of the current category
        $current_category = null;
        $question_counter = 0; // Counter for each question
?>
<section data-bs-version="5.1" class="content16 cid-tHQpTcuNsh" id="content16-e">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-10">
                <div class="mbr-section-head align-center mb-4">
                    <h3 class="mbr-section-title mb-0 mbr-fonts-style display-2"><strong><?php echo $language === 'no' ? 'Turistinformasjon' : 'Tourist information'; ?></strong></h3><br><br>
                </div>
                <?php
                while ($row = $result->fetch_assoc()) {
                    $question = html_entity_decode($row['question']);
                    $answer = html_entity_decode($row['answer']);
                    $category = $row['category'];
                    
                    $question_counter++;

                    if ($category !== $current_category) {
                        // We've moved to a new category, close the previous accordion if it exists
                        if ($current_category !== null) {
                            echo '</div><br><br>'; // close the accordion
                        }

                        // Start a new accordion for the new category
                        $current_category = $category;
                        echo '<h3 class="mbr-section-title mb-0 mbr-fonts-style display-2"><strong>' . $categories[$category] . '</strong></h3><br><br>';
                        echo '<div id="accordion' . $question_counter . '" class="panel-group accordionStyles accordion" role="tablist" aria-multiselectable="true">';
                    }

                    ?>
                    <div class="card mb-3">
                        <div class="card-header" role="tab" id="heading<?php echo $question_counter; ?>">
                            <a role="button" class="panel-title collapsed" data-toggle="collapse"
                               data-bs-toggle="collapse" data-core=""
                               href="#collapse<?php echo $question_counter; ?>" aria-expanded="false"
                               aria-controls="collapse<?php echo $question_counter; ?>">
                                <h6 class="panel-title-edit mbr-fonts-style mb-0 display-7">
                                    <strong><?php echo $question; ?></strong></h6>
                                <span class="sign mbr-iconfont mbri-arrow-down"></span>
                            </a>
                        </div>
                        <div id="collapse<?php echo $question_counter; ?>" class="panel-collapse noScroll collapse"
                             role="tabpanel" aria-labelledby="heading<?php echo $question_counter; ?>"
                             data-parent="#accordion<?php echo $question_counter; ?>">
                            <div class="panel-body">
                                <p class="mbr-fonts-style panel-text display-4"><?php echo $answer; ?></p>
                            </div>
                        </div>
                    </div>
                    <?php
                } // end of while loop
                ?>
                </div> <!-- Close the last accordion -->
            </div>
        </div>
    </div>
</section>

<?php
    } else {
        // Error handling if the query fails
        echo "Failed to fetch FAQ data from the database.";
    }
} // end of function





function renderContact($con, $language)
{
    if ($language === "no")
    {?>  
        <section data-bs-version="5.1" class="form7 cid-tHQqibmiYA" id="contact">  
            <div class="container">
                <div class="mbr-section-head">
                    <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                        <strong>Kom i kontakt med oss!</strong></h3>        
                </div>
                <div class="row justify-content-center mt-4">
                    <div class="col-lg-8 mx-auto mbr-form" data-form-type="">
                        <form action="" method="POST" class="mbr-form form-with-styler mx-auto" data-form-title="Form Name">
                            <input type="hidden" name="tokenId" data-form-email="true" value="iKk/zKnQ0a0FKk4dC0PhIygddUthscK1kpu/Bfni1BBSm9x81D0/Gi/uWqIZmDaHZ9h9Asi88RwA+roGm0jgunqzboV14GIDdmW1EvrJ6xSF0EJV9ZWIdgQGsVfjiQlB.mbEUzwCzaFZtnZyYH70izeKJ10VvWj5QfyRjq4JP6L2dG8gCa6PiD6P/aqk/FgOfuHsn5iw3Gi1iYct/84CeysZaZj/NeOyW29zNl59nP9EN4yUoXm37iKF4YE2wOawJ">
                            <input type="hidden" name="website" data-form-email="true" value="wegener.no">
                            <p class="mbr-text mbr-fonts-style align-center mb-4 display-7">
                                En på vårt team svarer deg i løpet av en vanlig arbeidsdag.</p>
                            <div class="row">
                                <div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Takk for at du har fyllt ut skjema</div>
                                <div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">
                                    Oops...! vi har et problem, prøv igjen senere!
                                </div>
                            </div>
                            <div class="dragArea row">
                                <div class="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="name">
                                    <input type="text" name="name" placeholder="Navn" data-form-field="name" class="form-control" value="" id="name-form7-f">
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="email">
                                    <input type="email" name="email" placeholder="E-post" data-form-field="email" class="form-control" value="" id="email-form7-f">
                                </div>
                                <div data-for="phone" class="col-lg-12 col-md-12 col-sm-12 form-group mb-3">
                                    <input type="text" name="phone" placeholder="Telefon" data-form-field="phone" class="form-control" value="" id="phone-form7-f">
                                </div>
                                <div data-for="message" class="col-lg-12 col-md-12 col-sm-12 form-group mb-3">
                                    <input type="textbox" name="message" placeholder="Melding" data-form-field="message" class="form-control" value="" id="phone-form7-f">
                                </div>
                                <div class="col-auto mbr-section-btn align-center">
                                    <button type="submit" name="sendContact" class="btn btn-primary display-4">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
<?php
    }
    else
    { ?>
        <section data-bs-version="5.1" class="form7 cid-tHQqibmiYA" id="contact">
            
            
            <div class="container">
                <div class="mbr-section-head">
                    <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                        <strong>Get in touch!</strong></h3>
                    
                </div>
                <div class="row justify-content-center mt-4">
                    <div class="col-lg-8 mx-auto mbr-form" data-form-type="">
                        <form action="" method="POST" class="mbr-form form-with-styler mx-auto" data-form-title="Form Name">
                            <input type="hidden" name="tokenId" data-form-email="true" value="iKk/zKnQ0a0FKk4dC0PhIygddUthscK1kpu/Bfni1BBSm9x81D0/Gi/uWqIZmDaHZ9h9Asi88RwA+roGm0jgunqzboV14GIDdmW1EvrJ6xSF0EJV9ZWIdgQGsVfjiQlB.mbEUzwCzaFZtnZyYH70izeKJ10VvWj5QfyRjq4JP6L2dG8gCa6PiD6P/aqk/FgOfuHsn5iw3Gi1iYct/84CeysZaZj/NeOyW29zNl59nP9EN4yUoXm37iKF4YE2wOawJ">
                            <input type="hidden" name="website" data-form-email="true" value="wegener.no">
                            <p class="mbr-text mbr-fonts-style align-center mb-4 display-7">
                                One in our team will respond soon</p>
                            <div class="row">
                                <div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Thanks for filling out the form!</div>
                                <div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">
                                    Oops...! some problem!
                                </div>
                            </div>
                            <div class="dragArea row">
                                <div class="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="name">
                                    <input type="text" name="name" placeholder="Name" data-form-field="name" class="form-control" value="" id="name-form7-f">
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="email">
                                    <input type="email" name="email" placeholder="Email" data-form-field="email" class="form-control" value="" id="email-form7-f">
                                </div>
                                <div data-for="phone" class="col-lg-12 col-md-12 col-sm-12 form-group mb-3">
                                    <input type="tel" name="phone" placeholder="Phone" data-form-field="phone" class="form-control" value="" id="phone-form7-f">
                                </div>
                                <div data-for="message" class="col-lg-12 col-md-12 col-sm-12 form-group mb-3">
                                    <input type="textbox" name="message" placeholder="Message" data-form-field="message" class="form-control" value="" id="phone-form7-f">
                                </div>
                                <div class="col-auto mbr-section-btn align-center">
                                    <button type="submit" name="sendContact" class="btn btn-primary display-4">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    
<?php
    }
}



//  Booking

function renderBooking($con, $language)
{
?>
<br><br>
<div id="cb_init_bookingengine">

     <h1>Booking engine goes here.</h1>

</div>


<?php
}

function renderHome($con, $language)
{
    renderVideo();
}



//  Employees

function renderEmployees($con, $language)
{
    
        $sql = "SELECT * FROM `employee`";


    
    $result = $con->query($sql);


    ?>
        <style>
    /* Styles for the carousel and credits */
    .slider1 {
        /* Add your custom carousel styles here */
    }

    .carousel-caption {
         /* Semi-transparent black background */
        padding: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        color: white;
    }

    .carousel-caption h5 {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
    }

    .carousel-caption p {
        margin: 0;
        font-size: 14px;
    }
</style>

<section data-bs-version="5.1" class="slider1 cid-tIZ82jKuOU" id="slider1-10">
    <div class="carousel slide" id="tIZcW9119j" data-interval="5000" data-bs-interval="5000">
        <div class="carousel-inner">
                <div class="carousel-item slider-image item active">
                    <div class="item-wrapper">
                        <?php echo renderPictureTag('assets/images/alle.jpg', 'class="d-block w-100 slider-image" alt=""'); ?>
                    </div>
                    <div class="carousel-caption d-none d-md-block">
                    </div>
                </div>
        </div>
    </div>
</section>

        <section data-bs-version="5.1" class="team1 cid-tHBvcdoEVv" id="team1-a">
            <div class="container">
                <div class="row justify-content-center">



    <?php
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                $id = $row["id"];
                $name = $row["name"]; 
                $email = $row["email"];
                $title = $row["title"];  
                $ntitle = $row["ntitle"]; 
                $image = normalizeMediaUrl($row["image"]); 
                
                if (isset($_GET['lang']) && $_GET['lang'] === "no") 
                {
                    renderEmployeecard($id, $name, $ntitle, $email, $image); 
                }
                else
                {
                    renderEmployeecard($id, $name, $title, $email, $image); 
                }
            }
        } 
        else 
        {
             
        } 

        ?>
                </div>
            </div>
        </section>
<?php



}
function renderEmployeecard($id, $name, $title, $email, $link)
{?>


    
            
            <div class="col-sm-6 col-lg-4">
                <div class="card-wrap">
                    <div class="image-wrap">
                        <?php echo renderPictureTag($link, 'alt=""'); ?>
                    </div>
                    <div class="content-wrap">
                        <h5 class="mbr-section-title card-title mbr-fonts-style align-center m-0 display-5">
                            <strong><?php echo $name?></strong></h5>
                            <h6 class="mbr-role mbr-fonts-style align-center mb-3 display-4">
                            <strong><?php echo $title?></strong>
                            <p class="card-text mbr-fonts-style align-center display-7"><a href="mailto:<?php echo $email?>"><?php echo $email?></a></p>
                        </h6>
                    </div>
                </div>
            </div>   

<?php
}



//  Shared
function renderCookieConsent()
{
?>
<div id="cookie-consent-popup" class="cookie-consent-popup" data-lang="en">
        <p id="cookie-message"></p>
        <div class="buttons">
            <button id="accept-cookies"></button>
            <button id="necessary-cookies"></button>
            <button id="deny-cookies"></button>
        </div>
    </div>
<?php 

}




function renderInfo($head, $body)
{
?>
<br><br><br><br>
<section class="header1 cid-rLYFrBEsnL" id="header16-17">
    <div class="container">
        <div class="row justify-content-md-center">
            <div class="col-md-10 align-center">
                <h1 class="mbr-section-title mbr-bold pb-3 mbr-fonts-style display-5">
                    <?php echo $head;?></h1>
                
                <p class="mbr-text pb-3 mbr-fonts-style display-7">
                    <?php echo $body;?>
                </p>
                
            </div>
        </div>
    </div>
</section>
<?php 

}

function renderVideo()
{
?>
<style>
  /* CSS to make the hero image fill available height and crop sides */
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: auto; /* Enable scrolling */
  }

  #visithammerfest-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
    height: 100vh; /* Fill the viewport height */
  }

  #visithammerfest-hero {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .spacer {
    height: 100vh; /* Ensure initial spacer height matches the viewport height */
  }
</style>

<div id="visithammerfest-container">
  <img src="assets/images/front.jpg" alt="Visit Hammerfest" id="visithammerfest-hero" decoding="async" fetchpriority="high">
</div>

<div class="spacer"></div>
<?php
}


function renderSlider($con, $id, $page, $name)
{
    // Retrieve uploaded files from the database
    $selectQuery = "SELECT filename, photographer FROM files WHERE page = '$page' AND pageid = '$id'";
    $result = mysqli_query($con, $selectQuery);
    if (!$result) {   
        renderInfo("FAIL", mysqli_error($con));
        die("Database query failed: " . mysqli_error($con));
    }
    $numItems = mysqli_num_rows($result);
?>

<style>
    /* Styles for the carousel and credits */
    .slider1 {
        /* Add your custom carousel styles here */
    }

    .carousel-caption {
         /* Semi-transparent black background */
        padding: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        color: white;
    }

    .carousel-caption h5 {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
    }

    .carousel-caption p {
        margin: 0;
        font-size: 14px;
    }
</style>

<section data-bs-version="5.1" class="slider1 cid-tIZ82jKuOU" id="slider1-10">
    <div class="carousel slide" id="tIZcW9119j" data-interval="5000" data-bs-interval="5000">
        <ol class="carousel-indicators">
            <?php for ($i = 0; $i < $numItems; $i++) { ?>
                <li data-slide-to="<?php echo $i; ?>" data-bs-slide-to="<?php echo $i; ?>" <?php echo ($i === 0) ? 'class="active"' : ''; ?> data-target="#tHYYg61U8e" data-bs-target="#tHYYg61U8e"></li>
            <?php } ?>
        </ol>
        <div class="carousel-inner">
            <?php
            $active = true;
            while ($row = mysqli_fetch_assoc($result)) {
                $filename = $row['filename'];
                ?>
                <div class="carousel-item slider-image item <?php echo ($active) ? 'active' : ''; ?>">
                    <div class="item-wrapper">
                        <?php echo renderPictureTag('assets/images/uploads/' . $filename, 'class="d-block w-100 slider-image" alt=""'); ?>
                    </div>
                    <div class="carousel-caption d-none d-md-block">
                        <div class="photographer-credits">
                            <h5 class="mbr-section-subtitle mbr-fonts-style display-5">
                                <strong><?php echo $name; ?></strong>
                            </h5>
                            <?php if (isset($row['photographer']) && trim($row['photographer']) !== '') { ?>
                                <p class="mbr-section-text mbr-fonts-style display-7"><?php echo 'Photo by ' . $row['photographer']; ?></p>
                            <?php } ?>
                        </div>
                    </div>
                </div>
                <?php
                $active = false;
            }
            ?>
        </div>
        <a class="carousel-control carousel-control-prev" role="button" data-slide="prev" data-bs-slide="prev" href="#tIZcW9119j">
            <span class="mobi-mbri mobi-mbri-arrow-prev" aria-hidden="true"></span>
            <span class="sr-only visually-hidden">Previous</span>
        </a>
        <a class="carousel-control carousel-control-next" role="button" data-slide="next" data-bs-slide="next" href="#tIZcW9119j">
            <span class="mobi-mbri mobi-mbri-arrow-next" aria-hidden="true"></span>
            <span class="sr-only visually-hidden">Next</span>
        </a>
    </div>
</section>

<?php
}

?>
