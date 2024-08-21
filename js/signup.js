import JustValidate from 'just-validate';
import React from "react"
import ReactDom from "react-dom/client"

const root = ReactDom.createRoot(document.getElementById("signupSheet"));
root.render(<p>Hello WOrld!</p>)

const validation = new JustValidate("#signUp");

console.log("fuck you")

validation
  .addField("#firstName", [
    {
      rule: "required"
    }
  ])
  .addField("#lastName", [
    {
      rule: "required"
    }
  ])
  .addField("#email", [
    {
      rule: "required"
    },
    {
      rule: "email"
    }
  ])
  .addField("#passWord", [
    {
      rule: "required"
    }, 
    {
      rule: "password"
    }
  ])
  .addField("#confirm_password", [
    {
      validator: (value, fields) => {
        return value === fields["passWord"].elem.value;
      },
      errorMessage: "Passwords should match"

    }
  ])
  .onSuccess((event) => {
    document.getElementById("signup").submit();
  });