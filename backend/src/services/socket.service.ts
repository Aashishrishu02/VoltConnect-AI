import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';

let io: SocketIOServer | null = null;

export function initSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`⚡ Socket Client Connected: ${socket.id}`);

    socket.on('join_charger', (chargerId: string) => {
      socket.join(`charger_${chargerId}`);
      logger.info(`Socket ${socket.id} joined charger room: charger_${chargerId}`);
    });

    socket.on('join_user', (userId: string) => {
      socket.join(`user_${userId}`);
      logger.info(`Socket ${socket.id} joined user room: user_${userId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function emitChargerUpdate(chargerId: string, data: any) {
  if (io) {
    io.to(`charger_${chargerId}`).emit('charger_status_changed', data);
  }
}

export function emitUserNotification(userId: string, notification: any) {
  if (io) {
    io.to(`user_${userId}`).emit('notification_received', notification);
  }
}
