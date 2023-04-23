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
    // clearHTML()
    // console.log(name);

    if (!name) {
        Notiflix.Notify.warning('Please enter country name');
        clearHTML();
        return;
    }
     

    fetchCountries(name).then(data => {
        clearHTML()
        if (data.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
            // return;
        } else if (data.length > 2 && data.length <= 10) {
             makeCountryList(data);
        } else if (data.length === 1) {
            makeCoutryInfo(data);
        } else if (data.status === 404) {
            console.log(data)
            Notiflix.Notify.failure('Oops, there is no country with that name')
        }
    })
    .catch(error => {error});
    // .finally(()=> {
    //     inputEl.reset();
    // })
}

function makeCountryList(data){
    const listMarkup = data.map(({ name, flags }) => {
        return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag of ${name.official}"  width="40" height="30" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    }).join('');
//   return countryList.insertAdjacentHTML('beforeend', markup);
 countryList.innerHTML = listMarkup;
}

function makeCoutryInfo(data) {
    const infoMarkup = data.map(({ name, capital, population, flags, languages }) => {
    return `<div class="country__flag">
        <img class="country__img" src="${flags.svg}" alt="flag of ${name.official}" width="40" height="30">
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
    // return countryInfo.insertAdjacentHTML('beforeend', markup);
     countryInfo.innerHTML = infoMarkup;
}

function clearHTML() {
    countryList.innerHTML="";
    countryInfo.innerHTML="";
}