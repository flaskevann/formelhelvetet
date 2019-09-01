# formelhelvetet
Kartlagte viktige formler i økonomi tilgjengelig via terminal som valgbare funksjoner med egne inndata.

Opprinnelig et prosjekt i JavaScript for å generere lett tilgjengelige kalkulatorer på nettside:
https://www.bakkenblogg.no/diverse/formelhelvetet/

Fremtidig planlagt funksjonalitet: Genererte funksjoner med navnede parametre for hver innlastet formel.

## Kom i gang
1. Installer Python 3 fra https://www.python.org/downloads/
2. Last ned prosjektet til et sted på harddisken.
3. Åpne en terminal og gå til stedet prosjektet ble lastet ned.

Hver formel har kommandoeksempel som du bør studere for riktig bruk.

Eksempel: "f101 beløp=100 rente=0.05 vekst=0.03 perioder=5".

Forkortelsen "f101" betyr simpelthen at man velger funksjon nr. 101 i oversikten. Man slipper å skrive formelnavnet.

## Bruk
Skriv
'python økonomiformler.py' for full formeloversikt
eller
'python økonomiformler.py søk="rente"' for å kun liste opp det som er av interesse, f.eks. rente.
eller
'python økonomiformler.py <kommando>' f.eks.
'python økonomiformler.py f101 beløp=100 rente=0.05 vekst=0.03 perioder=5'

Sistnevnte tar i mot kommandoen direkte fra terminal, i stedet for å vente på den etter oversikten er vist.

## Lisens
Prosjektet har MIT-lisens - se [LICENSE.md](LICENSE.md) for detaljer.
