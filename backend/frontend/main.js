'use strict'

const postsList = document.getElementById('posts');
const formTitle = document.getElementById('title');
const formContent = document.getElementById('content');
const formTags = document.getElementById('tags');
const postForm = document.getElementById('createpost');

let editPostItem = null;
let entries = [];

const FORM_MODES = {
    CREATE: 'create',
    EDIT: 'edit'
  }

  let formMode = FORM_MODES.CREATE;

const tagsTemplate = (tags) => tags.map((tag) => `
  <li>${tag}</li>
`).join('');

const postTemplate = (data) => `
  <li>
    <h3> Titel: ${data.title}</h3>
    <p> Datum: ${data.date}</p>
    <p>Innehåll: ${data.content}</p>
    <ul> Taggar:
      ${tagsTemplate(data.tags)}
    </ul>
    <button data-function="edit" data-postid="${data._id}">Ändra inlägg</button>
    <button data-function="delete" data-postid="${data._id}">Radera inlägg</button>
  </li>
`;

const showAllArt = async () => {
    const response = await fetch('/api/articles');
    entries = await response.json();

    postsList.innerHTML = entries.map(postTemplate).join('');

    const deleteBtns = document.querySelectorAll("[data-function='delete']");
    const editBtns = document.querySelectorAll('[data-function="edit"]');

deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
        await fetch(`/api/articles/erase/${e.target.dataset.postid}`, {
            method: 'DELETE'
          });
          showAllArt();
    });
});

editBtns.forEach((btn2) => {
    btn2.addEventListener("click", async (e) => {
        formMode = FORM_MODES.EDIT;
        editPostItem = entries.find(({ _id }) => _id === e.target.dataset.postid);
        
        formTitle.value = editPostItem.title;
        formContent.value = editPostItem.content;
        formTags.value = editPostItem.tags.join(',');
    });
});
}



postForm.addEventListener('reset', async (e) => {
    formMode = FORM_MODES.CREATE;
    editPostItem = null;
  });

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const useUrl = formMode === FORM_MODES.CREATE ? '/api/articles/new' : `/api/articles/update/${editPostItem._id}`;
    const method = formMode === FORM_MODES.CREATE ? 'POST' : 'PUT';
    const date = formMode === FORM_MODES.CREATE ? new Date() : new Date(editPostItem.date);
  
    await fetch(useUrl, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: formTitle.value,
        content: formContent.value,
        date,
        tags: formTags.value.split(',')
      })
    });
    
    postForm.reset();
    showAllArt();
  });



showAllArt();
