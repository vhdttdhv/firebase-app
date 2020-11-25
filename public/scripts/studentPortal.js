
auth.onAuthStateChanged(user => {
    if (user) {

        //  console.log("User logged in: ", user)
        console.log("Logged In user ID -> " + user.uid)
        db.collection('students').doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data().firstName);
                const studentGreetings = document.querySelector("#studentGreetings");
                studentGreetings.innerHTML = "Welcome, " + doc.data().firstName + "!";

                db.collection('student-bookings').onSnapshot(snapshot => {
                    var table = document.querySelector("#tbl-bookedAp")
                    //Handle the latest event
                    snapshot.forEach(doc => {
                        console.log("hi")
                        console.log(doc.data())
                        db.collection("admin-availability").onSnapshot(snapshot => {
                            snapshot.forEach(docInner => {
                                if (docInner.data().admin_id = doc.data().admin_availability) {
                                    var type = docInner.data().type;
                                    var startDate = new Date(docInner.data().startTime.toDate()).toLocaleDateString("en-US");
                                    var startTime = new Date(docInner.data().startTime.toDate()).toLocaleTimeString("en-US");
                                    var finishDate = new Date(docInner.data().finishTime.toDate()).toLocaleDateString("en-US");
                                    var finishTime = new Date(docInner.data().finishTime.toDate()).toLocaleTimeString("en-US");
                                    db.collection('admins').doc(docInner.data().admin_id).get().then(docSpec => {
                                        var name = docSpec.data().firstName
                                        console.log(type + "Time = " + startTime + " Time =" + finishTime + "Name" + name)
                                        table.innerHTML += `<tr>
                        <td>${type}</td>
                        <td>
                            <p class="h4">${startDate} at ${startTime} - ${finishTime}</p>
                        </td>
                        <td>Dr. ${name}</td>
                        <td>BUTTON</td>
                    </tr>`
                                    })
                                }
                            })
                        })

                    })

                })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
    else {
        console.log("User logged out")
    }
});

const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    auth.signOut();
})