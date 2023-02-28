(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();const{VITE_API_KEY:h}={VITE_API_KEY:"6bc2afa5f57065cd539ead18",VITE_BASE_URL:"currency-converter/",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0},i=document.querySelector('[data-js="currency-one"]'),s=document.querySelector('[data-js="currency-two"]'),g=document.querySelector('[data-js="currencies-container"]'),p=document.querySelector('[data-js="converted-value"]'),x=document.querySelector('[data-js="conversion-precision"]'),E=document.querySelector('[data-js="currency-one-times"]'),u=(()=>{let e={};return{getExchangeRate:()=>e,setExchangeRate:t=>{if(!t.conversion_rates){console.error("Sem taxas de conversão.");return}return e=t,e}}})(),m=e=>`https://v6.exchangerate-api.com/v6/${h}/latest/${e}`,v=e=>({"unsupported-code":"A moeda não existe em nosso banco de dados.","malformed-request":"Pedido não pode ser executado.","invalid-key":"Chave de API inválida.","inactive-account":"Conta Inativa.","quota-reached":"Sua conta alcançou o limite de pedidos permitido."})[e]||"Não foi possível obter as informações",R=e=>{const t=document.createElement("div"),o=document.createElement("button");t.classList.add("alert","alert-warning","alert-dismissible","fade","show"),t.textContent=e,t.setAttribute("role","alert"),o.classList.add("btn-close"),o.setAttribute("type","button"),o.setAttribute("aria-label","Close");const c=()=>{t.remove()};o.addEventListener("click",c),t.appendChild(o),g.insertAdjacentElement("afterend",t)},f=async e=>{try{const o=await(await fetch(e)).json();if(o.result==="error"){const c=v(o["error-type"]);throw new Error(c)}return u.setExchangeRate(o)}catch(t){R(t.message)}},d=(e="USD",t)=>{const o=n=>n===e?"selected":"",c=n=>`<option ${o(n)}>${n}</option>`;return Object.keys(t).map(c).join("")},y=e=>{const t=e[s.value];return(E.value*t).toFixed(2)},b=e=>{const t=e[s.value];return`1 ${i.value} = ${1*t} ${s.value}`},l=({conversion_rates:e})=>{p.textContent=y(e),x.textContent=b(e)},w=({conversion_rates:e})=>{i.innerHTML=d("USD",e),s.innerHTML=d("BRL",e),l({conversion_rates:e})},L=async()=>{const e=m("USD"),t=await f(e);t!=null&&t.conversion_rates&&w(t)},S=()=>{const{conversion_rates:e}=u.getExchangeRate();p.textContent=y(e)},A=()=>{const e=u.getExchangeRate();l(e)},C=async e=>{const t=m(e.target.value),o=await f(t);l(o)};E.addEventListener("input",S);s.addEventListener("input",A);i.addEventListener("input",C);L();
