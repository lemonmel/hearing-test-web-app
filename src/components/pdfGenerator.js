// import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

export async function generatePDF(result) {
    const nh_range = {
        500: { min: 15.3, max: 24.5 },
        1000: { min: 18.3, max: 29.7 },
        2000: { min: 23.89, max: 34.61 },
        4000: { min: 27.05, max: 40.57 },
        8000: { min: 23.5, max: 40.22 },
    };

    const date = result.date.toString()
    const side = result.side.charAt(0).toUpperCase() + result.side.slice(1)
    const username = result.username
    const FS = result.FS
    const narrowband = result.narrowband
    const notched = result.notched
    const status = result.status.charAt(0).toUpperCase() + result.status.slice(1)


    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
        table {
        border-collapse: collapse;
        width: 100%;
        }
        td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        }
        .center {
            text-align: center
        }
        </style>
    </head>
    <body style="font-family: Helvetica Neue; padding: 40px">
        <h2 class="center"> Frequency Selectivity Screening Result</h2>
        <h5 class="mt-3"> 1. User Details </h5>
        <table>
        <tr>
            <td>User</td>
            <td>${username}</td>
        </tr>
        <tr>
            <td>Contact</td>
            <td>${result.email}</td>
        </tr>
        <tr>
            <td>Exposed Environment</td>
            <td>${result.environment}</td>
        </tr>
        <tr>
            <td>Hearing Duration/Week</td>
            <td>${result.frequency}</td>
        </tr>
        <tr>
            <td>Hearing Volume</td>
            <td>${result.environment}</td>
        </tr>
        </table>
        <br/>
        <h5> 2. Test Details </h5>
        <table>
        <tr>
            <td>Date of Test</td>
            <td>${date}</td>
        </tr>
        <tr>
            <td>Test Side</td>
            <td>${side}</td>
        </tr>
        <tr>
            <td>Overall Result</td>
            <td>${status}</td>
        </tr>
        </table>
        <br/>
        <table>
        <tr>
            <th>Frequency</th>
            <th>Narrowband Reading</th>
            <th>Notched Reading</th>
            <th>FS Reading</th>
            <th>Status</th>
        </tr>
`

    Object.keys(FS).forEach((key, index) => {
        let value = FS[key]
        let normality = 'Normal'
        if(value > nh_range[key].max || value < nh_range[key].min){
            normality = 'Abnormal'
        }
        html +=
        `<tr>
        <td>`+key+`</td>
        <td>`+narrowband[key].toFixed(2)+`</td>
        <td>`+notched[key].toFixed(2)+`</td>
        <td>`+value.toFixed(2)+`</td>
        <td>`+normality+`</td>
        </tr>`
    })
    
    html = html + 
    `</table>
    </body>
    </html>
    `

    const element = document.createElement('div');
    element.innerHTML = html;

    html2pdf(element, {
        margin: 20, // Adjust margins as needed
        filename: username+'-testResult.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).then(pdf => {
        console.log("hello")
        const blob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
        const blobURL = URL.createObjectURL(blob);
        window.open(blobURL, '_blank');
    });
    
}

