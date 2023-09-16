var content = document.querySelector('#content')
var moth = document.querySelector('.mothmsg')

// window TINY warning
setTimeout(() => {
    if (window.innerWidth < 1026) {
        moth.textContent = "hey, your resolution's a bit low. consider switching to 1026px or wider"
    }
}, 100)

// code taken directly from c.ob literally barely even modified, all i changed was the element names. soz
window.addEventListener('mousedown', ev=> {
    if(ev.target.id == "cenu-icon") {
        MUI("toggle")

    //if clicking on something under the meta menu, do whatever the link is for
    } else if(ev.target.parentElement.id == "cenu-links"){
        if(!body.classList.contains('in-menu')) {
            switch(ev.target.id) {

                case "cenu-obs":
                    toggleEntMenu()
                break

                case "cenu-sys":
                    toggleSysMenu()
                break
            }
        }
    }
}
)