console.log(data);
var dataNameSedes = Object.keys(data);
var valuesofData = Object.values(data);
window.addEventListener('load', function() {
  var selectSede = document.getElementById('sedes');
  var selectSprintTech = document.getElementById('tech-skills');
  var selectSprintHse = document.getElementById('hse-skills');

  // -------------------------------------------------------------------------------------------------------------------------------------
  // Para Jalar data automaticamente
  for (var i = 0; i < dataNameSedes.length; i++) {
    // Creamos una variable sedes que va almacenar la grupo de la sede
    var optgroupsedes = document.createElement('optgroup');
    // le asignamos el valor del labol del grupo, de acuerdo al nombre extraido de data.js de cada sede
    optgroupsedes.label = dataNameSedes[i];
    optgroupsedes.id = 'optgroupsede' + i;
    // le asignamos cada sede a la lista de sedes
    selectSede.appendChild(optgroupsedes);
    // guardamos las promociones por sede
    var promsforSede = Object.keys(valuesofData[i]);
    // guardamos los valores de los promociones
    var valuesofPromsforSede = Object.values(valuesofData[i]);
    var arrayNumberStudentsActiveforSede = [];
    // Recorremos las promociones
    for (var j = 0; j < valuesofPromsforSede.length; j++) {
    // Creamos un elemento para mostrar las promociones
      var optionproms = document.createElement('option');
      // le asignamos el valor a mostrar
      optionproms.id = 'optionproms' + i + '' + j ;
      optionproms.label = promsforSede[j];
      optionproms.value = dataNameSedes[i] + '_' + promsforSede[j];
      // le asignamos donde lo va a mostrar
      optgroupsedes.appendChild(optionproms);
    }
  }

  selectSede.addEventListener('change', function(event) {
    var selectedValue = this.value;
    var nameSede = selectedValue.split('_')[0];
    var nameProm = selectedValue.split('_')[1];
    document.getElementById('nameshow').innerText = nameSede;
    ShowData(nameSede, nameProm);

    selectSprintTech.addEventListener('change', function(event) {
      var selectSprintforTech = this.value;
      techSkills(nameSede, nameProm, selectSprintforTech);
    });
    
    selectSprintHse.addEventListener('change', function(event) {
      var selectSprintforEHS = this.value;
      techSkills(nameSede, nameProm, selectSprintforEHS);
    });
  });
});

// -------------------------------------------------------------------------------------------------------------------------------------
// Eventos para tab
var studentsPage = document.getElementById('students');
studentsPage.addEventListener('click', function(event) {
  document.getElementById('content').setAttribute('class', 'disappear');
  document.getElementById('content-two').setAttribute('class', 'appear');
  document.getElementById('white').setAttribute('class', 'disappear');
  document.getElementById('orangeline').setAttribute('class', 'margin-left');
  document.getElementById('students').setAttribute('class', 'cursor-change');
});
studentsPage.addEventListener('mouseover', function(event) {
  document.getElementById('students').setAttribute('class', 'cursor-hand');
});

var overview = document.getElementById('overview');
overview.addEventListener('click', function(event) {
  document.getElementById('content').setAttribute('class', 'appear');
  document.getElementById('content-two').setAttribute('class', 'disappear');
  document.getElementById('white').setAttribute('class', 'disappear');
  document.getElementById('orangeline').setAttribute('class', 'margin-none');
});

overview.addEventListener('mouseover', function(event) {
  document.getElementById('overview').setAttribute('class', 'cursor-hand');
});
// --------------------------------------------------------------------------------------------------------------------------------------
// Eventos para el menú hamburguesa
var menuhamburger = document.getElementById('button');
menuhamburger.addEventListener('click', function(event) {
  document.getElementById('all-content').setAttribute('class', 'disappear');
  document.getElementById('white').setAttribute('class', 'appear');
});
white.addEventListener('click', function(event) {
  document.getElementById('all-content').setAttribute('class', 'appear');
  document.getElementById('white').setAttribute('class', 'disappear');
});

// -------------------------------------------------------------------------------------------------------------------------------------
// Función Mostar Data
function ShowData(nameSede, nameProm) {
  enrollmentDesert(nameSede, nameProm);
  calculatePromoter(nameSede, nameProm);
  calculateStudentsTargetObjetc(nameSede, nameProm);
  showSprints(nameSede, nameProm);
  calculateStudentSatisfaccion(nameSede, nameProm);
  calculateTeacherRating(nameSede, nameProm);
  calculateJediMasterRating(nameSede, nameProm);
  // drawCurrently(percentStudentsActiveforProm, percentStudentsInactiveforProm);
  // function calculateStudentsTargetObjetc
}

// -------------------------------------------------------------------------------------------------------------------------------------
// para calcular el porcentaje de derción y alumnas inscritas por sede y por promoción
function enrollmentDesert(nameSede, nameProm) {
  // estudiantes por promoción
  var studentsList = data[nameSede][nameProm].students;
  // número de estudiantes por promoción
  var numberStudentsforProm = data[nameSede][nameProm].students.length;
  // número de estudiantes activas por promoción
  var numberStudentsActiveforProm = parseInt(serchStudentsActive(studentsList));
  // número de estudantes inactivas por promoción
  var numberStudentsInactiveforProm = numberStudentsforProm - numberStudentsActiveforProm;
  // Porcentaje de alumnas activas por promoción
  var percentStudentsActiveforProm = (Math.round((numberStudentsActiveforProm * 100) / numberStudentsforProm)) + '' + '%';
  // Porcentaje de alumnas inactivas por promoción
  var percentStudentsInactiveforProm = (Math.round((numberStudentsInactiveforProm * 100) / numberStudentsforProm)) + '' + '%';
  document.getElementById('enrolled').innerHTML = numberStudentsforProm;
  document.getElementById('dropout').innerHTML = percentStudentsInactiveforProm;
}


// -------------------------------------------------------------------------------------------------------------------------------------
// para calcular estudiantes que cumplen el objetivo
function calculateStudentsTargetObjetc(nameSede, nameProm) {
  var students = data[nameSede][nameProm].students;
  // Alumnas que pasaron el 70%
  var countPastTarget = 0;
  var countPastTargetTech = 0;
  var countPastTargetHse = 0;
  // lista con notas de los 4 sprints de las alumnas
  // var allStudentsNotasTotalArr = [];
  // variables para la sumatoria de las notas tech + hse
  var notaTotal = 0;
  var notaTechTotal = 0;
  var notaHseTotal = 0;
  for (var i = 0; i < students.length; i++) {
    // if (notaTotal !== 0) {
    //   // allStudentsNotasTotalArr.push(notaTotal);
    // }
    notaTechTotal = 0;
    notaHseTotal = 0;
    if (students[i]['sprints'] !== undefined) {
      for (var j = 0; j < students[i]['sprints'].length; j++) {
        var notaTech = students[i]['sprints'][j]['score']['tech'];
        var notaHse = students[i]['sprints'][j]['score']['hse'];
        // sumatoria de las notas tech de todos los sprints
        notaTechTotal += notaTech;
        // sumatoria de las notas hse de todos los sprints
        notaHseTotal += notaHse;
        // la meta es superar 70% en tech y en hse
        if ((notaTechTotal / students[i]['sprints'].length) > 1260 && (notaHseTotal / students[i]['sprints'].length) > 940) {
          countPastTarget++;
        }
        // META DEL 70% POR AREAS
        // la meta es superar 70% en tech
        if ((notaTechTotal / students[i]['sprints'].length) > 1260) {
          countPastTargetTech++;
        }
        // la meta es superar 70% en hse
        if ((notaHseTotal / students[i]['sprints'].length) > 940) {
          countPastTargetHse++;
        }
      }
    }
  }
  var countPastTargetPorc = Math.round((countPastTarget * 100) / (students.length)) + '%';
  var countPastTargetTechPorc = Math.round((countPastTargetTech * 100) / (students.length)) + '%';
  var countPastTargetHsePorc = Math.round((countPastTargetHse * 100) / (students.length)) + '%';

  document.getElementById('target').innerHTML = countPastTarget;
  document.getElementById('target-percent').innerHTML = countPastTargetPorc;
  document.getElementById('tech').innerHTML = countPastTargetTech;
  document.getElementById('tech-percent').innerHTML = countPastTargetTechPorc;
  document.getElementById('hse').innerHTML = countPastTargetHse;
  document.getElementById('hse-percent').innerHTML = countPastTargetHsePorc;
}


// -------------------------------------------------------------------------------------------------------------------------------------
// para calculateTeacherRating
function calculatePromoter(nameSede, nameProm) {
  var contPromoters = 0;
  var contDetractors = 0;
  var contPassive = 0;
  for (var i = 0; i < data[nameSede][nameProm].ratings.length; i++) {
    contPromoters = data[nameSede][nameProm]['ratings'][i]['nps']['promoters'] + contPromoters;
    contDetractors = data[nameSede][nameProm]['ratings'][i]['nps']['detractors'] + contDetractors;
    contPassive = data[nameSede][nameProm]['ratings'][i]['nps']['passive'] + contDetractors;
  }
  document.getElementById('nps').innerHTML = ((contPromoters / data[nameSede][nameProm].ratings.length).toFixed(0) - (contDetractors / data[nameSede][nameProm].ratings.length).toFixed(0)) + ' % ';
  document.getElementById('promoter').innerHTML = (contPromoters / data[nameSede][nameProm].ratings.length).toFixed(0) + ' % Promoters ';
  document.getElementById('passive').innerHTML = (contPassive / data[nameSede][nameProm].ratings.length).toFixed(0) + ' % Passive ';
  document.getElementById('detractors').innerHTML = (contDetractors / data[nameSede][nameProm].ratings.length).toFixed(0) + ' % Detractors';
}

// -------------------------------------------------------------------------------------------------------------------------------------
// para calculateTeacherRating
function calculateTeacherRating(nameSede, nameProm) {
  var sumRating = 0;
  for (var i = 0; i < data[nameSede][nameProm].ratings.length;i++) {
    sumRating = data[nameSede][nameProm]['ratings'][i]['teacher'] + sumRating;
  }
  document.getElementById('scoret').innerHTML = (sumRating / data[nameSede][nameProm].ratings.length).toFixed(2);
}

// -------------------------------------------------------------------------------------------------------------------------------------
// para calculateJediMasterRating
function calculateJediMasterRating(nameSede, nameProm) {
  var sumJedi = 0;
  for (var i = 0;i < data[nameSede][nameProm].ratings.length;i++) {
    sumJedi = data[nameSede][nameProm]['ratings'][i]['jedi'] + sumJedi;
  }
  document.getElementById('scorej').innerHTML = (sumJedi / data[nameSede][nameProm].ratings.length).toFixed(2);
}

// -------------------------------------------------------------------------------------------------------------------------------------
// para calculateStudentSatisfaccion
function calculateStudentSatisfaccion(nameSede, nameProm) {
  for (var i = 0;i < data[nameSede][nameProm].ratings.length;i++) {
    var meet = data[nameSede][nameProm]['ratings'][i]['student']['cumple'];
    var beats = data[nameSede][nameProm]['ratings'][i]['student']['supera'];
    var numStudentCumple = parseInt(((data[nameSede][nameProm].students.length * meet) / 100).toFixed(0));
    var numStudentSupera = parseInt(((data[nameSede][nameProm].students.length * beats) / 100).toFixed(0));
    var total = (((numStudentCumple + numStudentSupera) * 100) / data[nameSede][nameProm].students.length).toFixed(2);
  }
  // console.log(numStudentCumple);
  document.getElementById('satisfaction').innerHTML = total;
}

// -------------------------------------------------------------------------------------------------------------------------------------
// Función para llenar dinámicamente los sprints
function showSprints(nameSede, nameProm) {
  var techSkills = document.getElementById('tech-skills');
  var hseSkills = document.getElementById('hse-skills');
  techSkills.textContent = '';
  hseSkills.textContent = '';
  for (var i = 0; i < data[nameSede][nameProm]['students'].length; i++) {
    var Sprints = data[nameSede][nameProm]['students'][i].sprints;
    // console.log(numberSprints);
    techSkills.textContent = '';
    hseSkills.textContent = '';
    for (var j = 0; j < Sprints.length; j++) {
      if (Sprints[j] !== undefined) {
        // Creamos un elemento para mostrar las promociones
        var optionSprintfortech = document.createElement('option');
        var optionSprintforhse = document.createElement('option');
        // le asignamos el valor a mostrar
        optionSprintfortech.label = 'Sprint ' + Sprints[j].number;
        optionSprintfortech.value = 'Sprint ' + Sprints[j].number;
        optionSprintforhse.label = 'Sprint ' + Sprints[j].number;
        optionSprintforhse.value = 'Sprint ' + Sprints[j].number;
        // le asignamos donde lo va a mostrar
        techSkills.appendChild(optionSprintfortech);
        hseSkills.appendChild(optionSprintforhse);
      }
    }
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------
// para mostrar los tech skill
function techSkills(nameSede, nameProm, selectSprintforTech) {
  document.getElementById('tech').textContent = '';
  document.getElementById('tech-percent').textContent = '';
  document.getElementById('total_2').textContent = '';
  var arrayStudents = data[nameSede][nameProm].students;
  var notasTechSprint = [];
  var pastTargetperSprint = 0;
  for (var i = 0; i < arrayStudents.length; i++) {
    if (arrayStudents[i]['sprints'] !== undefined) {
      for (var j = 0; j < arrayStudents[i]['sprints'].length; j++) {
        var notaTechSprint = arrayStudents[i]['sprints'][j]['score']['tech'];
        // console.log(notaTechSprint);
        notasTechSprint.push(notaTechSprint);
        if (selectSprintforTech === 'Sprint ' + j) {
          for (var cont = 0 ; cont < notasTechSprint.length ; cont++) {
            if (notasTechSprint[cont] > 1260) {
              pastTargetperSprint++;
            }
          }
        }
      }
    }
  }
  var pastTargetperSprintPorc = Math.round((pastTargetperSprint * 100) / (students.length)) + '%';
  document.getElementById('tech').innerHTML = pastTargetperSprint;
  document.getElementById('tech-percent').innerHTML = pastTargetperSprintPorc;
  document.getElementById('total_2').innerHTML = '% OF TOTAL ' + '(' + arrayStudents.length + ')';
}

// -------------------------------------------------------------------------------------------------------------------------------------
// para mostrar los hse skill
function techSkills(nameSede, nameProm, selectSprintforEHS) {
  var arrayStudents = data[nameSede][nameProm].students;
  var notasHseSprint = [];
  var pastTargetperSprintHse = 0;
  for (var i = 0; i < students.length; i++) {
    if (students[i]['sprints'] !== undefined) {
      for (var j = 0; j < students[i]['sprints'].length; j++) {
        var notaHseSprint = students[i]['sprints'][j]['score']['hse'];
        if (j === selectSprintforEHS) {
          notasHseSprint.push(notaHseSprint);
        }
      }
    }
  }


  if (selectSprintforEHS === j) {
    for (var i = 0 ;i < notasHseSprint1Arr.length ;i++) {
      if (notasHseSprint[i] > 940) {
        pastTargetperSprintHse++;
      }
    }
  }
  var pastTargetperSprintHsePorc = Math.round((pastTargetperSprintHse * 100) / (students.length)) + '%';
  document.getElementById('hse').innerHTML = pastTargetperSprintHse;
  document.getElementById('hse-percent').innerHTML = pastTargetperSprintHsePorc;
}  


// -------------------------------------------------------------------------------------------------------------------------------------
// para sumar elementos de un array
function sumElementArray(array) {
  var sumTotal = 0;
  for (var i = 0; i < array.length; i++) {
    sumTotal += array[i];
  }
  return sumTotal;
}

// -------------------------------------------------------------------------------------------------------------------------------------
// Función para buscar estudiantes activas
function serchStudentsActive(studentsList) {
  var result = 0;
  for (var i = 0; i < studentsList.length; i++) {
    if (studentsList[i].active === true) {
      result++;
    }
  }
  // console.log(result);
  return result;
}

// -------------------------------------------------------------------------------------------------------------------------------------
// para graficar
function drawCurrently(attend, noAttend) {
  var data = google.visualization.arrayToDataTable([
    ['Currently', 'Number Student'],
    ['Asisten', attend],
    ['No Asisten', noAttend],
  ]);
  var options = {
    'width': 300,
    'height': 200};

  var chart = new google.visualization.PieChart(document.getElementById('grafy-enrollment'));
  chart.draw(data, options);
}

function drawPromoter() {
  var data = google.visualization.arrayToDataTable([
    ['Element', 'Density', { role: 'annotation' } ],
    ['Copper', 8.94, 'Cu' ],
    ['Silver', 10.49, 'Ag' ],
    ['Gold', 19.30, 'Au' ],
    ['Goldh', 0, 'Au' ],
  ]);

  var options = {
    'width': 300,
    'height': 200};
  var chart = new google.charts.Bar(document.getElementById('grafy-promoter'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}
