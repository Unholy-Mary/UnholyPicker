const guides = {
  mei: '🧊 Guide för Mei: Använd muren för att isolera, ult i tighta utrymmen.',
  juno: '💫 Guide för Juno: Håll zonen, snärj flankers, ulta tillsammans med tank.',
  sigma: '🛡️ Guide för Sigma: Använd shield smart, komba med rock → skada.',
  // Lägg till fler guider här
};

const allHeroes = [
  { name: 'D.Va', matchKey: 'dva', role: 'tank' },
  { name: 'Orisa', matchKey: 'orisa', role: 'tank' },
  { name: 'Sigma', matchKey: 'sigma', role: 'tank' },
  { name: 'Winston', matchKey: 'winston', role: 'tank' },
  { name: 'Reinhardt', matchKey: 'reinhardt', role: 'tank' },
  { name: 'Hazard', matchKey: 'hazard', role: 'tank' },
  { name: 'Junker Queen', matchKey: 'junker queen', role: 'tank' },
  { name: 'Cassidy', matchKey: 'cassidy', role: 'dps' },
  { name: 'Mei', matchKey: 'mei', role: 'dps' },
  { name: 'Reaper', matchKey: 'reaper', role: 'dps' },
  { name: 'Sombra', matchKey: 'sombra', role: 'dps' },
  { name: 'Torbjörn', matchKey: 'torbjörn', role: 'dps' },
  { name: 'Widowmaker', matchKey: 'widowmaker', role: 'dps' },
  { name: 'Juno', matchKey: 'juno', role: 'support' },
  { name: 'Lifeweaver', matchKey: 'lifeweaver', role: 'support' },
  { name: 'Lucio', matchKey: 'lucio', role: 'support' },
  { name: 'Moira', matchKey: 'moira', role: 'support' },
  { name: 'Brigitte', matchKey: 'brigitte', role: 'support' },
  { name: 'Kiriko', matchKey: 'kiriko', role: 'support' },
];

function readText() {
  const text = document.getElementById('inputText').value.toLowerCase();
  const playerRole = determineMissingRole(text);
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
  const lines = text.split('\n');
  let allySection = false;
  const allyHeroes = [];

  for (let line of lines) {
    if (line.includes('enemy team')) allySection = false;
    if (line.includes('ally team')) {
      allySection = true;
      continue;
    }
    if (allySection) {
      for (let h of allHeroes) {
        if (line.includes(h.name.toLowerCase()) && !allyHeroes.includes(h.name.toLowerCase())) {
          allyHeroes.push(h.name.toLowerCase());
        }
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
  const scoreMap = {};
  const lines = text.split('\n');

  for (let line of lines) {
    for (let h of allHeroes) {
      if (h.role === role && line.includes(h.name.toLowerCase())) {
        const match = line.match(/icon(\d+)/);
        if (match) {
          const score = parseInt(match[1], 10);
          scoreMap[h.matchKey] = score;
        }
      }
    }
  }

  const max = Math.max(...Object.values(scoreMap));
  return Object.keys(scoreMap).filter(h => scoreMap[h] === max);
}

function showGuide(heroKey) {
  const guide = guides[heroKey];
  document.getElementById('output').innerText = guide ? guide : `Ingen guide finns ännu för ${capitalize(heroKey)}`;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
