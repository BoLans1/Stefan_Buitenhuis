/**
 * Stefan Buitenhuis Website
 * Events and News management script
 */

document.addEventListener('DOMContentLoaded', function() {
    // Reference to events container
    const eventsContainer = document.getElementById('events-container');
    
    // Reference to news container
    const newsContainer = document.getElementById('news-container');
    
    // Load events if we're on a page with events
    if (eventsContainer) {
        loadEvents();
    }
    
    // Load news if we're on a page with news
    if (newsContainer) {
        loadNews();
    }
    
    // Function to parse Dutch date format like "15 mei"
    function parseDutchDate(dateString) {
        console.log("Parsing date:", dateString);
        
        // If it's a standard date format
        if (dateString.includes('-')) {
            return new Date(dateString);
        }
        
        // Handle Dutch format like "15 mei"
        const parts = dateString.split(' ');
        if (parts.length === 2) {
            const day = parseInt(parts[0]);
            const monthStr = parts[1].toLowerCase();
            
            // Dutch month names mapping to month number (0-based)
            const monthMap = {
                'jan': 0, 'januari': 0,
                'feb': 1, 'februari': 1,
                'mrt': 2, 'maart': 2,
                'apr': 3, 'april': 3,
                'mei': 4, 'may': 4,
                'jun': 5, 'juni': 5,
                'jul': 6, 'juli': 6,
                'aug': 7, 'augustus': 7,
                'sep': 8, 'september': 8,
                'okt': 9, 'oktober': 9,
                'nov': 10, 'november': 10,
                'dec': 11, 'december': 11
            };
            
            const month = monthMap[monthStr] !== undefined ? monthMap[monthStr] : 0;
            
            // Add the current year, or next year if the month is already past
            const now = new Date();
            let year = now.getFullYear();
            
            // If the month is earlier in the year than current month, assume it's for next year
            if (month < now.getMonth()) {
                year += 1;
            }
            
            const result = new Date(year, month, day);
            console.log(`Parsed "${dateString}" as:`, result);
            return result;
        }
        
        // Default fallback
        return new Date();
    }
    
    // Function to format date
    function formatDate(dateString) {
        const date = parseDutchDate(dateString);
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
        console.log("Creating card for event:", event);
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
                <p class="location">${event.venue}${event.city ? ', ' + event.city : ''}</p>
                ${event.ticketLink ? `<a href="${event.ticketLink}" class="ticket-link" target="_blank">Tickets & Info</a>` : ''}
            </div>
        `;
        
        return eventCard;
    }
    
    // Function to create news item
    function createNewsItem(newsItem) {
        console.log("Creating news item:", newsItem);
        
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        
        newsElement.innerHTML = `
            <div class="news-content">
                <h3>${newsItem.title}</h3>
                <p>${newsItem.text}</p>
                ${newsItem.ctaText && newsItem.ctaLink ? 
                  `<a href="${newsItem.ctaLink}" class="cta-button">${newsItem.ctaText}</a>` : ''}
            </div>
        `;
        
        return newsElement;
    }
    
    // Function to load events from JSON
    function loadEvents() {
        console.log("Trying to load events...");
        // Fetch the events data
        fetch('data/events.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Loaded data:", data);
                
                // Clear existing events (if any)
                eventsContainer.innerHTML = '';
                
                // Check if we have events
                if (!data.events || !Array.isArray(data.events) || data.events.length === 0) {
                    console.log("No events found in data");
                    eventsContainer.innerHTML = `
                        <div class="no-events">
                            <p>Er zijn momenteel geen geplande evenementen.</p>
                            <p>Kom binnenkort terug voor updates of volg mij op social media.</p>
                        </div>
                    `;
                    return;
                }
                
                // Sort events by date
                const sortedEvents = data.events.sort((a, b) => {
                    return parseDutchDate(a.date) - parseDutchDate(b.date);
                });
                
                console.log("Sorted events:", sortedEvents);
                
                // Filter events that are in the future or today
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of day
                
                const upcomingEvents = sortedEvents.filter(event => {
                    const eventDate = parseDutchDate(event.date);
                    eventDate.setHours(0, 0, 0, 0); // Set to start of day
                    return eventDate >= today;
                });
                
                console.log("Upcoming events:", upcomingEvents);
                
                // Display events or a message if no events
                if (upcomingEvents.length > 0) {
                    // Check if we're on the events.html page
                    const isEventsPage = window.location.pathname.includes('events.html');
                    
                    // On events.html page, show all events
                    // On other pages, show only first 6
                    const eventsToShow = isEventsPage ? upcomingEvents : upcomingEvents.slice(0, 6);
                    
                    eventsToShow.forEach(event => {
                        const eventCard = createEventCard(event);
                        eventsContainer.appendChild(eventCard);
                    });
                    
                    // Add "See all events" link if there are more events AND we're not on events.html
                    if (upcomingEvents.length > 6 && !isEventsPage) {
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
    
   
// Function to load news from JSON
function loadNews() {
    console.log("Trying to load news...");
    // Fetch the same JSON file (it now contains both events and news)
    fetch('data/events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Loaded data for news:", data);
            
            // Reference to news section
            const newsSection = newsContainer.closest('.news-section');
            
            // Check if we have news
            if (!data.news || !Array.isArray(data.news) || data.news.length === 0) {
                console.log("No news found in data");
                // Hide the section if no news
                if (newsSection) {
                    newsSection.style.display = 'none';
                }
                return;
            }
            
            // Show the section if we have news
            if (newsSection) {
                newsSection.style.display = 'block';
            }
            
            // Clear existing news (if any)
            newsContainer.innerHTML = '';
            
            // Show the first news item
            const newsItem = data.news[0];
            console.log("News item to display:", newsItem);
            const newsElement = createNewsItem(newsItem);
            newsContainer.appendChild(newsElement);
        })
        .catch(error => {
            console.error('Error loading news:', error);
            
            // Hide the section if there's an error
            const newsSection = newsContainer.closest('.news-section');
            if (newsSection) {
                newsSection.style.display = 'none';
            }
        });
}
});
