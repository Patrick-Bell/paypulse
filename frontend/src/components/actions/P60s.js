import { FaDownload, FaEye, FaPrint } from "react-icons/fa";
import '../../styles/Payslips.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function P60s({ id, year }) {
    const viewP60 = () => {
        const width = 500; // Width of the preview window
        const height = 500; // Height of the preview window
        const left = (window.innerWidth - width) / 2;
        const top = 0; // Position at the top of the viewport

        window.open(`/p60/${id}`, 'payslipWindow', `width=${width},height=${height},top=${top},left=${left}`);
    };

    const downloadP60 = () => {
        const pdfWidth = 594;  // Adjust A4 width in mm for smaller size
        const pdfHeight = 841; // Adjust A4 height in mm for smaller size
        const scale = 4; // Adjust scaling factor

        // Open the payslip detail page in a new window
        const newWindow = window.open(`/p60/${id}`, 'payslipWindow', 'width=1000,height=800');

        if (newWindow) {
            newWindow.onload = () => {
                const doc = newWindow.document;

                const interval = setInterval(() => {
                    if (doc.body.innerHTML) {
                        clearInterval(interval);

                        // Temporarily hide unwanted elements
                        const unwantedElements = doc.querySelectorAll('script, noscript');
                        unwantedElements.forEach(el => el.style.display = 'none');

                        // Capture the content
                        html2canvas(doc.body, { scale, useCORS: true }).then((canvas) => {
                            const imgData = canvas.toDataURL('image/png');

                            // Create PDF with dimensions in mm
                            const pdf = new jsPDF({
                                unit: 'mm',
                                format: [pdfWidth, pdfHeight]
                            });

                            // Calculate dimensions to fit the content on the PDF
                            const imgWidth = pdfWidth; // Use PDF width
                            const imgHeight = (canvas.height * imgWidth) / canvas.width;

                            // Adjust for image height exceeding PDF height
                            if (imgHeight > pdfHeight) {
                                const scaleRatio = pdfHeight / imgHeight;
                                imgWidth *= scaleRatio;
                                imgHeight = pdfHeight;
                            }

                            // Center the image on the PDF
                            const x = (pdfWidth - imgWidth) / 2;
                            const y = 0;

                            // Add the image to the PDF
                            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

                            // Save the PDF
                            pdf.save(`p60-${year}.pdf`);

                            // Restore hidden elements
                            unwantedElements.forEach(el => el.style.display = '');

                            // Close the new window
                            newWindow.close();
                        }).catch((error) => {
                            console.error('Failed to capture content', error);
                            newWindow.close();
                        });
                    }
                }, 100);
            };
        } else {
            console.error('Failed to open new window');
        }
    };


    return (
        <>
            <div className="payslip-container">
                <div className="payslip-card">
                    <p><strong>{year}</strong></p>
                    <div>
                        <span>
                            <FaDownload onClick={downloadP60} />
                        </span>
                        <span>
                            <FaPrint />
                        </span>
                        <span>
                            <FaEye onClick={viewP60} />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default P60s;
