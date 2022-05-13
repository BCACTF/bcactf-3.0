window.onload = function () {
    const linkdiv = document.getElementById("link");
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    if (searchParams.get("query") !== null) {
        linkdiv.innerHTML = "Link to a this query (pre-filled): <a href=\"?query=" + searchParams.get("query") + "\">(link)</a>";
        document.getElementById("query").value = searchParams.get("query");
    }
}