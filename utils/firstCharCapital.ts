export default function firstCharCapical(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
