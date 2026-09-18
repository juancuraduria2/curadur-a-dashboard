import jwt from 'jsonwebtoken';

// ============================================
// ENDPOINT DE VERIFICACIÓN DE SESIÓN
// ============================================
// El frontend llama este endpoint cada vez que arranca la app
// para saber si el token guardado sigue siendo válido.
// Devuelve los datos del usuario si el token es válido,
// o error 401 si no lo es (expirado, inválido, o ausente).

export default async (req, res) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    // Verificar firma y expiración
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET no configurado');
      return res.status(500).json({
        success: false,
        error: 'Error de configuración del servidor'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Sesión expirada',
          reason: 'expired'
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        reason: 'invalid'
      });
    }

    // Token válido: devolver datos del usuario
    return res.status(200).json({
      success: true,
      usuario: {
        username: decoded.username,
        nombre: decoded.nombre,
        rol: decoded.rol,
        tecnicoNombre: decoded.tecnicoNombre || null
      }
    });

  } catch (error) {
    console.error('Error en auth-me:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
