export class TargetPistol25m {
	id = "pistol_25m";
	name = "Pistolet 25m";
	distance = "25 m";
	shotsPerSerie = 5;

	seriesConfig = [
		{
			label: "Precision",
			short: "P",
			count: 4,
		},
		{
			label: "20 seconds",
			short: "20s",
			count: 4,
		},
		{
			label: "10 seconds",
			short: "10s",
			count: 4,
		},
	];

	get allSeriesLabels() {
		const out = [];
		for (const g of this.seriesConfig)
			for (let i = 1; i <= g.count; i++)
				out.push(`Series ${i} (${g.short})`);
		return out;
	}

	get rings() {
		return [
			{
				value: 1,
				bg: "#e8e8e8",
				border: "#bbb",
				text: "#333",
			},
			{
				value: 2,
				bg: "#e8e8e8",
				border: "#bbb",
				text: "#333",
			},
			{
				value: 3,
				bg: "#c0c0c0",
				border: "#999",
				text: "#222",
			},
			{
				value: 4,
				bg: "#c0c0c0",
				border: "#999",
				text: "#222",
			},
			{
				value: 5,
				bg: "#909090",
				border: "#666",
				text: "#111",
			},
			{
				value: 6,
				bg: "#909090",
				border: "#666",
				text: "#111",
			},
			{
				value: 7,
				bg: "#1c1c1c",
				border: "#555",
				text: "#dcdcdc",
			},
			{
				value: 8,
				bg: "#1c1c1c",
				border: "#555",
				text: "#dcdcdc",
			},
			{
				value: 9,
				bg: "#0a0a0a",
				border: "#444",
				text: "#dcdcdc",
			},
			{
				value: 10,
				bg: "#0a0a0a",
				border: "#CDA869",
				text: "#CDA869",
			},
		];
	}

	render(container) {
		container.innerHTML = "";
		this.rings.forEach((r, i) => {
			const size = ((10 - i) / 10) * 100;
			const d = document.createElement("div");
			d.setAttribute("data-value", r.value);
			d.style.cssText = `
position:absolute; top:50%; left:50%;
transform:translate(-50%,-50%);
border-radius:50%;
width:${size}%; height:${size}%;
background:${r.bg};
border:1.5px solid ${r.border};
display:flex; justify-content:center; align-items:flex-start;
padding-top:5px;
font-family:"DM Mono",monospace; font-size:12px; font-weight:500;
color:${r.text};
pointer-events:auto; cursor:crosshair;
user-select:none; z-index:${i + 1};
`;
			if (i < 9) d.textContent = r.value;
			container.appendChild(d);
		});
	}
}

export class TargetArchery20m {
	id = "archery_20m";
	name = "Arc Classique 20m";
	distance = "20 m";
	shotsPerSerie = 3;

	seriesConfig = [
		{
			label: "20m distance",
			short: "20m",
			count: 10,
		},
	];

	get allSeriesLabels() {
		return Array.from({ length: 10 }, (_, i) => `End ${i + 1}`);
	}

	get rings() {
		return [
			{
				value: 1,
				bg: "#e0e0e0",
				border: "#aaa",
				text: "#444",
			},
			{
				value: 2,
				bg: "#e0e0e0",
				border: "#aaa",
				text: "#444",
			},
			{
				value: 3,
				bg: "#1a1a1a",
				border: "#555",
				text: "#dcdcdc",
			},
			{
				value: 4,
				bg: "#1a1a1a",
				border: "#555",
				text: "#dcdcdc",
			},
			{
				value: 5,
				bg: "#3a7bd5",
				border: "#2255aa",
				text: "#fff",
			},
			{
				value: 6,
				bg: "#3a7bd5",
				border: "#2255aa",
				text: "#fff",
			},
			{
				value: 7,
				bg: "#d93030",
				border: "#a01818",
				text: "#fff",
			},
			{
				value: 8,
				bg: "#d93030",
				border: "#a01818",
				text: "#fff",
			},
			{
				value: 9,
				bg: "#f0c030",
				border: "#c09010",
				text: "#5a3a00",
			},
			{
				value: 10,
				bg: "#f0c030",
				border: "#c09010",
				text: "#5a3a00",
			},
		];
	}

	render(container) {
		container.innerHTML = "";
		this.rings.forEach((r, i) => {
			const size = ((10 - i) / 10) * 100;
			const d = document.createElement("div");
			d.setAttribute("data-value", r.value);
			d.style.cssText = `
position:absolute; top:50%; left:50%;
transform:translate(-50%,-50%);
border-radius:50%;
width:${size}%; height:${size}%;
background:${r.bg};
border:1.5px solid ${r.border};
display:flex; justify-content:center; align-items:flex-start;
padding-top:5px;
font-family:"DM Mono",monospace; font-size:12px; font-weight:500;
color:${r.text};
pointer-events:auto; cursor:crosshair;
user-select:none; z-index:${i + 1};
`;
			if (i < 9) d.textContent = r.value;
			else d.textContent = "X";
			container.appendChild(d);
		});
	}
}

export const TARGET_REGISTRY = [new TargetPistol25m(), new TargetArchery20m()];
