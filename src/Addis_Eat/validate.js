export function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your full name.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must contain at least 2 characters.";
  }

  const phoneRegex = /^(09\d{8}|\+2519\d{8})$/;

  if (!form.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!phoneRegex.test(form.phone.trim())) {
    errors.phone =
      "Enter a valid Ethiopian phone number, such as 0911223344.";
  }

  if (!form.area.trim()) {
    errors.area = "Please enter your delivery area.";
  }

  if (!form.payment) {
    errors.payment = "Please select a payment method.";
  }

  return errors;
}