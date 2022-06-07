var tl = new TimelineMax({repeat: -1, yoyo: true});
tl.to(".cursor" , {duration: 1, x: 120, ease:Linear.easeNone});
tl.to(".frame1" , {
    duration: 0.5,
    fill: "#000"
});
tl.to(".frame2" , {
    duration: 0.3,
    opacity: 0.3
});
tl.to(".cursor" , {duration: 2, x: -200, y:-29, ease:Linear.easeNone});
tl.to(".myYellow" , {duration: 0.6, fill:"none", stroke:"#333"});
tl.to(".cursor" , {duration: 1.5, x: 120, y:1 , ease:Linear.easeNone});
tl.to(".frame3" , {
    duration: 1,
    opacity: 0.9,
    fill:"#ffc40c"
});

