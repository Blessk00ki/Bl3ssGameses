const { randomBytes } = require('crypto');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '111111';
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/blessk00ki\.github\.io$/,
  /^https:\/\/[a-z0-9-]+\.v0\.build$/,
];

function allowedOrigin(origin) {
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin || '')) ? origin : 'https://blessk00ki.github.io';
}
const MAX_MESSAGES = 200;
const MAX_TEXT_LENGTH = 500;
const MAX_NAME_LENGTH = 24;

const messages = [];
const sessions = new Map();

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin(req.headers.origin));
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
}

function readToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

function cleanName(value) {
  return String(value ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, MAX_NAME_LENGTH);
}

function cleanText(value) {
  return String(value ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, MAX_TEXT_LENGTH);
}

function login(body, res) {
  const name = cleanName(body.name);
  if (!name) {
    res.status(400).json({ error: 'Digite um nome.' });
    return;
  }
  const isAdmin = body.adminPassword === ADMIN_PASSWORD;
  const token = randomBytes(24).toString('hex');
  sessions.set(token, { name, isAdmin });
  res.status(200).json({ token, name, isAdmin });
}

function sendMessage(body, session, res) {
  const text = cleanText(body.text);
  if (!text) {
    res.status(400).json({ error: 'Mensagem vazia.' });
    return;
  }
  messages.push({
    id: randomBytes(8).toString('hex'),
    name: session.name,
    isAdmin: session.isAdmin,
    text,
    sentAt: new Date().toISOString(),
  });
  if (messages.length > MAX_MESSAGES) messages.splice(0, messages.length - MAX_MESSAGES);
  res.status(201).json({ ok: true });
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'POST' && req.body?.action === 'login') {
    login(req.body, res);
    return;
  }

  const session = sessions.get(readToken(req));
  if (!session) {
    res.status(401).json({ error: 'Entre no chat para continuar.' });
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ messages, you: { name: session.name, isAdmin: session.isAdmin } });
    return;
  }

  if (req.method === 'POST' && req.body?.action === 'send') {
    sendMessage(req.body, session, res);
    return;
  }

  res.status(405).json({ error: 'Método não permitido.' });
};
