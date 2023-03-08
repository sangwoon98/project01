﻿/*
 Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
*/
(function () {
	function r(a) {
		if (!a) throw "Languages-by-groups list are required for construct selectbox";
		var c = [],
			d = "",
			e;
		for (e in a)
			for (var g in a[e]) {
				var h = a[e][g];
				"en_US" == h ? (d = h) : c.push(h);
			}
		c.sort();
		d && c.unshift(d);
		return {
			getCurrentLangGroup: function (c) {
				a: {
					for (var d in a)
						for (var g in a[d])
							if (g.toUpperCase() === c.toUpperCase()) {
								c = d;
								break a;
							}
					c = "";
				}
				return c;
			},
			setLangList: (function () {
				var c = {},
					d;
				for (d in a) for (var g in a[d]) c[a[d][g]] = g;
				return c;
			})(),
		};
	}
	var f = (function () {
			var a = function (a, b, e) {
				var e = e || {},
					g = e.expires;
				if ("number" == typeof g && g) {
					var h = new Date();
					h.setTime(h.getTime() + 1e3 * g);
					g = e.expires = h;
				}
				g && g.toUTCString && (e.expires = g.toUTCString());
				var b = encodeURIComponent(b),
					a = a + "=" + b,
					f;
				for (f in e) (b = e[f]), (a += "; " + f), !0 !== b && (a += "=" + b);
				document.cookie = a;
			};
			return {
				postMessage: {
					init: function (a) {
						document.addEventListener
							? window.addEventListener("message", a, !1)
							: window.attachEvent("onmessage", a);
					},
					send: function (a) {
						var b = a.fn || null,
							e = a.id || "",
							g = a.target || window,
							h = a.message || { id: e };
						"[object Object]" == Object.prototype.toString.call(a.message) &&
							(a.message.id || (a.message.id = e), (h = a.message));
						a = window.JSON.stringify(h, b);
						g.postMessage(a, "*");
					},
				},
				hash: { create: function () {}, parse: function () {} },
				cookie: {
					set: a,
					get: function (a) {
						return (a = document.cookie.match(
							RegExp(
								"(?:^|; )" +
									a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
									"=([^;]*)"
							)
						))
							? decodeURIComponent(a[1])
							: void 0;
					},
					remove: function (c) {
						a(c, "", { expires: -1 });
					},
				},
			};
		})(),
		a = a || {};
	a.TextAreaNumber = null;
	a.load = !0;
	a.cmd = { SpellTab: "spell", Thesaurus: "thes", GrammTab: "grammar" };
	a.dialog = null;
	a.optionNode = null;
	a.selectNode = null;
	a.grammerSuggest = null;
	a.textNode = {};
	a.iframeMain = null;
	a.dataTemp = "";
	a.div_overlay = null;
	a.textNodeInfo = {};
	a.selectNode = {};
	a.selectNodeResponce = {};
	a.selectingLang = a.currentLang;
	a.langList = null;
	a.langSelectbox = null;
	a.banner = "";
	a.show_grammar = null;
	a.div_overlay_no_check = null;
	a.wsc_customerId = CKEDITOR.config.wsc_customerId;
	a.cust_dic_ids = CKEDITOR.config.wsc_customDictionaryIds;
	a.userDictionaryName = CKEDITOR.config.wsc_userDictionaryName;
	a.defaultLanguage = CKEDITOR.config.defaultLanguage;
	a.targetFromFrame = {};
	a.onLoadOverlay = null;
	a.LocalizationComing = {};
	a.OverlayPlace = null;
	a.LocalizationButton = {
		ChangeTo: { instance: null, text: "Change to" },
		ChangeAll: { instance: null, text: "Change All" },
		IgnoreWord: { instance: null, text: "Ignore word" },
		IgnoreAllWords: { instance: null, text: "Ignore all words" },
		Options: {
			instance: null,
			text: "Options",
			optionsDialog: { instance: null },
		},
		AddWord: { instance: null, text: "Add word" },
		FinishChecking: { instance: null, text: "Finish Checking" },
	};
	a.LocalizationLabel = {
		ChangeTo: { instance: null, text: "Change to" },
		Suggestions: { instance: null, text: "Suggestions" },
	};
	var s = function (b) {
			for (var c in b) b[c].instance.getElement().setText(a.LocalizationComing[c]);
		},
		t = function (b) {
			for (var c in b) {
				if (!b[c].instance.setLabel) break;
				b[c].instance.setLabel(a.LocalizationComing[c]);
			}
		},
		j,
		k;
	a.framesetHtml = function (b) {
		return (
			'<iframe src="' +
			a.templatePath +
			a.serverLocation +
			'" id=' +
			a.iframeNumber +
			"_" +
			b +
			' frameborder="0" allowtransparency="1" style="width:100%;border: 1px solid #AEB3B9;overflow: auto;background:#fff; border-radius: 3px;"></iframe>'
		);
	};
	a.setIframe = function (b, c) {
		var d = a.framesetHtml(c);
		return b.getElement().setHtml(d);
	};
	a.setCurrentIframe = function (b) {
		a.setIframe(a.dialog._.contents[b].Content, b);
	};
	a.setHeightBannerFrame = function () {
		var b = a.dialog.getContentElement("SpellTab", "banner").getElement(),
			c = a.dialog.getContentElement("GrammTab", "banner").getElement(),
			d = a.dialog.getContentElement("Thesaurus", "banner").getElement();
		b.setStyle("height", "90px");
		c.setStyle("height", "90px");
		d.setStyle("height", "90px");
	};
	a.setHeightFrame = function () {
		document.getElementById(
			a.iframeNumber + "_" + a.dialog._.currentTabId
		).style.height = "240px";
	};
	a.sendData = function (b) {
		var c = b._.currentTabId,
			d = b._.contents[c].Content,
			e,
			g;
		a.setIframe(d, c);
		b.parts.tabs.removeAllListeners();
		b.parts.tabs.on("click", function (h) {
			h = h || window.event;
			h.data.getTarget().is("a") &&
				c != b._.currentTabId &&
				((c = b._.currentTabId),
				(d = b._.contents[c].Content),
				(e = a.iframeNumber + "_" + c),
				a.div_overlay.setEnable(),
				d.getElement().getChildCount()
					? o(a.targetFromFrame[e], a.cmd[c])
					: (a.setIframe(d, c),
					  (g = document.getElementById(e)),
					  (a.targetFromFrame[e] = g.contentWindow)));
		});
	};
	a.buildSelectLang = function () {
		var b = new CKEDITOR.dom.element("div"),
			c = new CKEDITOR.dom.element("select"),
			d = "wscLang" + a.CKNumber;
		b.addClass("cke_dialog_ui_input_select");
		b.setAttribute("role", "presentation");
		b.setStyles({
			height: "auto",
			position: "absolute",
			right: "0",
			top: "-1px",
			width: "160px",
			"white-space": "normal",
		});
		c.setAttribute("id", d);
		c.addClass("cke_dialog_ui_input_select");
		c.setStyles({ width: "160px" });
		b.append(c);
		return b;
	};
	a.buildOptionLang = function (b) {
		var c = document.getElementById("wscLang" + a.CKNumber),
			d = document.createDocumentFragment(),
			e,
			g = [];
		if (0 === c.options.length) {
			for (e in b) g.push([e, b[e]]);
			g.sort();
			for (var h = 0; h < g.length; h++)
				(b = document.createElement("option")),
					b.setAttribute("value", g[h][1]),
					(e = document.createTextNode(g[h][0])),
					b.appendChild(e),
					g[h][1] == a.selectingLang && b.setAttribute("selected", "selected"),
					d.appendChild(b);
			c.appendChild(d);
		}
	};
	a.buildOptionSynonyms = function (b) {
		b = a.selectNodeResponce[b];
		a.selectNode.synonyms.clear();
		for (var c = 0; c < b.length; c++) a.selectNode.synonyms.add(b[c], b[c]);
		a.selectNode.synonyms.getInputElement().$.firstChild.selected = !0;
		a.textNode.Thesaurus.setValue(
			a.selectNode.synonyms.getInputElement().getValue()
		);
	};
	var l = function (a) {
			var c = document,
				d = a.target || c.body,
				e = a.id || "overlayBlock",
				g = a.opacity || "0.9",
				a = a.background || "#f1f1f1",
				h = c.getElementById(e),
				f = h || c.createElement("div");
			f.style.cssText =
				"position: absolute;top:30px;bottom:40px;left:1px;right:1px;z-index: 10020;padding:0;margin:0;background:" +
				a +
				";opacity: " +
				g +
				";filter: alpha(opacity=" +
				100 * g +
				");display: none;";
			f.id = e;
			h || d.appendChild(f);
			return {
				setDisable: function () {
					f.style.display = "none";
				},
				setEnable: function () {
					f.style.display = "block";
				},
			};
		},
		u = function (b, c, d) {
			var e = new CKEDITOR.dom.element("div"),
				g = new CKEDITOR.dom.element("input"),
				h = new CKEDITOR.dom.element("label"),
				f = "wscGrammerSuggest" + b + "_" + c;
			e.addClass("cke_dialog_ui_input_radio");
			e.setAttribute("role", "presentation");
			e.setStyles({ width: "97%", padding: "5px", "white-space": "normal" });
			g.setAttributes({
				type: "radio",
				value: c,
				name: "wscGrammerSuggest",
				id: f,
			});
			g.setStyles({ float: "left" });
			g.on("click", function (b) {
				a.textNode.GrammTab.setValue(b.sender.getValue());
			});
			d && g.setAttribute("checked", !0);
			g.addClass("cke_dialog_ui_radio_input");
			h.appendText(b);
			h.setAttribute("for", f);
			h.setStyles({
				display: "block",
				"line-height": "16px",
				"margin-left": "18px",
				"white-space": "normal",
			});
			e.append(g);
			e.append(h);
			return e;
		},
		q = function (b) {
			var c = new r(b),
				b = document.getElementById("wscLang" + a.CKNumber),
				d = a.iframeNumber + "_" + a.dialog._.currentTabId;
			a.buildOptionLang(c.setLangList);
			p[c.getCurrentLangGroup(a.selectingLang)]();
			b.onchange = function () {
				p[c.getCurrentLangGroup(this.value)]();
				a.div_overlay.setEnable();
				a.selectingLang = this.value;
				f.postMessage.send({
					message: { changeLang: a.selectingLang, text: a.dataTemp },
					target: a.targetFromFrame[d],
					id: "selectionLang_outer__page",
				});
			};
		},
		v = function (b) {
			if ("no_any_suggestions" == b) {
				b = "No suggestions";
				a.LocalizationButton.ChangeTo.instance.disable();
				a.LocalizationButton.ChangeAll.instance.disable();
				var c = function (b) {
					b = a.LocalizationButton[b].instance;
					b.getElement().hasClass("cke_disabled")
						? b.getElement().setStyle("color", "#a0a0a0")
						: b.disable();
				};
				c("ChangeTo");
				c("ChangeAll");
			} else
				a.LocalizationButton.ChangeTo.instance.enable(),
					a.LocalizationButton.ChangeAll.instance.enable(),
					a.LocalizationButton.ChangeTo.instance
						.getElement()
						.setStyle("color", "#333"),
					a.LocalizationButton.ChangeAll.instance
						.getElement()
						.setStyle("color", "#333");
			return b;
		},
		w = {
			iframeOnload: function () {
				a.div_overlay.setEnable();
				var b = a.dialog._.currentTabId;
				o(a.targetFromFrame[a.iframeNumber + "_" + b], a.cmd[b]);
			},
			suggestlist: function (b) {
				delete b.id;
				a.div_overlay_no_check.setDisable();
				m();
				q(a.langList);
				"false" == a.show_grammar && n();
				var c = v(b.word),
					d = "";
				c instanceof Array && (c = b.word[0]);
				d = c = c.split(",");
				k.clear();
				a.textNode.SpellTab.setValue(d[0]);
				for (b = 0; b < d.length; b++) k.add(d[b], d[b]);
				i();
				a.div_overlay.setDisable();
			},
			grammerSuggest: function (b) {
				delete b.id;
				delete b.mocklangs;
				m();
				var c = b.grammSuggest[0];
				a.grammerSuggest.getElement().setHtml("");
				a.textNode.GrammTab.reset();
				a.textNode.GrammTab.setValue(c);
				a.textNodeInfo.GrammTab.getElement().setHtml("");
				a.textNodeInfo.GrammTab.getElement().setText(b.info);
				for (var b = b.grammSuggest, c = b.length, d = !0, e = 0; e < c; e++)
					a.grammerSuggest.getElement().append(u(b[e], b[e], d)), (d = !1);
				i();
				a.div_overlay.setDisable();
			},
			thesaurusSuggest: function (b) {
				delete b.id;
				delete b.mocklangs;
				m();
				a.selectNodeResponce = b;
				a.textNode.Thesaurus.reset();
				a.selectNode.categories.clear();
				for (var c in b) a.selectNode.categories.add(c, c);
				b = a.selectNode.categories.getInputElement().getChildren().$[0].value;
				a.selectNode.categories.getInputElement().getChildren().$[0].selected = !0;
				a.buildOptionSynonyms(b);
				i();
				a.div_overlay.setDisable();
			},
			finish: function (b) {
				delete b.id;
				a.dialog
					.getContentElement(a.dialog._.currentTabId, "bottomGroup")
					.getElement()
					.hide();
				a.dialog
					.getContentElement(a.dialog._.currentTabId, "BlockFinishChecking")
					.getElement()
					.show();
				a.div_overlay.setDisable();
			},
			settext: function (b) {
				delete b.id;
				a.dialog.getParentEditor().focus();
				a.dialog.getParentEditor().setData(b.text, (a.dataTemp = ""));
				a.dialog.hide();
			},
			ReplaceText: function (b) {
				delete b.id;
				a.div_overlay.setEnable();
				a.dataTemp = b.text;
				a.selectingLang = b.currentLang;
				window.setTimeout(function () {
					a.div_overlay.setDisable();
				}, 500);
				s(a.LocalizationButton);
				t(a.LocalizationLabel);
			},
			options_checkbox_send: function (b) {
				delete b.id;
				b = {
					osp: f.cookie.get("osp"),
					udn: f.cookie.get("udn"),
					cust_dic_ids: a.cust_dic_ids,
				};
				f.postMessage.send({
					message: b,
					target: a.targetFromFrame[a.iframeNumber + "_" + a.dialog._.currentTabId],
					id: "options_outer__page",
				});
			},
			getOptions: function (b) {
				var c = b.DefOptions.udn;
				a.LocalizationComing = b.DefOptions.localizationButtonsAndText;
				a.show_grammar = b.show_grammar;
				a.langList = b.lang;
				if ((a.bnr = b.bannerId)) {
					a.setHeightBannerFrame();
					var d = b.banner;
					a.dialog
						.getContentElement(a.dialog._.currentTabId, "banner")
						.getElement()
						.setHtml(d);
				} else a.setHeightFrame();
				"false" == a.show_grammar && n();
				"undefined" == c &&
					(a.userDictionaryName
						? ((c = a.userDictionaryName),
						  (d = {
								osp: f.cookie.get("osp"),
								udn: a.userDictionaryName,
								cust_dic_ids: a.cust_dic_ids,
								id: "options_dic_send",
								udnCmd: "create",
						  }),
						  f.postMessage.send({ message: d, target: a.targetFromFrame[void 0] }))
						: (c = ""));
				f.cookie.set("osp", b.DefOptions.osp);
				f.cookie.set("udn", c);
				f.cookie.set("cust_dic_ids", b.DefOptions.cust_dic_ids);
				f.postMessage.send({ id: "giveOptions" });
			},
			options_dic_send: function () {
				var b = {
					osp: f.cookie.get("osp"),
					udn: f.cookie.get("udn"),
					cust_dic_ids: a.cust_dic_ids,
					id: "options_dic_send",
					udnCmd: f.cookie.get("udnCmd"),
				};
				f.postMessage.send({
					message: b,
					target: a.targetFromFrame[a.iframeNumber + "_" + a.dialog._.currentTabId],
				});
			},
			data: function (a) {
				delete a.id;
			},
			giveOptions: function () {},
			setOptionsConfirmF: function () {},
			setOptionsConfirmT: function () {
				j.setValue("");
			},
			clickBusy: function () {
				a.div_overlay.setEnable();
			},
			suggestAllCame: function () {
				a.div_overlay.setDisable();
				a.div_overlay_no_check.setDisable();
			},
			TextCorrect: function () {
				q(a.langList);
			},
		},
		x = function (a) {
			a = a || window.event;
			a = window.JSON.parse(a.data);
			w[a.id](a);
		},
		o = function (b, c, d, e) {
			c = c || CKEDITOR.config.wsc_cmd || "spell";
			d = d || a.dataTemp;
			f.postMessage.send({
				message: {
					customerId: a.wsc_customerId,
					text: d,
					txt_ctrl: a.TextAreaNumber,
					cmd: c,
					cust_dic_ids: a.cust_dic_ids,
					udn: a.userDictionaryName,
					slang: a.selectingLang,
					reset_suggest: e || !1,
				},
				target: b,
				id: "data_outer__page",
			});
			a.div_overlay.setEnable();
		},
		p = {
			superset: function () {
				a.dialog.showPage("Thesaurus");
				a.dialog.showPage("GrammTab");
				a.dialog.showPage("SpellTab");
			},
			usual: function () {
				a.dialog.hidePage("Thesaurus");
				n();
				a.dialog.showPage("SpellTab");
			},
		},
		y = function (b) {
			var c = new (function (a) {
				var b = {};
				return {
					getCmdByTab: function (c) {
						for (var h in a) b[a[h]] = h;
						return b[c];
					},
				};
			})(a.cmd);
			b.selectPage(c.getCmdByTab(CKEDITOR.config.wsc_cmd));
			a.sendData(b);
		},
		n = function () {
			a.dialog.hidePage("GrammTab");
		},
		i = function () {
			a.dialog
				.getContentElement(a.dialog._.currentTabId, "bottomGroup")
				.getElement()
				.show();
		},
		m = function () {
			a.dialog
				.getContentElement(a.dialog._.currentTabId, "BlockFinishChecking")
				.getElement()
				.hide();
		};
	a.CKNumber = CKEDITOR.tools.getNextNumber();
	CKEDITOR.dialog.add("checkspell", function (b) {
		var c = function () {
				a.div_overlay.setEnable();
				var c = a.dialog._.currentTabId,
					d = a.iframeNumber + "_" + c,
					e = a.textNode[c].getValue();
				f.postMessage.send({
					message: {
						cmd: this.getElement().getAttribute("title-cmd"),
						tabId: c,
						new_word: e,
					},
					target: a.targetFromFrame[d],
					id: "cmd_outer__page",
				});
				"FinishChecking" == this.getElement().getAttribute("title-cmd") &&
					b.config.wsc_onFinish.call(CKEDITOR.document.getWindow().getFrame());
			},
			d =
				"file:" == document.location.protocol
					? "http:"
					: document.location.protocol,
			e =
				CKEDITOR.config.wsc_customLoaderScript ||
				d +
					"//loader.webspellchecker.net/sproxy_fck/sproxy.php?plugin=fck2&customerid=" +
					CKEDITOR.config.wsc_customerId +
					"&cmd=script&doc=wsc&schema=22";
		return {
			title: b.config.wsc_dialogTitle || b.lang.wsc.title,
			minWidth: 560,
			minHeight: 444,
			buttons: [CKEDITOR.dialog.cancelButton],
			onShow: function () {
				a.dialog = this;
				a.TextAreaNumber = "cke_textarea_" + CKEDITOR.currentInstance.name;
				f.postMessage.init(x);
				a.dataTemp = CKEDITOR.currentInstance.getData();
				a.OverlayPlace = a.dialog.parts.tabs.getParent().$;
				CKEDITOR.scriptLoader.load(e, function (c) {
					CKEDITOR.config && CKEDITOR.config.wsc && CKEDITOR.config.wsc.DefaultParams
						? ((a.serverLocationHash = CKEDITOR.config.wsc.DefaultParams.serviceHost),
						  (a.logotype = CKEDITOR.config.wsc.DefaultParams.logoPath),
						  (a.loadIcon = CKEDITOR.config.wsc.DefaultParams.iconPath),
						  (a.loadIconEmptyEditor =
								CKEDITOR.config.wsc.DefaultParams.iconPathEmptyEditor),
						  (a.LangComparer =
								new CKEDITOR.config.wsc.DefaultParams._SP_FCK_LangCompare()))
						: ((a.serverLocationHash = DefaultParams.serviceHost),
						  (a.logotype = DefaultParams.logoPath),
						  (a.loadIcon = DefaultParams.iconPath),
						  (a.loadIconEmptyEditor = DefaultParams.iconPathEmptyEditor),
						  (a.LangComparer = new _SP_FCK_LangCompare()));
					a.pluginPath = CKEDITOR.getUrl(b.plugins.wsc.path);
					a.iframeNumber = a.TextAreaNumber;
					a.serverLocation = "#server=" + a.serverLocationHash;
					a.templatePath = a.pluginPath + "dialogs/tmp.html";
					a.LangComparer.setDefaulLangCode(a.defaultLanguage);
					a.currentLang =
						b.config.wsc_lang || a.LangComparer.getSPLangCode(b.langCode);
					a.div_overlay = new l({
						opacity: "1",
						background: "#fff url(" + a.loadIcon + ") no-repeat 50% 50%",
						target: a.OverlayPlace,
					});
					var d = CKEDITOR.document.getById("cke_dialog_tabs_" + (a.CKNumber + 1));
					d.setStyle("width", "97%");
					d.getElementsByTag("DIV").count() || d.append(a.buildSelectLang());
					a.div_overlay_no_check = new l({
						opacity: "1",
						id: "no_check_over",
						background: "#fff url(" + a.loadIconEmptyEditor + ") no-repeat 50% 50%",
						target: a.OverlayPlace,
					});
					c && (y(a.dialog), a.dialog.setupContent(a.dialog));
				});
			},
			onHide: function () {
				a.dataTemp = "";
			},
			contents: [
				{
					id: "SpellTab",
					label: "SpellChecker",
					accessKey: "S",
					elements: [
						{
							type: "html",
							id: "banner",
							label: "banner",
							style: "",
							html: "<div></div>",
						},
						{
							type: "html",
							id: "Content",
							label: "spellContent",
							html: "",
							setup: function (b) {
								var b = a.iframeNumber + "_" + b._.currentTabId,
									c = document.getElementById(b);
								a.targetFromFrame[b] = c.contentWindow;
							},
						},
						{
							type: "hbox",
							id: "bottomGroup",
							style: "width:560px; margin: 0 auto;",
							widths: ["50%", "50%"],
							children: [
								{
									type: "hbox",
									id: "leftCol",
									align: "left",
									width: "50%",
									children: [
										{
											type: "vbox",
											id: "rightCol1",
											widths: ["50%", "50%"],
											children: [
												{
													type: "text",
													id: "text",
													label: a.LocalizationLabel.ChangeTo.text + ":",
													labelLayout: "horizontal",
													labelStyle: "font: 12px/25px arial, sans-serif;",
													width: "140px",
													default: "",
													onShow: function () {
														a.textNode.SpellTab = this;
														a.LocalizationLabel.ChangeTo.instance = this;
													},
													onHide: function () {
														this.reset();
													},
												},
												{
													type: "hbox",
													id: "rightCol",
													align: "right",
													width: "30%",
													children: [
														{
															type: "vbox",
															id: "rightCol_col__left",
															children: [
																{
																	type: "text",
																	id: "labelSuggestions",
																	label: a.LocalizationLabel.Suggestions.text + ":",
																	onShow: function () {
																		a.LocalizationLabel.Suggestions.instance = this;
																		this.getInputElement().hide();
																	},
																},
																{
																	type: "html",
																	id: "logo",
																	html:
																		'<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">',
																	setup: function () {
																		this.getElement().$.src = a.logotype;
																		this.getElement()
																			.getParent()
																			.setStyles({ "text-align": "left" });
																	},
																},
															],
														},
														{
															type: "select",
															id: "list_of_suggestions",
															labelStyle: "font: 12px/25px arial, sans-serif;",
															size: "6",
															inputStyle: "width: 140px; height: auto;",
															items: [["loading..."]],
															onShow: function () {
																k = this;
															},
															onHide: function () {
																this.clear();
															},
															onChange: function () {
																a.textNode.SpellTab.setValue(this.getValue());
															},
														},
													],
												},
											],
										},
									],
								},
								{
									type: "hbox",
									id: "rightCol",
									align: "right",
									width: "50%",
									children: [
										{
											type: "vbox",
											id: "rightCol_col__left",
											widths: ["50%", "50%", "50%", "50%"],
											children: [
												{
													type: "button",
													id: "ChangeTo",
													label: a.LocalizationButton.ChangeTo.text,
													title: "Change to",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
														a.LocalizationButton.ChangeTo.instance = this;
													},
													onClick: c,
												},
												{
													type: "button",
													id: "ChangeAll",
													label: a.LocalizationButton.ChangeAll.text,
													title: "Change All",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
														a.LocalizationButton.ChangeAll.instance = this;
													},
													onClick: c,
												},
												{
													type: "button",
													id: "AddWord",
													label: a.LocalizationButton.AddWord.text,
													title: "Add word",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
														a.LocalizationButton.AddWord.instance = this;
													},
													onClick: c,
												},
												{
													type: "button",
													id: "FinishChecking",
													label: a.LocalizationButton.FinishChecking.text,
													title: "Finish Checking",
													style: "width: 100%;margin-top: 9px;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
														a.LocalizationButton.FinishChecking.instance = this;
													},
													onClick: c,
												},
											],
										},
										{
											type: "vbox",
											id: "rightCol_col__right",
											widths: ["50%", "50%", "50%"],
											children: [
												{
													type: "button",
													id: "IgnoreWord",
													label: a.LocalizationButton.IgnoreWord.text,
													title: "Ignore word",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
														a.LocalizationButton.IgnoreWord.instance = this;
													},
													onClick: c,
												},
												{
													type: "button",
													id: "IgnoreAllWords",
													label: a.LocalizationButton.IgnoreAllWords.text,
													title: "Ignore all words",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
														a.LocalizationButton.IgnoreAllWords.instance = this;
													},
													onClick: c,
												},
												{
													type: "button",
													id: "option",
													label: a.LocalizationButton.Options.text,
													title: "Option",
													style: "width: 100%;",
													onLoad: function () {
														a.LocalizationButton.Options.instance = this;
														"file:" == document.location.protocol && this.disable();
													},
													onClick: function () {
														"file:" == document.location.protocol
															? alert(
																	"WSC: Options functionality is disabled when runing from file system"
															  )
															: b.openDialog("options");
													},
												},
											],
										},
									],
								},
							],
						},
						{
							type: "hbox",
							id: "BlockFinishChecking",
							style: "width:560px; margin: 0 auto;",
							widths: ["70%", "30%"],
							onShow: function () {
								this.getElement().hide();
							},
							onHide: i,
							children: [
								{
									type: "hbox",
									id: "leftCol",
									align: "left",
									width: "70%",
									children: [
										{
											type: "vbox",
											id: "rightCol1",
											setup: function () {
												this.getChild()[0].getElement().$.src = a.logotype;
												this.getChild()[0]
													.getElement()
													.getParent()
													.setStyles({ "text-align": "center" });
											},
											children: [
												{
													type: "html",
													id: "logo",
													html:
														'<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">',
												},
											],
										},
									],
								},
								{
									type: "hbox",
									id: "rightCol",
									align: "right",
									width: "30%",
									children: [
										{
											type: "vbox",
											id: "rightCol_col__left",
											children: [
												{
													type: "button",
													id: "Option_button",
													label: a.LocalizationButton.Options.text,
													title: "Option",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
														"file:" == document.location.protocol && this.disable();
													},
													onClick: function () {
														"file:" == document.location.protocol
															? alert(
																	"WSC: Options functionality is disabled when runing from file system"
															  )
															: b.openDialog("options");
													},
												},
												{
													type: "button",
													id: "FinishChecking",
													label: a.LocalizationButton.FinishChecking.text,
													title: "Finish Checking",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					id: "GrammTab",
					label: "Grammar",
					accessKey: "G",
					elements: [
						{
							type: "html",
							id: "banner",
							label: "banner",
							style: "",
							html: "<div></div>",
						},
						{
							type: "html",
							id: "Content",
							label: "GrammarContent",
							html: "",
							setup: function () {
								var b = a.iframeNumber + "_" + a.dialog._.currentTabId,
									c = document.getElementById(b);
								a.targetFromFrame[b] = c.contentWindow;
							},
						},
						{
							type: "vbox",
							id: "bottomGroup",
							style: "width:560px; margin: 0 auto;",
							children: [
								{
									type: "hbox",
									id: "leftCol",
									widths: ["66%", "34%"],
									children: [
										{
											type: "vbox",
											children: [
												{
													type: "text",
													id: "text",
													label: "Change to:",
													labelLayout: "horizontal",
													labelStyle: "font: 12px/25px arial, sans-serif;",
													inputStyle: "float: right; width: 200px;",
													default: "",
													onShow: function () {
														a.textNode.GrammTab = this;
													},
													onHide: function () {
														this.reset();
													},
												},
												{
													type: "html",
													id: "html_text",
													html:
														"<div style='min-height: 17px; line-height: 17px; padding: 5px; text-align: left;background: #F1F1F1;color: #595959; white-space: normal!important;'></div>",
													onShow: function () {
														a.textNodeInfo.GrammTab = this;
													},
												},
												{
													type: "html",
													id: "radio",
													html: "",
													onShow: function () {
														a.grammerSuggest = this;
													},
												},
											],
										},
										{
											type: "vbox",
											children: [
												{
													type: "button",
													id: "ChangeTo",
													label: "Change to",
													title: "Change to",
													style: "width: 133px; float: right;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
												{
													type: "button",
													id: "IgnoreWord",
													label: "Ignore word",
													title: "Ignore word",
													style: "width: 133px; float: right;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
												{
													type: "button",
													id: "IgnoreAllWords",
													label: "Ignore Problem",
													title: "Ignore Problem",
													style: "width: 133px; float: right;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
												{
													type: "button",
													id: "FinishChecking",
													label: "Finish Checking",
													title: "Finish Checking",
													style: "width: 133px; float: right; margin-top: 9px;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
											],
										},
									],
								},
							],
						},
						{
							type: "hbox",
							id: "BlockFinishChecking",
							style: "width:560px; margin: 0 auto;",
							widths: ["70%", "30%"],
							onShow: function () {
								this.getElement().hide();
							},
							onHide: i,
							children: [
								{
									type: "hbox",
									id: "leftCol",
									align: "left",
									width: "70%",
									children: [
										{
											type: "vbox",
											id: "rightCol1",
											children: [
												{
													type: "html",
													id: "logo",
													html:
														'<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">',
													setup: function () {
														this.getElement().$.src = a.logotype;
														this.getElement()
															.getParent()
															.setStyles({ "text-align": "center" });
													},
												},
											],
										},
									],
								},
								{
									type: "hbox",
									id: "rightCol",
									align: "right",
									width: "30%",
									children: [
										{
											type: "vbox",
											id: "rightCol_col__left",
											children: [
												{
													type: "button",
													id: "FinishChecking",
													label: "Finish Checking",
													title: "Finish Checking",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					id: "Thesaurus",
					label: "Thesaurus",
					accessKey: "T",
					elements: [
						{
							type: "html",
							id: "banner",
							label: "banner",
							style: "",
							html: "<div></div>",
						},
						{
							type: "html",
							id: "Content",
							label: "spellContent",
							html: "",
							setup: function () {
								var b = a.iframeNumber + "_" + a.dialog._.currentTabId,
									c = document.getElementById(b);
								a.targetFromFrame[b] = c.contentWindow;
							},
						},
						{
							type: "vbox",
							id: "bottomGroup",
							style: "width:560px; margin: 0 auto;",
							children: [
								{
									type: "hbox",
									widths: ["75%", "25%"],
									children: [
										{
											type: "vbox",
											children: [
												{
													type: "hbox",
													widths: ["65%", "35%"],
													children: [
														{
															type: "text",
															id: "ChangeTo",
															label: "Change to:",
															labelLayout: "horizontal",
															inputStyle: "width: 160px;",
															labelStyle: "font: 12px/25px arial, sans-serif;",
															default: "",
															onShow: function () {
																a.textNode.Thesaurus = this;
															},
															onHide: function () {
																this.reset();
															},
														},
														{
															type: "button",
															id: "ChangeTo",
															label: "Change to",
															title: "Change to",
															style: "width: 121px; margin-top: 1px;",
															onLoad: function () {
																this.getElement().setAttribute("title-cmd", this.id);
															},
															onClick: c,
														},
													],
												},
												{
													type: "hbox",
													children: [
														{
															type: "select",
															id: "categories",
															label: "Categories:",
															labelStyle: "font: 12px/25px arial, sans-serif;",
															size: "5",
															inputStyle: "width: 180px; height: auto;",
															items: [],
															onShow: function () {
																a.selectNode.categories = this;
															},
															onHide: function () {
																this.clear();
															},
															onChange: function () {
																a.buildOptionSynonyms(this.getValue());
															},
														},
														{
															type: "select",
															id: "synonyms",
															label: "Synonyms:",
															labelStyle: "font: 12px/25px arial, sans-serif;",
															size: "5",
															inputStyle: "width: 180px; height: auto;",
															items: [],
															onShow: function () {
																a.selectNode.synonyms = this;
																a.textNode.Thesaurus.setValue(this.getValue());
															},
															onHide: function () {
																this.clear();
															},
															onChange: function () {
																a.textNode.Thesaurus.setValue(this.getValue());
															},
														},
													],
												},
											],
										},
										{
											type: "vbox",
											width: "120px",
											style: "margin-top:46px;",
											children: [
												{
													type: "html",
													id: "logotype",
													label: "WebSpellChecker.net",
													html:
														'<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">',
													setup: function () {
														this.getElement().$.src = a.logotype;
														this.getElement()
															.getParent()
															.setStyles({ "text-align": "center" });
													},
												},
												{
													type: "button",
													id: "FinishChecking",
													label: "Finish Checking",
													title: "Finish Checking",
													style: "width: 121px; float: right; margin-top: 9px;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
											],
										},
									],
								},
							],
						},
						{
							type: "hbox",
							id: "BlockFinishChecking",
							style: "width:560px; margin: 0 auto;",
							widths: ["70%", "30%"],
							onShow: function () {
								this.getElement().hide();
							},
							children: [
								{
									type: "hbox",
									id: "leftCol",
									align: "left",
									width: "70%",
									children: [
										{
											type: "vbox",
											id: "rightCol1",
											children: [
												{
													type: "html",
													id: "logo",
													html:
														'<img width="99" height="68" border="0" src="" title="WebSpellChecker.net" alt="WebSpellChecker.net" style="display: inline-block;">',
													setup: function () {
														this.getElement().$.src = a.logotype;
														this.getElement()
															.getParent()
															.setStyles({ "text-align": "center" });
													},
												},
											],
										},
									],
								},
								{
									type: "hbox",
									id: "rightCol",
									align: "right",
									width: "30%",
									children: [
										{
											type: "vbox",
											id: "rightCol_col__left",
											children: [
												{
													type: "button",
													id: "FinishChecking",
													label: "Finish Checking",
													title: "Finish Checking",
													style: "width: 100%;",
													onLoad: function () {
														this.getElement().setAttribute("title-cmd", this.id);
													},
													onClick: c,
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		};
	});
	CKEDITOR.dialog.add("options", function () {
		var b = null,
			c = {},
			d = {},
			e = null,
			g = null;
		f.cookie.get("udn");
		f.cookie.get("osp");
		var h = function () {
				g = this.getElement().getAttribute("title-cmd");
				var a = [];
				a[0] = d.IgnoreAllCapsWords;
				a[1] = d.IgnoreWordsNumbers;
				a[2] = d.IgnoreMixedCaseWords;
				a[3] = d.IgnoreDomainNames;
				a = a.toString().replace(/,/g, "");
				f.cookie.set("osp", a);
				f.cookie.set("udnCmd", g ? g : "ignore");
				"delete" != g &&
					((a = ""),
					"" !== j.getValue() && (a = j.getValue()),
					f.cookie.set("udn", a));
				f.postMessage.send({ id: "options_dic_send" });
			},
			i = function () {
				e.getElement().setHtml(a.LocalizationComing.error);
				e.getElement().show();
			};
		return {
			title: a.LocalizationComing.Options,
			minWidth: 430,
			minHeight: 130,
			resizable: CKEDITOR.DIALOG_RESIZE_NONE,
			contents: [
				{
					id: "OptionsTab",
					label: "Options",
					accessKey: "O",
					elements: [
						{
							type: "hbox",
							id: "options_error",
							children: [
								{
									type: "html",
									style:
										"display: block;text-align: center;white-space: normal!important; font-size: 12px;color:red",
									html: "<div></div>",
									onShow: function () {
										e = this;
									},
								},
							],
						},
						{
							type: "vbox",
							id: "Options_content",
							children: [
								{
									type: "hbox",
									id: "Options_manager",
									widths: ["52%", "48%"],
									children: [
										{
											type: "fieldset",
											label: "Spell Checking Options",
											style: "border: none;margin-top: 13px;padding: 10px 0 10px 10px",
											onShow: function () {
												this.getInputElement().$.children[0].innerHTML =
													a.LocalizationComing.SpellCheckingOptions;
											},
											children: [
												{
													type: "vbox",
													id: "Options_checkbox",
													children: [
														{
															type: "checkbox",
															id: "IgnoreAllCapsWords",
															label: "Ignore All-Caps Words",
															labelStyle:
																"margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;",
															style: "float:left; min-height: 16px;",
															default: "",
															onClick: function () {
																d[this.id] = !this.getValue() ? 0 : 1;
															},
														},
														{
															type: "checkbox",
															id: "IgnoreWordsNumbers",
															label: "Ignore Words with Numbers",
															labelStyle:
																"margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;",
															style: "float:left; min-height: 16px;",
															default: "",
															onClick: function () {
																d[this.id] = !this.getValue() ? 0 : 1;
															},
														},
														{
															type: "checkbox",
															id: "IgnoreMixedCaseWords",
															label: "Ignore Mixed-Case Words",
															labelStyle:
																"margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;",
															style: "float:left; min-height: 16px;",
															default: "",
															onClick: function () {
																d[this.id] = !this.getValue() ? 0 : 1;
															},
														},
														{
															type: "checkbox",
															id: "IgnoreDomainNames",
															label: "Ignore Domain Names",
															labelStyle:
																"margin-left: 5px; font: 12px/16px arial, sans-serif;display: inline-block;white-space: normal;",
															style: "float:left; min-height: 16px;",
															default: "",
															onClick: function () {
																d[this.id] = !this.getValue() ? 0 : 1;
															},
														},
													],
												},
											],
										},
										{
											type: "vbox",
											id: "Options_DictionaryName",
											children: [
												{
													type: "text",
													id: "DictionaryName",
													style: "margin-bottom: 10px",
													label: "Dictionary Name:",
													labelLayout: "vertical",
													labelStyle: "font: 12px/25px arial, sans-serif;",
													default: "",
													onLoad: function () {
														j = this;
														this.setValue(
															a.userDictionaryName
																? a.userDictionaryName
																: (f.cookie.get("udn"), this.getValue())
														);
													},
													onShow: function () {
														j = this;
														this.setValue(
															!f.cookie.get("udn") ? this.getValue() : f.cookie.get("udn")
														);
														this.setLabel(a.LocalizationComing.DictionaryName);
													},
													onHide: function () {
														this.reset();
													},
												},
												{
													type: "hbox",
													id: "Options_buttons",
													children: [
														{
															type: "vbox",
															id: "Options_leftCol_col",
															widths: ["50%", "50%"],
															children: [
																{
																	type: "button",
																	id: "create",
																	label: "Create",
																	title: "Create",
																	style: "width: 100%;",
																	onLoad: function () {
																		this.getElement().setAttribute("title-cmd", this.id);
																	},
																	onShow: function () {
																		this.getElement().setText(a.LocalizationComing.Create);
																	},
																	onClick: h,
																},
																{
																	type: "button",
																	id: "restore",
																	label: "Restore",
																	title: "Restore",
																	style: "width: 100%;",
																	onLoad: function () {
																		this.getElement().setAttribute("title-cmd", this.id);
																	},
																	onShow: function () {
																		this.getElement().setText(a.LocalizationComing.Restore);
																	},
																	onClick: h,
																},
															],
														},
														{
															type: "vbox",
															id: "Options_rightCol_col",
															widths: ["50%", "50%"],
															children: [
																{
																	type: "button",
																	id: "rename",
																	label: "Rename",
																	title: "Rename",
																	style: "width: 100%;",
																	onLoad: function () {
																		this.getElement().setAttribute("title-cmd", this.id);
																	},
																	onShow: function () {
																		this.getElement().setText(a.LocalizationComing.Rename);
																	},
																	onClick: h,
																},
																{
																	type: "button",
																	id: "delete",
																	label: "Remove",
																	title: "Remove",
																	style: "width: 100%;",
																	onLoad: function () {
																		this.getElement().setAttribute("title-cmd", this.id);
																	},
																	onShow: function () {
																		this.getElement().setText(a.LocalizationComing.Remove);
																	},
																	onClick: h,
																},
															],
														},
													],
												},
											],
										},
									],
								},
								{
									type: "hbox",
									id: "Options_text",
									children: [
										{
											type: "html",
											style:
												"text-align: justify;margin-top: 15px;white-space: normal!important; font-size: 12px;color:#777;",
											html: "<div>" + a.LocalizationComing.OptionsTextIntro + "</div>",
											onShow: function () {
												this.getElement().setText(a.LocalizationComing.OptionsTextIntro);
											},
										},
									],
								},
							],
						},
					],
				},
			],
			buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
			onOk: function () {
				var a = [];
				a[0] = d.IgnoreAllCapsWords;
				a[1] = d.IgnoreWordsNumbers;
				a[2] = d.IgnoreMixedCaseWords;
				a[3] = d.IgnoreDomainNames;
				a = a.toString().replace(/,/g, "");
				f.cookie.set("osp", a);
				f.cookie.set("udn", j.getValue());
				f.postMessage.send({ id: "options_checkbox_send" });
				e.getElement().hide();
				e.getElement().setHtml(" ");
			},
			onLoad: function () {
				b = this;
				f.postMessage.init(i);
				c.IgnoreAllCapsWords = b.getContentElement(
					"OptionsTab",
					"IgnoreAllCapsWords"
				);
				c.IgnoreWordsNumbers = b.getContentElement(
					"OptionsTab",
					"IgnoreWordsNumbers"
				);
				c.IgnoreMixedCaseWords = b.getContentElement(
					"OptionsTab",
					"IgnoreMixedCaseWords"
				);
				c.IgnoreDomainNames = b.getContentElement(
					"OptionsTab",
					"IgnoreDomainNames"
				);
			},
			onShow: function () {
				var b = f.cookie.get("osp").split("");
				d.IgnoreAllCapsWords = b[0];
				d.IgnoreWordsNumbers = b[1];
				d.IgnoreMixedCaseWords = b[2];
				d.IgnoreDomainNames = b[3];
				!parseInt(d.IgnoreAllCapsWords, 10)
					? c.IgnoreAllCapsWords.setValue("", !1)
					: c.IgnoreAllCapsWords.setValue("checked", !1);
				!parseInt(d.IgnoreWordsNumbers, 10)
					? c.IgnoreWordsNumbers.setValue("", !1)
					: c.IgnoreWordsNumbers.setValue("checked", !1);
				!parseInt(d.IgnoreMixedCaseWords, 10)
					? c.IgnoreMixedCaseWords.setValue("", !1)
					: c.IgnoreMixedCaseWords.setValue("checked", !1);
				!parseInt(d.IgnoreDomainNames, 10)
					? c.IgnoreDomainNames.setValue("", !1)
					: c.IgnoreDomainNames.setValue("checked", !1);
				d.IgnoreAllCapsWords = !c.IgnoreAllCapsWords.getValue() ? 0 : 1;
				d.IgnoreWordsNumbers = !c.IgnoreWordsNumbers.getValue() ? 0 : 1;
				d.IgnoreMixedCaseWords = !c.IgnoreMixedCaseWords.getValue() ? 0 : 1;
				d.IgnoreDomainNames = !c.IgnoreDomainNames.getValue() ? 0 : 1;
				c.IgnoreAllCapsWords.getElement().$.lastChild.innerHTML =
					a.LocalizationComing.IgnoreAllCapsWords;
				c.IgnoreWordsNumbers.getElement().$.lastChild.innerHTML =
					a.LocalizationComing.IgnoreWordsWithNumbers;
				c.IgnoreMixedCaseWords.getElement().$.lastChild.innerHTML =
					a.LocalizationComing.IgnoreMixedCaseWords;
				c.IgnoreDomainNames.getElement().$.lastChild.innerHTML =
					a.LocalizationComing.IgnoreDomainNames;
			},
		};
	});
	CKEDITOR.dialog.on("resize", function (b) {
		var b = b.data,
			c = b.dialog,
			d = CKEDITOR.document.getById(a.iframeNumber + "_" + c._.currentTabId);
		"checkspell" == c._.name &&
			(a.bnr
				? d && d.setSize("height", b.height - 310)
				: d && d.setSize("height", b.height - 220));
	});
	CKEDITOR.on("dialogDefinition", function (b) {
		var c = b.data.definition;
		a.onLoadOverlay = new l({
			opacity: "1",
			background: "#fff",
			target: c.dialog.parts.tabs.getParent().$,
		});
		a.onLoadOverlay.setEnable();
		c.dialog.on("show", function () {});
		c.dialog.on(
			"cancel",
			function () {
				c.dialog
					.getParentEditor()
					.config.wsc_onClose.call(this.document.getWindow().getFrame());
				a.div_overlay.setDisable();
				return !1;
			},
			this,
			null,
			-1
		);
	});
})();
