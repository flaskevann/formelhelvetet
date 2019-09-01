import json
import re
import sys

class Økonomiformler:

    formelSti = "formler"
    formelFilnavn = [
        "skatterett.txt",
        "bed.øk.txt",
        "regnskap.txt",
        "mikro.txt",
        "makro.txt",
        "finans.txt"]

    formler = {}

    def __init__(self):

        self.__lesFormelblokkerFraFil()

    def __lesFormelblokkerFraFil(self):

        # Hent formelblokker fra filer
        for filnavn in self.formelFilnavn:
            filinnhold = open(self.formelSti + "/" + filnavn, "r", encoding="utf-8")
            filinnhold = filinnhold.read()

            # Behandle hver formelblokk
            formlerSomTekst = filinnhold.split("---")
            for formelSomTekst in formlerSomTekst:
                formelSomTekstLinjer = formelSomTekst.strip().replace("\r\n", "\n").split("\n")

                # Lag formelblokk som objekt
                nyFormel = ""
                formelNavn = ""
                for formelSomTekstLinje in formelSomTekstLinjer:
                    formelSomTekstLinje = formelSomTekstLinje.replace("[", "").replace("]", "")

                    # JSON-format:
                    # "navn": "data"
                    navn = formelSomTekstLinje.split(":")[0].strip()
                    innhold = formelSomTekstLinje.replace(navn+": ", "")

                    # Finne formelnavnet
                    if navn == "navn":
                        formelNavn = innhold
                        formelNavn = formelNavn[:1].upper() + formelNavn[1:]

                        # Endrer navnet så det følger mer kodestandard
                        innhold = innhold.replace(")", "").replace("(", "").replace("-", " ").replace("/", "")
                        innhold = innhold.title()
                        innhold = innhold[:1].lower() + innhold[1:]
                        innhold = innhold.replace(" ", "")

                    # Fjern ' for å muliggjøre innlesing senere
                    innhold = innhold.replace("'", "")

                    # Stor bokstav for forklaring
                    if navn == "forklaring":
                        innhold = innhold[:1].upper() + innhold[1:]

                    # Potensfiks fordi ^ ikke støttes i Python
                    if navn == "formel":
                        innhold = innhold.replace("^", "**")

                    # Gjør til JSON
                    nyFormel += '"'+navn+'":' + '"'+innhold+'", ';

                # Legg til kategori
                nyFormel += '"kategori":' + '"'+filnavn.replace(".txt", "").title()+'"';

                # Legg til JSON paranteser
                nyFormel = "{"+nyFormel+"}"

                # JSON til objekt
                formelblokkSomObjekt = json.loads(nyFormel)
                formelnavn = formelblokkSomObjekt["navn"]
                formelblokkSomObjekt["navn"] = formelNavn

                # Lagre formelobjektet
                if formelnavn not in self.formler:
                    self.formler[formelnavn] = formelblokkSomObjekt
                else:
                    print("Formel '"+formelnavn+"' allerede lagt til!")

        # Finn variabler
        self.__finnVariabler()

    def __finnVariabler(self):

        for formelnavn in self.formler:
            formel = self.formler[formelnavn]

            # Finn variabler
            variabler = []
            ordFraFunksjonen = re.findall(r"\w+(?:\.?\w+)*", formel["formel"])
            for ord in ordFraFunksjonen:
                ord = ord.strip()

                # Ny variabel
                if len(ord) > 0 and not ord.isdigit() and ord not in variabler:
                    variabler.append(ord)

            # Lagre variabler
            self.formler[formelnavn]["variabler"] = variabler

    def visOversikt(self, søkestreng):
        søkestreng = søkestreng.lower()

        print()
        print("------------------------------------------------------")
        if len(søkestreng) > 0:
            print(" Formelhelvetet v.1 -- søk på \"" + søkestreng + "\":")
        else:
            print(" Formelhelvetet v.1 med "+str(len(self.formler))+" innlagte økonomiformler :")
        print("------------------------------------------------------")

        # List opp formler
        formelTeller = 1
        for formelnavn in self.formler:
            formel = self.formler[formelnavn]

            # Vis kun ønskede formler
            if søkestreng in formel["forklaring"].lower() or søkestreng in formel["navn"].lower():

                # Vis referansenummer og navn
                telleTekst = "("+str(formelTeller) + ")"
                print()
                print(telleTekst + " - " + formel["navn"]+":")

                # Vis forklaring, formelen og eksempel på bruk
                print("Kategori: " + formel["kategori"])
                print("Formel: " + formel["formel"].replace("**", "^"))
                print("Forklaring: " + formel["forklaring"])
                print("Eksempel: " + formel["eksempel"].replace("**", "^"))

                # Vis formelkommando
                variabler = formel["variabler"]
                argumentListe = ""
                for variabel in variabler:
                    argumentListe += variabel + "=<tall> "
                print("Kommando: f" + str(formelTeller) + " " + argumentListe + " ")

            formelTeller += 1

        print()
        print("----------------------------------------------------")
        print()

        if len(søkestreng) == 0:
            print("Skriv f.eks.: f101 beløp=100 rente=0.05 vekst=0.03 perioder=5")
            print()

    def kjørKommando(self, kommando, kunSvaret):

        # Stykk opp kommando
        kommandoDeler = kommando.strip().split(" ")

        # Finn valgt formel
        valgtFormelNr = int(kommandoDeler.pop(0).replace("f", ""))-1
        valgtFormel = {}
        formelTeller = 0
        for formelnavn in self.formler:
            if formelTeller == valgtFormelNr:
                valgtFormel = self.formler[formelnavn]
                break
            formelTeller += 1
        valgtFormelSomTekst = valgtFormel["formel"]

        # Sett sammen uttrykk
        for variabel in valgtFormel["variabler"]:
            kommandoDel = kommandoDeler.pop(0).replace(variabel+"=", "")
            valgtFormelSomTekst = valgtFormelSomTekst.replace(variabel, kommandoDel)

        # Kalkuler og returner svar
        if kunSvaret:
            return eval(valgtFormelSomTekst)
        else:
            svaret = ""
            try:
                svaret = eval(valgtFormelSomTekst)
                svaret = valgtFormelSomTekst.replace("**", "^") + " = " + str(svaret)
            except Exception as unntak:
                svaret = valgtFormelSomTekst.replace("**", "^") + " gir " + str(unntak)
            return svaret

# ----------------  F r a   t e r m i n a l : ----------------

øf = Økonomiformler()

# Ingen inndata så list formeloversikt
if len(sys.argv) == 1:
    øf.visOversikt("")

    # Ta i mot kommando
    kommando = input("Kommando: ")
    print(øf.kjørKommando(kommando, False))

# Søk etter relevante formler
elif "søk=" in sys.argv[1] :
    søkestreng = sys.argv[1].replace("søk=", "").strip()
    øf.visOversikt(søkestreng)

    # Ta i mot kommando
    kommando = input("Kommando: ")
    print(øf.kjørKommando(kommando, False))

# Kommando fra terminal
else:
    kommandoDeler = sys.argv
    kommandoDeler.pop(0) # fjerner filnavnet som er første argument
    kommando = " ".join(kommandoDeler)
    print(øf.kjørKommando(kommando, False))
