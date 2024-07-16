// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments  } from './api';

const apiUrl = 'https://ec2-54-172-24-25.compute-1.amazonaws.com';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  
  const postBtn = document.querySelector('#post');


  
  // Do an authenticated request to the fragments API server and log the result
  
  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  

  
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }
  const userFragments = await getUserFragments(user);

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  
  // Post button
  postBtn.onclick = async() => {
    console.log('POST fragments data...');
    console.log('POSTing: ' + document.querySelector('#textfield').value);
    try {
      const res = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        body: document.querySelector('#textfield').value,
        // Generate headers with the proper Authorization bearer token to pass
        headers: {
          Authorization: user.authorizationHeaders().Authorization,
          "Content-Type" : "text/plain",
        }
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Posted user fragments data', { data });
    } catch (err) {
      console.error('Unable to POST to /v1/fragment', { err });
    }
  }
  postMdBtn.onclick = async() => {
    console.log('POST fragments data...');
    console.log('POSTing: ' + document.querySelector('#textfield').value);
    try {
      const res = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        body: document.querySelector('#textfield').value,
        // Generate headers with the proper Authorization bearer token to pass
        headers: {
          Authorization: user.authorizationHeaders().Authorization,
          "Content-Type" : "text/markdown",
        }
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Posted user fragments data', { data });
    } catch (err) {
      console.error('Unable to POST to /v1/fragment', { err });
    }
  }
  postHtmlBtn.onclick = async() => {
    console.log('POST fragments data...');
    console.log('POSTing: ' + document.querySelector('#textfield').value);
    try {
      const res = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        body: document.querySelector('#textfield').value,
        // Generate headers with the proper Authorization bearer token to pass
        headers: {
          Authorization: user.authorizationHeaders().Authorization,
          "Content-Type" : "text/html",
        }
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Posted user fragments data', { data });
    } catch (err) {
      console.error('Unable to POST to /v1/fragment', { err });
    }
  }

  postJsonBtn.onclick = async() => {
    console.log('POST fragments data...');
    console.log('POSTing: ' + document.querySelector('#textfield').value);
    try {
      const res = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        body: document.querySelector('#textfield').value,
        // Generate headers with the proper Authorization bearer token to pass
        headers: {
          Authorization: user.authorizationHeaders().Authorization,
          "Content-Type" : "application/json",
        }
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Posted user fragments data', { data });
    } catch (err) {
      console.error('Unable to POST to /v1/fragment', { err });
    }
  }

  console.log(postBtn)



}

// Wait for the DOM to be ready, then start the app
document.addEventListener('DOMContentLoaded', init);