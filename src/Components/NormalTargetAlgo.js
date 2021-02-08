export default function NormalTargetAlgo(expectedValue,actualValue,harshness,test,range) {
    let standardDev = range / harshness;
    if (standardDev < 1 && standardDev > -1) {
        standardDev = 1;
    }
    if (harshness === 0) {
        harshness = 0.1;
    }
    if (test) {
        let result = 1 / (standardDev * Math.sqrt(2 * Math.PI));
        if (result === 0) {
            return 0.0001;
        }
        return result;
    }
    let firstTerm = 1 / (standardDev * Math.sqrt(2 * Math.PI));
    let secondTerm = -Math.pow((actualValue - expectedValue), 2) / (2 * Math.pow(standardDev, 2));
    let multiplier = 1 / (NormalTargetAlgo(expectedValue, expectedValue, harshness, true,range));
    return multiplier*firstTerm*Math.exp(secondTerm);
}