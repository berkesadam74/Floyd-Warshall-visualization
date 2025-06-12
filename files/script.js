let canvas = document.getElementById("graf");
let ctx = canvas.getContext("2d");

let vrcholy = [];

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < vrcholy.length; i++) {
    let v = vrcholy[i];

    //Kreslim kruh
    ctx.beginPath();
    ctx.arc(v.x, v.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vypisem cislo vrcholu
    ctx.fillStyle = "#222";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i, v.x, v.y);
  }
}

// Pridam vrchol ked kliknem na canvas
canvas.addEventListener("click", function (e) {
  let rect = canvas.getBoundingClientRect();

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  vrcholy.push({ x, y });

  draw();
});

draw();
