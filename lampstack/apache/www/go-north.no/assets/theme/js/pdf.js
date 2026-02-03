let totalPages = 0;
let aspectRatio = 1;
let scale = 2;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

async function loadPDF() {
    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const flipbook = $('#pdf-flipbook');
        totalPages = pdf.numPages;
        flipbook.empty();

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.classList.add('page');

            await page.render({ canvasContext: context, viewport }).promise;

            if (pageNum === 1) {
                aspectRatio = viewport.width / viewport.height;
                adjustFlipbookSize();
            }

            flipbook.append(canvas);
        }

        initializeFlipbook();
    } catch (error) {
        console.error("Error loading PDF:", error);
    }
}

function adjustFlipbookSize() {
    const flipbook = $('#pdf-flipbook');
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
    const flipbook = $('#pdf-flipbook');
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
    document.getElementById("pdf-progress-bar").style.width = progress + "%";
}

document.getElementById('pdf-download-btn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfUrl.split('/').pop();
    link.click();
});

document.getElementById('pdf-share-btn').addEventListener('click', () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pdfUrl)}`;
    window.open(fbShareUrl, '_blank');
});

document.getElementById('pdf-zoom-btn').addEventListener('click', async () => {
    const flipbook = $('#pdf-flipbook');
    const currentPage = flipbook.turn('page');

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(currentPage);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const zoomedImage = document.getElementById('pdf-zoomed-image');
    zoomedImage.src = canvas.toDataURL();
    document.getElementById('pdf-zoomed-container').style.display = 'flex';
});

document.getElementById('pdf-exit-button').addEventListener('click', () => {
    document.getElementById('pdf-zoomed-container').style.display = 'none';
});

window.addEventListener('resize', adjustFlipbookSize);
document.addEventListener('DOMContentLoaded', loadPDF);