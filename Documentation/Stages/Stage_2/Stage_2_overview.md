🧱 ETAP 2 — CORE LOGIC EXTRACTION

(najważniejszy etap techniczny projektu)

⸻

🎯 CEL ETAPU 2 (jedno zdanie)

Zamienić działający skrypt w stabilny, wielokrotnego użytku silnik backendowy
bez jakiejkolwiek zmiany zachowania.

To NIE jest refaktor.
To NIE jest optymalizacja.
To NIE jest „ładniejszy kod”.

To jest wydzielenie granic odpowiedzialności.

⸻

🧠 DLACZEGO TEN ETAP JEST KONIECZNY

Teraz WatchDog:
	•	działa
	•	ale:
	•	wszystko jest w checkMyPrices.ts
	•	logika jest spleciona
	•	nie da się jej bezpiecznie wywołać z API

Po ETAPIE 2:
	•	nadal działa identycznie
	•	ale:
	•	logika jest adresowalna
	•	można ją wywołać:
	•	z crona
	•	z API
	•	z mobilki (pośrednio)

👉 Bez tego etapu API byłoby prowizorką.

⸻

🧩 CO DOKŁADNIE ROBIMY (KROK PO KROKU)

🔹 KROK 2.1 — Nazwanie granic (BEZ KODU)

Co:
	•	identyfikujemy bloki logiczne w checkMyPrices.ts

Dlaczego:
	•	nie można nic wycinać, dopóki nie wiemy co czym jest

Granice, które JUŻ ISTNIEJĄ (fakty, nie teoria):
	1.	uruchomienie przeglądarki
	2.	obsługa cookies
	3.	sprawdzenie dostępności
	4.	czytanie ceny
	5.	formatowanie wyniku
	6.	wysyłka maila

👉 Na tym etapie NIC nie zmieniamy.

⸻

🔹 KROK 2.2 — Ekstrakcja „pure core” (linijka w linijkę)

To jest sedno etapu.

2.2.1 Cookie Consent
Co:
	•	wyciąć kod obsługi cookies do: core/consent.ts
Dlaczego:
	•	to jest logika powtarzalna
	•	NIE zależy od produktu
	•	MUSI działać identycznie

Jak:
	•	kopiuj → wklej
	•	bez skracania
	•	bez „cleanup”

⸻

2.2.2 Availability Detection
Co:
	•	wyciąć kod sprawdzania „do koszyka” do: core/availability.ts

Dlaczego:
	•	to jest reguła biznesowa
	•	będzie potrzebna w API
	•	nie może się różnić per wywołanie

Zakaz:
	•	nie zmieniamy listy słów
	•	nie zmieniamy atrybutów
	•	nie robimy enumów

⸻

2.2.3 Price Extraction
Co:
	•	wyciąć całą logikę czytania ceny do: core/price-extractor.ts

Dlaczego:
	•	to jest serce WatchDoga
	•	API będzie wołało dokładnie to
	•	selektory już są w config

Krytyczne:
	•	MediaExpert zostaje specjalnym przypadkiem
	•	NIE próbujemy go uogólnić

⸻

🔹 KROK 2.3 — Orchestrator (cienka warstwa)

Co:
	•	checkMyPrices.ts staje się:
	•	pętlą
	•	kolejnością wywołań

Dlaczego:
	•	orchestrator NIE zawiera logiki
	•	tylko steruje

Efekt:
	•	to samo zachowanie
	•	mniejszy plik
	•	większa kontrola

⸻

🛑 CZEGO NIE WOLNO (ABSOLUTNE)

W ETAPIE 2 ZAKAZANE JEST:
	•	❌ zmiana kolejności kroków
	•	❌ zmiana regexów
	•	❌ zmiana selektorów
	•	❌ zmiana nazw zmiennych „bo czytelniej”
	•	❌ dodawanie typów „bo TS”
	•	❌ obsługa nowych sklepów
	•	❌ poprawianie błędów stylistycznych

To NIE jest ten moment.

⸻

🧪 JAK SPRAWDZAMY, CZY ETAP 2 JEST ZROBIONY DOBRZE

Test prawdy:
	1.	Uruchamiasz stary kod
	2.	Uruchamiasz nowy kod
	3.	Wynik:
	•	te same produkty
	•	te same ceny
	•	te same decyzje
	•	ten sam mail

Jeśli choć jeden znak się różni → ETAP 2 NIE JEST ZAKOŃCZONY.

⸻

🧠 DLACZEGO KOLEJNOŚĆ JEST TAKA
	•	bez granic → chaos
	•	bez core → API nie ma sensu
	•	bez stabilności → regresje

ETAP 2 to fundament, nie feature.

⸻

🧭 PODSUMOWANIE JEDNYM ZDANIEM

ETAP 2 nie dodaje żadnej nowej funkcji.
On tylko sprawia, że to, co działa, da się bezpiecznie używać dalej.
----------------------------------------------------------------------------------

I. ETAP 2 → PODZIAŁ NA KAMIENIE MILOWE

Bazujemy ściśle na tym, co już ustaliłaś w punkcie 2 (co / jak / po co / dlaczego).

ETAP 2 = Core Logic Extraction

Rozbicie:

🔹 Milestone 2.0 – Boundary Identification (NO CODE)

Nazwanie granic odpowiedzialności

Cel:
Zrozumieć i opisać gdzie kończy się jedna odpowiedzialność, a zaczyna druga, bez ruszania kodu.

Dlaczego osobno:
Jeśli AI zacznie wycinać kod bez tego kroku → zrobi refaktor zamiast ekstrakcji.

⸻

🔹 Milestone 2.1 – Cookie Consent Extraction

Pierwszy „bezpieczny” core

Cel:
Wydzielić obsługę cookies do osobnego modułu 1:1.

Dlaczego pierwszy:
	•	najmniej zależności
	•	brak wpływu na logikę biznesową
	•	świetny test, czy AI rozumie „behavior preservation”

⸻

🔹 Milestone 2.2 – Availability Detection Extraction

Pierwsza reguła biznesowa

Cel:
Wydzielić logikę „do koszyka / kup teraz”.

Dlaczego osobno:
	•	to już logika decyzyjna
	•	najczęściej AI próbuje ją „ulepszyć”
	•	musi być zablokowana kontraktami

⸻

🔹 Milestone 2.3 – Price Extraction Core

Serce WatchDoga

Cel:
Wydzielić całą logikę czytania ceny (w tym MediaExpert).

Dlaczego osobno:
	•	największe ryzyko
	•	najwięcej pokusy „uogólniania”
	•	to będzie później wołane przez API

⸻

🔹 Milestone 2.4 – Orchestrator Thinning

checkMyPrices.ts jako cienki sterownik

Cel:
Zostawić w checkMyPrices.ts tylko:
	•	pętlę
	•	kolejność wywołań
	•	formatowanie outputu

Dlaczego na końcu:
Bo dopiero wtedy wiemy, co faktycznie jest core, a co sterowaniem.