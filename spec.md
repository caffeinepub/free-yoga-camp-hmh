# Free Yoga Camp HMH

## Current State
- Admission form collects: Name, Mobile, DOB, ID Proof type, Address, ID Proof file, Gmail
- Unique registration code (Yoga#HMH001) generated on submission
- Admin panel at /admin with username/password login
- Admin panel shows all participant details in a table
- Backend has submitAdmission, getAllAdmissions, getTotalAdmissions, getAdmission functions

## Requested Changes (Diff)

### Add
- Backend: `markAttendance(admissionId: Nat, date: Text)` -- marks a participant as present for a given date
- Backend: `getAttendanceByDate(date: Text)` -- returns list of admission IDs present on a date
- Backend: `getAllAttendance()` -- returns all attendance records (admissionId + date pairs)
- Admin panel: Attendance tab/section showing date-wise attendance
- Date selector in admin panel to pick a date and see/mark attendance for that day
- Each participant row shows Present/Absent toggle for selected date
- Admin can mark/unmark attendance per participant per date

### Modify
- Admin panel to add an Attendance section alongside existing Admissions section (tabs or separate card)
- useQueries.ts to add attendance-related hooks

### Remove
- Nothing removed

## Implementation Plan
1. Add attendance storage (Map of (admissionId, date) -> Bool) in backend
2. Add markAttendance, removeAttendance, getAttendanceByDate, getAllAttendance functions in backend
3. Update backend.d.ts with new types and function signatures
4. Add attendance hooks in useQueries.ts
5. Add Attendance tab in AdminPage with date picker and participant list with Present toggle
6. Show attendance summary (how many present on selected date)
