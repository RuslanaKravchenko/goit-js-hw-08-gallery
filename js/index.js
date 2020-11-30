import cards from './gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  largeImage: document.querySelector('.lightbox__image'),
  lightbox: document.querySelector('.js-lightbox'),
  backdrop: document.querySelector('.lightbox__overlay'),
  closeModalBtn: document.querySelector(
    'button[ data-action="close-lightbox"]',
  ),
  galleryItem: '',
  galleryLink: '',
  galleryIMG: '',
};

let currentIndex = 0;

//============== Создаем разметку =============
function createGalleryItem(cards) {
  const fragment = document.createDocumentFragment();

  cards.forEach(({ preview, original, description }, index = 0) => {
    refs.galleryIMG = document.createElement('img');
    refs.galleryIMG.classList.add('gallery__image');
    refs.galleryIMG.setAttribute('src', preview);
    refs.galleryIMG.setAttribute('alt', description);
    refs.galleryIMG.setAttribute('data-source', original);
    refs.galleryIMG.setAttribute('data-index', index);

    refs.galleryLink = document.createElement('a');
    refs.galleryLink.classList.add('gallery__link');
    refs.galleryLink.setAttribute('href', original);

    refs.galleryItem = document.createElement('li');
    refs.galleryItem.classList.add('gallery__item');

    refs.galleryLink.appendChild(refs.galleryIMG);
    refs.galleryItem.appendChild(refs.galleryLink);
    fragment.appendChild(refs.galleryItem);
  });

  return fragment;

  // const markup = cards.reduce((acc, card, index = 0) => {
  //   acc += `
  //     <li class="gallery__item">
  //   <a
  //     class="gallery__link"
  //     href= ${card.original}
  //   >
  //     <img
  //       class="gallery__image"
  //       src= ${card.preview}
  //       data-source= ${card.original}
  //       alt= '${card.description}'
  //       data-index = ${index}
  //     />
  //   </a>
  // </li>`;
  //   return acc;
  // }, '');
  // return (refs.gallery.innerHTML = markup);
}
// createGalleryItem(cards);

refs.gallery.appendChild(createGalleryItem(cards));

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
