$(document).ready(function () {

    //function to post a note to server
    function sendNote(element) {
      let note = {};
      note.articleId = $(element).attr('data-id'),
      note.title = $('#noteTitleEntry').val().trim();
      note.body = $('#noteBodyEntry').val().trim();
      if (note.title && note.body){
        $.ajax({
          url: '/notes/createNote',
          type: 'POST',
          data: note,
          success: function (response){
            showNote(response, note.articleId);
            $('#noteBodyEntry, #noteTitleEntry').val('');
          },
          error: function (error) {
            showErrorModal(error);
          }
        });
      }
    }
  
  
    //function to display error modal on ajax error
    function showErrorModal(error) {
      $('#error').modal('show');
    }
  
  
    //function to display notes in notemodal
    function showNote(element, articleId){
      let $title = $('<p>')
        .text(element.title)
        .addClass('noteTitle');
      let $deleteButton = $('<button class="btn btn-danger">')
        .text('X')
        .addClass('deleteNote');
      let $note = $('<div>')
        .append($title,$deleteButton)
        .attr('data-note-id', element._id)
        .attr('data-article-id', articleId)
        .addClass('note')
        .appendTo('#noteArea');
    }
  
    //number of scraped articles modal
    $('#alertModal').on('hide.bs.modal', function (e) {
      window.location.href = '/';
    });
  
    //click event to scrape new articles
    $('#scrape').on('click', function (e){
      e.preventDefault();
      $.ajax({
        url: '/scrape',
        type: 'GET',
        success: function (response) {
          $('#numArticles').text(response.count);
        },
        error: function (error) {
          showErrorModal(error);
        },
        complete: function (result){
          $('#alertModal').modal('show');
        }
      });
    });
  
    //click event to save an article
    $(document).on('click', '#saveArticle', function (e) {
      let articleId = $(this).data('id');
      $.ajax({
        url: '/articles/save/'+articleId,
        type: 'GET',
        success: function (response) {
          window.location.href = '/';
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    //click event to open note modal and populate with notes
    $('.addNote').on('click', function (e){
      $('#noteArea').empty();
      $('#noteTitleEntry, #noteBodyEntry').val('');
      let id = $(this).data('id');
      $("#addNoteHeader").text("Note for Article: "+id);
      $('#saveNote, #noteBodyEntry').attr('data-id', id);
      $.ajax({
        url: '/notes/getNotes/'+id,
        type: 'GET',
        success: function (data){
          $.each(data.notes, function (i, item){
            showNote(item, id);
          });
          $('#noteModal').modal('show');
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    //click event to create a note
    $('#saveNote').on('click', function (e) {
      e.preventDefault();
      sendNote($(this));
    });
  
    //keypress event to allow user to save note with enter key
    $('#noteBodyEntry').on('keypress', function (e) {
      if(e.keyCode === 13){
        sendNote($(this));
      }
    });//end of #noteBodyEntry keypress(enter) event
  
    //click event to delete an article from savedArticles
    $('.deleteArticle').on('click', function (e){
      e.preventDefault();
      let id = $(this).data('id');
      $.ajax({
        url: '/articles/deleteArticle/'+id,
        type: 'DELETE',
        success: function (response) {
          window.location.href = '/articles/viewSaved';
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    //click event to delete a note from a saved article
    $(document).on('click', '.deleteNote', function (e){
      e.stopPropagation();
      let thisItem = $(this);
      let ids= {
        noteId: $(this).parent().data('note-id'),
        articleId: $(this).parent().data('article-id')
      };
  
      $.ajax({
        url: '/notes/deleteNote',
        type: 'POST',
        data: ids,
        success: function (response) {
          thisItem.parent().remove();
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    //click event to retrieve the title and body of a single note
    //and populate the note modal inputs with it
    $(document).on('click', '.note', function (e){
      e.stopPropagation();
      let id = $(this).data('note-id');
      $.ajax({
        url: '/notes/getSingleNote/'+id,
        type: 'GET',
        success: function (note) {
          $('#noteTitleEntry').val(note.title);
          $('#noteBodyEntry').val(note.body);
        },
        error: function (error) {
          console.log(error);
          showErrorModal(error);
        }
      });
    }); 
  
  });