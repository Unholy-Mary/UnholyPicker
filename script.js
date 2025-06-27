const guides = {
  mei: '🧊 Guide för Mei: Använd muren för att isolera, ult i tighta utrymmen.',
  juno: '💫 Guide för Juno: Håll zonen, snärj flankers, ulta tillsammans med tank.',
  sigma: '🛡️ Guide för Sigma: Använd shield smart, komba med rock → skada.',
};

const allHeroes = [
  { name: 'D.Va', matchKey: 'd.va', role: 'tank' },
  { name: 'Doomfist', matchKey: 'doomfist', role: 'tank' },
  { name: 'Junker Queen', matchKey: 'junker queen', role: 'tank' },
  { name: 'Mauga', matchKey: 'mauga', role: 'tank' },
  { name: 'Orisa', matchKey: 'orisa', role: 'tank' },
  { name: 'Ramattra', matchKey: 'ramattra', role: 'tank' },
  { name: 'Reinhardt', matchKey: 'reinhardt', role: 'tank' },
  { name: 'Roadhog', matchKey: 'roadhog', role: 'tank' },
  { name: 'Sigma', matchKey: 'sigma', role: 'tank' },
  { name: 'Winston', matchKey: 'winston', role: 'tank' },
  { name: 'Wrecking Ball', matchKey: 'wrecking ball', role: 'tank' },
  { name: 'Zarya', matchKey: 'zarya', role: 'tank' },
  { name: 'Mei', matchKey: 'mei', role: 'dps' },
  { name: 'Reaper', matchKey: 'reaper', role: 'dps' },
  { name: 'Echo', matchKey: 'echo', role: 'dps' },
  { name: 'Tracer', matchKey: 'tracer', role: 'dps' },
  { name: 'Genji', matchKey: 'genji', role: 'dps' },
  { name: 'Pharah', matchKey: 'pharah', role: 'dps' },
  { name: 'Juno', matchKey: 'juno', role: 'support' },
  { name: 'Moira', matchKey: 'moira', role: 'support' },
  { name: 'Ana', matchKey: 'ana', role: 'support' },
  { name: 'Kiriko', matchKey: 'kiriko', role: 'support' }
];

function readText() {
  console.log("🔍 Läser in texten…");

  const text = document.getElementById('inputText').value.toLowerCase();
  const playerRole = determineMissingRole(text);
  console.log("🧩 Saknad roll:", playerRole);
  const candidates = findTopHeroes(text, playerRole);

  if (candidates.length === 1) {
    showGuide(candidates[0]);
  } else if (candidates.length > 1) {
    let html = 'Välj hjälte:<br/>';
    candidates.forEach(h => {
      html += `<button onclick="showGuide('${h}')">${capitalize(h)}</button> `;
    });
    document.getElementById('output').innerHTML = html;
  } else {
    document.getElementById('output').innerText = 'Ingen passande hjälte hittades.';
  }
}

function determineMissingRole(text) {
  const lines = text.split('\n').map(l => l.trim().toLowerCase());
  let allySection = false;
  const allyHeroes = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('ally team - score')) {
      allySection = true;
      continue;
    }

    if (line.includes('score') && line.includes('enemy team')) {
      allySection = false;
    }

    if (allySection) {
      const hero = allHeroes.find(h => line.includes(h.matchKey));
      if (hero && !allyHeroes.includes(hero.name.toLowerCase())) {
        allyHeroes.push(hero.name.toLowerCase());
      }
    }
  }

  const roleCounts = { tank: 0, dps: 0, support: 0 };
  for (let hero of allyHeroes) {
    const role = allHeroes.find(h => h.name.toLowerCase() === hero)?.role;
    if (role) roleCounts[role]++;
  }

  if (roleCounts.tank < 1) return 'tank';
  if (roleCounts.support < 2) return 'support';
  if (roleCounts.dps < 2) return 'dps';
  return 'okänd';
}

function findTopHeroes(text, role) {
  const lines = text.split('\n').map(l => l.trim().toLowerCase());
  const roleHeroes = allHeroes.filter(h => h.role === role);
  const scores = {};

  for (let i = 0; i < lines.length - 1; i++) {
    const heroLine = lines[i];
    const scoreLine = lines[i + 1];
    const hero = roleHeroes.find(h => heroLine.includes(h.matchKey));
    const score = parseInt(scoreLine);
    if (hero && !isNaN(score)) {
      scores[hero.matchKey] = score;
    }
  }

  const allScores = Object.values(scores);
  if (allScores.length === 0) return [];

  const maxScore = Math.max(...allScores);
  return Object.keys(scores).filter(key => scores[key] === maxScore);
}

function showGuide(heroKey) {
  const guide = guides[heroKey];
  document.getElementById('output').innerText = guide ? guide : `Ingen guide finns ännu för ${capitalize(heroKey)}`;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
