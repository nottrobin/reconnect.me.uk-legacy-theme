/* Global variables */
var styleNames = [];

// If less than IE6, remove trailing hyphens
if(jQuery.browser.msie && jQuery.browser.version <= 6) {
    for(var j = 0; j < styleNames.length; j++) {
        styleNames[j] = styleNames[j].replace(/^-/,'');
    }
}

var matchedElements = jQuery();

/* Process an IE rule */
function processRules(rulesCollection) {
    
    // Check we have rules
    if(rulesCollection.rules != null && rulesCollection.rules.length > 0) {
        
        // Do we have any "imports"? (probably Internet Explorer)
        if(rulesCollection.imports != null && rulesCollection.imports.length > 0) {
            // Cycle through imports
            for(var impNo = 0; impNo < rulesCollection.imports.length; impNo++) {
                // If we now have rules
                if(rulesCollection.imports[impNo].rules.length > 0) {
                    // Process the rules
                    processRules(rulesCollection.imports[impNo]);
                }
            }
        }
        
        // Cycle through rules
        for(var i=0; i < rulesCollection.rules.length; i++) {
            var rule = rulesCollection.rules[i];
            
            // Check we have a "style" object
            if(rule.style != null) {
                var style = rule.style;
                
                // Check this style against each search text
                for(var j=0; j < styleNames.length; j++) {
                    // See if style contains an item for this styleName
                    if(style[styleNames[j]]) {
                        // If it contains styles, add this element to the elements
                        var element = jQuery(rule.selectorText.toLowerCase());
                        element.data(styleNames[j],chomp(style[styleNames[j]]));
                        matchedElements = matchedElements.add(element);
                    }
                }
            }
        }
    }
}

/* Remove newlines, carriage returns and extra spaces from strings */
function chomp(raw_text) {
    raw_text = raw_text.replace(/^(\n|\r|\s)+/g, ''); // Remove spaces, newlines, returns from beginning
    raw_text = raw_text.replace(/(\n|\r|\s)+$/g, ''); // Remove spaces, newlines, returns from end
    return raw_text;
}

/* Scan through stylesheets for rules' existence */
function getElementsByCSSProperty(propertiesArray) {
    styleNames = propertiesArray;
    
    var t, i, j;
    
    // Do we have any stylesheets?
    if(document.styleSheets != null && document.styleSheets.length > 0) {
        // Cycle through stylesheets
        for(var sheetNo=0; sheetNo<document.styleSheets.length; sheetNo++) {   
            
            var sheet = document.styleSheets[sheetNo];
            
            if(document.styleSheets[sheetNo].rules != null && sheet.rules.length > 0) {
                // Do we have stylesheets with "rule" objects? (probably Internet Explorer)
                
                // Process the rules
                processRules(sheet);
                
            } else if(sheet.ownerNode != null && (sheet.ownerNode.innerText.length > 0 || sheet.ownerNode.innerHTML.length > 0) ) {
                // Do we have stylesheet text? (Other browsers)
                
                // Search text for our style names
                var styleSheetText = "";
                if(sheet.ownerNode.innerText.length > 0) {styleSheetText += "\n" + sheet.ownerNode.innerText;}
                if(sheet.ownerNode.innerHTML.length > 0) {styleSheetText += "\n" + sheet.ownerNode.innerHTML;}
                
                alert(sheet.ownerNode.innerText);
                alert("" + "\n" + sheet.ownerNode.innerText);
                
                // Go through each style name - see if it matches
                for(var j=0; j < styleNames.length; j++) {
                    // Check if it matches
                    var styleMatch = new RegExp('^([^{^$]+)[\\s$]*{(?:[^}]*\\n)?[\\s]*'+styleNames[j]+'[\\s]*:[\\s]*([^}^;^$]+)[\\s]*;?[\\s]*(?:$[^}]*)?}','m');
                    var results = styleMatch.exec(styleSheetText);
                    
                    // If it matches, add the element to matchedElements
                    if(results) {
                        // If it contains styles, add this element to the elements
                        var element = jQuery(chomp(results[1]).toLowerCase());
                        element.data(styleNames[j],chomp(results[2]));
                        matchedElements = matchedElements.add(element);
                    }
                }
            
            }
            
            //else if
            
            // Do we have stylesheet with 
        }
    }
    
    return matchedElements;
}