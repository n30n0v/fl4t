# fl4t

Take a nested Javascript object and flat it.

## Installation

``` bash
$ npm install fl4t
```

## Methods

### `flat: (target: Object, options: Object) => Object`


Flat the object - it'll return an object one level deep, regardless of how
nested the original object was:

```javascript
import flat from 'fl4t'

flat({
  lorem: {
    ipsum: 'dolor'
  },
  sit: {
    amet: 'consectetur'
  },
  adipiscing: { elit: { sed: { do: [ 1, 2, 3, { eiusmod: 'tempor' } ] } } }
})

//  {
//    'lorem.ipsum': 'dolor',
//    'sit.amet': 'consectetur',
//    'adipiscing.elit.sed.do.0': 1,
//    'adipiscing.elit.sed.do.1': 2,
//    'adipiscing.elit.sed.do.2': 3,
//    'adipiscing.elit.sed.do.3.tempor': 'tempor'
//  }
```

## Options

### `delimiter: string`

Use a custom delimiter for flating your objects, instead of `.`.

### `maxDepth: number`

Maximum number of nested objects to flat.

```javascript
import flat from 'fl4t'

flat({
  lorem: {
    ipsum: 'dolor'
  },
  sit: {
    amet: 'consectetur'
  },
  adipiscing: { elit: { sed: { do: { eiusmod: 'tempor' } } } }
}, { maxDepth: 2 })

//  {
//    'lorem.ipsum': 'dolor',
//    'sit.amet': 'consectetur',
//    'adipiscing.elit': {
//      sed: {
//        do: {
//          eiusmod: 'tempor'
//        }
//      }
//    }
//  }
```

### `transformKey: (prefix: string, key: string) => string`

In additional to use a custom delimiter you may use `transformKey` function for more flexibility.
By default `transformKey` function defined like:

```javascript
const transformKey = (prevKey, key, delimiter = '.') => `${prevKey}${delimiter}${key}`
```

For some cases you maybe want to get flat object like `{'hello[world][great][again]': 'hi there'}`. `transformKey` function will look like: 

```javascript
import flat from 'fl4t'

flat({
  hello: {
    world: {
      great: {
        again: 'hi there'
      }
    }
  }
}, {
  transformKey: (prevKey, key) => `${prefix}[${key}]`
})

//  {
//    'hello[world][great][again]': 'hi there'
//  }
```

### `shouldTraverse: (value: any, depth: ?number) => boolean `

`shouldTraverse` function control which value will be flat. Function takes value and current depth. If it returns `true` then next step of recursion will call.

By default `shouldTraverse` defined as:

```javascript
const shouldTraverse = (value, depth) => {
  const type = Object.prototype.toString.call(value)
  return (type === '[object Object]' || type === '[object Array]') && (opts.depth ? opts.depth > depth : true)
}
```

If you want preserve arrays you should use the following function:

```javascript
const shouldTraverse = (value) => {
  const type = Object.prototype.toString.call(value)
  return type === '[object Object]'
}
```

If you want preserve instance of specific class you may use something like this:

```javascript
import flat from 'fl4t'

function Cat (name) {
  this.name = name
}

const maru = new Cat('maru')

flat({
  hello: {
    world: {
      great: {
        again: 'hi there'
      }
    },
    cat: maru
  }
}, {
  shouldTraverse: (value) =>
    Object.prototype.toString.call(value) === '[object Object]' &&
    !(value instanceof Cat)
})

// {
//   'hello.world.great.again': 'hi there',
//   'hello.cat': {
//     name: 'maru'
//   }
// }

```
