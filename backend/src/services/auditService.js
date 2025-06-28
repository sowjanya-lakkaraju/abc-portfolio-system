
class AuditService {
  constructor(prisma, logger) {
    this.prisma = prisma;
    this.logger = logger;
  }

  /**
   * Log user action for audit trail
   */
  async logAction(userId, action, startTime, endTime) {
    try {
      await this.prisma.auditAction.create({
        data: {
          userLoginDetailId: userId,
          userAction: action,
          startDateTime: new Date(startTime),
          endDateTime: new Date(endTime)
        }
      });
    } catch (error) {
      this.logger.error('Failed to log audit action', error);
    }
  }
}

export default AuditService;