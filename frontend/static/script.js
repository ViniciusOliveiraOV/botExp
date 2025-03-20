document.addEventListener('DOMContentLoaded', function () {
    let messages = []; // Stores the last `maxMessages` messages
    const maxMessages = 5;
    const displayedMessages = new Set(); // Track displayed messages

    // Submit message form
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const userMessage = document.querySelector('input[name="user_message"]').value;

        fetch('http://localhost:8000/submit_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //let responseDiv = document.getElementById('responseMessage');
            //responseDiv.innerText = data.response;
            //responseDiv.style.color = "green";
            document.getElementById('responseMessage').innerText = data.response;
            document.getElementById('responseMessage').style.color = "green";

            // Reset input field
            document.querySelector('input[name="user_message"]').value = "";
            
            loadMessages(); // Reload messages after submitting
        })
        .catch(error => console.error('Error:', error));
    });

    // Function to load messages
    function loadMessages() {
        fetch('http://localhost:8000/get_messages.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const chatBox = document.getElementById("chat-box");
                if (!chatBox) {
                    console.error("Chat box not found!");
                    return;
                }

                if (data.length === 0) {
                    chatBox.innerHTML = "<p>No messages yet.</p>";
                    return;
                }

                let newMessagesAdded = false;
                let newMessages = [];

                data.forEach(msg => {
                    const messageIdentifier = msg.message + msg.created_at;

                    // Only add new messages
                    if (!displayedMessages.has(messageIdentifier)) {
                        displayedMessages.add(messageIdentifier);
                        newMessages.push(msg); // Add new message to the array
                        newMessagesAdded = true;
                    }
                });

                // Keep only the last `maxMessages`
                if (messages.length > maxMessages) {
                    messages = messages.slice(-maxMessages); // Keep the last `maxMessages` items
                }
                
                if (newMessagesAdded) {
                    // Merge new messages, sort them by timestamp, and limit to maxMessages
                    messages = [...messages, ...newMessages]
                        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Ensure chronological order
                        .slice(-maxMessages); // Keep only the last maxMessages

                    updateMessageUI();
                }
            })
            .catch(error => console.error("Error loading messages:", error));
    }

    // Function to update UI with stored messages
    function updateMessageUI() {
        const chatBox = document.getElementById("chat-box");

        // Append only new messages
        chatBox.innerHTML = ""; // Clear UI only once

        messages.forEach(msg => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");

            const userSpan = document.createElement("strong");
            userSpan.textContent = msg.user + ": ";

            const textSpan = document.createElement("span");
            textSpan.textContent = msg.message;

            const timeSpan = document.createElement("div");
            timeSpan.classList.add("timestamp");
            timeSpan.textContent = new Date(msg.created_at).toLocaleString();

            messageDiv.appendChild(userSpan);
            messageDiv.appendChild(textSpan);
            messageDiv.appendChild(timeSpan);

            messageDiv.classList.add(msg.user === "You" ? "user-message" : "other-message");
            chatBox.appendChild(messageDiv);
        });

        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
    }

    // Load messages initially
    loadMessages();

    // Set interval to reload messages every 5 seconds
    setInterval(loadMessages, 5000);
});
