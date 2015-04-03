# Data structure

Data structure stored for the platform and operations that are possible according to the role

## Roles

Four non-exclusive roles are defined for the users of the platform:

- Manager: _Super manager of the platform (create users, gives roles, create/update rooms/courses...)_
- Administration: _Administer exam sessions (create exam sessions, exams, build affectation of students...)_
- Teacher: _Manage statements of exam (upload PDF for exams...)_
- Printer: _Manage the printing of copies (generate/download complete PDF...)_

## Data

### Users

- **Data**
    * Serial (CBF)
    * Firstname (Sébastien)
    * Lastname (Combéfis)
    * Roles (["manager", "teacher"])
- **Operations**
    * List users (manager)
    * New/Delete/Update user (manager)

### Rooms

- **Data**
    * ID ("1E10")
    * Name ("Local informatique")
    * Seats (20)
- **Operations**
    * List rooms (manager, admin)
    * New/Delete/Update room (manager)

### Courses

- **Data**
    * ID ("LI4C")
    * Name ("Licenses")
    * Coordinator(s) (["Sébastien Combéfis"])
    * Activities (["LI4T", "LI4L"])
- **Operations**
    * List courses (manager, admin)
    * List my courses (teacher)
    * New/Delete/Update course (manager)

### Activities

- **Data**
    * ID ("LI4T")
    * Name ("Licenses: theory")
    * Teacher(s) (["Sébastien Combéfis", "Alexis Paques"])
    * Weight (10)
- **Operations**
    * List activities (manager, admin)
    * List activities from a course (manager, admin, teacher)
    * New/Delete/Update activity (manager)

### Students

- **Data**
    * Matricule (11226)
    * First_name ("Alexis")
    * Last_name ("Paques")
    * Middle_names ["Martin", "Pierre", "Léopold", "Gérard", "Freddel", "Freddy", "Poro"]
    * Group(s) (["4MEO", "PI"])
- **Operations**
    * List students (manager, admin)
    * New/Delete/Update student (manager)
    * Import students from XLS (manager)

### Exam

- **Data**
    * Activity ("LI4T")
    * Date (20/04/2015)
    * Room ("1E10")
    * Group ("4MEO")
    * Affectation ({"1": 11226, "3": 11152})
- **Operations**
    * List exams (admin)
    * List my exam (teacher)
    * Upload/Preview PDF of statement (teacher)
    * Build/Update affectation (admin)
    * New/Delete/Update exam (admin)
    * Generate PDF with statement (manager, printer)