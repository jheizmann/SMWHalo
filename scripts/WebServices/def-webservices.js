/*  This file is part of the halo-Extension.
 *
 *   The halo-Extension is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   The halo-Extension is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http:// www.gnu.org/licenses/>.
 */

/**
 * This file provides methods for the special page define wiki web service
 * description
 * 
 * @author Ingo Steinbauer
 * 
 */

var DefineWebServiceSpecial = Class.create();

DefineWebServiceSpecial.prototype = {

	initialize : function() {
		this.step = "step1";
	},

	/**
	 * called when the user finishes step 1 define uri
	 * 
	 * @return
	 */
	processStep1 : function() {
		if (this.step != "step1") {
			check = confirm("If you proceed, all input you allready gave in the subsequent steps will be lost!");
			if (check == false) {
				return;
			}
		}

		this.showPendingIndicator("step1-go");

		this.step = "step2";
		var uri = $("step1-uri").value;
		sajax_do_call("smwf_ws_processStep1", [ uri ],
				this.processStep1CallBack.bind(this));
	},

	/**
	 * callback-method for the ajax-call of step 1 this method initializes the
	 * gui for step 2 choose methods
	 * 
	 * @param request
	 * 
	 */
	processStep1CallBack : function(request) {
		var wsMethods = request.responseText.split(";");
		if (wsMethods[0] != "todo:handle exceptions") {
			// hide or display widgets of other steps
			$("step2").style.display = "none";

			$("menue-step1").className = "ActualMenueStep";
			$("menue-step2").className = "TodoMenueStep";

			$("step1-help").style.display = "";
			$("step2-help").style.display = "none";

			$("step1-img").style.visibility = "visible";
			$("step2-img").style.visibility = "hidden";

			$("step1-error").style.display = "";

			this.step = "step1";
			$("errors").style.display = "";
		} else {
			wsMethods.shift();
			$("errors").style.display = "none";
			$("step1-error").style.display = "none";

			// clear the widget for step 2
			var existingOptions = $("step2-methods").cloneNode(false);
			$("step2-methods").id = "old-step2-methods";
			$("old-step2-methods").parentNode.insertBefore(existingOptions,
					document.getElementById("old-step2-methods"));
			$("old-step2-methods").parentNode
					.removeChild($("old-step2-methods"));
			existingOptions.id = "step2-methods";

			// fill the widget for step2 with content

			for (i = 0; i < wsMethods.length; i++) {
				var option = document.createElement("option");
				var mName = document.createTextNode(wsMethods[i]);
				option.appendChild(mName);
				option.value = wsMethods[i];
				$("step2-methods").appendChild(option);
			}

			// hide or display widgets of other steps
			$("step2").style.display = "";

			$("menue-step1").className = "DoneMenueStep";
			$("menue-step2").className = "ActualMenueStep";

			$("step1-help").style.display = "none";
			$("step2-help").style.display = "";

			$("step1-img").style.visibility = "hidden";
			$("step2-img").style.visibility = "visible";

			$("step1-error").style.display = "none";
		}

		// hide or display widgets of other steps
		$("step3").style.display = "none";
		$("step4").style.display = "none";
		$("step5").style.display = "none";
		$("step6").style.display = "none";

		$("menue-step3").className = "TodoMenueStep";
		$("menue-step4").className = "TodoMenueStep";
		$("menue-step5").className = "TodoMenueStep";
		$("menue-step6").className = "TodoMenueStep";

		$("step3-help").style.display = "none";
		$("step4-help").style.display = "none";
		$("step5-help").style.display = "none";
		$("step6-help").style.display = "none";

		$("step3-img").style.visibility = "hidden";
		$("step4-img").style.visibility = "hidden";
		$("step5-img").style.visibility = "hidden";
		$("step6-img").style.visibility = "hidden";

		$("step2a-error").style.display = "none";
		$("step2b-error").style.display = "none";
		$("step3-error").style.display = "none";
		$("step4-error").style.display = "none";
		$("step5-error").style.display = "none";
		$("step6-error").style.display = "none";
		$("step6b-error").style.display = "none";
		$("step6c-error").style.display = "none";

		this.hidePendingIndicator();
	},

	/**
	 * called when the user finishes step 2 choose method
	 * 
	 */
	processStep2 : function() {
		if (this.step != "step2") {
			check = confirm("If you proceed, all input you allready gave in the subsequent steps will be lost!");
			if (check == false) {
				return;
			}
		}

		this.step = "step3+";
		var method = $("step2-methods").value;
		var uri = $("step1-uri").value;

		this.showPendingIndicator("step2-go");

		sajax_do_call("smwf_ws_processStep2", [ uri, method ],
				this.processStep2CallBack.bind(this));
	},

	processStep2CallBack : function(request) {
		this.processStep2Do(request.responseText, false);
	},

	/**
	 * callback-method for the ajax-call of step 2 this method initializes the
	 * gui for step 3 specify parameters
	 * 
	 * @param request
	 * 
	 */
	processStep2Do : function(parameterString, edit) {
		var wsParameters = parameterString.split(";");

		this.preparedPathSteps = new Array();

		if (wsParameters[0] == "todo:handle noparams") {
			$("step3").childNodes[1].nodeValue = "3. This method does not ask for any parameters.";
			if (!edit) {
				$("step3").style.display = "";
				$("step2-img").style.visibility = "hidden";
				$("step3-parameters").style.display = "none";
				$("step3-go-img").style.display = "none";
				this.processStep3();
			}
			return;
		} else {
			// todo: find better solution
			if (!edit) {
				$("step2-img").style.visibility = "visible";
				$("step3").childNodes[1].nodeValue = "3. The method asks for the following parameters.";
				$("step3-parameters").style.display = "";
				$("step3-go-img").style.display = "";
			}
		}

		var duplicate = false;
		for ( var i = 1; i < wsParameters.length; i++) {
			var steps = wsParameters[i].split(".");
			var preparedPathStepsDot = new Array();
			for ( var k = 0; k < steps.length; k++) {
				var tO = new Object();
				if (steps[k].indexOf("##duplicate") > -1) {
					tO["value"] = steps[k].substr(0, steps[k]
							.indexOf("##duplicate"));
					tO["duplicate"] = true;
					duplicate = true;
				} else if (steps[k].indexOf("##overflow") > -1) {
					tO["value"] = steps[k].substr(0, steps[k]
							.indexOf("##overflow"));
					tO["overflow"] = true;
				} else {
					tO["value"] = steps[k];
				}

				if (tO["value"] == "Request") {
					tO["value"] = "Request[]";
				}
				if (tO["value"] == "body") {
					tO["value"] = "body[]";
				}

				tO["i"] = "null";
				tO["k"] = "null";
				tO["arrayIndex"] = "null";
				tO["arrayIndexOrigin"] = null;
				tO["arrayIndexUsers"] = new Array();
				tO["arrayIndexRoot"] = false;
				preparedPathStepsDot[k] = tO;
			}
			this.preparedPathSteps[i - 1] = preparedPathStepsDot;
		}
		if (duplicate) {
			$("step3-duplicates").style.display = "";
		}

		if (wsParameters[0] != "todo:handle exceptions") {
			this.step = "step2";
			// step3").style.display = "none";

			$("menue-step2").className = "ActualMenueStep";
			$("menue-step3").className = "TodoMenueStep";

			$("step2-help").style.display = "";
			$("step3-help").style.display = "none";

			$("step2-img").style.visibility = "visible";
			$("step3-img").style.visibility = "hidden";

			$("errors").style.display = "";
			$("step2a-error").style.display = "none";
			$("step2b-error").style.display = "none";

			if (overflow) {
				$("step2b-error").style.display = "";
			} else {
				$("step2a-error").style.display = "";
			}
		} else {
			wsParameters.shift();
			// clear widgets of step 3
			var tempHead = $("step3-parameters").childNodes[0].childNodes[0]
					.cloneNode(true);
			var tempTable = $("step3-parameters").childNodes[0]
					.cloneNode(false);
			$("step3-parameters").removeChild(
					$("step3-parameters").childNodes[0]);
			$("step3-parameters").appendChild(tempTable);
			$("step3-parameters").childNodes[0].appendChild(tempHead);

			this.parameterContainer = $("step3-parameters").cloneNode(true);

			// fill widgets for step 3 with content

			var treeView = false;
			var aTreeRoot = false;

			for (i = 0; i < wsParameters.length; i++) {
				treeView = false;
				aTreeRoot = false;
				var paramRow = document.createElement("tr");
				paramRow.id = "step3-paramRow-" + i;

				var paramTD0 = document.createElement("td");
				paramTD0.id = "step3-paramTD0-" + i;
				paramRow.appendChild(paramTD0);

				var paramPath = document.createElement("div");
				var dotSteps = wsParameters[i].split(".");

				paramTD0.appendChild(paramPath);
				paramPath.id = "s3-path" + i;
				paramPath.className = "OuterLeftIndent";

				for (k = 0; k < dotSteps.length; k++) {
					var treeViewK = -1;
					var aTreeRootK = -1;

					var paramPathStep = document.createElement("span");
					paramPathStep.id = "s3-pathstep-" + i + "-" + k;
					if (aTreeRoot) {
						paramPathStep.style.visibility = "hidden";
					}

					var paramPathText = "";
					if (k > 0) {
						paramPathText += ".";
					}
					paramPathText += this.preparedPathSteps[i][k]["value"];
					paramPathTextNode = document.createTextNode(paramPathText);
					if (this.preparedPathSteps[i][k]["duplicate"]) {
						paramPathStep.style.color = "red";
					}
					paramPathStep.appendChild(paramPathTextNode);
					paramPath.appendChild(paramPathStep);

					if (this.preparedPathSteps[i][k]["value"].indexOf("[") > 0) {
						paramPathStep.firstChild.nodeValue = this.preparedPathSteps[i][k]["value"]
								.substr(0,
										this.preparedPathSteps[i][k]["value"]
												.indexOf("]"));
						this.preparedPathSteps[i][k]["arrayIndex"] = 1;
						var pathIndexSpan = document.createElement("span");
						pathIndexSpan.id = "step3-arrayspan-" + i + "-" + k;
						var pathIndexText = document.createTextNode("1");
						pathIndexSpan.appendChild(pathIndexText);

						paramPathStep.appendChild(pathIndexSpan);
						pathTextEnd = document.createTextNode("]");
						paramPathStep.appendChild(pathTextEnd);

						// the add-button
						var addButton = document.createElement("span");
						addButton.style.cursor = "pointer";
						var addButtonIMG = document.createElement("img");
						addButtonIMG.src = wgScriptPath
								+ "/extensions/SMWHalo/skins/webservices/Add.png";
						addButton.appendChild(addButtonIMG);

						addButtonIMG.i = i;
						addButtonIMG.k = k;
						addButtonIMG.addA = true;
						Event.observe(addButtonIMG, "click",
								this.addRemoveParameter
										.bindAsEventListener(this));

						paramPathStep.appendChild(addButton);
					}

					if (i < wsParameters.length - 1) {
						if (this.preparedPathSteps[i + 1][k] != null) {
							if (this.preparedPathSteps[i][k]["value"] == this.preparedPathSteps[i + 1][k]["value"]
									|| this.preparedPathSteps[i][k]["value"] == "."
											+ this.preparedPathSteps[i + 1][k]["value"]) {
								this.preparedPathSteps[i][k]["i"] = i + 1;
								this.preparedPathSteps[i][k]["k"] = k;
								this.preparedPathSteps[i][k]["arrayIndexRoot"] = true;
								aTreeRoot = true;
								aTreeRootK = k;

								var expandPathStep = document
										.createElement("span");
								expandPathStep.id = "step3-expand-" + i + "-"
										+ k;
								expandPathStep.expanded = false;

								var expandIMG = document.createElement("img");
								expandIMG.src = wgScriptPath
										+ "/extensions/SMWHalo/skins/webservices/Plus.gif";
								expandIMG.i = i;
								expandIMG.k = k;
								var el = this.paramPathStepClick
										.bindAsEventListener(this)
								expandIMG.expand = true;
								Event.observe(expandIMG, "click", el);

								expandPathStep.appendChild(expandIMG);

								expandPathStep.style.cursor = "pointer";
								paramPathStep.insertBefore(expandPathStep,
										paramPathStep.firstChild);
							}
						}
					}

					if (i > 0) {
						if (this.preparedPathSteps[i - 1][k] != null) {
							if (this.preparedPathSteps[i][k]["value"] == "."
									+ this.preparedPathSteps[i - 1][k]["value"]
									|| this.preparedPathSteps[i][k]["value"] == this.preparedPathSteps[i - 1][k]["value"]) {
								paramPathStep.style.visibility = "hidden";
								this.preparedPathSteps[i][k]["arrayIndexRoot"] = false;
								treeView = true;
								treeViewK = k;
							}
						}
					}

					if (k == treeViewK && k != aTreeRootK) {
						expandPathStep = document.createElement("span");
						expandIMG = document.createElement("img");
						expandIMG.src = wgScriptPath
								+ "/extensions/SMWHalo/skins/webservices/Plus.gif";
						expandPathStep.appendChild(expandIMG);
						paramPathStep.insertBefore(expandPathStep,
								paramPathStep.firstChild);
					}
				}

				var paramTD1 = document.createElement("td");
				paramTD1.id = "step3-paramTD1-" + i;
				paramRow.appendChild(paramTD1);

				var aliasInput = document.createElement("input");
				aliasInput.id = "s3-alias" + i;
				aliasInput.size = "15";
				aliasInput.maxLength = "40";
				paramTD1.appendChild(aliasInput);

				if (aTreeRoot || treeView) {
					paramTD1.style.visibility = "hidden";
				}

				var paramTD2 = document.createElement("td");
				paramTD2.id = "step3-paramTD2-" + i;
				paramRow.appendChild(paramTD2);

				if (navigator.appName.indexOf("Explorer") != -1) {
					var optionalRadio1 = document
							.createElement("<input type=\"radio\" name=\"s3-optional-radio"
									+ i + "\">");
				} else {
					var optionalRadio1 = document.createElement("input");
					optionalRadio1.type = "radio";
					optionalRadio1.name = "s3-optional-radio" + i;
				}
				optionalRadio1.id = "s3-optional-true" + i;
				optionalRadio1.value = "yes";
				paramTD2.appendChild(optionalRadio1);

				var optionalRadio1Span = document.createElement("span");
				var optionalRadio1TextY = document.createTextNode("Yes");
				optionalRadio1Span.appendChild(optionalRadio1TextY);
				paramTD2.appendChild(optionalRadio1Span);

				if (navigator.appName.indexOf("Explorer") != -1) {
					var optionalRadio2 = document
							.createElement("<input type=\"radio\" name=\"s3-optional-radio"
									+ i + "\" checked=\"checked\">");
				} else {
					var optionalRadio2 = document.createElement("input");
					optionalRadio2.type = "radio";
					optionalRadio2.name = "s3-optional-radio" + i;
					optionalRadio2.checked = true;
				}

				optionalRadio2.id = "s3-optional-false" + i;
				optionalRadio2.value = "false";
				paramTD2.appendChild(optionalRadio2);

				var optionalRadio2Span = document.createElement("span");
				var optionalRadio2TextN = document.createTextNode("No");
				optionalRadio2Span.appendChild(optionalRadio2TextN);
				paramTD2.appendChild(optionalRadio2Span);

				if (aTreeRoot || treeView) {
					paramTD2.style.visibility = "hidden";
				}

				var paramTD3 = document.createElement("td");
				paramTD3.id = "step3-paramTD3-" + i;
				paramRow.appendChild(paramTD3);

				var defaultInput = document.createElement("input");
				defaultInput.id = "s3-default" + i;
				defaultInput.size = "15";
				defaultInput.maxLength = "40";
				paramTD3.appendChild(defaultInput);

				if (aTreeRoot || treeView) {
					paramTD3.style.visibility = "hidden";
				}

				var paramTD4 = document.createElement("td");
				paramTD4.id = "step3-paramTD4-" + i;
				paramRow.appendChild(paramTD4);

				if (aTreeRoot || treeView) {
					paramTD4.style.visibility = "hidden";
				}

				if (treeView) {
					paramRow.style.display = "none";
				}
				this.parameterContainer.childNodes[0].appendChild(paramRow);
			}

			var parent = $("step3-parameters").parentNode;
			parent.removeChild($("step3-parameters"));
			var parent = $("step3");
			parent.insertBefore(this.parameterContainer, parent.childNodes[3]);

			// hide or display widgets of other steps
			if (!edit) {
				$("step3").style.display = "";

				$("menue-step2").className = "DoneMenueStep";
				$("menue-step3").className = "ActualMenueStep";

				$("step2-help").style.display = "none";
				$("step3-help").style.display = "";

				$("step2-img").style.visibility = "hidden";
				$("step3-img").style.visibility = "visible";

				$("step2a-error").style.display = "none";
				$("step2b-error").style.display = "none";

				$("errors").style.display = "none";
			}
		}

		// hide or display widgets of other steps
		if (!edit) {
			$("step4").style.display = "none";
			$("step5").style.display = "none";
			$("step6").style.display = "none";

			$("menue-step4").className = "TodoMenueStep";
			$("menue-step5").className = "TodoMenueStep";
			$("menue-step6").className = "TodoMenueStep";

			$("step4-help").style.display = "none";
			$("step5-help").style.display = "none";
			$("step6-help").style.display = "none";

			$("step4-img").style.visibility = "hidden";
			$("step5-img").style.visibility = "hidden";
			$("step6-img").style.visibility = "hidden";

			$("step3-error").style.display = "none";
			$("step4-error").style.display = "none";
			$("step5-error").style.display = "none";
			$("step6-error").style.display = "none";
			$("step6b-error").style.display = "none";
			$("step6c-error").style.display = "none";
		}
		// $("step3-parameters").style.display = "";

		this.hidePendingIndicator();
	},

	/**
	 * called when the user finishes step 3 define parameters
	 * 
	 * @return
	 */
	processStep3 : function() {
		this.generateParameterAliases(false);
		var method = $("step2-methods").value;
		var uri = $("step1-uri").value;
		var parameters = "";

		this.showPendingIndicator("step3-go");

		sajax_do_call("smwf_ws_processStep3", [ uri, method ],
				this.processStep3CallBack.bind(this));
	},

	processStep3CallBack : function(request) {
		this.processStep3Do(request.responseText, false);
	},

	/**
	 * callback-method for the ajax-call of step 3 this method initializes the
	 * gui for step 4 specify result aliases
	 * 
	 * @param request
	 * 
	 */
	processStep3Do : function(resultsString, edit) {
		var wsResults = resultsString.split(";");

		this.preparedRPathSteps = new Array();

		var duplicate = false;
		for ( var i = 1; i < wsResults.length; i++) {
			if (wsResults[i].length > 0) {
				wsResults[i] = "result." + wsResults[i];
			} else {
				wsResults[i] = "result";
			}
			var steps = wsResults[i].split(".");
			var preparedPathStepsDot = new Array();
			for ( var k = 0; k < steps.length; k++) {
				var tO = new Object();
				if (steps[k].indexOf("##duplicate") > -1) {
					if (steps[k].indexOf("[]") > -1) {
						tO["value"] = steps[k].substr(0, steps[k]
								.indexOf("##duplicate"))
								+ "[]";
					} else {
						tO["value"] = steps[k].substr(0, steps[k]
								.indexOf("##duplicate"));
					}
					tO["duplicate"] = true;
					duplicate = true;
				} else if (steps[k].indexOf("##overflow") > -1) {
					tO["value"] = steps[k].substr(0, steps[k]
							.indexOf("##overflow"))
							+ "[]";
					tO["overflow"] = true;
				} else {
					tO["value"] = steps[k];
				}

				if (tO["value"] == "Items") {
					tO["value"] = "Items[]";
				}
				if (tO["value"] == "CorrectedQuery") {
					tO["value"] = "CorrectedQuery[]";
				}

				tO["i"] = "null";
				tO["k"] = "null";
				tO["root"] = "null";
				tO["arrayIndexRoot"] = false;
				tO["enabled"] = "null";
				tO["sK"] = "null";
				preparedPathStepsDot[k] = tO;
			}

			this.preparedRPathSteps[i - 1] = preparedPathStepsDot;
		}

		if (duplicate) {
			$("step4-duplicates").style.display = "";
		}

		if (wsResults[0] != "todo:handle exceptions") {
			// hide or display widgets of other steps
			$("step3-error").style.display = "";
			$("errors").style.display = "";
		} else {
			wsResults.shift();
			// clear widgets of step 4

			var tempHead = $("step4-results").childNodes[0].childNodes[0]
					.cloneNode(true);
			var tempTable = $("step4-results").childNodes[0].cloneNode(false);
			$("step4-results").removeChild($("step4-results").childNodes[0]);
			$("step4-results").appendChild(tempTable);
			$("step4-results").childNodes[0].appendChild(tempHead);

			this.resultContainer = $("step4-results").cloneNode(true);

			// fill the widgets of step4 with content
			var aTreeRoot;
			var treeView;

			for (i = 0; i < wsResults.length; i++) {
				aTreeRoot = false;
				treeView = false;

				var resultRow = document.createElement("tr");
				resultRow.id = "step4-resultRow-" + i;

				var resultTD1 = document.createElement("td");
				resultTD1.id = "step4-resultTD1-" + i;
				resultRow.appendChild(resultTD1);

				var resultPath = document.createElement("span");
				resultTD1.appendChild(resultPath);

				for (k = 0; k < this.preparedRPathSteps[i].length; k++) {
					var treeViewK = -1;
					var aTreeRootK = -1;

					var resultPathStep = document.createElement("span");
					resultPathStep.id = "s4-pathstep-" + i + "-" + k;
					if (aTreeRoot) {
						resultPathStep.style.visibility = "hidden";
					}

					var resultPathText = "";
					if (k > 0) {
						resultPathText += ".";
					}
					resultPathText += this.preparedRPathSteps[i][k]["value"];
					var resultPathTextNode = document
							.createTextNode(resultPathText);
					if (this.preparedRPathSteps[i][k]["duplicate"]) {
						resultPathStep.style.color = "red";
					}
					resultPathStep.appendChild(resultPathTextNode);
					resultPath.appendChild(resultPathStep);

					if (this.preparedRPathSteps[i][k]["value"].indexOf("[") > 0) {
						// the input-field
						resultPathStep.firstChild.nodeValue = this.preparedRPathSteps[i][k]["value"]
								.substr(0,
										this.preparedRPathSteps[i][k]["value"]
												.indexOf("]"));
						var pathIndexInput = document.createElement("input");
						pathIndexInput.type = "text";
						pathIndexInput.size = "1";
						pathIndexInput.maxLength = "5";
						pathIndexInput.style.width = "7px";
						pathIndexInput.id = "step4-arrayinput-" + i + "-" + k;
						pathIndexInput.value = "";

						pathIndexInput.i = i;
						pathIndexInput.k = k;
						Event
								.observe(pathIndexInput, "blur",
										this.updateInputBoxes
												.bindAsEventListener(this));

						resultPathStep.appendChild(pathIndexInput);
						pathTextEnd = document.createTextNode("]");
						resultPathStep.appendChild(pathTextEnd);

						// the add-button
						var addButton = document.createElement("span");
						addButton.style.cursor = "pointer";
						var addButtonIMG = document.createElement("img");
						addButtonIMG.src = wgScriptPath
								+ "/extensions/SMWHalo/skins/webservices/Add.png";
						addButtonIMG.i = i;
						addButtonIMG.k = k;
						addButtonIMG.addA = true;
						Event.observe(addButtonIMG, "click",
								this.addRemoveResultPart
										.bindAsEventListener(this));

						addButton.appendChild(addButtonIMG);

						resultPathStep.appendChild(addButton);
					}

					if (i < this.preparedRPathSteps.length - 1) {
						if (this.preparedRPathSteps[i + 1][k] != null) {
							if (resultPathText == this.preparedRPathSteps[i + 1][k]["value"]
									|| resultPathText == "."
											+ this.preparedRPathSteps[i + 1][k]["value"]) {
								this.preparedRPathSteps[i][k]["i"] = i + 1;
								this.preparedRPathSteps[i][k]["k"] = k;
								aTreeRoot = true;
								this.preparedRPathSteps[i][k]["arrayIndexRoot"] = true;
								aTreeRootK = k;

								if (aTreeRootK == treeViewK) {
									this.preparedRPathSteps[i][k]["root"] = "true";
								}

								var expandPathStep = document
										.createElement("span");
								expandPathStep.id = "step4-expand-" + i + "-"
										+ k;
								expandPathStep.expanded = false;

								var expandIMG = document.createElement("img");
								expandIMG.src = wgScriptPath
										+ "/extensions/SMWHalo/skins/webservices/Plus.gif";
								expandIMG.i = i;
								expandIMG.k = k;
								var el = this.resultPathStepClick
										.bindAsEventListener(this)
								expandIMG.expand = true;
								Event.observe(expandIMG, "click", el);
								expandPathStep.appendChild(expandIMG);

								expandPathStep.style.cursor = "pointer";
								resultPathStep.insertBefore(expandPathStep,
										resultPathStep.firstChild);
							}
						}
					}

					if (i > 0) {
						if (this.preparedRPathSteps[i - 1][k] != null) {
							if (resultPathText == "."
									+ this.preparedRPathSteps[i - 1][k]["value"]
									|| resultPathText == this.preparedRPathSteps[i - 1][k]["value"]) {
								resultPathStep.style.visibility = "hidden";
								this.preparedRPathSteps[i][k]["arrayIndexRoot"] = false;
								treeView = true;
								treeViewK = k;
							}
						}
					}

					if (k == treeViewK && k != aTreeRootK) {
						var expandPathStep = document.createElement("span");
						var expandIMG = document.createElement("img");
						expandIMG.src = wgScriptPath
								+ "/extensions/SMWHalo/skins/webservices/Plus.gif";
						expandPathStep.appendChild(expandIMG);
						resultPathStep.insertBefore(expandPathStep,
								resultPathStep.firstChild);
					}
				}

				resultPath.id = "s4-path" + i;
				resultTD1.appendChild(resultPath);

				var resultTD2 = document.createElement("td");
				resultTD2.id = "step4-resultTD2-" + i;
				resultRow.appendChild(resultTD2);

				var aliasInput = document.createElement("input");
				aliasInput.id = "s4-alias" + i;
				aliasInput.size = "15";
				aliasInput.maxLength = "40";
				resultTD2.appendChild(aliasInput);

				if (aTreeRoot || treeView) {
					resultTD2.style.visibility = "hidden";
				}

				if (treeView) {
					resultRow.style.display = "none";
				}
				this.resultContainer.childNodes[0].appendChild(resultRow);
			}

			var parent = $("step4-results").parentNode;
			parent.removeChild($("step4-results"));
			var parent = $("step4");
			parent.insertBefore(this.resultContainer, parent.childNodes[3]);

			this.resultContainer = $("step4-results");

			// hide or display widgets of other steps
			if (!edit) {
				$("step4").style.display = "";

				$("menue-step2").className = "DoneMenueStep";
				$("menue-step3").className = "DoneMenueStep";
				if ($("menue-step4").className == "TodoMenueStep") {
					$("menue-step4").className = "ActualMenueStep";
				}

				$("step3-help").style.display = "none";
				$("step4-help").style.display = "";

				$("step3-img").style.visibility = "hidden";
				$("step4-img").style.visibility = "visible";

				$("step3-error").style.display = "none";
				$("errors").style.display = "none";
			}
		}

		// hide or display widgets of other steps
		if (!edit) {
			$("step4-error").style.display = "none";
			$("step5-error").style.display = "none";
			$("step6-error").style.display = "none";
			$("step6b-error").style.display = "none";
			$("step6c-error").style.display = "none";
		}
		this.hidePendingIndicator();
	},

	/**
	 * called when the user finishes step 4 define results initialises the gui
	 * for step-5 define update policy
	 * 
	 * @return
	 */
	processStep4 : function() {
		this.showPendingIndicator("step4-go");
		// hide or display widgets of other steps
		this.generateResultAliases(false);
		$("step5").style.display = "";

		$("menue-step4").className = "DoneMenueStep";
		$("menue-step5").className = "ActualMenueStep";
		$("step4-help").style.display = "none";
		$("step5-help").style.display = "";
		$("step4-img").style.visibility = "hidden";
		$("step5-img").style.visibility = "visible";

		$("step5-display-once").checked = true;
		$("step5-display-days").value = "";
		$("step5-display-hours").value = "";
		$("step5-display-minutes").value = "";

		$("step5-query-once").checked = true;
		$("step5-query-days").value = "";
		$("step5-query-hours").value = "";
		$("step5-query-minutes").value = "";
		$("step5-delay").value = "";

		$("step5-spanoflife").value = "";
		$("step5-expires-yes").checked = true;

		this.hidePendingIndicator();
	},

	/**
	 * called after step 5 specify query policy this method initializes the gui
	 * for step 6 specify wwsd-name
	 * 
	 * @param request
	 * 
	 */
	processStep5 : function() {
		// hide or display widgets of other steps
		$("step6").style.display = "";

		$("menue-step5").className = "DoneMenueStep";
		$("menue-step6").className = "ActualMenueStep";

		$("step5-help").style.display = "none";
		$("step6-help").style.display = "";
		$("step5-img").style.visibility = "hidden";
		$("step6-img").style.visibility = "visible";
		$("step6-name").value = "";
	},

	/**
	 * called after step 6 specify ws-name this method constructs the wwsd
	 */
	processStep6 : function() {
		this.showPendingIndicator("step6-go");
		if ($("step6-name").value.length > 0) {
			$("errors").style.display = "none";
			$("step6-error").style.display = "none";
			$("step6b-error").style.display = "none";
			$("step6c-error").style.display = "none";

			var result = "<WebService>\n";

			var uri = $("step1-uri").value;
			result += "<uri name=\"" + uri + "\" />\n";

			result += "<protocol>SOAP</protocol>\n";

			var method = $("step2-methods").value;
			result += "<method name=\"" + method + "\" />\n";

			for ( var i = 0; i < this.preparedPathSteps.length; i++) {
				if (this.preparedPathSteps[i] != "null") {
					if ($("s3-alias" + i).value.length == 0) {
						continue;
					}
					result += "<parameter name=\"" + $("s3-alias" + i).value
							+ "\" ";
					var optional = this.parameterContainer.firstChild.childNodes[i + 1].childNodes[2].firstChild.checked;
					result += " optional=\"" + optional + "\" ";

					var defaultValue = this.parameterContainer.firstChild.childNodes[i + 1].childNodes[3].firstChild.value;
					if (defaultValue != "") {
						if (defaultValue != "") {
							result += " defaultValue=\"" + defaultValue + "\" ";
						}
					}
					var path = "";
					for ( var k = 0; k < this.preparedPathSteps[i].length; k++) {
						var pathStep = "";
						if (k > 0) {
							pathStep += ".";
						}
						pathStep += this.preparedPathSteps[i][k]["value"];
						if (pathStep.lastIndexOf("(") > 0) {
							pathStep = pathStep.substr(0, pathStep
									.lastIndexOf("(") - 1);
						}
						if (pathStep.lastIndexOf("[") > 0) {
							pathStep = pathStep.substring(0, pathStep
									.lastIndexOf("["));
							pathStep += "[";
							pathStep += $("step3-arrayspan-" + i + "-" + k).firstChild.nodeValue;
							pathStep += "]";
						}
						if (pathStep != ".") {
							path += pathStep;
						}
					}
					result += " path=\"" + path + "\" />\n";
				}
			}
			result += "<result name=\"result\" >\n";

			for (i = 0; i < this.preparedRPathSteps.length; i++) {
				if (this.preparedRPathSteps[i] != "null") {
					if (this.resultContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value.length == 0) {
						continue;
					}
					var rPath = "";
					for (k = 1; k < this.preparedRPathSteps[i].length; k++) {
						var rPathStep = "";

						if (k > 1) {
							rPathStep += ".";
						}
						rPathStep += this.preparedRPathSteps[i][k]["value"];

						if (rPathStep.lastIndexOf("(") > 0) {
							rPathStep = rPathStep.substr(0, rPathStep
									.lastIndexOf("(") - 1);
						}
						if (rPathStep.lastIndexOf("[") > 0) {
							rPathStep = rPathStep.substring(0, rPathStep
									.lastIndexOf("["));
							rPathStep += "[";
							rPathStep += $("step4-arrayinput-" + i + "-" + k).value;
							rPathStep += "]";
						}
						if (rPathStep != ".") {
							rPath += rPathStep;
						}
					}

					result += "<part name=\""
							+ this.resultContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value
							+ "\" ";
					result += " path=\"" + rPath + "\" />\n";

				}
			}
			result += "</result>\n";

			result += "<displayPolicy>\n"
			if ($("step5-display-once").checked == true) {
				result += "<once/>\n";
			} else {
				result += "<maxAge value=\"";
				var minutes = 0;
				minutes += $("step5-display-days").value * 60 * 24;
				minutes += $("step5-display-hours").value * 60;
				minutes += $("step5-display-minutes").value * 1;
				result += minutes;
				result += "\"></maxAge>\n";
			}
			result += "</displayPolicy>\n"

			result += "<queryPolicy>\n"
			if ($("step5-query-once").checked == true) {
				result += "<once/>\n";
			} else {
				result += "<maxAge value=\"";
				minutes = 0;
				minutes += $("step5-query-days").value * 60 * 24;
				minutes += $("step5-query-hours").value * 60;
				minutes += $("step5-query-minutes").value * 1;
				result += minutes;
				result += "\"></maxAge>\n";
			}
			var delay = $("step5-delay").value;
			if (delay.length == 0) {
				delay = 0;
			}
			result += "<delay value=\"" + delay + "\"/>\n";
			result += "</queryPolicy>\n"
			result += "<spanOfLife value=\""
					+ (0 + $("step5-spanoflife").value * 1);
			if ($("step5-expires-yes").checked) {
				result += "\" expiresAfterUpdate=\"true\" />\n";
			} else {
				result += "\" expiresAfterUpdate=\"false\" />\n";
			}
			result += "</WebService>";
			this.wwsd = result;
			var wsName = $("step6-name").value;

			// the three additional "#" tell the ws-syntax processor not to
			// process
			// this ws-syntax
			var wsSyntax = "\n== Syntax for using the WWSD in an article==";
			wsSyntax += "\n<nowiki>{{#ws: " + $("step6-name").value
					+ "</nowiki>\n";
			parameters = this.preparedPathSteps;
			for (i = 0; i < parameters.length; i++) {
				if (this.preparedPathSteps[i] != "null") {
					if (this.parameterContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value.length == 0) {
						continue;
					}
					wsSyntax += "| "
							+ this.parameterContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value
							+ " = [Please enter a value here]\n";
				}
			}

			results = this.preparedRPathSteps;
			for (i = 0; i < results.length; i++) {
				if (this.preparedRPathSteps[i] != "null") {
					if (this.resultContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value.length == 0) {
						continue;
					}
					wsSyntax += "| ?result."
							+ this.resultContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value
							+ "\n";
				}
			}
			wsSyntax += "}}";

			this.wsSyntax = wsSyntax;

			sajax_do_call("smwf_om_ExistsArticle", [ "webservice:" + wsName ],
					this.processStep6CallBack.bind(this));
		} else {
			$("errors").style.display = "";
			$("step6-error").style.display = "";
			$("step6b-error").style.display = "none";
			$("step6c-error").style.display = "none";
		}

	},

	processStep6CallBack : function(request) {
		if (request.responseText == "false" || this.editMode == true) {
			var wsName = $("step6-name").value;
			// sajax_do_call("smwf_om_EditArticle", [ "webservice:" + wsName,
			// wgUserName, this.wwsd + this.wsSyntax, "" ],
			// this.processStep6CallBack1.bind(this));
			var wsName = $("step6-name").value;
			sajax_do_call("smwf_ws_processStep6", [ wsName, this.wwsd,
					wgUserName, this.wsSyntax ], this.processStep6CallBack1
					.bind(this));
		} else {
			$("errors").style.display = "";
			$("step6b-error").style.display = "";
			$("step6-error").style.display = "none";
			$("step6c-error").style.display = "none";
			this.hidePendingIndicator();
		}
	},

	/**
	 * callback method for step-6 this method initializes the gui for step which
	 * provides an example for the #ws-syntax
	 * 
	 */
	processStep6CallBack1 : function(request) {
		if (request.responseText == "true") {
			var container = $("step7-container").cloneNode(false);
			$("step7-container").id = "old-step7-container";
			$("old-step7-container").parentNode.insertBefore(container,
					$("old-step7-container"));
			$("old-step7-container").parentNode
					.removeChild($("old-step7-container"));

			var step7Container = $("step7-container").cloneNode(true);

			var wsNameText = document.createTextNode(document
					.getElementById("step6-name").value);
			$("step7-name").appendChild(wsNameText);

			var rowDiv = document.createElement("div");
			var rowText = document.createTextNode("{{#ws: "
					+ $("step6-name").value);
			rowDiv.appendChild(rowText);
			step7Container.appendChild(rowDiv);

			var parameters = this.preparedPathSteps;
			for (i = 0; i < parameters.length; i++) {
				if (this.preparedPathSteps[i] != "null") {
					if (this.parameterContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value.length == 0) {
						continue;
					}
					rowDiv = document.createElement("div");
					rowDiv.className = "OuterLeftIndent";
					rowText = document
							.createTextNode("| "
									+ this.parameterContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value
									+ " = [Please enter a value here]");
					rowDiv.appendChild(rowText);
					step7Container.appendChild(rowDiv);
				}
			}

			var results = this.preparedRPathSteps;
			for (i = 0; i < results.length; i++) {
				if (this.preparedRPathSteps[i] != "null") {
					if (this.resultContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value.length == 0) {
						continue;
					}
					rowDiv = document.createElement("div");
					rowDiv.className = "OuterLeftIndent";
					rowText = document
							.createTextNode("| ?result."
									+ this.resultContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value);
					rowDiv.appendChild(rowText);
					step7Container.appendChild(rowDiv);
				}
			}

			rowDiv = document.createElement("div");
			rowText = document.createTextNode("}}");
			rowDiv.appendChild(rowText);
			step7Container.appendChild(rowDiv);

			var parentOf = $("step7-container").parentNode;
			parentOf.insertBefore(step7Container, $("step7-container"));
			parentOf.removeChild(parentOf.childNodes[6]);

			$("step7").style.display = "";
			$("step1").style.display = "none";
			$("step2").style.display = "none";
			$("step3").style.display = "none";
			$("step4").style.display = "none";
			$("step5").style.display = "none";
			$("step6").style.display = "none";
			$("step6-help").style.display = "none";
			$("menue").style.display = "none";
			$("help").style.display = "none";

			this.hidePendingIndicator();
		} else {
			$("errors").style.display = "";
			$("step6b-error").style.display = "none";
			$("step6-error").style.display = "none";
			$("step6c-error").style.display = "";
			this.hidePendingIndicator();
		}
	},

	/**
	 * called after step 7 this method initializes the gui for step 1
	 * 
	 */
	processStep7 : function(request) {
		this.step = "step1";
		$("step1-img").style.visibility = "visible";
		$("step1-help").style.display = "";
		$("step7").style.display = "none";
		$("menue").style.display = "";
		$("menue-step2").style.fontWeight = "normal";
		$("menue-step3").style.fontWeight = "normal";
		$("menue-step4").style.fontWeight = "normal";
		$("menue-step5").style.fontWeight = "normal";
		$("menue-step6").style.fontWeight = "normal";
		$("help").style.display = "";
		$("step1").style.display = "";
		$("step1-uri").Value = "";
	},

	/**
	 * this method is responsible for automatic alias-creation in step 3 specify
	 * parameters boolean createAll : create aliases for empty alias-fields
	 * 
	 */
	generateParameterAliases : function(createAll) {
		var aliases = new Array();
		var aliasesObject = new Object();

		var offset = 0;
		for (i = 0; i < this.preparedPathSteps.length; i++) {
			if (this.preparedPathSteps[i] != "null") {
				var alias = this.parameterContainer.firstChild.childNodes[i + 1
						- offset].childNodes[1].firstChild.value;
				if (alias.length == 0 && !createAll) {
					continue;
				}
				if (alias.length == 0) {
					alias = this.preparedPathSteps[i][this.preparedPathSteps[i].length - 1]["value"];

					var openBracketPos = alias.lastIndexOf("(");
					if (openBracketPos > 0) {
						alias = alias.substr(0, openBracketPos - 1);
					}

					openBracketPos = alias.lastIndexOf("[");
					if (openBracketPos > 0) {
						alias = alias.substr(0, openBracketPos);
					}

					var dotPos = alias.lastIndexOf(".");
					alias = alias.substr(dotPos + 1);
				}

				var goon = true;
				var aliasTemp = alias;
				var k = 0;

				while (goon) {
					if (aliasesObject[aliasTemp] != 1) {
						goon = false;
						alias = aliasTemp;
						aliasesObject[alias] = 1;
					} else {
						aliasTemp = alias + "-" + k;
						k++;
					}
				}

				this.parameterContainer.firstChild.childNodes[i + 1 - offset].childNodes[1].firstChild.value = alias;
				aliases.push(alias);
			} else {
				offset += 1;
			}
		}
	},

	generateResultAliases : function(createAll) {
		var resultsCount = this.preparedRPathSteps.length;
		var offset = 0;
		var aliases = new Array();
		var aliasesObject = new Object();

		for (i = 0; i < resultsCount; i++) {
			if (this.preparedRPathSteps[i] != "null") {
				var alias = this.resultContainer.firstChild.childNodes[i + 1
						- offset].childNodes[1].firstChild.value;
				if (alias.length == 0 && !createAll) {
					continue;
				}
				if (alias.length == 0) {
					alias = this.preparedRPathSteps[i][this.preparedRPathSteps[i].length - 1]["value"];
				}
				if (alias == "]") {
					alias = "";
				}
				var openBracketPos = alias.lastIndexOf("(");
				if (openBracketPos != -1) {
					alias = alias.substr(0, openBracketPos - 1);
				}
				var openBracketPos = alias.lastIndexOf("[");
				if (openBracketPos != -1) {
					alias = alias.substr(0, openBracketPos);
				}

				if (alias.length == 0) {
					alias = "result";
				}

				var goon = true;
				var aliasTemp = alias;
				var k = 0;

				while (goon) {
					if (aliasesObject[aliasTemp] != 1) {
						goon = false;
						alias = aliasTemp;
						aliasesObject[alias] = 1;
					} else {
						aliasTemp = alias + "-" + k;
						k++;
					}
				}

				this.resultContainer.firstChild.childNodes[i + 1 - offset].childNodes[1].firstChild.value = alias;
				aliases.push(alias);
			} else {
				offset += 1;
			}
		}
	},

	/**
	 * this method is responsible for adding new parameters respectivelyin
	 * parameters that are not used any more in step 3
	 * 
	 * @param event
	 *            from the event handler
	 * 
	 * 
	 */
	addRemoveParameter : function(event) {
		var node = Event.element(event);
		var i = node.i * 1;
		var k = node.k * 1;

		if (node.addA) {
			// find position where to insert the new rows

			var goon = true;
			var m = i;
			var nextSibling = null;
			var goon = true;
			var appendIndex = i;

			paramsContainerNode = $("step3-parameters");
			rowIndex = $("step3-paramRow-" + m).rowIndex;
			while (goon) {
				rowIndex += 1;
				nextSibling = paramsContainerNode.firstChild.childNodes[rowIndex];
				if (nextSibling != null) {
					if (this.preparedPathSteps[m] != "null") {
						m = nextSibling.id.substr(nextSibling.id
								.lastIndexOf("-") + 1);
						if (this.preparedPathSteps[m][k] != null) {
							if (this.preparedPathSteps[m][k]["value"] == this.preparedPathSteps[i][k]["value"]) {
								appendIndex = m;
							} else {
								goon = false;
							}
						} else {
							goon = false;
						}
					} else {
						goon = false;
					}
				} else {
					goon = false;
				}
			}

			var rememberedIs = new Array();
			for ( var s = 0; s < k; s++) {
				rememberedIs.push(this.preparedPathSteps[appendIndex][s]["i"]);
				this.preparedPathSteps[appendIndex][s]["i"] = this.preparedPathSteps.length;
				this.preparedPathSteps[appendIndex][s]["k"] = s;
			}

			// get nodes to insert
			var goon = true;
			var appendRows = new Array();
			var appendRowsIndex = i;
			var lastC = i - 1;
			rowIndex = $("step3-paramRow-" + appendRowsIndex).rowIndex;
			while (goon) {
				if (appendRowsIndex == lastC + 1) {
					var tAR = paramsContainerNode.firstChild.childNodes[rowIndex];
					appendRows.push(tAR);
					lastC = appendRowsIndex;
				}
				if (this.preparedPathSteps[appendRowsIndex][k]["i"] != "null") {
					appendRowsIndex = this.preparedPathSteps[appendRowsIndex][k]["i"];
				} else {
					goon = false;
				}
				rowIndex += 1;
			}

			// create new row
			var newI = this.preparedPathSteps.length;

			for (m = 0; m < appendRows.length; m++) {
				var appendRow = appendRows[m].cloneNode(true);

				appendRow.id = "step3-paramRow-" + newI;

				appendRow.childNodes[0].id = "step3-paramTD0-" + newI;
				var pathSteps = appendRow.childNodes[0].childNodes[0].childNodes;

				appendRow.childNodes[0].childNodes[0].id = "s3-path" + newI;

				var objectRow = new Array();
				for (r = 0; r < pathSteps.length; r++) {
					pathSteps[r].id = "s3-pathstep-" + newI + "-" + r;
					if (r < k) {
						pathSteps[r].style.visibility = "hidden";
					}
					// an aTreeRoot
					if (pathSteps[r].childNodes.length == 2) {
						pathSteps[r].firstChild.id = "step3-expand-" + newI
								+ "-" + r;
						pathSteps[r].firstChild.firstChild.i = newI;
						pathSteps[r].firstChild.firstChild.k = r;
						if (pathSteps[r].firstChild.firstChild.expand == null) {
							if (pathSteps[r].firstChild.firstChild.src == wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/Plus.gif") {
								pathSteps[r].firstChild.firstChild.expand = true;
								pathSteps[r].firstChild.expanded = false;
							} else {
								pathSteps[r].firstChild.firstChild.expand = false;
								pathSteps[r].firstChild.expanded = true;
							}
							var el = this.paramPathStepClick
									.bindAsEventListener(this);
							pathSteps[r].firstChild.firstChild.el = el;
							Event.observe(pathSteps[r].firstChild.firstChild,
									"click", el);
						}
					} // an array
					else if (pathSteps[r].childNodes.length == 4) {
						pathSteps[r].childNodes[1].id = "step3-arrayspan-"
								+ newI + "-" + r;

						if (pathSteps[r].childNodes[3].firstChild.addA == null) {
							var el = this.addRemoveParameter
									.bindAsEventListener(this);
							Event.observe(
									pathSteps[r].childNodes[3].firstChild,
									"click", el);
						}

						pathSteps[r].childNodes[3].firstChild.i = newI;
						pathSteps[r].childNodes[3].firstChild.k = r;
						if (r <= k) {
							pathSteps[r].childNodes[3].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/delete.png";

							pathSteps[r].childNodes[3].firstChild.addA = false;
							pathSteps[r].childNodes[1].firstChild.nodeValue = this.preparedPathSteps[i
									+ m][r]["arrayIndex"] + 1;
						} else {
							pathSteps[r].childNodes[3].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/Add.png";

							pathSteps[r].childNodes[3].firstChild.addA = true;

							pathSteps[r].childNodes[1].firstChild.nodeValue = 1;
						}
						if (r == k) {
							this.preparedPathSteps[i + m][r]["arrayIndexUsers"]
									.push(newI + "-" + r);
							this.preparedPathSteps[i + m][r]["arrayIndex"] = (this.preparedPathSteps[i
									+ m][r]["arrayIndex"] * 1) + 1;
						}
					} // both
					else if (pathSteps[r].childNodes.length == 5) {
						pathSteps[r].firstChild.id = "step3-expand-" + newI
								+ "-" + r;
						pathSteps[r].firstChild.src = wgScriptPath
								+ "/extensions/SMWHalo/skins/webservices/delete.gif";

						pathSteps[r].firstChild.firstChild.i = newI;
						Event.stopObserving(pathSteps[r].firstChild.firstChild,
								"click", pathSteps[r].firstChild.firstChild.el);

						pathSteps[r].firstChild.firstChild.k = r;
						if (pathSteps[r].firstChild.firstChild.expand == null) {
							if (pathSteps[r].firstChild.firstChild.src
									.indexOf("Plus.gif") != -1) {
								pathSteps[r].firstChild.firstChild.expand = true;
								pathSteps[r].firstChild.expanded = false;
							} else {
								pathSteps[r].firstChild.firstChild.expand = false;
								pathSteps[r].firstChild.expanded = true;
							}
							var el = this.paramPathStepClick
									.bindAsEventListener(this);
							Event.observe(pathSteps[r].firstChild.firstChild,
									"click", el);
						}
						if (pathSteps[r].childNodes[4].firstChild.addA == null) {
							var el = this.addRemoveParameter
									.bindAsEventListener(this);
							Event.observe(
									pathSteps[r].childNodes[4].firstChild,
									"click", el);
						}
						if (r <= k) {
							pathSteps[r].childNodes[4].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/delete.png";

							pathSteps[r].childNodes[4].firstChild.i = newI;
							pathSteps[r].childNodes[4].firstChild.k = r;

							pathSteps[r].childNodes[4].firstChild.addA = false;

							pathSteps[r].childNodes[2].firstChild.nodeValue = this.preparedPathSteps[i
									+ m][r]["arrayIndex"] + 1;
						} else {
							pathSteps[r].childNodes[4].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/Add.png";

							pathSteps[r].childNodes[4].firstChild.i = newI;
							pathSteps[r].childNodes[4].firstChild.k = r;

							pathSteps[r].childNodes[4].firstChild.addA = true;

							pathSteps[r].childNodes[2].firstChild.nodeValue = 1;
						}
						if (r == k) {
							this.preparedPathSteps[i + m][r]["arrayIndexUsers"]
									.push(newI + "-" + r);
							this.preparedPathSteps[i + m][r]["arrayIndex"] = (this.preparedPathSteps[i
									+ m][r]["arrayIndex"] * 1) + 1;
						}
						pathSteps[r].childNodes[2].id = "step3-arrayspan-"
								+ newI + "-" + r;
					}

					var tO = new Object();
					tO["value"] = this.preparedPathSteps[i + m][r]["value"];
					if (this.preparedPathSteps[i + m][r]["i"] != "null") {
						tO["i"] = newI + 1;
						tO["k"] = this.preparedPathSteps[i + m][r]["k"];
					} else {
						tO["i"] = "null";
						tO["k"] = "null";
					}
					if (m == 0 && r == k) {
						tO["arrayIndexRoot"] = true;
					}
					if (this.preparedPathSteps[i + m][r]["arrayIndex"] != "null") {
						if (r <= k) {
							tO["arrayIndexOrigin"] = (i + m) + "-" + r;
							tO["arrayIndex"] = this.preparedPathSteps[i + m][r]["arrayIndex"];
						} else {
							tO["arrayIndex"] = 1;
							tO["arrayIndexOrigin"] = null;
						}
						tO["arrayIndexUsers"] = new Array();
					}
					tO["root"] = this.preparedPathSteps[i + m][r]["root"];

					objectRow.push(tO);

				}

				appendRow.childNodes[1].id = "step3-paramTD1-" + newI;

				appendRow.childNodes[1].childNodes[0].id = "s3-alias" + newI;

				appendRow.childNodes[2].id = "step3-paramTD2-" + newI;
				appendRow.childNodes[2].childNodes[0].id = "s3-optional-true"
						+ newI;
				appendRow.childNodes[2].childNodes[0].name = "s3-optional-radio"
						+ newI;
				appendRow.childNodes[2].childNodes[3].id = "s3-optional-false"
						+ newI;
				appendRow.childNodes[2].childNodes[3].name = "s3-optional-radio"
						+ newI;

				appendRow.childNodes[3].id = "step3-paramTD3-" + newI;
				appendRow.childNodes[3].childNodes[0].id = "s3-default" + newI;

				newI += 1;

				this.preparedPathSteps.push(objectRow);

				if (nextSibling == null) {
					paramsContainerNode.childNodes[0].appendChild(appendRow);
				} else {
					paramsContainerNode.childNodes[0].insertBefore(appendRow,
							nextSibling);
				}
			}
			for (s = 0; s < rememberedIs.length; s++) {
				this.preparedPathSteps[this.preparedPathSteps.length - 1][s]["i"] = rememberedIs[s];
			}
		} else {
			var goon = true;

			var prevSibling = $("step3-paramRow-" + i).previousSibling;
			var prevI = prevSibling.id
					.substr(prevSibling.id.lastIndexOf("-") + 1);

			paramsContainerNode = $("step3-parameters");
			rowIndex = $("step3-paramRow-" + i).rowIndex;

			while (goon) {
				removeNode = paramsContainerNode.firstChild.childNodes[rowIndex];
				paramsContainerNode.firstChild.removeChild(removeNode);

				var iTemp = i;
				if (this.preparedPathSteps[i][k]["arrayIndex"] != "null") {
					var tempArrayIndexO = this.preparedPathSteps[i][k]["arrayIndexOrigin"];
					var tempArrayIndex = this.preparedPathSteps[i][k]["arrayIndex"];

					s = tempArrayIndexO.substr(0, tempArrayIndexO.indexOf("-"));
					w = tempArrayIndexO.substr(
							tempArrayIndexO.indexOf("-") + 1,
							tempArrayIndexO.length);
					this.preparedPathSteps[s][w]["arrayIndex"] = this.preparedPathSteps[s][w]["arrayIndex"] - 1;

					var users = this.preparedPathSteps[s][w]["arrayIndexUsers"];
					if (users == null) {
						users = new Array();
					}
					// todo: here the performance is improvable by removing the
					// $-access
					for ( var c = 0; c < users.length; c++) {
						s = users[c].substr(0, users[c].indexOf("-"));
						w = users[c].substr(users[c].indexOf("-") + 1,
								users[c].length);
						if (this.preparedPathSteps[s][w]["arrayIndex"] * 1 > tempArrayIndex) {
							this.preparedPathSteps[s][w]["arrayIndex"] = this.preparedPathSteps[s][w]["arrayIndex"] * 1 - 1
							if ($("s3-pathstep-" + s + "-" + w).childNodes.length == 4) {
								$("s3-pathstep-" + s + "-" + w).childNodes[1].firstChild.nodeValue = this.preparedPathSteps[s][w]["arrayIndex"];
							} else {
								$("s3-pathstep-" + s + "-" + w).childNodes[2].firstChild.nodeValue = this.preparedPathSteps[s][w]["arrayIndex"];
							}
						}
					}
				}

				if (this.preparedPathSteps[i][k]["i"] != "null") {
					i = this.preparedPathSteps[i][k]["i"];
				} else {
					goon = false;
				}
				this.preparedPathSteps[iTemp] = "null";
			}

			var nextSibling = prevSibling.nextSibling;
			if (nextSibling == null) {
				var nextI = "null";
			} else {
				var nextI = nextSibling.id.substr(nextSibling.id
						.lastIndexOf("-") + 1);
			}
			for (r = 0; r <= k; r++) {
				if (this.preparedPathSteps[prevI][r]["i"] != "null") {
					if ($("step3-paramRow-"
							+ this.preparedPathSteps[prevI][r]["i"]) == null) {
						this.preparedPathSteps[prevI][r]["i"] = nextI;
					}
				}
			}
		}
	},

	/**
	 * this method is responsible for adding new result parts respectivelyin
	 * result parts that are not used any more in step 4
	 * 
	 * @param event
	 *            from the event handler
	 * 
	 * 
	 */
	addRemoveResultPart : function(event) {
		var node = Event.element(event);
		var i = node.i * 1;
		var k = node.k * 1;
		if (node.addA) {
			// find position where to insert the new rows
			var goon = true;
			var m = i;
			var nextSibling = null;
			var goon = true;
			var appendIndex = i;
			resultsContainerNode = $("step4-results");
			rowIndex = $("step4-resultRow-" + m).rowIndex;
			while (goon) {
				rowIndex += 1;
				nextSibling = resultsContainerNode.firstChild.childNodes[rowIndex];
				if (nextSibling != null) {
					if (this.preparedRPathSteps[m] != "null") {
						m = nextSibling.id.substr(nextSibling.id
								.lastIndexOf("-") + 1);
						if (this.preparedRPathSteps[m][k] != null) {
							if (this.preparedRPathSteps[m][k]["value"] == this.preparedRPathSteps[i][k]["value"]) {
								appendIndex = m;
							} else {
								goon = false;
							}
						} else {
							goon = false;
						}
					} else {
						goon = false;
					}
				} else {
					goon = false;
				}
			}
			var rememberedIs = new Array();
			for ( var s = 0; s < k; s++) {
				rememberedIs.push(this.preparedRPathSteps[appendIndex][s]["i"]);
				this.preparedRPathSteps[appendIndex][s]["i"] = this.preparedRPathSteps.length;
				this.preparedRPathSteps[appendIndex][s]["k"] = s;
			}

			// get nodes to insert
			var goon = true;
			var appendRows = new Array();
			var appendRowsIndex = i;
			var lastC = i - 1;

			rowIndex = $("step4-resultRow-" + appendRowsIndex).rowIndex;
			while (goon) {
				if (appendRowsIndex == lastC + 1) {
					var tAR = resultsContainerNode.firstChild.childNodes[rowIndex];
					appendRows.push(tAR);
					lastC = appendRowsIndex;
				}
				if (this.preparedRPathSteps[appendRowsIndex][k]["i"] != "null") {
					appendRowsIndex = this.preparedRPathSteps[appendRowsIndex][k]["i"];
				} else {
					goon = false;
				}
				rowIndex += 1;
			}

			// create new row
			var newI = this.preparedRPathSteps.length;
			appendRowsIndex = i;

			for (m = 0; m < appendRows.length; m++) {
				var appendRow = appendRows[m].cloneNode(true);

				appendRow.id = "step4-resultRow-" + newI;

				appendRow.childNodes[0].id = "step4-resultTD1-" + newI;
				var pathSteps = appendRow.childNodes[0].childNodes[0].childNodes;

				appendRow.childNodes[0].childNodes[0].id = "s4-path" + newI;

				var objectRow = new Array();
				for (r = 0; r < pathSteps.length; r++) {
					pathSteps[r].id = "s4-pathstep-" + newI + "-" + r;
					if (r < k) {
						pathSteps[r].style.visibility = "hidden";
					}
					// an aTreeRoot
					if (pathSteps[r].childNodes.length == 2) {
						pathSteps[r].firstChild.id = "step4-expand-" + newI
								+ "-" + r;

						pathSteps[r].firstChild.firstChild.i = newI;
						pathSteps[r].firstChild.firstChild.k = r;

						if (pathSteps[r].firstChild.firstChild.expand == null) {
							if (pathSteps[r].firstChild.firstChild.src == wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/Plus.gif") {
								pathSteps[r].firstChild.firstChild.expand = true;
								pathSteps[r].firstChild.expanded = false;
							} else {
								pathSteps[r].firstChild.firstChild.expand = false;
								pathSteps[r].firstChild.expanded = true;
							}
							var el = this.resultPathStepClick
									.bindAsEventListener(this);
							Event.observe(pathSteps[r].firstChild.firstChild,
									"click", el);
						}
					} // an array
					else if (pathSteps[r].childNodes.length == 4) {
						pathSteps[r].childNodes[1].id = "step4-arrayinput-"
								+ newI + "-" + r;
						pathSteps[r].childNodes[1].setAttribute("onblur",
								"webServiceSpecial.updateInputBoxes(" + newI
										+ "," + r + ")");

						pathSteps[r].childNodes[3].firstChild.i = newI;
						pathSteps[r].childNodes[3].firstChild.k = r;

						if (pathSteps[r].childNodes[3].firstChild.addA == null) {
							var el = this.addRemoveResultPart
									.bindAsEventListener(this);
							Event.observe(
									pathSteps[r].childNodes[3].firstChild,
									"click", el);
						}

						if (r <= k) {
							pathSteps[r].childNodes[3].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/delete.png";

							pathSteps[r].childNodes[3].firstChild.addA = false;
						} else {
							pathSteps[r].childNodes[3].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/Add.png";

							pathSteps[r].childNodes[3].firstChild.addA = true;
						}

						if (pathSteps[r].childNodes[1].i == null) {
							Event.observe(pathSteps[r].childNodes[1], "blur",
									this.updateInputBoxes
											.bindAsEventListener(this));
						}
						pathSteps[r].childNodes[1].i = newI;
						pathSteps[r].childNodes[1].k = r;
					} // both
					else if (pathSteps[r].childNodes.length == 5) {
						pathSteps[r].childNodes[2].id = "step4-arrayinput-"
								+ newI + "-" + r;

						pathSteps[r].childNodes[4].firstChild.i = newI;
						pathSteps[r].childNodes[4].firstChild.k = r;

						if (pathSteps[r].childNodes[4].firstChild.addA == null) {
							var el = this.addRemoveResultPart
									.bindAsEventListener(this);
							Event.observe(
									pathSteps[r].childNodes[4].firstChild,
									"click", el);
						}
						if (r <= k) {
							pathSteps[r].childNodes[4].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/delete.png";
							pathSteps[r].childNodes[4].firstChild.addA = false;
						} else {
							pathSteps[r].childNodes[4].firstChild.src = wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/Add.png";

							pathSteps[r].childNodes[4].firstChild.addA = true;
						}

						pathSteps[r].firstChild.id = "step4-expand-" + newI
								+ "-" + r;
						pathSteps[r].firstChild.firstChild.i = newI;
						pathSteps[r].firstChild.firstChild.k = r;

						pathSteps[r].firstChild.src = wgScriptPath
								+ "/extensions/SMWHalo/skins/webservices/delete.gif";
						if (pathSteps[r].firstChild.firstChild.expand == null) {
							if (pathSteps[r].firstChild.firstChild.src == wgScriptPath
									+ "/extensions/SMWHalo/skins/webservices/Plus.gif") {
								pathSteps[r].firstChild.firstChild.expand = true;
							} else {
								pathSteps[r].firstChild.firstChild.expand = false;
							}
							var el = this.resultPathStepClick
									.bindAsEventListener(this);
							Event.observe(pathSteps[r].firstChild.firstChild,
									"click", el);
						}

						if (pathSteps[r].childNodes[2].i == null) {
							Event.observe(pathSteps[r].childNodes[2], "blur",
									this.updateInputBoxes
											.bindAsEventListener(this));
						}
						pathSteps[r].childNodes[2].i = newI;
						pathSteps[r].childNodes[2].k = r;

						if (appendRows[m].childNodes[0].childNodes[0].childNodes[r].firstChild.id == "step4-expand-"
								+ (i * 1 + m) + "-" + r) {
							pathSteps[r].firstChild.expanded = appendRows[m].childNodes[0].childNodes[0].childNodes[r].firstChild.expanded;
						}
					}

					var tO = new Object();
					tO["value"] = this.preparedRPathSteps[i + m][r]["value"];
					if (this.preparedRPathSteps[i + m][r]["i"] != "null") {
						tO["i"] = newI + 1;
						tO["k"] = this.preparedRPathSteps[i + m][r]["k"];
					} else {
						tO["i"] = "null";
						tO["k"] = "null";
					}

					if (m == 0 && k == r) {
						tO["arrayIndexRoot"] = true;
					}

					tO["root"] = this.preparedRPathSteps[i + m][r]["root"];
					objectRow.push(tO);
				}

				appendRow.childNodes[1].id = "step4-resultTD2-" + newI;

				appendRow.childNodes[1].childNodes[0].id = "s4-alias" + newI;

				// insert element

				newI += 1;
				appendIndex += 1;

				this.preparedRPathSteps.push(objectRow);

				if (nextSibling == null) {
					resultsContainerNode.childNodes[0].appendChild(appendRow);
				} else {
					resultsContainerNode.childNodes[0].insertBefore(appendRow,
							nextSibling);
				}
			}

			for (s = 0; s < rememberedIs.length; s++) {
				this.preparedRPathSteps[this.preparedRPathSteps.length - 1][s]["i"] = rememberedIs[s];
			}
		} else {
			var goon = true;

			var prevSibling = $("step4-resultRow-" + i).previousSibling;
			var prevI = prevSibling.id
					.substr(prevSibling.id.lastIndexOf("-") + 1);

			resultsContainerNode = $("step4-results");
			rowIndex = $("step4-resultRow-" + i).rowIndex;
			while (goon) {
				removeNode = resultsContainerNode.firstChild.childNodes[rowIndex];
				resultsContainerNode.firstChild.removeChild(removeNode);
				var iTemp = i;
				if (this.preparedRPathSteps[i][k]["i"] != "null") {
					i = this.preparedRPathSteps[i][k]["i"];
				} else {
					goon = false;
				}
				this.preparedRPathSteps[iTemp] = "null";
			}

			var nextSibling = prevSibling.nextSibling;
			if (nextSibling == null) {
				var nextI = "null";
			} else {
				var nextI = nextSibling.id.substr(nextSibling.id
						.lastIndexOf("-") + 1);
			}

			for (r = 0; r <= k; r++) {
				if (this.preparedRPathSteps[prevI][r]["i"] != "null") {
					if ($("step4-resultRow-"
							+ this.preparedRPathSteps[prevI][r]["i"]) == null) {
						this.preparedRPathSteps[prevI][r]["i"] = nextI;
					}
				}
			}
		}
	},

	/**
	 * The method checks if the enter button was pressed in a input-element and
	 * calls the right method
	 * 
	 * @param event :
	 *            the keyevent
	 * @param string
	 *            step : defines which process step to call
	 */
	checkEnterKey : function(event, step) {
		var key;
		if (window.event) {
			key = window.event.keyCode; // IE
		} else {
			key = event.which;
		}

		if (key == 13) {
			if (step == "step1") {
				this.processStep1();
				this.showPendingIndicator("step1-go");
			} else if (step == "step6") {
				this.processStep6();
				this.showPendingIndicator("step6-go");
			}
		}
	},

	selectRadio : function(radioId) {
		$(radioId).checked = true;
	},

	selectRadioOnce : function(radioId) {
		if (radioId == "step5-display-once") {
			$("step5-display-days").value = "";
			$("step5-display-hours").value = "";
			$("step5-display-minutes").value = "";
		} else if (radioId == "step5-query-once") {
			$("step5-query-days").value = "";
			$("step5-query-hours").value = "";
			$("step5-query-minutes").value = "";
		}
	},

	/**
	 * used for the click event in the tree view of step 3
	 * 
	 * @param event
	 * @return
	 */
	paramPathStepClick : function(event) {
		var node = Event.element(event);
		Event.stop(event);

		if (node.expand) {
			this.expandParamPathStep(node.i, node.k);
			node.expand = false;
		} else {
			this.contractParamPathStep(node.i, node.k);
			node.expand = true;
		}
	},

	/**
	 * used to expand the elements of the tree view in step 3
	 * 
	 * @param i
	 * @param k
	 * @return
	 */
	expandParamPathStep : function(i, k) {
		i = i * 1;
		k = k * 1;

		var r = $("step3-paramRow-" + i).rowIndex;

		this.parameterContainer.firstChild.childNodes[r].firstChild.firstChild.childNodes[k].firstChild.firstChild.src = wgScriptPath
				+ "/extensions/SMWHalo/skins/webservices/Minus.gif";
		this.parameterContainer.firstChild.childNodes[r].firstChild.firstChild.childNodes[k].firstChild.expanded = true;

		var goon = true;
		r = r - 1;
		while (goon) {
			r = r + 1;
			var display = true;
			var complete = true;
			for ( var m = k * 1 + 1; m < this.preparedPathSteps[i].length; m++) {
				var visible = true;
				if (i > 0) {
					if (this.preparedPathSteps[i - 1][m] != null) {
						if (this.preparedPathSteps[i][m]["value"] == this.preparedPathSteps[i - 1][m]["value"]) {
							if (!this.preparedPathSteps[i][m]["arrayIndexRoot"]) {
								m = this.preparedPathSteps[i].length;
								visible = false;
								display = false;
							}
						}
					}
				}
				if (visible) {
					this.parameterContainer.firstChild.childNodes[r].firstChild.firstChild.childNodes[m].style.visibility = "visible";
					if (this.preparedPathSteps[i][m]["i"] != "null") {
						if ($("step3-expand-" + i + "-" + m).expanded) {
							this.expandParamPathStep(i, m);
						}
						m = this.preparedPathSteps[i].length;
						complete = false;
					}
				}
			}
			if (display) {
				this.parameterContainer.firstChild.childNodes[r].style.display = "";

				if (complete) {
					this.parameterContainer.firstChild.childNodes[r].childNodes[1].style.visibility = "visible";
					this.parameterContainer.firstChild.childNodes[r].childNodes[2].style.visibility = "visible";
					this.parameterContainer.firstChild.childNodes[r].childNodes[3].style.visibility = "visible";
				}
			}

			if (this.preparedPathSteps[i][k]["i"] != "null") {
				iTemp = this.preparedPathSteps[i][k]["i"];

				k = this.preparedPathSteps[i][k]["k"];
				i = iTemp;
			} else {
				goon = false;
			}
		}
	},

	/**
	 * used to contract elements of the tree view in step 3
	 * 
	 * @param i
	 * @param k
	 * @return
	 */
	contractParamPathStep : function(i, k) {
		i = i * 1;
		k = k * 1;
		var r = $("step3-paramRow-" + i).rowIndex;

		this.parameterContainer.firstChild.childNodes[r].firstChild.firstChild.childNodes[k].firstChild.firstChild.src = wgScriptPath
				+ "/extensions/SMWHalo/skins/webservices/Plus.gif";
		this.parameterContainer.firstChild.childNodes[r].firstChild.firstChild.childNodes[k].firstChild.expanded = false;

		for ( var m = k * 1 + 1; m < this.preparedPathSteps[i].length; m++) {
			this.parameterContainer.firstChild.childNodes[r].firstChild.firstChild.childNodes[m].style.visibility = "hidden";
		}

		var goon = true;
		var root = true;
		r = r - 1;
		while (goon) {
			r = r + 1;
			if (!root) {
				this.parameterContainer.firstChild.childNodes[r].style.display = "none";
			}
			root = false;

			this.parameterContainer.firstChild.childNodes[r].childNodes[1].style.visibility = "hidden";
			this.parameterContainer.firstChild.childNodes[r].childNodes[2].visibility = "hidden";
			this.parameterContainer.firstChild.childNodes[r].childNodes[3].style.visibility = "hidden";

			if (this.preparedPathSteps[i][k]["i"] != "null") {
				iTemp = this.preparedPathSteps[i][k]["i"];
				k = this.preparedPathSteps[i][k]["k"];
				i = iTemp;
			} else {
				goon = false;
			}
		}
	},

	/**
	 * used for the onlick event in the tree view of step 4
	 * 
	 * @param event
	 * @return
	 */
	resultPathStepClick : function(event) {
		var node = Event.element(event);
		Event.stop(event);
		if (node.expand) {
			node.expand = false;
			this.expandResultPathStep(node.i, node.k);
		} else {
			node.expand = true;
			this.contractResultPathStep(node.i, node.k);
		}
	},

	/**
	 * used in step 4 to expand elements of the tree view
	 * 
	 * @param i
	 * @param k
	 * @return
	 */
	expandResultPathStep : function(i, k) {
		i = i * 1;
		k = k * 1;
		var r = $("step4-resultRow-" + i).rowIndex;

		this.resultContainer.childNodes[0].childNodes[r].childNodes[0].firstChild.childNodes[k].childNodes[0].firstChild.src = wgScriptPath
				+ "/extensions/SMWHalo/skins/webservices/Minus.gif";
		this.resultContainer.childNodes[0].childNodes[r].childNodes[0].firstChild.childNodes[k].childNodes[0].expanded = "true";

		var goon = true;
		r = r - 1;
		while (goon) {
			var display = true;
			var complete = true;
			r = r + 1; // $("step4-resultRow-" + i).rowIndex;
			for ( var m = k * 1 + 1; m < this.preparedRPathSteps[i].length; m++) {
				var visible = true;
				if (i > 0) {
					if (this.preparedRPathSteps[i - 1][m] != null) {
						if (this.preparedRPathSteps[i][m]["value"] == this.preparedRPathSteps[i - 1][m]["value"]) {
							if (!this.preparedRPathSteps[i][m]["arrayIndexRoot"]) {
								m = this.preparedRPathSteps[i].length;
								visible = false;
								display = false;
							}
						}
					}
				}
				if (visible) {
					this.resultContainer.childNodes[0].childNodes[r].childNodes[0].firstChild.childNodes[m].style.visibility = "visible";
					if (this.preparedRPathSteps[i][m]["i"] != "null") {
						if (this.resultContainer.childNodes[0].childNodes[r].childNodes[0].firstChild.childNodes[m].childNodes[0].expanded == "true") {
							this.expandResultPathStep(i, m);
						}
						m = this.preparedRPathSteps[i].length;
						complete = false;
					}
				}
			}
			if (display) {
				this.resultContainer.childNodes[0].childNodes[r].style.display = "";

				if (complete) {
					this.resultContainer.childNodes[0].childNodes[r].childNodes[1].style.visibility = "visible";
				}
			}

			if (this.preparedRPathSteps[i][k]["i"] != "null") {
				iTemp = this.preparedRPathSteps[i][k]["i"];
				k = this.preparedRPathSteps[i][k]["k"];
				i = iTemp;
			} else {
				goon = false;
			}
		}
	},

	/**
	 * used for step 4 to contract elements of the tree view
	 * 
	 * @param i
	 * @param k
	 * @return
	 */
	contractResultPathStep : function(i, k) {
		i = i * 1;
		k = k * 1;
		var r = $("step4-resultRow-" + i).rowIndex;

		this.resultContainer.childNodes[0].childNodes[r].childNodes[0].firstChild.childNodes[k].childNodes[0].firstChild.src = wgScriptPath
				+ "/extensions/SMWHalo/skins/webservices/Plus.gif";
		this.resultContainer.childNodes[0].childNodes[r].childNodes[0].firstChild.childNodes[k].childNodes[0].expanded = "false";
		for ( var m = k + 1; m < this.preparedRPathSteps[i].length; m++) {
			this.resultContainer.childNodes[0].childNodes[r].childNodes[0].firstChild.childNodes[m].style.visibility = "hidden";
		}

		var goon = true;
		var root = true;

		r = r - 1;
		while (goon) {
			i = i * 1;
			k = k * 1;
			r = r + 1;// $("step4-resultRow-" + i).rowIndex;

			if (!root) {
				this.resultContainer.childNodes[0].childNodes[r].style.display = "none";
			}
			root = false;

			this.resultContainer.childNodes[0].childNodes[r].childNodes[1].style.visibility = "hidden";

			if (this.preparedRPathSteps[i][k]["i"] != "null") {
				var iTemp = this.preparedRPathSteps[i][k]["i"];
				k = this.preparedRPathSteps[i][k]["k"];
				i = iTemp;
			} else {
				goon = false;
			}
		}
	},

	/**
	 * this method is used in step 4 to update array indexes of path steps that
	 * are hidden
	 * 
	 * @param i
	 * @param k
	 * @return
	 */
	updateInputBoxes : function(event) {
		var node = Event.element(event);
		var i = node.i;
		var k = node.k;
		var inputValue;
		var root = true;
		var goon = true;
		while (goon) {
			if (!root) {
				if ($("s4-pathstep-" + i + "-" + k).childNodes.length == 4) {
					$("s4-pathstep-" + i + "-" + k).childNodes[1].value = rootValue;
				} else if ($("s4-pathstep-" + i + "-" + k).childNodes.length == 5) {
					$("s4-pathstep-" + i + "-" + k).childNodes[2].value = rootValue;
				}
			} else {
				if ($("s4-pathstep-" + i + "-" + k).childNodes.length == 4) {
					rootValue = $("s4-pathstep-" + i + "-" + k).childNodes[1].value;
				} else if ($("s4-pathstep-" + i + "-" + k).childNodes.length == 5) {
					rootValue = $("s4-pathstep-" + i + "-" + k).childNodes[2].value;
				}
				root = false;
			}

			if (this.preparedRPathSteps[i][k]["i"] != "null") {
				var iTemp = this.preparedRPathSteps[i][k]["i"];
				k = this.preparedRPathSteps[i][k]["k"];
				i = iTemp;
			} else {
				goon = false;
			}
		}
	},

	/*
	 * Shows the pending indicator on the element with the DOM-ID <onElement>
	 * 
	 * @param string onElement DOM-ID if the element over which the indicator
	 * appears
	 */
	showPendingIndicator : function(onElement) {
		this.hidePendingIndicator();
		$(onElement + "-img").style.visibility = "hidden";
		this.pendingIndicator = new OBPendingIndicator($(onElement));
		this.pendingIndicator.show();
		this.pendingIndicator.onElement = onElement;
	},

	/*
	 * Hides the pending indicator.
	 */
	hidePendingIndicator : function() {
		if (this.pendingIndicator != null) {
			$(this.pendingIndicator.onElement + "-img").style.visibility = "visible";
			this.pendingIndicator.hide();
			this.pendingIndicator = null;
		}
	},

	editWWSD : function() {
		var editParameterContainer = $("editparameters");
		var editResultContainer = $("editresults");
		if (editParameterContainer == null) {
			return;
		}

		this.editMode = true;
		var editParameters = editParameterContainer.firstChild.nodeValue
				.split(";");
		editParameters.pop();
		var ps2Parameters = "todo:handle exceptions";
		var parametersUpdate = new Array();

		for (i = 0; i < editParameters.length; i += 4) {
			var o = new Object();
			o["alias"] = editParameters[i];
			ps2Parameters += ";" + editParameters[i + 1];
			o["optional"] = editParameters[i + 2];
			o["defaultValue"] = editParameters[i + 3];

			parametersUpdate.push(o);
		}
		this.processStep2Do(ps2Parameters, true);
		this.updateParameters(parametersUpdate);

		var editResults = editResultContainer.firstChild.nodeValue.split(";");
		editResults.pop();
		var ps3Results = "todo:handle exceptions";
		var resultsUpdate = new Array();

		for (i = 0; i < editResults.length; i += 2) {
			var o = new Object();
			o["alias"] = editResults[i];
			ps3Results += ";" + editResults[i + 1];
			resultsUpdate.push(o);
		}
		this.processStep3Do(ps3Results, true);
		this.updateResults(resultsUpdate);

	},

	updateParameters : function(updates) {
		for (i = 0; i < updates.length; i++) {
			if (updates[i]["alias"] != "##") {
				this.parameterContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value = updates[i]["alias"];
			}
			if (updates[i]["optional"] == "true") {
				this.parameterContainer.firstChild.childNodes[i + 1].childNodes[2].firstChild.checked = true;
			}
			if (updates[i]["defaultValue"] != "##") {
				this.parameterContainer.firstChild.childNodes[i + 1].childNodes[3].firstChild.value = updates[i]["defaultValue"];
			}
		}
	},

	updateResults : function(updates) {
		for (i = 0; i < updates.length; i++) {
			if (updates[i]["alias"] != "##") {
				this.resultContainer.firstChild.childNodes[i + 1].childNodes[1].firstChild.value = updates[i]["alias"];
			}
		}
	}
}

webServiceSpecial = new DefineWebServiceSpecial();

Event.observe(window, 'load', webServiceSpecial.editWWSD
		.bindAsEventListener(webServiceSpecial));