import { Repository } from 'typeorm';
import { DailyReportForAll} from 'src/workReport/entity/dailyReport.entity';
import { WorkReport } from 'src/workReport/entity/workReport.entity';

export async function calculateDailyHours(dailyReportForAllRepository: Repository<DailyReportForAll>, workReportRepository: Repository<WorkReport> ): Promise<void> {
  console.log("Calculando horas diarias");
  try {
    await dailyReportForAllRepository.clear();
    const query = `
      SELECT dateReport, SUM(hours) as totalHours, SUM(minutes) as totalMinutes
      FROM work_report
      GROUP BY dateReport
    `;
    const reports = await workReportRepository.query(query);
    console.log('Resultados obtenidos:', reports);

    for (const report of reports) {
      const newDailyReport = new DailyReportForAll();
      newDailyReport.dateReport = report.dateReport;
      newDailyReport.hours = report.totalHours;
      newDailyReport.minutes = report.totalMinutes;
      await dailyReportForAllRepository.save(newDailyReport);
      console.log(`Reporte diario creado para la fecha ${report.dateReport}: ${report.totalHours} horas`);
    }
    console.log('Cálculo de horas diarias completado');
  } catch (error) {
    console.error('Error al calcular las horas diarias:', error);
    throw new Error('No se pudieron calcular las horas diarias.');
  }
}