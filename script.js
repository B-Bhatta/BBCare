function toggleMenu() {
    let nav = document.getElementById("navMenu");

    // Only apply toggle for mobile and tablet views
    if (window.innerWidth <= 991) {
        nav.classList.toggle("active");
    }
}
