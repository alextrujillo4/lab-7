import "../index.html";
import "../scss/style.scss";
import { MDCDialog } from "@material/dialog";
import { MDCTextField } from "@material/textfield";
import { MDCFloatingLabel } from "@material/floating-label";
import {MDCSnackbar} from '@material/snackbar';
const author = new MDCTextField(document.querySelector(".author"));
const title = new MDCTextField(document.querySelector(".title"));
const content = new MDCTextField(document.querySelector(".content"));
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));

function addValueToList(element){
  $("#post_list").append(`
  <li class="mdc-layout-grid__cell">
      <div class="mdc-card demo-card demo-basic-with-header">
            <div class="demo-card__primary first-card-header" >
            <p class="card-id mdc-typography--body1">${element.id}</p>
              <h2 class="first-title demo-card__title mdc-typography mdc-typography--headline6 text-spacing">${element.title}</h2>
              <h4 class="first-subtitle demo-card__subtitle mdc-typography mdc-typography--subtitle2 text-spacing">By ${element.author}</h4>
            </div>
            <div class="mdc-card__primary-action demo-card__primary-action" tabindex="0">
              <div class="mdc-card__media mdc-card__media--16-9 demo-card__media" style="background-image: url(&quot;https://material-components.github.io/material-components-web-catalog/static/media/photos/3x2/2.jpg&quot;);"></div>
              <div class="demo-card__secondary mdc-typography mdc-typography--body2 text-round-spacing">${element.content}</div>
            </div>
            <div class="mdc-card__actions">
              <div class="mdc-card__action-buttons">
                <button class="mdc-button mdc-card__action mdc-card__action--button">Click</button>
              </div>
              <div class="mdc-card__action-icons">
                <button class="mdc-icon-button mdc-card__action mdc-card__action--icon--unbounded" aria-pressed="false" aria-label="Add to favorites" title="Add to favorites">
                  <i class="material-icons mdc-icon-button__icon">edit</i>
                </button>
                <button class="delete-button mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" title="Share" data-mdc-ripple-is-unbounded="true">delete</button>
              </div>
            </div>
       </div>
   </li>
`);
}
function postList() {
  $.ajax({
    url: "http://localhost:8080/blog-posts",
    method: "GET",
    dataType: "JSON",
    success: responseJSON => {
      responseJSON.posts.forEach(element => {
        console.log(element.title);
        addValueToList(element);
      });
    },
    error: function(err) {}
  });
}

function addPost() {
  $("#addBtn").on("click", function(event) {
    event.preventDefault();
    console.log(author.value);
    console.log(title.value);
    console.log(content.value);
    if(title.value.length < 5){
      snackbar.labelText	="Error...  Title length is too small (>5)"
      snackbar.open();
      return
    }
    if( author.value.length < 3){
      snackbar.labelText	="Error...  Author name is too small (>3)"
      snackbar.open();
      return
    }

    if (content.value.length < 50) {
      snackbar.labelText	="Error... Content minimum length is 50 characters"
      snackbar.open();
      return
    }

      $.ajax({
        url: "http://localhost:8080/blog-posts",
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
          "title": title.value,
          "content": content.value,
          "author": author.value,
          "publishDate": new Date().toString()
        }),
        success: responseJSON => {
          console.log(responseJSON.post);
          let element =responseJSON.post[0];
          addValueToList(element);
          author.value = "";
          title.value = "";
          content.value = "";
          snackbar.labelText	="Post Added!! :)"
          snackbar.open();
        },
        error: function(err) {
          snackbar.labelText	= "Error..." + err.message;
          snackbar.open();
        }
      });
 
  });
}

function deletePost() {
  $("ul").on("click", ".delete-button", function(event) {
    event.preventDefault(); 
    let card_selected = $(this).parent().parent().parent().find(".first-card-header").find(".mdc-typography--body1")
    let card_id = card_selected.html();
//${listbody}
    $.ajax({
      url: `/blog-posts/${card_id}`,
      method: "DELETE",
      contentType: 'application/json',
      success: responseJSON => {
        snackbar.labelText	= responseJSON.message
          snackbar.open();
          $(this).parent().parent().parent().parent().remove();
      },
      error: function(err) {
        snackbar.labelText	=`Error Deleting Post ${err.message}`
        snackbar.open();
      }
    });
  });
}

function dialogShow() {
  $("#dialogButton").on("click", function(event) {
    event.preventDefault();
    const dialog = new MDCDialog(document.querySelector(".mdc-dialog"));
    dialog.open();
  });
}

deletePost();
addPost();
dialogShow();
postList();
