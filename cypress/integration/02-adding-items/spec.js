/// <reference types="cypress" />

//create an helper function to to add the todo
//function should get parameters that can be an array or a single num

function addTodo(todos) {
  // if todo is an array
  if (Array.isArray(todos)) {
    todos.forEach(list => {
      cy.get('.new-todo')
        .click()
        .type(list + '{enter}')
    })
  } else {
    cy.get('.new-todo')
      .click()
      .type(todos + '{enter}')
  }
}

//create an helper function to generate random test to be added to the list
function genRandomList() {
  // create an array of possible random lists
  const arr = [
    'sleep',
    'run',
    'skip',
    'mocha',
    'tobaca',
    'tikitaka',
    'takuma',
    'ribado',
    'joint',
    'kiss',
    'pray',
    'fast',
    'then do nothing',
    'do something',
    'do many thing',
    'do few things',
    'go to church',
    'go to much'
  ]

  return arr[Math.floor(Math.random() * arr.length)]
}

beforeEach(() => {
  cy.visit('http://localhost:3000')
})
it('loads', () => {
  // application should be running at port 3000
  cy.contains('h1', 'todos')
})

// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// remember to manually delete all items before running the test
// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

it('adds two items', () => {
  // repeat twice ---> how do I repeat twice
  //    get the input field
  //    type text and "enter"
  //    assert that the new Todo item
  //    has been added added to the list
  // cy.get(...).should('have.length', 2)
  ;['read books', 'play football'].forEach(tasks => {
    cy.get('.new-todo')
      .click()
      .type(tasks + '{enter}')

    cy.get('.todo').should('contain', tasks)
  })

  cy.get('.todo-list > li').should('have.length', 2)
})

it('can mark an item as completed', () => {
  // adds a few items
  cy.get('.todo-list > li')
    // marks the first item as completed
    .eq(0)
    .find('.toggle')
    .click()
    .parents('li')
    .should('have.class', 'completed')
  // confirms the first item has the expected completed class
  // confirms the other items are still incomplete
  cy.get('.todo-list > li')
    .not('.completed')
    .should('not.have.class', 'completed')
})

it('can delete an item', () => {
  // adds a few items
  addTodo(['skip school', 'roast babe'])
  // deletes the first item
  // use force: true because we don't want to hover -- why use force, the reason is because the cancel
  //button though visible to the eye is hidden, something is covering it to change it's color
  cy.get('.todo-list > li')
    .eq(0)
    .trigger('mouseover')
    .find('.destroy')
    .click({ force: true })
  // confirm the deleted item is gone from the dom
  cy.get('.todo-list').should('not.contain.text', 'read books')
  // confirm the other item still exists
  cy.get('.todo-list > li').should('exist')
})

it.skip('can add many items', () => {
  const N = 5
  for (let k = 0; k < N; k += 1) {
    // add an item
    // probably want to have a reusable function to add an item!
  }
  // check number of items
})

it('adds item with random text', () => {
  // use a helper function with Math.random()
  cy.get('.new-todo')
    .click()
    .type(genRandomList() + '{enter}')
  // add such item
  // and make sure it is visible and does not have class "completed"
  cy.get('.todo-list > li')
    .last()
    .should('be.visible')
    .and('not.have.class', 'completed')
})

it.skip('starts with zero items', () => {
  // check if the list is empty initially
  //   find the selector for the individual TODO items
  //   in the list
  //   use cy.get(...) and it should have length of 0
  //   https://on.cypress.io/get
})

it.skip('does not allow adding blank todos', () => {
  // https://on.cypress.io/catalog-of-events#App-Events
  cy.on('uncaught:exception', () => {
    // check e.message to match expected error text
    // return false if you want to ignore the error
  })

  // try adding an item with just spaces
})

// what a challenge?
// test more UI at http://todomvc.com/examples/vue/
