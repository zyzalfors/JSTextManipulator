function addOnInputEvent(checkbox)
{
 let originalTextArea = document.getElementById("original");
 if(checkbox.checked) 
 {
  originalTextArea.oninput = manipulateText;
 }
 else 
 {
  originalTextArea.oninput = null;
 }
}

function saveFileText(filter)
{
 let text = document.getElementById(filter).value;
 let encoding = prompt("Enter file encoding among ASCII, EBCDIC, UTF-8, UTF-16BE, UTF-16LE, UTF-32BE, UTF-32LE:");
 encoding = encoding ?? "UTF-8";
 encoding = removeSpaces(encoding);
 encoding = encoding === "" ? "UTF-8" : encoding.toUpperCase();
 let bytes;
 switch(encoding)
 {
  case "ASCII":
   bytes = getASCIIBytes(text);
   break;
  case "EBCDIC":
   bytes = getEBCDICBytes(text);
   break;
  case "UTF-8":
   bytes = new TextEncoder().encode(text);
   break;
  case "UTF-16BE":
   bytes = getUTF16BEBytes(text);
   break;
  case "UTF-16LE":
   bytes = getUTF16LEBytes(text);
   break;
  case "UTF-32BE":
   bytes = getUTF32BEBytes(text);
   break;
  case "UTF-32LE":
   bytes = getUTF32LEBytes(text);
   break;
  default:
   window.alert("Invalid encoding");
   return;
 }
 let blob = new Blob([bytes], {type: 'octet/stream'});
 let a = document.createElement("a");
 a.download = "JSTM_saveFileTextTo" + encoding + ".txt";
 a.href = window.URL.createObjectURL(blob);
 a.click();
}

function getFileText(filter)
{
 let input = document.createElement("input");
 input.type = "file";
 input.onchange = () =>
 {
  let file = input.files[0];
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () =>
  {
   let encoding = prompt("Enter file encoding:");
   encoding = encoding ?? "UTF-8";
   encoding = removeSpaces(encoding);
   encoding = encoding === "" ? "UTF-8" : encoding.toUpperCase();
   try 
   {
    document.getElementById(filter).value = new TextDecoder(encoding).decode(new Uint8Array(reader.result));
   }
   catch(error)
   {
    window.alert(error.toString());
    return;
   }
  };
 };
 input.click();
}

function writeClipboardText(filter, show)
{
 let text = document.getElementById(filter).value;
 navigator.clipboard.writeText(text).then(() => { if(show){ window.alert("Text copied"); } });
}

function getClipboardText(filter)
{
 navigator.clipboard.readText().then((text) => { document.getElementById(filter).value = text; });
}

function clearMethods()
{ 
 document.getElementById("methods").value = "{ \"methods\" : [] }";
}

function getASCIIBytes(text)
{
 let characters = Array.from(text);
 let bytes = [];
 characters.forEach(char => bytes.push(char.codePointAt() <= 255 ? char.codePointAt() : 20));
 return new Uint8Array(bytes);
}

function getEBCDICBytes(text)
{
 let characters = Array.from(text);
 let AToETable = [0, 1, 2, 3, 55, 45, 46, 47, 22, 5, 37, 11, 12, 13, 14, 15, 16, 17, 18, 19, 60, 61, 50, 38, 24, 25, 63, 39, 28, 29, 30, 31, 64, 79, 127, 123, 91, 108, 80, 125, 77, 93, 92, 78,107, 96, 75, 97, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 122, 94, 76, 126, 110, 111, 124, 193, 194, 195, 196, 197, 198, 199, 200, 201, 209, 210, 211, 212, 213, 214, 215, 216, 217, 226, 227, 228, 229, 230, 231, 232, 233, 74, 224, 90, 95, 109, 121, 129, 130, 131, 132, 133, 134, 135, 136, 137, 145, 146, 147, 148, 149, 150, 151, 152, 153, 162, 163, 164, 165, 166, 167, 168, 169, 192, 106, 208, 161, 7, 32, 33, 34, 35, 36, 21, 6, 23, 40, 41, 42, 43, 44, 9, 10, 27, 48, 49, 26, 51, 52, 53, 54, 8, 56, 57, 58, 59, 4, 20, 62, 225, 65, 66, 67, 68, 69, 70, 71, 72, 73, 81, 82, 83, 84, 85, 86, 87, 88, 89, 98, 99, 100, 101, 102, 103, 104, 105, 112, 113, 114, 115, 116, 117, 118, 119, 120, 128, 138, 139, 140, 141, 142, 143, 144, 154, 155, 156, 157, 158, 159, 160, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 202, 203, 204, 205, 206, 207, 218, 219, 220, 221, 222, 223, 234, 235, 236, 237, 238, 239, 250, 251, 252, 253, 254, 255];
 let bytes = [];
 characters.forEach(char => bytes.push(char.codePointAt() <= 255 ? AToETable[char.codePointAt()] : 20));
 return new Uint8Array(bytes);
}

function getUTF16BEBytes(text)
{
 let characters = Array.from(text);
 let bytes = [254, 255];
 for(let char of characters)
 {
  let code = char.codePointAt();
  if(code <= 65535)
  {
   let stringifiedBytes = code.toString(2).padStart(16, "0");
   bytes.push(parseInt(stringifiedBytes.substring(0, 8), 2));
   bytes.push(parseInt(stringifiedBytes.substring(8), 2));
  }
  else 
  {
   let tempBin = (code - 65536).toString(2).padStart(20, "0");
   let stringifiedBytes = "110110" + tempBin.substring(0, 10) + "110111" + tempBin.substring(10);
   bytes.push(parseInt(stringifiedBytes.substring(0, 8), 2));
   bytes.push(parseInt(stringifiedBytes.substring(8, 16), 2));
   bytes.push(parseInt(stringifiedBytes.substring(16, 24), 2));
   bytes.push(parseInt(stringifiedBytes.substring(24), 2));
  }
 }
 return new Uint8Array(bytes);
}

function getUTF16LEBytes(text)
{
 let characters = Array.from(text);
 let bytes = [255, 254];
 for(let char of characters)
 {
  let code = char.codePointAt();
  if(code <= 65535)
  {
   let stringifiedBytes = code.toString(2).padStart(16, "0");
   bytes.push(parseInt(stringifiedBytes.substring(8), 2));
   bytes.push(parseInt(stringifiedBytes.substring(0, 8), 2));
  }
  else
  {
   let tempBin = (code - 65536).toString(2).padStart(20, "0");
   let stringifiedBytes = "110110" + tempBin.substring(0, 10) + "110111" + tempBin.substring(10);
   bytes.push(parseInt(stringifiedBytes.substring(8, 16), 2));
   bytes.push(parseInt(stringifiedBytes.substring(0, 8), 2));
   bytes.push(parseInt(stringifiedBytes.substring(24), 2));
   bytes.push(parseInt(stringifiedBytes.substring(16, 24), 2));
  }
 }
 return new Uint8Array(bytes);
}

function getUTF32BEBytes(text)
{
 let characters = Array.from(text);
 let bytes = [0, 0, 254, 255];
 for(let char of characters)
 {
  let stringifiedBytes = char.codePointAt().toString(2).padStart(32, "0");
  bytes.push(parseInt(stringifiedBytes.substring(0, 8), 2));
  bytes.push(parseInt(stringifiedBytes.substring(8, 16), 2));
  bytes.push(parseInt(stringifiedBytes.substring(16, 24), 2));
  bytes.push(parseInt(stringifiedBytes.substring(24), 2));
 }
 return new Uint8Array(bytes);
}

function getUTF32LEBytes(text)
{
 let characters = Array.from(text);
 let bytes = [255, 254, 0, 0];
 for(let char of characters)
 {
  let stringifiedBytes = char.codePointAt().toString(2).padStart(32, "0");
  bytes.push(parseInt(stringifiedBytes.substring(24), 2));
  bytes.push(parseInt(stringifiedBytes.substring(16, 24), 2));
  bytes.push(parseInt(stringifiedBytes.substring(8, 16), 2)); 
  bytes.push(parseInt(stringifiedBytes.substring(0, 8), 2));
 }
 return new Uint8Array(bytes);
}

function addMethod()
{
 let method = document.getElementById("methodList").value;
 if(method === "null")
 {
  return;
 }
 let regex = document.getElementById("regex").value;
 let start = parseInt(document.getElementById("start").value);
 let final = parseInt(document.getElementById("final").value);
 let global = document.getElementById("global").checked;
 let caseIns = document.getElementById("caseIns").checked;
 let replacement = method === "Replace" ? document.getElementById("replacement").value : null;
 let json = JSON.parse(document.getElementById("methods").value);
 json.methods.push(
                   {
                    "method": method,
                    "regex": regex,
                    "global": global,
                    "caseIns": caseIns,
                    "replacement": replacement,
                    "start": start,
                    "final": final
                   }
                  );
 document.getElementById("methods").value = JSON.stringify(json, null, 1);
}

function clearFromJSON(text)
{
 return text.replace(/\\\\/g, "\\").substring(1).slice(0, -1);
}

function getRegex(regex, global, caseIns)
{
 if(global && caseIns)
 {
  return new RegExp(regex, "gi");
 }
 if(global && !caseIns)
 {
  return new RegExp(regex, "g");
 }
 if(!global && caseIns)
 {
  return new RegExp(regex, "i");
 }
 return new RegExp(regex);
}

function getCodePoints(text)
{
 let characters = Array.from(text);
 let manipulatedText = "";
 for(let char of characters)
 {
  manipulatedText += "0x" + char.codePointAt() + " ";
 }
 return manipulatedText.slice(0, -1);
}

function extractMatches(text, start, final, regExp)
{
 let matches = getSubstring(text, start, final).match(regExp);
 if(matches === null)
 {
  throw "No matches found";
 }
 return matches.join("\n");
}

function getSubstring(text, start, final)
{
 return Array.from(text).slice(start, final + 1).join("");
}

function replaceUsingMethod(text, start, final, regExp, method)
{
 let size = Array.from(text).length;
 let firstPart = getSubstring(text, 0, start - 1);
 let lastPart = getSubstring(text, final + 1, size - 1);
 let manipulatedPart = getSubstring(text, start, final).replace(regExp, (match) => { return method(match); });
 return firstPart + manipulatedPart + lastPart;
}

function replaceUsingReplacement(text, start, final, regExp, replacement)
{
 let size = Array.from(text).length;
 let firstPart = getSubstring(text, 0, start - 1);
 let lastPart = getSubstring(text, final + 1, size - 1);
 let manipulatedPart = getSubstring(text, start, final).replace(regExp, replacement);
 return firstPart + manipulatedPart + lastPart;
}

function toSentence(text)
{
 let manipulatedText = "";
 let toUp = true;
 for(let i = 0; i < text.length; i++)
 {
  if(text[i].search(/[!\?\.]/) === -1)
  {
   if(toUp === true && text[i].toUpperCase() !== text[i].toLowerCase())
   {
    manipulatedText += text[i].toUpperCase();
    toUp = false;
   }
   else
   {
    manipulatedText += text[i].toLowerCase();
   }
  }
  else
  {
   manipulatedText += text[i];
   if(i < text.length - 1 && text[i + 1].search(/\s/) !== -1)
   {
    toUp = true;
   }
  }
 }
 return manipulatedText;
}

function toAlternating(text, toUp)
{
 let manipulatedText = "";
 for(let i = 0; i < text.length; i++)
 {
  if(text[i].toUpperCase() !== text[i].toLowerCase())
  {
   if(toUp === true)
   {
    manipulatedText += text[i].toUpperCase();
    toUp = false;
   }
   else
   {
    manipulatedText += text[i].toLowerCase();
    toUp = true;
   }
  }
  else
  {
   manipulatedText += text[i];
  }
 }
 return manipulatedText;	
}

function toAlternating1(text)
{
 return toAlternating(text, true);
}
 
function toAlternating2(text)
{
 return toAlternating(text, false);
}

function toBase64(text)
{
 return btoa(unescape(encodeURIComponent(text)));
}

function fromBase64(text)
{
 return decodeURIComponent(escape(atob(text)));
}

function toSingleLine(text)
{
 return text.replace(/\n+/g, " ").trim();
}

function removeSpaces(text)
{
 return text.replace(/[\t ]+/g, "");
}

function removeRedundantSpaces(text)
{
 return text.trim().replace(/[\t ]+/g, " ").replace(/[\t ]+\n/g, "\n");
}

function toList(text)
{
 return text.trim().replace(/\s/g, "\n").replace(/\n+/g, "\n");
}

function removeDuplicatedLines(text)
{
 return Array.from(new Set(text.split("\n"))).join("\n");
}

function removeEmptyLines(text) 
{
 return text.split("\n").filter((text) => { return text.search(/[^\s]/g) !== -1; }).join("\n");
}

function reverseList(text)
{
 return text.split("\n").reverse().join("\n");
}

function sortList(text)
{
 let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
 return text.split("\n").sort(collator.compare).join("\n");
}

function beautifyJSON(text)
{
 return JSON.stringify(JSON.parse(text), null, 1);
}

function uglifyJSON(text)
{
 return JSON.stringify(JSON.parse(text), null, 0);
}

function XMLtoJSON(text)
{
 return JSON.stringify(new XMLParser({ }).parse(text), null, 0);
}

function manipulateText()
{
 let methods = JSON.parse(document.getElementById("methods").value).methods;
 let manipulatedText = document.getElementById("original").value;
 try
 {
  for(let entry of methods)
  {
   let size = Array.from(manipulatedText).length;
   let regex = clearFromJSON(JSON.stringify(entry.regex));
   let replacement = clearFromJSON(JSON.stringify(entry.replacement));
   let global = entry.global;
   let caseIns = entry.caseIns;
   let regExp = getRegex(regex, global, caseIns);
   let start = entry.start === null || entry.start < 0 || entry.start > size - 1 ? 0 : entry.start;
   let final = entry.final === null || entry.final < start || entry.final > size - 1 ? size - 1 : entry.final;
   let method = clearFromJSON(JSON.stringify(entry.method));
   switch(method)
   {
    case "Replace":
     manipulatedText = replaceUsingReplacement(manipulatedText, start, final, regExp, replacement);
     break;
    case "Convert to sentence case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, toSentence);
     break;
    case "Convert to upper case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.upperCase);
     break;
    case "Convert to lower case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.lowerCase);
     break;
    case "Convert to inverse case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.swapCase);
     break;
    case "Convert to title case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.titleCase);
     break;
    case "Convert to camel case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.camelCase);
     break;
    case "Convert to snake case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.snakeCase);
     break;
    case "Convert to slug case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.slugify);
     break;
    case "Convert to alternating case 1":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, toAlternating1);
     break;
    case "Convert to alternating case 2":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, toAlternating2);
     break;
    case "Convert to kebab case":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.kebabCase);
     break;
    case "Latinise":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.latinise);
     break;
    case "Reverse":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, v.reverseGrapheme);
     break;
    case "Convert to Base64":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, toBase64);
     break;
    case "Convert from Base64":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, fromBase64);
     break;
    case "Convert to single line":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, toSingleLine);
     break;
    case "Remove redundant spaces":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, removeRedundantSpaces);
     break;
    case "Remove spaces":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, removeSpaces);
     break;
    case "Remove duplicated lines":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, removeDuplicatedLines);
     break;
    case "Remove empty lines":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, removeEmptyLines);
     break;
    case "Convert to list":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, toList);
     break;
    case "Reverse as list":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, reverseList);
     break;
    case "Sort as list":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, sortList);
     break;
    case "Extract matches":
     manipulatedText = extractMatches(manipulatedText, start, final, regExp);
     break;
    case "Evaluate as math expression":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, math.evaluate);
     break;
    case "Simplify as math expression":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, math.simplify);
     break;
    case "Beautify as JSON":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, beautifyJSON);
     break;
    case "Uglify as JSON":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, uglifyJSON);
     break;
    case "Convert XML to JSON":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, XMLtoJSON);
     break;
	case "Encode as URI":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, encodeURIComponent);
     break;
	case "Decode as URI":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, decodeURIComponent);
     break;
	case "Convert to code points":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, getCodePoints);
     break;
	case "MD5 hash":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, CryptoJS.MD5);
     break;
	case "SHA-1 hash":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, CryptoJS.SHA1);
     break;
	case "SHA-256 hash":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, CryptoJS.SHA256);
     break;
	case "SHA-512 hash":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, CryptoJS.SHA512);
     break;
	case "RIPEMD-160 hash":
     manipulatedText = replaceUsingMethod(manipulatedText, start, final, regExp, CryptoJS.RIPEMD160);
     break;
    default:
   }
  }
 }
 catch(error)
 {
  window.alert(error.toString());
  return;
 }
 document.getElementById("manipulated").value = manipulatedText;
 if(document.getElementById("copyManipulated").checked)
 {
  writeClipboardText("manipulated", false);
 }
}