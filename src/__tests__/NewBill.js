/**
 * @jest-environment jsdom
 */

import { fireEvent, getByTestId, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the newBill form must exist", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      const store = mockStore;
      const params = { document, router, store, localStorage };
      const newBillContainer = new NewBill(params);
      const newBillForm = screen.getByTestId('form-new-bill');
      expect(newBillForm).toBeTruthy();
    });
    describe('When I am on NewBill Page and I add an attached file', () => {
      // TEST : handle attached file format
      test('Then the file handler should be run', () => {
        // DOM construction
        document.body.innerHTML = NewBillUI();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        // get DOM element

        const store = mockStore;
        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });

        // handle event
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
        const attachedFile = screen.getByTestId('file');
        attachedFile.addEventListener('change', handleChangeFile);
        fireEvent.change(attachedFile, {
          target: {
            files: [new File(['image.png'], 'image.png', { type: 'image/png' })],
          },
        });

        // expected result
        const numberOfFile = screen.getByTestId('file').files.length;
        expect(numberOfFile).toEqual(1);
      })
    })
    describe('WHEN I am on NewBill page and I submit a correct form', () => {
      test('THEN I should be redirected to Bills page', () => {
        document.body.innerHTML = NewBillUI();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const store = mockStore;
        const newBillContainer = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        const handleSubmit = jest.fn(newBillContainer.handleSubmit);
        newBillContainer.fileName = 'image.jpg';
        // handle event submit form
        const newBillForm = screen.getByTestId('form-new-bill');
        newBillForm.addEventListener('submit', handleSubmit);
        fireEvent.submit(newBillForm);

        // expected results
        expect(handleSubmit).toHaveBeenCalled();
      });
    })
  })
  describe('When I submit a new bill', () => {
    const bill = {
      email: 'test@email.fr',
      type: 'Transports',
      name: 'Transport Vehicule',
      amount: 2000,
      date: '2023-04-02',
      vat: '40',
      commentary: 'commentaire',
      fileUrl: 'https://test.storage.tld/v0/b/billable-677b6.a...f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732',
      fileName: 'hello.png',
      status: 'pending',
    };
    test('update new bill api call', async () => {
      const updateSpyOn = jest.spyOn(mockStore, 'bills');
      const updateBill = await mockStore.bills().update(bill);
      const id = updateBill.id;
      expect(id).toBe('47qAXb6fIm2zOKkLzMro');
      expect(updateSpyOn).toHaveBeenCalledTimes(1);
    })
  })
})
