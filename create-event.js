document.getElementById('event-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(this);
    const eventData = {
        title: formData.get('title'),
        event_date: formData.get('event_date'),
        location: formData.get('location'),
        capacity: formData.get('capacity'),
        description: formData.get('description')
    };

    try {
        const response = await fetch('http://127.0.0.1:3000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            throw new Error(`Failed to submit event: ${response.status}`);
        }

        const result = await response.json();
        console.log('Event created successfully:', result);
        alert('Event created successfully!');
        
        // Optionally, reset the form
        document.getElementById('event-form').reset();
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event.');
    }
});

document.getElementById("fetch-event").addEventListener("click", function () {
    const eventTitle = document.getElementById("event-title-to-delete").value.trim();

    if (eventTitle) {
        // Simulating an API call to fetch the event details from the database.
        fetchEventDetails(eventTitle);
    } else {
        alert("Please enter an event title.");
    }
});

document.getElementById("fetch-event").addEventListener("click", function () {
    const eventTitle = document.getElementById("event-title-to-delete").value.trim();

    if (eventTitle) {
        // Simulating an API call to fetch the event details from the database.
        fetchEventDetails(eventTitle);
    } else {
        alert("Please enter an event title.");
    }
});

// Function to simulate fetching event details based on the event title.
function fetchEventDetails(eventTitle) {
    // Here you would typically make a request to your backend API to fetch event details.
    // For now, we will simulate it with a hardcoded event data.

    const eventDetails = {
        title: "Tech Conference",
        event_date: "2024-11-25",
        location: "New York City",
        capacity: 500,
        description: "An amazing tech conference with top speakers."
    };

    if (eventTitle === eventDetails.title) {
        populateForm(eventDetails);
    } else {
        alert("Event not found.");
    }
}

// Function to populate the form with event details.
function populateForm(eventDetails) {
    document.getElementById("update-title").value = eventDetails.title;
    document.getElementById("update-date").value = eventDetails.event_date;
    document.getElementById("update-location").value = eventDetails.location;
    document.getElementById("update-capacity").value = eventDetails.capacity;
    document.getElementById("update-description").value = eventDetails.description;

    // Display the form for updating event.
    document.getElementById("update-form").classList.remove("hidden-form");
    document.getElementById("delete-event").style.display = "block";
}

// Optional: Hide the delete button and update form if event details are not found.
document.getElementById("delete-event").style.display = "none";


// Function to populate the form with event details.
function populateForm(eventDetails) {
    document.getElementById("update-title").value = eventDetails.title;
    document.getElementById("update-date").value = eventDetails.event_date;
    document.getElementById("update-location").value = eventDetails.location;
    document.getElementById("update-capacity").value = eventDetails.capacity;
    document.getElementById("update-description").value = eventDetails.description;

    // Display the form for updating event.
    document.getElementById("update-form").classList.remove("hidden-form");
    document.getElementById("delete-event").style.display = "block";
}

// Optional: Hide the delete button and update form if event details are not found.
document.getElementById("delete-event").style.display = "none";


document.getElementById('delete-event').addEventListener('click', async function() {
    const eventTitle = document.getElementById('event-title-to-delete').value.trim();
    if (!eventTitle) {
        alert('Please enter an event title');
        return;
    }

    try {
        // Ensure the correct URL with dynamic value
        const url = `http://127.0.0.1:3000/api/events/title/${encodeURIComponent(eventTitle)}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });

        const contentType = response.headers.get('content-type');
        if (response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                alert(result.message || 'Event deleted successfully!');
            } else {
                // Handle non-JSON responses (like HTML error pages)
                const textResponse = await response.text();
                console.error('Unexpected response:', textResponse);
                alert('Error deleting event. Please check the server response.');
            }
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error deleting event');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
    }
});




