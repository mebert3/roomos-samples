var xapi;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const PIN = "1337";
let page = "home";
let timer = 0;
let lang = "en";

const TimeBtwVideo = 30;

const cache = [];
function preloadImage(url) {
  const img = new Image();
  img.src = url;
  cache.push(img);
}

function preloadImages() {
  const imgs = [
    "https://cdn.glitch.global/9ea3304c-e203-4632-87b7-4c542ada1c18/clothing.jpeg?v=1725892951418",
    "https://cdn.glitch.global/9ea3304c-e203-4632-87b7-4c542ada1c18/running.jpeg?v=1725892958222",
    "https://cdn.glitch.global/9ea3304c-e203-4632-87b7-4c542ada1c18/football.jpeg?v=1725892953211",
    "https://cdn.glitch.global/9ea3304c-e203-4632-87b7-4c542ada1c18/clothing.jpeg?v=1725892951418",
    "https://cdn.glitch.global/9ea3304c-e203-4632-87b7-4c542ada1c18/outdoor.jpeg?v=1725892954385",
  ];
  imgs.forEach(preloadImage);
}

function dial(Number) {
  xapi.command("Dial", { Number });
}

function setLanguage(language) {
  xapi.config.set("UserInterface Language", language);
}

function show(el, visible) {
  el.style.display = visible ? "flex" : "none";
}

function notify(msg) {
  console.log(msg);
  return;
  // clearTimeout(timer);
  // const a = $('.alert');
  // a.innerText = msg;
  // a.style.display = 'block';
  // timer = setTimeout(() => a.style.display = 'none', 2000);
}

function playVideo() {
  if (page !== "home") return;
  const vid = $("#mainvideo");
  vid.style.display = "block";
  vid.currentTime = 0;
  vid.play();
  vid.onended = () => {
    vid.style.display = "none";
    setRandomPoster();
  };
}

function setRandomPoster() {
  const number = Math.floor(Math.random() * 5);
  $(".poster").style.backgroundImage = `url('https://cdn.glitch.global/9ea3304c-e203-4632-87b7-4c542ada1c18/poster${number}.jpeg?v=1725892955634')`;
}

function showPage(newPage) {
  page = newPage;
  console.log("show", page);
  show($(".home"), page === "home");
  show($(".choose"), page === "choose");
  show($(".details"), page === "details");
  // showSelfview(!isHome);
}

function showSelfview(show) {
  if (show) {
    xapi.command("Video SelfView Set", { FullScreenMode: "On" });
    xapi.command("Video SelfView Set", { PIPPosition: "LowerRight" });
    xapi.command("Video SelfView Set", { Mode: "On" });
  } else {
    xapi.command("Video Selfview Set", { Mode: "Off" });
  }
}

function disableKiosk() {
  console.log("disable kiosk");
  location.href = "cisco-room-action:disable-kiosk";
}

function askPin() {
  const pin = prompt("To quit kiosk mode, enter pin code:");
  if (pin === PIN) disableKiosk();
  else if (pin) alert("Wrong pin");
}

/**
function translate(lang) {
  const str = strings[lang];
  for (let s in str) {
    $("." + s).innerText = str[s];
  }
}*/

function onClick(e) {
  // e.preventDefault(); // avoid double touch + click
  const btn = e.target;
  // console.log(e.currentTarget);
  if (btn.classList.contains("dial-button")) {
    // const number = btn.dataset.number;
    // dial(number);
  } else if (btn.classList.contains("flag-button")) {
    //translate(btn.dataset.lang);
  } else if (btn.classList.contains("quit")) {
    askPin();
  } else if (btn.classList.contains("color")) {
    const color = btn.classList[1];
    setCarColor(color);
  } else if (e.target.classList.contains("item")) {
    selectItem(e.target.classList[1]);
  } else if (e.currentTarget.classList.contains("home")) {
    showPage("choose");
  }
}

function setCarColor(color) {
  $(".screen.details").className = "screen details " + color;
}

function selectItem(item) {
  showPage("details");
}

window.onload = () => {
  // document.body.ontouchend = onClick;
  $(".home").onclick = onClick;
  $(".choose").onclick = onClick;
  $(".details").onclick = onClick;

  setTimeout(preloadImages, 100); // dont block initial page load
  setInterval(playVideo, TimeBtwVideo * 1000);
  setRandomPoster();
  // temp
  // selectItem('item1');
};
