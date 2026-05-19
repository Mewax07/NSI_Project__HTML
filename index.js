import { Html } from "./lib/html.js";
import { TARGET_REGISTRY } from "./lib/targets.js";

// A ne pas toucher
const KEY = "tir_session";

function defaultState() {
	return {
		step: "home",
		targetId: null,
		players: [],
		currentPlayer: 0,
		currentSerie: 0,
		currentShots: [],
	};
}

let parsedData = (() => {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : defaultState();
	} catch {
		return defaultState();
	}
})();

function save() {
	localStorage.setItem(KEY, JSON.stringify(parsedData));
}

function reset() {
	parsedData = defaultState();
	save();
	render();
}

function getTarget() {
	return (
		TARGET_REGISTRY.find((t) => t.id === parsedData.targetId) ??
		TARGET_REGISTRY[0]
	);
}

function sum(arr) {
	return arr.reduce((a, b) => a + b, 0);
}

function fmt(v) {
	return v === 10 ? "X" : (v ?? "-");
}

function el(tag) {
	return new Html(tag);
}

function div() {
	return new Html("div");
}

function span(t) {
	return new Html("span").text(t);
}

function btn(label, classes, onClick) {
	const b = el("button").classOn("btn");
	if (classes) classes.forEach((c) => b.classOn(c));
	return b.text(label).on("click", onClick);
}

const appEl = Html.from("#app");

function topbar(title, right) {
	const bar = div().classOn("topbar");
	bar.append(
		span("Projet de NSI - Competition de tirs").classOn("topbar-brand"),
	);
	bar.append(span(title || "").classOn("topbar-title"));
	if (right) bar.append(span(right).classOn("topbar-right"));
	return bar;
}

function renderHome() {
	appEl.clear();
	appEl.append(topbar("", ""));

	const page = div().classOn("page");

	const hero = div().classOn("hero");
	hero.append(el("h1").text("Compétition"));
	hero.append(el("p").text("Choisissez un type de tir pour commencer."));
	page.append(hero);

	page.append(el("h3").text("Type de tir"));

	const grid = div().classOn("card-grid");
	TARGET_REGISTRY.forEach((target) => {
		const card = div().classOn("card");
		if (parsedData.targetId === target.id) card.classOn("selected");
		card.append(span(target.name).classOn("card-badge"));
		const totalSeries = target.seriesConfig.reduce(
			(a, b) => a + b.count,
			0,
		);
		card.append(
			el("p").text(
				target.distance +
					" - " +
					target.shotsPerSerie +
					" tirs par serie - " +
					totalSeries +
					" series",
			),
		);
		card.on("click", () => {
			parsedData.targetId = target.id;
			save();
			renderHome();
		});
		grid.append(card);
	});
	page.append(grid);

	const row = div().classOn("row");
	row.append(
		btn("Commencez", ["btn-primary"], () => {
			if (!parsedData.targetId) {
				alert("Vous n'avez pas choisi un type de tir.");
				return;
			}
			parsedData.step = "config";
			save();
			render();
		}),
	);
	page.append(row);

	if (parsedData.step !== "home" && parsedData.players.length > 0) {
		const banner = div().classOn("resume-banner");
		banner.append(
			el("p").text("Une session existe déjà, vous voulez continuer"),
		);
		const r = div().classOn("row");
		r.append(btn("Reprendre", ["btn-sm"], () => render()));
		r.append(
			btn("Nouvelle session", ["btn-sm", "btn-danger"], () => {
				if (confirm("Voulez vous supprimer la session en cours"))
					reset();
			}),
		);
		banner.append(r);
		page.append(banner);
	}

	appEl.append(page);
}

function renderConfig() {
	const target = getTarget();
	appEl.clear();
	appEl.append(topbar(target.name, target.distance));

	const page = div().classOn("page");
	page.append(el("h2").text("Joueurs"));
	page.append(
		el("p").text(
			"Entrer le nombre de tireur et entrez leurs noms en dessous",
		),
	);

	const countField = div().classOn("field");
	countField.append(el("label").text("Nombre de joueurs"));
	const countInput = el("input")
		.attr("type", "number")
		.attr("min", "1")
		.attr("max", "30");
	countInput.self().value = parsedData.players.length || 1;
	countField.append(countInput);
	page.append(countField);

	const nameList = div().classOn("player-list");
	page.append(nameList);

	function rebuildNames() {
		nameList.clear();
		const n = Math.min(
			30,
			Math.max(1, parseInt(countInput.self().value) || 1),
		);
		for (let i = 0; i < n; i++) {
			const row = div().classOn("player-row");
			row.append(span(i + 1 + ".").classOn("player-num"));
			const inp = el("input")
				.attr("type", "text")
				.attr("placeholder", "Joueur " + (i + 1));
			inp.self().value = parsedData.players[i]?.name || "";
			row.append(inp);
			nameList.append(row);
		}
	}

	countInput.on("input", rebuildNames);
	rebuildNames();

	const actions = div().classOn("row");
	actions.classOn("mt2");
	actions.append(
		btn("Retour", [], () => {
			parsedData.step = "home";
			save();
			render();
		}),
	);
	actions.append(
		btn("Demarrer", ["btn-primary"], () => {
			const n = Math.min(
				30,
				Math.max(1, parseInt(countInput.self().value) || 1),
			);
			const names = Array.from(nameList.qsa("input")).map(
				(inp, i) => inp.self().value.trim() || "Joueur " + (i + 1),
			);
			parsedData.players = names
				.slice(0, n)
				.map((name) => ({ name, series: [] }));
			parsedData.currentPlayer = 0;
			parsedData.currentSerie = 0;
			parsedData.currentShots = [];
			parsedData.step = "target";
			save();
			render();
		}),
	);
	page.append(actions);

	appEl.append(page);
}

function renderTarget() {
	const target = getTarget();
	const labels = target.allSeriesLabels;
	const totalSeries = labels.length;

	if (parsedData.players.every((p) => p.series.length >= totalSeries)) {
		window.location.href = "./tableau.html";
		return;
	}

	for (let i = 0; i < parsedData.players.length; i++) {
		const idx = (parsedData.currentPlayer + i) % parsedData.players.length;
		if (parsedData.players[idx].series.length < totalSeries) {
			parsedData.currentPlayer = idx;
			break;
		}
	}

	const player = parsedData.players[parsedData.currentPlayer];
	parsedData.currentSerie = player.series.length;

	appEl.clear();
	appEl.append(
		topbar(
			player.name,
			parsedData.currentPlayer +
				1 +
				"/" +
				parsedData.players.length +
				"  Serie " +
				(parsedData.currentSerie + 1) +
				"/" +
				totalSeries,
		),
	);

	const page = div().classOn("target-page");

	const banner = div().classOn("player-banner");
	banner.append(span(player.name).classOn("player-name"));
	const serieInfo = div().classOn("serie-info");
	banner.append(serieInfo);
	page.append(banner);

	const wrap = div().classOn("target-wrap");
	target.render(wrap.self());
	page.append(wrap);

	const strip = div().classOn("score-strip");
	const totalEl = span("").classOn("score-total");

	function updateStrip() {
		strip.clear();
		for (let i = 0; i < target.shotsPerSerie; i++) {
			const dot = div().classOn("score-dot");
			if (i < parsedData.currentShots.length) {
				dot.classOn("filled").text(
					String(fmt(parsedData.currentShots[i].value)),
				);
			} else {
				dot.text(".");
			}
			strip.append(dot);
		}
		const t = parsedData.currentShots.reduce((a, b) => a + b.value, 0);
		totalEl.text(parsedData.currentShots.length > 0 ? String(t) : "");
		strip.append(totalEl);
		serieInfo.html(
			labels[parsedData.currentSerie] +
				"<br>" +
				parsedData.currentShots.length +
				"/" +
				target.shotsPerSerie +
				" tirs",
		);
	}

	function updateMarkers() {
		wrap.qsa(".impact").forEach((e) => e.cleanup());
		parsedData.currentShots.forEach((shot, idx) => {
			const mk = div()
				.classOn("impact")
				.text(String(idx + 1));
			mk.styleJs({
				left: shot.x + "px",
				top: shot.y + "px",
				zIndex: String(200 + idx),
			});
			wrap.append(mk);
		});
	}

	const actionBar = div().classOn("action-bar");
	page.append(strip);
	page.append(actionBar);

	function updateActions() {
		actionBar.clear();

		const undoBtn = btn("Annuler le dernier", ["btn-sm"], () => {
			if (parsedData.currentShots.length === 0) return;
			parsedData.currentShots.pop();
			save();
			updateMarkers();
			updateStrip();
			updateActions();
		});
		undoBtn.self().disabled = parsedData.currentShots.length === 0;
		actionBar.append(undoBtn);

		actionBar.append(
			btn("Passer la serie", ["btn-sm"], () => {
				if (!confirm("Passer cette serie sans score (0 points marqué)"))
					return;
				player.series.push(Array(target.shotsPerSerie).fill(0));
				parsedData.currentShots = [];
				save();
				render();
			}),
		);

		actionBar.append(div().classOn("spacer"));

		if (parsedData.currentShots.length === target.shotsPerSerie) {
			actionBar.append(
				btn("Valider la serie", ["btn-primary"], () => {
					player.series.push(
						parsedData.currentShots.map((s) => s.value),
					);
					parsedData.currentShots = [];
					save();
					render();
				}),
			);
		}
	}

	wrap.on("click", (e) => {
		if (parsedData.currentShots.length >= target.shotsPerSerie) return;
		const zone = e.target.closest("[data-value]");
		if (!zone) return;
		const value = parseInt(zone.getAttribute("data-value"));
		const rect = wrap.self().getBoundingClientRect();
		parsedData.currentShots.push({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			value,
		});
		save();
		updateMarkers();
		updateStrip();
		updateActions();
	});

	updateMarkers();
	updateStrip();
	updateActions();

	if (player.series.length > 0) {
		const hist = div().classOn("history");
		hist.append(el("h3").text("Series precedentes"));
		const panel = div().classOn("history-panel");

		player.series.forEach((serie, si) => {
			const row = div().classOn("shot-row");
			row.append(
				span(labels[si] || "Serie " + (si + 1)).classOn("shot-label"),
			);
			serie.forEach((v, vi) => {
				const sel = el("select");
				for (let val = 0; val <= 10; val++) {
					const opt = document.createElement("option");
					opt.value = val;
					opt.textContent = fmt(val);
					if (val === v) opt.selected = true;
					sel.self().appendChild(opt);
				}
				sel.on("change", () => {
					player.series[si][vi] = parseInt(sel.self().value);
					save();
					const sumEl = panel.qs(
						".shot-row:nth-child(" + (si + 1) + ") .shot-sum",
					);
					if (sumEl) sumEl.text("= " + sum(player.series[si]));
				});
				row.append(sel);
			});
			row.append(span("= " + sum(serie)).classOn("shot-sum"));
			panel.append(row);
		});

		hist.append(panel);
		page.append(hist);
	}

	const pills = div().classOn("player-pills");
	parsedData.players.forEach((p, idx) => {
		const done = p.series.length >= totalSeries;
		const current = idx === parsedData.currentPlayer;
		const pill = span(
			p.name + " " + p.series.length + "/" + totalSeries,
		).classOn("pill");
		if (current) pill.classOn("active");
		else if (done) pill.classOn("done");
		pills.append(pill);
	});
	page.append(pills);

	const resetRow = div().classOn("row");
	resetRow.classOn("end-row");
	resetRow.append(
		btn("Reinitialiser", ["btn-sm", "btn-danger"], () => {
			if (confirm("Reinitialiser toute la session depuis le début"))
				reset();
		}),
	);
	page.append(resetRow);

	appEl.append(page);
}

function renderCredits() {
	const link = new Html("a").text("Rediriger vers les crédits").styleJs({
		color: "#e1e1e1",
	});
	link.elm.href =
		"https://github.com/Mewax07/NSI_Project__HTML/blob/main/credits.md";

	new Html()
		.append(link)
		.styleJs({
			position: "absolute",
			bottom: "5px",
			right: "5px",
		})
		.appendTo(document.body);
}

function render() {
	renderCredits();
	switch (parsedData.step) {
		case "config":
			renderConfig();
			break;
		case "target":
			renderTarget();
			break;
		default:
			renderHome();
	}
}

render();
