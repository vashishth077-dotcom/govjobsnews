# GovJobsNews

## Current State
Blank project with empty Motoko backend and no frontend UI.

## Requested Changes (Diff)

### Add
- Government job listings with title, department, organization, qualification, vacancies, last date, category, and link to official website
- Exam results listings with title, exam board, result date, and link to official result page
- Admit card / hall ticket listings with exam name, board, download link
- Latest notifications/news feed with title, date, and external link
- Admin panel to add/edit/delete jobs, results, notifications, and admit cards
- Public-facing homepage with categorized sections: Latest Jobs, Results, Admit Cards, Important Notifications
- Search and filter by category/department
- Each job/result card links out to the official government website

### Modify
- Backend: populate with real data model for jobs, results, admit cards, notifications

### Remove
- Nothing

## Implementation Plan
1. Backend: Define data types for Job, Result, AdmitCard, Notification. CRUD operations for each. Stable storage.
2. Frontend: Homepage with tabbed/sectioned layout. Cards per item type with external official links. Admin section protected by simple key or authorization. Search/filter UI.
