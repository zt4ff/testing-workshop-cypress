/// <reference types="cypress" />
// application should be running at port 3000
// and the "localhost:3000" is set as "baseUrl" in "cypress.json"

beforeEach(() => {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(() => {
  cy.visit('/')
})

let called = false

beforeEach(function stubRandomIdGenerator() {
  let count = 1
  cy.window()
    .its('Math')
    .then(Math => {
      cy.stub(Math, 'random', () => {
        called = true
        return `0${count++}`
      }).as('random')
    })
})
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

it('adds items to store', () => {
  cy.task('resetData')
  addItem('something')
  addItem('something else')
  // get application's window
  cy.window()
    .its('app.$store.state.todos')
    // then get app, $store, state, todos
    // it should have 2 items
    .should('have.length', 2)
})

it('creates an item with id 1', () => {
  cy.server()
  cy.route('POST', '/todos').as('new-item')

  // TODO change Math.random to be deterministic

  addItem('something')
  // confirm the item sent to the server has the right values
  cy.wait('@new-item')
    .its('request.body')
    .should('deep.equal', {
      title: 'something',
      completed: false,
      id: ''
    })
})

// stub function Math.random using cy.stub
it('creates an item with id using a stub', () => {
  // get the application's "window.Math" object using cy.window
  // replace Math.random with cy.stub and store the stub under an alias
  // create a todo using addItem("foo");
  addItem('foo')
  assert(called)
  // and then confirm that the stub was called once
})

