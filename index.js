let myNav = document.getElementById("nav");
console.log(myNav)
document.addEventListener("scroll", event => {
    if(window.scrollY > 15){
        myNav.classList.add('scroll')
        console.log(window.scroll)
    } else {
        myNav.classList.remove('scroll')
    }
});