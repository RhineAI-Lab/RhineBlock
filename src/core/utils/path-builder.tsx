export default class PathBuilder {
  path: Array<any> = new Array<string>();

  moveTo(x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.add('m', absolute, x, y)
  }

  lineTo(x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.add('l', absolute, x, y)
  }

  horizontalTo(x: number, absolute: boolean = false): PathBuilder {
    return this.add('h', absolute, x)
  }

  verticalTo(y: number, absolute: boolean = false): PathBuilder {
    return this.add('v', absolute, y)
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.add('c', absolute, x1, y1, x2, y2, x, y)
  }

  smoothCurveTo(x2: number, y2: number, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.add('s', absolute, x2, y2, x, y)
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.add('q', absolute, x1, y1, x, y)
  }

  smoothQuadraticCurveTo(x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.add('t', absolute, x, y)
  }

  arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.add('a', absolute, rx, ry, xAxisRotation, largeArcFlag ? 1 : 0, sweepFlag ? 1 : 0, x, y)
  }

  add(opt: 'm'|'l'|'h'|'v'|'c'|'s'|'q'|'t'|'a'|'z', absolute: boolean = false, ...args: any[]): PathBuilder {
    const optChar = absolute ? opt.toUpperCase() : opt
    this.path.push([optChar, ...args].join(' '))
    return this
  }

  close(): PathBuilder {
    this.add('z')
    return this
  }

  build(): string {
    return this.path.join(' ')
  }
}
