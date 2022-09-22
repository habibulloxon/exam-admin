const template = document.getElementById('student-template')

const addZero = function(number) {
    return number < 10 ? "0" + number : number
  }
  
  const showDate = function(dateString) {
    const date = new Date(dateString);
  
    return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  }

const renderStudent = (student) => {
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

let showingStudents = students.slice();

const studentTable = document.querySelector('#students-table')
const studentTableBody = document.querySelector('#students-table-body')
const elementCount = document.querySelector('.count')
const avMark = document.querySelector('.text-end')

const renderStudents = () => {
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


// delete

studentTable.addEventListener("click", (evt) => {

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
    }
    //  else if(".btn-outline-success"){
    //   const clickedBtn = +evt.target.dataset.student

    //   const inputValueEdit = evt.target.elements 
    //   let editNameInput = inputValueEdit.editName.value
    //   let editLastNameInput = inputValueEdit.editLastname.value
    //   let editMarkInput = inputValueEdit.editMark.value

    //   const clickedStudent = showingStudents.find((student) => {
    //     return student.id === clickedBtn
    //     editNameInput = clickedStudent.name
    //     editLastNameInput = clickedStudent.lastName
    //     editMarkInput = clickedStudent.mark
    //   })
    //   renderStudents()
    // }
})

// add 

let addStudentModalEl = document.getElementById("add-student-modal");
let addStudentModal = new bootstrap.Modal(addStudentModalEl);

const addForm = document.getElementById('add-form')

addForm.addEventListener('submit', (e) => {
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

//edit



// sort

const filterForm = document.querySelector('.filter')

filterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const sortValue = e.target.elements.sortby.value
  const searchValue = e.target.elements.search.value

  showingStudents.sort((a, b) => {
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
  })
  renderStudents()
})
