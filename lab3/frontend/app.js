let contacts = [];

//as u use getAllContacts here (which is async returns a promise) so this also would be async
async function displayContacts() {
  // get all contacts then convert it from objects to string
  contacts = await getAllContacts();
  let html = contacts
    .map(
      (contact) => `
                  <tr>
                      <td>${contact.Name}</td>
                      <td>${contact.Phone}</td>
                      <td><button onClick="editBtn('${contact.Id}')" class="btn btn-success">Edit</button>
                      <button onClick="deleteBtn('${contact.Id}')" class="btn btn-danger">Delete</button></td>
                  </tr>
              `
    )
    .join("\n");

  document.getElementById("contacts-table").innerHTML = html;
}

async function addBtn() {
  let contact = {};
  contact.Name = document.getElementById("contact-name").value;
  contact.Phone = document.getElementById("contact-phone").value;
  await addContact(contact); //wait it to add before refresh
  displayContacts(); //to show the contacts with the new one added (reload)
}

async function editBtn(contactId) {
  let editedContact = contacts.find((item) => item.Id == contactId);
  document.getElementById("editedContact-id").value = editedContact.Id;
  document.getElementById("editedContact-name").value = editedContact.Name;
  document.getElementById("editedContact-phone").value = editedContact.Phone;
}

async function saveBtn() {
  let contact = {};
  contact.Id = document.getElementById("editedContact-id").value;
  contact.Name = document.getElementById("editedContact-name").value;
  contact.Phone = document.getElementById("editedContact-phone").value;
  //then send this object to the api (post it)
  await updateContact(contact);
  displayContacts();
}

async function deleteBtn(contactId) {
  await deleteContact(contactId);
  displayContacts(); // to refresh after delete
}

//invoke it inside the table
displayContacts();
