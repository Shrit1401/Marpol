// Globals
let playHomeLoader = true;
let navigatorTabHidden = false;

// Utils
const isHome = () => document.querySelector('[data-barba=container]').dataset.barbaNamespace === 'home';
const isTouchDevice = () => "ontouchstart" in document.documentElement;
const isMobileDevice = () => window.innerWidth < 1200;

// Set viewport variables
const onWindowResize = () => {
    document.documentElement.style.setProperty('--vh', window.innerHeight / 100 + 'px');
    document.documentElement.style.setProperty('--win-h', window.innerHeight);
    document.documentElement.style.setProperty('--vw', window.innerWidth / 100 + 'px');
    document.documentElement.style.setProperty('--win-w', window.innerWidth);
}
onWindowResize();
window.addEventListener('resize', onWindowResize);

//////////
// GSAP //
//////////
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
gsap.config({nullTargetWarn: false});

///////////////////
// SMOOTH SCROLL //
///////////////////
let smoother = null;
smoothScrollSetup();
function smoothScrollSetup() {
    if (isHome() && isMobileDevice())
        return

    smoother = ScrollSmoother.create({
        smooth: isMobileDevice() ? 0 : 2, // seconds it takes to "catch up" to native scroll position
        effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
        normalizeScroll: isHome(), // prevents [most] mobile browser address bars from hiding/showing (resizing the viewport)
    });
}

//////////////
// COOKIES //
/////////////
// Parar scroll al abrir modal
const pauseScroll = () => {
    document.documentElement.classList.add('disable-scroll')
    if (smoother)
        smoother.paused(true)
}
const enableScroll = () => {
    document.documentElement.classList.remove('disable-scroll')
    if (smoother)
        smoother.paused(false)
}
const t = window.setTimeout(() => {
    const btnCustomize = document.querySelector('[data-cky-tag=settings-button]')
    const btnClose = document.querySelector('[data-cky-tag=detail-close]')
    const btnReject = document.querySelector('[data-cky-tag=detail-reject-button]')
    const btnSave = document.querySelector('[data-cky-tag=detail-save-button]')
    const btnAccept = document.querySelector('[data-cky-tag=detail-accept-button]')
    if (btnCustomize)
        btnCustomize.addEventListener('click', pauseScroll)
    if (btnClose)
        btnClose.addEventListener('click', enableScroll)
    if (btnReject)
        btnReject.addEventListener('click', enableScroll)
    if (btnSave)
        btnSave.addEventListener('click', enableScroll)
    if (btnAccept)
        btnAccept.addEventListener('click', enableScroll)

    window.clearTimeout(t)
}, 300)


///////////////
// MAIN MENU //
///////////////
menuSetup();
function menuSetup() {
    var url = '';

    desactivarSubmenu(true);

    $(".menu__open").click(function () {
        desactivarSubmenu(true)

        if (smoother)
            smoother.paused(true);

        $("body").addClass("activoMenu");
        $(".menu__menu").removeClass("parpa");
        const t = window.setTimeout(function () {
            $(".menu__menu").addClass("parpa");
            window.clearTimeout(t);
        }, 1000);

        let tl = gsap.timeline({defaults: {ease: "expo.out", duration: 1}});
        tl.to(".menu", {top: "-2"}, "0");
        tl.fromTo(".menu__logo", {y: "-250"}, {y: "0"}, "0.7");
        tl.fromTo(".menu__rs", {y: "250"}, {y: "0"}, "0.8");
        tl.fromTo(".menu__close", {y: "-250"}, {y: "0"}, "0.8");

        var pb = 200;

        if (isTouchDevice()) {
            pb = -100;
        }

        if (window.innerWidth == 1024) {
            pb = 200;
        }

        tl.fromTo(".menu__cookies", {y: pb}, {y: "0"}, "0.8");
        tl.fromTo(".menu__copy", {y: "200"}, {y: "0"}, "0.9");

        url = '';
        return false;
    });

    function cerrarMenu(temporizar) {
        let tl = gsap.timeline({defaults: {ease: "expo.out"}});
        $("body").removeClass("activoMenu");

        var delay = 0;
        var duracion = 1;
        if (temporizar) {
            delay = 1;
            duracion = 0.1;
        }

        tl.to(".menu", {
            top: "100%",
            duration: duracion,
            onComplete: () => {
                if (smoother) {
                    smoother.paused(false);
                }
            },
        }, delay);

        const t = window.setTimeout(function () {
            $(".menu__menu").removeClass("parpa");
            window.clearTimeout(t);
        }, 1000);
        url = '';
    }

    $(".menu__close_a").click(function () {
        cerrarMenu(false);
        return false;
    });

    $("a.menu_sub_a").click(function () {
        cerrarMenu(true);
    });

    $(".menu .menu__menu ul li a.menu__menu_a_childs").click(function () {
        if (isTouchDevice()) {
            var u = $(this).attr("href");
            var id = $(this).attr("id");

            if (u != url || u == "" || url == "") {
                url = u;
                activarSubmenu(id);
                return false;
            }
        }
        cerrarMenu(true);
    });

    function desactivarSubmenu(removerHover) {
        if (removerHover) {
            $(".menu").removeClass("hover");
        }
        $('.menu .menu__menu ul li ul').height(0);
        $(".menu .menu__menu > ul>li").removeClass("active");
    }

    function activarSubmenu(idSub) {
        desactivarSubmenu(false);

        $("#" + idSub + "_li").addClass("active");
        $("#" + idSub + "_li").children("ul").css('opacity', '1');
        $("#" + idSub + "_li").children("ul").height(menu[$("#" + idSub + "_li").attr("id")]);
        $(".menu").addClass("hover");

        return false;
    }

    $(".menu .menu__menu > ul > li").hover(function () {
        if (!isTouchDevice()) {
            activarSubmenu($(this).attr("id").replace("_li", ''));
        }
    }, function () {
        if (!isTouchDevice()) {
            desactivarSubmenu(true);

        }
    });
}

var menu = [];
function calcularHoverMenu() {
    $(".menu .menu__menu ul li.menu__menu_childs").each(function () {
        $(this).children("ul").height('');
        menu[$(this).attr("id")] = $(this).children("ul").outerHeight();
        $(this).children("ul").height(0);

        if (menu[$(this).attr("id")] < 100) {
            $(this).children("a").children("span").height(menu[$(this).attr("id")] * 1.5);
        } else {
            $(this).children("a").children("span").height(menu[$(this).attr("id")] * 2);
        }
    });

}


calcularHoverMenu();
$(window).resize(function (e) {
    calcularHoverMenu();
});







///////////////////
// NAVIGATOR TAB //
///////////////////
let navigatorTab = null;
navigatorTab = new function () {
    this.el = null

    let toggle = null
    // let backButton = null

    this.init = () => {
        this.el = document.querySelector('.sbc-tab-navigator')
        if (!this.el)
            return

        if (navigatorTabHidden)
            this.hide()

        // backButton = document.querySelector('.sbc-tab-navigator__back-button')
        // if (backButton)
        //     this.setupBack()

        toggle = document.querySelector('.sbc-tab-navigator__toggle')
        toggle.addEventListener('click', this.toggleVisibility)
    }

    // this.setupBack = () => {
    //     backButton.addEventListener('click', (e) => {
    //         e.preventDefault()
    //         if (barba.transitions.isRunning)
    //             return
    //         barba.go('/')
    //         // barba.history.previous ? history.back() : barba.go('/')
    //     })
    // }

    this.toggleVisibility = () => {
        navigatorTabHidden ? this.show() : this.hide()
    }

    this.hide = () => {
        this.el.classList.add('is-hidden')
        navigatorTabHidden = true
    }

    this.show = () => {
        this.el.classList.remove('is-hidden')
        navigatorTabHidden = false
    }
}
navigatorTab.init();


////////////
// CURSOR //
////////////
let cursor = null;
cursor = new function () {
    this.el = null
    let clientX = 0
    let clientY = 0
    let links = []
    let hideTriggers = []

    let duration = .2

    this.init = () => {
        if (isMobileDevice())
            return

        this.el = document.querySelector('.sbc-cursor')

        if (!this.el)
            return

        this.el.style.display = 'none'
        window.addEventListener('mousemove', this.setPosition)

        const observer = new MutationObserver((mutations, observer) => {
            // console.log(mutations, observer)
            this.updateTriggers()
        })
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: false
        })
        this.setTriggers()
        document.documentElement.classList.add('sbc-cursor-init')
    }

    this.setTriggers = () => {
        // Set links
        document.querySelectorAll('a, button, .slick-arrow, .has-hover').forEach(link => links.push(link))
        links.forEach(link => {
            link.addEventListener('mouseover', () => {
                this.el.classList.add('is-hover')
            })
            link.addEventListener('mouseleave', () => {
                this.el.classList.remove('is-hover')
            })
        })

        // Set hide triggers
        document.querySelectorAll('.hide-cursor, .mod_team__item, .show-content-cursor').forEach(trigger => hideTriggers.push(trigger))
        hideTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => {
                this.el.classList.add('is-hidden')
            })
            trigger.addEventListener('mouseleave', () => {
                this.el.classList.remove('is-hidden')
            })
        })

        // Content cursor
        document.querySelectorAll('.show-content-cursor').forEach(trigger => {
            const content = trigger.querySelector('.sbc-content-cursor')
            if (!content) {
                trigger.classList.remove('show-content-cursor')
                return
            }
            const contentInner = content.querySelector('.sbc-content-cursor__inner')
            content.style.display = 'none'

            const onMouseEnter = (e) => {
                this.setPosition(e)
                content.style.display = 'block'

                this.el.appendChild(content)
                gsap.set(content, {autoAlpha: 1, })
                this.el.classList.add('content-cursor-visible')

                gsap.fromTo(contentInner, {
                    scale: .75,
                    opacity: 0,
                }, {
                    scale: 1,
                    opacity: 1,
                    duration: .24,
                })
            }

            trigger.removeEventListener('mouseenter', onMouseEnter)
            trigger.addEventListener('mouseenter', onMouseEnter)

            const onMouseLeave = (e) => {
                this.el.classList.remove('content-cursor-visible')

                gsap.to(contentInner, {
                    scale: .75,
                    opacity: 0,
                    duration: .12,
                    onComplete: () => {
                        this.el.removeChild(content)
                        content.style.display = 'none'
                    },
                })
            }
            trigger.removeEventListener('mouseleave', onMouseLeave)
            trigger.addEventListener('mouseleave', onMouseLeave)
        })
    }

    this.resetContent = () => {
        if (this.el.classList.contains('content-cursor-visible')) {
            this.el.classList.remove('content-cursor-visible')

            const content = this.el.querySelector('.sbc-content-cursor')
            const contentInner = content.querySelector('.sbc-content-cursor__inner')

            gsap.to(contentInner, {
                scale: .75,
                opacity: 0,
                duration: .12,
                onComplete: () => {
                    this.el.removeChild(content)
                    content.style.display = 'none'
                },
            })
        }
    }

    this.updateTriggers = () => {
        links = []
        hideTriggers = []
        this.setTriggers()
    }

    this.setPosition = (e) => {
        clientX = e.clientX
        clientY = e.clientY

        gsap.set(this.el, {
            x: clientX,
            y: clientY,
        })
        this.el.style.display = ''
        this.render()
    }

    this.render = () => {
        // gsap.to(this.el, {
        //     x: clientX,
        //     y: clientY,
        //     duration: duration,
        // })
        gsap.set(this.el, {
            x: clientX,
            y: clientY,
        })
    }
}
if (!isMobileDevice())
    cursor.init();


//////////////////////
// PAGE TRANSITIONS //
//////////////////////
const PageTransition = new function () {
    let fader = null
    let header = null
    let homeBottom = null
    let navigatorTab = null

    // Set elements initial states
    this.set = () => {
        fader = document.querySelector('.sbc-page-fader')
        header = document.querySelector('.sbc-site-header')
        homeBottom = document.querySelector('.sbc-home-fixed__bottom')
        navigatorTab = document.querySelector('.sbc-tab-navigator-wrapper')

        gsap.set(header, {
            yPercent: -100,
            willChange: 'transform',
        })
        if (homeBottom) {
            gsap.set(homeBottom, {
                yPercent: 100,
                willChange: 'transform',
            })
        }
        if (navigatorTab) {
            gsap.set(navigatorTab, {
                yPercent: -100,
                willChange: 'transform',
            })
        }
    }

    // Transition in
    this.in = (done) => {
        this.set()

        const tl = gsap.timeline({
            delay: isHome() ? .45 : .15,
            onComplete: done ? done.async() : null
        })

        tl.to(fader, {
            autoAlpha: 0,
            duration: .9,
        })
        tl.to(header, {
            yPercent: 0,
            ease: 'expo.out',
            duration: .9,
        }, '>-=.75')
        if (homeBottom) {
            tl.to(homeBottom, {
                yPercent: 0,
                ease: 'expo.out',
                duration: .9,
            }, '>-=.6')
        }
        if (navigatorTab) {
            tl.to(navigatorTab, {
                yPercent: 0,
                ease: 'expo.out',
                duration: .9,
            }, '>-=.6')
        }

        return tl
    }

    // Transition out
    this.out = (done) => {
        gsap.set(fader, {
            yPercent: 100,
            autoAlpha: 1,
        })

        const tl = gsap.timeline({
            onComplete: done ? done.async() : null
        })
        tl.to(header, {
            yPercent: -100,
            ease: 'expo.out',
            duration: 1,
        })
        if (homeBottom) {
            tl.to(homeBottom, {
                yPercent: 100,
                ease: 'expo.out',
                duration: 1,
            }, '<')
        }
        if (navigatorTab) {
            tl.to(navigatorTab, {
                yPercent: -50,
                ease: 'expo.out',
                duration: 1,
            }, '<')
        }
        tl.to(fader, {
            yPercent: 0,
            ease: 'expo.out',
            duration: .75,
        }, '>-=.75')

        return tl
    }
}

const FadeTransition = new function () {
    // Fade transition in
    this.in = (container, done) => {
        gsap.set(container, {
            autoAlpha: 0,
        })
        const tl = gsap.timeline({
            delay: .3,
            onComplete: done ? done.async() : null
        })
        tl.to(container, {
            autoAlpha: 1,
            duration: .3,
        })

        return tl
    }

    // Fade transition out
    this.out = (container, done) => {
        const tl = gsap.timeline({
            onComplete: done ? done.async() : null
        })
        tl.to(container, {
            autoAlpha: 0,
            duration: .03,
        })

        return tl
    }
}

///////////
// BARBA //
///////////
barba.init({
    // debug: true,
    timeout: 8000,
    preventRunning: true,
    transitions: [{
            name: 'default',
            leave() {
                PageTransition.out(this);
            },
            enter() {
                PageTransition.set();
                PageTransition.in(this);
            },
            once(data) {
                if (data.next.namespace == 'home' && playHomeLoader)
                    return;
                if (data.next.namespace !== 'home')
                    playHomeLoader = false;
                PageTransition.set();
                PageTransition.in(this);
            }
        },
        {
            name: 'self',
            leave() {
                PageTransition.out(this);
            },
            enter() {
                PageTransition.set();
                PageTransition.in(this);
            },
        },
        {
            name: 'home-self',
            from: {
                namespace: ['home']
            },
            to: {
                namespace: ['home']
            },
            leave(data) {
                FadeTransition.out(data.current.container, this);
            },
            enter(data) {
                FadeTransition.in(data.next.container, this);
            },
        }],
});

barba.hooks.before(() => {
    document.body.classList.add('page-transition-in-active');
    if (!isMobileDevice())
        cursor.resetContent();
});

barba.hooks.afterLeave(data => {
    data.current.container.parentNode.removeChild(data.current.container);
    if (smoother) {
        smoother.scrollTop(0);
        smoother.kill()
        smoother = null
    } else {
        window.scrollTo(0, 0);
    }
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (!isMobileDevice())
        cursor.resetContent();
});

barba.hooks.beforeEnter(() => {
    if (!isMobileDevice())
        cursor.updateTriggers();

    menuSetup();
    navigatorTab.init();
    smoothScrollSetup();
    document.body.classList.remove('page-transition-in-active');
    document.body.classList.add('page-transition-out-active');
});

barba.hooks.afterEnter(() => {
    ga('set', 'page', window.ubicación.pathname);
    ga('send', 'pageview');
    document.body.classList.remove('page-transition-out-active');
})

if (smoother) {
    smoother.scrollTop(0);
} else {
    window.scrollTo(0, 0);
}