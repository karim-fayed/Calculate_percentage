/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************!*\
  !*** ./scripts.js ***!
  \********************/
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
                resultDiv.innerHTML = `<h3>الضريبة:</h3><p>${result.toFixed(4)}</p>`;
                tafqitText = tafqit(result);
                break;
            case "calculateTotalIncludingTax":
                result = preciseMul(amount, (1 + percentage / 100));
                resultDiv.innerHTML = `<h3>المبلغ الإجمالي مع الضريبة:</h3><p>${result.toFixed(4)}</p>`;
                tafqitText = tafqit(result);
                break;
            case "calculateAmountBeforeTax":
                const amountBeforeTax = amount / (1 + percentage / 100);
                const taxAmount = amount - amountBeforeTax;
                resultDiv.innerHTML = `<h3>المبلغ قبل الضريبة:</h3><p>${amountBeforeTax.toFixed(4)}</p>
                                       <h3>مقدار الضريبة:</h3><p>${taxAmount.toFixed(4)}</p>`;
                tafqitText = tafqit(amountBeforeTax) + "<br>" + tafqit(taxAmount);
                break;
            case "extractAndSubtractTax":
                const amountBeforeTaxExtract = amount / (1 + percentage / 100);
                const taxExtractAmount = amount - amountBeforeTaxExtract;
                resultDiv.innerHTML = `<h3>المبلغ قبل الضريبة:</h3><p>${amountBeforeTaxExtract.toFixed(4)}</p>
                                       <h3>مقدار الضريبة:</h3><p>${taxExtractAmount.toFixed(4)}</p>`;
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

    // دالة تفقيط احترافية للريال والهللة
    function tafqit(num) {
        if (isNaN(num)) return "";
        num = Number(num).toFixed(2);
        let [intPart, decPart] = num.split('.');
        intPart = parseInt(intPart);
        decPart = parseInt(decPart);
        // دوال الأرقام
        const units = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
        const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
        const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
        const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
        const scales = ["", "ألف", "مليون", "مليار"];

        function chunkToWords(chunk) {
            let words = [];
            let h = Math.floor(chunk / 100);
            let t = chunk % 100;
            if (h > 0) words.push(hundreds[h]);
            if (t > 0) {
                if (t < 10) words.push(units[t]);
                else if (t < 20) words.push(teens[t - 10]);
                else {
                    let u = t % 10;
                    let d = Math.floor(t / 10);
                    if (u > 0) words.push(units[u]);
                    words.push(tens[d]);
                }
            }
            return words.join(" و ");
        }

        function getScaleWord(chunk, scaleIdx) {
            if (scaleIdx === 0) return "";
            if (chunk === 1) return scales[scaleIdx];
            if (chunk === 2) return scales[scaleIdx] + "ان";
            if (chunk >= 3 && chunk <= 10) return scales[scaleIdx] + "ات";
            return scales[scaleIdx];
        }

        let parts = [];
        let i = 0;
        let tempInt = intPart;
        while (tempInt > 0 && i < scales.length) {
            let chunk = tempInt % 1000;
            if (chunk > 0) {
                let chunkWords = chunkToWords(chunk);
                let scaleWord = getScaleWord(chunk, i);
                if (scaleWord) {
                    if (chunk === 1) {
                        chunkWords = scaleWord;
                    } else if (chunk === 2) {
                        chunkWords = scaleWord + "ان";
                    } else if (chunk >= 3 && chunk <= 10) {
                        chunkWords += " " + scaleWord + "ات";
                    } else {
                        chunkWords += " " + scaleWord;
                    }
                }
                parts.unshift(chunkWords.trim());
            }
            tempInt = Math.floor(tempInt / 1000);
            i++;
        }
        let rialText = parts.join(" و ");
        // قواعد الجمع والمثنى والمفرد للريال
        if (intPart === 1) rialText += " ريال";
        else if (intPart === 2) rialText += " ريالان";
        else if (intPart >= 3 && intPart <= 10) rialText += " ريالات";
        else if (intPart > 10) rialText += " ريال";

        let hellahText = "";
        if (decPart && decPart > 0) {
            let hellahWords = chunkToWords(decPart);
            if (decPart === 1) hellahText = hellahWords + " هللة";
            else if (decPart === 2) hellahText = hellahWords + " هللتان";
            else if (decPart >= 3 && decPart <= 10) hellahText = hellahWords + " هللات";
            else hellahText = hellahWords + " هللة";
        }

        if (rialText && hellahText) {
            return rialText + " و " + hellahText;
        } else if (rialText) {
            return rialText;
        } else if (hellahText) {
            return hellahText;
        } else {
            return "صفر";
        }
    }

    validateInputs();
});

/******/ })()
;
//# sourceMappingURL=bundle.js.map