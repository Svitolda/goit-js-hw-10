
export default function fetchCountries(name){

const BASE_URL = 'https://restcountries.com/v3.1/name/'
const fields = 'fields=name,capital,flags,population,languages';

 return fetch(`${BASE_URL}${name}?${fields}`)
    .then(response => response.json())
};

