/**
 * Preprocesses prompt for chatGPT based on state of page 
 * @param {string} input 
 */
function prepareNLPHint(input) {

    const [selection, action, expectedInput, studentInput] = input.split(","); 
    const prompt = 
        `You are a teacher for middle school math students.
        Your student is attempting to add 1/4 to 1/6. To do so, they must first convert the fractions to equivalent fractions with common denominators.
        
        Right now, the student needs to convert the ${selection.includes("Num") ? "numerator" : "denominator"} of ${selection == "firstDenConv" || selection == "firstNumConv" ? "1/4" : "1/6"} to ${expectedInput}.
        
        Give a concise piece of feedback to the student to point them in the right direction, without revealing the answer. Use the second person tense in your response.`;

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

