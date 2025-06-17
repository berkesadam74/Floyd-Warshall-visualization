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
    ctx.fillStyle = jeOznaceny ? "#f2fedc" : "#ffd700";
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

function resetujGraf() {
  vrcholy = [];
  hrany = [];
  oznacene = [];
  draw();
}

document.getElementById("btn-vrchol").addEventListener("click", function () {
  nastavAktivnyRezim("vrchol");
});

document.getElementById("btn-hrana").addEventListener("click", function () {
  nastavAktivnyRezim("hrana");
});

document.getElementById("btn-reset").addEventListener("click", resetujGraf);

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

document
  .getElementById("btn-fw")
  .addEventListener("click", spustiFloydWarshall);

function zobrazMaticu(matica) {
  let n = matica.length;
  let html = "<table style='margin:auto; border-collapse:collapse;'>";
  html += "<tr><th></th>";
  for (let j = 0; j < n; j++) html += `<th style="padding:3px;">${j}</th>`;
  html += "</tr>";
  for (let i = 0; i < n; i++) {
    html += `<tr><th style="padding:10px;">${i}</th>`;
    for (let j = 0; j < n; j++) {
      let val = matica[i][j] === Infinity ? "&infin;" : matica[i][j];
      html += `<td style="border:1px solid #ccc; padding:6px 10px; min-width:30px;">${val}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("matica").innerHTML = html;
}

function spustiFloydWarshall() {
  let pocetVrcholov = vrcholy.length;
  if (pocetVrcholov === 0) {
    document.getElementById("matica").innerHTML = "Graf je prázdny.";
    return;
  }

  // inicializacia matice vzsialenosti
  let vzdialenosti = Array.from({ length: pocetVrcholov }, () =>
    Array(pocetVrcholov).fill(Infinity),
  );
  // Nuly na diagonalu
  for (let i = 0; i < pocetVrcholov; i++) vzdialenosti[i][i] = 0;

  // Nastavime vahy priamych hran
  for (let i = 0; i < hrany.length; i++) {
    let hrana = hrany[i];
    let od = hrana[0];
    let do_ = hrana[1];
    let vaha = hrana[2];
    vzdialenosti[od][do_] = vaha;
  }

  // Floyd-Warshall algoritmus
  for (let k = 0; k < pocetVrcholov; k++) {
    for (let i = 0; i < pocetVrcholov; i++) {
      for (let j = 0; j < pocetVrcholov; j++) {
        if (vzdialenosti[i][k] + vzdialenosti[k][j] < vzdialenosti[i][j]) {
          vzdialenosti[i][j] = vzdialenosti[i][k] + vzdialenosti[k][j];
        }
      }
    }
  }

  zobrazMaticu(vzdialenosti);
}

nastavAktivnyRezim("vrchol");
draw();
