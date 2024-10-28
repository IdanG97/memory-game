const memoryGameContainer = document.getElementById('memory-game');
let selectedCategoryImages = [];
let selectedCards = [];
let matchedCards = 0;

// Fetch images from APIs based on user selection
async function fetchImages(category) {
  let apiURL;

  if (category === 'hp') {
    apiURL = 'https://hp-api.onrender.com/api/characters';
  } else if (category === 'dogs') {
    apiURL = 'https://dog.ceo/api/breeds/image/random/8';
  } else if (category === 'cats') {
    apiURL = 'https://api.thecatapi.com/v1/images/search?limit=8';
  }

  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    if (category === 'hp') {
      return data.slice(0, 8).map(character => character.image);
    } else if (category === 'dogs') {
      return data.message;
    } else if (category === 'cats') {
      return data.map(cat => cat.url);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Start the game by selecting images based on the user's choice
async function startGame(category) {
    if (category === 'random') {
      const categories = ['hp', 'dogs', 'cats'];
      category = categories[Math.floor(Math.random() * categories.length)];
    }
  
    // Fetch images based on the selected category
    selectedCategoryImages = await fetchImages(category);
  
    // Ensure exactly 16 images for a 4x4 grid
    while (selectedCategoryImages.length < 8) {
      selectedCategoryImages = [...selectedCategoryImages, ...selectedCategoryImages];
    }
    selectedCategoryImages = selectedCategoryImages.slice(0, 8);
    selectedCategoryImages = [...selectedCategoryImages, ...selectedCategoryImages]; // Duplicate for pairs
    
    selectedCategoryImages = selectedCategoryImages.sort(() => Math.random() - 0.5); // Shuffle images
  
    renderGameBoard();
  }
  

// Render game board with cards
function renderGameBoard() {
  memoryGameContainer.innerHTML = '';
  matchedCards = 0;

  selectedCategoryImages.forEach((image, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.addEventListener('click', flipCard);

    const frontFace = document.createElement('div');
    frontFace.classList.add('front');

    const backFace = document.createElement('div');
    backFace.classList.add('back');
    backFace.style.backgroundImage = `url(${image})`;

    card.appendChild(frontFace);
    card.appendChild(backFace);
    memoryGameContainer.appendChild(card);
  });
}

// Flip card functionality
function flipCard() {
  if (this.classList.contains('flipped') || selectedCards.length === 2) return;

  this.classList.add('flipped');
  selectedCards.push(this);

  if (selectedCards.length === 2) {
    checkMatch();
  }
}

// Check if two selected cards match
function checkMatch() {
  const [card1, card2] = selectedCards;
  const isMatch = selectedCategoryImages[card1.dataset.index] === selectedCategoryImages[card2.dataset.index];

  if (isMatch) {
    matchedCards += 2;
    if (matchedCards === selectedCategoryImages.length) setTimeout(() => alert('You win!'), 500);
    selectedCards = [];
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      selectedCards = [];
    }, 1000);
  }
}
