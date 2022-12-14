export function padNumber(num: number, length: number) {
  return num.toString().padStart(length, "0");
}

export function center(text: string, expectedWidth: number, padding = " ") {
  const stringWidth = text.length;
  const startPadSize = Math.floor((expectedWidth - stringWidth) / 2);
  return `${padding.repeat(startPadSize)}${text}${padding.repeat(expectedWidth - stringWidth - startPadSize)}`;
}
