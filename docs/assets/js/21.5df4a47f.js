(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{119:function(t,e,s){"use strict";s.r(e);var r=s(0),a=Object(r.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"tutorial-hello-world"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#tutorial-hello-world"}},[t._v("#")]),t._v(" Tutorial: Hello World!")]),t._v(" "),s("h2",{attrs:{id:"prerequisites"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#prerequisites"}},[t._v("#")]),t._v(" Prerequisites")]),t._v(" "),s("p",[t._v("Hitchy is implemented in Javascript and requires "),s("a",{attrs:{href:"https://nodejs.org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Node.js"),s("OutboundLink")],1),t._v(" as a runtime. In addition it relies on a tool called "),s("a",{attrs:{href:"https://www.npmjs.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("npm"),s("OutboundLink")],1),t._v(" which is used to access a vast amount of packages ready for use. Hitchy is just one of those. This tool is included with Node.js.")]),t._v(" "),s("h2",{attrs:{id:"create-project"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#create-project"}},[t._v("#")]),t._v(" Create Project")]),t._v(" "),s("ul",[s("li",[t._v("Create and enter folder for your project: "),s("code",[t._v("mkdir hello-world && cd hello-world")])]),t._v(" "),s("li",[t._v("Install Hitchy: "),s("code",[t._v("npm i hitchy")])])]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("Information")]),t._v(" "),s("p",[t._v("You might want to run "),s("code",[t._v("npm init")]),t._v(" before installing Hitchy to start with a proper description of your project capable of tracking all its dependencies.")])]),t._v(" "),s("h2",{attrs:{id:"configure-router"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#configure-router"}},[t._v("#")]),t._v(" Configure Router")]),t._v(" "),s("p",[t._v("Create a sub-folder named "),s("strong",[t._v("config")]),t._v(". Put a file named "),s("strong",[t._v("routes.js")]),t._v(" with the following content there:")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("exports"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("routes "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("req"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("send")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello World!"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("div",{staticClass:"custom-block warning"},[s("p",{staticClass:"custom-block-title"},[t._v("Important")]),t._v(" "),s("p",[t._v("The file's name doesn't matter much. The key "),s("code",[t._v("routes")]),t._v(" used for exporting in first line of file's content is essential though. We suggest name the file just like the exported configuration key to support long-term maintenance of code.")])]),t._v(" "),s("h2",{attrs:{id:"run-project"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#run-project"}},[t._v("#")]),t._v(" Run Project")]),t._v(" "),s("p",[t._v("When in project folder enter")]),t._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[t._v("hitchy start\n")])])]),s("p",[t._v("for running the project. This will display some URL to be opened in a web browser, like "),s("a",{attrs:{href:"http://127.0.0.1:3000",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://127.0.0.1:3000"),s("OutboundLink")],1),t._v(". Click on the URL or copy-n-paste it into your browser to get the desired output.")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("Stopping Hitchy")]),t._v(" "),s("p",[t._v("After starting hitchy the service is running in foreground. Log messages are printed on screen. If you want to stop hitchy just press Ctrl+C. This will gracefully shut down Hitchy.")])])])}),[],!1,null,null,null);e.default=a.exports}}]);