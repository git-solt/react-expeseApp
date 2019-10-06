import React from 'react'
import { shallow } from 'enzyme'
import expenses from '../fixtures/expenses'
import {EditExpensePage} from '../../components/EditExpensePage'

let startEditExpense, history, startRemoveExpense, wrapper

beforeEach(() => {
  startEditExpense = jest.fn()
  startRemoveExpense = jest.fn()
  history = { push: jest.fn()}
  wrapper = shallow(
    <EditExpensePage 
    startEditExpense={startEditExpense} 
    startRemoveExpense={startRemoveExpense}
      history={history}
      expenses={expenses[2]}
    />
  )

})

test('render ExpensePage Correctly', () => {

  expect(wrapper).toMatchSnapshot()
})

test('should handle startEditExpense spies', () => {
  wrapper.find('ExpenseForm').prop('customSubmit')(expenses[2])
  expect(history.push).toHaveBeenLastCalledWith('/')
  expect(startEditExpense).toHaveBeenLastCalledWith(expenses[2].id, expenses[2])
})

test('should handle removeExpense', () => {
  wrapper.find('button').simulate('click')
  expect(history.push).toHaveBeenLastCalledWith('/')
  expect(startRemoveExpense).toHaveBeenLastCalledWith({id: expenses[2].id})
})