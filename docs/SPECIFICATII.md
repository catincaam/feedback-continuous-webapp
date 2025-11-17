# Specificații Proiect: Continuous Feedback WebApp

## Tema proiectului
Continuous Feedback Application – Tema 6, Tehnologii Web ASE

## Obiectiv
Realizarea unei aplicații web pentru acordarea de feedback continuu la activități (cursuri și seminarii). Feedback-ul este anonim și poate fi vizualizat în timp real și ulterior de profesor.

## Funcționalități minime
1. Profesorul creează o activitate cu:
   - dată
   - descriere
   - cod unic de acces
2. Studentul se poate autentifica și introduce codul pentru a participa.
3. Studentul poate trimite feedback prin 4 emoticoane:  
   - Smiley (fericit)  
   - Frowny (trist)  
   - Surprins  
   - Confuz
4. Profesorul poate vizualiza fluxul de feedback anonim, cu marcarea timpului fiecărui răspuns.
5. Feedback-ul poate fi consultat atât în timpul activității cât și ulterior.

## Tehnologii
- Frontend: React.js
- Backend: Node.js (REST API)
- Bază de date relațională (MySQL/PostgreSQL) cu ORM

## Structura proiectului
continuous-feedback-app/
├─ docs/       # Documentație și specificații
├─ frontend/   # Cod frontend (React.js)
└─ backend/    # Cod backend (Node.js)

## Etape de livrare
- **16.11.2025** – Specificații, plan proiect și structura repo în GitHub  
- **06.12.2025** – Serviciu RESTful funcțional + instrucțiuni de rulare  
- **Demo final** – Aplicația completă funcțională  

## Membri echipă
- Ana-Miruna Grigore
- Daria-Maria Marica
- Mara-Catinca Marinescu
- Profesor coordonator: [nume profesor]

## Observații
- Structura inițială pregătită pentru dezvoltarea frontend și backend.
- Documentația va fi actualizată pe măsură ce codul devine funcțional.
