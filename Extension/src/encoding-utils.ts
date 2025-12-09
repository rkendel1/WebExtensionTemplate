// Zero-width characters used for encoding
const ZERO_WIDTH_SPACE = '\u200b'; // ZWSP
const ZERO_WIDTH_NON_JOINER = '\u200c'; // ZWNJ
const ZERO_WIDTH_JOINER = '\u200d'; // ZWJ

// Map binary digits to zero-width characters
const BINARY_MAP = {
  '00': ZERO_WIDTH_SPACE,
  '01': ZERO_WIDTH_NON_JOINER,
  '11': ZERO_WIDTH_JOINER,
};

// Reverse map for decoding
const REVERSE_BINARY_MAP = {
  [ZERO_WIDTH_SPACE]: '00',
  [ZERO_WIDTH_NON_JOINER]: '01',
  [ZERO_WIDTH_JOINER]: '11',
};

// Regex to detect any of the zero-width characters used for encoding
const ZERO_WIDTH_REGEX = new RegExp(
  `[${ZERO_WIDTH_SPACE}${ZERO_WIDTH_NON_JOINER}${ZERO_WIDTH_JOINER}]`,
  'g'
);

/**
 * Converts a string to its binary representation (8 bits per character).
 * @param text The input string.
 * @returns The binary string.
 */
function textToBinary(text: string): string {
  return Array.from(text)
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

/**
 * Converts a binary string back to text.
 * @param binary The binary string.
 * @returns The decoded text.
 */
function binaryToText(binary: string): string {
  // Ensure binary string length is a multiple of 8
  if (binary.length % 8 !== 0) {
    console.error('Binary string length is not a multiple of 8.');
    return '';
  }

  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    text += String.fromCharCode(parseInt(byte, 2));
  }
  return text;
}

/**
 * Encodes a secret message into a carrier string using zero-width characters.
 * @param carrier The visible message.
 * @param secret The hidden message.
 * @returns The encoded message.
 */
export function encodeSecret(carrier: string, secret: string): string {
  if (!secret) return carrier;

  const binarySecret = textToBinary(secret);
  let encodedBinary = '';

  // Convert binary (base 2) to base 3 representation using ZW characters (00, 01, 11)
  for (let i = 0; i < binarySecret.length; i += 2) {
    const pair = binarySecret.substring(i, i + 2);
    if (pair.length === 2) {
      encodedBinary += BINARY_MAP[pair as keyof typeof BINARY_MAP];
    } else if (pair.length === 1) {
      // This case should ideally not happen if textToBinary is correct.
      console.error('Unexpected binary length during encoding.');
    }
  }

  // Insert the encoded binary into the carrier string.
  // We'll insert it at the end for simplicity.
  return carrier + encodedBinary;
}

/**
 * Decodes a secret message hidden within a string.
 * @param encodedMessage The message containing hidden zero-width characters.
 * @returns The decoded secret message.
 */
export function decodeSecret(encodedMessage: string): string {
  let binaryString = '';
  let zeroWidthChars = '';

  // 1. Extract all zero-width characters
  for (const char of encodedMessage) {
    if (Object.keys(REVERSE_BINARY_MAP).includes(char)) {
      zeroWidthChars += char;
    }
  }

  // 2. Convert zero-width characters back to binary string
  for (let i = 0; i < zeroWidthChars.length; i++) {
    const char = zeroWidthChars[i];
    binaryString += REVERSE_BINARY_MAP[char as keyof typeof REVERSE_BINARY_MAP];
  }

  // 3. Convert binary string back to text
  return binaryToText(binaryString);
}

/**
 * Removes the hidden secret from an encoded message.
 * @param encodedMessage The message containing hidden zero-width characters.
 * @returns The carrier message without the secret.
 */
export function removeSecret(encodedMessage: string): string {
    let cleanedMessage = '';
    for (const char of encodedMessage) {
        if (!Object.keys(REVERSE_BINARY_MAP).includes(char)) {
            cleanedMessage += char;
        }
    }
    return cleanedMessage;
}

/**
 * Checks if a string contains any zero-width characters used for encoding.
 * @param text The input string.
 * @returns True if hidden content is present, false otherwise.
 */
export function containsSecret(text: string): boolean {
  return ZERO_WIDTH_REGEX.test(text);
}