
const dragAndDropSupported = function() {
  var div = document.createElement('div');
  return typeof div.ondrop != 'undefined';
};

const formDataSupported = function() {
  return typeof FormData == 'function';
};

const fileApiSupported = function() {
  var input = document.createElement('input');
  input.type = 'file';
  return typeof input.files != 'undefined';
};

if(dragAndDropSupported() && formDataSupported() && fileApiSupported()) {
  MultiFileUpload = function(params) {
    this.defaultParams = {
      uploadFileEntryHook: $.noop,
      uploadFileExitHook: $.noop,
      uploadFileErrorHook: $.noop,
      fileDeleteHook: $.noop,
      uploadStatusText: 'Uploading files, please wait',
      dropzoneHintText: 'Drag and drop PDF files here or',
      dropzoneButtonText: 'Choose files'
    };

    this.params = $.extend({}, this.defaultParams, params);

    this.params.container.addClass('multi-file-upload--enhanced');

    this.feedbackContainer = this.params.container.find('.multi-file__uploaded-files');
    this.setupFileInput();
    this.setupDropzone();
    this.setupLabel();
    this.setupStatusBox();
    this.params.container.on('click', '.multi-file-upload__delete', $.proxy(this, 'onFileDeleteClick'));
  };

  MultiFileUpload.prototype.setupDropzone = function() {
    this.fileInput.wrap('<div class="multi-file-upload__dropzone" />');
    this.dropzone = this.params.container.find('.multi-file-upload__dropzone');
    this.dropzone.on('dragover', $.proxy(this, 'onDragOver'));
    this.dropzone.on('dragleave', $.proxy(this, 'onDragLeave'));
    this.dropzone.on('drop', $.proxy(this, 'onDrop'));
  };

  MultiFileUpload.prototype.setupLabel = function() {
    this.label = $('<label for="'+this.fileInput[0].id+'" class="govuk-button govuk-button--secondary">'+ this.params.dropzoneButtonText +'</label>');
    this.dropzone.append('<p>' + this.params.dropzoneHintText + '</p>');
    this.dropzone.append(this.label);
  };

  MultiFileUpload.prototype.setupFileInput = function() {
    this.fileInput = this.params.container.find('.multi-file-upload__input');
    this.fileInput.on('change', $.proxy(this, 'onFileChange'));
    this.fileInput.on('focus', $.proxy(this, 'onFileFocus'));
    this.fileInput.on('blur', $.proxy(this, 'onFileBlur'));
  };

  MultiFileUpload.prototype.setupStatusBox = function() {
    this.status = $('<div aria-live="polite" role="status" class="govuk-visually-hidden" />');
    this.dropzone.append(this.status);
  };

  MultiFileUpload.prototype.onDragOver = function(e) {
  	e.preventDefault();
  	this.dropzone.addClass('multi-file-upload--dragover');
  };

  MultiFileUpload.prototype.onDragLeave = function() {
  	this.dropzone.removeClass('multi-file-upload--dragover');
  };

  MultiFileUpload.prototype.onDrop = function(e) {
  	e.preventDefault();
  	this.dropzone.removeClass('multi-file-upload--dragover');
    this.feedbackContainer.removeClass('hidden');
    this.status.html(this.params.uploadStatusText);
  	this.uploadFiles(e.originalEvent.dataTransfer.files);
  };

  MultiFileUpload.prototype.uploadFiles = function(files) {
    for(var i = 0; i < files.length; i++) {
      this.uploadFile(files[i]);
    }
  };

  MultiFileUpload.prototype.onFileChange = function(e) {
    this.feedbackContainer.removeClass('hidden');
    this.status.html(this.params.uploadStatusText);
    this.uploadFiles(e.currentTarget.files);
    this.fileInput.replaceWith($(e.currentTarget).val('').clone(true));
    this.setupFileInput();
    this.fileInput.focus();
  };

  MultiFileUpload.prototype.onFileFocus = function(e) {
    this.label.addClass('multi-file-upload--focused');
  };

  MultiFileUpload.prototype.onFileBlur = function(e) {
    this.label.removeClass('multi-file-upload--focused');
  };

  MultiFileUpload.prototype.getSuccessHtml = function(success) {
    return '<span class="multi-file-upload__success"> <svg class="banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/></svg> ' + success.messageHtml + '</span>';
  };

  MultiFileUpload.prototype.getErrorHtml = function(error) {
    return '<span class="multi-file-upload__error"> <svg class="banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/></svg> '+ error.message +'</span>';
  };

  MultiFileUpload.prototype.getFileRowHtml = function(file) {
    var html = '';
    html += '<div class="govuk-summary-list__row multi-file-upload__row">';
    html += '  <dd class="govuk-summary-list__value multi-file-upload__message">';
    html +=       '<span class="multi-file-upload__filename">'+file.name+'</span>';
    html +=       '<span class="multi-file-upload__progress">0%</span>';
    html += '  </dd>';
    html += '  <dd class="govuk-summary-list__actions multi-file-upload__actions"></dd>';
    html += '</div>';
    return html;
  };

  MultiFileUpload.prototype.getDeleteButtonHtml = function(file) {
    var html = '<button class="multi-file-upload__delete govuk-button govuk-button--secondary govuk-!-margin-bottom-0" type="button" name="delete" value="' + file.filename + '">';
    html += 'Delete <span class="govuk-visually-hidden">' + file.filename + '</span>';
    html += '</button>';
    return html;
  };

  MultiFileUpload.prototype.uploadFile = function(file) {
    this.params.uploadFileEntryHook(this, file);
    var formData = new FormData();
    formData.append('documents', file);
    var item = $(this.getFileRowHtml(file));
    this.feedbackContainer.find('.multi-file-upload__list').append(item);

    $.ajax({
      url: this.params.uploadUrl,
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: $.proxy(function(response){
        if(response.error) {
          item.find('.multi-file-upload__message').html(this.getErrorHtml(response.error));
          this.status.html(response.error.message);
        } else {
          item.find('.multi-file-upload__message').html(this.getSuccessHtml(response));
          this.status.html(response.messageText);
        }
        item.find('.multi-file-upload__actions').append(this.getDeleteButtonHtml(response));
        this.params.uploadFileExitHook(this, file, response);
      }, this),
      error: $.proxy(function(jqXHR, textStatus, errorThrown) {
        this.params.uploadFileErrorHook(this, file, jqXHR, textStatus, errorThrown);
      }, this),
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(e) {
          if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total;
            percentComplete = parseInt(percentComplete * 100, 10);
            item.find('.multi-file-upload__progress').text(' ' + percentComplete + '%');
          }
        }, false);
        return xhr;
      }
    });
  };

  MultiFileUpload.prototype.onFileDeleteClick = function(e) {
    e.preventDefault(); // if user refreshes page and then deletes
    var button = $(e.currentTarget);
    var data = {};
    data[button[0].name] = button[0].value;
    $.ajax({
      url: this.params.deleteUrl,
      type: 'post',
      dataType: 'json',
      data: data,
      success: $.proxy(function(response){
        if(response.error) {
          // handle error
        } else {
          button.parents('.multi-file-upload__row').remove();
          if(this.feedbackContainer.find('.multi-file-upload__row').length === 0) {
            this.feedbackContainer.addClass('hidden');
          }
        }
        this.params.fileDeleteHook(this, response);
      }, this)
    });
  };
}

if(typeof MultiFileUpload !== 'undefined' && $('.multi-file-upload').length) {
  new MultiFileUpload({
    container: $('.multi-file-upload'),
    uploadUrl: '/upload-file-handler',
    deleteUrl: '/upload-file-handler'
  });
}
