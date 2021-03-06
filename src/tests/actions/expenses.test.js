import { startRemoveExpense, setExpenses, startAddExpense, addExpense, editExpense, removeExpense, startSetExpenses, startEditExpense } from '../../actions/expenses'
import expenses from '../fixtures/expenses'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import database from '../../firebase/firebase'

const uid = 'thisismytestuid'
const defaultAuthState = { auth: { uid } }
const createMockStore = configureMockStore([thunk])

beforeEach((done) => {
  const expensesData = {}

  expenses.forEach(({ id, description, note, amount, createdAt }) => {
    expensesData[id] = {
      description,
      note,
      amount,
      createdAt
    }
    database.ref(`users/${uid}/expenses`).set(expensesData).then(() => done())
  })

  database.ref(`users/${uid}/expenses`).set(expensesData)
})

test('should setup remove expense action object', () => {
  const action = removeExpense({ id: '123abc' })
  expect(action).toEqual({
    type: 'REMOVE_EXPENSE',
    id: '123abc'
  })
})

test('should remove expense from firebase', (done) => {
  const store = createMockStore(defaultAuthState)
  const id = expenses[2].id

  store.dispatch(startRemoveExpense({ id })).then(() => {
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'REMOVE_EXPENSE',
      id
    })
    return database.ref(`users/${uid}/expenses`).once('value')
  }).then((snapshot) => {
    expect(snapshot.val()).toBeFalsy()
    done()
  })
})

test('should set up edit expense action object', () => {

  const action = editExpense('editExpenseID', { description: 'shopping' })
  expect(action).toEqual({
    type: 'EDIT_EXPENSE',
    id: 'editExpenseID',
    updates: { description: 'shopping' }
  })
})

test('should start edit expense', (done) => {
  const store = createMockStore(defaultAuthState)
  const id = expenses[0].id

  store.dispatch(startEditExpense(id, { description: 'updated' }))
    .then(() => {
      const actions = store.getActions()
      expect(actions[0]).toEqual({
        type: 'EDIT_EXPENSE',
        id,
        updates: { description: 'updated' }
      })
      return database.ref(`users/${uid}/expenses`).once('value')
    }).then((snapshot) => {
      expect(snapshot.val().description).toBe('updated')
      done()
    })
})

test('should set up addExpense object', () => {

  const action = addExpense(expenses[2])
  expect(action).toEqual({
    type: 'ADD_EXPENSE',
    expense: expenses[2]
  })
})

test('should add expense to database and store', (done) => {
  const store = createMockStore(defaultAuthState)
  const data = {
    description: 'Mouse',
    amount: 3000,
    note: 'This one is better',
    createdAt: 1000
  }
  store.dispatch(startAddExpense(data)).then(() => {
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'ADD_EXPENSE',
      expense: {
        id: expect.any(String),
        ...data
      }
    })
    database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value')
      .then((snapshot) => {
        expect(snapshot.val()).toEqual(data)
        done()
      })

  })

})

test('should add expense with defualts to database and store', () => {
  const store = createMockStore(defaultAuthState)
  const defaultData = {
    description: '',
    amount: 0,
    note: '',
    createdAt: 0
  }
  store.dispatch(startAddExpense({})).then(() => {
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'ADD_EXPENSE',
      expense: {
        id: expect.any(String),
        ...defaultData
      }
    })
    database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value')
      .then((snapshot) => {
        expect(snapshot.val()).toEqual(defaultData)
        done()
      })

  })
})



test('should set up action object', () => {
  const action = setExpenses(expenses)
  expect(action).toEqual({
    type: 'SET_EXPENSES',
    expenses
  })
})

test('this is crap and i dont give a shit what we are testing', (done) => {
  const store = createMockStore(defaultAuthState)
  store.dispatch(startSetExpenses()).then(() => {
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'SET_EXPENSES',
      expenses
    })
    done()
  })

})

