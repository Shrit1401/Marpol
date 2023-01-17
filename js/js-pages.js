// Barba hooks
barba.hooks.afterLeave(data => {
    if (document.documentElement.classList.contains('white')) {
        document.documentElement.classList.remove('white');
    }
});

barba.hooks.beforeEnter((data) => {
    if (data.next.namespace == 'page') {
        aniIni();
    }
});

aniIni();

function aniIni() {
    // Parar la función si no estamos en una página interior
    if (isHome())
        return;

    // Slider
    $('.slider').slick({
        speed: 1000,
        cssEase: 'cubic-bezier(.2,.81,.3,.97)',
    });

    gsap.utils.toArray('.ani__flicker').forEach((box) => {
        gsap.from(box, {
            scrollTrigger: {
                start: '0% 75%',
                end: '0% 75%',
                trigger: box,
                onEnter() {
                    box.classList.add("active");
                }
            }
        });
    });

    gsap.utils.toArray('.mod__super_cta_txt').forEach((box) => {
        gsap.from(box, {
            scrollTrigger: {
                start: 'center 85%',
                end: 'center 85%',
                trigger: box,
                onEnter() {
                    box.classList.add("active");
                }
            }
        });
    });

    gsap.utils.toArray('.modulo_toggle_color').forEach((box) => {
        gsap.from(box, {
            scrollTrigger: {
                start: '40% center',
                end: '40% center',
                trigger: box,
                onEnter() {
                    if ($("html").hasClass("white")) {
                        $("html").removeClass("white");
                        $("html").addClass("black");
                    } else {
                        $("html").removeClass("black");
                        $("html").addClass("white");
                    }

                },
                onLeaveBack() {
                    if ($("html").hasClass("white")) {
                        $("html").removeClass("white");
                        $("html").addClass("black");
                    } else {
                        $("html").removeClass("black");
                        $("html").addClass("white");
                    }

                }
            }
        });
    });


    gsap.utils.toArray('.mod__legal_enlaces').forEach((box) => {

        ScrollTrigger.create({
            trigger: box,
            start: 'top 220',
            endTrigger: 'footer',
            end: 'bottom-=130 bottom',
            pin: true,
            pinType: "fixed",
            pinReparent: true,
            pinSpacing: false
        });

    });

    gsap.utils.toArray('.ani__foto span').forEach((box) => {
        let tl = gsap.timeline({defaults: {ease: "none"}}).to(box, {rotateX: "-45deg", duration: 1})

        ScrollTrigger.create({
            trigger: box,
            start: "top 120%",
            end: "bottom 10%",
            animation: tl,
            scrub: true
        })

    });


// ANIMACIÓN FLOTANTE.
    gsap.utils.toArray('.ani__flotante').forEach((box) => {
        var p1 = 200;
        var p2 = 600;
        if (window.innerWidth < 992) {
            var p1 = -100;
            var p2 = 100;
        }

        let tl = gsap.timeline({defaults: {ease: "none"}}).fromTo(box, {y: p1}, {y: p2})

        $("#" + $(box).attr("id") + " .FRAME_0").addClass("active");

        ScrollTrigger.create({
            trigger: box,
            start: "30% bottom",
            end: "90% top",
            animation: tl,
            scrub: true,
//            markers: true,
            onUpdate: self => {
                var p = Math.trunc(self.progress * 100);
                $("#" + $(box).attr("id") + ".ani__flotante svg g").removeClass("active");
                if (p == 100) {
                    p = 99;
                }
                $("#" + $(box).attr("id") + " .FRAME_" + p).addClass("active");
            }
        })

    });


    gsap.utils.toArray('.ani__arrow').forEach((box) => {
        let tl = gsap.timeline({defaults: {ease: "none"}}).to(box, {width: "31px", duration: 1})

        ScrollTrigger.create({
            trigger: box,
            start: "center bottom",
            end: "center 60%",
            animation: tl,
            scrub: true
        })

    });


    for (var i = 1; i < 5; i++) {
        if ($(window).width() > 1024) {
            var distancia = i * 60;
        } else {
            var distancia = i * 26;
        }

        let ani_cp1 = gsap.timeline({defaults: {ease: "none"}}).to(".super_cp" + i, {y: distancia, duration: 1})

        ScrollTrigger.create({
            trigger: ".super_cp" + i,
            start: 'center bottom ',
            end: 'center -30%',
            animation: ani_cp1,
            scrub: true
        })
    }


//MARQUESINA
    let marquee = document.querySelectorAll('.mod_marquesina_animado_cont');

    marquee.forEach(el => {
        let rate = 100;
        let distance = el.clientWidth;
        let style = window.getComputedStyle(el);
        let marginRight = parseInt(style.marginRight) || 0;
        let totalDistance = distance + marginRight;
        totalDistance = totalDistance - $(window).width();
        let time = totalDistance / rate;
        let container = el;

        const marqueeTimeline = gsap.timeline({
            repeat: -1,
            timeScale: 1
        });

        marqueeTimeline.to(container, time, {
            repeat: -1,
            x: '-' + totalDistance,
            ease: Linear.easeNone,
        });

        var timeScaleClamp = gsap.utils.clamp(1, 6);

        marqueeTimeline.timeScale(1);

        ScrollTrigger.create({
            start: 0,
            end: "max",
            ease: Linear.easeNone,
            onUpdate: self => {
                marqueeTimeline.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 100)));
            }
        });

        setInterval(function () {
            marqueeTimeline.timeScale(1);
        }, 1000);

    });



    $(".mod_team__item").hover(function () {
        $(this).addClass("isHover");
    }, function () {
        $(this).removeClass("isHover");
    });
    $(".mod_team__listado .mod_team__item .mod_team__item_enlaces a").hover(function () {
        $(this).parent("div").parent("div").parent("div").parent("div").children(".mod_team__item_img_point").addClass("isHover");
    }, function () {
        $(this).parent("div").parent("div").parent("div").parent("div").children(".mod_team__item_img_point").removeClass("isHover");
    });

    //CURSOR
    document.removeEventListener('mousemove', movecursor);
    document.addEventListener('mousemove', movecursor);
    function movecursor(e) {
        var team_item = $(".mod_team__item.isHover").offset();
        if (team_item) {
            var top = team_item.top;
            var left = team_item.left;

            gsap.to(".mod_team__item.isHover .mod_team__item_img_point", {
                ease: "expo.out",
                duration: 1,
                x: e.pageX - left,
                y: (e.pageY - top),
            });
        }
    }

    $(".mod__legal_enlaces a").each(function () {
        if (window.location.href == $(this).attr("href")) {
            $(this).addClass("active");
        }
    });

    if ($("body").hasClass("error404")) {
        setInterval(function () {
            $(".page404__title").toggleClass("parpa")
        }, 2000);
    }

    $(window).resize(function (e) {
        if (window.innerWidth < 1025) {
            if (!$('.sliderRel').hasClass('slick-initialized')) {
                mobileOnlySlider();
            }
        } else {
            if ($('.sliderRel').hasClass('slick-initialized')) {
                $('.sliderRel').slick('unslick');
            }
        }
    });

    function mobileOnlySlider() {
        $('.sliderRel').slick({
            arrows: false,
            dots: false,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        centerMode: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        centerMode: true
                    }
                }

            ]

        });
    }
    if (window.innerWidth < 1025) {
        mobileOnlySlider();
    }

    function resizeWindow() {
        vhCss = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vhCss}px`);
    }
    resizeWindow()
    window.addEventListener('resize', () => {
        resizeWindow()
    });

    $(".slick-next, .slick-prev").click(function () {
        if (window.innerWidth < 1025) {
            $(this).addClass("active");
            setTimeout(function () {
                $(".slick-next, .slick-prev").removeClass("active");
            }, 500);
        }
    });

    $(".openVideoSlider").click(function () {
        var urlVideo = $(this).attr("href");
        $("#modal #modalContent").html('<video muted autoplay="" loop="" controls playsinline><source src="' + urlVideo + '" type="video/mp4" /></video>')
        $("#modal").addClass("active")
        return false;
    });

    $(".modal__close a").click(function () {
        $("#modal").removeClass("active");
        $("#modal #modalContent").html('')
        return false;
    });


    var vids = document.querySelectorAll("video");
    vids.forEach(vid => {
        var playPromise = vid.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
            }).catch(error => {
            });
        }
        ;
    });

    $("video[autoplay]").each(function () {
        this.play();
    });

    $(".menu").removeClass("hover");
    $(".menu .menu__menu ul li.menu__menu_childs ul").height(0);

    $(".arengu").each(function () {
        ArenguForms.embed($(this).data("arengu-id"), "#" + $(this).attr("id"));
    });

    superCTA();
    $(window).resize(function () {
        superCTA();
    });

    function superCTA() {
        $('.mod__super_cta_txt .mod__super_cta_cont').each(function () {
            var tamFuen = 10;
            $(this).children(".super").css("fontSize", tamFuen);
            var tamSuper = $(this).width();

            var restar = 160;
            if ($(window).width() < 1366) {
                restar = 100;
            }
            if ($(window).width() < 768) {
                restar = 80;
            }
            var tamCont = $(window).width() - restar;

            if ($(window).width() > 1920) {
                tamCont = 1920;
            }
            var f_g = (tamFuen * tamCont) / tamSuper;
            $(this).children(".super").css("fontSize", f_g);

        });
    }

}


