/// <reference types="cypress" />
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

describe('reset data using XHR call', () => {
  beforeEach(() => {
    // TODO call /reset endpoint with POST method and object {todos: []}
    cy.request('POST', '/reset', {
      todos: []
    })
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using cy.writeFile', () => {
  beforeEach(() => {
    // TODO write file "todomvc/data.json" with stringified todos object
    const resetFile =
      JSON.stringify(
        {
          todos: []
        },
        null,
        2
      ) + '\n'
    cy.writeFile('todomvc/data.json', resetFile, 'utf-8')
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using a task', () => {
  beforeEach(() => {
    //though I added a default argument to the parameter but Cypress won't make it default.
    //It's a bug
    cy.task('resetData')
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('set initial data', () => {
  it('sets data to complex object right away', () => {
    // TODO call task and pass an object with todos
    const defaultData = {
      todos: [
        {
          title: 'Skip school',
          completed: false,
          id: 7
        },
        {
          title: 'Write some test',
          completed: true,
          id: 9
        }
      ]
    }

    cy.task('resetData', defaultData)
    cy.visit('/')
    // check what is rendered
  })

  it('sets data using fixture', () => {
    // TODO load todos from "cypress/fixtures/two-items.json"
    // and then call the task to set todos
    cy.fixture('two-items').then(todo => {
      cy.task('resetData', { todo })
    })

    cy.visit('/')
    // check what is rendered
  })
})
