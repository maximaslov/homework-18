'use strict'

const URL = 'https://62e3ccc8b54fc209b8912174.mockapi.io/api/contacts/';
const CONTACT_CLASS = 'contact';
const DELETE_BTN_CLASS = 'contact-del-btn';

const contactList = document.querySelector('.contacts__items');
const inputName = document.querySelector('#form__name');
const inputLastName = document.querySelector('#form__lastname');
const inputNumber = document.querySelector('#form__number');
const contactForm = document.querySelector('#contacts__form');

contactForm.addEventListener('submit', onContactFormSubmit);
contactList.addEventListener('click', onContactListClick);

getContactList().then(renderContactList);

function onContactFormSubmit(e) {
    e.preventDefault();
    if (isDataValid()) {
        const contact = getContact();
        createContact(contact)
            .then(newContact => {
                renderContactItem(newContact);
                clearForm();
            });
    } else {
        alert('Enter correct data!')
    }
}

function isDataValid() {
    return fistName() !== ''
        && isNaN(fistName())
        && lastName() !== ''
        && isNaN(lastName())
        && number() !== ''
        && !isNaN(number());
}

function getContact() {
    return {
        firstname: fistName(),
        lastname: lastName(),
        number: number(),
    };
}

function getContactList() {
    return fetch(URL).then(res => res.json());
}

function createContact(contact) {
    return fetch(URL, {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: {
            'Content-type': 'application/json',
        },
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Can not create new todo');
    })
}

function onContactListClick(e) {
    const elem = e.target;
    const id = elem.dataset.id;
   if (elem.classList.contains(DELETE_BTN_CLASS)) {
       const id = elem.parentElement.dataset.id
       removeContactElem(id);
   }
}

function removeContactElem(id) {
    return fetch(URL + id, {
        method: 'DELETE'
    }).then(res => {
        if (res.ok) {
            const deletedElement = contactList.querySelector(`[data-id="${id}"]`);
            deletedElement.remove();
        }
    })
}

function getContactItem(el) {
    return el.closest(CONTACT_CLASS);
}

function renderContactList(list) {
    const html = list.map(generateContactHtml).join('');

    contactList.insertAdjacentHTML('beforeend', html);
}

function renderContactItem(contact) {
    const contactTemplateHTML = generateContactHtml(contact);

    contactList.insertAdjacentHTML('beforeend', contactTemplateHTML);
}

function generateContactHtml(contact) {
    const firstname = contact.firstname;
    const lastname = contact.lastname;
    const number = contact.number;
    const id = contact.id;
    return `
         <li class="contact" data-id="${id}">
            <p class="first-name contact-item">${firstname}</p>
            <p class="last-name contact-item">${lastname}</p>
            <p class="phone-number contact-item">${number}</p>
            <button class="contact-del-btn">Delete</button>
        </li>
    `;
}

function clearForm() {
    contactForm.reset();
}

function fistName() {
    return inputName.value;
}

function lastName() {
    return inputLastName.value;
}

function number() {
    return inputNumber.value;
} 