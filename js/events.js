/**
 * Stefan Buitenhuis Website
 * Events management script
 * 
 * This script loads upcoming events from a JSON file and displays them on the website.
 * This allows easy updating of events without modifying the HTML.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Reference to events container
    const eventsContainer = document.getElementById('events-container');
    
    // Check if we're on a page with events
    if (!eventsContainer) return;
    
    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        
        // Get month name in Dutch
        const monthNames = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        
        return {
            day: day,
            month: month
        };
    }
    
    // Function to create event card
    function createEventCard(event) {
        const formattedDate = formatDate(event.date);
        
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        eventCard.innerHTML = `
            <div class="event-date">
                <span class="day">${formattedDate.day}</span>
                <span class="month">${formattedDate.month}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p class="location">${event.venue}, ${event.city}</p>
                ${event.ticketLink ? `<a href="${event.ticketLink}" class="ticket-link" target="_blank">Tickets & Info</a>` : ''}
            </div>
        `;
        
        return eventCard;
    }
    
    // Function to load events from JSON
    function loadEvents() {
        // Fetch the events data
        fetch('data/events.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Clear existing events (if any)
                eventsContainer.innerHTML = '';
                
                // Sort events by date
                const sortedEvents = data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
                
                // Filter events that are in the future or today
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of day
                
                const upcomingEvents = sortedEvents.filter(event => {
                    const eventDate = new Date(event.date);
                    eventDate.setHours(0, 0, 0, 0); // Set to start of day
                    return eventDate >= today;
                });
                
                // Display events or a message if no events
                if (upcomingEvents.length > 0) {
                    // Only show the first 3-6 events depending on screen size
                    const eventsToShow = upcomingEvents.slice(0, 6);
                    
                    eventsToShow.forEach(event => {
                        const eventCard = createEventCard(event);
                        eventsContainer.appendChild(eventCard);
                    });
                    
                    // Add "See all events" link if there are more events
                    if (upcomingEvents.length > 6) {
                        const moreEventsLink = document.createElement('div');
                        moreEventsLink.className = 'more-events';
                        moreEventsLink.innerHTML = `
                            <a href="events.html" class="cta-button">Alle Evenementen Bekijken</a>
                        `;
                        eventsContainer.parentNode.appendChild(moreEventsLink);
                    }
                } else {
                    // No upcoming events
                    eventsContainer.innerHTML = `
                        <div class="no-events">
                            <p>Er zijn momenteel geen geplande evenementen.</p>
                            <p>Kom binnenkort terug voor updates of volg mij op social media.</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading events:', error);
                
                // Use the fallback events already in HTML
                // They're already there, so we don't need to do anything
            });
    }
    
    // Try to load events from JSON
    loadEvents();
});
