module.exports = {
	base: "/core/",
	dest: "./docs",
	evergreen: true,
	title: "Hitchy Manual",
	themeConfig: {
		sidebar: "auto",
		displayAllHeaders: true,
		repo: "hitchyjs/core",
		repoLabel: "Contribute!",
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Tutorials", link: "/tutorials/" },
			{ text: "API", items: [
					{ text: "Hitchy's API", link: "/api/hitchy" },
					{ text: "Plugins API", link: "/api/plugins" },
					{ text: "Core Components", link: "/api/components/" },
			] },
			{ text: "Internals", items: [
					{ text: "Architecture", link: "/internals/architecture-basics.html" },
					{ text: "Components", link: "/internals/components.html" },
					{ text: "Patterns", link: "/internals/patterns.html" },
					{ text: "Plugins", link: "/internals/bootstrap.html" },
					{ text: "Routing", link: "/internals/routing-basics.html" },
			] },
			{ text: "Hitchy", items: [
					{ text: "Core", link: "/" },
					{ text: "", items: [
							{ text: "Odem", link: "https://hitchyjs.github.io/plugin-odem/" },
							{ text: "Auth", link: "https://hitchyjs.github.io/plugin-auth/" },
						] }
				] },
		],
	},
};
