export class TargetPistolet25m {
	id = 'pistolet_25m';
	name = 'Pistolet 25 m';
	distance = '25 m';
	shotsPerSerie = 5;
	seriesConfig = [
		{ label: 'Précision', short: 'P', count: 4 },
		{ label: '20 secondes', short: '20s', count: 4 },
		{ label: '10 secondes', short: '10s', count: 4 },
	];
	get allSeriesLabels() {
		const out = [];
		for (const g of this.seriesConfig)
			for (let i = 1; i <= g.count; i++)
				out.push(`Série ${i} (${g.short})`);
		return out;
	}
	rings = [
		{
			v: 1,
			bg: '#f0f0f0',
			bd: '#333',
			txt: '#222',
		},
		{
			v: 2,
			bg: '#e8e8e8',
			bd: '#333',
			txt: '#222',
		},
		{
			v: 3,
			bg: '#e0e0e0',
			bd: '#333',
			txt: '#222',
		},
		{
			v: 4,
			bg: '#d5d5d5',
			bd: '#333',
			txt: '#222',
		},
		{
			v: 5,
			bg: '#c8c8c8',
			bd: '#333',
			txt: '#222',
		},
		{
			v: 6,
			bg: '#b0b0b0',
			bd: '#333',
			txt: '#222',
		},
		{
			v: 7,
			bg: '#1a1a1a',
			bd: '#aaa',
			txt: '#eee',
		},
		{
			v: 8,
			bg: '#111',
			bd: '#aaa',
			txt: '#eee',
		},
		{
			v: 9,
			bg: '#090909',
			bd: '#aaa',
			txt: '#eee',
		},
		{
			v: 10,
			bg: '#050505',
			bd: '#e8c84a',
			txt: '#e8c84a',
		},
	];
	render(container) {
		container.innerHTML = '';
		this.rings.forEach((r, i) => {
			const size = ((10 - i) / 10) * 100;
			const d = document.createElement('div');
			d.setAttribute('data-value', r.v);
			d.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        border-radius:50%;width:${size}%;height:${size}%;
        background:${r.bg};border:1px solid ${r.bd};
        display:flex;justify-content:center;align-items:flex-start;padding-top:5px;
        font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:${r.txt};
        pointer-events:auto;cursor:crosshair;user-select:none;z-index:${i + 1};`;
			if (i < 9) d.textContent = r.v;
			container.appendChild(d);
		});
	}
}

export class TargetArc20m {
	id = 'arc_20m';
	name = 'Arc 20 m';
	distance = '20 m';
	shotsPerSerie = 3;
	seriesConfig = [{ label: 'Distance 20m', short: '20m', count: 10 }];
	get allSeriesLabels() {
		return Array.from({ length: 10 }, (_, i) => `Volée ${i + 1}`);
	}
	rings = [
		{
			v: 1,
			bg: '#d4d4d4',
			bd: '#999',
			txt: '#333',
		},
		{
			v: 2,
			bg: '#e8e8e8',
			bd: '#999',
			txt: '#333',
		},
		{
			v: 3,
			bg: '#1a1a1a',
			bd: '#555',
			txt: '#eee',
		},
		{
			v: 4,
			bg: '#111',
			bd: '#555',
			txt: '#eee',
		},
		{
			v: 5,
			bg: '#3a7bd5',
			bd: '#2558a8',
			txt: '#fff',
		},
		{
			v: 6,
			bg: '#4d8fe0',
			bd: '#2558a8',
			txt: '#fff',
		},
		{
			v: 7,
			bg: '#e03030',
			bd: '#a82020',
			txt: '#fff',
		},
		{
			v: 8,
			bg: '#e84848',
			bd: '#a82020',
			txt: '#fff',
		},
		{
			v: 9,
			bg: '#f5c842',
			bd: '#c9960a',
			txt: '#5a3a00',
		},
		{
			v: 10,
			bg: '#ffe066',
			bd: '#c9960a',
			txt: '#5a3a00',
		},
	];
	render(container) {
		container.innerHTML = '';
		this.rings.forEach((r, i) => {
			const size = ((10 - i) / 10) * 100;
			const d = document.createElement('div');
			d.setAttribute('data-value', r.v);
			d.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        border-radius:50%;width:${size}%;height:${size}%;
        background:${r.bg};border:1.5px solid ${r.bd};
        display:flex;justify-content:center;align-items:flex-start;padding-top:5px;
        font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:${r.txt};
        pointer-events:auto;cursor:crosshair;user-select:none;z-index:${i + 1};`;
			if (i < 9) d.textContent = r.v;
			container.appendChild(d);
		});
	}
}

export const TARGET_REGISTRY = [new TargetPistolet25m(), new TargetArc20m()];
