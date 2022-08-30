const typeEasyMap = {
  // 建议使用类型
  'any': '',
  'str': 'String',
  'num': 'Number',
  'bool': 'Boolean',
  'list': 'Array',

  'Any': '',
  'string': 'String',
  'text': 'String',
  'Text': 'String',
  'number': 'Number',
  'boolean': 'Boolean',
  'array': 'Array',
}

export function parseType(type: sourceType = ''): string[] {
  if(!type) return ['']
  if (typeof type === 'string') {
    type = type.split('|')
  }
  return type.map(t => {
    // @ts-ignore
    if (typeEasyMap[t]) return typeEasyMap[t]
    return t
  })
}

export function checkContains(a: string[], b: string[]): boolean {
  if(b.indexOf('Boolean')>-1){
    for (const t of a) {
      if (t === 'Boolean') return true
    }
    return false
  }
  if (a.indexOf('') > -1 || b.indexOf('') > -1) return true
  for (const t of a) {
    if (b.indexOf(t) > -1) return true
  }
  return false
}

export type sourceType = string | string[] | null
