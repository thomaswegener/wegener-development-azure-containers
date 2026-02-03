<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive PDF Flipbook</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background-color: #f4f4f4;
            overflow: hidden;
        }

        #flipbook {
            width: 80vw;
            height: auto;
            max-width: 800px;
            max-height: 90vh;
            position: relative;
            border: 1px solid #ddd;
            background-color: white;
        }

        .page {
            display: none;
        }

        .page:first-child {
            display: block;
        }

        #progress-bar {
            position: fixed;
            bottom: 10px;
            left: 10px;
            height: 5px;
            background-color: black;
            width: 0;
            transition: width 0.3s ease;
            z-index: 100;
        }

        #button-container {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }

        #exit-button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background-color: red;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        z-index: 101;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        }

        #exit-button:hover {
            background-color: darkred;
        }

        .action-button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background-color: #000000;
            color: white;
            font-size: 14px;
            text-align: center;
        }

        .action-button:hover {
            background-color: #000042;
        }

        #zoom-slider {
            margin-top: 10px;
            width: 100%;
        }

        /* Fullscreen zoom view */
        #zoomed-container {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
            justify-content: center;
            align-items: center;
            z-index: 100;
        }

        #zoomed-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        /* Position for the back button */
        #back-button {
            position: absolute;
            bottom: 20px;
            left: 20px;
            padding: 10px 20px;
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 101; /* Ensure it's on top of the zoomed image */
        }

        #back-button:hover {
            background-color: #000042;
        }

        #loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #ffffff;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
}

#loading-progress {
    width: 200px;
    height: 6px;
    background-color: #ccc;
    margin-top: 20px;
    border-radius: 3px;
    overflow: hidden;
}

#loading-progress div {
    height: 100%;
    width: 0%;
    background-color: #000;
    animation: loadBar 2s infinite;
}

@keyframes loadBar {
    0% { width: 0%; }
    50% { width: 80%; }
    100% { width: 0%; }
}

        @media (max-width: 768px) {
            #flipbook {
                width: 95vw;
                max-height: 80vh;
            }
        }
    </style>
</head>
<body>

<div id="flipbook"></div>
<div id="progress-bar"></div>
<div id="loading-screen">
    <p>In Norway we say;<br><strong>Waiting for something good is never in vain!</strong></p>
    <div id="loading-progress"><div></div></div>
</div>

<!-- Action buttons -->
<div id="button-container">
    <button class="action-button" id="download-btn">Download PDF</button>
    <button class="action-button" id="share-btn">Share</button>
    <button class="action-button" id="zoom-btn">Zoom In</button>
</div>

<!-- Zoomed-in View Container -->
<div id="zoomed-container">
    <img id="zoomed-image" />
    <button id="exit-button">X</button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="turn.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>

<script>
    const pdfUrl = 'catalog.pdf'; // Your PDF file path
    let totalPages = 0;
    let aspectRatio = 1; // Default aspect ratio
    let scale = 2; // Full resolution scale for zooming

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    async function loadPDF() {
    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const flipbook = $('#flipbook');
        totalPages = pdf.numPages;

        flipbook.empty(); // Clear previous pages

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.classList.add('page');

            // Render the page
            await page.render({ canvasContext: context, viewport }).promise;

            if (pageNum === 1) {
                // Set aspect ratio based on the first page
                aspectRatio = viewport.width / viewport.height;
                adjustFlipbookSize();
            }

            flipbook.append(canvas);
        }

        initializeFlipbook();

        // Hide the loading screen once fully loaded
        document.getElementById('loading-screen').style.display = 'none';
    } catch (error) {
        console.error("Error loading PDF:", error);
    }
}


    function adjustFlipbookSize() {
        const flipbook = $('#flipbook');
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let width = Math.min(screenWidth * 0.8, 800);
        let height = width / aspectRatio;

        if (height > screenHeight * 0.9) {
            height = screenHeight * 0.9;
            width = height * aspectRatio;
        }

        flipbook.css({ width: `${width}px`, height: `${height}px` });
    }

    function initializeFlipbook() {
        const flipbook = $('#flipbook');
        flipbook.turn({
            width: flipbook.width(),
            height: flipbook.height(),
            autoCenter: true,
            display: 'single',
        });

        setupInteraction(flipbook);
    }

    function setupInteraction(flipbook) {
        let lastFlipTime = 0;

        // Mouse scrolling
        window.addEventListener("wheel", (event) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastFlipTime < 500) return;

            const currentPage = flipbook.turn("page");
            if (event.deltaY > 0 && currentPage < totalPages) {
                flipbook.turn("next");
            } else if (event.deltaY < 0 && currentPage > 1) {
                flipbook.turn("previous");
            }
            updateProgressBar(flipbook.turn("page"), totalPages);
            lastFlipTime = currentTime;
        });

        // Click or tap
        flipbook.on("click touchstart", (event) => {
            const currentPage = flipbook.turn("page");
            const xPos = event.pageX || event.originalEvent.touches[0].pageX;

            if (xPos < flipbook.width() / 2 && currentPage > 1) {
                flipbook.turn("previous");
            } else if (xPos >= flipbook.width() / 2 && currentPage < totalPages) {
                flipbook.turn("next");
            }
            updateProgressBar(flipbook.turn("page"), totalPages);
        });
    }

    function updateProgressBar(currentPage, totalPages) {
        const progress = (currentPage / totalPages) * 100;
        document.getElementById("progress-bar").style.width = progress + "%";
    }

    // Download button functionality
    document.getElementById('download-btn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'catalog.pdf';
        link.click();
    });

    // Share button functionality
    document.getElementById('share-btn').addEventListener('click', () => {
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pdfUrl)}`;
        window.open(fbShareUrl, '_blank');
    });

    // Zoom In button functionality
    document.getElementById('zoom-btn').addEventListener('click', async () => {
        const flipbook = $('#flipbook');
        const currentPage = flipbook.turn('page');
        
        // Render the current page at full resolution
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // Show the zoomed-in image in a modal-like container
        const zoomedImage = document.getElementById('zoomed-image');
        zoomedImage.src = canvas.toDataURL();

        document.getElementById('zoomed-container').style.display = 'flex';
    });

    // Back button functionality
    document.getElementById('exit-button').addEventListener('click', () => {
    document.getElementById('zoomed-container').style.display = 'none';
});

    window.addEventListener('resize', adjustFlipbookSize);
    document.addEventListener('DOMContentLoaded', loadPDF);
</script>

</body>
</html>
