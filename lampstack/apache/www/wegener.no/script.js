const card = document.getElementById('flip-card');

// Enable flipping on tap for mobile devices
card.addEventListener('click', () => {
    card.style.transform = card.style.transform === 'rotateY(540deg)' 
        ? 'rotateY(0deg)' 
        : 'rotateY(540deg)';
});
