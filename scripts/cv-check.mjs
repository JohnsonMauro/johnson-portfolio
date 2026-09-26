// Mechanical half of the CV content rules (docs/RESUME_GUIDELINES.md):
// word window, bullet length, banned openers and buzzwords, per locale.
// A bullet with no number is a warning, not a failure: rule 3 accepts a
// downstream business outcome when no metric exists. XYZ shape and keyword fit
// still need a human read.
//
//   pnpm cv:check
//
// Imports the locale files directly; relies on Node's built-in TypeScript
// type stripping (the locales only use type-only imports).
const LOCALES = ['en', 'pt'];
const WORD_WINDOW = { min: 475, max: 600 };
const MAX_BULLET_WORDS = 25;

const BANNED = {
  en: {
    openers: ['responsible for', 'in charge of', 'worked on', 'helped with'],
    buzzwords: [
      'results-driven', 'team player', 'synergy', 'go-getter',
      'think outside the box', 'passionate', 'rockstar',
    ],
  },
  pt: {
    openers: ['responsável por', 'encarregado de', 'trabalhei em', 'ajudei com', 'ajudei a'],
    buzzwords: [
      'orientado a resultados', 'focado em resultados', 'trabalho em equipe', 'sinergia',
      'pensar fora da caixa', 'apaixonado', 'rockstar',
    ],
  },
};

const countWords = (text) => text.split(/\s+/).filter(Boolean).length;

const checkLocale = async (locale) => {
  const { default: dict } = await import(`../src/domain/i18n/locales/${locale}.ts`);
  const bullets = dict.resume.flatMap((entry) =>
    (entry.bullets ?? []).map((text) => ({ where: `${entry.org} — ${entry.role}`, text })),
  );
  const prose = [dict.about.summary, dict.about.current];
  const words = countWords([...prose, ...bullets.map((bullet) => bullet.text)].join(' '));
  const { openers, buzzwords } = BANNED[locale];
  const problems = [];
  const warnings = [];

  if (words < WORD_WINDOW.min || words > WORD_WINDOW.max) {
    problems.push(`word count ${words} outside ${WORD_WINDOW.min}–${WORD_WINDOW.max}`);
  }
  for (const { where, text } of bullets) {
    const count = countWords(text);
    if (count > MAX_BULLET_WORDS) problems.push(`${count} words (max ${MAX_BULLET_WORDS}) · ${where}: "${text}"`);
    const opener = openers.find((phrase) => text.toLowerCase().startsWith(phrase));
    if (opener) problems.push(`banned opener "${opener}" · ${where}`);
    if (!/\d/.test(text)) warnings.push(`no number · ${where}: "${text}"`);
  }
  for (const text of [...prose, ...bullets.map((bullet) => bullet.text), dict.meta.description]) {
    const found = buzzwords.filter((phrase) => text.toLowerCase().includes(phrase));
    for (const phrase of found) problems.push(`buzzword "${phrase}": "${text.slice(0, 80)}…"`);
  }

  return { locale, words, bullets: bullets.length, problems, warnings };
};

const results = await Promise.all(LOCALES.map(checkLocale));
for (const { locale, words, bullets, problems, warnings } of results) {
  const status = problems.length ? `${problems.length} problem(s)` : 'ok';
  console.log(`${locale}: ${words} words · ${bullets} bullets · ${status} · ${warnings.length} warning(s)`);
  for (const problem of problems) console.log(`  ✗ ${problem}`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
}
if (results.some((result) => result.problems.length > 0)) process.exit(1);
