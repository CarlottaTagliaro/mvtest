# TEMA : review, sistema di gestione degli esami.

Il sistema è aperto a tutti, quindi tutti possono creare dei task. Definisco un insieme di TA/docenti che hanno accesso all'esame e possono modificarlo. 
Un docente/TA sottomette un insieme di task come parte di un esame (che sarà composto da più task). 
Ogni insieme di task viene assegnato ad un insieme di persone (ex: studenti). Questo insieme può essere definito come lista esplicita o mediante una caratteristica comune. 
Avrò una deadline (assoluta o relativa al momento di inizio dell'esame? Meglio se entrambe).

Le persone a cui sono assegnati i task possono fare submit delle loro soluzioni (a seconda del diverso task, la risposta avrà un formato diverso). Una volta consegnato, è possibile cambiare la propria risposta finchè si è entro la deadline (tengo tutte le versioni o solo l'ultima?). 
Se la consegna avviene oltre la deadline, o non viene direttamente accettata (perchè il sistema è stato chiuso) oppure viene comunque ricevuta dal docente che deciderà cosa farsene. 
La consegna dovrà essere valutata dal docente. Alla scadenza della deadline il docente assegna un voto+commento (il voto può essere per task singolo o per esame intero). Lo studente potrà accedere alla sua valutazione. Facoltativo: chat studente/docente.

Funzione aggiuntiva: una volta scaduta la deadline, l'insieme di task torna ad un insieme di N studenti che vanno a commentare e a dare un voto al lavoro fatto dai colleghi(ovviamente escluso colui che ha submittato la soluzione). Tipicamente N=3. I commenti dei colleghi verranno anch'essi submittati e contribuiranno alla loro valutazione totale (valutazione = risultato esame + valutazione commenti fatti su esami di altri colleghi). Il docente non è obbligato a dare un voto all'esame di uno studente se rimane soddisfatto di quanto detto dalla review dei colleghi. 

Chi specifica il task può decidere se questo va in review o meno. 

All'interno di un esame posso avere persone a cui sono assegnati task differenti (crowd sourcing). Vado a valutare la risposta ai task e non le persone. Assegno ogni task ad un tot di persone, prendo le risposte e le aggrego (cercando di ottenere concordanza). 

Posso anche ritirarmi cancellando il submit. 

Se voglio fare un esame con gli stessi task allora faccio direttamente una copia del modello e lo assegno a persone differenti. I task infatti sono entità persistenti salvate nel DB anche dopo che un determinato esame è concluso (saranno identificate da un proprio ID). 

# Studenti
Matteo Bonora, Carlotta Tagliaro, Francesco Cadei, Girardi Massimiliano

### SWAGGER 
Il file "ufficiale" è sul branch master
