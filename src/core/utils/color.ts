
export function adjustColorBright(color: string, range: number) {
  let newColor = '#';
  for (let i = 0; i < 3; i++) {
    const hxStr = color.substr(i * 2 + 1, 2);
    let val = parseInt(hxStr, 16);
    val += range;
    if (val < 0) val = 0;
    else if (val > 255) val = 255;
    newColor += val.toString(16).padStart(2, '0')
  }
  return newColor;
}
