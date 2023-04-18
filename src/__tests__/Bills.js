/**
 * @jest-environment jsdom
 */

import { getByTestId, screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import BillsContainer from "../containers/Bills";
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
      expect(windowIcon.classList[0]).toEqual("active-icon");
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    //Test bouton
    test("click on the button to go to the new bill page", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills);
      const newBillButton = screen.getByTestId('btn-new-bill');
      newBillButton.click();
      const NewBillForm = screen.getByTestId("form-new-bill");
      expect(NewBillForm).toBeTruthy();
    })
    //test icopn-eye
    test('Then modal window should open when eye is clicked', () => {
      //Inspiré de Dashboard
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      $.fn.modal = jest.fn();
      document.body.innerHTML = BillsUI({ data: [bills[0]] });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const store = null
      const billsContainer = new BillsContainer({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      const eyeIcon = screen.getByTestId('icon-eye');
      const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye(eyeIcon));
      eyeIcon.addEventListener('click', handleClickIconEye);
      eyeIcon.click();
      expect(handleClickIconEye).toHaveBeenCalled();
    })
  })
})

//Test d'intégration GET
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test('fetches bills from mock API GET', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'e@e' }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      document.body.innerHTML = BillsUI({ data: bills });
      window.onNavigate(ROUTES_PATH.Bills);
      const arrayContent = screen.getByTestId('tbody');
      expect(arrayContent).toBeTruthy();
      const contentFrais = screen.getByText('Mes notes de frais');
      expect(contentFrais).toBeTruthy();
    });

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, 'bills');
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            type: 'Employee',
            email: 'e@e',
          })
        );
        const root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);
        router();
      });

      test('fetches bills from an API and fails with 404 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error('Erreur 404'));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });
      test('feches messages from an API and fails with 500 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error('Erreur 500'));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
