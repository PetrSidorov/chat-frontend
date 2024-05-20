foo="hi"

function bar() {
  echo $foo
}

bar

function baz() {
  foo="hey"
  bar
}

baz
