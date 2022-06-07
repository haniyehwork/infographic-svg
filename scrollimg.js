gsap.registerPlugin(ScrollTrigger);

// --- RED PANEL ---
gsap.from(".line-red", {
  scrollTrigger: ".line-red", // same as scrollTrigger: {trigger: ".line-1", toggleActions: "play none none none", start: "top bottom", end: "bottom top"}
  scaleX: 0, 
  duration: 10, 
  transformOrigin: "left center", 
  ease: "none"
});


// --- PURPLE PANEL ---
gsap.from(".line-purple", {
  scrollTrigger: {
    trigger: ".line-purple",
    toggleActions: "restart pause resume pause"
  },
  scaleX: 0, 
  duration: 10, 
  transformOrigin: "left center", 
  ease: "none"
});



// --- ORANGE PANEL --- 
gsap.from(".line-orange", {
  scrollTrigger: {
    trigger: ".line-orange",
    toggleActions: "play complete reverse reset"
  },
  scaleX: 0, 
  duration: 10, 
  repeat: -1, 
  transformOrigin: "left center", 
  ease: "none"
});

// --- GREEN PANEL ---
gsap.from(".line-green", {
  scrollTrigger: {
    trigger: ".line-green",
    start: "top center",
    end: "top 100px",
    toggleActions: "play pause resume pause"
  },
  scaleX: 0, 
  duration: 10, 
  repeat: -1, 
  transformOrigin: "left center", 
  ease: "none"
});