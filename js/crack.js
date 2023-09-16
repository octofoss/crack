var content = document.querySelector('#content')
var moth = document.querySelector('.mothmsg')

// window TINY warning
if (window.innerWidth < 1026) {
    moth.textContent = "hey, your resolution's a bit low. consider switching to 1026px or wider"
}