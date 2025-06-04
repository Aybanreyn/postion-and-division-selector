const sheetID = "1_yEfgCYoDTfJUU6wLP0V3SEsbuJmGQuMMJHUBYH69FM";

const levelSelect = document.getElementById("levelSelect");
const positionSelect = document.getElementById("positionSelect");
const divisionSelect = document.getElementById("divisionSelect");
const submitBtn = document.getElementById("submitBtn");

let dataRows = [];

levelSelect.addEventListener("change", () => {
  const selectedLevel = levelSelect.value;
  positionSelect.innerHTML = '<option value="">Select Position</option>';
  divisionSelect.innerHTML = '<option value="">Select Division</option>';
  divisionSelect.disabled = true;
  submitBtn.disabled = true;

  if (!selectedLevel) {
    positionSelect.disabled = true;
    return;
  }

  positionSelect.disabled = false;

  const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${encodeURIComponent(selectedLevel)}`;

  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      const rows = jsonData.table.rows;

      dataRows = [];

      rows.slice(1).forEach(row => {
        const position = row.c[0]?.v || "";
        const division = row.c[1]?.v || "";
        const link = row.c[2]?.v || "";

        dataRows.push({ position, division, link });
      });

      // Get unique positions
      const uniquePositions = [...new Set(dataRows.map(r => r.position))];

      uniquePositions.forEach(pos => {
        const opt = document.createElement("option");
        opt.value = pos;
        opt.textContent = pos;
        positionSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load data for the selected level.");
      positionSelect.disabled = true;
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

  divisionSelect.disabled = false;

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
