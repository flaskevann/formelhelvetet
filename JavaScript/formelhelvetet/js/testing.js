
	function testFremtidsverdi()
	{
		var formel = formler.fremtidsverdi;
		var verdier = {"nåverdi": 100, "rente": 0.1, "perioder": 2};
		var svar = regnUtSvaret(formel, verdier);

		alert(verdier.nåverdi + " blir til " + svar + " over " + 
				verdier.perioder + " perioder med " + somProsent(verdier.rente) + " rente.");
	}

