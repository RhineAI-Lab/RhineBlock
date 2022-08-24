export default class PathBuilder {
  path: PLine[] = [];

  moveTo(x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.push('m', absolute, x, y)
  }

  lineTo(x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.push('l', absolute, x, y)
  }

  horizontalTo(x: number, absolute: boolean = false): PathBuilder {
    return this.push('h', absolute, x)
  }

  verticalTo(y: number, absolute: boolean = false): PathBuilder {
    return this.push('v', absolute, y)
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.push('c', absolute, x1, y1, x2, y2, x, y)
  }

  smoothCurveTo(x2: number, y2: number, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.push('s', absolute, x2, y2, x, y)
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.push('q', absolute, x1, y1, x, y)
  }

  smoothQuadraticCurveTo(x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.push('t', absolute, x, y)
  }

  arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean, x: number, y: number, absolute: boolean = false): PathBuilder {
    return this.push('a', absolute, rx, ry, xAxisRotation, largeArcFlag ? 1 : 0, sweepFlag ? 1 : 0, x, y)
  }

  close(): PathBuilder {
    this.push('z')
    return this
  }

  push(opt: 'm' | 'l' | 'h' | 'v' | 'c' | 's' | 'q' | 't' | 'a' | 'z', absolute: boolean = false, ...args: PLine): PathBuilder {
    const optChar = absolute ? opt.toUpperCase() : opt
    this.pushPath([[optChar, ...args]])
    return this
  }

  pushPath(path: PLine[]) {
    this.path = this.path.concat(path)
    return this
  }

  reverse(): this {
    const np: PLine[] = []
    for (let i=this.path.length-1;i>=0;i--) {
      const p = this.path[i]
      for (const j in p) {
        if(typeof(p[j]) === 'number'){
          p[j] = -p[j]
        }
      }
      np.push(p)
    }
    this.path = np
    return this
  }

  getPath(reverse: boolean = false): PLine[] {
    if(reverse) this.reverse()
    return this.path
  }

  connect(): (string | number)[] {
    if (this.path.length < 1) return []
    return this.path.reduce((a, b) => a.concat(b))
  }

  build(): string {
    return this.connect().join(' ')
  }
}

export type PLine = (string | number)[]
