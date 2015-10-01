/* File to be uploaded */
var selectedFile = document.getElementById("inputFile");
/* Area in which to display file data */
var displayArea = document.getElementById("displayArea");
selectedFile.addEventListener("change", handleFile, false);

function handleFile() {
    // var file = this.file;
    var file = selectedFile.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var text = reader.result;
        displayArea.innerText = text;
        //console.log(text);
        //console.log(text.length)
        var description = {};
        var data = {};
        var cols = [];
        // split on new line to find all rows
        var rows = text.split('\n');
        // remove commas within quotes text
        console.log("There are: " + rows.length + " rows.");
        // go through each row
        for (var m = 0; m < rows.length; rows++){

        }
        // split on each comma to find all columns
        for (var i = 0; i < rows.length; i++){
            cols[i] = rows[i].split(',');
        }
        console.log(cols[0].length);
        console.log(cols[1][400]);
        console.log(cols[1].length);
    };
    // UTF-8 default encoding
    reader.readAsText(file);
}