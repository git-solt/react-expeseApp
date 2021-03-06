import expenses from '../fixtures/expenses'
import getExpensesTotal from '../../selectors/expenses-total'

let filteredExpenses = [expenses[0], expenses[1]]


test('checking that getExpensesTotal is 0 when not called with array', () => {
  const total = getExpensesTotal([])
  expect(total).toBe(0)
})



test('checking that getExpensesTotal adds upp the amount correctly', () => {
  const total = getExpensesTotal(filteredExpenses)
  expect(total).toBe(109695)
}) 