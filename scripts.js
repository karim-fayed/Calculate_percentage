document.addEventListener("DOMContentLoaded", function() {
    const amountInput = document.getElementById("amount");
    const percentageInput = document.getElementById("percentage");
    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");

    // التحقق من صحة المدخلات عند التغيير
    function validateInputs() {
        const amount = parseFloat(amountInput.value);
        const percentage = parseFloat(percentageInput.value);
        const isAmountValid = !isNaN(amount) && amount > 0;
        const isPercentageValid = !isNaN(percentage) && percentage > 0 && percentage <= 100;

        document.getElementById("percentageForm").querySelector("button").disabled = !(isAmountValid && isPercentageValid);
    }

    amountInput.addEventListener("input", validateInputs);
    percentageInput.addEventListener("input", validateInputs);

    document.getElementById("percentageForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const amount = parseFloat(amountInput.value);
        const percentage = parseFloat(percentageInput.value);
        const operation = document.getElementById("operation").value;
        let result = 0;

        if (isNaN(amount) || amount <= 0) {
            errorDiv.innerHTML = "الرجاء إدخال مبلغ صحيح.";
            return;
        }
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
            errorDiv.innerHTML = "الرجاء إدخال نسبة مئوية صحيحة بين 1 و 100.";
            return;
        }

        errorDiv.innerHTML = ''; // إزالة الرسائل الخطأ السابقة

        switch (operation) {
            case "calculateTax":
                result = (amount * percentage) / 100;
                resultDiv.innerHTML = `<h3>الضريبة:</h3><p>${result.toFixed(2)}</p>`;
                break;

            case "calculateTotalIncludingTax":
                result = amount * (1 + percentage / 100);
                resultDiv.innerHTML = `<h3>المبلغ الإجمالي مع الضريبة:</h3><p>${result.toFixed(2)}</p>`;
                break;

            case "calculateAmountBeforeTax":
                const amountBeforeTax = amount / (1 + percentage / 100);
                const taxAmount = amount - amountBeforeTax;
                resultDiv.innerHTML = `<h3>المبلغ قبل الضريبة:</h3><p>${amountBeforeTax.toFixed(2)}</p>
                                       <h3>مقدار الضريبة:</h3><p>${taxAmount.toFixed(2)}</p>`;
                break;

            case "extractAndSubtractTax":
                const amountBeforeTaxExtractAndSubtract = amount / (1 + percentage / 100);
                const taxExtractAndSubtractAmount = amount - amountBeforeTaxExtractAndSubtract;
                resultDiv.innerHTML = `<h3>المبلغ قبل الضريبة:</h3><p>${amountBeforeTaxExtractAndSubtract.toFixed(2)}</p>
                                       <h3>مقدار الضريبة:</h3><p>${taxExtractAndSubtractAmount.toFixed(2)}</p>`;
                break;

            default:
                result = 0;
                break;
        }
    });

    document.getElementById("convertButton").addEventListener("click", function() {
        convertToArabic();
    });

    function convertToArabic() {
        let numberValue = numberInput.value.trim();

        if (numberValue === '') {
            errorDiv.innerHTML = "الرجاء إدخال الرقم للتفقيط.";
            return;
        }

        if (!/^\d+(\.\d+)?$/.test(numberValue)) {
            errorDiv.innerHTML = "الرجاء إدخال رقم صالح.";
            return;
        }

        if (typeof numberToArabic === 'undefined') {
            errorDiv.innerHTML = "مكتبة التفقيط غير موجودة.";
            return;
        }

        let convertedNumber = numberToArabic(numberValue);
        document.getElementById("convertedResult").innerHTML = `<h3>نتيجة التفقيط:</h3><p>${convertedNumber}</p>`;
        errorDiv.innerHTML = '';
    }

    validateInputs();
});
