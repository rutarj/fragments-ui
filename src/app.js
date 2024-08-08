console.log('Hello world!');

// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postTpBtn = document.querySelector('#textPlainBtn');
  const postMdBtn = document.querySelector('#textMdBtn');
  const postHtmlBtn = document.querySelector('#textHtmlBtn');
  const postJsonBtn = document.querySelector('#applicationJsonBtn');
  const putBtn = document.querySelector('#putBtn');
  const delBtn = document.querySelector('#delBtn');
  const expandBtn = document.querySelector('#expand');
  const expandBtn2 = document.querySelector('#expand2');
  const imgUploadInput = document.querySelector("#imageFile");
  const apiUrl = process.env.API_URL || 'http://localhost:8080';

  // Get the user
  const user = await getUser();

  // Wire up event handlers to deal with login and logout.
  if (loginBtn) {
    loginBtn.onclick = () => {
      Auth.federatedSignIn();
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      Auth.signOut();
    };
  }

  if (!user) {
    if (logoutBtn) logoutBtn.disabled = true;
    return;
  }

  console.log({ user });
  if (userSection) {
    userSection.hidden = false;
    userSection.querySelector('.username').innerText = user.username;
  }
  if (loginBtn) loginBtn.disabled = true;
  await getUserFragments(user);

  const postFragment = async (contentType) => {
    try {
      const res = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        body: document.querySelector('#textfield').value,
        headers: {
          Authorization: user.authorizationHeaders().Authorization,
          "Content-Type": contentType,
        }
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Posted user fragments data', { data });
    } catch (err) {
      console.error('Unable to POST to /v1/fragment', { err });
    }
  };

  if (postTpBtn) postTpBtn.onclick = () => postFragment("text/plain");
  if (postMdBtn) postMdBtn.onclick = () => postFragment("text/markdown");
  if (postHtmlBtn) postHtmlBtn.onclick = () => postFragment("text/html");
  if (postJsonBtn) postJsonBtn.onclick = () => postFragment("application/json");

  const imgUpload = async (event) => {
    for (const file of event.target.files) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (event) => {
        try {
          const res = await fetch(`${apiUrl}/v1/fragments`, {
            method: "POST",
            body: event.target.result,
            headers: {
              Authorization: user.authorizationHeaders().Authorization,
              "Content-Type": file.type,
            }
          });
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          const data = await res.json();
          console.log('Posted user fragments data', { data });
        } catch (err) {
          console.error('Unable to POST image to /v1/fragment', { err });
        }
      };
    }
  };

  if (imgUploadInput) {
    imgUploadInput.addEventListener("change", imgUpload);
  }

  const fetchFragments = async (expand, urlSuffix = "") => {
    try {
      const res = await fetch(`${apiUrl}/v1/fragments${expand ? '?expand=1' : ''}`, {
        headers: user.authorizationHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Got user fragments data', { data });
      const displayFragments = document.getElementById("displayFragments");
      if (displayFragments) {
        displayFragments.innerHTML = "";
        for (const fragment of data.fragments) {
          try {
            const res = await fetch(`${apiUrl}/v1/fragments/${fragment.id}${urlSuffix}`, {
              headers: user.authorizationHeaders(),
            });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const content = fragment.type.startsWith("text") || fragment.type.startsWith("application") ? await res.text() : await res.arrayBuffer();
            const element = document.createElement("div");
            element.innerHTML = `
              <hr>
              <div>Fragment id: ${fragment.id}</div>
              <br>
              ${fragment.type.startsWith("text") || fragment.type.startsWith("application") ? content : `<img src="${URL.createObjectURL(new Blob([content], { type: fragment.type }))}" alt="${fragment.id}">`}
            `;
            displayFragments.appendChild(element);
          } catch (err) {
            console.error("Unable to call GET /v1/fragments/:id", { err });
          }
        }
      }
    } catch (err) {
      console.error('Unable to call GET /v1/fragment', { err });
    }
  };

  if (expandBtn) expandBtn.onclick = () => fetchFragments(true);
  if (expandBtn2) expandBtn2.onclick = () => fetchFragments(true, '/info');

  if (putBtn) {
    putBtn.onclick = async () => {
      const modId = document.querySelector('#fragId').value;
      try {
        const res = await fetch(`${apiUrl}/v1/fragments/${modId}`, {
          method: "PUT",
          body: document.querySelector('#textfield2').value,
          headers: {
            Authorization: user.authorizationHeaders().Authorization,
          }
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('PUT user fragments data', { data });
      } catch (err) {
        console.error('Unable to PUT to /v1/fragment', { err });
      }
    };
  }

  if (delBtn) {
    delBtn.onclick = async () => {
      const modId = document.querySelector('#fragId').value;
      try {
        const res = await fetch(`${apiUrl}/v1/fragments/${modId}`, {
          method: "DELETE",
          headers: {
            Authorization: user.authorizationHeaders().Authorization,
          }
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('DELETE user fragments data', { data });
      } catch (err) {
        console.error('Unable to DELETE to /v1/fragment', { err });
      }
    };
  }
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
