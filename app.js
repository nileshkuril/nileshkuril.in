// Games data
const gamesData = {
  "games": [
    {
      "title": "Mystic Quest Adventures",
      "genre": "RPG/Adventure",
      "description": "Embark on an epic journey through mystical realms filled with magic, monsters, and treasure.",
      "rating": "4.7",
      "downloads": "500K+",
      "features": ["Epic storyline", "Stunning graphics", "Multiplayer battles"],
      "playStoreUrl": "#",
      "icon": "🏰"
    },
    {
      "title": "Puzzle Master Pro",
      "genre": "Puzzle/Strategy", 
      "description": "Challenge your mind with hundreds of intricate puzzles and brain teasers.",
      "rating": "4.5",
      "downloads": "1M+",
      "features": ["1000+ levels", "Daily challenges", "Offline play"],
      "playStoreUrl": "#",
      "icon": "🧩"
    },
    {
      "title": "Space Defender Elite",
      "genre": "Action/Arcade",
      "description": "Defend Earth from alien invasion in this fast-paced space shooter.",
      "rating": "4.3",
      "downloads": "750K+",
      "features": ["Intense action", "Weapon upgrades", "Boss battles"],
      "playStoreUrl": "#",
      "icon": "🚀"
    },
    {
      "title": "City Builder Tycoon",
      "genre": "Simulation/Strategy",
      "description": "Build and manage your dream city in this comprehensive city building game.",
      "rating": "4.6",
      "downloads": "2M+",
      "features": ["City planning", "Resource management", "Economic simulation"],
      "playStoreUrl": "#",
      "icon": "🏙️"
    },
    {
      "title": "Racing Championship",
      "genre": "Racing/Sports",
      "description": "Experience high-speed racing with realistic physics and stunning tracks.",
      "rating": "4.4", 
      "downloads": "1.5M+",
      "features": ["Realistic physics", "Multiple tracks", "Car customization"],
      "playStoreUrl": "#",
      "icon": "🏎️"
    },
    {
      "title": "Word Wizard Challenge",
      "genre": "Word/Educational",
      "description": "Expand your vocabulary while having fun with creative word challenges.",
      "rating": "4.8",
      "downloads": "300K+", 
      "features": ["Educational gameplay", "Vocabulary building", "Multiple languages"],
      "playStoreUrl": "#",
      "icon": "📚"
    }
  ]
};

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const gamesGrid = document.getElementById('gamesGrid');
const gameModal = document.getElementById('gameModal');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderGames();
    setupNavigation();
    setupModal();
    setupSmoothScrolling();
}

// Render games to the grid
function renderGames() {
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = '';
    
    gamesData.games.forEach((game, index) => {
        const gameCard = createGameCard(game, index);
        gamesGrid.appendChild(gameCard);
    });
}

// Create individual game card
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Generate gradient based on index
    const gradients = [
        'linear-gradient(135deg, #3B82F6, #8B5CF6)',
        'linear-gradient(135deg, #F59E0B, #EF4444)',
        'linear-gradient(135deg, #10B981, #06B6D4)',
        'linear-gradient(135deg, #EF4444, #EC4899)',
        'linear-gradient(135deg, #8B5CF6, #3B82F6)',
        'linear-gradient(135deg, #F97316, #EF4444)'
    ];
    
    card.innerHTML = `
        <div class="game-card__image" style="background: ${gradients[index % gradients.length]}">
            <div style="font-size: 60px;">${game.icon}</div>
            <div class="game-card__overlay"></div>
        </div>
        <div class="game-card__content">
            <h3 class="game-card__title">${game.title}</h3>
            <div class="game-card__genre">${game.genre}</div>
            <p class="game-card__description">${game.description}</p>
            <div class="game-card__stats">
                <div class="game-stat">
                    <span class="rating">★ ${game.rating}</span>
                </div>
                <div class="game-stat">
                    <span>${game.downloads} downloads</span>
                </div>
            </div>
            <div class="game-card__actions">
                <button class="btn btn--primary btn--small play-store-btn" data-url="${game.playStoreUrl}">
                    Play Store
                </button>
                <button class="btn btn--outline-primary btn--small learn-more-btn" data-game-index="${index}">
                    Learn More
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const playStoreBtn = card.querySelector('.play-store-btn');
    const learnMoreBtn = card.querySelector('.learn-more-btn');
    
    // Play Store button click handler
    playStoreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        openPlayStore(game.playStoreUrl);
    });
    
    // Learn More button click handler
    learnMoreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        openGameModal(game);
    });
    
    // Card click handler (excluding buttons)
    card.addEventListener('click', function(e) {
        // Only open modal if click is not on a button
        if (!e.target.classList.contains('btn') && !e.target.closest('.btn')) {
            openGameModal(game);
        }
    });
    
    return card;
}

// Open game modal with details
function openGameModal(game) {
    if (!gameModal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="modal-game-header">
            <div class="modal-game-icon" style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); width: 80px; height: 80px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 24px;">
                ${game.icon}
            </div>
            <h2 style="margin-bottom: 8px; color: var(--color-text);">${game.title}</h2>
            <div style="color: var(--color-primary); font-weight: 500; margin-bottom: 16px;">${game.genre}</div>
        </div>
        
        <div class="modal-game-stats" style="display: flex; gap: 32px; margin-bottom: 24px; padding: 16px; background: var(--color-secondary); border-radius: 8px;">
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: var(--color-primary);">★ ${game.rating}</div>
                <div style="font-size: 14px; color: var(--color-text-secondary);">Rating</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: var(--color-primary);">${game.downloads}</div>
                <div style="font-size: 14px; color: var(--color-text-secondary);">Downloads</div>
            </div>
        </div>
        
        <div class="modal-game-description" style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px; color: var(--color-text);">About This Game</h3>
            <p style="color: var(--color-text-secondary); line-height: 1.6;">${game.description}</p>
        </div>
        
        <div class="modal-game-features" style="margin-bottom: 32px;">
            <h3 style="margin-bottom: 16px; color: var(--color-text);">Key Features</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${game.features.map(feature => `
                    <li style="display: flex; align-items: center; margin-bottom: 8px; color: var(--color-text-secondary);">
                        <span style="color: var(--color-primary); margin-right: 8px;">✓</span>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
        </div>
        
        <div class="modal-game-actions" style="display: flex; gap: 12px;">
            <button class="btn btn--primary modal-play-store-btn" data-url="${game.playStoreUrl}">
                Download on Play Store
            </button>
            <button class="btn btn--outline modal-close-btn">
                Close
            </button>
        </div>
    `;
    
    // Add event listeners for modal buttons
    const modalPlayStoreBtn = modalBody.querySelector('.modal-play-store-btn');
    const modalCloseBtn = modalBody.querySelector('.modal-close-btn');
    
    if (modalPlayStoreBtn) {
        modalPlayStoreBtn.addEventListener('click', function() {
            openPlayStore(game.playStoreUrl);
        });
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeGameModal);
    }
    
    gameModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close game modal
function closeGameModal() {
    if (!gameModal) return;
    
    gameModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Open Play Store (simulated)
function openPlayStore(url) {
    // In a real implementation, this would open the actual Play Store URL
    alert('This would redirect to the Google Play Store for this game!');
}

// Setup modal event listeners
function setupModal() {
    if (modalClose) {
        modalClose.addEventListener('click', closeGameModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeGameModal);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !gameModal.classList.contains('hidden')) {
            closeGameModal();
        }
    });
}

// Setup navigation
function setupNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle && !e.target.closest('.nav__menu') && !e.target.closest('.nav__toggle')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(31, 33, 33, 0.98)';
        } else {
            header.style.background = 'rgba(31, 33, 33, 0.95)';
        }
    }
});

// Add some interactivity to game cards
document.addEventListener('click', function(e) {
    if (e.target.closest('.game-card') && !e.target.closest('.btn')) {
        const card = e.target.closest('.game-card');
        
        // Add click effect
        card.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
window.addEventListener('load', function() {
    const animateElements = document.querySelectorAll('.game-card, .feature, .about__description');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Make functions globally available for any inline handlers (though we're using proper event listeners now)
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.openPlayStore = openPlayStore;