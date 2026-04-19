function getBestGate(gates) {
    let bestGate = null;
    let minWait = Infinity;

    for (let gate in gates) {
        if (gates[gate].waitTime < minWait) {
            minWait = gates[gate].waitTime;
            bestGate = gate;
        }
    }

    return {
        gate: bestGate,
        reason: `Lowest wait time of ${minWait} minutes`
    };
}

function getBestStall(stalls) {
    let best = null;
    let min = Infinity;

    for (let s in stalls) {
        if (stalls[s].waitTime < min) {
            min = stalls[s].waitTime;
            best = s;
        }
    }

    return {
        stall: best,
        reason: `Shortest queue (${min} mins)`
    };
}

module.exports = { getBestGate, getBestStall };