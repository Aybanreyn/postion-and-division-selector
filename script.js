const sheetID = "1_yEfgCYoDTfJUU6wLP0V3SEsbuJmGQuMMJHUBYH69FM";
const sheetName = "Sheet1"; // adjust if needed
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

let dataRows = [];

const positionSelect = document.getElementById("positionSelect");
const divisionSelect = document.getElementById("divisionSelect");
const submitBtn = document.getElementById("submitBtn");

fetch(url)
  .then(res => res.text())
  .then(rep => {
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    const rows = jsonData.table.rows;

    rows.slice(1).forEach(row => { // skip header
      const position = row.c[0]?.v || "";
      const division = row.c[1]?.v || "";
      const link = row.c[2]?.v || "";

      dataRows.push({ position, division, link });
    });

    const uniquePositions = [...new Set(dataRows.map(row => row.position))];
    uniquePositions.forEach(pos => {
      const opt = document.createElement("option");
      opt.value = pos;
      opt.textContent = pos;
      positionSelect.appendChild(opt);
    });
  });

positionSelect.addEventListener("change", () => {
  const selectedPos = positionSelect.value;
  divisionSelect.innerHTML = '<option value="">Select Division</option>';

  if (selectedPos) {
    divisionSelect.disabled = false;
    const filteredDivs = dataRows
      .filter(row => row.position === selectedPos)
      .map(row => row.division);

    const uniqueDivs = [...new Set(filteredDivs)];

    uniqueDivs.forEach(div => {
      const opt = document.createElement("option");
      opt.value = div;
      opt.textContent = div;
      divisionSelect.appendChild(opt);
    });
  } else {
    divisionSelect.disabled = true;
  }
});

submitBtn.addEventListener("click", () => {
  const selectedPos = positionSelect.value;
  const selectedDiv = divisionSelect.value;

  const match = dataRows.find(row => row.position === selectedPos && row.division === selectedDiv);

  if (match && match.link) {
    window.open(match.link, "_blank");
  } else {
    alert("No form found for the selected position and division.");
  }
});
