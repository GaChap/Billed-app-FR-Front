/**
 * @jest-environment jsdom
 */

import { fireEvent, getByTestId, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";

import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the newBill form must exist", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      const store = null;
      const params = { document, router, store, localStorage };
      const newBillContainer = new NewBill(params);
      const newBillForm = screen.getByTestId('form-new-bill');
      expect(newBillForm).toBeTruthy();
    });
    /*test("Then when the value of file input has changed the fonction associated must be called", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      jest.spyOn(window, 'alert').mockImplementation(() => { });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const store = null;
      const newBillContainer = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });
      const handleChangeFile = jest.fn((e) => newBillContainer.handleChangeFile(e));
      const fileContent = new File(['test file content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen.getByTestId('file');
      fileInput.addEventListener('change', handleChangeFile);
      fireEvent.change(fileInput, { target: { files: [fileContent] } });
      expect(handleChangeFile).toHaveBeenCalled();
      //expect(handleChangeFile.mock.calls.length).toBe(1);
    })*/
  })
})

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    describe('When I choose a file to upload', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      jest.spyOn(window, 'alert').mockImplementation(() => { });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const store = null;
      const newBillContainer = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });
      const fileInput = screen.getByTestId('file');
      const falseAlert = jest.fn(newBillContainer.falseAlert)
      const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);
      fileInput.addEventListener('change', handleChangeFile);
      test('When I choose a file in the correct format to upload, the file should be loaded and handled', async () => {
        const fileContentT = new File(['testfilecontent'], 'test.jpg', { type: 'image/jpg' })
        fireEvent.change(fileInput, { target: { files: [fileContentT] } });
        await handleChangeFile()
        expect(handleChangeFile).toHaveBeenCalled();
        expect(fileInput.files[0]).toStrictEqual(fileContentT);
        expect(window.alert).not.toHaveBeenCalled();
      })
      test('When I choose a file in the incorrect format to upload, there should be an alert', async () => {
        const fileContentF = new File(['testfilecontent'], 'test.txt', { type: 'text/txt' });
        fireEvent.change(fileInput, { target: { files: [fileContentF] } });
        await handleChangeFile()
        expect(handleChangeFile).toHaveBeenCalled();
        expect(fileInput.files[0]).toStrictEqual(fileContentF);
        expect(fileInput.value).toBe('')
        expect(window.alert).toHaveBeenCalled();
      })
    })
  })
})
