export default function showOnlySomeLetters(text, sizeToShow) {
  return text.substring(0, sizeToShow).concat('...');
}
