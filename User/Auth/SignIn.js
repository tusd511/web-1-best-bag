function SignIn() {


  const emailOrUserNameField = document.getElementById("emailOrUsernameField");
  const passwordField = document.getElementById("password_signin");

  const emailOrUsernameValue = emailOrUserNameField.value;
  const passwordValue = passwordField.value;

  const userEntity = timNguoiDung(emailOrUsernameValue.trim());
  if (userEntity) {
    if (userEntity.password === passwordValue) {
      alert("Login success");
      localStorage.setItem("currentUserId", userEntity.id);
      const loginDialog = document.getElementById("loginDialog");
      loginDialog.close();
    }
  } else {
    alert("Login failed: Username or password is incorrect");

  }
}

function kiemTraInputSignIn() {
  const emailOrUserNameField = document.getElementById("emailOrUsernameField");
  const passwordField = document.getElementById("password_signin");

  if (emailOrUserNameField.value === "") {
    alert("Email or Username is required");
    return false;
  }

  if (passwordField.value === "") {
    alert("Password is required");
    return false;
  }

  return true;
}

window.addEventListener("load", () => {
  taiNguoiDung(() => {

    const signInForm = document.getElementById("signInForm");
    signInForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!kiemTraInputSignIn()) {
        return;
      }
      SignIn();
    });
  })
})
