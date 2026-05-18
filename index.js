import { Html } from './lib/html.js';
import { TARGET_REGISTRY } from './lib/targets.js';

const CLE = 'tir_session';

function etatDefaut() {
	return {
		etape: 'accueil',
		cibleId: null,
		participants: [],
		joueurActuel: 0,
		serieActuelle: 0,
		tirsEnCours: [],
	};
}

let E = (() => {
	try {
		const raw = localStorage.getItem(CLE);
		return raw ? JSON.parse(raw) : etatDefaut();
	} catch {
		return etatDefaut();
	}
})();

function sauvegarder() {
	localStorage.setItem(CLE, JSON.stringify(E));
}

function reinitialiser() {
	E = etatDefaut();
	sauvegarder();
	afficher();
}

function getCible() {
	return (
		TARGET_REGISTRY.find((t) => t.id === E.cibleId) ?? TARGET_REGISTRY[0]
	);
}

function somme(arr) {
	return arr.reduce((a, b) => a + b, 0);
}

function fmt(v) {
	return v === 10 ? 'X' : (v ?? '-');
}

function el(tag) {
	return new Html(tag);
}

function div() {
	return new Html('div');
}

function span(t) {
	return new Html('span').text(t);
}

function bouton(texte, classes, action) {
	const b = el('button').classOn('btn');
	if (classes) classes.forEach((c) => b.classOn(c));
	b.text(texte).on('click', action);
	return b;
}

const appEl = Html.from('#app');

function barreHaute(titre, droite) {
	const barre = div().classOn('barre-haute');
	barre.append(span('SCORING TIR').classOn('barre-marque'));
	const t = span(titre || '').classOn('barre-titre');
	barre.append(t);
	if (droite) barre.append(span(droite).classOn('barre-droite'));
	return barre;
}

function afficherAccueil() {
	appEl.clear();
	appEl.append(barreHaute('', ''));

	const page = div().classOn('page');

	const hero = div().classOn('hero');
	hero.append(el('h1').text('Scoring Tir'));
	hero.append(el('p').text('Choisissez une discipline pour commencer.'));
	page.append(hero);

	page.append(el('h3').text('Discipline'));

	const grille = div().classOn('grille-cartes');
	TARGET_REGISTRY.forEach((cible) => {
		const carte = div().classOn('carte');
		if (E.cibleId === cible.id) carte.classOn('selectionnee');
		carte.append(span(cible.name).classOn('etiquette'));
		carte.append(
			el('p').text(
				cible.distance +
					' — ' +
					cible.shotsPerSerie +
					' tirs par serie',
			),
		);
		carte.on('click', () => {
			E.cibleId = cible.id;
			sauvegarder();
			afficherAccueil();
		});
		grille.append(carte);
	});
	page.append(grille);

	const rangee = div().classOn('rangee');
	rangee.append(
		bouton('Configurer les participants', ['btn-principal'], () => {
			if (!E.cibleId) {
				alert('Choisissez une discipline.');
				return;
			}
			E.etape = 'config';
			sauvegarder();
			afficher();
		}),
	);
	page.append(rangee);

	if (E.etape !== 'accueil' && E.participants.length > 0) {
		const bandeau = div().classOn('bandeau-reprise');
		bandeau.append(
			el('p').text('Session en cours. Voulez-vous reprendre ?'),
		);
		const r = div().classOn('rangee');
		r.append(bouton('Reprendre', ['btn-petit'], () => afficher()));
		r.append(
			bouton('Nouvelle session', ['btn-petit', 'btn-danger'], () => {
				if (confirm('Effacer la session en cours ?')) reinitialiser();
			}),
		);
		bandeau.append(r);
		page.append(bandeau);
	}

	appEl.append(page);
}

function afficherConfig() {
	const cible = getCible();
	appEl.clear();
	appEl.append(barreHaute(cible.name, cible.distance));

	const page = div().classOn('page');
	page.append(el('h2').text('Participants'));
	page.append(
		el('p').text('Combien de tireurs participent ? Entrez leurs noms.'),
	);

	const champNombre = div().classOn('champ');
	champNombre.append(el('label').text('Nombre de participants'));
	const saisieNombre = el('input');
	saisieNombre.attr('type', 'number').attr('min', '1').attr('max', '30');
	saisieNombre.self().value = E.participants.length || 1;
	champNombre.append(saisieNombre);
	page.append(champNombre);

	const listePart = div().classOn('liste-participants');
	page.append(listePart);

	function reconstruireNoms() {
		listePart.clear();
		const n = Math.min(
			30,
			Math.max(1, parseInt(saisieNombre.self().value) || 1),
		);
		for (let i = 0; i < n; i++) {
			const rangee = div().classOn('rangee-participant');
			rangee.append(span(i + 1 + '.').classOn('numero'));
			const inp = el('input')
				.attr('type', 'text')
				.attr('placeholder', 'Participant ' + (i + 1));
			inp.self().value = E.participants[i]?.name || '';
			rangee.append(inp);
			listePart.append(rangee);
		}
	}

	saisieNombre.on('input', reconstruireNoms);
	reconstruireNoms();

	const actions = div().classOn('rangee');
	actions.classOn('mt2');
	actions.append(
		bouton('Retour', [], () => {
			E.etape = 'accueil';
			sauvegarder();
			afficher();
		}),
	);
	actions.append(
		bouton('Demarrer', ['btn-principal'], () => {
			const n = Math.min(
				30,
				Math.max(1, parseInt(saisieNombre.self().value) || 1),
			);
			const noms = Array.from(listePart.qsa('input')).map(
				(inp, i) => inp.self().value.trim() || 'Participant ' + (i + 1),
			);
			E.participants = noms
				.slice(0, n)
				.map((nom) => ({ nom, series: [] }));
			E.joueurActuel = 0;
			E.serieActuelle = 0;
			E.tirsEnCours = [];
			E.etape = 'cible';
			sauvegarder();
			afficher();
		}),
	);
	page.append(actions);

	appEl.append(page);
}

function afficherCible() {
	const cible = getCible();
	const etiquettes = cible.allSeriesLabels;
	const totalSeries = etiquettes.length;

	if (E.participants.every((p) => p.series.length >= totalSeries)) {
		window.location.href = './tableau.html';
		return;
	}

	for (let i = 0; i < E.participants.length; i++) {
		const idx = (E.joueurActuel + i) % E.participants.length;
		if (E.participants[idx].series.length < totalSeries) {
			E.joueurActuel = idx;
			break;
		}
	}

	const joueur = E.participants[E.joueurActuel];
	E.serieActuelle = joueur.series.length;

	appEl.clear();
	appEl.append(
		barreHaute(
			joueur.nom,
			E.joueurActuel +
				1 +
				'/' +
				E.participants.length +
				'  Serie ' +
				(E.serieActuelle + 1) +
				'/' +
				totalSeries,
		),
	);

	const page = div().classOn('page-cible');

	const bandeau = div().classOn('bandeau-joueur');
	bandeau.append(span(joueur.nom).classOn('nom-joueur'));
	const infoSerie = div().classOn('info-serie');
	bandeau.append(infoSerie);
	page.append(bandeau);

	const enveloppe = div().classOn('enveloppe-cible');
	cible.render(enveloppe.self());
	page.append(enveloppe);

	const bande = div().classOn('bande-scores');
	const totalTxt = span('').classOn('total-tirs');

	function majBande() {
		bande.clear();
		for (let i = 0; i < cible.shotsPerSerie; i++) {
			const point = div().classOn('point-score');
			if (i < E.tirsEnCours.length) {
				point
					.classOn('rempli')
					.text(String(fmt(E.tirsEnCours[i].valeur)));
			} else {
				point.text('.');
			}
			bande.append(point);
		}
		const t = E.tirsEnCours.reduce((a, b) => a + b.valeur, 0);
		totalTxt.text(E.tirsEnCours.length > 0 ? String(t) : '');
		bande.append(totalTxt);
		infoSerie.html(
			etiquettes[E.serieActuelle] +
				'<br>' +
				E.tirsEnCours.length +
				'/' +
				cible.shotsPerSerie +
				' tirs',
		);
	}

	function majImpacts() {
		enveloppe.qsa('.impact').forEach((e) => e.cleanup());
		E.tirsEnCours.forEach((tir, idx) => {
			const mk = div()
				.classOn('impact')
				.text(String(idx + 1));
			mk.styleJs({
				left: tir.x + 'px',
				top: tir.y + 'px',
				zIndex: String(200 + idx),
			});
			enveloppe.append(mk);
		});
	}

	const barreActions = div().classOn('barre-actions');
	page.append(bande);
	page.append(barreActions);

	function majActions() {
		barreActions.clear();

		const annuler = bouton('Annuler le dernier', ['btn-petit'], () => {
			if (E.tirsEnCours.length === 0) return;
			E.tirsEnCours.pop();
			sauvegarder();
			majImpacts();
			majBande();
			majActions();
		});
		annuler.self().disabled = E.tirsEnCours.length === 0;
		barreActions.append(annuler);

		barreActions.append(
			bouton('Passer la serie', ['btn-petit'], () => {
				if (!confirm('Passer cette serie sans score ?')) return;
				joueur.series.push(Array(cible.shotsPerSerie).fill(0));
				E.tirsEnCours = [];
				sauvegarder();
				afficher();
			}),
		);

		barreActions.append(div().classOn('espaceur'));

		if (E.tirsEnCours.length === cible.shotsPerSerie) {
			barreActions.append(
				bouton('Valider la serie', ['btn-principal'], () => {
					joueur.series.push(E.tirsEnCours.map((t) => t.valeur));
					E.tirsEnCours = [];
					sauvegarder();
					afficher();
				}),
			);
		}
	}

	enveloppe.on('click', (e) => {
		if (E.tirsEnCours.length >= cible.shotsPerSerie) return;
		const zone = e.target.closest('[data-value]');
		if (!zone) return;
		const valeur = parseInt(zone.getAttribute('data-value'));
		const rect = enveloppe.self().getBoundingClientRect();
		E.tirsEnCours.push({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			valeur,
		});
		sauvegarder();
		majImpacts();
		majBande();
		majActions();
	});

	majImpacts();
	majBande();
	majActions();

	if (joueur.series.length > 0) {
		const historique = div().classOn('historique');
		historique.append(el('h3').text('Series precedentes'));
		const panneau = div().classOn('panneau-historique');

		joueur.series.forEach((serie, si) => {
			const rangee = div().classOn('rangee-tir');
			rangee.append(
				span(etiquettes[si] || 'Serie ' + (si + 1)).classOn(
					'lbl-serie',
				),
			);
			serie.forEach((v, vi) => {
				const sel = el('select');
				for (let val = 0; val <= 10; val++) {
					const opt = document.createElement('option');
					opt.value = val;
					opt.textContent = fmt(val);
					if (val === v) opt.selected = true;
					sel.self().appendChild(opt);
				}
				sel.on('change', () => {
					joueur.series[si][vi] = parseInt(sel.self().value);
					sauvegarder();
					const sommeEl = panneau.qs(
						'.rangee-tir:nth-child(' + (si + 1) + ') .somme-serie',
					);
					if (sommeEl) sommeEl.text('= ' + somme(joueur.series[si]));
				});
				rangee.append(sel);
			});
			rangee.append(span('= ' + somme(serie)).classOn('somme-serie'));
			panneau.append(rangee);
		});

		historique.append(panneau);
		page.append(historique);
	}

	const pastilles = div().classOn('pastilles-joueurs');
	E.participants.forEach((part, idx) => {
		const fini = part.series.length >= totalSeries;
		const actuel = idx === E.joueurActuel;
		const pastille = span(
			part.nom + ' ' + part.series.length + '/' + totalSeries,
		).classOn('pastille');
		if (actuel) pastille.classOn('actif');
		else if (fini) pastille.classOn('termine');
		pastilles.append(pastille);
	});
	page.append(pastilles);

	const reinitRow = div().classOn('rangee');
	reinitRow.classOn('fin-page');
	reinitRow.append(
		bouton('Reinitialiser', ['btn-petit', 'btn-danger'], () => {
			if (confirm('Reinitialiser toute la session ?')) reinitialiser();
		}),
	);
	page.append(reinitRow);

	appEl.append(page);
}

function afficher() {
	switch (E.etape) {
		case 'config':
			afficherConfig();
			break;
		case 'cible':
			afficherCible();
			break;
		default:
			afficherAccueil();
	}
}

afficher();
