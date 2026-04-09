import { Html } from "./lib/html";

const cible = new Html().class("cible").appendTo(document.body);

for (let i = 0; i < 10; i++) {
	new Html()
		.class("circle_cible", `t_p__${i + 1}`)
		.attr("width", `${10 * (10 - i)}`)
		.text(`${i + 1}`)
		.appendTo(cible);
}
