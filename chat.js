(function () {
  'use strict';

  const CHAT_API = 'https://bl3ssgameses-chat.vercel.app/api/chat';
  const POLL_MS = 4000;

  const loginForm = document.getElementById('chat-login');
  const room = document.getElementById('chat-room');
  const loginError = document.getElementById('chat-error');
  const log = document.getElementById('chat-log');
  const sendForm = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  // O token existe só nesta variável: recarregar a página ou fechá-la encerra a sessão.
  let token = '';
  let timer = 0;

  async function callChat(method, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(CHAT_API, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Não foi possível falar com o chat.');
    return data;
  }

  function renderMessages(messages) {
    log.replaceChildren(...messages.map(message => {
      const item = document.createElement('li');
      const author = document.createElement('strong');
      author.textContent = message.isAdmin ? `${message.name} (admin)` : message.name;
      const text = document.createElement('span');
      text.textContent = message.text;
      item.append(author, ' ', text);
      return item;
    }));
    log.scrollTop = log.scrollHeight;
  }

  function endSession(message) {
    clearInterval(timer);
    token = '';
    room.hidden = true;
    loginForm.hidden = false;
    loginError.textContent = message;
  }

  async function refreshMessages() {
    try {
      const data = await callChat('GET');
      renderMessages(data.messages);
    } catch (error) {
      endSession(error.message);
    }
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(loginForm);
    loginError.textContent = '';
    try {
      const data = await callChat('POST', {
        action: 'login',
        name: form.get('name'),
        adminPassword: form.get('adminPassword'),
      });
      token = data.token;
      loginForm.reset();
      loginForm.hidden = true;
      room.hidden = false;
      await refreshMessages();
      timer = setInterval(refreshMessages, POLL_MS);
      input.focus();
    } catch (error) {
      loginError.textContent = error.message;
    }
  });

  sendForm.addEventListener('submit', async event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    try {
      await callChat('POST', { action: 'send', text });
      input.value = '';
      await refreshMessages();
    } catch (error) {
      endSession(error.message);
    }
  });
})();
