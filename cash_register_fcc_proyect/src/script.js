let price = 1;
let cash = document.getElementById("cash");
let priceScreen = document.getElementById("price-screen");
const changeDue = document.getElementById("change-due");
const purchasBtn = document.getElementById("purchase-btn");
let cashDrawerDisplay = document.getElementById("cash-drawer-display");
let unordererList = changeDue;

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const currencyUnit = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

const variableComparative = {
  PENNY: "Penny",
  NICKEL: "Nickel",
  DIME: "Dime",
  QUARTER: "Quarter",
  ONE: "One",
  FIVE: "Five",
  TEN: "Ten",
  TWENTY: "Twenty",
  "ONE HUNDRED": "Hundreds",
};

const message = {
  noFunds: "Status: INSUFFICIENT_FUNDS",
  closed: "Status: CLOSED",
  open: "Status: OPEN",
  noChangeDue: "No change due - customer paid with exact cash",
};

const cashDisplay = () => {
  let display = "<p><strong>Change in drawer:</strong></p>";
  for (let i = 0; i < cid.length; i++) {
    display += `<p>${variableComparative[cid[i][0]]}: \$${cid[i][1]}</p>`;
  }
  return display;
};

priceScreen.innerHTML = price;

const totalInCashRegister = (actualCid) => {
  return parseFloat(actualCid.reduce((acum, element) => acum + parseFloat(element[1]), 0).toFixed(2));
};
const validationOfChange = (changeCid, clientPay) => {
  let cashValue = clientPay;
  const clientChange = cashValue - parseFloat(price);
  return changeCid.reduce((acum, current) => {
    const unit = currencyUnit[current[0]];
    const changeClientCount = Math.trunc(acum / unit);
    const quantityCurrentCount = Math.trunc(current[1] / unit);
    if (
      changeClientCount > 0 &&
      quantityCurrentCount > 0 &&
      changeClientCount >= quantityCurrentCount
    ) {
      acum -= quantityCurrentCount * unit;
    } else if (
      changeClientCount > 0 &&
      quantityCurrentCount > 0 &&
      changeClientCount < quantityCurrentCount
    ) {
      acum -= changeClientCount * unit;
    }
    return parseFloat(acum.toFixed(2));
  }, clientChange);
};

const calculateChange = (cash) => {
  let cashValue = parseFloat(parseFloat(cash).toFixed(2));
  let clientChange = cashValue - price;
  clientChange = parseFloat(clientChange.toFixed(2));
  const acumulado = [];
  cid.forEach((current) => {
    const denomination = currencyUnit[current[0]];
    let changeClientCount = Math.trunc(clientChange / denomination)
    changeClientCount = parseFloat(changeClientCount.toFixed(2))
    let quantityCurrentCount = Math.trunc(current[1] / denomination)
    quantityCurrentCount = parseFloat(quantityCurrentCount.toFixed(2))
    
    if (
      changeClientCount > 0 &&
      quantityCurrentCount > 0 &&
      changeClientCount >= quantityCurrentCount
    ) {
      let amountToreturn = quantityCurrentCount * denomination;
      amountToreturn = parseFloat(amountToreturn.toFixed(2));
      clientChange = clientChange - amountToreturn;
      clientChange = parseFloat(clientChange.toFixed(2));
      current[1] -= amountToreturn;
      current[1] = parseFloat(current[1].toFixed(2));
      acumulado.push(`<p>${current[0]}: \$${parseFloat((quantityCurrentCount * denomination).toFixed(2))}</p>`);
      clientChange = parseFloat(clientChange.toFixed(2));
    } else if (
      changeClientCount > 0 &&
      quantityCurrentCount > 0 &&
      changeClientCount < quantityCurrentCount
    ) {
      let amountToreturn = changeClientCount * denomination;
      amountToreturn = parseFloat(amountToreturn.toFixed(2));
      clientChange = clientChange - amountToreturn;
      clientChange = parseFloat(clientChange.toFixed(2))
      current[1] -= amountToreturn;
      current[1] = parseFloat(current[1].toFixed(2));
      acumulado.push(
        `<p>${current[0]}: \$${parseFloat((changeClientCount * denomination).toFixed(2))}</p>`
      );
      clientChange = parseFloat(clientChange.toFixed(2));
    }
  });
  return acumulado;
};
cashDrawerDisplay.innerHTML = cashDisplay();
purchasBtn.addEventListener("click", () => {
  cid.reverse();
  let cashValue = parseFloat(cash.value);
  //const moneyInRegister = totalInCashRegister(cid);
  changeDue.value = "";
  if (cashValue !== price) {
    if (validationOfChange(cid, cashValue) < 0) {
      window.alert("Customer does not have enough money to purchase the item");
    } else if (validationOfChange(cid, cashValue) > 0) {
      changeDue.innerHTML = message.noFunds;
    } else if (validationOfChange(cid, cashValue) === 0) {
      let arrayofchange = calculateChange(cashValue);
      if (totalInCashRegister(cid) < 0) {
        changeDue.innerHTML = message.noFunds;
      } else if (totalInCashRegister(cid) === 0) {
        changeDue.innerHTML = `<p>${message.closed}</p>${arrayofchange.join("")}`;
      } else if (totalInCashRegister(cid) > 0) {
        changeDue.innerHTML = `<p>${message.open}</p>${arrayofchange.join("")}`;
      }
    } else {
      window.alert("Customer does not have enough money to purchase the item");
    }
  } else {
    changeDue.innerHTML = message.noChangeDue;
  }
  cid.reverse();
  cashDrawerDisplay.innerHTML = cashDisplay();
});
