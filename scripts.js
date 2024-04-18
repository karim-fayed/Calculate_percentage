document.addEventListener("DOMContentLoaded", function() {
    const amountInput = document.getElementById("amount");
    const percentageInput = document.getElementById("percentage");
    const numberInput = document.getElementById("numberInput");

    document.getElementById("percentageForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let amount = parseFloat(amountInput.value);
        let percentage = parseFloat(percentageInput.value);
        let operation = document.getElementById("operation").value;
        let result = 0;

        if (!isNaN(amount) && !isNaN(percentage)) {
            if (operation === "extract") {
                result = (amount * percentage) / 100;
            } else if (operation === "subtract") {
                result = amount - ((amount * percentage) / 100);
            } else if (operation === "add") {
                result = amount + ((amount * percentage) / 100);
            }

            document.getElementById("result").innerHTML = "<h3>النتيجة:</h3><p>" + result.toFixed(2) + "</p>";
        } else {
            alert("الرجاء إدخال قيمة صحيحة لكل من المبلغ والنسبة المئوية.");
        }
    });

    document.getElementById("convertButton").addEventListener("click", function() {
        convertToArabic();
    });

    function convertToArabic() {
        let numberValue = numberInput.value.trim();
        if (numberValue !== '') {
            let convertedNumber = numberToArabic(numberValue);
            document.getElementById("convertedResult").innerHTML = "<h3>نتيجة التفقيط:</h3><p>" + convertedNumber + "</p>";
        } else {
            alert("الرجاء إدخال الرقم للتفقيط.");
        }
    }
});
