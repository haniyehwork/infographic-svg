var mq = window.matchMedia( "(max-width: 570px)" );
var tl = new TimelineMax({repeat: 1, yoyo: true});
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MorphSVGPlugin);
tl.to(".logo" , {duration: 2, x: 280, y: 40, ease:Linear.easeNone});
tl.to(".whaaaat" , {duration: 0.2, backgroundColor: "#fff"});
TweenMax.to("#pls", 2 , {morphSVG:"#pants", ease:Linear.easeNone} ,0);
gsap.to("#leftleg" , {duration: 2, x: 115, y:40 , ease:Linear.easeNone});
if (!mq.matches) {
    
gsap.to(".bannerText", {scrollTrigger:{ trigger: ".bannerText", toggleActions: "restart pause reverse none"} , x: 800, opacity: 1, duration: 2});
gsap.to("#orderbtn" ,{scrollTrigger:{ trigger: "#orderbtn", toggleActions: "restart pause reverse none"} , x:300, opacity: 1, duration: 2});
 
}
