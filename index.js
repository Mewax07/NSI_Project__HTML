import { Html } from "./lib/html.js";

const cible = new Html().styleJs({
	position: "relative",
	width: "95vmin",
	height: "95vmin"
}).appendTo(document.body);

let shotCount = 0;
let totalScore = 0;

for (let i = 0; i < 10; i++) {
	const ratio = (10 - i) / 10;
	const size = ratio * 95;
	const dark = i >= 6;

	const ring = new Html()
		.classOn("circle_cible")
		.attr("data-result", i + 1)
		.styleJs({
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			borderRadius: "50%",
			display: "flex",
			justifyContent: "center",
			alignItems: "flex-start",
			paddingTop: "6px",
			fontWeight: "bold",
			userSelect: "none",
			fontSize: "20px",
			zIndex: i + 1,
			width: `${size}%`,
			height: `${size}%`,
			background: dark ? "#111" : "#f1f1f1",
			border: `1px solid ${dark ? "#f1f1f1" : "#111"}`,
			color: dark ? "#f1f1f1" : "#111",
			pointerEvents: "auto",
			cursor: "crosshair",
		})
		.appendTo(cible);

	if (i < 9) ring.text(`${i + 1}`);
}

function impact(x, y, num) {
	new Html()
		.classOn("impact")
		.text(num)
		.styleJs({
			position: "absolute",
			left: `${x}px`,
			top: `${y}px`,
			width: "32px",
			height: "32px",
			borderRadius: "50%",
			background: "#eccc12",
			border: "2px solid #e99b0c",
			transform: "translate(-50%, -50%)",
			pointerEvents: "none",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "18px",
			fontWeight: "700",
			color: "#1e1e1e",
			zIndex: String(200 + num),
		})
		.appendTo(cible);
}

cible.on("click", (e) => {
	const rect = cible.self().getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const target = e.target.closest("[data-result]");
	if (!target) return;

	const score = parseInt(target.getAttribute("data-result"));

	shotCount++;
	totalScore += score;
	console.log(score);

	impact(x, y, shotCount);
});