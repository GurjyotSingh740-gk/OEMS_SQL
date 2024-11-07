function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

async function loadEvents() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/events'); 

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Received non-JSON response");
        }

        const events = await response.json();

        const eventCardsContainer = document.getElementById('event-cards');
        eventCardsContainer.innerHTML = ''; 

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            eventCard.innerHTML = `
                <h3>${event.title}</h3>
                <p>Date: ${new Date(event.event_date).toLocaleDateString()}</p>
                <p>Location: ${event.location}</p>
                <p>Capacity: ${event.capacity}</p>
                <p><strong>Description:</strong> ${event.description}</p>
                <button>Register</button>
            `;
            eventCardsContainer.appendChild(eventCard);
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

window.addEventListener('DOMContentLoaded', loadEvents);
