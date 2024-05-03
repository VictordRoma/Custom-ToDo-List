function messageSession() {
    var sessionValue = sessionStorage.getItem('message')

    if (sessionValue !== null) {
        Swal.fire(
            'Good job!',
            'Data saved',
            'success'
        )
    }

    sessionStorage.clear();
}
  
document.addEventListener("DOMContentLoaded", function() {
    messageSession();
});