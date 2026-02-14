Kamienie milowe:

🧭 WATCHDOG — GDZIE JESTEŚMY TERAZ (JEDNA MAPA)

0️⃣ PUNKT STARTOWY (HISTORIA)

Co było na początku:
	•	TS + Playwright
	•	monolityczny checkMyPrices.ts
	•	CSS selektory działające
	•	email działał w CI
	•	brak dokumentów, brak kontraktów

To był działający skrypt, ale bez ram.

⸻

1️⃣ ETAP 0 — WALIDACJA (ZAMKNIĘTY ✅)

Cel: sprawdzić, czy to w ogóle jest stabilne i warte rozwijania.

Zrobione:
	•	✔️ lokalny run (npm run watchdog)
	•	✔️ headful Playwright działa
	•	✔️ ceny czytane poprawnie
	•	✔️ brak OCR / screenshotów
	•	✔️ błąd maila zdiagnozowany jako env

Wniosek:
➡️ Core działa. Projekt jest technicznie zdrowy.

⸻

2️⃣ ETAP 1 — STABILIZACJA I KONFIGURACJA (ZAMKNIĘTY ✅)

Cel: nazwać rzeczy po imieniu i oddzielić co od jak.

Zrobione:
	•	✔️ watchdog/config/ powstał
	•	✔️ products.ts → config
	•	✔️ selectors.ts → jawne kontrakty DOM
	•	✔️ notifications.ts → adresaci maila w kodzie
	•	✔️ CI bez EMAIL_TO
	•	✔️ README.md
	•	✔️ ARCHITECTURE.md (append-only, prawo)

Wniosek:
➡️ Projekt ma kręgosłup architektoniczny.

⸻

🟡 TERAZ JESTEŚMY TUTAJ

👉 ETAP 2 jeszcze NIE ZACZĄŁ SIĘ.

To jest ważne:
	•	nic nie jest „w połowie”
	•	nic nie zostało popsute
	•	jesteś dokładnie pomiędzy etapami

⸻

3️⃣ ETAP 2 — EKSTRAKCJA CORE (ZAMKNIĘTY ✅)

Cel: przekształcić skrypt w silnik backendowy, BEZ zmiany zachowania.

Co będzie robione (ale jeszcze NIE jest):
	•	wydzielenie:
	•	consent
	•	availability
	•	price-extractor
	•	linijka w linijkę
	•	zero refaktoru
	•	zero „ulepszania”

Efekt:
	•	jeden core
	•	wiele wywołań (cron, API, mobilka)

⸻

4️⃣ ETAP 3 — API

Cel: WatchDog jako usługa.
	•	endpointy HTTP
	•	mobilka = klient
	•	zero Playwrighta po stronie klienta

⸻

5️⃣ ETAP 4 — KLIENCI (PRZYSZŁOŚĆ)
	•	mobilka
	•	web UI
	•	CLI


-->> po kazdym kamieniu milowym zrob walkthrough
--->> kiedy wszystko bedzie zrobione zrob podsumowanie etapów i zaktualizuj dokumentację