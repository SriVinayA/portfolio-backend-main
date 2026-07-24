const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('/Users/srivinaya/.gemini/antigravity/brain/70ce60fc-6aee-40bc-988b-52b37b432e66/.system_generated/logs/transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('"step_index":782')) {
      const parsed = JSON.parse(line);
      const content = parsed.content;
      fs.writeFileSync('/Users/srivinaya/Developer/portfolio/portfolio-frontend/src/components/portfolio/Universe.css', content);
      console.log('Saved Universe.css');
      break;
    }
  }
}

processLineByLine();
