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
    
   // Vereenvoudigde mobiele menu handler
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM geladen, menu script actief");
    
    // Menu elementen selecteren
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    // Alleen doorgaan als beide elementen bestaan
    if (!menuToggle || !nav) {
        console.error("Menu elementen niet gevonden:", {menuToggle, nav});
        return;
    }
    
    console.log("Menu elementen gevonden:", {menuToggle, nav});
    
    // Click event direct aan de knop toevoegen
    menuToggle.onclick = function(e) {
        e.preventDefault();
        console.log("Menu knop geklikt");
        
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        
        console.log("Menu status na klik:", nav.classList.contains('active') ? "open" : "gesloten");
    };
    
    // Update copyright jaar
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});