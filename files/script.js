let canvas = document.getElementById("graf");
let ctx = canvas.getContext("2d");

let vrcholy = [];
let hrany = [];
let oznacene = [];

let rezim = "vrchol";

function nakresliSipku(zx, zy, dx, dy, farba) {
  ctx.beginPath();
  ctx.moveTo(zx, zy);
  ctx.lineTo(dx, dy);
  ctx.strokeStyle = farba || "#333";
  ctx.lineWidth = 2;
  ctx.stroke();

  // sipka
  let dlzkaHlavy = 12;
  let uhol = Math.atan2(dy - zy, dx - zx);
  ctx.beginPath();
  ctx.moveTo(dx, dy);
  ctx.lineTo(
    dx - dlzkaHlavy * Math.cos(uhol - Math.PI / 7),
    dy - dlzkaHlavy * Math.sin(uhol - Math.PI / 7),
  );
  ctx.lineTo(
    dx - dlzkaHlavy * Math.cos(uhol + Math.PI / 7),
    dy - dlzkaHlavy * Math.sin(uhol + Math.PI / 7),
  );
  ctx.lineTo(dx, dy);
  ctx.fillStyle = farba || "#333";
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Najprv nakreslime hrany
  for (let h of hrany) {
    let [od, do_, vaha] = h;
    let a = vrcholy[od],
      b = vrcholy[do_];
    if (!a || !b) continue;
    let dx = b.x - a.x,
      dy = b.y - a.y;
    let dlzka = Math.sqrt(dx * dx + dy * dy);
    let offset = 20;
    let zx = a.x + (dx * offset) / dlzka;
    let zy = a.y + (dy * offset) / dlzka;
    let dx2 = b.x - (dx * offset) / dlzka;
    let dy2 = b.y - (dy * offset) / dlzka;
    nakresliSipku(zx, zy, dx2, dy2);

    // Popis vahy
    ctx.fillStyle = "red";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(vaha, (zx + dx2) / 2, (zy + dy2) / 2 - 5);
  }

  // Potom nakreslime vrcholy
  for (let i = 0; i < vrcholy.length; i++) {
    let v = vrcholy[i];
    let jeOznaceny = oznacene.includes(i);

    ctx.beginPath();
    ctx.arc(v.x, v.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = jeOznaceny ? "#ffe066" : "#ffd700";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#222";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i, v.x, v.y);
  }
}

// Pomocna funkcia, zistime ci kliknutie je na vrchole
function klikNaVrchol(x, y) {
  for (let i = vrcholy.length - 1; i >= 0; i--) {
    let v = vrcholy[i];
    let dx = v.x - x,
      dy = v.y - y;
    if (dx * dx + dy * dy <= 400) {
      return i;
    }
  }
  return null;
}

function nastavAktivnyRezim(rezimNovy) {
  rezim = rezimNovy;
  document.getElementById("btn-vrchol").classList.remove("aktivny");
  document.getElementById("btn-hrana").classList.remove("aktivny");
  if (rezim === "vrchol") {
    document.getElementById("btn-vrchol").classList.add("aktivny");
  } else if (rezim === "hrana") {
    document.getElementById("btn-hrana").classList.add("aktivny");
  }
}

document.getElementById("btn-vrchol").addEventListener("click", function () {
  nastavAktivnyRezim("vrchol");
});

document.getElementById("btn-hrana").addEventListener("click", function () {
  nastavAktivnyRezim("hrana");
});

// Pridanie vrcholu alebo hrany
canvas.addEventListener("click", function (e) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  if (rezim === "vrchol") {
    vrcholy.push({ x, y });
    oznacene = [];
  } else if (rezim === "hrana") {
    let kliknuty = klikNaVrchol(x, y);
    if (kliknuty !== null) {
      oznacene.push(kliknuty);
      if (oznacene.length === 2) {
        if (oznacene[0] !== oznacene[1]) {
          let vaha = prompt("Zadaj váhu hrany:", "1");
          if (vaha !== null && !isNaN(vaha) && vaha.trim() !== "") {
            hrany.push([oznacene[0], oznacene[1], parseInt(vaha)]);
          }
        }
        oznacene = [];
      }
    }
  }
  draw();
});

nastavAktivnyRezim("vrchol");
draw();
