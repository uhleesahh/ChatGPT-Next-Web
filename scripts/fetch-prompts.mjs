import fetch from "node-fetch";
import fs from "fs/promises";

const RAW_FILE_URL = "https://raw.githubusercontent.com/";
const MIRRORF_FILE_URL = "https://raw.fgit.ml/";

const RAW_EN_URL = "f/awesome-chatgpt-prompts/main/prompts.csv";
const EN_URL = MIRRORF_FILE_URL + RAW_EN_URL;
const FILE = "./public/prompts.json";

const timeoutPromise = (timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);
  });
};

async function fetchEN() {
  console.log("[Fetch] fetching en prompts...");
  try {
    // const raw = await (await fetch(EN_URL)).text();
    const response = await Promise.race([fetch(EN_URL), timeoutPromise(5000)]);
    const raw = await response.text();
    return raw
      .split("\n")
      .slice(1)
      .map((v) => v.split('","').map((v) => v.replace(/^"|"$/g, '').replaceAll('""','"')));
  } catch (error) {
    console.error("[Fetch] failed to fetch en prompts", error);
    return [];
  }
}

async function main() {
  Promise.all(fetchEN()])
    .then(([en]) => {
      fs.writeFile(FILE, JSON.stringify({ en }));
    })
    .catch((e) => {
      console.error("[Fetch] failed to fetch prompts");
      fs.writeFile(FILE, JSON.stringify({ en: [] }));
    })
    .finally(() => {
      console.log("[Fetch] saved to " + FILE);
    });
}

main();
