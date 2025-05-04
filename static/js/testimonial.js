const testimonials = [
    {
        rating: 5,
        text: "Martabak telur terbaik yang pernah saya cicipi! Isian yang melimpah dan rasa yang seimbang sempurna.",
        author: "Budi S."
    },
    {
        rating: 5,
        text: "Martabak Manis dengan coklat dan keju adalah favorit saya! Selalu segar dan lezat. Pengiriman cepat juga!",
        author: "Siti R."
    },
    {
        rating: 5,
        text: "Martabak Tipis Kering sangat renyah dan penuh rasa! Sempurna untuk berbagi dengan teman saat malam film.",
        author: "Dewi A."
    },
    {
        rating: 5,
        text: "Aroma khas dari Martabak Pandan Wangi benar-benar membuat saya ketagihan. Rasanya autentik!",
        author: "Ahmad K."
    },
    {
        rating: 5,
        text: "Pelayanannya ramah dan cepat. Martabak selalu disajikan hangat dan segar. Tak pernah mengecewakan!",
        author: "Linda P."
    },
    {
        rating: 4,
        text: "Varian rasa martabak manisnya banyak dan semua enak. Tapi favorit saya tetap coklat kacang!",
        author: "Joko W."
    }
];

// Function to create testimonial cards
function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    const starsDiv = document.createElement('div');
    starsDiv.className = 'testimonial-stars';
    
    for (let i = 0; i < testimonial.rating; i++) {
        const star = document.createElement('i');
        star.className = 'bi bi-star-fill';
        starsDiv.appendChild(star);
    }
    
    const textDiv = document.createElement('div');
    textDiv.className = 'testimonial-text';
    textDiv.textContent = `"${testimonial.text}"`;
    
    const authorDiv = document.createElement('div');
    authorDiv.className = 'testimonial-author';
    authorDiv.textContent = `- ${testimonial.author}`;
    
    card.appendChild(starsDiv);
    card.appendChild(textDiv);
    card.appendChild(authorDiv);
    
    return card;
}

// Variables for animation
let position = 0;
const cardWidth = 320; // Card width + margin
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Populate track with testimonial cards
function populateTrack() {
    // Add original testimonials
    testimonials.forEach(testimonial => {
        track.appendChild(createTestimonialCard(testimonial));
    });
    
    // Add clones of the first few testimonials for smooth looping
    for (let i = 0; i < 3; i++) {
        track.appendChild(createTestimonialCard(testimonials[i]));
    }
}

// Initialize
populateTrack();

function updatePosition() {
    track.style.transform = `translateX(${position}px)`;
}

// Manual navigation with buttons
nextBtn.addEventListener('click', () => {
    position -= cardWidth;
    
    // Check if we need to reset position for looping
    if (position <= -(testimonials.length * cardWidth)) {
        position = 0;
        track.style.transition = 'none';
        track.style.transform = `translateX(${position}px)`;
        // Force reflow
        track.offsetHeight;
        track.style.transition = 'transform 0.8s ease';
    }
    
    updatePosition();
});

prevBtn.addEventListener('click', () => {
    position += cardWidth;
    
    // Check if we need to reset position for looping
    if (position > 0) {
        position = -(testimonials.length * cardWidth) + cardWidth;
        track.style.transition = 'none';
        track.style.transform = `translateX(${position}px)`;
        // Force reflow
        track.offsetHeight;
        track.style.transition = 'transform 0.8s ease';
    }
    
    updatePosition();
});

// Touch/mouse swipe functionality
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;

track.addEventListener('mousedown', startDrag);
track.addEventListener('touchstart', startDrag);

window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

window.addEventListener('mousemove', drag);
window.addEventListener('touchmove', drag);

function startDrag(e) {
    isDragging = true;
    startPos = getPositionX(e);
    currentTranslate = position;
    track.style.transition = 'none';
}

function drag(e) {
    if (isDragging) {
        const currentPosition = getPositionX(e);
        const diff = currentPosition - startPos;
        position = currentTranslate + diff;
        updatePosition();
    }
}

function endDrag() {
    isDragging = false;
    track.style.transition = 'transform 0.8s ease';
    
    // Snap to closest card
    const cardPosition = Math.round(position / cardWidth) * cardWidth;
    position = cardPosition;
    
    // Check boundaries for looping
    if (position > 0) {
        position = -(testimonials.length * cardWidth) + cardWidth;
    } else if (position <= -(testimonials.length * cardWidth)) {
        position = 0;
    }
    
    updatePosition();
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}