export async function findReportRangeUserID(repository: any, userId: number, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    try {
      const reports = await repository.find({ where: { userId}})
      const reportsInRange = [];
      for (const report of reports) {
        const reportDate = new Date(report.dateReport);
        if (reportDate >= start && reportDate <= end) {
          reportsInRange.push(report);
        }
      }
      return reportsInRange;
    } catch (error) {
      console.error('Error al consultar el rango de reportes:', error);
      throw new Error('Error al consultar el rango de reportes');
    }
}