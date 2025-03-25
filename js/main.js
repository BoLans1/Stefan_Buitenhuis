

// Ultra-simpele menu functionaliteit
document.addEventListener('DOMContentLoaded', function() {
    // Exacte IDs gebruiken in plaats van classes
    var menuButton = document.getElementById('stefan-mobile-toggle');
    var navMenu = document.getElementById('stefan-main-nav');
    var overlay = document.getElementById('mobile-menu-overlay');
    
    // Update copyright jaar
    var yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Alleen doorgaan als alle elementen bestaan
    if (!menuButton || !navMenu || !overlay) {
        console.log("Menu elementen niet gevonden:", {menuButton, navMenu, overlay});
        return;
    }
    
    // Menu toggle functie
    function toggleMenu() {
        var isOpen = navMenu.classList.contains('active');
        
        if (isOpen) {
            navMenu.classList.remove('active');
            menuButton.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            navMenu.classList.add('active');
            menuButton.classList.add('active');
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Voorkom scrollen
        }
    }
    
    // Event listeners
    menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    overlay.addEventListener('click', function() {
        toggleMenu();
    });
    
    // Sluit menu bij klikken op een link
    var menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            toggleMenu();
        });
    });
});

console.log("Gebouwd door Bo Lansdaal")