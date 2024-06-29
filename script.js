function loadData(type) {
  // Clear existing table data
  const tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = "";

  // Determine which CSV file to load based on type
  let filename;
  switch (type) {
    case "crpc":
      filename = "data/crpc.csv";
      break;
    case "ipc":
      filename = "data/ipc.csv";
      break;
    case "evidence":
      filename = "data/evidence.csv";
      break;
    default:
      return; // Exit function if unknown type
  }

  // Fetch the CSV file
  fetch(filename)
    .then((response) => response.text())
    .then((data) => {
      // Parse CSV data
      const rows = data.split("\n");
      const headers = rows[0].split(",");

      // Create table element
      const table = document.createElement("table");
      table.classList.add("data-table");

      // Create header row
      const headerRow = document.createElement("tr");
      headers.forEach((headerText) => {
        const headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
      });
      table.appendChild(headerRow);

      // Create data rows
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(",");
        if (rowData.length === headers.length) {
          const row = document.createElement("tr");
          rowData.forEach((cellData) => {
            const cell = document.createElement("td");
            cell.textContent = cellData;
            row.appendChild(cell);
          });
          table.appendChild(row);
        }
      }

      // Append table to container
      tableContainer.appendChild(table);
    })
    .catch((error) => {
      console.error("Error fetching or parsing data:", error);
    });

  // Update active state of navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));
  document.querySelector(`.nav-link.${type}`).classList.add("active");
}

function filterTable() {
  const input = document.getElementById("searchInput").value.toUpperCase();
  const table = document.querySelector(".data-table");
  const rows = table.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    let found = false;
    cells.forEach((cell) => {
      if (cell.textContent.toUpperCase().indexOf(input) > -1) {
        found = true;
      }
    });
    if (found) {
      row.style.display = ""; // Show the row
    } else {
      row.style.display = "none"; // Hide the row
    }
  });

  // Ensure table headers remain visible
  const headerRow = table.querySelector("tr");
  if (headerRow) {
    headerRow.style.display = ""; // Show the header row
  }
}

// Default to load CRPC data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadData("crpc");
});
// Event listener to filter table dynamically on each keystroke
document.getElementById("searchInput").addEventListener("input", filterTable);
