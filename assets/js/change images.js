console.log("external.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Call garment_images function to load images and apply styles

    // Define garment_images function to dynamically add images and apply styles
    window.garment_images = function() {
        // New images to be added to the gallery
        const newImages = [
            { href: "images/GARMENTS/1.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/1.png", alt: "TEST" },
            { href: "images/GARMENTS/2.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/2.png", alt: "TEST" },
            { href: "images/GARMENTS/3.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/3.png", alt: "TEST" },
            { href: "images/GARMENTS/4.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/4.png", alt: "TEST" },
            { href: "images/GARMENTS/5.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/5.png", alt: "TEST" },
            { href: "images/GARMENTS/6.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/6.png", alt: "TEST" },
            { href: "images/GARMENTS/7.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/7.png", alt: "TEST" },
            { href: "images/GARMENTS/8.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/8.png", alt: "TEST" },
            { href: "images/GARMENTS/9.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/9.png", alt: "TEST" },
            { href: "images/GARMENTS/10.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/10.png", alt: "TEST" },
            { href: "images/GARMENTS/11.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/11.png", alt: "TEST" },
            { href: "images/GARMENTS/12.png", 'data-lightbox': "test", 'data-title': "GARMENTS", 'data-src': "images/GARMENTS/12.png", alt: "TEST" }
            // Add more images as needed
        ];

        // Get the garments div
        const galleryDiv = document.getElementById('photoselect');

        // Clear the current content
        galleryDiv.innerHTML = '';

        // Add new content
        newImages.forEach(image => {
            const a = document.createElement('a');
            a.href = image.href;
            a.dataset.lightbox = 'gallery';
            
            const img = document.createElement('img');
            img.src = image['data-src']; // Using 'data-src' for lazy loading
            img.alt = image.alt;
            
            a.appendChild(img);
            galleryDiv.appendChild(a);
        });

        // Add a class to the garments div
		galleryDiv.className = '';
		galleryDiv.classList.add('photos2');
        

        console.log('Images dynamically added and class "photos2" added to garments div.');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Call portfolio_images function to load images and apply styles

    // Define portfolio_images function to dynamically add images and apply styles
    window.portfolio_images = function() {
        // New images to be added to the gallery
        const newImages = [
            { href: "images/PORTFOLIO/1.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/1.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/2.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/2.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/3.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/3.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/4.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/4.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/5.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/5.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/6.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/6.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/7.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/7.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/8.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/8.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/9.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/9.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/10.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/10.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/11.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/11.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/12.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/12.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/13.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/13.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/14.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/14.jpg", alt: "TEST" },
            { href: "images/PORTFOLIO/15.jpg", 'data-lightbox': "test", 'data-title': "PORTFOLIO", 'data-src': "images/PORTFOLIO/15.jpg", alt: "TEST" }
            // Add more images as needed
        ];

       // Get the garments div
	   const galleryDiv = document.getElementById('photoselect');

	   // Clear the current content
	   galleryDiv.classList.add('photos', "fadeout");
	   galleryDiv.innerHTML = '';
	   

	   // Add new content
	   newImages.forEach(image => {
		   const a = document.createElement('a');
		   a.href = image.href;
		   a.dataset.lightbox = 'gallery';
		   
		   const img = document.createElement('img');
		   img.src = image['data-src']; // Using 'data-src' for lazy loading
		   img.alt = image.alt;
		   
		   a.appendChild(img);
		   galleryDiv.appendChild(a);
	   });

	   // Add a class to the garments div
	   galleryDiv.className = '';
	   galleryDiv.classList.add('photos');
	   

	   console.log('Images dynamically added and class "photos2" added to garments div.');
   }
});


// List of image URLs to preload
const imagesToPreload = [
    "images/GARMENTS/1.png",
    "images/GARMENTS/2.png",
    "images/GARMENTS/3.png",
    "images/GARMENTS/4.png",
    "images/GARMENTS/5.png",
    "images/GARMENTS/6.png",
    "images/GARMENTS/7.png",
    "images/GARMENTS/8.png",
    "images/GARMENTS/9.png",
    "images/GARMENTS/10.png",
    "images/GARMENTS/11.png",
    "images/GARMENTS/12.png",
];

// Function to preload images
function preloadImages(images) {
    images.forEach(imageUrl => {
        const img = new Image();
        img.src = imageUrl;
    });
}

// Call the preloadImages function with the array of image URLs
preloadImages(imagesToPreload);