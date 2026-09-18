import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ============================================
// CATÁLOGO DE USUARIOS Y ROLES
// ============================================
// Los técnicos tienen 'tecnicoNombre' para saber a qué vista personal deben entrar.
// Los admins y valentina no tienen ese campo porque no son técnicos operativos.

const USUARIOS = {
  // Admins - acceso total
  'juanmontes': {
    passwordEnv: 'PASSWORD_JUANMONTES',
    nombre: 'Juan Montes',
    rol: 'admin'
  },
  'luisfernando': {
    passwordEnv: 'PASSWORD_LUISFERNANDO',
    nombre: 'Luis Fernando Montes',
    rol: 'admin'
  },

  // Control de términos - menú restringido pero puede ver a todos los técnicos
  'valentina': {
    passwordEnv: 'PASSWORD_VALENTINA',
    nombre: 'Valentina Gonzalez',
    rol: 'control'
  },

  // Técnicos - solo pueden ver su propia vista personal
  'adriana': {
    passwordEnv: 'PASSWORD_ADRIANA',
    nombre: 'Adriana Marulanda',
    rol: 'tecnico',
    tecnicoNombre: 'Adriana Marulanda'
  },
  'dianauribe': {
    passwordEnv: 'PASSWORD_DIANAURIBE',
    nombre: 'Diana Uribe',
    rol: 'tecnico',
    tecnicoNombre: 'Diana Uribe'
  },
  'lauraarandia': {
    passwordEnv: 'PASSWORD_LAURAARANDIA',
    nombre: 'Laura Arandia',
    rol: 'tecnico',
    tecnicoNombre: 'Laura Arandia'
  },
  'camilamarulanda': {
    passwordEnv: 'PASSWORD_CAMILAMARULANDA',
    nombre: 'Camila Marulanda',
    rol: 'tecnico',
    tecnicoNombre: 'Camila Marulanda'
  },
  'mariapaula': {
    passwordEnv: 'PASSWORD_MARIAPAULA',
    nombre: 'Maria Paula Montes',
    rol: 'tecnico',
    tecnicoNombre: 'Maria Paula Montes'
  },
  'alejandra': {
    passwordEnv: 'PASSWORD_ALEJANDRA',
    nombre: 'Alejandra Calderon',
    rol: 'tecnico',
    tecnicoNombre: 'Alejandra Calderon'
  },
  'camilorodriguez': {
    passwordEnv: 'PASSWORD_CAMILORODRIGUEZ',
    nombre: 'Camilo Rodriguez',
    rol: 'tecnico',
    tecnicoNombre: 'Camilo Rodriguez'
  },
  'jorgeobed': {
    passwordEnv: 'PASSWORD_JORGEOBED',
    nombre: 'Jorge Obed',
    rol: 'tecnico',
    tecnicoNombre: 'Jorge Obed'
  }
};

// ============================================
// ENDPOINT DE LOGIN
// ============================================

export default async (req, res) => {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  try {
    const { usuario, password, recordarme } = req.body || {};

    // Validación básica
    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    const usuarioLower = String(usuario).toLowerCase().trim();

    // Verificar contraseña de emergencia (solo para juanmontes)
    const emergencyPassword = process.env.PASSWORD_EMERGENCY;
    if (usuarioLower === 'juanmontes' && emergencyPassword && password === emergencyPassword) {
      const userData = USUARIOS['juanmontes'];
      const token = generarToken(userData, 'juanmontes', recordarme);
      return res.status(200).json({
        success: true,
        token,
        usuario: {
          username: 'juanmontes',
          nombre: userData.nombre,
          rol: userData.rol,
          tecnicoNombre: userData.tecnicoNombre || null,
          emergencia: true
        }
      });
    }

    // Buscar usuario en catálogo
    const userData = USUARIOS[usuarioLower];
    if (!userData) {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos'
      });
    }

    // Obtener contraseña esperada desde variable de entorno
    const expectedPassword = process.env[userData.passwordEnv];
    if (!expectedPassword) {
      console.error(`Variable de entorno faltante: ${userData.passwordEnv}`);
      return res.status(500).json({
        success: false,
        error: 'Error de configuración del servidor'
      });
    }

    // Comparar contraseñas (texto plano, comparación segura contra timing attacks)
    if (!comparacionSegura(password, expectedPassword)) {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = generarToken(userData, usuarioLower, recordarme);

    return res.status(200).json({
      success: true,
      token,
      usuario: {
        username: usuarioLower,
        nombre: userData.nombre,
        rol: userData.rol,
        tecnicoNombre: userData.tecnicoNombre || null,
        emergencia: false
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// ============================================
// HELPERS
// ============================================

function generarToken(userData, username, recordarme) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no configurado');
  }

  const expiryDays = parseInt(process.env.JWT_EXPIRY_DAYS || '30', 10);
  const expiresIn = recordarme ? `${expiryDays}d` : '12h';

  return jwt.sign(
    {
      username,
      nombre: userData.nombre,
      rol: userData.rol,
      tecnicoNombre: userData.tecnicoNombre || null
    },
    secret,
    { expiresIn }
  );
}

// Comparación segura contra timing attacks
function comparacionSegura(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
