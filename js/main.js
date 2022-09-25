// ************** CALLING ALL ITEMS **************

const template = document.getElementById('student-template')

const studentTable = document.querySelector('#students-table')
const studentTableBody = document.querySelector('#students-table-body')

const elementCount = document.querySelector('.count')
const avMark = document.querySelector('.text-end')

const editForm = document.getElementById("edit-form")
const editName = document.getElementById("editName")
const editLastName = document.getElementById("editLastname")
const editMark = document.getElementById("editMark")

const filterForm = document.querySelector('.filter')

const addForm = document.getElementById('add-form')

// ************** CALLING ALL MODALS **************

const editStudentModal = document.getElementById('edit-student-modal')
const editStudentModalBootstrap = new bootstrap.Modal(editStudentModal)

let addStudentModalEl = document.getElementById("add-student-modal");
let addStudentModal = new bootstrap.Modal(addStudentModalEl);


// ************** FUNCTIONS **************

let showingStudents = students.slice(); // cloning array

const addZero = function(number) {  // adding zero
    return number < 10 ? "0" + number : number
}
  
const showDate = function(dateString) {  // getting data and time
    const date = new Date(dateString);
  
    return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

const renderStudent = (student) => {  // displaying
    const {
        id,
        name : stName,
        lastName,
        mark,
        markedDate
    } = student

    const studentRow = template.content.cloneNode(true);

    const studentId = studentRow.querySelector('.student-id')
    studentId.textContent = id

    const studentName = studentRow.querySelector('.student-name')
    studentName.textContent = `${stName} ${lastName}`

    const studentMarkedDate = studentRow.querySelector('.student-marked-date')
    studentMarkedDate.textContent = showDate(markedDate)
    
    const markPercent = Math.round(mark * 100 / 150)

    const studentMark = studentRow.querySelector('.student-mark')
    studentMark.textContent = markPercent + "%"

    const studentPass = studentRow.querySelector('.student-pass-status')

    if (markPercent >= 40) {
        studentPass.textContent = "pass"
        studentPass.classList.add('bg-success')
    } else{
        studentPass.textContent = "fail"
        studentPass.classList.add('bg-danger')
    }

    const studentEdit = studentRow.querySelector('.student-edit')
    studentEdit.setAttribute('data-student', id)

    const studentDelete = studentRow.querySelector('.student-delete')
    studentDelete.setAttribute('data-student', id)

    return studentRow
}

const renderStudents = () => {  // rendering to display
    let sum = 0
    studentTableBody.innerHTML = "";
    showingStudents.forEach((student) =>{
        sum += student.mark
    })
    if(sum <= 0){
      elementCount.textContent = `No more students`
      avMark.textContent = `Average mark: 0%`
    } else if(sum > 0){
      elementCount.textContent = `Count: ${showingStudents.length}`
      avMark.textContent = `Average mark: ${Math.round(sum * 100 / 150 / showingStudents.length)}%`
    }
    const studentsFragment = document.createDocumentFragment();
    showingStudents.forEach((student) => {
        const studentRow = renderStudent(student)
        studentsFragment.append(studentRow)
    })
    studentTableBody.append(studentsFragment)
}
renderStudents();

studentTable.addEventListener("click", (evt) => {  // delete + edit
  
  if(evt.target.matches(".btn-outline-danger")){

    const clickedBtn = +evt.target.dataset.student
    
    const clickedStudent = showingStudents.findIndex((student) => {
      return student.id === clickedBtn
    })
    
    students.splice(clickedStudent, 1)
    showingStudents.splice(clickedStudent, 1)
    
    let items = localStorage.getItem("students");
    
    items = students.filter(function (item) {
      if (item.id !== item.id) {
        return item;
      }
    });
    
    localStorage.setItem("students", JSON.stringify(students));
    
    renderStudents()

  } else if(evt.target.matches('.btn-outline-secondary')){

    const clickedBtn = +evt.target.dataset.student

    const clickedStudent = showingStudents.find((student) => {
      return student.id === clickedBtn
    })

    editName.value = clickedStudent.name
    editLastName.value = clickedStudent.lastName
    editMark.value = clickedStudent.mark
    editForm.setAttribute('data-editing-id', clickedStudent.id)
  }
})
renderStudents()

editForm.addEventListener('submit', (evt) => { // to edit
  evt.preventDefault()

  const editId = +evt.target.dataset.editingId

  const nameValue = editName.value
  const lastNameValue = editLastName.value
  const markValue = +editMark.value

  if (nameValue.trim() && lastNameValue.trim() && markValue >= 0 && markValue <= 150) {
    const newStudent = {
      id: editId,
      name: nameValue,
      lastName: lastNameValue,
      mark: markValue,
      markedDate: new Date().toISOString()
    }

    const editingItemIndex = students.findIndex((student) => {
      return student.id === editId
    })

    const editingShowItemIndex = showingStudents.findIndex((student) => {
      return student.id === editId
    })

    students.splice(editingItemIndex, 1, newStudent)
    showingStudents.splice(editingShowItemIndex, 1, newStudent)
    localStorage.setItem("students", JSON.stringify(students))

    editForm.reset()
    editStudentModalBootstrap.hide()
  }
  renderStudents()
})

addForm.addEventListener('submit', (e) => {  // add items
    e.preventDefault()  
    let element = e.target.elements

    let nameSt = element.name.value
    let lastName = element.lastname.value
    let mark = +element.mark.value
    
    if (nameSt.trim() && lastName.trim() && mark >= 0 && mark <= 150) {
        const newStudent = {
            id: Math.floor(Math.random() * 1000),
            name: nameSt,
            lastName: lastName,
            mark: mark,
            markedDate: new Date().toISOString()
        }   
        students.push(newStudent)
        localStorage.setItem("students", JSON.stringify(students))
        showingStudents.push(newStudent)
    }
    renderStudents(); 
    addForm.reset();
    
    addStudentModal.hide()
})

filterForm.addEventListener('submit', (e) => {  // sort
  e.preventDefault();

  let elements = e.target.elements;
  let searchValue = elements.search.value;
  let sortValue = elements.sortby.value;
  let fromMark = elements.from.value;
  let toMark = elements.to.value;

  showingStudents = students.sort((a, b) => {
    switch (sortValue) {
      case "1":
        if (a.name > b.name) {
          return 1
        } else if(b.name > a.name){
          return -1
        } else{
          return 0
        }
      case "2":
        return b.mark - a.mark
      case "3":
        return a.mark - b.mark
      case "4":
        return new Date(a.markedDate).getTime() - new Date(b.markedDate).getTime()
      default:

        break;
    }
  }).filter((student) => {
    const studentMarkPercent = Math.round(student.mark * 100 / 150)
    const regularExp = new RegExp(searchValue, "gi")
    const nameAndLastName = `${student.name} ${student.lastName}`;
    const toMarkCondition = !toMark ? true : studentMarkPercent <= toMark

    return studentMarkPercent >= fromMark && toMarkCondition && nameAndLastName.match(regularExp)
  })
  renderStudents()
  filterForm.reset()
})