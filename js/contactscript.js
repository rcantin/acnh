$(function() {
  $("#documentlocation").val(document.location);

  // $("#contactForm").on("submit", function(e) {
  //   e.preventDefault();

  //   if ($("#website").val()) {
  //     var response = prompt('There was an indicator that you might be a spam bot.  If you are not a spam bot, type the word "Human" in the field below and press OK.');
  //     if (response == "HUMAN" || response == "human" || response == "Human" || response == "hUMAN") {
  //       checkMessageLinks();
  //     } else {
  //       alert("Still seems you are a spam bot.  Action cancelled.");
  //     }
  //   } else {
  //     checkMessageLinks();
  //   }
  // });

  // function checkMessageLinks() {
  //   var $message = $("#contactmessage").val();
  //   if (~$message.indexOf("http") || ~$message.indexOf("://") || ~$message.indexOf("www.")) {
  //     alert("In order to protect against spam, we do not allow links to be submitted from the website.  Please remove the link from the message and try again.");
  //   } else {
  //     submitContactForm();
  //   }
  // }

  // function submitContactForm() {
  //   var form = $("#contactForm");
  //   var responsepanel = $("#responsepanel");
  //   var post_data = form.serialize();
  //   $.ajax({
  //     type: "POST",
  //     url: "contactsend.php",
  //     data: post_data,
  //     success: function(msg) {
  //       // responsepanel.html(msg);
  //       $(form).fadeOut(500, function() {
  //         form.html(msg).fadeIn();
  //       });
  //     }
  //   });
  // }

  // ========================================================================

  const contactForm = $("#contactForm");
  const contactname = $("#contactname");
  const contactemail = $("#contactemail");
  const contactmessage = $("#contactmessage");

  function validateField(event) {
    // console.log(event);
    let elem = event.data[0];
    let validationbox = elem.parentElement.querySelector(".validation-container");
    if (!elem.value) {
      event.currentTarget.classList.add("border-danger");
      validationbox.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i>Required';
      return false;
    } else {
      event.currentTarget.classList.remove("border-danger");
      validationbox.innerHTML = "*";
      return true;
    }
  }

  function messageLinkFree() {
    var $message = $("#contactmessage").val();
    if (~$message.indexOf("http") || ~$message.indexOf("://") || ~$message.indexOf("www.")) {
      alert("In order to protect against spam, we do not allow links to be submitted from the website.  Please remove the link from the message and try again.");
      return false;
    } else {
      return true;
    }
  }

  function checkHoneypotEmpty() {
    if ($("#website").val()) {
      var response = prompt('There was an indicator that you might be a spam bot.  If you are not a spam bot, type the word "Human" in the field below and press OK.');
      if (response == "HUMAN" || response == "human" || response == "Human" || response == "hUMAN") {
        return true;
      } else {
        alert("Still seems you are a spam bot.  Action cancelled.");
        return false;
      }
    } else {
      return true;
    }
  }

  function submitContactForm(event) {
    event.preventDefault();

    if (!messageLinkFree()) {
      return;
    }

    if (checkHoneypotEmpty()) {
      let failed = 0;
      let fields = event.data;
      for (let i = 0; i < fields.length; i++) {
        let fld = fields[i][0];
        let validationbox = fld.parentElement.querySelector(".validation-container");
        if (!fld.value) {
          failed++;
          fld.classList.add("border-danger");
          validationbox.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i>Required';
        } else {
          fld.classList.remove("border-danger");
          validationbox.innerHTML = "*";
        }
      }
      if (failed == 0) {
        var responsepanel = $("#responsepanel");
        var post_data = contactForm.serialize();
        console.log("--- SUBMITTING...");
        $.ajax({
          type: "POST",
          url: "contactsend.php",
          data: post_data,
          success: function(msg) {
            contactForm.fadeOut(500, function() {
              responsepanel.html(msg).fadeIn();
            });
          }
        });
      }
    }
  }

  contactname.on("blur input", contactname, validateField);
  contactemail.on("blur input", contactemail, validateField);
  contactmessage.on("blur input", contactmessage, validateField);

  contactForm.on("submit", [contactname, contactemail, contactmessage], submitContactForm);

  // ========================================================================
});
