// function saveCard() {
//     const title = document.getElementById('titleInput').value.trim();
//     const description = document.getElementById('descInput').value.trim();
//     const quillEditor = document.querySelector('.ql-editor');
//     let content = quillEditor.innerHTML.trim();
//     const imageFile = document.getElementById('fileElem').files[0];
//     const category = document.querySelector('input[name="blogType"]:checked')?.value;

//     content = content.replace(/<p><br><\/p>/g, '').trim();

//     if (!title || !description || !content || !imageFile || !category) {
//         alert("Please fill all fields, select an image, and choose a category.");
//         return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('content', content);
//     formData.append('category', category);
//     formData.append('image', imageFile);

//     fetch('http://localhost:3000/createPost', {  
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (response.ok) {
//             alert("Post created successfully!");
//             window.location.href = 'card.html';
//         } else {
//             alert("Failed to create post.");
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert("Error occurred while creating post.");
//     });
// }

function saveCard() {
    const title = document.getElementById('titleInput').value.trim();
    const description = document.getElementById('descInput').value.trim();
    const quillEditor = document.querySelector('.ql-editor');
    let content = quillEditor.innerHTML.trim();
    const imageFile = document.getElementById('fileElem').files[0];
    const category = document.querySelector('input[name="blogType"]:checked')?.value;

    // Sanitize the content by removing empty tags (optional but can help)
    content = content.replace(/<p><br><\/p>/g, '').trim(); // Remove empty paragraphs

    if (!title || !description || !content || !imageFile || !category) {
        alert("Please fill all fields, select an image, and choose a category.");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function () {
        const imageData = reader.result;

        const card = {
            title: title,
            description: description,
            content: content,
            image: imageData,
            category: category
        };

        const cards = JSON.parse(localStorage.getItem('cards')) || [];
        cards.push(card);
        localStorage.setItem('cards', JSON.stringify(cards));

        alert("Card added successfully!");
        window.location.href = 'card.html';
    };
}
document.addEventListener('DOMContentLoaded', function () {
    const cardsContainer = document.getElementById('cardsContainer');
    const cards = JSON.parse(localStorage.getItem('cards')) || [];

    // Function to display cards
    function displayCards(filteredCards) {
        cardsContainer.innerHTML = ''; // Clear the container
        if (filteredCards.length === 0) {
            const noCardsMessage = document.createElement('p');
            noCardsMessage.textContent = "No cards available.";
            cardsContainer.appendChild(noCardsMessage);
            return;
        }

        filteredCards.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';

            const img = document.createElement('img');
            img.src = card.image;
            img.alt = 'Card Image';

            const title = document.createElement('h3');
            title.textContent = card.title;

            const desc = document.createElement('p');
            desc.textContent = card.description;

            const viewButton = document.createElement('button');
            viewButton.textContent = 'View Details';
            viewButton.onclick = function () {
                viewCardDetails(index);
            };

            cardDiv.appendChild(img);
            cardDiv.appendChild(title);
            cardDiv.appendChild(desc);
            cardDiv.appendChild(viewButton);

            cardsContainer.appendChild(cardDiv);
        });
    }

    // Display all cards initially
    displayCards(cards);

    // Listen for changes in category checkboxes
    const categoryFilterForm = document.getElementById('categoryFilterForm');
    categoryFilterForm.addEventListener('change', function () {
        const selectedCategory = categoryFilterForm.querySelector('input[name="blogType"]:checked')?.value; // Get selected category
        const filteredCards = selectedCategory ? cards.filter(card => card.category === selectedCategory) : cards; // Filter cards
        displayCards(filteredCards);
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim().toLowerCase(); 
        if (searchTerm === '') {
            displayCards(cards); 
            return;
        }

        // Filter cards by title or description that matches the search term
        const filteredCards = cards.filter(card => 
            card.title.toLowerCase().includes(searchTerm) || 
            card.description.toLowerCase().includes(searchTerm)
        );

        displayCards(filteredCards); // Show only matching cards
    });

    // You can also enable searching on 'Enter' key press
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchButton.click(); 
        }
    });
});

// Function to view card details 
function viewCardDetails(index) {
    localStorage.setItem('selectedCardIndex', index);
    window.location.href = 'content.html';
}


