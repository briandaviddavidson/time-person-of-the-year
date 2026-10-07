# TIME Person of the Year

A React app for browsing every TIME Person of the Year honoree from 1927 to 2025. It has a sortable table of all the honorees and a set of D3 charts built from the same data.

**Live site:** https://time-person-of-the-year.web.app

## Features

- **Sortable table**: every honoree with year, honor, name, country, title, category, context, age when honored, and age at death. Any column can be sorted. The default is Year, newest first. Each name links to the person's Wikipedia page.
- **Charts** (titled "Beyond the table"). Clicking a chart's title collapses it.
  - **Where honorees come from**: a world map with honorees counted by country.
  - **What the world cared about**: a streamgraph of honoree categories over time.
  - **From "Man" to "Person" of the Year**: a timeline of how the wording of the honor changed.
  - **How old, when honored?**: a beeswarm plot of age at the time of the honor.
  - **Honored more than once**: people who were named more than once.

## Getting started

You need Node.js and Yarn.

```sh
yarn install
yarn start      # dev server at http://localhost:3000
yarn test       # Jest + React Testing Library, watch mode
yarn build      # production build in build/
```

The project was bootstrapped with [Create React App](https://create-react-app.dev/) (`react-scripts` 5).

## Deploying

The app is hosted on Firebase Hosting in the `time-person-of-the-year` GCP project. The config is in `firebase.json` and `.firebaserc`.

```sh
npx firebase-tools login   # once
yarn build
npx firebase-tools deploy --only hosting
```

## Project structure

```
src/
  App.js                  Page layout and masthead
  Table.js                Sortable honoree table
  charts/
    Visualizations.js     Chart section wrapper
    prepData.js           Turns people.json into chart-ready datasets
    WorldMap.js           Map of honorees by country
    CategoryStream.js     Category streamgraph
    HonorTimeline.js      Timeline of the honor's wording
    AgeBeeswarm.js        Age-at-honor beeswarm
    RepeatHonorees.js     People honored more than once
    CollapsibleCard.js    Collapsible chart container
    Tooltip.js            Shared chart tooltip
  data/
    people.json           Data the app loads
    people.csv            The same data as a spreadsheet
public/                   index.html, favicons, manifest
```

## Data

The app reads `src/data/people.json`. Each entry looks like this:

```json
{
  "year": "1927",
  "honor": "Man of the year",
  "name": "Charles Lindbergh",
  "country": "United States",
  "birth": "1902",
  "death": "1974",
  "title": "US Air Mail Pilot",
  "category": "",
  "context": "First Solo Transatlantic Flight"
}
```

`people.csv` holds the same records, but the app doesn't read it. If you add or edit an honoree, change `people.json` (and update the CSV too if you want the two to match).

For the world map, a few historical country names are mapped to their modern equivalents (Soviet Union → Russia, West Germany → Germany). The map data comes from [`world-atlas`](https://github.com/topojson/world-atlas). Vatican City is too small to have a shape on that map, so it shows up only in the ranked country list. The mappings are in `COUNTRY_ALIASES` and `NO_POLYGON` in `src/charts/prepData.js`.

## Built with Claude Code

The first version of the app, from 2020, was a plain sortable table and was written by hand. In June 2026 the app got a major update made with [Claude Code](https://claude.com/claude-code). That update:

- added the five D3 charts in `src/charts/` and the `prepData.js` module that builds their data from `people.json`
- put each chart in a collapsible card whose title can be used with the keyboard and respects the reduced-motion setting
- reworked the table (accessible sort controls, newest year first by default) and added tests for it
- added the honorees from 2021 to 2025

## Tech stack

- React 16
- D3 7, `topojson-client`, and `world-atlas` for the charts
- Jest and React Testing Library for tests
