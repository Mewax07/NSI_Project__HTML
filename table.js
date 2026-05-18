import { Html } from './lib/html.js';
import { TARGET_REGISTRY } from './lib/targets.js';

const CLE = 'tir_session';

function chargerDonnees() {
	try {
		const raw = localStorage.getItem(CLE);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

const E = chargerDonnees();
const appEl = Html.from('#app');

function somme(arr) {
	return arr.reduce((a, b) => a + b, 0);
}

function fmt(v) {
	return v === 10 ? 'X' : (v ?? '-');
}

function totalJoueur(joueur) {
	return joueur.series.reduce((a, s) => a + somme(s), 0);
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

function mkTh(texte, extra) {
	const th = el('th').text(String(texte));
	if (extra?.rowspan) th.attr('rowspan', String(extra.rowspan));
	return th;
}

function mkTd(texte, classes, extra) {
	const td = el('td').text(String(texte));
	if (classes) classes.forEach((c) => td.classOn(c));
	if (extra?.rowspan) td.attr('rowspan', String(extra.rowspan));
	return td;
}

function barreHaute() {
	const barre = div().classOn('barre-haute');
	barre.append(span('SCORING TIR').classOn('barre-marque'));
	barre.append(span('Resultats').classOn('barre-titre'));
	barre.append(
		el('a')
			.attr('href', './index.html')
			.classOn('btn')
			.classOn('btn-petit')
			.text('Retour'),
	);
	return barre;
}

if (!E || !E.participants || E.participants.length === 0) {
	appEl.append(barreHaute());
	const page = div().classOn('page');
	page.append(el('h2').text('Aucune donnee'));
	page.append(
		el('p').text(
			"Aucune session enregistree. Commencez une partie depuis l'accueil.",
		),
	);
	const lien = el('a')
		.attr('href', './index.html')
		.classOn('btn')
		.classOn('btn-principal')
		.text('Demarrer');
	page.append(div().classOn('rangee').classOn('mt2').append(lien));
	appEl.append(page);
} else {
	const cible =
		TARGET_REGISTRY.find((t) => t.id === E.cibleId) ?? TARGET_REGISTRY[0];
	const etiquettes = cible.allSeriesLabels;
	const totalSeries = etiquettes.length;

	appEl.append(barreHaute());
	const page = div().classOn('page');

	page.append(el('h2').text('Tableau des resultats'));
	page.append(el('p').text(cible.name + ' — ' + cible.distance));

	const onglets = div().classOn('onglets');
	const zoneTableau = div();

	function construireTableau(idxJoueur) {
		zoneTableau.clear();
		const joueur = E.participants[idxJoueur];

		const conteneur = div().classOn('conteneur-tableau');
		const tableau = el('table').classOn('tableau-resultats');
		const entete = el('thead');
		const ligneEntete = el('tr');

		ligneEntete.append(mkTh('Serie'));
		for (let i = 1; i <= cible.shotsPerSerie; i++)
			ligneEntete.append(mkTh('n' + i));
		ligneEntete.append(mkTh('Pts'));
		if (cible.shotsPerSerie === 5) ligneEntete.append(mkTh('Passe'));
		ligneEntete.append(mkTh('Total'));

		entete.append(ligneEntete);
		tableau.append(entete);

		const corps = el('tbody');
		let grandTotal = 0;

		for (let i = 0; i < totalSeries; i++) {
			const serie = joueur.series[i];
			const tirs = serie ?? Array(cible.shotsPerSerie).fill(null);
			const totalSerie = serie ? somme(serie) : null;
			if (totalSerie !== null) grandTotal += totalSerie;

			const ligne = el('tr');
			ligne.append(mkTd(etiquettes[i], ['td-serie']));

			tirs.forEach((v) => {
				if (v === null) ligne.append(mkTd('-', ['td-vide']));
				else ligne.append(mkTd(fmt(v), []));
			});

			ligne.append(
				totalSerie !== null
					? mkTd(totalSerie, ['td-accent'])
					: mkTd('-', ['td-vide']),
			);

			if (cible.shotsPerSerie === 5 && i % 2 === 0) {
				const s1 = joueur.series[i],
					s2 = joueur.series[i + 1];
				const passe = s1 && s2 ? somme(s1) + somme(s2) : '-';
				ligne.append(
					mkTd(passe, s1 && s2 ? ['td-accent'] : ['td-vide'], {
						rowspan: 2,
					}),
				);
			}

			if (i === 0) {
				ligne.append(
					mkTd(totalJoueur(joueur), ['td-accent', 'td-grand-total'], {
						rowspan: totalSeries + 1,
					}),
				);
			}

			corps.append(ligne);
		}

		const ligneTotale = el('tr');
		const tdTotalLbl = el('td')
			.text('TOTAL')
			.classOn('td-serie')
			.classOn('td-total-lbl');
		ligneTotale.append(tdTotalLbl);
		for (let i = 0; i < cible.shotsPerSerie; i++)
			ligneTotale.append(mkTd('', ['td-vide']));
		ligneTotale.append(mkTd(grandTotal, ['td-accent', 'td-total-bas']));
		corps.append(ligneTotale);

		tableau.append(corps);
		conteneur.append(tableau);
		zoneTableau.append(conteneur);
	}

	E.participants.forEach((part, idx) => {
		const onglet = el('button').classOn('onglet').text(part.nom);
		if (idx === 0) onglet.classOn('actif');
		onglet.on('click', () => {
			onglets.qsa('.onglet').forEach((o) => o.classOff('actif'));
			onglet.classOn('actif');
			construireTableau(idx);
		});
		onglets.append(onglet);
	});

	page.append(onglets);
	construireTableau(0);
	page.append(zoneTableau);

	page.append(el('h3').text('Classement').classOn('titre-section'));

	const classes = [...E.participants]
		.map((p) => ({ ...p, total: totalJoueur(p) }))
		.sort((a, b) => b.total - a.total);

	const listeClassement = div().classOn('liste-classement');
	classes.forEach((joueur, rang) => {
		const ligne = div().classOn('ligne-classement');
		if (rang === 0) ligne.classOn('premier');
		ligne.append(span('#' + (rang + 1)).classOn('rang-numero'));
		ligne.append(span(joueur.nom).classOn('rang-nom'));
		ligne.append(span(String(joueur.total)).classOn('rang-score'));
		listeClassement.append(ligne);
	});
	page.append(listeClassement);

	function construireExport() {
		return {
			discipline: cible.name,
			distance: cible.distance,
			date: new Date().toISOString().slice(0, 10),
			participants: E.participants.map((joueur) => ({
				nom: joueur.nom,
				total: totalJoueur(joueur),
				series: etiquettes.map((lbl, i) => ({
					serie: lbl,
					tirs: joueur.series[i] ?? [],
					total: joueur.series[i] ? somme(joueur.series[i]) : 0,
				})),
			})),
		};
	}

	function construireCsv(data) {
		const n = cible.shotsPerSerie;
		const entete = [
			'Participant',
			'Serie',
			...Array.from({ length: n }, (_, i) => 'Tir ' + (i + 1)),
			'Pts/Serie',
			'Total',
		];
		const lignes = [entete.join(',')];
		for (const j of data.participants)
			for (const s of j.series)
				lignes.push(
					[
						'"' + j.nom + '"',
						'"' + s.serie + '"',
						...Array.from({ length: n }, (_, i) => s.tirs[i] ?? ''),
						s.total,
						j.total,
					].join(','),
				);
		return lignes.join('\n');
	}

	function telecharger(nom, contenu, type) {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([contenu], { type }));
		a.download = nom;
		a.click();
	}

	const rangeeExport = div().classOn('rangee-export');

	rangeeExport.append(
		bouton('Exporter en JSON', [], () =>
			telecharger(
				'resultats.json',
				JSON.stringify(construireExport(), null, 2),
				'application/json',
			),
		),
	);
	rangeeExport.append(
		bouton('Exporter en CSV', [], () =>
			telecharger(
				'resultats.csv',
				construireCsv(construireExport()),
				'text/csv',
			),
		),
	);
	rangeeExport.append(
		bouton('Nouvelle session', ['btn-danger'], () => {
			if (confirm('Effacer les donnees et recommencer ?')) {
				localStorage.removeItem(CLE);
				window.location.href = './index.html';
			}
		}),
	);

	page.append(rangeeExport);
	appEl.append(page);
}
