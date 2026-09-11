export const estadosLegibles = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  listo: 'Listo para retirar',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  no_retirado: 'No retirado'
};

export const tiposTrabajoLegibles = {
  impresion: 'Impresión',
  fotocopiado: 'Fotocopiado',
  encuadernado: 'Encuadernado'
};

export const colorLegible = {
  blanco_y_negro: 'Blanco y negro',
  color: 'Color'
};

export function formatearEstado(estado) {
  return estadosLegibles[estado] || estado;
}

export function formatearTipoTrabajo(tipo) {
  return tiposTrabajoLegibles[tipo] || tipo;
}

export function formatearColor(color) {
  return colorLegible[color] || color;
}

export const estadosDeudaLegibles = {
  pendiente: 'Pendiente',
  pagada: 'Pagada'
};

export function formatearEstadoDeuda(estado) {
  return estadosDeudaLegibles[estado] || estado;
}

export function urlArchivo(rutaArchivo) {
  const rutaLimpia = rutaArchivo.replace(/\\/g, '/');
  return encodeURI(`http://localhost:3000/${rutaLimpia}`);
}