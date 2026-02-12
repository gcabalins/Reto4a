const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const SALT_ROUNDS = 10;

async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const existing = userModel.findByUsername(username);
  if (existing) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = userModel.createUser(username, hash);
    req.session.userId = userId;
    res.status(201).json({ message: 'Usuario registrado', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const user = userModel.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  req.session.userId = user.id;
  res.json({ message: 'Login correcto' });
}

function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout correcto' });
  });
}

function me(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, userId: req.session.userId });
}

module.exports = {
  register,
  login,
  logout,
  me
};
