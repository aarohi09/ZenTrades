document.addEventListener('DOMContentLoaded', function () {
    const displayHandlingSelect = document.getElementById('displayHandling');
    const addBtn = document.getElementById('addBtn');
    const removeBtn = document.getElementById('removeBtn');
    const productTable = document.getElementById('productTable');

    let availableFields = ['subcategory', 'title', 'price', 'popularity'];
    let selectedFields = [];

    // Initialize display handling options
    availableFields.forEach(field => {
        const option = document.createElement('option');
        option.value = field;
        option.textContent = field;
        displayHandlingSelect.appendChild(option);
    });

    addBtn.addEventListener('click', function () {
        moveOptions(displayHandlingSelect, selectedFields, availableFields);
        updateTable();
    });

    removeBtn.addEventListener('click', function () {
        moveOptions(displayHandlingSelect, availableFields, selectedFields);
        updateTable();
    });

    function moveOptions(select, sourceArray, destinationArray) {
        const selectedOptions = Array.from(select.selectedOptions);

        selectedOptions.forEach(option => {
            const index = sourceArray.indexOf(option.value);
            if (index !== -1) {
                sourceArray.splice(index, 1);
                destinationArray.push(option.value);
            }
        });

        sourceArray.sort();
        destinationArray.sort();

        refreshDisplayHandlingOptions();
    }

    function refreshDisplayHandlingOptions() {
        displayHandlingSelect.innerHTML = '';

        availableFields.forEach(field => {
            const option = document.createElement('option');
            option.value = field;
            option.textContent = field;
            displayHandlingSelect.appendChild(option);
        });

        selectedFields.forEach(field => {
            const option = document.createElement('option');
            option.value = field;
            option.textContent = field;
            option.selected = true;
            displayHandlingSelect.appendChild(option);
        });
    }

    function updateTable() {
        // Fetch and parse JSON data from the API
        fetch('https://s3.amazonaws.com/open-to-cors/assignment.json')
            .then(response => response.json())
            .then(data => {
                // Sort data based on descending popularity
                data.sort((a, b) => b.popularity - a.popularity);

                // Generate table headers
                const tableHeaders = '<tr>' + selectedFields.map(field => `<th>${field}</th>`).join('') + '</tr>';

                // Generate table rows
                const tableRows = data.map(product => {
                    return '<tr>' + selectedFields.map(field => `<td>${product[field]}</td>`).join('') + '</tr>';
                }).join('');

                // Display table
                productTable.innerHTML = tableHeaders + tableRows;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Initial table update
    updateTable();
});
