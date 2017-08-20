export default function flat (target, opts = {}) {
  const delimiter = opts.delimiter || '.'
  const maxDepth = opts.maxDepth

  const transformKey = opts.transformKey
    ? opts.transformKey
    : (prefix, key, delimiter) => `${prefix}${delimiter}${key}`

  const shouldTraverse = opts.shouldTraverse
    ? opts.shouldTraverse
    : (value, depth) => {
      const type = Object.prototype.toString.call(value)
      return (type === '[object Object]' || type === '[object Array]') &&
        (maxDepth ? depth < maxDepth : true)
    }

  function step (target, output = {}, prefix = '', depth = 1) {
    return Object.keys(target).reduce((accumulate, key) => {
      const val = target[key]
      const newKey = prefix ? transformKey(prefix, key, delimiter) : key

      if (shouldTraverse(val, depth)) {
        return step(val, accumulate, newKey, depth + 1)
      }

      return Object.assign({}, accumulate, {[newKey]: val})
    }, output)
  }

  return step(target)
}
