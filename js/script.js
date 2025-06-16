const sheetID = "1_yEfgCYoDTfJUU6wLP0V3SEsbuJmGQuMMJHUBYH69FM";
const sheetName = "TARGET-SHEET";

const positionSelect = document.getElementById("positionSelect");
const divisionSelect = document.getElementById("divisionSelect");
const submitBtn = document.getElementById("submitBtn");

let dataRows = [];

document.addEventListener("DOMContentLoaded", () => {
  const query = "SELECT A, B, C"; // Position, Division, Link
  const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tq=${encodeURIComponent(query)}&sheet=${sheetName}`;

  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      const rows = jsonData.table.rows;

      dataRows = [];

      rows.forEach(row => {
        const position = row.c[0]?.v?.toString().trim() || "";
        const division = row.c[1]?.v?.toString().trim() || "";
        const link = row.c[2]?.v?.toString().trim() || "";

        if (position && division && link) {
          dataRows.push({ position, division, link });
        }
      });

      const uniquePositions = [...new Set(dataRows.map(r => r.position))];

      uniquePositions.forEach(pos => {
        const opt = document.createElement("option");
        opt.value = pos;
        opt.textContent = pos;
        positionSelect.appendChild(opt);
      });

      positionSelect.disabled = false;
    })
    .catch(err => {
      console.error("Error loading data:", err);
    });
});

positionSelect.addEventListener("change", () => {
  const selectedPosition = positionSelect.value;
  divisionSelect.innerHTML = '<option value="">Select Division</option>';
  submitBtn.disabled = true;

  if (!selectedPosition) {
    divisionSelect.disabled = true;
    return;
  }

  const filteredDivisions = dataRows
    .filter(r => r.position === selectedPosition)
    .map(r => r.division);

  const uniqueDivisions = [...new Set(filteredDivisions)];

  uniqueDivisions.forEach(div => {
    const opt = document.createElement("option");
    opt.value = div;
    opt.textContent = div;
    divisionSelect.appendChild(opt);
  });

  divisionSelect.disabled = false;
});

divisionSelect.addEventListener("change", () => {
  submitBtn.disabled = !divisionSelect.value;
});

submitBtn.addEventListener("click", () => {
  const pos = positionSelect.value;
  const div = divisionSelect.value;

  const match = dataRows.find(
    r => r.position === pos && r.division === div
  );

  if (match && match.link) {
    window.open(match.link, "_blank");
  } else {
    alert("No form found for the selected position and division.");
  }
});
