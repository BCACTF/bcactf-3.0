window.onload = function () {
    var worker = new Worker("worker.sql-wasm.js");

    worker.postMessage({ action: 'open' });

    const linkdiv = document.getElementById("link");
    const sdiv = document.getElementById("s");
    const resdiv = document.getElementById("results");
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    if (searchParams.get("query") !== null) {
        let query = searchParams.get("query");
        linkdiv.innerHTML = "Link to this query: <a href=\"?query=" + query + "\">(link)</a>";
        sdiv.innerHTML = "Your results are as follows:";
        resdiv.innerHTML = "Loading...";
        document.getElementById("query").value = query;
        worker.onmessage = function (event) {
            var results = event.data.results;
            if (!results) {
                resdiv.innerHTML = "<b>ERROR:</b> " + event.data.error;
                return;
            }

            resdiv.innerHTML = "";
            for (var i = 0; i < results.length; i++) {
                resdiv.appendChild(tableCreate(results[i].columns, results[i].values));
            }
        }
        fetch('sql.db')
            .then(response => response.arrayBuffer())
            .then(buf => worker.postMessage({ action: 'open', buffer: buf }, [buf]))
            .then(() => worker.postMessage({ action: 'exec', sql: query }));

    }
}

var tableCreate = function () {
    function valconcat(vals, tagName) {
        if (vals.length === 0) return '';
        var open = '<' + tagName + '>', close = '</' + tagName + '>';
        return open + vals.join(close + open) + close;
    }
    return function (columns, values) {
        var tbl = document.createElement('table');
        var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
        var rows = values.map(function (v) { return valconcat(v, 'td'); });
        html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
        tbl.innerHTML = html;
        return tbl;
    }
}();

/* bunch of code copied from sql.js, which has the following license:

MIT license
===========

Copyright (c) 2017 sql.js authors (see AUTHORS)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/