let sAlert = window.parent.sAlert;
function setBackground() {
	let randomNumbers = [100-Math.abs(Math.floor(Math.random() * 200) - 99), 100-Math.abs(Math.floor(Math.random() * 200) - 99)];
	document.body.style.setProperty("--gradient-x", randomNumbers[0] + "%");
	document.body.style.setProperty("--gradient-y", randomNumbers[1] + "%");
	setTimeout(setBackground, 30000)
}
function loadPJS() {
	let div = document.createElement("div");
	div.id = "pjs";
	document.body.appendChild(div);
	let script = document.createElement("script");
	script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
	document.head.appendChild(script);
	script.addEventListener("load", ()=>{
		particlesJS.load('pjs', "/js/main-particlesjs-config.json", ()=>{});
	});
}

function cursor() {
	let cursor = document.createElement("div");
	cursor.style.cssText = "width:30px;height:30px;background-color:var(--color-1);position:fixed;border-radius:100%;filter:blur(50px);opacity:1;pointer-events:none;top:0;left:0;";
	document.body.appendChild(cursor);
	let rafId = null;
	document.addEventListener("mousemove", (e) => {
		if (rafId) return;
		rafId = requestAnimationFrame(() => {
			cursor.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
			rafId = null;
		});
	});
}
function themes() {
	document.body.setAttribute("theme", localStorage.getItem("selenite.theme") || "")
	if(document.body.getAttribute("theme") == "custom") {
		setTheme(JSON.parse(localStorage.getItem("selenite.customTheme")))
	}
}
function setTheme(arg) {
	let theme = arg;
	document.body.setAttribute("style", `
		--text-color: ${theme["text-color"]};
    	--bg-1: ${theme["bg-1"]};
    	--bg-2: ${theme["bg-2"]};
    	--color-1: ${theme["color-1"]};
    	--color-2: ${theme["color-2"]};
    	--color-3: ${theme["color-3"]};
    	--color-4: ${theme["color-4"]};	
	`)
}

async function caching() {
	if(sessionStorage.getItem("cdns")) return "done";
	let cdns = JSON.parse(atob("WyJodHRwczovL2NhY2hpbmcuZnJlZXRscy5mYXN0bHkubmV0IiwiaHR0cHM6Ly9jYWNoaW5nLmdsb2JhbC5zc2wuZmFzdGx5Lm5ldCJd"));
	let cfStatus = (await fetch("/alive.txt")).headers.get("Cf-Ray") != null;
	if(cfStatus) {
		localStorage.setItem("selenite.disableCDN", "true");
		return;
	}
	const results = await Promise.all(cdns.map(cdn =>
		fetch(cdn + "/alive.txt").then(r => r.text()).then(t => t.startsWith("yeah true") ? cdn : null).catch(() => null)
	));
	sessionStorage.setItem("cdns", JSON.stringify(results.filter(Boolean)));
	return;
}
function sendData() {
	let data = {
		cdns: JSON.parse(sessionStorage.getItem("cdns")),
		disableCDN: localStorage.getItem("selenite.disableCDN") ? true : false,
		type: 'localStorage'
	};
	if (navigator.serviceWorker.controller) {
    	navigator.serviceWorker.controller.postMessage(data);
  	} else {
    	navigator.serviceWorker.addEventListener('controllerchange', () => {
			if (navigator.serviceWorker.controller) {
				navigator.serviceWorker.controller.postMessage(data);
      		}
    	});
	}
}

document.addEventListener("DOMContentLoaded", async ()=>{
	if("serviceWorker" in navigator) {
		navigator.serviceWorker.register("/sw.js", { scope: '/' });
	}
	if(!(localStorage.getItem("selenite.fast-mode") == 'true')) {
		setBackground();
		loadPJS();
		cursor();
	}
	if(localStorage.getItem("selenite.super-fast-mode") == 'true') {
		document.body.setAttribute("fast", "")
	}
	themes();
	if(await caching() == "done") {
		sendData();
	}
})


let scrollRaf = null;
document.addEventListener("scroll", () => {
	if (scrollRaf) return;
	scrollRaf = requestAnimationFrame(() => {
		const pjs = document.getElementById("pjs");
		if (pjs) pjs.style.top = window.scrollY + "px";
		scrollRaf = null;
	});
});

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data.command === 'localStorage') {
			const data = localStorage.getItem(event.data.key);
			event.ports[0].postMessage({ data: data });
		}
	});
}


// var interval;
// document.addEventListener("DOMContentLoaded", function () {
// 	if (localStorage.getItem("theme")) {
// 		localStorage.setItem("selenite.theme", localStorage.getItem("theme"));
// 		localStorage.removeItem("theme");
// 	}
// 	if (localStorage.getItem("selenite.theme")) {
// 		document.body.setAttribute("theme", localStorage.getItem("selenite.theme"));
// 	} else {
// 		document.body.setAttribute("theme", "main");
// 	}
// 	if (document.querySelectorAll("[id=adcontainer]")) {
// 		for (let i = 0; i < document.querySelectorAll("[id=adcontainer]").length; i++) {
// 			if (Math.random() < 0.5 || localStorage.getItem("selenite.adblock") == "true") document.querySelectorAll("[id=adcontainer]")[i].innerHTML = "";
// 		}
// 	}
// 	const iconSetting = document.querySelector("input#discordIcon");
// 	const blockClose = document.querySelector("input#blockClose");
// 	const openBlank = document.getElementById("blank");
// 	const bgTheme = document.querySelector("input#bgTheme");
// 	// if (document.querySelector("widgetbot-crate")) {
// 	// 	if (localStorage.getItem("selenite.discordIcon") == "true") {
// 	// 		const widget = document.querySelector("widgetbot-crate");
// 	// 		widget.setAttribute("style", "display:none");
// 	// 	}
// 	// }
// 	if (document.querySelector("input#discordIcon")) {
// 		if (localStorage.getItem("selenite.discordIcon") == "true") {
// 			iconSetting.checked = true;
// 		}
// 		iconSetting.addEventListener("click", () => {
// 			localStorage.setItem("selenite.discordIcon", iconSetting.checked);
// 		});
// 	}
// 	if (document.querySelector("input#blockClose")) {
// 		if (localStorage.getItem("selenite.blockClose") == "true") {
// 			blockClose.checked = true;
// 		}
// 		blockClose.addEventListener("click", () => {
// 			localStorage.setItem("selenite.blockClose", blockClose.checked);
// 		});
// 	}
// 	if (document.querySelector("input#tabDisguise")) {
// 		if (localStorage.getItem("selenite.tabDisguise") == "true") {
// 			tabDisguise.checked = true;
// 		}
// 		tabDisguise.addEventListener("click", () => {
// 			localStorage.setItem("selenite.tabDisguise", tabDisguise.checked);
// 		});
// 	}
// 	if (document.querySelector("input#bgTheme")) {
// 		bgTheme.checked = true;
// 	}
// 	document.getElementById("blank").addEventListener("click", () => {
// 		win = window.open();
// 		win.document.body.style.margin = "0";
// 		win.document.body.style.height = "100vh";
// 		html = `
//         <style>*{margin:0;padding:0;border:none}body,iframe{height:100vh;width:100vw}iframe{height:96vh}header{display:flex;height:4vh;justify-content:center;}button{margin-right:100px;height:100%;aspect-ratio: 1 / 1}#reload{background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z'/%3E%3C/svg%3E");background-size:cover;}#goBack{background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z'/%3E%3C/svg%3E");background-size:cover;}</style><script>
//         </script><header><button id=goBack></button><button id=reload></button></header><iframe id=selenite></iframe>`;
// 		win.document.querySelector("html").innerHTML = html;
// 		win.eval(`let selenite = document.getElementById("selenite");console.log(selenite);selenite.setAttribute("src", "${location.origin}");console.log(selenite);document.getElementById("goBack").addEventListener("click", function () {selenite.contentDocument.location.href = selenite.contentDocument.location.origin;});document.getElementById("reload").addEventListener("click", function () {selenite.contentDocument.location.href = selenite.contentDocument.location.href;})`);
// 		location.href = "https://google.com";
// 		close();
// 	});
// 	if ($("#panicmode").length > 0) {
// 		$("#panicmode").prop({ href: panicurl });
// 	}
// 	if ($(".seleniteminified").length > 0) {
// 		$.get("https://raw.githubusercontent.com/skysthelimitt/selenite-optimized/main/build/bookmark.txt", function (data) {
// 			$(".seleniteminified").prop({ href: data });
// 		});
// 		$.get("https://raw.githubusercontent.com/car-axle-client/car-axle-client/v10/dist/build.js", function (data) {
// 			$(".caraxle").prop({ href: `javascript:${encodeURI(data)}` });
// 		});
// 	}
// });
// function setPanicMode() {
// 	if (!$("#panic").val().startsWith("https")) {
// 		document.cookie = "panicurl=https://" + $("#panic").val();
// 		return;
// 	}

// 	document.cookie = "panicurl=" + $("#panic").val();
// }
// function copyToClipboard(text) {
// 	navigator.clipboard.writeText(text);
// 	alert("Copied text!");
// }
// function setTheme(theme) {
// 	localStorage.setItem("selenite.theme", theme);
// 	document.body.setAttribute("theme", theme);
// 	if (theme != "custom") {
// 		document.getElementById("customMenu").style.display = "none";
// 		document.body.style = "";
// 	}
// }
// function setPanicMode() {
// 	if (!$("#panic").val().startsWith("https")) {
// 		document.cookie = "panicurl=https://" + $("#panic").val();
// 		return;
// 	}
// 	document.cookie = "panicurl=" + $("#panic").val();
// }
// function setPassword() {
// 	localStorage.setItem("selenite.password", enc.encode(document.getElementById("pass").value));
// }
// function delPassword() {
// 	location.hash = "";
// 	localStorage.removeItem("selenite.passwordAtt");
// 	localStorage.removeItem("selenite.password");
// }

// $(document).ready(function () {
// 	if (!window.location.href.startsWith("about:")) {
// 		$("#webicon").attr("placeholder", window.location.href.replace(/\/[^\/]*$/, "/"));
// 	}
// });
// function loadScript(a, b) {
// 	var c = document.createElement("script");
// 	(c.type = "text/javascript"), (c.src = a), (c.onload = b), document.head.appendChild(c);
// }
// function toast(message, onclick) {
// 	const toast = document.createElement("div");
// 	toast.setAttribute("id", "toast");
// 	console.log(message.time);
// 	toast.innerHTML = `<div class=samerow><h1>${message.title}${message.time ? ` - ${timeAgo(new Date(message.time * 1000))}` : ""}</h1></div><p>${message.message}</p>`;
// 	toast.style.animation = "toastFade 6s";
// 	document.body.appendChild(toast);
// 	if (onclick) {
// 		toast.addEventListener("click", onclick);
// 		toast.style.cursor = "pointer";
// 	}
// 	setTimeout(() => {
// 		toast.remove();
// 	}, 6000);
// }
// function timeAgo(input) {
// 	const date = input instanceof Date ? input : new Date(input);
// 	const formatter = new Intl.RelativeTimeFormat("en");
// 	const ranges = {
// 		years: 3600 * 24 * 365,
// 		months: 3600 * 24 * 30,
// 		weeks: 3600 * 24 * 7,
// 		days: 3600 * 24,
// 		hours: 3600,
// 		minutes: 60,
// 		seconds: 1,
// 	};
// 	const secondsElapsed = (date.getTime() - Date.now()) / 1000;
// 	for (let key in ranges) {
// 		if (ranges[key] < Math.abs(secondsElapsed)) {
// 			const delta = secondsElapsed / ranges[key];
// 			return formatter.format(Math.round(delta), key);
// 		}
// 	}
// }
// let cookieConsentScript = document.createElement("script");
// cookieConsentScript.src = "/js/cookieConsent.js";
// document.head.appendChild(cookieConsentScript);
// let cookieConsentStyle = document.createElement("link");
// cookieConsentStyle.href = "/js/cookieConsent.css";
// cookieConsentStyle.rel = "stylesheet";
// document.head.appendChild(cookieConsentStyle);