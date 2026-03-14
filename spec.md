# Free Yoga Camp HMH

## Current State
Admin panel has two tabs: Admissions (table of all participants) and Attendance (date-wise attendance marking). No download/export functionality exists.

## Requested Changes (Diff)

### Add
- "Admission List Download" button in Admissions tab header -- downloads CSV with fields: Sr. No., Reg. Code, Name, Mobile, DOB, Address, Occupation, Submitted At
- "Attendance Sheet Download" button in Attendance tab -- downloads CSV with all participants and their attendance status (Present/Absent) for the currently selected date

### Modify
- AdminPage: Add CSV download utility functions and buttons in both tabs

### Remove
- Nothing

## Implementation Plan
1. Add `downloadCSV(filename, rows)` utility function in AdminPage
2. Add `downloadAdmissionCSV(admissions)` function that builds admission list CSV
3. Add `downloadAttendanceCSV(admissions, presentSet, date)` function that builds attendance CSV
4. Add Download button in Admissions tab card header (next to title)
5. Add Download button in Attendance tab (next to date selector area)
