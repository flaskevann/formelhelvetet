	/*
	 * Innstillinger:
	 */

	var formelSti = "../formler/";
	var formelFiler = [
		"skatterett.txt",
		"bed.øk.txt",
		"regnskap.txt",
		"mikro.txt",
		"makro.txt",
		"finans.txt"
	];

	/////////////////////////////////////////////////
	/////////////////////////////////////////////////

	/*
	 * Innhold:
	 */

	var formler = {};

	/////////////////////////////////////////////////
	/////////////////////////////////////////////////

	/*
	 * Kjøring:
	 */
	 
	$.ajaxSetup ({
		cache: false
	});

	$(document).ready(function() {

		// List formelfiler under kalkisene
		$("#filinfo").text("Nye kalkiser opprettes når flere formler legges inn i en av formelfilene:");
		formelFiler.forEach(function(formelFil) {
			$("#filinfo").append(" " + formelFil);
		});

		// Last inn formler
		var filteller = 0;
		formelFiler.forEach(function(filnavn) {
			$.ajax(
				{
					url : location.protocol+"//"+location.host+location.pathname+"formelhelvetet/"+formelSti+"/"+filnavn,
					dataType: "text",
					success : function(data) {
						bearbeidFormler(filnavn, data);

						// Fortsett oppsett
						filteller++;
						if (filteller == formelFiler.length) {
							byggKalkiser();
							fiksTilToppenKnapp();
						}
					}
				}
			);
		});
	});

	function fiksTilToppenKnapp() {
		$("body").append("<p id=tilToppenKnapp>^</p>");
		
		$("#tilToppenKnapp").click(function() {
			location.hash = '';
			$('html,body').animate({scrollTop:0}, 'fast');
		});

		$(function() {
			if ($(window).scrollTop() < 100) {
				$("#tilToppenKnapp").hide();
			}
			$(window).scroll(function() {
				var scroll = $(window).scrollTop();
				if (scroll >= 100) {
					$("#tilToppenKnapp").hide();
					$("#tilToppenKnapp").show();
				} else {
					$("#tilToppenKnapp").show();
					$("#tilToppenKnapp").hide();
				}
			});
		})

	}

	function bearbeidFormler(filnavn, formlerSomTekst) {

		formlerSomTekst.split("---").forEach(function(formelSomTekst) {
			
			// Sett sammen ny formel
			var formelTekstbiter = formelSomTekst.trim().replace("\r\n", "\n").split("\n");
			var navn = formelTekstbiter[0].replace("navn:", "").trim();
			var nyFormel = {
				"filnavn": filnavn,
				"forklaring": formelTekstbiter[1].replace("forklaring:", "").trim(),
				"formel": formelTekstbiter[2].replace("formel:", "").trim(),
				"eksempel": formelTekstbiter[3].replace("eksempel:", "").trim()
			};

			// Har tips
			if (formelTekstbiter[4]) {
				nyFormel["tips"] = formelTekstbiter[4].replace("tips:", "").trim();

				// Har lenke(er)
				while (nyFormel["tips"].indexOf("[") != -1) {

					var tips = nyFormel["tips"];

					var lenkeSomTekst = tips.substr(tips.indexOf("["), tips.indexOf("]")-tips.indexOf("[")+1);
					var lenkeSomTekstbiter = lenkeSomTekst.replace("[", "").replace("]", "").split(",");
					var lenke = "<a target='_blank' href='" + lenkeSomTekstbiter[0].trim() +"'>" + lenkeSomTekstbiter[1].trim() + "</a>";
					if (lenkeSomTekstbiter[2]) {
						lenke += " " + lenkeSomTekstbiter[2].trim();
					}

					nyFormel["tips"] = tips.replace(lenkeSomTekst, lenke);
				}
			}

			// Finn variabelnavn
			var variabler = [];
			nyFormel.formel.split(/[^A-Za-zøæåØÆÅ0-9 _]/).forEach(function(ord) {
				ord = ord.trim();
				if (ord.length > 0 && isNaN(ord)) {
					variabler.push(ord);
				}
			});
			nyFormel.variabler = variabler;

			// "Lagre" ny formel
			if (formler[navn]) {
				var unntak = "'" + navn + "' eksisterer allerede!";
				alert(unntak)
				throw unntak;
			} else {
				formler[navn] = nyFormel;
			}
		});
	}

	function byggKalkiser()
	{
		var kalkisDiv = $("#kalkiser");
		var kalkisTeller = 0;
		var filnavn = "";

		// Opprett kalkis for hver formel
		for (var navn in formler) {
			var formel = formler[navn];

			// Legg til opphav
			if (filnavn != formel.filnavn) {
				filnavn = formel.filnavn;
				kalkisDiv.append("<p class='filnavn'>(" + formel.filnavn.replace(".txt","") + ")</p>");
			}

			// Lag ny div
			var divID = navn.toLowerCase().split("å").join("a").split("æ").join("ae").split("ø").join("o").split(" ").join("-").split("(").join("").split(")").join("");
			var nyDiv = $("<div id="+divID+" class='kalkis'></div>");
			kalkisDiv.append(nyDiv);

			// Legg inn resetknapp
			nyDiv.append("<img class='reset-kalkis-knapp' src='png/reset-ikon.png' onclick='resetKalkis(this)'>");

			// Opprett elementer for navn, beskrivelse, formel, og eksempel
			nyDiv.append("<h2>" + navn.toUpperCase() + "</h2>");
			nyDiv.append("<h3>" + formel.forklaring.toUpperCase() + "</h3>");
			nyDiv.append("<p>Formel: " + formel.formel.split("_").join(" ") + "</p>");
			nyDiv.append("<p>Eksempel: " + formel.eksempel + "</p>");

			// Legg til tips
			if (formel.tips) {
				var tips = formel.tips;
				tips = tips.substr(0, 1).toUpperCase() + tips.substr(1, tips.length);
				nyDiv.append("<p>Tips: " + tips + "</p>");
			}

			// Opprett kalkulator
			var opprettedeFelt = [];
			var nyForm = $("<form></form>");
			nyDiv.append(nyForm);
			nyForm.append("<label>Dine data: </label> ");
			formel.variabler.forEach(function(variabel) {
				if (opprettedeFelt.indexOf(variabel) == -1) {
					nyForm.append("<input type='text' onchange='kalkisFeltEndret(this)' size='"+variabel.length+"' placeholder='"+variabel.split("_").join(" ")+"'></input> ");
					opprettedeFelt.push(variabel);
				}
			});
			nyForm.append("<label> gir </label> ");
			nyForm.append("<input type='text' size='12' readonly></input> ");

			kalkisTeller++;
		}

		// Vis antall kalkiser
		$("#antallinfo").text($("#antallinfo").text() + ", " + kalkisTeller + " lagt inn til nå");

		// Div-klikking
		// fiksDivs();
		if (window.location.href.indexOf("#") != -1) {
			var anchor = window.location.href.split("#")[1];
			if (anchor.length > 0) {
				$("#"+anchor).click();
			}
		}
	}

	function resetKalkis(resetKnapp)
	{
		$(resetKnapp).parent().find("form").children().val("");
	}

	function kalkisFeltEndret(kalkisFelt)
	{
		// Formel
		var formelnavn = $(kalkisFelt).parent().parent().find("h2").text().toLowerCase();
		var formel = formler[formelnavn];

		// Hent variabler
		var variabler = {};
		var variabelTeller = 0;
		var alleKalkisFelt = $(kalkisFelt).parent().find("input");
		alleKalkisFelt.each(function(indeks) {
			if (indeks < alleKalkisFelt.length-1) {
				var variabelNavn = $(this).attr("placeholder");
				variabelNavn = variabelNavn.split(" ").join("_");
				var variabelInnhold = $(this).val().split(" ").join("");
				if (variabelInnhold.length > 0 && !isNaN(variabelInnhold)) {
					variabler[variabelNavn] = variabelInnhold;
					variabelTeller++;
				}
			}
		});

		// Returner svaret
		if (variabelTeller == alleKalkisFelt.length-1) {
			var svaret = regnUtSvaret(formel, variabler).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

			// Fjern tusenskille etter punktum
			if (svaret.indexOf(".") != -1) {
				svaret = svaret.substr(0, svaret.indexOf(".")) + svaret.substr(svaret.indexOf(".")).split(" ").join("");
			}

			$(kalkisFelt).parent().find("input").last().val(svaret);

			// Google Analytics
			if (!window.location.toString().includes("127.0.0.1")) {
				gtag('event', 'sum', {
					'event_category' : 'calc',
					'event_label' : formelnavn
				});
			}
		}
	}

	function fiksDivs() {
		$("#kalkiser > div").click(function() {
			var oldHref = window.location.href;
			var newHref = location.protocol+"//"+location.host+location.pathname+"#"+this.id;
			if ( oldHref !== newHref ) {
				window.location.href = newHref;
				$('html,body').animate({scrollTop: $("#"+this.id).offset().top-5}, 'slow');
			}
		});
	}