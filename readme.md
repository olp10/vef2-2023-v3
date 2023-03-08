# Vefforritun 2, 2023, verkefni 3: kennsluskráar vefþjónustur

Verkefnið er framhald af verkefni 1 og snýst um að útbúa vefþjónustur ofan á „okkar eigin kennsluskrá“.


  `npm run setup` -> setja gögn inn í gagnagrunn á localhost\
  `npm start` -> Keyra vefþjón

## Vefþjónustur

### Deildir:

- `GET /departments` skilar lista af deildum
- `GET /departments/:slug` skilar stakri deild
- `POST /departments` býr til nýja deild
    - Þarf að senda inn:
      - "name":
      - "csv":
      - "description":
  - `PATCH /departments/:slug` uppfærir deild:
    - Þarf ekki að senda inn alla reiti, hægt að senda einn (eða fleiri) í einu sem á að uppfæra
  - `DELETE /departments/:slug` eyðir deild

### Áfangar:

- `GET /classes` skilar öllum áföngum í öllum deildum
- `GET /departments/:department/classes` skilar öllum áföngum í :department
- `POST /departments/:department/classes` býr til nýjan áfanga
  - Tókst ekki að útfæra villumeðhöndlun, svo það þarf að senda inn alla reiti í JSON til að búa til nýjan áfanga:
    - "name":
    - "number":
    - "credits":
    - "department":
    - "semester":
    - "linkToSyllabus":
    - "degree":
- `DELETE /departments/:department/classes/:slug` eyðir áfanga
- `PATCH /departments/:department/classes/:slug` uppfærir áfanga
  - Svipað og með POST, þá þarf að senda inn:
    - "number":
    - "credits":
    - "department":
    - "degree":
    - "semester":
    - "linkToSyllabus":

