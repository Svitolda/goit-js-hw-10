import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries'

const DEBOUNCE_DELAY = 1000;
let name ="";

const inputEl = document.getElementById('search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list')

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));



function onInputChange(e){
    e.preventDefault();
    name = e.target.value.trim();
    clearHTML()
    // console.log(name);

    if (!name) {
        Notiflix.Notify.warning('Please enter country name');
    }

    fetchCountries(name).then(data => {
        if (data.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
            return;
        } else if (data.length > 2 && data.length) {
            countryList.innerHTML = makeCountryList(data);
        } else if (data.length === 1) {
            countryInfo.innerHTML = makeCoutryInfo(data);
        } else if (data.status === 404) {
            console.log(data)
            Notiflix.Notify.failure('Oops, there is no country with that name')
        }
    })
    .catch(error => {error});
}

function makeCountryList(data){
    return data.map(({ name, flags }) => {
      `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    }).join('');
//   return refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function makeCoutryInfo(data) {
    return data.map(({ name, capital, population, flags, languages }) => {
    `<div class="country__flag">
        <img class="country__img" src="${flags.svg}" alt="flag">
        <p class="country__name">${name.official}</p>
    </div>
    <ul class="country__info">
        <li class="country__item"> <b>Capital</b>:
        <span class="country__span">${capital}</span>
        </li>
        <li class="country__item"> <b>Population</b>:
        <span class="country__span">${population}</span>
        </li>
        <li class="country__item"> <b>Languages</b>:
        <span class="country__span">${Object.values(languages).join(', ')}</span>
        </li>
    </ul>`;
    }).join('');
}

function clearHTML() {
    countryList.innerHTML="";
    countryInfo.innerHTML="";
}