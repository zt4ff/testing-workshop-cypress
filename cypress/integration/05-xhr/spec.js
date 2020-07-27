/// <reference types="cypress" />
// note, we are not resetting the server before each test
// and we want to confirm that IF the application has items already
// (for example add them manually using the browser localhost:3000)
// then these tests fail!

/* eslint-disable no-unused-vars */

it('starts with zero items (waits)', () => {
  cy.task('resetData')
  cy.visit('/')
  // wait 1 second
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000)
  // then check the number of items
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items', () => {
  // start Cypress network proxy with cy.server()
  cy.server()
  // spy on route `GET /todos`
  cy.route('GET', 'todos').as('visitPage')
  //  with cy.route(...).as(<alias name>)
  // THEN visit the page
  cy.visit('/')
  // wait for `GET /todos` route
  cy.wait('@visitPage')
  //  using "@<alias name>" string
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items (stubbed response)', () => {
  // start Cypress network server
  cy.server()
  // stub `GET /todos` with []
  cy.route('GET', '/todos', []).as('visitPage')
  // save the stub as an alias

  // THEN visit the page
  cy.visit('/')

  // wait for the route alias
  cy.wait('@visitPage')
    // grab its response body
    .its('response.body')
    .should('have.length', 0)
  // and make sure the body is an empty list
})

it('starts with zero items (fixture)', () => {
  // start Cypress network server
  cy.server()
  cy.route('GET', '/todos', 'fixture:empty-list.json').as('visitPage')
  // stub `GET /todos` with fixture "empty-list"

  // visit the page
  cy.visit('/')

  cy.wait('@visitPage')

  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('loads several items from a fixture', () => {
  //reseting data state with cy.writeFile
  cy.task('resetData')
  // start Cypress network server
  cy.server()
  // stub route `GET /todos` with data from a fixture file "two-items.json"
  cy.route('GET', '/todos', 'fixture:two-items.json').as('visitPage')
  // THEN visit the page
  cy.visit('/')
  // then check the DOM: some items should be marked completed
  cy.wait('@visitPage')
  // we can do this in a variety of ways
  cy.get('li.todo').should('have.length', 2)
  cy.get('li.todo.completed').should('have.length', 1)
})

it('posts new item to the server', () => {
  // start Cypress network server
  cy.server()
  // spy on "POST /todos", save as alias
  cy.route('POST', '/todos').as('postItem')
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')

  // wait on XHR call using the alias, grab its request or response body
  cy.wait('@postItem')
    .its('response.body')
    .should('have.contain', {
      title: 'test api',
      completed: false
    })
  // and make sure it contains
  // {title: 'test api', completed: false}
  // hint: use cy.wait(...).its(...).should('have.contain', ...)
})

it('handles 404 when loading todos', () => {
  // when the app tries to load items
  // set it up to fail with 404 to GET /todos
  // after delay of 2 seconds
  cy.server()
  cy.route({
    url: '/todos',
    response: 'This is an error',
    status: 404,
    delay: 2000 //ms
  })
  cy.visit('/', {
    // spy on console.error because we expect app would
    // print the error message there
    onBeforeLoad: win => {
      cy.spy(win.console, 'error').as('console-error')
    }
  })
  // observe external effect from the app - console.error(...)
  cy.get('@console-error').should(
    'have.been.calledWithExactly',
    'This is an error'
  )
})

it('shows loading element', () => {
  // delay XHR to "/todos" by a few seconds
  cy.server()
  // and respond with an empty list
  cy.route({
    url: '/todos',
    delay: 2000,
    response: []
  }).as('visitPage1')
  // shows Loading element
  cy.visit('/')
  cy.get('.loading').should('be.visible')
  // wait for the network call to complete
  cy.wait('@visitPage1')
  // now the Loading element should go away
  cy.get('.loading').should('not.be.visible')
})

it('handles todos with blank title', () => {
  // return a list of todos with one todo object
  cy.server()
  cy.route('/todos', [
    {
      id: '123',
      title: '  ',
      completed: false
    }
  ])

  cy.visit('/')
  cy.get('li.todo')
    .should('have.length', 1)
    .first()
    .should('not.have.class', 'completed')
    .find('label')
    .should('have.text', '  ')
  // having blank spaces or null
  // confirm the todo item is shown correctly
})
