
const ws = new WebSocket('ws://localhost:3000');


ws.addEventListener('open', function () {
    console.log('WebSocket connection established.');
    ws.send(JSON.stringify({ type: 'reg', data: { name: 'example', password: 'password' } }));
});

// Event listener for WebSocket messages received
ws.addEventListener('message', function (event) {
    const message = JSON.parse(event.data);
    // Handle different types of messages
    if (message.type === 'reg') {
        console.log('Received registration response:', message);
        // Additional logic after registration
    } else if (message.type === 'update_room') {
        // Handle room update message
    } else if (message.type === 'update_winners') {
        // Handle winners update message
    }
});

// Event listener for WebSocket connection closed
ws.addEventListener('close', function () {
    console.log('WebSocket connection closed.');
});
