/* from Module: Context in Javascript

This lab uses a lot of the same functions from the previous lab, "Intro to Context"
but the way the tests in this lab are written require that I use "this", 
instead of including a specific record in the argument, 
so many of the functions have different arguments than the previous lab did. 
i.e.  where a function in the previous lab would be something like
  "someFunc(e m p l o y e e, day)", it now says "someFunc(day)" 
 and instead of calling "employee.data", I use "this.data".
 */



 // creates an employee record from an array of employee data
function createEmployeeRecord(employee) {
    // arrayData = [first, last, title, payrate]
    let dict;
    dict = {
        firstName: employee[0],
        familyName: employee[1],
        title: employee[2],
        payPerHour: employee[3],
        timeInEvents: [],
        timeOutEvents: []
    };
    return dict;
}

// creates an array of employee records from arrays of employees' data
function createEmployeeRecords(allEmployees) {
    let allRecords=[];

  // kept running into index-out-of-range type errors because I had "i <= array.length", which returned undefined objects
    for (let i =0; i < allEmployees.length; i++) {
        let rec = createEmployeeRecord(allEmployees[i]);
        allRecords.push(rec);
    };

    /* couldn't "return (allRecords)" without getting [object, Object] 
    for each entry but for some reason I can "return (let arr = allRecords)" */
    let arr = allRecords;       
    return (arr);
}

// sets the timeInEvents object key of an employees record
//function createTimeInEvent(employee, log) {
function createTimeInEvent(day) {
    //date = "YYYY-MM-DD HHMM"
    // parse date, split at " ".
    let timeEvent = day.split(" ");
    let timeInEvent = {
        type: "TimeIn",
        hour: parseInt(timeEvent[1], 10),
        date: timeEvent[0]
    }
    this.timeInEvents.push(timeInEvent);
    return this;
}

function createTimeOutEvent(date) {
    //date = "YYYY-MM-DD HHMM"
    // parse date, split at " ".
    let timeEvent = date.split(" ");
    let timeOutEvent = {
        type: "TimeOut",
        hour: parseInt(timeEvent[1], 10),   // format: parseInt(target, precision)
        date: timeEvent[0]
    }
    this.timeOutEvents.push(timeOutEvent);
    return this;
}

function hoursWorkedOnDate(day) {
    // 'date' format: "YYYY-MM-DD"
    // 'employee' is an employee record of type: dictionary
    // find employee.timeInEvents and employee.timeOutEvents with timeEvent dates matching the day argument


    // These return all the timeEvents that has a matching date
    let inEvent = this.timeInEvents.find(o => o.date === day);
    let outEvent = this.timeOutEvents.find(o => o.date === day);

    // This gets the hours worked on the given day
    let hoursWorked = outEvent.hour - inEvent.hour;
    hoursWorked = hoursWorked/100;          // divide by 100 to account for time being in military time
    //console.log(hoursWorked);
    return hoursWorked;
}

function wagesEarnedOnDate(day) {
    
    //let inEvent = this.timeInEvents.find(o => o.date === day);
    //let outEvent = this.timeOutEvents.find(o => o.date === day);
    //console.log(inEvent);
    //console.log(outEvent);


    /*
    Calling hoursWorkedOnDate(day) here runs into issues with 
    reading the .find method used in the hoursWorkedOnDate() function.
    Although, when I wrote those lines of code in this function, 
    which is commented out above, they worked fine. 
    So, the issue must have had something to do with how the argument passes
    from one function that uses "this" to another that also uses "this."

    I saw in the tests that they called the function like this:
    >> wagesEarnedOnDate.call(cRecord, "2044-03-15")
    therefore I used the same, but just changed the "cRecord" to "this".
    idk what the ".call(this)" does but it worked.
    */
    let hours = hoursWorkedOnDate.call(this, day);
    //console.log("hours " + hours);
    let earned = hours * this.payPerHour;


    return earned;

}

/* THE FUNCTION I WROTE FOR THE PREVIOUS LAB. (Just for reference.)

function allWagesFor(employee) {
    let total = 0;
    let allInEvents = employee.timeInEvents;
    for (let j = 0; j < allInEvents.length; j++){
        let inDate = allInEvents[j].date;
        let wage = wagesEarnedOnDate(employee, inDate); 
        total += wage;           
        }

    return total
}
*/


/* GIVEN FUNCTION:----------------------------------------------------------
 We're giving you this function. Take a look at it, you might see some usage
 that's new and different. That's because we're avoiding a well-known, but
 sneaky bug that we'll cover in the next few lessons!

 As a result, the lessons for this function will pass *and* it will be available
 for you to use if you need it!
 */
const allWagesFor = function () {
    const eligibleDates = this.timeInEvents.map(function (e) {
        return e.date
    })

    const payable = eligibleDates.reduce(function (memo, d) {
        return memo + wagesEarnedOnDate.call(this, d)
    }.bind(this), 0) // <== Hm, why did we need to add bind() there? We'll discuss soon!

    return payable
}
// ---------------------------------------------------------------------------

// This is a newly added function that was not in the previous lab, "Intro to Context"
function findEmployeeByFirstName(allEmployees, name) {
let record = allEmployees.find(o => o.firstName === name);
return record;
}

/*
This uses the given function, so I have to change how it works.
had to add ".call" when calling allWagesFor. idk why. 
*/
function calculatePayroll(allEmployees) {
    
    let total = 0;
    for (let i = 0; i < allEmployees.length; i++){
        let wages = allWagesFor.call(allEmployees[i]);
        total += wages;
    }
    
    
    return total;
}


//Used to test issues with wagesEarnedOnDate()
/*
cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 27])
createTimeInEvent.call(cRecord, "2044-03-15 0900")
createTimeOutEvent.call(cRecord, "2044-03-15 1100")
console.log("after creating time events")
console.log(hoursWorkedOnDate.call(cRecord, "2044-03-15"))
console.log("after hoursWorkedOnDate.call(cRecord, etc)")
//wagesEarnedOnDate.call(cRecord, "2044-03-15")
console.log("before my hoursWorked")
let hours = hoursWorkedOnDate.call(cRecord, "2044-03-15");
console.log("hours:" + hours);
*/



