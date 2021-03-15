document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();

    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;
      if (request.status === 200) {
        const response = JSON.parse(request.response)
        callback(response);
      } else {
        console.error(new Error('Error:' + request.status))
      }
    });
  };

  const tabs = () => {
    const cardDetailChangeElems = document.querySelectorAll('.card-detail__change');
    const cardDetailsTitleElem = document.querySelector('.card-details__title');
    const cardImageItemElem = document.querySelector('.card__image_item');
    const cardDetailsPriceElem = document.querySelector('.card-details__price');
    const descriptionMemory = document.querySelector('.description__memory');

    const data = [{
        name: 'Смартфон Apple iPhone 12 Pro 128GB Graphite',
        img: 'img/iPhone-graphite.png',
        price: 95990,
        memoryROM: 128
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Silver',
        img: 'img/iPhone-silver.png',
        price: 97990,
        memoryROM: 256
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Pacific Blue',
        img: 'img/iPhone-blue.png',
        price: 99990,
        memoryROM: 128
      }
    ];

    const deactive = () => {
      cardDetailChangeElems.forEach(btn => btn.classList.remove('active'));
    }

    cardDetailChangeElems.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (!btn.classList.contains('active')) {
          deactive();
          btn.classList.add('active');
          cardDetailsTitleElem.textContent = data[i].name;
          cardImageItemElem.src = data[i].img;
          cardImageItemElem.alt = data[i].name;
          cardDetailsPriceElem.textContent = data[i].price + '₽';
          descriptionMemory.textContent = `Смартфон Apple iPhone 12 Pro ${data[i].memoryROM}GB Graphite`
        }
      });
    });
  };

  const accordeon = () => {
    const characteristicsListElem = document.querySelector('.characteristics__list');
    const characteristicsItemElems = document.querySelectorAll('.characteristics__item');

    characteristicsItemElems.forEach(elem => {
      if (elem.children[1].classList.contains('active')) {
        elem.children[1].style.height = `${elem.children[1].scrollHeight}px`;
      }
    });

    const open = (button, dropdown) => {
      closeAllDrops();
      dropdown.style.height = `${dropdown.scrollHeight}px`;
      button.classList.add('active');
      dropdown.classList.add('active');
    };

    const close = (button, dropdown) => {
      button.classList.remove('active');
      dropdown.classList.remove('active');
      dropdown.style.height = '';
    };
    const closeAllDrops = (button, dropdown) => {
      characteristicsItemElems.forEach((elem) => {
        if (elem.children[0] !== button && elem.children[1] !== dropdown) {
          close(elem.children[0], elem.children[1]);
        }
      });
    };

    characteristicsListElem.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('characteristics__title')) {
        const parent = target.closest('.characteristics__item');
        const description = parent.querySelector('.characteristics__description');
        description.classList.contains('active') ?
          close(target, description) :
          open(target, description);
      }
    })
  };

  const modal = () => {
    const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy');
    const cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery');
    const modal = document.querySelector('.modal');
    const cardDetailsTitle = document.querySelector('.card-details__title');
    const modalTitle = modal.querySelector('.modal__title');
    const modalSubtitle = modal.querySelector('.modal__subtitle');

    const openModal = (e) => {
      const target = e.target;
      modal.classList.add('open');
      document.addEventListener('keydown', escapeHandler);
      modalTitle.textContent = cardDetailsTitle.textContent;
      modalSubtitle.textContent = target.dataset.buttonBuy;
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.removeEventListener('keydown', escapeHandler);
    };

    const escapeHandler = (e) => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };

    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('modal__close') || target === modal) {
        closeModal();
      }
    });

    cardDetailsButtonBuy.addEventListener('click', openModal);
    cardDetailsButtonDelivery.addEventListener('click', openModal);

  };

  const renderCrossSell = () => {
    const crossSellList = document.querySelector('.cross-sell__list');
    const crossSellAdd = document.querySelector('.cross-sell__add');
    const allGoods = [];

    const shuffle = arr => arr.sort(() => Math.random() - 0.5);

    const createCrossSellItem = (good) => {
      const liItem = document.createElement('li');
      liItem.innerHTML = `
            <article class="cross-sell__item" ${good.id}>
							<img class="cross-sell__image" src="${good.photo}" alt="${good.name}">
							<h3 class="cross-sell__title">${good.name}</h3>
							<p class="cross-sell__price">${good.price}₽</p>
							<button type="button" class="button button_buy cross-sell__button">Купить</button>
						</article>
      `;
      return liItem;
    };

    const render = arr => {
      arr.forEach(item => {
        crossSellList.append(createCrossSellItem(item));
      })
    };


    const createCrossSellList = (goods) => {
      allGoods.push(...shuffle(goods));
      const fourItems = allGoods.splice(0, 4);
      render(fourItems);
    };

    crossSellAdd.addEventListener('click', () => {
      render(allGoods);
      crossSellAdd.remove();
    });

    getData('cross-sell-dbase/dbase.json', createCrossSellList);
  }

  tabs();
  accordeon();
  modal();
  renderCrossSell();
  amenu('.header__menu', '.header-menu__list', '.header-menu__item', '.header-menu__burger');


});