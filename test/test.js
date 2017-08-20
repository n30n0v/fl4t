/* globals suite test */
import assert from 'assert'
import flat from '../index'

const primitives = {
  String: 'good morning',
  Number: 1234.99,
  Boolean: true,
  Date: new Date(),
  null: null,
  undefined: undefined
}

suite('Flatten Primitives', () => {
  Object.keys(primitives).forEach(key => {
    const value = primitives[key]

    test(key, () => {
      assert.deepEqual(flat({
        hello: {
          world: value
        }
      }), {
        'hello.world': value
      })
    })
  })
})

suite('Flat', () => {
  test('Nested once', () => {
    assert.deepEqual(flat({
      hello: {
        world: 'good morning'
      }
    }), {
      'hello.world': 'good morning'
    })
  })

  test('Nested twice', () => {
    assert.deepEqual(flat({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }), {
      'hello.world.again': 'good morning'
    })
  })

  test('Multiple Keys', () => {
    assert.deepEqual(flat({
      hello: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      },
      world: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      }
    }), {
      'hello.lorem.ipsum': 'again',
      'hello.lorem.dolor': 'sit',
      'world.lorem.ipsum': 'again',
      'world.lorem.dolor': 'sit'
    })
  })

  test('Custom Delimiter', () => {
    assert.deepEqual(flat({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }, {
      delimiter: ':'
    }), {
      'hello:world:again': 'good morning'
    })
  })

  test('Custom transformKey', () => {
    assert.deepEqual(flat({
      hello: {
        world: {
          great: {
            again: 'good morning'
          }
        }
      }
    }, {
      transformKey: (prefix, key) => `${prefix}[${key}]`
    }), {
      'hello[world][great][again]': 'good morning'
    })
  })

  test('Custom shouldTraverse and transformKey', () => {
    function Cat (name) {
      this.name = name
    }

    const maru = new Cat('maru')

    assert.deepEqual(flat({
      hello: {
        world: {
          great: {
            again: 'good morning'
          }
        },
        cat: maru
      }
    }, {
      transformKey: (prefix, key) => `${prefix}[${key}]`,
      shouldTraverse: (value) =>
        Object.prototype.toString.call(value) === '[object Object]' &&
        !(value instanceof Cat)
    }), {
      'hello[world][great][again]': 'good morning',
      'hello[cat]': maru
    })
  })

  test('Empty Objects', () => {
    assert.deepEqual(flat({
      hello: {
        empty: {
          nested: { }
        }
      }
    }), {})
  })

  test('Custom Depth', () => {
    assert.deepEqual(flat({
      hello: {
        world: {
          again: 'good morning'
        }
      },
      lorem: {
        ipsum: {
          dolor: 'good evening'
        }
      }
    }, {
      maxDepth: 2
    }), {
      'hello.world': {
        again: 'good morning'
      },
      'lorem.ipsum': {
        dolor: 'good evening'
      }
    })
  })
})

suite('Arrays', () => {
  test('Should be able to flat arrays properly', () => {
    assert.deepEqual({
      'a.0': 'foo',
      'a.1': 'bar'
    }, flat({
      a: ['foo', 'bar']
    }))
  })
  test('Complex objected with deep nested array', () => {
    assert.deepEqual(
      flat({
        a: {
          b: {
            c: {
              d: [1, 2, 3, {e: 4}]
            }
          },
          f: {
            g: 5
          }
        },
        h: 7
      }), {
        'a.b.c.d.0': 1,
        'a.b.c.d.1': 2,
        'a.b.c.d.2': 3,
        'a.b.c.d.3.e': 4,
        'a.f.g': 5,
        'h': 7
      })
  })
  test('Complex objected with deep nested array', () => {
    assert.deepEqual(
      flat({
        lorem: {
          ipsum: 'dolor'
        },
        sit: {
          amet: 'consectetur'
        },
        adipiscing: { elit: { sed: { do: [ 1, 2, 3, { eiusmod: 'tempor' } ] } } }
      }), {
        'lorem.ipsum': 'dolor',
        'sit.amet': 'consectetur',
        'adipiscing.elit.sed.do.0': 1,
        'adipiscing.elit.sed.do.1': 2,
        'adipiscing.elit.sed.do.2': 3,
        'adipiscing.elit.sed.do.3.eiusmod': 'tempor'
      })
  })
})
