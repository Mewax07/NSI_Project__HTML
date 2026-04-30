import { Html } from "./lib/html";

const cible = new Html().class("cible").appendTo(document.body);

for (let i = 0; i < 10; i++) {
	const ratio = (10 - i) / 10;
	const size = ratio * 90;

	const current = new Html()
		.classOn("circle_cible")
		.attr("result", i + 1)
		.styleJs({
			zIndex: i + 1,
			width: `${size}vmin`,
			height: `${size}vmin`,
			background: i >= 6 ? "#010101" : "#f1f1f1",
			border: `1px solid ${i >= 6 ? "#f1f1f1" : "#010101"}`,
			color: i >= 6 ? "#f1f1f1" : "#010101",
		})
		.appendTo(cible);

	if (i < 9) {
		current.text(`${i + 1}`);
	}
}

cible.on("click", (e) => {
	const result = e.target.getAttribute("result");
	console.log(result);
});

function impact(x, y) {
	const impact = new Html().class("impact").attr("x", x).attr("y", y);
	return impact;
}
