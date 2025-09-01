/**
 * Utilidad para respuestas estándar de la API
 */
export const successResponse = (res, data, message = "Operación exitosa") => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = "Error en la operación", status = 400) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
