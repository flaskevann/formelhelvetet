# formelhelvetet
Kartlagte viktige formler i økonomi tilgjengelig via terminal som valgbare funksjoner med egne inndata.

Opprinnelig et JavaScript-prosjekt for å generere kalkulatorer på nettside:
https://www.bakkenblogg.no/diverse/formelhelvetet/

## Kom i gang
1. Installer Python 3 fra https://www.python.org/downloads/
2. Last ned prosjektet til et sted på harddisken.
3. Åpne en terminal og gå til stedet prosjektet ble lastet ned.

Hver formel har kommandoeksempel som må studeres for riktig bruk.

Eksempel: <code>f101 beløp=100 rente=0.05 vekst=0.03 perioder=5</code>

Forkortelsen "f101" betyr simpelthen at man velger funksjon nr. 101 i oversikten. Man slipper å skrive formelnavnet.

## Bruk
Man kan velge å først vise en oversikt også skrive inn kommando:

<code>python økonomiformler.py</code> for full formeloversikt

<code>python økonomiformler.py søk="rente"</code> for å kun liste opp det som er av interesse, f.eks. rente.

Eller skrive inn direkte fra terminal:

<code>python økonomiformler.py f101 beløp=100 rente=0.05 vekst=0.03 perioder=5</code>

## Kommende funksjonalitet
Fremtidig planlagt funksjonalitet: Genererte funksjoner med navnede parametre for hver innlastet formel.

## Lisens
Prosjektet har MIT-lisens - se [LICENSE](LICENSE) for detaljer.
