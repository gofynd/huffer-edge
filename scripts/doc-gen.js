const { optMap } = require("../dimensions");
const fs = require("fs");
const path = require("path");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let str = `## Properties \n`;
Object.keys(optMap).map((ok) => {
  const ov = optMap[ok];
  str += `### ${ok.toUpperCase().replace("O_", "")} (${ok})\n##### ${
    ov.desc || ""
  }\n`;
  if (Object.keys(ov.params || {}).length) {
    str += `#### Params:\n`;
  }
  str += Object.keys(ov.params)
    .map((pk) => {
      const pv = ov.params[pk];
      return `* **${pv.name}** - ${pk} => **Type**: ${pv.type}, **Default**: ${pv.default}`;
    })
    .join("\n");
  str += `\n\n[Sharp ${capitalizeFirstLetter(
    ok.replace("o_", "")
  )} Documentation](https://sharp.pixelplumbing.com/api-operation#${ok
    .toLowerCase()
    .replace("o_", "")})`;
  str += "\n\n";
});

fs.writeFileSync(path.join(__dirname, "../Properties.md"), str);
console.log("Properties.md created.");
console.log(str);
