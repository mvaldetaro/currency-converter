import "../css/style.css";

const { VITE_API_KEY } = import.meta.env;

const currencyOneEl = document.querySelector('[data-js="currency-one"]');
const currencyTwoEl = document.querySelector('[data-js="currency-two"]');
const currenciesEl = document.querySelector('[data-js="currencies-container"]');
const convertedValueEl = document.querySelector('[data-js="converted-value"]');
const valuePrecisonEl = document.querySelector(
  '[data-js="conversion-precision"]'
);
const timesCurrencyOneEl = document.querySelector(
  '[data-js="currency-one-times"]'
);

const state = (() => {
  let xExchangeRate = {};

  return {
    getExchangeRate: () => xExchangeRate,
    setExchangeRate: (pNewExchangeRate) => {
      if (!pNewExchangeRate.conversion_rates) {
        console.error("Sem taxas de conversão.");
        return;
      }
      xExchangeRate = pNewExchangeRate;
      return xExchangeRate;
    },
  };
})();

const getUrl = (currency) =>
  `https://v6.exchangerate-api.com/v6/${VITE_API_KEY}/latest/${currency}`;

const getErrorMessage = (errType) => {
  const xErrorType = {
    "unsupported-code": "A moeda não existe em nosso banco de dados.",
    "malformed-request": "Pedido não pode ser executado.",
    "invalid-key": "Chave de API inválida.",
    "inactive-account": "Conta Inativa.",
    "quota-reached": "Sua conta alcançou o limite de pedidos permitido.",
  };
  return xErrorType[errType] || "Não foi possível obter as informações";
};

const showAlert = (pErrMessage) => {
  const xDiv = document.createElement("div");
  const xButton = document.createElement("button");

  xDiv.classList.add(
    "alert",
    "alert-warning",
    "alert-dismissible",
    "fade",
    "show"
  );
  xDiv.textContent = pErrMessage;
  xDiv.setAttribute("role", "alert");

  xButton.classList.add("btn-close");
  xButton.setAttribute("type", "button");
  xButton.setAttribute("aria-label", "Close");

  const removeAlert = () => {
    xDiv.remove();
  };

  xButton.addEventListener("click", removeAlert);

  xDiv.appendChild(xButton);

  currenciesEl.insertAdjacentElement("afterend", xDiv);
};

const fecthEchangeRate = async (url) => {
  try {
    const xResponse = await fetch(url);
    const xExchangeRateData = await xResponse.json();

    if (xExchangeRateData.result === "error") {
      const xErrorMessage = getErrorMessage(xExchangeRateData["error-type"]);
      throw new Error(xErrorMessage);
    }

    return state.setExchangeRate(xExchangeRateData);
  } catch (rErr) {
    showAlert(rErr.message);
  }
};

const getOptions = (selectedCurrency = "USD", pConversionRates) => {
  const setSelectedAttribute = (currency) => {
    return currency === selectedCurrency ? "selected" : "";
  };

  const arrayToOptions = (currency) =>
    `<option ${setSelectedAttribute(currency)}>${currency}</option>`;

  return Object.keys(pConversionRates).map(arrayToOptions).join("");
};

const getMultipliedExchangeRate = (pConversionRates) => {
  const xCurrencyTwo = pConversionRates[currencyTwoEl.value];
  return (timesCurrencyOneEl.value * xCurrencyTwo).toFixed(2);
};

const getNotRoundedExchangeRate = (pConversionRates) => {
  const xCurrencyTwo = pConversionRates[currencyTwoEl.value];
  return `1 ${currencyOneEl.value} = ${1 * xCurrencyTwo} ${
    currencyTwoEl.value
  }`;
};

const showUpdatedRates = ({ conversion_rates }) => {
  convertedValueEl.textContent = getMultipliedExchangeRate(conversion_rates);
  valuePrecisonEl.textContent = getNotRoundedExchangeRate(conversion_rates);
};

const showIntInfo = ({ conversion_rates }) => {
  currencyOneEl.innerHTML = getOptions("USD", conversion_rates);
  currencyTwoEl.innerHTML = getOptions("BRL", conversion_rates);

  showUpdatedRates({ conversion_rates });
};

const init = async () => {
  const xUrl = getUrl("USD");
  const xExchangeRate = await fecthEchangeRate(xUrl);

  if (xExchangeRate?.conversion_rates) {
    showIntInfo(xExchangeRate);
  }
};

const handleTimesCurrencyOneElInput = () => {
  const { conversion_rates } = state.getExchangeRate();
  convertedValueEl.textContent = getMultipliedExchangeRate(conversion_rates);
};

const handleCurrencyTwoElInput = () => {
  const xExchangeRate = state.getExchangeRate();
  showUpdatedRates(xExchangeRate);
};

const handleCurrencyOneElInput = async (e) => {
  const xUrl = getUrl(e.target.value);
  const xExchangeRate = await fecthEchangeRate(xUrl);

  showUpdatedRates(xExchangeRate);
};

timesCurrencyOneEl.addEventListener("input", handleTimesCurrencyOneElInput);

currencyTwoEl.addEventListener("input", handleCurrencyTwoElInput);

currencyOneEl.addEventListener("input", handleCurrencyOneElInput);

init();
