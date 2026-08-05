// Gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Erreur interne du serveur";

  // Erreur de validation Mongoose

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Erreur de validation";

    return res.status(statusCode).json({
      success: false,
      message,
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  //ID MongoDB invalide

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Identifiant invalide.";
  }

  // Erreur de clé unique (email déjà utilisé, etc.)
   
  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} existe déjà.`;
  }

  //Erreur JWT
    
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Jeton invalide.";
  }
// JWT expiré

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Jeton expiré.";
  }

  
   //Erreur Multer
  
  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;