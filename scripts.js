document.addEventListener("DOMContentLoaded", function() {
    // عناصر النموذج
    const amountInput = document.getElementById("amount");
    const percentageInput = document.getElementById("percentage");
    const resultDiv = document.getElementById("result");
    const tafqitDiv = document.getElementById("convertedResult");
    const form = document.getElementById("percentageForm");
    const operationSelect = document.getElementById("operation");

    // التحقق من صحة المدخلات
    function validateInputs() {
        const amount = parseFloat(amountInput.value);
        const percentage = parseFloat(percentageInput.value);
        const isAmountValid = !isNaN(amount) && amount > 0;
        const isPercentageValid = !isNaN(percentage) && percentage > 0 && percentage <= 100;
        form.querySelector("button[type='submit']").disabled = !(isAmountValid && isPercentageValid);
    }

    amountInput.addEventListener("input", validateInputs);
    percentageInput.addEventListener("input", validateInputs);

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const amount = parseFloat(amountInput.value);
        const percentage = parseFloat(percentageInput.value);
        const operation = operationSelect.value;
        let result = 0;
        let tafqitText = "";

        // تحقق صارم
        if (isNaN(amount) || amount <= 0) {
            resultDiv.innerHTML = "<span style='color:red'>الرجاء إدخال مبلغ صحيح.</span>";
            tafqitDiv.innerHTML = "";
            return;
        }
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
            resultDiv.innerHTML = "<span style='color:red'>الرجاء إدخال نسبة مئوية صحيحة بين 1 و 100.</span>";
            tafqitDiv.innerHTML = "";
            return;
        }

        switch (operation) {
            case "calculateTax":
                result = preciseMul(amount, percentage) / 100;
                resultDiv.innerHTML = `<h3>الضريبة:</h3><p>${result.toFixed(2)}</p>`;
                tafqitText = tafqit(result);
                break;
            case "calculateTotalIncludingTax":
                result = preciseMul(amount, (1 + percentage / 100));
                resultDiv.innerHTML = `<h3>المبلغ الإجمالي مع الضريبة:</h3><p>${result.toFixed(2)}</p>`;
                tafqitText = tafqit(result);
                break;
            case "calculateAmountBeforeTax":
                const amountBeforeTax = amount / (1 + percentage / 100);
                const taxAmount = amount - amountBeforeTax;
                resultDiv.innerHTML = `<h3>المبلغ قبل الضريبة:</h3><p>${amountBeforeTax.toFixed(2)}</p>
                                       <h3>مقدار الضريبة:</h3><p>${taxAmount.toFixed(2)}</p>`;
                tafqitText = tafqit(amountBeforeTax) + "<br>" + tafqit(taxAmount);
                break;
            case "extractAndSubtractTax":
                const amountBeforeTaxExtract = amount / (1 + percentage / 100);
                const taxExtractAmount = amount - amountBeforeTaxExtract;
                resultDiv.innerHTML = `<h3>المبلغ قبل الضريبة:</h3><p>${amountBeforeTaxExtract.toFixed(2)}</p>
                                       <h3>مقدار الضريبة:</h3><p>${taxExtractAmount.toFixed(2)}</p>`;
                tafqitText = tafqit(amountBeforeTaxExtract) + "<br>" + tafqit(taxExtractAmount);
                break;
            default:
                resultDiv.innerHTML = "<span style='color:red'>عملية غير معروفة.</span>";
                tafqitText = "";
        }
        tafqitDiv.innerHTML = `<h3>نتيجة التفقيط:</h3><p>${tafqitText}</p>`;
    });

    // دوال رياضية دقيقة
    function preciseMul(a, b) {
        // ضرب بدقة عالية للأرقام العشرية
        const aStr = a.toString(), bStr = b.toString();
        const aDec = (aStr.split('.')[1] || '').length;
        const bDec = (bStr.split('.')[1] || '').length;
        return Number((a * b).toFixed(aDec + bDec));
    }

    // دالة تفقيط عربية بسيطة
    function tafqit(num) {
        // يدعم الأرقام حتى المليار
        const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
        const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
        const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
        const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
        const thousands = ["", "ألف", "مليون", "مليار"];
        if (isNaN(num)) return "";
        num = Number(num).toFixed(2);
        let [intPart, decPart] = num.split('.');
        let intNum = parseInt(intPart);
        if (intNum === 0) return "صفر";
        let parts = [];
        let i = 0;
        while (intNum > 0 && i < thousands.length) {
            let chunk = intNum % 1000;
            if (chunk > 0) {
                let chunkText = "";
                let h = Math.floor(chunk / 100);
                let t = chunk % 100;
                if (h > 0) chunkText += hundreds[h] + " ";
                if (t > 0) {
                    if (t < 10) chunkText += ones[t];
                    else if (t < 20) chunkText += teens[t - 10];
                    else chunkText += ones[t % 10] + " و" + tens[Math.floor(t / 10)];
                }
                chunkText = chunkText.trim();
                if (chunkText) chunkText += " " + thousands[i];
                parts.unshift(chunkText.trim());
            }
            intNum = Math.floor(intNum / 1000);
            i++;
        }
        let result = parts.join(" و ");
        if (decPart && parseInt(decPart) > 0) {
            result += ` و ${parseInt(decPart)} جزء من المائة`;
        }
        return result;
    }

    validateInputs();
});
