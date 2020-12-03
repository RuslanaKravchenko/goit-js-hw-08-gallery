import cards from './gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  largeImage: document.querySelector('.lightbox__image'),
  lightbox: document.querySelector('.js-lightbox'),
  backdrop: document.querySelector('.lightbox__overlay'),
  closeModalBtn: document.querySelector(
    'button[ data-action="close-lightbox"]',
  ),
};

let currentIndex = 0;

//============== Создаем разметку =============

const createGalleryItem = ({ original, preview, description }, index = 0) =>
  `<li class="gallery__item">
<a class="gallery__link" href="${original}"><img class="gallery__image" src="${preview}" data-source="${original}" data-index="${index}" alt="${description}"></a>
</li>`;

const item = cards.map(createGalleryItem).join('');

refs.gallery.insertAdjacentHTML('afterbegin', item);

// ==================================================
refs.gallery.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const largeImageURL = event.target.dataset.source;

  setLargeImageSrc(largeImageURL);
  onOpenModal(event);
}

function setLargeImageSrc(url) {
  refs.largeImage.src = url;
}

// ================= Модальное окно =================

refs.closeModalBtn.addEventListener('click', onCloseModal);
refs.backdrop.addEventListener('click', onBackdropClick);

function onOpenModal(event) {
  window.addEventListener('keydown', onKeyPress);
  refs.lightbox.classList.add('is-open');

  currentIndex = Number(event.target.dataset.index);
}

function onCloseModal() {
  window.removeEventListener('keydown', onKeyPress);
  refs.lightbox.classList.remove('is-open');
  refs.largeImage.src = '';
}

function onBackdropClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

function onKeyPress(event) {
  if (event.code === 'Escape') {
    onCloseModal();
  }

  if (event.code === 'ArrowRight') {
    nextCard();
  }

  if (event.code === 'ArrowLeft') {
    previousCard();
  }
}

function nextCard() {
  currentIndex >= 0 && currentIndex < cards.length - 1
    ? (currentIndex += 1)
    : (currentIndex = 0);

  refs.largeImage.src = cards[currentIndex].original;
}

function previousCard() {
  currentIndex > 0 && currentIndex <= cards.length - 1
    ? (currentIndex -= 1)
    : (currentIndex = cards.length - 1);

  refs.largeImage.src = cards[currentIndex].original;
}
