// Order management system
let orders = [];

// Menu items data
const menuItems = [
    { 
        name: "Chicken Burger", 
        price: 8.99, 
        img: "./assets/burger1.webp",
        desc: "Juicy chicken patty with spicy mayo, fresh lettuce, and our special sauce in a toasted bun."
    },
    { 
        name: "Pizza", 
        price: 12.99, 
        img: "./assets/pizza1.jpg",
        desc: "Classic pizza with tomato sauce, mozzarella cheese, and generous pepperoni toppings."
    },
    { 
        name: "Salad", 
        price: 7.99, 
        img: "./assets/salad1.jpg",
        desc: "Fresh romaine lettuce with Caesar dressing, croutons, parmesan cheese, and grilled chicken."
    },
    { 
        name: "Chicken Biryani", 
        price: 15.99, 
        img: "./assets/biryani1.jpg",
        desc: "Aromatic basmati rice layered with tender chicken, infused with saffron, cardamom, and warm spices."
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateOrderDisplay();
    displayMenuItems(menuItems); // Display all menu items initially
});

// Function to display menu items
function displayMenuItems(items) {
    const menuContainer = document.getElementById('menuItemsContainer');
    
    if (items.length === 0) {
        menuContainer.innerHTML = `
            <div class="no-results">
                <i class="bi bi-emoji-frown" style="font-size: 2rem;"></i>
                <p>No items found matching your search</p>
            </div>
        `;
        return;
    }
    
    menuContainer.innerHTML = items.map(item => `
        <div class="menu-card">
            <img src="${item.img}" alt="${item.name}" class="menu-img">
            <div class="menu-content">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <span class="price">$${item.price.toFixed(2)}</span>
                <button class="order-btn" onclick="orderItem('${item.name}')">
                    Order Now
                </button>
                <div class="order-confirmation" id="confirm${menuItems.indexOf(item) + 1}">
                    ${item.name} added to your order!
                </div>
            </div>
        </div>
    `).join('');
}

// Menu Search Functionality
document.getElementById('menuSearchBtn').addEventListener('click', function() {
    performMenuSearch();
});

// Allow pressing Enter to search in menu
document.getElementById('menuSearchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performMenuSearch();
    }
});

function performMenuSearch() {
    const searchInput = document.getElementById('menuSearchInput');
    const searchError = document.getElementById('menuSearchError');
    
    if (searchInput.value.trim() === '') {
        searchError.style.display = 'block';
        setTimeout(() => { searchError.style.display = 'none'; }, 3000);
        displayMenuItems(menuItems); // Show all items if search is empty
    } else {
        // Filter menu items based on search
        const searchTerm = searchInput.value.toLowerCase();
        const results = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.desc.toLowerCase().includes(searchTerm)
        );
        
        displayMenuItems(results);
    }
}

// Order Now Button Functionality
function orderItem(itemName) {
    const item = menuItems.find(i => i.name === itemName);
    
    if (!item) return;
    
    // Check if item already exists in orders
    const existingItem = orders.find(i => i.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        orders.push({
            name: item.name,
            price: item.price,
            img: item.img,
            desc: item.desc,
            quantity: 1
        });
    }
    
    // Update the orders display
    updateOrderDisplay();
    
    // Show confirmation message
    showConfirmationMessage(itemName);
    
    // Log to console
    console.log(`${itemName} added to order. Current order:`, orders);
}

function showConfirmationMessage(itemName) {
    const itemIndex = menuItems.findIndex(item => item.name === itemName);
    if (itemIndex === -1) return;
    
    const confirmation = document.getElementById(`confirm${itemIndex + 1}`);
    if (confirmation) {
        confirmation.style.display = 'block';
        setTimeout(() => { confirmation.style.display = 'none'; }, 3000);
    }
}

function updateOrderDisplay() {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (orders.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-order">
                <i class="bi bi-cart-x" style="font-size: 3rem; color: #ccc;"></i>
                <p>Your order is empty</p>
                <p>Add items from the menu to get started</p>
            </div>
        `;
    } else {
        orderItemsContainer.innerHTML = orders.map(item => `
            <div class="order-item" data-item="${item.name}">
                <div class="item-info">
                    <img src="${item.img}" alt="${item.name}" class="item-img">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${item.desc}</p>
                        <p class="item-price">$${item.price.toFixed(2)} each</p>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem('${item.name}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    updateOrderSummary();
}

function updateQuantity(itemName, change) {
    const item = orders.find(i => i.name === itemName);
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity reaches 0
        if (item.quantity <= 0) {
            orders = orders.filter(i => i.name !== itemName);
        }
        
        updateOrderDisplay();
    }
}

function removeItem(itemName) {
    orders = orders.filter(i => i.name !== itemName);
    updateOrderDisplay();
}

function updateOrderSummary() {
    const subtotal = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Checkout button functionality
document.getElementById('checkoutBtn').addEventListener('click', function() {
    if (orders.length === 0) {
        alert('Your order is empty. Please add some items first.');
    } else {
        const total = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2.99;
        alert(`Order placed successfully!\nTotal: $${total.toFixed(2)}\nThank you for your order!`);
        orders = [];
        updateOrderDisplay();
    }
});

// Contact Form Submission with Web3Forms
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    formMessage.style.display = 'none';
    
    fetch("https://api.web3forms.com/submit", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        const json = await response.json();
        
        if (response.status === 200) {
            // Success message
            formMessage.textContent = json.message || 'Thank you! Your message has been sent.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            contactForm.reset();
            
        } else {
            // Error message
            formMessage.textContent = json.message || 'There was an error sending your message. Please try again.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
    })
    .catch(error => {
        // Network error
        formMessage.textContent = 'There was a network error. Please check your connection and try again.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        console.error('Error:', error);
    })
    .finally(() => {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
});