const statelessNonNested = `

const Foo = (props) => {
  return (
    <div>
      I'm like hey wsup hello
    </div>
  )
}
`

const statelessNested = `

const Foo = (props) => {
  return (
    <div>
      Trap Queens
    <Bar baz={props.baz} />
    </div>
  )
}
`

module.exports = {
  statelessNonNested,
  statelessNested
}