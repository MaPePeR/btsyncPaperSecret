/*jslint browser:true, plusplus:true, bitwise:true, vars: true*/
/*globals $*/
var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
var base32map = {};
var words = [];
(function init() {
    "use strict";
    var i;
    for (i = base32chars.length - 1; i >= 0; i--) {
        base32map[base32chars[i]] = i;
    }

    var wordBox = document.getElementById("wordbox");
    var wordBoxInner = "";
    for (i = 0; i < 15; i++) {
        wordBoxInner += '<input class="typeahead" type="text" size="10" id="word' + i + '"/>';
    }
    wordBox.innerHTML = wordBoxInner;
}());

$("#wordFile").load(function () {
    "use strict";

    var oFrame = document.getElementById("wordFile");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    strRawContents = strRawContents.replace("\r", "");
    words = strRawContents.split("\n");


    var substringMatcher = function (strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function (i, str) {
                if (substrRegex.test(str)) {
                // the typeahead jQuery plugin expects suggestions to a
                // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });

            cb(matches);
        };
    };
    console.log(words.length);
    $('#wordbox .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 3
    },
        {
            name: 'states',
            displayKey: 'value',
            source: substringMatcher(words)
        });
});
function btsyncSecretTo11BitsArray(s) {
    "use strict";
    //TODO: Unit Tests
    s = s.toUpperCase().replace(" ", "");
    if (s.length !== 33) {
        throw "Need 33 Characters";
    }
    if (s.match(/[^A-Z2-7]/)) {
        throw "Illegal Characters";
    }
    //33 A-Z,2-7 characters.
    //Thats 33x5 Bits
    //We use 2048 = 2^11 Words, so we encode 11 Bits to 1 word
    //So we need 33x5/11 = 3x5 = 15 words.
    var out = new Array(15);
    var dataI = 0, outI = 0, space = 11, left, right;
    for (dataI = 0; dataI < s.length; dataI++) {
        if (space >= 5) {
            //5 bits from dataI still fit into outI
            space -= 5;
            out[outI] = out[outI] | (base32map[s[dataI]] << space);
        } else {
            //Splitting the 5 bits into 2 parts. 
            left = (base32map[s[dataI]] >> (5 - space));
            out[outI] = out[outI] | left;
            outI++;
            right = (base32map[s[dataI]] & (31 >> space));
            space = 11 - (5 - space);
            out[outI] = right << space;
        }
    }
    return out;
}

function bitsToSecret(arr) {
    "use strict";
    if (arr.length !== 15) {
        throw "Need 15 Numbers";
    }

    var secret = "", i, filled = 0, mask = (1 << 10), current = 0, j;
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < 11; j++) {
            //Every Bit from right to left and add them in groups of 5 to current
            current = (current << 1) + ((arr[i] & (mask >> j)) > 0 ? 1 : 0);
            filled++;
            if (filled === 5) {
                filled = 0;
                secret += base32chars[current];
                current = 0;
            }
        }
    }
    return secret;
}

function toPaper() {
    var input = document.getElementById("input");
    //Base32 encoded. First letter = Type of Key
    console.log(input.value);
    console.log(btoa(input.value));
}

function fromPaper() {
    var input = document.getElementById("input");
    //Base32 encoded. First letter = Type of Key
    console.log(input.value);
    console.log(btoa(input.value));
}