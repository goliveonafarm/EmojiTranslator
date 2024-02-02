const findEmoji = (emojiCharacter, fullEmojiList) => {
    return fullEmojiList.find(item => item.character === emojiCharacter) || null;
};

const convertEmojiIntoCodeByteString = (emoji) => {
    return Array.from(emoji).map(part => `\\u${part.codePointAt(0).toString(16)}`).join('');
};

//Converts the user input into chars and replaces emojis with their slug value (descriptions)
const decodeInput = (userInput, allEmojisIncludingNonSupported) => {
    if (!userInput) return '';
    let convertedInput = splitStringIntoEmojisAndChars(userInput);
    return convertCharsToEmojiDescriptions (convertedInput, allEmojisIncludingNonSupported);
};

const splitStringIntoEmojisAndChars = (convertString) => {
    return Array.from(convertString).map(char => 
        char.codePointAt(0) < 1000 ? char : convertEmojiIntoCodeByteString(char)
      );
};

//Pushes chars directly into the array but pushes codepoints into its own array
//to be processed for emoji combinations
const convertCharsToEmojiDescriptions = (charArray, allEmojisIncludingNonSupported) => {
    let modifiedCharArray = [];
    let unmatchedEmojiCodeBytes = [];
    let prevCharWasEmoji = false;

    for (let i = 0; i < charArray.length; i++) {
        const currentChar = charArray[i];

        // Skip processing if the current character is a space and no unmatched emojis are found
        if (currentChar === ' ' && !prevCharWasEmoji) {
            modifiedCharArray.push(' ');
            continue;
        };

        // If the current character is an emoji code byte
        if (currentChar.length > 1) {
            unmatchedEmojiCodeBytes.push(currentChar);
            prevCharWasEmoji = true;
            continue;
        };

        // If the current character is a normal char and there are unmatched emojis
        if (prevCharWasEmoji) {
            modifiedCharArray.push(decipherMeanings(unmatchedEmojiCodeBytes, allEmojisIncludingNonSupported));
            unmatchedEmojiCodeBytes = [];
            prevCharWasEmoji = false;
        };
        modifiedCharArray.push(currentChar);
    };

    // Process any remaining unmatched emojis after the loop
    if (unmatchedEmojiCodeBytes.length > 0) {
        modifiedCharArray.push(decipherMeanings(unmatchedEmojiCodeBytes, allEmojisIncludingNonSupported));
    };

    return modifiedCharArray.join('');
};

//Queries compositeList in emojiObject. Returns slug if a match is found or compositeList if not*
const decipherMeanings = (compositeList, allEmojisIncludingNonSupported) => {

    //Sends the array of emoji composite values and the list of every emoji to emojisDescriptionString
    const emojisDescriptionString = convertCompositeListToDescriptions(compositeList, allEmojisIncludingNonSupported) || null;
    if (emojisDescriptionString) { return emojisDescriptionString };
    return compositeList;
};

const addEmojiAndVariantsToList = (emoji, emojiArray) => {
    if (!emojiArray.some(e => e.character === emoji.character)) { emojiArray.push(emoji) };
    if (emoji.variants) {
        emoji.variants.forEach(variant => {
            addEmojiAndVariantsToList(variant, emojiArray);
        });
    };
};

//Iterates through an array of unconverted codebytes searching for
//largest possible composite values first and replaces them with their
//slug value
function findEmojiJsonDescriptions(codeSeries, searchedArray, emojiList, output = "") {
    const codeSeriesString = codeSeries.join('');
    const match = emojiList.find(emoji => convertEmojiIntoCodeByteString(emoji.character) === codeSeriesString);
    if (match) {
        output += `${emojiSlugValue(match)}`;
        if (searchedArray.length === 0) {
            return output;
        } else {
            return findEmojiJsonDescriptions(searchedArray, [], emojiList, output);
        }
    }

    if (codeSeries.length > 0) {
        const removedElement = codeSeries.pop();
        searchedArray.unshift(removedElement);
        return findEmojiJsonDescriptions(codeSeries, searchedArray, emojiList, output);
    }

    return output; //Returns output if no more emojis to process
}

//Outer function needed for recursive function to watch the array as changes are made.
//As matches are found the original array has those values removed and adds all 
//conversions to output until the compositeList is empty.
const convertCompositeListToDescriptions = (compositeList, emojiList) => {
    let output = ``;
    let compositeListCopy = [...compositeList];

    while (compositeListCopy.length > 0) {
        let currentChunk = compositeListCopy.splice(0, 20);
        output = findEmojiJsonDescriptions(currentChunk, [], emojiList, output);
    }
    return output;
}

//Returns a formatted string based on emoji input
const emojiSlugValue = (emoji) => {
    let tempArrayString = (emoji.slug).split("-");
    tempArrayString.shift();
    if (!isNaN(tempArrayString[0])) { tempArrayString.shift() };
    let newString = tempArrayString.join(" ");
    newString = `{` + newString + `} `;
    return newString;

}

export { decodeInput, addEmojiAndVariantsToList, emojiSlugValue, findEmoji, convertEmojiIntoCodeByteString };