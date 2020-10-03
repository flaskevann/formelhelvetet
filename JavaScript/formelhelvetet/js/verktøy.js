	function objektSomJSONTekst(objekt)
	{
		return JSON.stringify(objekt, null, 2);				
	}

	function regnUtSvaret(formelObjekt, variabler)
	{
		var formelSomTekst = formelObjekt.formel;

		var variablerSortert = [];
		for (var navn in variabler) {
			variablerSortert.push(navn);
		}
		variablerSortert.sort(function(a, b){
			return b.length - a.length;
		});
		variablerSortert.forEach(function(navn) {
			formelSomTekst = formelSomTekst.split(navn).join(variabler[navn]);
		});

		return math.eval(formelSomTekst).toFixed(4);
	}

	function somProsent(andel)
	{
		return (andel*100) + "%";
	}

