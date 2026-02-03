<?php
// Set the desired thumbnail width
$thumbnailWidth = 288;

// Absolute path to the project root so we can work with the filesystem directly.
$projectRoot = realpath(__DIR__ . '/..');

// Function to create a thumbnail from an image URL
function createThumbnail($imageUrl, $projectRoot, $thumbnailWidth) {
    $relativePath = parse_url($imageUrl, PHP_URL_PATH);
    if (!$relativePath) {
        echo "Invalid URL provided: $imageUrl";
        return false;
    }

    $sourceImagePath = $projectRoot . $relativePath;
    if (!file_exists($sourceImagePath)) {
        echo "Source image not found for $imageUrl";
        return false;
    }

    $filename = basename($sourceImagePath);
    $outputImagePath = dirname($sourceImagePath) . '/thumbnail_' . $filename;

    $imageInfo = getimagesize($sourceImagePath);
    if (!$imageInfo) {
        echo "Unable to read image info for $imageUrl";
        return false;
    }

    // Determine the image format (JPEG or PNG)
    if ($imageInfo['mime'] === 'image/jpeg') {
        $image = imagecreatefromjpeg($sourceImagePath);
        $saveFunction = function($resource, $path) {
            return imagejpeg($resource, $path, 90);
        };
    } elseif ($imageInfo['mime'] === 'image/png') {
        $image = imagecreatefrompng($sourceImagePath);
        $saveFunction = function($resource, $path) {
            imagesavealpha($resource, true);
            return imagepng($resource, $path);
        };
    } else {
        echo "Unsupported image format for $imageUrl";
        return false;
    }

    if (!$image) {
        echo "Error creating image from $imageUrl";
        return false;
    }

    $thumbnailHeight = (int) (imagesy($image) * ($thumbnailWidth / imagesx($image)));
    if ($thumbnailWidth <= 0 || $thumbnailHeight <= 0) {
        echo "Invalid thumbnail dimensions for $imageUrl";
        imagedestroy($image);
        return false;
    }

    $thumbnail = imagecreatetruecolor($thumbnailWidth, $thumbnailHeight);
    if ($imageInfo['mime'] === 'image/png') {
        // Preserve transparency for PNG thumbnails.
        imagealphablending($thumbnail, false);
        imagesavealpha($thumbnail, true);
    }

    imagecopyresampled(
        $thumbnail,
        $image,
        0,
        0,
        0,
        0,
        $thumbnailWidth,
        $thumbnailHeight,
        imagesx($image),
        imagesy($image)
    );

    if (!$saveFunction($thumbnail, $outputImagePath)) {
        echo "Error saving thumbnail for $imageUrl";
        imagedestroy($image);
        imagedestroy($thumbnail);
        return false;
    }

    imagedestroy($image);
    imagedestroy($thumbnail);

    // Return the public URL for the thumbnail.
    return dirname($imageUrl) . '/thumbnail_' . $filename;
}

// Input image URLs

$inputImageUrls = array(
    'https://visithammerfest.no/assets/images/uploads/image_64a8131e40416.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64a8154602424.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64a8331c24563.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64a83071693b4.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64a834a124faf.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b69246b9a62.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64a83951a6eca.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64abcda9b127b.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64abd0887087a.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64abd44ce75b4.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64abe4e627af5.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64abe6c1afb6f.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b90f58bcf03.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ac07062d4ac.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ac0aaa35c47.png',
    'https://visithammerfest.no/assets/images/uploads/image_64ac0c5cd73f8.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ac0e9f8e001.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ac12b46609e.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b932484d4b0.png',
    'https://visithammerfest.no/assets/images/uploads/image_64ac2e44456ac.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ac344b340e4.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ac3526d065c.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad0a443bff6.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad0cfb9303b.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad0e3dc2437.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad18c0c4f0b.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad1abcbb821.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad1c0c704be.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad1dd094fdf.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad206fdf2fe.png',
    'https://visithammerfest.no/assets/images/uploads/image_64ad247c848ab.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba8f7e9f0b2.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad27105a592.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ad2d4e7ef89.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b666a0437b9.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b669a0e3444.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b6a09d4744a.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b6a4b33478f.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b6a6b991233.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b6a86a6432c.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b6a9ccb0975.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b9671104a85.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b906e6e6513.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b90a19805cc.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b9122000038.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b91507b4302.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b915ef7a995.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b9188a2b85d.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b92fdc26b4a.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64b933a4774f4.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b93940cab1b.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b93a6cd113b.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b93f63a0391.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b941a768430.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b9439c5a93e.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b9452a240aa.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b947d8315e0.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b9491b53701.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b958699c3e3.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b95a5ace1c8.png',
    'https://visithammerfest.no/assets/images/uploads/image_64b95ee4ef08c.png',
    'https://visithammerfest.no/assets/images/uploads/image_64ba4aa90a450.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba6a6aafaa0.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba70c560374.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba7e1b21db2.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba81876d1ca.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba82fe94853.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba852b7f9a2.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba8833e640a.jpeg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba88b332678.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba8a58ccd88.jpeg',
    'https://visithammerfest.no/assets/images/uploads/image_64ba977ef25a1.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64bba6c92df6e.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbaba65d888.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64bbb85dbf0f1.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbbac0a697e.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbbc6c94d75.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbbdee27762.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbbfb884cb4.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbc0ce025ef.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbc1f67216b.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbc4d5ab861.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbc67d693d5.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbc772594ba.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbc8eee2804.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbcf6456063.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64bbd1b2135e9.png',
    'https://visithammerfest.no/assets/images/uploads/image_64bbd2c814420.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64bbd490588b6.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64bbd619dce9e.jpeg',
    'https://visithammerfest.no/assets/images/uploads/image_64c3e7ec354d1.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64bd26de1324d.png',
    'https://visithammerfest.no/assets/images/uploads/image_64c2388f87708.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64c39e940d1fa.png',
    'https://visithammerfest.no/assets/images/uploads/image_64c3a0b417875.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64c3a31bba9b6.jpg',
    'https://visithammerfest.no/assets/images/uploads/image_64c3a52f5b773.png',
    'https://visithammerfest.no/assets/images/uploads/image_64c3a6b4a9c9c.jpg'
);


$thumbnailPaths = array();

foreach ($inputImageUrls as $imageUrl) {
    $thumbnailPath = createThumbnail($imageUrl, $projectRoot, $thumbnailWidth);
    if ($thumbnailPath) {
        $thumbnailPaths[] = $thumbnailPath;
    }
}

print_r($thumbnailPaths);
?>








