import { Html } from "./lib/html.js";

function makeTr() {
    return new Html("tr");
}

function makeTh(title) {
    return new Html("th").text(p(title));
}

function p(number) {
    return number == 10 ? "/" : number;
}

function makeTotal(results) {
    return results.one + results.two + results.three + results.four + results.five
}

function makeTotalAll(results) {
    return makeTotal(results.p_s__1) + makeTotal(results.p_s__2) + makeTotal(results.p_s__3) + makeTotal(results.p_s__4)
}

function buildSeries(parent, series) {
    for (let name in series) {
        console.log(name);
        const serie = series[name];
        const tr = makeTr()
            .append(makeTh(`Série ${serie.name}`))
            .append(makeTh(serie.one))
            .append(makeTh(serie.two))
            .append(makeTh(serie.three))
            .append(makeTh(serie.four))
            .append(makeTh(serie.five))
            .append(makeTh(serie.five));
        parent.append(tr);
        if (serie.isFull) {
            tr.append(makeTh(makeTotal(serie)).attr("rowspan", "2"))
        }
        if (name == "p_s__1") {
            tr.append(makeTh(makeTotalAll(series)).attr("rowspan", "12"))
        }
    }
}

function createATable(parent, results) {
    const tbody = new Html("tbody");
    const table = new Html("table").append(tbody);

    tbody
        .append(
            makeTr()
                .append(makeTh("Séries"))
                .append(makeTh("n°1"))
                .append(makeTh("n°2"))
                .append(makeTh("n°3"))
                .append(makeTh("n°4"))
                .append(makeTh("n°5"))
                .append(makeTh("Point/Séries"))
                .append(makeTh("Passes"))
                .append(makeTh("Total"))
        );

    buildSeries(tbody, results);

    table.appendTo(parent);
}

const list = {
    p_s__1: {
        isFull: true,
        name: "1 (P)",
        one: 7,
        two: 8,
        three: 7,
        four: 9,
        five: 10,
    },
    p_s__2: {
        isFull: false,
        name: "2 (P)",
        one: 7,
        two: 8,
        three: 7,
        four: 9,
        five: 10,
    },
    p_s__3: {
        isFull: true,
        name: "3 (P)",
        one: 7,
        two: 8,
        three: 7,
        four: 9,
        five: 10,
    },
    p_s__4: {
        isFull: false,
        name: "4 (P)",
        one: 7,
        two: 8,
        three: 7,
        four: 9,
        five: 10,
    },
}
createATable(document.body, list);