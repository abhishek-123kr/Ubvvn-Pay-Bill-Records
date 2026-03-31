

function formatNumber(value) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });
}

const saZeroNames = [
  "PURAN CHAND",
  "HARISH NAUTIYAL",
  "UPENDRA RANA",
  "VED PRAKASH"
];

const employees = [
  { sn: 1, name: "SUHAIL AHMED", desg: "ACCOUNTANT", basic: 47600, gradePay: 4200, gis: 51.16, pt: 200, tds: 0 },
  { sn: 2, name: "PRAKASH THAPLIYAL", desg: "ACCOUNTANT", basic: 47600, gradePay: 4200, gis: 51.16, pt: 200, tds: 0 },
  { sn: 3, name: "DIGAMBAR SAJWAN", desg: "ASSISTANT ACCOUNTANT", basic: 45400, gradePay: 2800, gis: 51.16, pt: 200, tds: 0 },
  { sn: 4, name: "GOVIND SHAH", desg: "SENIOR ASSISTANT", basic: 31400, gradePay: 2400, gis: 51.16, pt: 200, tds: 0 },
  { sn: 5, name: "KUNDAN SINGH RAWAT", desg: "SENIOR ASSISTANT", basic: 30500, gradePay: 2400, gis: 51.16, pt: 200, tds: 0 },
  { sn: 6, name: "DIGAMBAR SINGH", desg: "ASST. GR.", basic: 30200, gradePay: 2000, gis: 51.16, pt: 200, tds: 0 },
  { sn: 7, name: "NEETA GOPAL", desg: "ASST. GR.", basic: 30200, gradePay: 2000, gis: 51.16, pt: 200, tds: 0 },
  { sn: 8, name: "PURAN CHAND", desg: "DRIVER", basic: 30200, gradePay: 2000, gis: 51.16, pt: 200, tds: 0 },
  { sn: 9, name: "HARISH NAUTIYAL", desg: "DRIVER", basic: 30200, gradePay: 2000, gis: 51.16, pt: 200, tds: 0 },
  { sn: 10, name: "UPENDRA RANA", desg: "DRIVER", basic: 30200, gradePay: 2000, gis: 51.16, pt: 200, tds: 0 },
  { sn: 11, name: "VED PRAKASH", desg: "PEON", basic: 24200, gradePay: 1800, gis: 51.16, pt: 200, tds: 0 }
];

function getSA(name) {
  return saZeroNames.includes(name) ? 0 : 1200;
}

function calculateEmployee(emp) {
  const basic = Number(emp.basic) || 0;
  const gradePay = Number(emp.gradePay) || 0;
  const gis = Number(emp.gis) || 0;
  const tds = Number(emp.tds) || 0;

  const da = basic * 0.58;
  const hda = gradePay * 0.10;
  const hra = hda * 7.5;
  const ma = 30;
  const sa = getSA(emp.name);
  const epfa = 550;
  const epsa = 1250;

  const grossTotal = basic + da + hda + ma + sa + hra + epfa + epsa;

  const epfDeduction = 2350;
  const fps = 1250;

  const totalDeduction = gis + tds + epfDeduction + fps;
  const netSalary = grossTotal - totalDeduction;

  return { basic, da, hda, ma, sa, hra, epfa, epsa, grossTotal, gis, tds, epfDeduction, fps, totalDeduction, netSalary };
}

function renderTable() {
  const body = document.getElementById("salaryBody");
  const foot = document.getElementById("salaryFoot");

  body.innerHTML = "";
  foot.innerHTML = "";

  const totals = { basic:0, da:0, hda:0, ma:0, sa:0, hra:0, epfa:0, epsa:0, grossTotal:0, gis:0, tds:0, epfDeduction:0, fps:0, totalDeduction:0, netSalary:0 };

  employees.forEach((emp, index) => {
    const calc = calculateEmployee(emp);

    Object.keys(totals).forEach(k => totals[k] += calc[k] || 0);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.sn}</td>
      <td class="name-col">${emp.name}</td>
      <td class="desg-col">${emp.desg}</td>
      <td>${formatNumber(emp.gradePay)}</td>

      <td><input type="number" value="${emp.basic}" onchange="updateBasic(${index}, this.value)" /></td>
      <td>${formatNumber(calc.da)}</td>
      <td>${formatNumber(calc.hda)}</td>
      <td>${formatNumber(calc.ma)}</td>
      <td>${formatNumber(calc.sa)}</td>
      <td>${formatNumber(calc.hra)}</td>
      <td>${formatNumber(calc.epfa)}</td>
      <td>${formatNumber(calc.epsa)}</td>
      <td>${formatNumber(calc.grossTotal)}</td>

      <td>${formatNumber(calc.gis)}</td>
      <td><input type="number" value="${emp.tds}" onchange="updateTDS(${index}, this.value)" /></td>
      <td>${formatNumber(calc.epfDeduction)}</td>
      <td>${formatNumber(calc.fps)}</td>
      <td>${formatNumber(calc.totalDeduction)}</td>
      <td>${formatNumber(calc.netSalary)}</td>
    `;
    body.appendChild(row);
  });

  foot.innerHTML = `
    <tr>
      <td colspan="4"><strong>TOTAL</strong></td>
      ${Object.values(totals).map(v => `<td>${formatNumber(v)}</td>`).join("")}
    </tr>
  `;
}

function updateBasic(i,v){ employees[i].basic = Number(v)||0; renderTable(); }
function updateTDS(i,v){ employees[i].tds = Number(v)||0; renderTable(); }

renderTable();


// ✅ PDF DOWNLOAD FUNCTION
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const element = document.getElementById("bill");

  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");

    const imgWidth = 297;
    const pageHeight = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("UBVVN_PayBill.pdf");
  });
}
