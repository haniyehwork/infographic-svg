
//////////////////////////////////////////////(kute morph logo-star in header)///////////////////////////////////////////////////////////


KUTE.fromTo('.star1', {path: '.star1'}, { path: '.text1'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star2', {path: '.star2'}, { path: '.text2'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star3', {path: '.star3'}, { path: '.text3'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star4', {path: '.star4'}, { path: '.text4'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star5', {path: '.star5'}, { path: '.text5'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star6', {path: '.star6'}, { path: '.text6'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star7', {path: '.star7'}, { path: '.text7'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star8', {path: '.star8'}, { path: '.text8'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star9', {path: '.star9'}, { path: '.text9'},{delay:3200,duration: 1000}).start();

KUTE.fromTo('.star21', {path: '.star21'}, { path: '.text21'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star22', {path: '.star22'}, { path: '.text22'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star23', {path: '.star23'}, { path: '.text23'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star24', {path: '.star24'}, { path: '.text24'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star25', {path: '.star25'}, { path: '.text25'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star26', {path: '.star26'}, { path: '.text26'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star27', {path: '.star27'}, { path: '.text27'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star28', {path: '.star28'}, { path: '.text28'},{delay:3200,duration: 1000}).start();
KUTE.fromTo('.star29', {path: '.star29'}, { path: '.text29'},{delay:3200,duration: 1000}).start();


////////////////////////////////////////////////////////////(show flowers logo in first motion)/////////////////////////////////////////////////////////

let tl = gsap.timeline();
tl.to(".star9",0.3,{opacity:1})
  .to(".star1",0.3,{opacity:1})
  .to(".star2",0.3,{opacity:1})
  .to(".star3",0.3,{opacity:1}) 
  .to(".star4",0.3,{opacity:1}) 
  .to(".star5",0.3,{opacity:1}) 
  .to(".star6",0.3,{opacity:1}) 
  .to(".star7",0.3,{opacity:1})
  .to(".star8",0.3,{opacity:1});
  
let t2 = gsap.timeline();
tl.to(".star29",0.3,{opacity:1})
  .to(".star21",0.3,{opacity:1})
  .to(".star22",0.3,{opacity:1})
  .to(".star23",0.3,{opacity:1}) 
  .to(".star24",0.3,{opacity:1}) 
  .to(".star25",0.3,{opacity:1}) 
  .to(".star26",0.3,{opacity:1}) 
  .to(".star27",0.3,{opacity:1})
  .to(".star28",0.3,{opacity:1});
