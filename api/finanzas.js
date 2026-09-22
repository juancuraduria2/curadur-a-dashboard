import jwt from 'jsonwebtoken';

// ============================================
// MÓDULO INGRESOS Y FINANZAS — API
// ============================================
// Acceso exclusivo: juanmontes y luisfernando.
// Almacenamiento: Upstash Redis vía REST (sin dependencias nuevas).
//
// GET    /api/finanzas            → todos los meses registrados
// POST   /api/finanzas            → guarda un mes  { mes: 'AAAA-MM', datos: {...} }
// DELETE /api/finanzas?mes=AAAA-MM → elimina un mes

const USUARIOS_FINANZAS = ['juanmontes', 'luisfernando'];
const CLAVE_INDICE = 'finanzas:meses';
const claveMes = (mes) => `finanzas:mes:${mes}`;
const REGEX_MES = /^\d{4}-(0[1-9]|1[0-2])$/;

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// ============================================
// REDIS (REST)
// ============================================

async function redis(comando) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(comando)
  });
  const data = await r.json();
  if (!r.ok || data.error) {
    throw new Error(data.error || `Redis HTTP ${r.status}`);
  }
  return data.result;
}

// ============================================
// VALIDACIÓN Y LIMPIEZA DE DATOS
// ============================================

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
};

const txt = (v, max = 120) => String(v ?? '').trim().slice(0, max);

const lista = (arr, mapper) =>
  Array.isArray(arr)
    ? arr.slice(0, 200).map(mapper).filter(x => x.nombre || x.concepto || x.valor)
    : [];

function sanitizar(d = {}) {
  const ing = d.ingresos || {};
  return {
    ingresos: {
      variable: num(ing.variable),
      fijo: num(ing.fijo),
      unico: num(ing.unico)
    },
    ivaIncluido: Boolean(d.ivaIncluido),
    nomina: lista(d.nomina, e => ({
      nombre: txt(e?.nombre),
      valor: num(e?.valor)
    })),
    prestaciones: lista(d.prestaciones, e => ({
      concepto: txt(e?.concepto),
      valor: num(e?.valor)
    })),
    proveedores: lista(d.proveedores, e => ({
      nombre: txt(e?.nombre),
      concepto: txt(e?.concepto, 200),
      valor: num(e?.valor)
    })),
    impuestos: lista(d.impuestos, e => ({
      concepto: txt(e?.concepto),
      valor: num(e?.valor)
    })),
    radicados: num(d.radicados),
    expedidos: num(d.expedidos),
    notas: txt(d.notas, 2000)
  };
}

// ============================================
// CONTROL DE ACCESO
// ============================================
// 401 = sin sesión o sesión vencida (el frontend cierra sesión)
// 403 = sesión válida pero sin permiso para Finanzas

function verificarAcceso(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return { status: 401 };
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const username = String(payload.username || '').toLowerCase();
    if (!USUARIOS_FINANZAS.includes(username)) return { status: 403 };
    return { status: 200, username };
  } catch (e) {
    return { status: 401 };
  }
}

// ============================================
// ENDPOINT
// ============================================

export default async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ success: false, error: 'Base de datos no configurada' });
  }

  const acceso = verificarAcceso(req);
  if (acceso.status === 401) {
    return res.status(401).json({ success: false, error: 'No autorizado' });
  }
  if (acceso.status === 403) {
    return res.status(403).json({ success: false, error: 'Acceso restringido' });
  }

  try {
    // ---------- LEER TODOS LOS MESES ----------
    if (req.method === 'GET') {
      const meses = (await redis(['SMEMBERS', CLAVE_INDICE])) || [];
      const validos = meses.filter(m => REGEX_MES.test(m)).sort();
      const registros = {};
      if (validos.length > 0) {
        const valores = await redis(['MGET', ...validos.map(claveMes)]);
        validos.forEach((m, i) => {
          if (valores && valores[i]) {
            try { registros[m] = JSON.parse(valores[i]); } catch (e) { /* ignorar registro dañado */ }
          }
        });
      }
      return res.status(200).json({ success: true, meses: registros });
    }

    // ---------- GUARDAR UN MES ----------
    if (req.method === 'POST') {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; }
      }
      const mes = String(body.mes || '');
      if (!REGEX_MES.test(mes)) {
        return res.status(400).json({ success: false, error: 'Mes inválido (formato AAAA-MM)' });
      }
      const registro = {
        ...sanitizar(body.datos),
        actualizado: new Date().toISOString(),
        actualizadoPor: acceso.username
      };
      await redis(['SET', claveMes(mes), JSON.stringify(registro)]);
      await redis(['SADD', CLAVE_INDICE, mes]);
      return res.status(200).json({ success: true, mes, registro });
    }

    // ---------- ELIMINAR UN MES ----------
    if (req.method === 'DELETE') {
      const mes = String((req.query && req.query.mes) || '');
      if (!REGEX_MES.test(mes)) {
        return res.status(400).json({ success: false, error: 'Mes inválido (formato AAAA-MM)' });
      }
      await redis(['DEL', claveMes(mes)]);
      await redis(['SREM', CLAVE_INDICE, mes]);
      return res.status(200).json({ success: true, mes });
    }

    return res.status(405).json({ success: false, error: 'Método no permitido' });

  } catch (error) {
    console.error('Error en finanzas:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
