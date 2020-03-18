toastr.options = {
  "closeButton": false, "debug": false, "progressBar": false, "preventDuplicates": false,
  "positionClass": "toast-top-right",
  "onclick": null,
  "hideDuration": "1000", "timeOut": "4000", "extendedTimeOut": "1000",
  "showEasing": "swing", "hideEasing": "linear",
  "showMethod": "fadeIn", "hideMethod": "fadeOut"
};
function _showMessage(msg, title, type, dlg) {
  if (dlg) {
    swal({ title: title, type: type, text: msg });
    return;
  }
  if (type === undefined || type === null || type === '' || type === 'info') {
    toastr.info(msg, title);
  } else 
  if (type == 'success') toastr.success(msg, title); else
  if (type == 'warning') toastr.warning(msg, title); else
  if (type == 'error') toastr.error(msg, title); else toastr.info(msg, title);
}
function _showInfo(msg, title, dlg, f) {
  if (!title) title = "Informazioni";
  if (dlg) {
    swal({ title: title, text: msg }, f);
  }
  else {
    toastr.info(msg, title);
  }
}
function _showSuccess(msg, title, dlg) {
  if (!title) title = "Informazioni";
  if (dlg) {
    swal({ title: title, type: "success", text: msg });
  }
  else {
    toastr.success(msg, title);
  }
}
function _showWarning(msg, title, dlg) {
  if (!title) title = "Attenzione";
  if (dlg) {
    swal({ title: title, type: "warning", text: msg });
  }
  else {
    toastr.warning(msg, title);
  }
}
function _showError(msg, title, dlg) {
  if (!title) title = "Errore";
  if (dlg) {
    swal({ title: title, type: "error", text: msg });
  }
  else {
    toastr.error(msg, title);
  }
}
function _confirm(msg, f) {
  if (typeof f === 'function') {
    swal({ title: "Conferma", type: "warning", text: msg, confirmButtonText: "Si", cancelButtonText: "No", confirmButtonColor: "#dd6b55", showCancelButton: true, closeOnConfirm: true, closeOnCancel: true }, f);
  }
  else {
    return window.confirm(msg);
  }
}
function _getInput(msg, f, d) {
  if (typeof f === 'function') {
    swal({ title: "Inserisci", type: "input", inputValue: d, text: msg, showCancelButton: true }, f);
  }
  else {
    return window.prompt(msg);
  }
}
