// JavaScript code
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("percentageForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let amount = parseFloat(document.getElementById("amount").value);
        let percentage = parseFloat(document.getElementById("percentage").value);
        let operation = document.getElementById("operation").value;
        let result = 0;

        if (operation === "extract") {
            result = (amount * percentage) / 100;
        } else if (operation === "subtract") {
            result = amount - ((amount * percentage) / 100);
        } else if (operation === "add") {
            result = amount + ((amount * percentage) / 100);
        }

        document.getElementById("result").innerHTML = "<h3>النتيجة:</h3><p>" + result.toFixed(2) + "</p>";
    });
});
