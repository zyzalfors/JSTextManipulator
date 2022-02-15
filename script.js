function unwrapText(checkboxObj) {
 let textAreas = Array.from(document.getElementsByTagName("textarea"));
 if(checkboxObj.checked) {
  textAreas.forEach( function (area) { area.wrap = "off"; } );
 }
 else {
  textAreas.forEach( function (area) { area.wrap = "on"; } );
 }
}

function addOnInputEvent(checkboxObj) {
 let originalTextArea = document.getElementById("original");
 if(checkboxObj.checked) {
  originalTextArea.oninput = manipulateText;
 }
 else {
  originalTextArea.oninput = function(){};
 }
}

function setColor() {
 document.body.style.backgroundColor = document.getElementById("color").value;	
}

function getClipboardText() {
 navigator.clipboard.readText().then(function(clipText) { document.getElementById("original").value = clipText; });
}

function getFileText() {
 let value = removeSpaces(document.getElementById("encoding").value);
 let encoding = value === "" ? "UTF-8" : value;
 let file = document.getElementById("file").files[0];
 let reader = new FileReader();
 reader.readAsArrayBuffer(file);
 reader.onload = function () { document.getElementById("original").value = new TextDecoder(encoding).decode(new Uint8Array(this.result)); };
}

function saveText(filter) {
 let text = filter.includes("original") ? document.getElementById("original").value : document.getElementById("manipulated").value;
 let blob = new Blob([text], {type:'text/plain'});
 let a = document.createElement("a");
 a.download = "JSTM_saveText.txt";
 a.href = window.URL.createObjectURL(blob);
 a.click();
}

function toUTF8() {
 let value = removeSpaces(document.getElementById("encoding").value);
 let encoding = value === "" ? "UTF-8" : value;
 let file = document.getElementById("file").files[0];
 let reader = new FileReader();
 reader.readAsArrayBuffer(file);
 reader.onload = function () {
                              let text = new TextDecoder(encoding).decode(new Uint8Array(this.result));
			      let blob = new Blob([text], {type:'text/plain'});
                              let a = document.createElement("a");
                              a.download = "JSTM_toUTF8.txt";
                              a.href = window.URL.createObjectURL(blob);
                              a.click();
			     };
}

function toASCII() {
 let value = removeSpaces(document.getElementById("encoding").value);
 let encoding = value === "" ? "UTF-8" : value;
 let file = document.getElementById("file").files[0];
 let reader = new FileReader();
 reader.readAsArrayBuffer(file);
 reader.onload = function () {
                              let characters = v.graphemes(new TextDecoder(encoding).decode(new Uint8Array(this.result)));
                              let bytes = [];
                              for(let entry of characters) {
     	 		       bytes.push(entry.codePointAt() <= 255 ? entry.codePointAt() : 20);
			      }
                              let blob = new Blob([new Uint8Array(bytes)], {type:'octet/stream'});
                              let a = document.createElement("a");
                              a.download = "JSTM_toASCII.txt";
                              a.href = window.URL.createObjectURL(blob);
                              a.click();
                             };
}

function toUTF16BE() {
 let value = removeSpaces(document.getElementById("encoding").value);
 let encoding = value === "" ? "UTF-8" : value;
 let file = document.getElementById("file").files[0];
 let reader = new FileReader();
 reader.readAsArrayBuffer(file);
 reader.onload = function () {
		              let characters = v.graphemes(new TextDecoder(encoding).decode(new Uint8Array(this.result)));
		              let bytes = [254, 255];
                              for(let entry of characters) {
			       let code = entry.codePointAt();
	 		       if(code <= 65535) {
			        let stringifiedBytes = code.toString(2).padStart(16,"0");
				bytes.push(parseInt(stringifiedBytes.substring(0,8),2));
				bytes.push(parseInt(stringifiedBytes.substring(8),2));
			       }
			       else {
			        let tempBin = (code - 65536).toString(2).padStart(20,"0");
				let stringifiedBytes = "110110" + tempBin.substring(0,10) + "110111" + tempBin.substring(10);
				bytes.push(parseInt(stringifiedBytes.substring(0,8),2));
				bytes.push(parseInt(stringifiedBytes.substring(8,16),2));
				bytes.push(parseInt(stringifiedBytes.substring(16,24),2));
				bytes.push(parseInt(stringifiedBytes.substring(24),2));
			       }
			      }						   
			      let blob = new Blob([new Uint8Array(bytes)], {type:'octet/stream'});
                              let a = document.createElement("a");
                              a.download = "JSTM_toUTF16BE.txt";
                              a.href = window.URL.createObjectURL(blob);
                              a.click();							
                             };
}

function toUTF16LE() {
 let value = removeSpaces(document.getElementById("encoding").value);
 let encoding = value === "" ? "UTF-8" : value;
 let file = document.getElementById("file").files[0];
 let reader = new FileReader();
 reader.readAsArrayBuffer(file);
 reader.onload = function () {
			      let characters = v.graphemes(new TextDecoder(encoding).decode(new Uint8Array(this.result)));
		              let bytes = [255, 254];
			      for(let entry of characters) {
			       let code = entry.codePointAt();
	 		       if(code <= 65535) {
				let stringifiedBytes = code.toString(2).padStart(16,"0");
				bytes.push(parseInt(stringifiedBytes.substring(8),2));
				bytes.push(parseInt(stringifiedBytes.substring(0,8),2));
			       }
			       else {
				let tempBin = (code - 65536).toString(2).padStart(20,"0");
				let stringifiedBytes = "110110" + tempBin.substring(0,10) + "110111" + tempBin.substring(10);
				bytes.push(parseInt(stringifiedBytes.substring(8,16),2));
				bytes.push(parseInt(stringifiedBytes.substring(0,8),2));
                                bytes.push(parseInt(stringifiedBytes.substring(24),2));
				bytes.push(parseInt(stringifiedBytes.substring(16,24),2));
			       }
			      }
			      let blob = new Blob([new Uint8Array(bytes)], {type:'octet/stream'});
                              let a = document.createElement("a");
                              a.download = "JSTM_toUTF16LE.txt";
                              a.href = window.URL.createObjectURL(blob);
                              a.click();							
                             };
}

function clearText(filter) {
 if(filter.includes("areas")) {
  document.getElementById("original").value = '';
  document.getElementById("manipulated").value = '';
 }
 if(filter.includes("original")) {
  document.getElementById("original").value = '';
 }
 if(filter.includes("manipulated")) {
  document.getElementById("manipulated").value = '';
 }
 if(filter.includes("methods")) {
  document.getElementById("methods").value = "{ \"methods\" : [] }";
 }
}

function copyText(filter) {
 if(filter.includes("original")) {
  document.getElementById("original").select();
 }
 if(filter.includes("manipulated")) {
  document.getElementById("manipulated").select();
 }
 document.execCommand("copy");
}

function removeMethod(filter) {
 let json = JSON.parse(document.getElementById("methods").value);
 if(filter.includes("first")) {
  json.methods.shift();
 }
 if(filter.includes("last")) {
  json.methods.pop();
 }
 document.getElementById("methods").value = JSON.stringify(json,null,1);
}

function moveText(filter) {
 if(filter.includes("to original")) {
  document.getElementById("original").value = document.getElementById("manipulated").value;
 }
 if(filter.includes("to manipulated")) {
  document.getElementById("manipulated").value = document.getElementById("original").value;
 }
}

function addMethod(filter) {
 let regex = document.getElementById("regex").value;
 let startI = parseInt(document.getElementById("start").value);
 let finalI = parseInt(document.getElementById("final").value);
 let global = filter === "Search" ? true : document.getElementById("global").checked;
 let caseIns = document.getElementById("caseIns").checked;
 let replacement = filter === "Replace" ? document.getElementById("replacement").value : null;
 let json = JSON.parse(document.getElementById("methods").value);
 json.methods.push(
                   {
                    "method": filter,
                    "regularExpression": regex,
		    "global": global,
		    "caseInsensitive": caseIns,
		    "replacement": replacement,
		    "startingIndex": startI,
		    "finalIndex": finalI
		   }
		  );
 document.getElementById("methods").value = JSON.stringify(json,null,1);
}

function clearFromJSON(text) {
 return text.replace(/\\\\/g,"\\").substring(1).slice(0,-1);
}

function getRegex(regex, global, caseIns) {
 try {
  if(global && caseIns) {
   return new RegExp(regex,"gi");
  }
  if(global && !caseIns) {
   return new RegExp(regex,"g");								
  }
  if(!global && caseIns) {
   return new RegExp(regex,"i");								
  }
  return new RegExp(regex);
 }
 catch(error) {
  return new RegExp("");
 }
}

function extract(text, startI, finalI, regExp) {
 return getSubstring(text, startI, finalI).match(regExp).join("\n");
}

function getSubstring(text, startI, finalI) {
 return v.graphemes(text).slice(startI, finalI + 1).join("");
}

function replaceWithMethod(text, startI, finalI, regExp, method) {
 let size = v.graphemes(text).length;
 let firstPart = getSubstring(text, 0, startI - 1);
 let lastPart = getSubstring(text, finalI + 1, size - 1);
 let manipulatedPart = getSubstring(text, startI, finalI).replace(regExp, function(match){ return method(match); });
 return firstPart + manipulatedPart + lastPart;
}

function replaceWithReplacement(text, startI, finalI, regExp, replacement) {
 let size = v.graphemes(text).length;
 let firstPart = getSubstring(text, 0, startI - 1);
 let lastPart = getSubstring(text, finalI + 1, size - 1);
 let manipulatedPart = getSubstring(text, startI, finalI).replace(regExp, replacement);
 return firstPart + manipulatedPart + lastPart;
}

function toUTF8Bytes(text) {
 let stringifiedBytes = "";
 let bytes = new TextEncoder().encode(text);
 bytes.forEach(function (entry) { stringifiedBytes += entry.toString(2).padStart(8,"0"); } );
 return stringifiedBytes;
}

function toUTF16BEBytes(text) {
 let characters = v.graphemes(text);
 let stringifiedBytes = "";
 for(let entry of characters) {
  let code = entry.codePointAt();
  if(code <= 65535) {
   stringifiedBytes += code.toString(2).padStart(16,"0");
  }
  else {
   let tempBin = (code - 65536).toString(2).padStart(20,"0");
   stringifiedBytes += "110110" + tempBin.substring(0,10) + "110111" + tempBin.substring(10);
  }
 }
 return stringifiedBytes;
}

function toSentence(text) {
 let manipulatedText = "";
 let toUp = true;
 for(let i = 0; i < text.length; i++) {
  if(text[i].search(/[!\?\.\s]/) === -1) {
   if(toUp === true && text[i].toUpperCase() !== text[i].toLowerCase() ) {
    manipulatedText += text[i].toUpperCase();
    toUp = false;
   }
   else {
    manipulatedText += text[i].toLowerCase();	
   }
  }
  else {
   manipulatedText += text[i];
   if(i < text.length - 1 && text[i].search(/[!\?\.]/) !== -1 && text[i + 1].search(/\s/) !== -1) {
    toUp = true;
   }
  }
 }
 return manipulatedText;
}

function toAlternating1(text) {
 let manipulatedText = "";
 let toUp = true;
 for(let i = 0; i < text.length; i++) {
  if(text[i].toUpperCase() !== text[i].toLowerCase()) {
   if(toUp === true) {
    manipulatedText += text[i].toUpperCase();
    toUp = false;
   }
   else {
    manipulatedText += text[i].toLowerCase();
    toUp = true;
   }
  }
  else {
   manipulatedText += text[i];
  }
 }
 return manipulatedText;
}
 
function toAlternating2(text) {
 let manipulatedText = "";
 let toUp = false;
 for (let i = 0; i < text.length; i++) {
  if(text[i].toUpperCase() !== text[i].toLowerCase()) {
   if(toUp === true) {
    manipulatedText += text[i].toUpperCase();
    toUp = false;
   }
   else {
    manipulatedText += text[i].toLowerCase();
    toUp = true;
   }
  }
  else {
   manipulatedText += text[i];
  }
 }
 return manipulatedText;
}

function toCapitalized(text) {
 let manipulatedText = "";
 let toUp = true;
 for(let i = 0; i < text.length; i++) {
  if(text[i].search(/\s/) === -1) {
   if(toUp === true)  {
    manipulatedText += text[i].toUpperCase();
    toUp = false;
   }
   else {
    manipulatedText += text[i].toLowerCase();
   }
  }
  else {
   manipulatedText += text[i];
   toUp = true;      
  }
 }
 return manipulatedText;
}

function toBase64(text) {
 return btoa(unescape(encodeURIComponent(text)));
}

function fileToBase64() {
 let file = document.getElementById("file").files[0];
 let reader = new FileReader();
 reader.readAsDataURL(file);
 reader.onload = function () {
		              let base64String = this.result.substring(this.result.search(",") + 1);
                              let blob = new Blob([base64String], {type:'text/plain'});
                              let a = document.createElement("a");
                              a.download = "JSTM_fileToBase64.txt";
                              a.href = window.URL.createObjectURL(blob);
                              a.click();							
                             };
}

function fromBase64(text) {
 return decodeURIComponent(escape(atob(text)));
}

function base64ToFile() {
 let file = document.getElementById("file").files[0];
 let reader = new FileReader();
 reader.readAsText(file);
 reader.onload = function () {
			      let rawText = window.atob(this.result);
			      let bytes = [];
                              Array.from(rawText).forEach( function (entry) { bytes.push(entry.codePointAt()); } );
			      let blob = new Blob([new Uint8Array(bytes)], {type:'octet/stream'});
                              let a = document.createElement("a");
                              a.download = "JSTM_base64ToFile.txt";
                              a.href = window.URL.createObjectURL(blob);
                              a.click();					
                             };
}

function toOneLine(text) {
 return text.replace(/\n+/g," ").trim();
}

function removeSpaces(text) {
 return text.replace(/[\t ]/g,"");
}

function removeRedundantSpaces(text) {
 return text.trim().replace(/[\t ]+/g," ").replace(/[\t ]+\n/g,"\n");
}

function toList(text) {
 return text.trim().replace(/\s/g,"\n").replace(/\n+/g,"\n"); 
}

function removeDuplicatedLines(text) {
 return Array.from(new Set(text.split("\n"))).join("\n");
}

function removeBlankLines(text) {
 return text.split("\n").filter(function (text){ return text.search(/[^\s]/g) !== -1; }).join("\n");
}

function reverseList(text) {
 return text.split("\n").reverse().join("\n");
}

function sortNaturally(text) {
 let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
 return text.split("\n").sort(collator.compare).join("\n");
}

function beautifyJSON(text) {
 try {
  return JSON.stringify(JSON.parse(text),null,1);
 }
 catch(error) {
  return "Invalid JSON string";
 }
}

function uglifyJSON(text) {
 try {
  return JSON.stringify(JSON.parse(text),null,0);
 }
 catch(error) {
  return "Invalid JSON string";
 }
}

function XMLtoJSON(text) {
  return JSON.stringify(new XMLParser({ }).parse(text), null, 0);
}

function searchText(text, startI, finalI, regExp) {
 text = getSubstring(text, startI, finalI);
 let match = null;
 let manipulatedText = "";
 let check = -1;
 let n = 0;
 while((match = regExp.exec(text)) !== null) {
  if(check === match.index) {
   manipulatedText += "\nSearching interrupted because of infinite matchings\n";
   break;
  }
  n++;
  let pos = match.index;
  manipulatedText += n + " | " + match[0] + " | " + (startI + pos) + " -> " + (startI + pos + Array.from(match[0]).length - 1) + "\n";
  check = match.index;
 }
 manipulatedText = manipulatedText.slice(0,-1);
 if(manipulatedText === "") {
  manipulatedText = "No results found";
 }
 return manipulatedText;
}

function manipulateText() {
 let methods = JSON.parse(document.getElementById("methods").value).methods;
 let manipulatedText = document.getElementById("original").value;
 for(let entry of methods) {
  let size = v.graphemes(manipulatedText).length;
  let regex = clearFromJSON(JSON.stringify(entry.regularExpression));
  let replacement = clearFromJSON(JSON.stringify(entry.replacement));
  let global = entry.global;
  let caseIns = entry.caseInsensitive;
  let regExp = getRegex(regex, global, caseIns);
  let startI = entry.startingIndex === null || entry.startingIndex < 0 || entry.startingIndex > (size - 1) ? 0 : entry.startingIndex;
  let finalI = entry.finalIndex === null || entry.finalIndex < startI || entry.finalIndex > (size - 1) ? (size - 1) : entry.finalIndex;
  let method = JSON.stringify(entry.method);
  if(method.includes("Replace")) {
   manipulatedText = replaceWithReplacement(manipulatedText, startI, finalI, regExp, replacement);
  }
  if(method.includes("sentence")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toSentence);
  }
  if(method.includes("upper")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.upperCase);
  }
  if(method.includes("lower")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.lowerCase);
  }
  if(method.includes("inverse")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.swapCase);
  }
  if(method.includes("case 1")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toAlternating1);
  }
  if(method.includes("case 2")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toAlternating2);
  }
  if(method.includes("capitalized")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toCapitalized);
  }
  if(method.includes("camel")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.camelCase);
  }
  if(method.includes("snake")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.snakeCase);
  }
  if(method.includes("slug")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.slugify);
  }
  if(method.includes("Latinise")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.latinise);
  }
  if(method.includes("Reverse text")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, v.reverseGrapheme);
  }
  if(method.includes("to Base64")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toBase64);
  }
  if(method.includes("from Base64")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, fromBase64);
  }
  if(method.includes("one")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toOneLine);
  }
  if(method.includes("redundant")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, removeRedundantSpaces);
  }
  if(method.includes("Remove spaces")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, removeSpaces);
  }
  if(method.includes("duplicated")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, removeDuplicatedLines);
  }
  if(method.includes("blank")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, removeBlankLines);
  }
  if(method.includes("to list")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toList);
  }
  if(method.includes("Reverse list")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, reverseList);
  }
  if(method.includes("naturally")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, sortNaturally);
  }
  if(method.includes("Extract")) {
   manipulatedText = extract(manipulatedText, startI, finalI, regExp);
  }
  if(method.includes("Evaluate")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, math.evaluate);
  }
  if(method.includes("Simplify")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, math.simplify);
  }
  if(method.includes("Beautify")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, beautifyJSON);
  }
  if(method.includes("Uglify")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, uglifyJSON);
  }
  if(method.includes("XML to JSON")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, XMLtoJSON);
  }
  if(method.includes("8")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toUTF8Bytes);
  }
  if(method.includes("16")) {
   manipulatedText = replaceWithMethod(manipulatedText, startI, finalI, regExp, toUTF16BEBytes);
  }
  if(method.includes("Search")) {
   manipulatedText = searchText(manipulatedText, startI, finalI, regExp);
  }
 }
 document.getElementById("manipulated").value = manipulatedText;
 if(document.getElementById("copyManipulated").checked) { 
   copyText("manipulated"); 
 }
}
