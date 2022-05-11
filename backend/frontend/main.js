'use strict'

const postsList = document.getElementById('posts');

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
    const data = await response.json();

    postsList.innerHTML = data.map(postTemplate).join('');

}

showAllArt();

const deleteBtns = document.querySelectorAll('[data-function="delete"]');
const editBtns = document.querySelectorAll('[data-function="edit"]');

console.log(deleteBtns);

deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
        console.log('hoho');
        await fetch(`/api/erase`, {
            method: 'DELETE'
          });
          showAllArt();
      });
    });