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

        // تمكين أو تعطيل زر الحساب بناءً على صحة المدخلات
        document.getElementById("percentageForm").querySelector("button").disabled = !(isAmountValid && isPercentageValid);
    }

    // استماع للتغييرات في المدخلات
    amountInput.addEventListener("input", validateInputs);
    percentageInput.addEventListener("input", validateInputs);

    // معالجة عملية الحساب
    document.getElementById("percentageForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const amount = parseFloat(amountInput.value);
        const percentage = parseFloat(percentageInput.value);
        const operation = document.getElementById("operation").value;
        let result = 0;

        // التحقق من صحة المدخلات
        if (isNaN(amount) || amount <= 0) {
            errorDiv.innerHTML = "الرجاء إدخال مبلغ صحيح.";
            return;
        }
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
            errorDiv.innerHTML = "الرجاء إدخال نسبة مئوية صحيحة بين 1 و 100.";
            return;
        }

        errorDiv.innerHTML = ''; // إزالة الرسائل الخطأ السابقة

        // العمليات الحسابية بناءً على النوع المختار
        switch (operation) {
            case "extract":
                // استخراج النسبة فقط (المبلغ × النسبة المئوية / 100)
                result = (amount * percentage) / 100;
                break;
            case "subtract":
                // خصم النسبة من المبلغ (المبلغ × (1 - النسبة / 100))
                result = amount - (amount * percentage) / 100;
                break;
            case "add":
                // إضافة النسبة إلى المبلغ (المبلغ × (1 + النسبة / 100))
                result = amount * (1 + percentage / 100);
                break;
            default:
                result = 0;
                break;
        }

        resultDiv.innerHTML = `<h3>النتيجة:</h3><p>${result.toFixed(2)}</p>`;
    });

    // تحويل الرقم إلى اللغة العربية
    document.getElementById("convertButton").addEventListener("click", function() {
        convertToArabic();
    });

    // دالة للتحويل إلى اللغة العربية
    function convertToArabic() {
        let numberValue = numberInput.value.trim();

        if (numberValue === '') {
            errorDiv.innerHTML = "الرجاء إدخال الرقم للتفقيط.";
            return;
        }

        // التحقق من أن المدخل هو رقم فقط
        if (!/^\d+(\.\d+)?$/.test(numberValue)) {
            errorDiv.innerHTML = "الرجاء إدخال رقم صالح.";
            return;
        }

        // التحقق إذا كانت مكتبة التحويل موجودة
        if (typeof numberToArabic === 'undefined') {
            errorDiv.innerHTML = "مكتبة التفقيط غير موجودة.";
            return;
        }

        // استخدام دالة التحويل إلى اللغة العربية
        let convertedNumber = numberToArabic(numberValue);
        document.getElementById("convertedResult").innerHTML = `<h3>نتيجة التفقيط:</h3><p>${convertedNumber}</p>`;
        errorDiv.innerHTML = ''; // إزالة الرسائل الخطأ السابقة
    }

    // تفعيل التحقق الأولي للمدخلات عند تحميل الصفحة
    validateInputs();
});
