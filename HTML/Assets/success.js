/**
 * Creates prompt for success feedback and prepares openai post body
 * @param {*} input selection,action,expectedInput,studentInput
 * @returns post body for openai
 */
function prepareNLPSuccess (input) {
    const [selection, action, expectedInput, studentInput] = input.split(","); 
    const prompt = 
        `You are a teacher for middle school math students.
        Your student is attempting to add 1/4 to 1/6. To do so, they must first convert the fractions to equivalent fractions with common denominators.
        
        The student converted the ${selection.includes("Num") ? "numerator" : "denominator"} of ${selection == "firstDenConv" || selection == "firstNumConv" ? "1/4" : "1/6"} to ${expectedInput}, which is correct.
        However, they converted the denominator to ${studentInput} instead of ${expectedInput}, which is incorrect.
        
        Give a concise piece of feedback to the student to point out that they good job and affirm their thought process.`;

    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt}
        ],
        temperature: 0.7,
    };
    return(JSON.stringify(data))
}
