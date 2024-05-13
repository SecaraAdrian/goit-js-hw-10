import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const elements = {
  selectEl: document.querySelector('.breed-select'),
  textMarkEl: document.querySelector('.cat-info'),
  loaderEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
};

const { selectEl, textMarkEl, loaderEl, errorEl } = elements;

loaderEl.classList.add('is-hidden');
errorEl.classList.add('is-hidden');
textMarkEl.classList.add('is-hidden');

selectEl.addEventListener('change', createMarkUp);

updateSelect();

function updateSelect(data) {
  fetchBreeds(data)
    .then(data => {
      loaderEl.classList.add('is-hidden');

      data.forEach(({ name, id }) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        selectEl.appendChild(option);
      });

      new SlimSelect({
        select: selectEl,
      });
    })
    .catch(onFetchError);
}

function createMarkUp(event) {
  loaderEl.classList.remove('is-hidden');
  selectEl.classList.add('is-hidden');
  textMarkEl.classList.add('is-hidden');

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loaderEl.classList.add('is-hidden');
      selectEl.classList.remove('is-hidden');
      const { url, breeds } = data[0];

      textMarkEl.innerHTML = `<img src="${url}" alt="${breeds[0].name}" width="300"/><div class="box"><h2>${breeds[0].name}</h2><p>${breeds[0].description}</p><p><strong>Temperament:</strong> ${breeds[0].temperament}</p></div>`;
      textMarkEl.classList.remove('is-hidden');
    })
    .catch(onFetchError);
}

function onFetchError() {
  selectEl.classList.remove('is-hidden');
  loaderEl.classList.add('is-hidden');

  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!'
  );
}
