export class Html {
	constructor(target) {
		this.listeners = new Map();

		if (target instanceof Html) {
			this.elm = target.self();
		} else if (target instanceof HTMLElement) {
			this.elm = target;
		} else {
			const tag = target ?? "div";
			this.elm = document.createElement(tag);
		}
	}

	static from(target) {
		if (target instanceof Html) return target;
		if (
			(typeof target === "string" && target.includes(".")) ||
			(typeof target === "string" && target.includes("#"))
		)
			return Html.emmet(target);
		if (target instanceof HTMLElement) return new Html(target);
		if (typeof target === "number") return null;
		const elm = document.querySelector(target);
		return elm ? new Html(elm) : null;
	}

	static get(target) {
		return Html.from(target);
	}

	static qs(selector) {
		const elm = document.querySelector(selector);
		return elm ? new Html(elm) : null;
	}

	static qsa(selector) {
		return Array.from(document.querySelectorAll(selector)).map(
			(elm) => new Html(elm),
		);
	}

	qs(selector) {
		const elm = this.elm.querySelector(selector);
		if (!elm) return null;
		if (elm instanceof HTMLElement) return new Html(elm);

		const h = Object.create(Html.prototype);
		h.elm = elm;
		h.listeners = new Map();

		return h;
	}

	qsa(selector) {
		return Array.from(this.elm.querySelectorAll(selector)).map(
			(elm) => new Html(elm),
		);
	}

	find(target) {
		if (typeof target === "number") {
			return this.children()[target] ?? null;
		}
		if (target instanceof HTMLElement) return new Html(target);
		if (target instanceof Html) return target;
		return this.qs(target);
	}

	attr(name, value) {
		if (value === null) this.elm.removeAttribute(name);
		else if (value !== undefined) this.elm.setAttribute(name, value);
		return this;
	}

	dataset(key, value) {
		this.elm.dataset[key] = value;
		return this;
	}

	id(id) {
		this.elm.id = id;
		return this;
	}

	class(...classNames) {
		classNames.forEach((c) => this.elm.classList.toggle(c));
		return this;
	}

	classOn(...classNames) {
		classNames.forEach((c) => this.elm.classList.add(c));
		return this;
	}

	classOff(...classNames) {
		classNames.forEach((c) => this.elm.classList.remove(c));
		return this;
	}

	text(content, method = "content") {
		if (method === "inner") {
			this.elm.innerText = content;
		} else if (method === "outer") {
			this.elm.outerText = content;
		} else {
			this.elm.textContent = content;
		}
		return this;
	}

	html(content, method = "inner") {
		if (method === "outer") {
			this.elm.outerHTML = content;
		} else {
			this.elm.innerHTML = content;
		}
		return this;
	}

	getText(method = "content") {
		if (method === "inner") {
			return this.elm.innerText;
		} else if (method === "outer") {
			return this.elm.outerText;
		} else {
			return this.elm.textContent;
		}
	}

	getHtml(method = "inner") {
		return method === "inner" ? this.elm.innerHTML : this.elm.outerHTML;
	}

	children() {
		return Array.from(this.elm.children).map((c) => new Html(c));
	}

	firstChild() {
		return this.elm.firstElementChild
			? new Html(this.elm.firstElementChild)
			: null;
	}

	lastChild() {
		return this.elm.lastElementChild
			? new Html(this.elm.lastElementChild)
			: null;
	}

	parent() {
		return new Html(this.elm.parentElement);
	}

	append(child) {
		if (child instanceof Html) {
			this.elm.appendChild(child.elm);
		} else if (
			child instanceof HTMLElement ||
			child instanceof SVGElement
		) {
			this.elm.appendChild(child);
		} else {
			this.elm.appendChild(document.createTextNode(child));
		}
		return this;
	}

	appendMany(items) {
		items.forEach((e) => this.append(e));
		return this;
	}

	prepend(child) {
		if (child instanceof Html) this.elm.prepend(child.elm);
		else if (child instanceof HTMLElement) this.elm.prepend(child);
		else this.elm.prepend(document.createTextNode(child));
		return this;
	}

	prependMany(items) {
		items.forEach((e) => this.prepend(e));
		return this;
	}

	appendTo(target) {
		const parent = target instanceof Html ? target.elm : target;
		parent.appendChild(this.elm);
		return this;
	}

	on(type, listener, options) {
		this.elm.addEventListener(type, listener, options);
		this.listeners.set(type, listener);
		return this;
	}

	un(type) {
		const listener = this.listeners.get(type);
		if (listener) {
			this.elm.removeEventListener(type, listener);
			this.listeners.delete(type);
		}
		return this;
	}

	style(css) {
		this.elm.style.cssText += css;
		return this;
	}

	styleJs(styles) {
		Object.assign(this.elm.style, styles);
		return this;
	}

	swapRef(target) {
		const a = this.elm;
		const b = target.elm;
		const aNext = a.nextSibling === b ? a : a.nextSibling;
		b.parentNode?.insertBefore(a, b);
		a.parentNode?.insertBefore(b, aNext);
		return this;
	}

	cleanup() {
		this.elm.remove();
	}

	clear() {
		this.elm.innerHTML = "";
		return this;
	}

	focus() {
		this.elm.focus();
		return this;
	}

	self() {
		return this.elm;
	}

	// Component (STATIC)
	static input() {
		return new HtmlInput();
	}
}

export class HtmlInput extends Html {
	constructor(placeholder = "", value = "") {
		super("input");
		this.elm.type = "text";
		this.elm.autocomplete = "off";
		this.elm.spellcheck = false;
		this.elm.autofocus = true;
		this.elm.value = value;
		this.elm.placeholder = placeholder;
		this.class("prompt-input");
	}

	getValue() {
		return this.elm.value;
	}

	setValue(val) {
		this.elm.value = val;
		return this;
	}

	focus() {
		super.focus();
		return this;
	}

	onEnter(callback) {
		this.on("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				callback(this.getValue(), e);
			}
		});
		return this;
	}

	clear() {
		this.elm.value = "";
		return this;
	}
}
