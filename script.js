const guides = {
  mei: '🧊 Guide för Mei: Använd muren för att isolera, ult i tighta utrymmen.',
  juno: '💫 Guide för Juno: Håll zonen, snärj flankers, ulta tillsammans med tank.',
  sigma: '🛡️ Guide för Sigma: Använd shield smart, komba med rock → skada.',
  // Lägg till fler guider här
};

const allHeroes = [
  // 🛡️ Tank
  { name: 'D.Va', matchKey: 'dva', role: 'tank' },
  { name: 'Doomfist', matchKey: 'doomfist', role: 'tank' },
  { name: 'Hazard', matchKey: 'hazard', role: 'tank' },
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

  // 🔫 DPS
  { name: 'Ashe', matchKey: 'ashe', role: 'dps' },
  { name: 'Bastion', matchKey: 'bastion', role: 'dps' },
  { name: 'Cassidy', matchKey: 'cassidy', role: 'dps' },
  { name: 'Echo', matchKey: 'echo', role: 'dps' },
  { name: 'Freja', matchKey: 'freja', role: 'dps' },
  { name: 'Genji', matchKey: 'genji', role: 'dps' },
  { name: 'Hanzo', matchKey: 'hanzo', role: 'dps' },
  { name: 'Junkrat', matchKey: 'junkrat', role: 'dps' },
  { name: 'Mei', matchKey: 'mei', role: 'dps' },
  { name: 'Pharah', matchKey: 'pharah', role: 'dps' },
  { name: 'Reaper', matchKey: 'reaper', role: 'dps' },
  { name: 'Sojourn', matchKey: 'sojourn', role: 'dps' },
  { name: 'Soldier: 76', matchKey: 'soldier 76', role: 'dps' },
  { name: 'Sombra', matchKey: 'sombra', role: 'dps' },
  { name: 'Symmetra', matchKey: 'symmetra', role: 'dps' },
  { name: 'Torbjörn', matchKey: 'torbjörn', role: 'dps' },
  { name: 'Tracer', matchKey: 'tracer', role: 'dps' },
  { name: 'Venture', matchKey: 'venture', role: 'dps' },
  { name: 'Widowmaker', matchKey: 'widowmaker', role: 'dps' },

  // 💉 Support
  { name: 'Ana', matchKey: 'ana', role: 'support' },
  { name: 'Baptiste', matchKey: 'baptiste', role: 'support' },
  { name: 'Brigitte', matchKey: 'brigitte', role: 'support' },
  { name: 'Illari', matchKey: 'illari', role: 'support' },
  { name: 'Juno', matchKey: 'juno', role: 'support' },
  { name: 'Kiriko', matchKey: 'kiriko', role: 'support' },
  { name: 'Lifeweaver', matchKey: 'lifeweaver', role: 'support' },
  { name: 'Lucio', matchKey: 'lucio', role: 'support' },
  { name: 'Mercy', matchKey: 'mercy', role: 'support' },
  { name: 'Moira', matchKey: 'moira', role: 'support' },
  { name: 'Zenyatta', matchKey: 'zenyatta', role: 'support' }
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

window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");
  if (data) {
    const decoded = decodeURIComponent(data);
    document.getElementById("inputText").value = decoded;
    readText();
  }
});

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
  const lines = text.split('\n');
  const scores = {};
  for (let i = 0; i < lines.length - 1; i++) {
    for (let h of allHeroes) {
      if (h.role === role && lines[i].includes(h.name.toLowerCase())) {
        const score = parseInt(lines[i + 1]);
        if (!isNaN(score)) {
          scores[h.matchKey] = score;
        }
      }
    }
  }

  const max = Math.max(...Object.values(scores));
  return Object.keys(scores).filter(h => scores[h] === max);
}

function showGuide(heroKey) {
  const guide = guides[heroKey];
  document.getElementById('output').innerText = guide ? guide : `Ingen guide finns ännu för ${capitalize(heroKey)}`;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
