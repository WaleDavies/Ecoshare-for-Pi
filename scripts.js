// Sample data for listings (in a real app, use a backend like Firebase, but this is MVP)
let listings = [];

// Pi Login
document.getElementById('login-btn').addEventListener('click', async () => {
    try {
        const authResult = await Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
        document.getElementById('user-info').textContent = `Welcome, ${authResult.user.username}!`;
        // You can add KYC-based trust score here if expanded
    } catch (err) {
        console.error('Login failed:', err);
    }
});

// Function for incomplete payments (required by SDK)
function onIncompletePaymentFound(payment) {
    console.log('Incomplete payment:', payment);
    // Handle in full app: Send to server to complete
}

// Add Listing
document.getElementById('submit-listing').addEventListener('click', () => {
    const name = document.getElementById('item-name').value;
    const desc = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const eco = document.getElementById('eco-friendly').checked;
   
    if (name && desc && price) {
        const bonus = eco ? ' (Eco Bonus: +5 Pi)' : '';
        listings.push({ name, desc, price: parseFloat(price), eco });
        updateListings();
    }
});

// Update Listings UI
function updateListings() {
    const list = document.getElementById('share-list');
    list.innerHTML = '';
    listings.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name}: ${item.desc} - ${item.price} Pi${item.eco ? ' (Eco-Friendly)' : ''} <button onclick="payForItem(${index})">Rent/Trade</button>`;
        list.appendChild(li);
    });
}

// Pi Payment Integration
async function payForItem(index) {
    const item = listings[index];
    try {
        const payment = await Pi.createPayment({
            amount: item.price,
            memo: `Payment for ${item.name}`,
            metadata: { itemId: index }
        }, {
            onReadyForServerApproval: (paymentId) => console.log('Ready for approval:', paymentId),
            onReadyForServerCompletion: (paymentId, txid) => console.log('Completed:', txid),
            onCancel: () => console.log('Cancelled'),
            onError: (err) => console.error(err)
        });
        if (item.eco) {
            alert('Eco Bonus: +5 Pi rewarded!');
            // In full app, send bonus via smart contract
        }
    } catch (err) {
        console.error('Payment failed:', err);
    }
}

// Simple Map Placeholder (Use Leaflet.js for real map - add <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script> to HTML head)
if (document.getElementById('map')) {
    // Mock map - in full app, integrate geolocation
    const map = document.getElementById('map');
    map.innerHTML = '<p>Map loading... (Shows nearby shares)</p>';
    // Expand with: var mymap = L.map('map').setView([51.505, -0.09], 13); etc.
}

// AI Matching Placeholder (For demo: Suggest matches)
console.log('AI Matching: Coming soon - recommends based on location/history');