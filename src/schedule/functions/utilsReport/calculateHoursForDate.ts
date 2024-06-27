import { format, differenceInMinutes } from 'date-fns';

export async function calculateHoursForDate(scheduleRepository: any, workReportService: any, userId: number, date: Date): Promise<void> {
    try {
        const scheduleE = await scheduleRepository.findOne({
            where: { userId: userId, fecha: date, tipo: "entrada" },
        });
        const scheduleS = await scheduleRepository.findOne({
            where: { userId: userId, fecha: date, tipo: "salida" },
        });
        console.log(scheduleE, scheduleS);

        if (scheduleE && scheduleS) {
            console.log("si");

            const horaE = new Date(`1970-01-01T${scheduleE.hora}Z`);
            const horaS = new Date(`1970-01-01T${scheduleS.hora}Z`);

            //const horasFloat = Math.abs((horaS.getTime() - horaE.getTime()) / 36e5).toFixed(2);
            const diffMili = horaS.getTime() - horaE.getTime();
            const diffHours = diffMili / (1000 * 60 * 60);

            const createWorkReportDto = {
                userId,
                dateReport: date,
                hours: diffHours,
                minutes: Math.round(diffMili / (1000 * 60))
            };
            const workReport = await workReportService.createWorkReport(createWorkReportDto);
        }
    } catch (error) {
        console.error(`Error al calcular las horas para la fecha ${date}:`, error);
        throw new Error(`No se pudieron calcular las horas para la fecha ${date}.`);
    }
}