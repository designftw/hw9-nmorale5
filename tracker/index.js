import Backend from "https://madata.dev/src/index.js";

let backend = Backend.from("https://github.com/designftw/hw9-nmorale5/tracker/data.json");

globalThis.backend = backend;

let $$ = (selector, container = document) => Array.from(container.querySelectorAll(selector));
let $ = (selector, container = document) => container.querySelector(selector);

// Get references to DOM elements
export const dom = {
	app: $("#app"),
	saveButton: $("#save_button"),
	addEntryButton: $("#add_entry_button"),
	loginButton: $("#login_button"),
	logoutButton: $("#logout_button"),
	userName: $("#user_name"),
	userAvatar: $("#user_avatar"),
	tracker: $("#tracker"),
};

dom.saveButton.addEventListener("click", event => {
	let dataToSave = $$(".entry > form").map(form => {
		let data = new FormData(form);
		return Object.fromEntries(data.entries());
	});

	data.innerHTML = JSON.stringify(dataToSave, null, "\t");
});

dom.addEntryButton.addEventListener("click", event => {
	// Set current date and time as default
	let currentISODate = new Date().toISOString().substring(0, 19); // drop ms and timezone
	addEntry({datetime: currentISODate});
});

dom.loginButton.addEventListener("click", async e => {
	let user = await backend.login();
	if (user) {
		dom.app.classList.add("logged-in");
		dom.userName.textContent = user.name;
		dom.userAvatar.src = user.avatar;
	}
});

dom.logoutButton.addEventListener("click", e => {
	dom.app.classList.remove("logged-in");
	backend.logout();
});

function addEntry(data) {
	let entry = entry_template.content.cloneNode(true);

	for (let prop in data) {
		console.log(prop)
		setFormElement(prop, data[prop], entry);
	}

	// Add new entry after "Add entry" button
	dom.addEntryButton.after(entry);
}

function setFormElement(name, value, container) {
	let elements = $$(`[name="${name}"]`, container);

	for (let element of elements) { // only radios will have more than one, but can't hurt
		if (element.type === "checkbox") {
			element.checked = value;
		}
		if (element.type === "radio") {
			element.checked = element.value === value;
		}
		else {
			element.value = value;
		}
	}
}

async function setupData() {
	dom.app.classList.add("loading");
	dom.tracker.disabled = true;
	let storedData = await backend.load();
	console.log(storedData)
	for (let entry of storedData) {
		addEntry(entry);
	}
	dom.app.classList.remove("loading");
	dom.tracker.disabled = false;
}

setupData();