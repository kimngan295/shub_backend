const axios = require("axios");

async function getInputData() {
    try {
        const response = await axios.get(
            "https://test-share.shub.edu.vn/api/intern-test/input",
            { timeout: 5000 },
        );
        return response.data;
    } catch (error) {
        throw new Error(
            "Error retrieving data from API input: " + error.message,
        );
    }
}

function createPrefixSums(data) {
    const n = data.length;
    const prefixSum = new Array(n + 1).fill(0);
    const alternatePrefixSum = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + data[i];
        alternatePrefixSum[i + 1] =
            alternatePrefixSum[i] + (i % 2 === 0 ? data[i] : -data[i]);
    }

    return { prefixSum, alternatePrefixSum };
}

function handleQueryType1(prefixSum, l, r) {
    return prefixSum[r + 1] - prefixSum[l];
}

function handleQueryType2(data, l, r) {
    let alternatePrefixSum = [0];
    for (let i = 0; i < data.length; i++) {
        let value = data[i];
        if (i % 2 === 1) {
            value = -value;
        }
        alternatePrefixSum.push(alternatePrefixSum[i] + value);
    }

    if (l > r) {
        [l, r] = [r, l];
    }

    let result = alternatePrefixSum[r + 1] - alternatePrefixSum[l];
    return result;
}

async function sendOutputData(result, token) {
    try {
        if (!token) {
            throw new Error("Invalid token!");
        }
        if (!Array.isArray(result)) {
            throw new Error("The calculated result is not array!");
        }

        const response = await axios.post(
            "https://test-share.shub.edu.vn/api/intern-test/output",
            result,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            },
        );

        if (response.status === 200) {
            console.log("Result has been successfully sent!");
        } else {
            throw new Error(`Error sending result: ${response.status}`);
        }
    } catch (error) {
        console.error(
            "An error occurred while sending the result:",
            error.message,
        );
    }
}

async function solve() {
    try {
        const { token, data, query } = await getInputData();
        const { prefixSum, alternatePrefixSum } = createPrefixSums(data);

        const result = query.map(({ type, range }) => {
            const [l, r] = range;
            return type === "1"
                ? handleQueryType1(prefixSum, l, r)
                : handleQueryType2(alternatePrefixSum, l, r);
        });

        await sendOutputData(result, token);
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

solve();
