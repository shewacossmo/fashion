function openTab(tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    const tabButtons = document.getElementsByClassName('tab-button');

    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
        tabButtons[i].classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');
const message = document.getElementById('message');
const imageUpload = document.getElementById('imageUpload');

// Function to fetch and display saved images from the server
async function fetchImages() {
    try {
        const response = await fetch('http://localhost:5000/uploads');
        const files = await response.json();

        files.forEach(imageUrl => {
            addImageToGallery(imageUrl);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Load saved images from the server on page load
window.onload = () => {
    fetchImages();
};

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const files = imageUpload.files;

    if (files.length === 0) {
        message.textContent = 'No images selected!';
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            message.textContent = `${result.files.length} image(s) uploaded successfully!`;

            // Display uploaded images in the gallery
            result.files.forEach(imageUrl => {
                addImageToGallery(imageUrl);
            });

            // Hide the upload form after upload is complete
            uploadForm.classList.add('hidden');
        } else {
            message.textContent = result.message || 'Failed to upload images.';
        }
    } catch (error) {
        message.textContent = 'An error occurred while uploading images.';
        console.error('Error uploading images:', error);
    }
});

// Add image to gallery and enable zoom functionality
function addImageToGallery(imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.onclick = () => openModal(imageUrl);
    gallery.appendChild(img);
}

// Open modal with the clicked image
function openModal(imageUrl) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImage.src = imageUrl;
}

// Close modal
document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
};

// Close modal when clicking outside the image
window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
