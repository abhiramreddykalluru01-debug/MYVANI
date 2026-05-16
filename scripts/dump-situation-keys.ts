import { writeFileSync } from "fs";
import { STATIC_SITUATION_SCRIPTS } from "../src/lib/situation/static-scripts";
import { forEachSituationLine } from "../src/lib/situation/locale";

const keys: string[] = [];
for (const script of STATIC_SITUATION_SCRIPTS) {
  forEachSituationLine(script, (key) => keys.push(key));
}
writeFileSync("scripts/situation-keys.txt", keys.join("\n"));
console.log("count", keys.length);
