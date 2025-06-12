window.onload = function () {
  const canvas = document.getElementById("graf");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#888";
  ctx.font = "20px sans-serif";
  ctx.fillText("Tu bude graf... :)", 200, 200);
};
