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

export function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export const tamanosLegibles = {
  A4: 'A4',
  A3: 'A3',
  oficio: 'Oficio',
  carta: 'Carta'
};

export const fazLegible = {
  simple: 'Simple',
  doble: 'Doble'
};

export function formatearTamano(tamano) {
  return tamanosLegibles[tamano] || tamano;
}

export function formatearFaz(faz) {
  return fazLegible[faz] || faz;
}

export function formatearFechaHora(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${dia} ${hora} hs`;
}