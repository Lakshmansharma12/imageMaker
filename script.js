document.getElementById("quality").addEventListener("input", function () {
    document.getElementById("quality-value").textContent = this.value;
});

const dropZone = document.getElementById("drop-zone");
const uploadInput = document.getElementById("upload");
const downloadBtn = document.getElementById("download");

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.background = "#e9f5ff";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.background = "#ffffff";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.background = "#ffffff";
    handleFile(e.dataTransfer.files[0]);
});

uploadInput.addEventListener("change", (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file) return;

    const fileType = file.type;
    
    if (fileType.startsWith("image/")) {
        compressImage(file);
    } else if (fileType === "application/pdf") {
        compressPDF(file);
    } else {
        alert("Unsupported file format! Please upload an image or PDF.");
    }
}

// Image Compression
function compressImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = function () {
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const quality = parseFloat(document.getElementById("quality").value);
            canvas.toBlob(function (blob) {
                createDownload(blob, "compressed-image.jpg");
            }, "image/jpeg", quality);
        };
    };
}

// PDF Compression
async function compressPDF(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = async function (event) {
        const pdfDoc = await PDFLib.PDFDocument.load(event.target.result);
        const compressedPDF = await pdfDoc.save({ useObjectStreams: false });

        createDownload(new Blob([compressedPDF], { type: "application/pdf" }), "compressed-document.pdf");
    };
}

// Create Download Link
function createDownload(blob, fileName) {
    const url = URL.createObjectURL(blob);
    downloadBtn.classList.remove("d-none");
    downloadBtn.onclick = function () {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
    };
}
