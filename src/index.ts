import app from './app.js';
import  env  from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import { logger } from './config/logger.js';
 
async function startServer() {
  await connectDB();

  const cors= env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

  logger.info(`✅ ✅ ✅ ✅ ✅ ✅ CORS autorisé pour les origines : ${cors.join(', ')}`);
 
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`🚀 Serveur démarré sur le port ${env.PORT}`);
    logger.info(`📚 Swagger disponible sur /api-docs`);
  });
 
  const shutdown = async (signal: string) => {
    logger.info(`${signal} reçu, arrêt propre en cours...`);
    server.close(async () => {
      await disconnectDB();
      logger.info('Arrêt terminé.');
      process.exit(0);
    });
 
   
    setTimeout(() => process.exit(1), 10_000).unref();
  };
 
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Promesse rejetée non gérée');
  });
}
 
startServer();