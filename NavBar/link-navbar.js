// Huynh Gia Bao
document.getElementById('navbar-sidebar-inject')
    .insertAdjacentHTML('afterbegin', `<div class="navbar-placeholder" id="navbar-placeholder" data-sidebar-collapsed>Navbar</div> `)
function watchNavbarBg() {
    if ((window.pageYOffset < 64 && watchNavbarBg.active === false)
        || (window.pageYOffset >= 64 && watchNavbarBg.active === true)) {
        return;
    }
    if (watchNavbarBg.active === false) {
        watchNavbarBg.active = true;
        document.querySelector('#navbar-placeholder .navbar').classList.add('navbar-scrolleddown');
        return;
    }
    watchNavbarBg.active = false;
    document.querySelector('#navbar-placeholder .navbar').classList.remove('navbar-scrolleddown');

}
watchNavbarBg.active = false;
fetch('/web-1-best-bag/NavBar/navbar.html').then(request => request.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        document.addEventListener('scroll', watchNavbarBg);
        const userIcon = document.getElementById("user-icon");
        userIcon.addEventListener("click", () => {
            showLoginDialog();
        });
    });