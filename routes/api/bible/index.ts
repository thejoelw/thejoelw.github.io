const books = [
  {name: 'Genesis', numChapters: 50},
  {name: 'Exodus', numChapters: 40},
  {name: 'Leviticus', numChapters: 27},
  {name: 'Numbers', numChapters: 36},
  {name: 'Deuteronomy', numChapters: 34},
  {name: 'Joshua', numChapters: 24},
  {name: 'Judges', numChapters: 21},
  {name: 'Ruth', numChapters: 4},
  {name: '1 Samuel', numChapters: 31},
  {name: '2 Samuel', numChapters: 24},
  {name: '1 Kings', numChapters: 22},
  {name: '2 Kings', numChapters: 25},
  {name: '1 Chronicles', numChapters: 29},
  {name: '2 Chronicles', numChapters: 36},
  {name: 'Ezra', numChapters: 10},
  {name: 'Nehemiah', numChapters: 13},
  {name: 'Esther', numChapters: 10},
  {name: 'Job', numChapters: 42},
  {name: 'Psalms', numChapters: 150},
  {name: 'Proverbs', numChapters: 31},
  {name: 'Ecclesiastes', numChapters: 12},
  {name: 'Song of Solomon', numChapters: 8},
  {name: 'Isaiah', numChapters: 66},
  {name: 'Jeremiah', numChapters: 52},
  {name: 'Lamentations', numChapters: 5},
  {name: 'Ezekiel', numChapters: 48},
  {name: 'Daniel', numChapters: 12},
  {name: 'Hosea', numChapters: 14},
  {name: 'Joel', numChapters: 3},
  {name: 'Amos', numChapters: 9},
  {name: 'Obadiah', numChapters: 1},
  {name: 'Jonah', numChapters: 4},
  {name: 'Micah', numChapters: 7},
  {name: 'Nahum', numChapters: 3},
  {name: 'Habakkuk', numChapters: 3},
  {name: 'Zephaniah', numChapters: 3},
  {name: 'Haggai', numChapters: 2},
  {name: 'Zechariah', numChapters: 14},
  {name: 'Malachi', numChapters: 4},
  {name: 'Matthew', numChapters: 28},
  {name: 'Mark', numChapters: 16},
  {name: 'Luke', numChapters: 24},
  {name: 'John', numChapters: 21},
  {name: 'Acts', numChapters: 28},
  {name: 'Romans', numChapters: 16},
  {name: '1 Corinthians', numChapters: 16},
  {name: '2 Corinthians', numChapters: 13},
  {name: 'Galatians', numChapters: 6},
  {name: 'Ephesians', numChapters: 6},
  {name: 'Philippians', numChapters: 4},
  {name: 'Colossians', numChapters: 4},
  {name: '1 Thessalonians', numChapters: 5},
  {name: '2 Thessalonians', numChapters: 3},
  {name: '1 Timothy', numChapters: 6},
  {name: '2 Timothy', numChapters: 4},
  {name: 'Titus', numChapters: 3},
  {name: 'Philemon', numChapters: 1},
  {name: 'Hebrews', numChapters: 13},
  {name: 'James', numChapters: 5},
  {name: '1 Peter', numChapters: 5},
  {name: '2 Peter', numChapters: 3},
  {name: '1 John', numChapters: 5},
  {name: '2 John', numChapters: 1},
  {name: '3 John', numChapters: 1},
  {name: 'Jude', numChapters: 1},
  {name: 'Revelation', numChapters: 22},
];

const NUM_BOOKS = books.reduce((acc, cur) => acc + cur.numChapters, 0);
if (NUM_BOOKS !== 1189) {
  throw new Error(`Incorrect number of books!`);
}

export const handler: Handlers<User | null> = {
  async GET(_req, ctx) {
    let idx = Math.floor(Math.random() * NUM_BOOKS);
    for (const book of books) {
      if (idx < book.numChapters) {
        const chapter = `${book.name} ${idx + 1}`;
        return new Response(`Redirecting to ${chapter}`, {
          status: 307,
          headers: {
            Location: `https://www.esv.org/${encodeURIComponent(chapter)}/`,
          },
        });
      } else {
        idx -= book.numChapters;
      }
    }
    throw new Error(`We shouldn't be here`);
  },
};
