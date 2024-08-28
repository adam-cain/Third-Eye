function convertMathSymbolsToWords(text: string): string {
    // Replace mathematical and logical symbols with words
    const replacements: { [key: string]: string } = {
        'π': 'pi',
        '+': 'plus',
        '-': 'minus',
        '=': 'equals',
        '/': 'divided by',
        '*': 'times',
        '^': 'to the power of',
        '√': 'square root of',
        '≈': 'approximately',
        '<': 'less than',
        '>': 'greater than',
        '≤': 'less than or equal to',
        '≥': 'greater than or equal to',
        '\\(': 'open parenthesis',
        '\\)': 'close parenthesis',
        '\\[': 'open bracket',
        '\\]': 'close bracket',
        '{': 'open curly brace',
        '}': 'close curly brace',
        '%': 'percent',
        '∞': 'infinity',
        '∑': 'summation',
        '∏': 'product',
        '∆': 'delta',
        'θ': 'theta',
        '∫': 'integral of',
        '≠': 'not equal to',
        '∂': 'partial',
        '∈': 'belongs to',
        '∉': 'does not belong to',
        '∪': 'union',
        '∩': 'intersection',
        '&&': 'and',
        '||': 'or',
        '!': 'not',
        '#': 'hash',
        '@': 'at',
        '&': 'ampersand',
        '|': 'pipe',
        '\\\\': 'backslash',
        ':': 'colon',
        ';': 'semicolon',
        '_': 'underscore',
        '~': 'approximately',
        '?': 'question mark',
        '°': 'degree',
        '→': 'arrow right',
        '←': 'arrow left',
        '↔': 'bidirectional arrow',
        '$': 'dollar',
        '€': 'euro',
        '£': 'pound',
        '¥': 'yen',
        '□': 'box',
        '◇': 'diamond',
        '∃': 'there exists',
        '∀': 'for all',
        '⊂': 'subset of',
        '⊃': 'superset of',
        '⊆': 'subset or equal to',
        '⊇': 'superset or equal to',
        '∧': 'and',
        '∨': 'or',
        '¬': 'not',
        '⊕': 'exclusive or',
        '⊻': 'exclusive or',
        '∃!': 'there exists exactly one',
        '∅': 'empty set',
        '⊖': 'symmetric difference',
        '◻': 'box',
        '◯': 'next',
        'U': 'until',
        'R': 'release',
        'W': 'weak until',
        'F': 'finally',
        'G': 'globally',
        '⊢': 'turnstile',
        '⊨': 'models',
        '≡': 'equivalent',
        '⊑': 'is a subconcept of',
        '⊒': 'is a superconcept of'
    };

    // Function to escape special characters for regular expressions
    function escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Replace each symbol with its corresponding word
    for (const [symbol, replacement] of Object.entries(replacements)) {
        const escapedSymbol = escapeRegExp(symbol);
        // Use word boundaries (\b) to avoid multiple spaces
        const regex = new RegExp(`\\b${escapedSymbol}\\b`, 'g');
        // Add spaces around the replacement word
        text = text.replace(regex, ` ${replacement} `);
    }
    
    // After all replacements, trim any extra spaces at the start and end
    text = text.trim();
    
    // Replace multiple spaces with a single space
    text = text.replace(/\s+/g, ' ');
    
    // Handle decimal points in context
    // Using a function to ensure that the 'point' replacement doesn't add extra spaces
    text = text.replace(/(\d)\.(\d)/g, (match, p1, p2) => `${p1} point ${p2}`);

    return text;
}
