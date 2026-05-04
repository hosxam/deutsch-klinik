# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-smoke.spec.cjs >> G. Existing task type regression >> mcq, true-false, gap-fill, heading-match, short-answer all render
- Location: tests\production-smoke.spec.cjs:296:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Users\ASUS\.openclaw\workspace\deutsch-klinik\test-results\.playwright-artifacts-5\traces\05e708eaa1325530e26d-2b60d4466e972220eff1-retry1.trace'
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - link "Deutsch Klinik C1" [ref=e7] [cursor=pointer]:
        - /url: "#/"
        - img [ref=e8]
        - generic [ref=e11]: Deutsch Klinik C1
      - generic [ref=e12]:
        - link "Dashboard" [ref=e13] [cursor=pointer]:
          - /url: "#/"
        - link "Level A1" [ref=e14] [cursor=pointer]:
          - /url: "#/level/A1"
        - link "Level A2" [ref=e15] [cursor=pointer]:
          - /url: "#/level/A2"
        - link "Level B1" [ref=e16] [cursor=pointer]:
          - /url: "#/level/B1"
        - link "Level B2" [ref=e17] [cursor=pointer]:
          - /url: "#/level/B2"
        - link "Level C1" [ref=e18] [cursor=pointer]:
          - /url: "#/level/C1"
        - link "Resources" [ref=e19] [cursor=pointer]:
          - /url: "#/resources"
        - link "Medical" [ref=e20] [cursor=pointer]:
          - /url: "#/medical"
          - img [ref=e21]
          - text: Medical
        - link "C1 Ready" [ref=e25] [cursor=pointer]:
          - /url: "#/c1-readiness"
          - img [ref=e26]
          - text: C1 Ready
        - link "FSP Hub" [ref=e30] [cursor=pointer]:
          - /url: "#/medical-fsp"
          - img [ref=e31]
          - text: FSP Hub
        - link "Mistakes" [ref=e35] [cursor=pointer]:
          - /url: "#/mistake-notebook"
          - img [ref=e36]
          - text: Mistakes
      - button [ref=e39]:
        - img [ref=e40]
  - main [ref=e46]:
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]:
          - button "← Exam Menu" [ref=e50]
          - generic [ref=e51]: Lesen
        - generic [ref=e52]:
          - generic [ref=e53]: 1/4
          - generic [ref=e54]: 0:57
      - generic [ref=e55]:
        - generic [ref=e56]:
          - paragraph [ref=e57]: "Text: 'Die Mietpreise in deutschen Grossstaedten sind in den letzten Jahren stark gestiegen. In Muenchen, Frankfurt und Stuttgart liegt der Quadratmeterpreis fuer eine Neubauwohnung oft ueber 20 Euro. Viele Menschen ziehen deshalb ins Umland, wo die Mieten guenstiger sind.' Warum ziehen viele Menschen ins Umland?"
          - generic [ref=e58]:
            - button "Weil die Arbeit dort ist" [ref=e59]
            - button "Weil die Mieten guenstiger sind" [ref=e60]
            - button "Weil die Schulen besser sind" [ref=e61]
            - button "Weil das Wetter besser ist" [ref=e62]
        - generic [ref=e63]:
          - paragraph [ref=e64]: "Text: 'Bei der Wohnungssuche sollten Mieter auf folgende Punkte achten: die Hoehe der Kaution (maximal drei Nettokaltmieten), die Betriebskosten und die Kuendigungsfrist. Ein Mietvertrag muss schriftlich abgeschlossen werden.' Die Kaution darf maximal zwei Nettokaltmieten betragen."
          - generic [ref=e65]:
            - button "True" [ref=e66]
            - button "False" [ref=e67]
        - generic [ref=e68]:
          - paragraph [ref=e69]: Welche Ueberschrift passt? 'Wegen eines Wasserrohrbruchs muss das gesamte Treppenhaus saniert werden. Die Bauarbeiten dauern voraussichtlich zwei Wochen. Waehrend dieser Zeit kann der Aufzug nicht benutzt werden. Wir bitten um Ihr Verstaendnis. Ihre Hausverwaltung'
          - generic [ref=e70]:
            - button "Aufzug defekt" [ref=e71]
            - button "Wasserrohrbruch im Treppenhaus" [ref=e72]
            - button "Neue Heizung eingebaut" [ref=e73]
            - button "Balkon gesperrt" [ref=e74]
        - generic [ref=e75]:
          - paragraph [ref=e76]: Der Vermieter ___ die Wohnung vor der Uebergabe noch renovieren.
          - generic [ref=e77]:
            - button "lassen" [ref=e78]
            - button "laesst" [ref=e79]
            - button "liess" [ref=e80]
            - button "gelassen" [ref=e81]
        - generic [ref=e82]:
          - paragraph [ref=e83]: "Text: 'In einem Mietshaus gibt es bestimmte Regelungen. Von 22 bis 6 Uhr gilt Nachtruhe. An Sonn- und Feiertagen ist das Bohten von Teppichen und laute Musik nicht erlaubt. Haustiere brauchen die Erlaubnis des Vermieters.' Wann beginnt die Nachtruhe?"
          - generic [ref=e84]:
            - button "Um 20 Uhr" [ref=e85]
            - button "Um 21 Uhr" [ref=e86]
            - button "Um 22 Uhr" [ref=e87]
            - button "Um 23 Uhr" [ref=e88]
        - generic [ref=e89]:
          - paragraph [ref=e90]: "Text: \"In einem Mietshaus gibt es bestimmte Regelungen. Von 22 bis 6 Uhr gilt Nachtruhe. An Sonn- und Feiertagen ist das Bohren von Teppichen und laute Musik nicht erlaubt. Haustiere brauchen die Erlaubnis des Vermieters.\" Wann beginnt die Nachtruhe?"
          - textbox "Type your answer..." [ref=e91]
      - button "Next Section" [ref=e92]
```