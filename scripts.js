document.addEventListener("DOMContentLoaded", function() {
    const amountInput = document.getElementById("amount");
    const percentageInput = document.getElementById("percentage");
    const numberInput = document.getElementById("numberInput");
    const convertButton = document.getElementById("convertButton");

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

    convertButton.addEventListener("click", function() {
        convertToArabic();
    });

    async function convertToArabic() {
        let numberValue = numberInput.value.trim();
        if (numberValue !== '') {
            const encodedParams = new URLSearchParams();
            encodedParams.set('the_number', numberValue);
            encodedParams.set('unit', ' ريال سعودي');
            encodedParams.set('hundreds_form', 'مائة');

            const options = {
                method: 'POST',
                url: 'https://tafqit.p.rapidapi.com/convert',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'X-RapidAPI-Key': '15c80c7f58msh0a3d1ac99e47bccp1959c7jsn690a59131f90',
                    'X-RapidAPI-Host': 'tafqit.p.rapidapi.com'
                },
                data: encodedParams,
            };

            try {
                const response = await axios.request(options);
                document.getElementById("convertedResult").innerHTML = "<h3>نتيجة التفقيط:</h3><p>" + response.data.tafqit + "</p>";
            } catch (error) {
                console.error(error);
            }

        } else {
            alert("الرجاء إدخال الرقم للتفقيط.");
        }
    }
});
