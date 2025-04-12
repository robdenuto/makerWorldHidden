// ==UserScript==
// @name         Display Hidden Model IDs on MakerWorld Collections
// @namespace    https://github.com/robdenuto/makerWorldHidden/
// @version      0.3
// @description  Displays hidden model IDs from MakerWorld collection pages as hyperlinks
// @author       robdenuto
// @match        https://makerworld.com/*/collections/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script started.");

    // Step 1: Locate __NEXT_DATA__
    const nextDataScript = document.getElementById("__NEXT_DATA__");
    if (!nextDataScript) {
        console.log("No __NEXT_DATA__ script found.");
        return;
    }
    console.log("Found __NEXT_DATA__ script:", nextDataScript);

    // Step 2: Parse JSON
    let nextData;
    try {
        nextData = JSON.parse(nextDataScript.textContent);
        console.log("Parsed __NEXT_DATA__:", nextData);
    } catch (e) {
        console.error("Failed to parse __NEXT_DATA__:", e);
        return;
    }

    // Step 3: Recursive function to find hidden data
    function findHiddenData(obj) {
        if (typeof obj !== 'object' || obj === null) return null;
        // Check if the object has hiddenCnt > 0 and hiddenIds as an array
        if ('hiddenCnt' in obj && obj.hiddenCnt > 0 && Array.isArray(obj.hiddenIds)) {
            return { hiddenCnt: obj.hiddenCnt, hiddenIds: obj.hiddenIds };
        }
        // Recursively search all properties
        for (const key in obj) {
            const result = findHiddenData(obj[key]);
            if (result) return result;
        }
        return null;
    }

    // Step 4: Search for hidden data
    const hiddenData = findHiddenData(nextData);
    if (!hiddenData) {
        console.log("No hidden data (with hiddenCnt > 0 and hiddenIds) found in __NEXT_DATA__.");
        console.log("Entire pageProps for inspection:", nextData.props.pageProps);
        return;
    }
    console.log("Found hiddenData:", hiddenData);

    const hiddenCnt = hiddenData.hiddenCnt;
    const hiddenIds = hiddenData.hiddenIds;
    console.log("hiddenCnt:", hiddenCnt);
    console.log("hiddenIds:", hiddenIds);

    // Step 5: Create display element
    console.log("Creating display element.");
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.right = "10px";
    container.style.backgroundColor = "#242424";
    container.style.padding = "10px";
    container.style.border = "1px solid black";
    container.style.zIndex = "1000";

    const title = document.createElement("p");
    title.textContent = "Hidden Model IDs:";
    container.appendChild(title);

    const list = document.createElement("ul");
    hiddenIds.forEach(id => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `https://www.google.com/search?q=makerworld+${id}`;
        a.textContent = id;
        a.target = "_blank";
        li.appendChild(a);
        list.appendChild(li);
    });
    container.appendChild(list);

    // Step 6: Append to page
    document.body.appendChild(container);
    console.log("Appended display element to body.");
    console.log("Scraping complete, found IDs:", hiddenIds.join(", "));
})();
