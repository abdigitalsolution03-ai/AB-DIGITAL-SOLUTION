import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { checkIn, checkOut, breakStart, breakEnd, getTodayAttendance, getAttendanceReport, getAttendanceCalendar } from '../controllers/attendanceController';

const router = Router();

router.use(authenticate);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.post('/break-start', breakStart);
router.post('/break-end', breakEnd);
router.get('/today', getTodayAttendance);
router.get('/report', authorize('super_admin', 'hr_manager'), getAttendanceReport);
router.get('/calendar', authorize('super_admin', 'hr_manager'), getAttendanceCalendar);

export default router;
